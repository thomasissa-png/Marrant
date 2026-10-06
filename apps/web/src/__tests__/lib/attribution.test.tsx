/**
 * Attribution réseau → site (v5 §2.3 et §2.5) : listes blanches `origine` et
 * `contenu`, UTM d'arrivée prioritaire, propriétés ajoutées aux événements
 * Umami du tunnel sans toucher aux propriétés existantes.
 */
import {
  CONTENUS,
  EMPTY_ATTRIBUTION,
  attributionProps,
  captureAttribution,
  readStoredAttribution,
  resolveAttribution,
  sanitizeContenu,
  sanitizeOrigine,
} from "@/lib/attribution";
import { ATTRIBUTED_EVENTS, trackUmami } from "@/lib/umami";
import { render } from "@testing-library/react";
import { AttributionCapture } from "@/components/analytics/attribution-capture";

jest.mock("next/navigation", () => ({ usePathname: () => "/blog/mon-article" }));

describe("listes blanches", () => {
  it.each(["x", "instagram", "linkedin"])("origine %s acceptée", (v) => expect(sanitizeOrigine(v)).toBe(v));

  it.each(["facebook", "X", "Instagram", "twitter", "", "x ", "jean@test.fr", null, undefined])(
    "origine %p refusée",
    (v) => expect(sanitizeOrigine(v)).toBeNull(),
  );

  it("contenu : exactement la liste du tableau v5 §2", () => {
    expect([...CONTENUS]).toEqual([
      "lundi", "jeudi", "quiz", "saison", "relais",
      "bio-article", "bio-quiz", "bio-vanne", "bio-parcours", "bio-vannes", "bio-conseils",
    ]);
    for (const c of CONTENUS) expect(sanitizeContenu(c)).toBe(c);
  });

  it.each(["commentaire", "bio", "BIO-QUIZ", "bio-quiz2", "<script>", "", null])("contenu %p refusé", (v) =>
    expect(sanitizeContenu(v)).toBeNull(),
  );
});

describe("resolveAttribution", () => {
  const stored = { origine: "x" as const, contenu: "quiz" as const };

  it("UTM d'arrivée : retenue", () => {
    expect(resolveAttribution("?utm_source=instagram&utm_medium=social&utm_content=bio-article", EMPTY_ATTRIBUTION)).toEqual({
      origine: "instagram",
      contenu: "bio-article",
    });
  });

  it("nouvelle UTM : remplace la précédente ; contenu hors liste → contenu nul", () => {
    expect(resolveAttribution("?utm_source=linkedin&utm_content=commentaire", stored)).toEqual({
      origine: "linkedin",
      contenu: null,
    });
  });

  it("source hors liste blanche : attribution sociale effacée", () => {
    expect(resolveAttribution("?utm_source=newsletter&utm_content=quiz", stored)).toEqual(EMPTY_ATTRIBUTION);
  });

  it("bascule `origine`/`contenu` : retenue si rien n'est gardé", () => {
    expect(resolveAttribution("?callbackUrl=%2Fonboarding&src=blog-x&origine=linkedin&contenu=relais", EMPTY_ATTRIBUTION)).toEqual({
      origine: "linkedin",
      contenu: "relais",
    });
  });

  it("bascule : l'UTM d'arrivée déjà gardée reste prioritaire", () => {
    expect(resolveAttribution("?origine=instagram&contenu=bio-quiz", stored)).toEqual(stored);
  });

  it("bascule : origine hors liste ignorée", () => {
    expect(resolveAttribution("?origine=tiktok&contenu=quiz", EMPTY_ATTRIBUTION)).toEqual(EMPTY_ATTRIBUTION);
  });

  it("URL sans paramètre : attribution gardée inchangée", () => {
    expect(resolveAttribution("", stored)).toEqual(stored);
  });
});

describe("captureAttribution (sessionStorage)", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("garde puis relit l'attribution d'arrivée", () => {
    captureAttribution("?utm_source=x&utm_content=lundi");
    expect(readStoredAttribution()).toEqual({ origine: "x", contenu: "lundi" });
    captureAttribution("?page=2");
    expect(readStoredAttribution()).toEqual({ origine: "x", contenu: "lundi" });
  });

  it("valeur trafiquée en stockage : ignorée", () => {
    window.sessionStorage.setItem("marrant-origine", "evil");
    window.sessionStorage.setItem("marrant-contenu", "bio-quiz");
    expect(readStoredAttribution()).toEqual({ origine: null, contenu: "bio-quiz" });
    expect(attributionProps(readStoredAttribution())).toEqual({});
  });
});

describe("trackUmami : origine et contenu sur les événements du tunnel", () => {
  const track = jest.fn();

  beforeEach(() => {
    track.mockClear();
    window.sessionStorage.clear();
    (window as unknown as { umami: unknown }).umami = { track };
  });

  it("liste des événements enrichis", () => {
    expect([...ATTRIBUTED_EVENTS].sort()).toEqual(
      [
        "abonnement-annule",
        "abonnement-clic",
        "abonnement-reussi",
        "blog-cta-clic",
        "inscription-envoi",
        "inscription-reussie",
        "onboarding-termine",
        "parcours-etape",
        "quiz-termine",
      ].sort(),
    );
  });

  it("sans arrivée sociale : aucune propriété ajoutée", () => {
    trackUmami("inscription-envoi", { methode: "email", src: "direct" });
    expect(track).toHaveBeenCalledWith("inscription-envoi", { methode: "email", src: "direct" });
  });

  it("arrivée sociale : origine et contenu ajoutés, src et méthode intacts", () => {
    captureAttribution("?utm_source=instagram&utm_content=bio-article");
    trackUmami("inscription-reussie", { methode: "email", src: "blog-mon-article" });
    expect(track).toHaveBeenCalledWith("inscription-reussie", {
      origine: "instagram",
      contenu: "bio-article",
      methode: "email",
      src: "blog-mon-article",
    });
    trackUmami("quiz-termine", { profil: "absurde" });
    expect(track).toHaveBeenLastCalledWith("quiz-termine", { origine: "instagram", contenu: "bio-article", profil: "absurde" });
  });

  it("événement hors tunnel : jamais enrichi", () => {
    captureAttribution("?utm_source=x&utm_content=quiz");
    trackUmami("partage-vanne", { canal: "x" });
    expect(track).toHaveBeenCalledWith("partage-vanne", { canal: "x" });
  });

  it("abonnement-clic, abonnement-reussi, abonnement-annule : origine et contenu ajoutés (s15)", () => {
    captureAttribution("?utm_source=x&utm_content=quiz");
    trackUmami("abonnement-clic", { formule: "mensuel", src: "abonnement", declencheur: "auto" });
    expect(track).toHaveBeenCalledWith("abonnement-clic", {
      origine: "x",
      contenu: "quiz",
      formule: "mensuel",
      src: "abonnement",
      declencheur: "auto",
    });
    trackUmami("abonnement-reussi", { formule: "annuel" });
    expect(track).toHaveBeenCalledWith("abonnement-reussi", { origine: "x", contenu: "quiz", formule: "annuel" });
    trackUmami("abonnement-annule");
    expect(track).toHaveBeenCalledWith("abonnement-annule", { origine: "x", contenu: "quiz" });
  });

  it("origine sans contenu : origine seule", () => {
    captureAttribution("?utm_source=linkedin");
    trackUmami("parcours-etape", { parcours: "repartie", etape: 1 });
    expect(track).toHaveBeenCalledWith("parcours-etape", { origine: "linkedin", parcours: "repartie", etape: 1 });
  });
});

describe("AttributionCapture (layout racine)", () => {
  it("garde l'UTM de la page d'arrivée au montage", () => {
    window.sessionStorage.clear();
    window.history.replaceState(null, "", "/blog/mon-article?utm_source=x&utm_medium=social&utm_content=lundi");
    render(<AttributionCapture />);
    expect(readStoredAttribution()).toEqual({ origine: "x", contenu: "lundi" });
    window.history.replaceState(null, "", "/");
  });
});

/**
 * @jest-environment node
 *
 * Pages serveur /resiliation et /resiliation/confirmee (s23) : 404 interrupteur fermé, connexion
 * puis retour sur la page, page finale ouverte sans résiliation en cours = retour à /resiliation.
 */
jest.mock("@/config/resiliation", () => ({
  ...jest.requireActual("@/config/resiliation"),
  get RESILIATION_PAGE_OUVERTE() {
    return (globalThis as { __RESILIATION_OUVERTE__?: boolean }).__RESILIATION_OUVERTE__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  },
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const lire = jest.fn();
jest.mock("@/lib/resiliation", () => ({ lireResiliation: (...a: unknown[]) => lire(...a) }));

import type { ReactElement } from "react";
import ResiliationPage from "@/app/(dashboard)/resiliation/page";
import ConfirmeePage from "@/app/(dashboard)/resiliation/confirmee/page";

const drapeau = globalThis as { __RESILIATION_OUVERTE__?: boolean };
const donnees = { email: "y@x.fr", prenom: "Yanis", formule: "monthly", priceCents: 199, dateFin: "2026-12-01T10:00:00.000Z" };

beforeEach(() => {
  drapeau.__RESILIATION_OUVERTE__ = false;
  getServerSession.mockReset();
  lire.mockReset();
});

describe("interrupteur fermé : pages introuvables (parcours actuel inchangé)", () => {
  it("/resiliation et /resiliation/confirmee : 404, aucune lecture", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1" } });
    await expect(ResiliationPage()).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(ConfirmeePage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(lire).not.toHaveBeenCalled();
  });
});

describe("interrupteur ouvert", () => {
  beforeEach(() => {
    drapeau.__RESILIATION_OUVERTE__ = true;
  });
  it("sans session : connexion puis retour sur /resiliation", async () => {
    getServerSession.mockResolvedValue(null);
    await expect(ResiliationPage()).rejects.toThrow("NEXT_REDIRECT /login?callbackUrl=%2Fresiliation");
  });
  it("page finale sans résiliation en cours : retour à /resiliation", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1" } });
    lire.mockResolvedValue({ etat: "a_resilier", ...donnees });
    await expect(ConfirmeePage()).rejects.toThrow("NEXT_REDIRECT /resiliation");
  });
  it("rendu : à résilier, déjà résilié, sans abonnement, lecture en échec", async () => {
    getServerSession.mockResolvedValue({ user: { id: "u1", email: "y@x.fr" } });
    for (const etat of ["a_resilier", "deja_resilie", "aucun"]) {
      lire.mockResolvedValue({ etat, ...donnees });
      await expect(ResiliationPage()).resolves.toBeTruthy();
    }
    lire.mockRejectedValue(new Error("base"));
    jest.spyOn(console, "warn").mockImplementation(() => {});
    await expect(ResiliationPage()).resolves.toBeTruthy();
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees });
    await expect(ConfirmeePage()).resolves.toBeTruthy();
  });
});

describe("v2 des revues (UX O1, design O3/O4)", () => {
  const { renderToStaticMarkup } = require("react-dom/server") as typeof import("react-dom/server");
  beforeEach(() => {
    drapeau.__RESILIATION_OUVERTE__ = true;
    getServerSession.mockResolvedValue({ user: { id: "u1", email: "y@x.fr" } });
  });

  it("page finale : ni « Merci d’avoir répondu. » ni ligne d'aide (aucune main tendue), respiration mt-2", async () => {
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees });
    const html = renderToStaticMarkup(await ConfirmeePage());
    expect(html).toContain("C’est noté.");
    expect(html).not.toContain("Merci d’avoir répondu.");
    expect(html).not.toMatch(/chaque parcours|Comment devenir drôle|quiz-humour|blague-du-jour/);
    expect(html).toMatch(/class="mt-2 text-sm text-text-secondary">Ensuite/);
  });

  it("boutons secondaires avec bordure visible border-border-input (sans border-border)", async () => {
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees });
    for (const page of [await ConfirmeePage(), await ResiliationPage()]) {
      const html = renderToStaticMarkup(page);
      const classes = html.match(/<a [^>]*class="([^"]*)"[^>]*>(Retour à l’accueil|Réactiver mon abonnement)/)?.[1] ?? "";
      expect(classes).toContain("border-border-input");
      expect(classes.split(" ")).not.toContain("border-border");
    }
  });

  it("accès sans abonnement Stripe : récapitulatif « à la fin de ton accès Premium », sans prélèvement", async () => {
    lire.mockResolvedValue({ etat: "a_resilier", ...donnees, dateFin: null, formule: null, sansAbonnementStripe: true, sansClientStripe: true });
    const page = await ResiliationPage();
    // UX C2 : au rendu serveur, le formulaire attend le verdict App Store (rien d'affiché) ; le
    // récapitulatif est rendu à part, depuis la prop `recap`.
    const html = renderToStaticMarkup(formulaire(page).props.recap);
    expect(html).toContain("à la fin de ton accès Premium");
    // Ni client ni abonnement Stripe : le formulaire reçoit l'indice App Store (détection dans l'appli).
    expect(formulaire(page).props.appStorePossible).toBe(true);
    // @reviewer R1 : accès offert signalé au formulaire (pas de « Réessayer » après une demande transmise).
    expect(formulaire(page).props.offert).toBe(true);
    expect(html).not.toContain("Aucun nouveau prélèvement après.");
  });

  it("design O5 : hauteur minimale locale sur /resiliation et /resiliation/confirmee", async () => {
    lire.mockResolvedValue({ etat: "aucun", ...donnees });
    expect(renderToStaticMarkup(await ResiliationPage())).toMatch(/^<div class="mx-auto max-w-xl md:min-h-\[calc\(100dvh-797px\)\] lg:min-h-\[calc\(100dvh-607px\)\]">/);
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees });
    expect(renderToStaticMarkup(await ConfirmeePage())).toMatch(/^<div class="mx-auto max-w-xl md:min-h-\[calc\(100dvh-797px\)\] lg:min-h-\[calc\(100dvh-607px\)\]">/);
  });
});

/** Élément `ResiliationFormulaire` de l'arbre rendu par la page (props lues sans le rendre). */
function formulaire(arbre: unknown): { props: { recap: ReactElement; appStorePossible?: boolean; offert?: boolean } } {
  const pile: unknown[] = [arbre];
  while (pile.length) {
    const n = pile.pop() as { type?: { name?: string }; props?: { children?: unknown } } | null;
    if (!n || typeof n !== "object") continue;
    if (Array.isArray(n)) pile.push(...n);
    else if (n.type?.name === "ResiliationFormulaire") return n as never;
    else if (n.props) pile.push(n.props.children);
  }
  throw new Error("ResiliationFormulaire absent");
}

describe("@legal O7 : abonné en impayé (PAST_DUE)", () => {
  const { renderToStaticMarkup } = require("react-dom/server") as typeof import("react-dom/server");
  beforeEach(() => {
    drapeau.__RESILIATION_OUVERTE__ = true;
    getServerSession.mockResolvedValue({ user: { id: "u1", email: "y@x.fr" } });
  });
  const IMPAYE_1 = "Jusqu’au 1er décembre 2026, tu gardes ton Premium, sauf si la facture en cours reste impayée.";
  const IMPAYE_2 = "Ton dernier paiement n’a pas abouti : cette facture peut encore être prélevée. Aucun autre prélèvement ensuite.";

  it("récapitulatif à résilier : deux lignes prudentes à la place de « Aucun nouveau prélèvement après. »", async () => {
    lire.mockResolvedValue({ etat: "a_resilier", ...donnees, impaye: true });
    const html = renderToStaticMarkup(formulaire(await ResiliationPage()).props.recap);
    expect(html).toContain(IMPAYE_1);
    expect(html).toContain(IMPAYE_2);
    expect(html).not.toContain("Aucun nouveau prélèvement après.");
    expect(html).not.toContain("tu gardes tout ton Premium");
  });

  it("déjà résilié : mêmes lignes, sans « Tu gardes Premium jusqu’au… » en dessous", async () => {
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees, impaye: true });
    const html = renderToStaticMarkup(await ResiliationPage());
    expect(html).toContain(IMPAYE_1);
    expect(html).toContain(IMPAYE_2);
    expect(html).toContain("Ta résiliation est déjà enregistrée.</p>");
  });

  it("page finale : texte @legal mot pour mot ; hors impayé, « Aucun nouveau prélèvement après. » (R2)", async () => {
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees, impaye: true });
    expect(renderToStaticMarkup(await ConfirmeePage())).toContain(
      "Tu gardes Premium jusqu’au 1er décembre 2026, sauf si la facture en cours reste impayée. Cette facture peut encore être prélevée. Aucun autre prélèvement ensuite.",
    );
    lire.mockResolvedValue({ etat: "deja_resilie", ...donnees });
    const html = renderToStaticMarkup(await ConfirmeePage());
    expect(html).toContain("Tu gardes Premium jusqu’au 1er décembre 2026. Aucun nouveau prélèvement après.");
    expect(html).not.toContain("sauf si la facture");
  });
});

describe("UX C4 : interrupteur testé dans layout.tsx, au-dessus du Suspense de loading.tsx", () => {
  const fs = require("fs") as typeof import("fs");
  const path = require("path") as typeof import("path");
  const dossier = path.join(__dirname, "../../app/(dashboard)/resiliation");
  const { renderToStaticMarkup } = require("react-dom/server") as typeof import("react-dom/server");

  it("layout.tsx fermé : 404 avant tout rendu ; ouvert : rend la page telle quelle", () => {
    const Layout = (require("@/app/(dashboard)/resiliation/layout") as { default: (p: { children: string }) => unknown }).default;
    expect(() => Layout({ children: "page" })).toThrow("NEXT_NOT_FOUND");
    drapeau.__RESILIATION_OUVERTE__ = true;
    expect(Layout({ children: "page" })).toBe("page");
  });

  it("un seul loading.tsx, à côté du layout.tsx ; aucun ailleurs (sinon 200 au lieu de 404, piège s17)", () => {
    expect(fs.existsSync(path.join(dossier, "layout.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(dossier, "loading.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(dossier, "confirmee/loading.tsx"))).toBe(false);
    expect(fs.existsSync(path.join(dossier, "../loading.tsx"))).toBe(false);
    // Les pages gardent leur propre test (double sécurité si le layout était contourné).
    for (const f of ["page.tsx", "confirmee/page.tsx"]) {
      expect(fs.readFileSync(path.join(dossier, f), "utf8")).toMatch(/if \(!RESILIATION_PAGE_OUVERTE\) notFound\(\);/);
    }
  });

  it("loading.tsx : H1, carte squelette, aucun bouton ni lien", () => {
    const Loading = (require("@/app/(dashboard)/resiliation/loading") as { default: () => ReactElement }).default;
    const html = renderToStaticMarkup(Loading());
    expect(html).toContain("<h1");
    expect(html).toContain("Résilier ton contrat");
    expect(html).not.toMatch(/<button|<a /);
  });
});

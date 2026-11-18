/**
 * v6 tour 4, lot 2 (pages publiques vues en régime ouvert), plan `plan-corrections-v6-tour-4.md` points 2, 3, 4, 5,
 * 6 (profil) et 8. Chaque correction n'existe qu'interrupteur ouvert ; fermé, le rendu d'avant (vérifié ici composant
 * par composant, et au caractère près par `inertie-espace.test.tsx`).
 */
import { TextEncoder } from "util";
import { act, fireEvent, render, screen, within } from "@testing-library/react";

const etat = globalThis as { __V6T4_OUVERT__?: boolean };
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __V6T4_OUVERT__?: boolean }).__V6T4_OUVERT__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error("notFound");
  },
}));
const useSession = jest.fn(() => ({ data: null as unknown, status: "unauthenticated" }));
jest.mock("next-auth/react", () => ({ useSession: () => useSession(), signOut: jest.fn() }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/lettres", () => ({
  listerLettres: async () => [
    { numero: 2, titre: "Après l'exposé", objet: "Alors, t'as perdu ta langue ?" },
    { numero: 1, titre: "Lettre du 5 novembre", objet: "Objet 1" },
  ],
}));
jest.mock("@/lib/espace/compteurs", () => ({ compterAnonyme: async () => undefined }));
jest.mock("@/stores/user-store", () => ({ useUserStore: jest.fn() }));
jest.mock("@/hooks/use-subscription-summary", () => ({
  useSubscriptionSummary: () => ({ summary: { status: "ACTIVE", hasPortal: true, hasStripeSubscription: true, cancelAtPeriodEnd: false, formule: "monthly", priceCents: 199, currentPeriodEnd: "2026-12-09T09:00:00.000Z" }, openPortal: jest.fn(), portalLoading: null }),
}));
jest.mock("@/app/(dashboard)/profil/rappel-parcours-toggle", () => ({ RappelParcoursToggle: () => <section id="rappel-parcours">rappel</section> }));
// Réglage de la lettre : rendu pour l'abonné seulement, comme en vrai (`eligible` faux pour un compte sans Premium).
jest.mock("@/components/lettre/lettre-hebdo-reglage", () => ({
  LettreHebdoReglage: () => ((globalThis as { __V6T4_LETTRE__?: boolean }).__V6T4_LETTRE__ === false ? null : <section data-lettre-hebdo="">lettre</section>),
}));
jest.mock("@/components/espace/cap-profil", () => ({ CapProfil: () => <div data-cap="">cap</div> }));

Object.assign(globalThis, { TextEncoder });
const { renderToStaticMarkup } = jest.requireActual<typeof import("react-dom/server")>("react-dom/server");

import { frTypo } from "@/lib/fr-typo";
import { LettresAbonneCartes } from "@/components/lettre/lettres-abonne-cartes";
import { CarnetPage } from "@/components/carnet/carnet-page";
import { carnetViewForPlan, parseCarnets } from "@/lib/carnet";
import { GRILLE_CARTES_OUVERTE, ParcoursContent } from "@/components/parcours/parcours-content";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";
import { CIBLE_44_MD, GROUPE_COURT, ProfilDashboard } from "@/components/profil/profil-dashboard";
import { PRENOM_CARTE_OUVERTE, PRENOM_FORM_OUVERT } from "@/components/profil/prenom-card";
import { SUPPRESSION_CONTENU_OUVERT, SupprimerCompteCard } from "@/components/profil/supprimer-compte-card";
import { useUserStore } from "@/stores/user-store";
import { readFileSync } from "fs";
import { join } from "path";

const ouvrir = (ouvert: boolean) => {
  etat.__V6T4_OUVERT__ = ouvert;
};
afterAll(() => {
  delete etat.__V6T4_OUVERT__;
  delete (globalThis as { __V6T4_LETTRE__?: boolean }).__V6T4_LETTRE__;
});
beforeEach(() => {
  ouvrir(false);
  useSession.mockReturnValue({ data: null, status: "unauthenticated" });
});
const classes = (e: Element | null) => (e as HTMLElement).className.split(" ");
const serveur = async (el: Promise<JSX.Element>) => renderToStaticMarkup(await el);

describe("points 2 et 3 : /parcours, cartes jumelles et carte seule", () => {
  const catalogue = getParcoursCatalogue();
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ paths: [] }) }) as unknown as typeof fetch;
  });
  const cartes = (c: HTMLElement) => catalogue.map((p) => c.querySelector(`#parcours-${p.slug}`) as HTMLElement);

  it("ouvert : « Programme » et le bouton dans un même bloc `mt-auto` (écart `gap-6`, plus de `mb-6`), forme du bouton inchangée", async () => {
    ouvrir(true);
    const { container } = render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    for (const carte of cartes(container)) {
      const pied = carte.querySelector("[data-parcours-pied]") as HTMLElement;
      expect(classes(pied)).toEqual(expect.arrayContaining(["mt-auto", "flex", "flex-col", "gap-6"]));
      const details = pied.firstElementChild as HTMLElement;
      expect(details.tagName).toBe("DETAILS");
      expect(details.className).toBe("group");
      const bloc = pied.lastElementChild as HTMLElement;
      expect(bloc.className).toBe("flex flex-col gap-2");
      const bouton = within(bloc).getByRole("button");
      expect(classes(bouton)).toEqual(expect.arrayContaining(["min-h-12", "w-full", "sm:w-auto"]));
      // Un seul bloc de fin : rien après lui dans la carte.
      expect(pied.nextElementSibling).toBeNull();
    }
  });

  it("ouvert : carte impaire seule à `lg` = largeur d'une jumelle, centrée", async () => {
    ouvrir(true);
    const { container } = render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    const grille = container.querySelector("[data-parcours-cartes]") as HTMLElement;
    expect(grille.className).toBe(GRILLE_CARTES_OUVERTE);
    expect(classes(grille)).toEqual(
      expect.arrayContaining([
        "lg:grid-cols-2",
        "lg:[&>:last-child:nth-child(odd)]:col-span-2",
        "lg:[&>:last-child:nth-child(odd)]:mx-auto",
        "lg:[&>:last-child:nth-child(odd)]:w-[calc(50%-0.75rem)]",
      ]),
    );
  });

  it("fermé : pile d'avant, `details` en `group mb-6`, bloc du bouton sans `mt-auto`, aucun bloc ajouté", async () => {
    const { container } = render(<ParcoursContent parcours={catalogue} />);
    await act(async () => undefined);
    expect(container.querySelector("[data-parcours-pied]")).toBeNull();
    for (const carte of cartes(container)) {
      const details = carte.querySelector("details") as HTMLElement;
      expect(details.className).toBe("group mb-6");
      expect((details.nextElementSibling as HTMLElement).className).toBe("flex flex-col gap-2");
    }
  });
});

describe("points 4, 5 et 6 : /profil", () => {
  const COMPTE = (plan: string, xp: number) => ({ id: "u1", name: "Jean", email: "j@test.fr", plan, level: "NOVICE", xp, streak: 0, lastActiveAt: null, stats: { jokesRead: 0, tipsCompleted: 0, videosWatched: 0, totalFavorites: 0, pathsCompleted: 0 } });
  const EN_COURS = { slug: "repartie", title: "Répartie", icon: "x", totalSteps: 4, completedSteps: 1, completedAt: null };
  function compte(plan: string, parcours: unknown[], xp = 0) {
    (globalThis as { __V6T4_LETTRE__?: boolean }).__V6T4_LETTRE__ = plan === "PREMIUM";
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ parcours }) }) as unknown as typeof fetch;
    useSession.mockReturnValue({ data: { user: { id: "u1", plan } }, status: "authenticated" });
    jest.mocked(useUserStore).mockReturnValue({ user: COMPTE(plan, xp), isLoading: false, fetchUser: jest.fn(async () => undefined), setName: jest.fn() } as unknown as ReturnType<typeof useUserStore>);
  }
  const groupes = (c: HTMLElement) => [...c.querySelectorAll("[data-profil-groupe]")] as HTMLElement[];
  const bouton = (nom: string) => screen.getByRole("button", { name: nom });

  it("règle des groupes : plus de carte seule centrée en demi-largeur, la carte impaire prend la ligne", () => {
    expect(GROUPE_COURT.split(" ")).toContain("lg:[&>:last-child:nth-child(odd)]:col-span-2");
    expect(GROUPE_COURT).not.toMatch(/mx-auto|calc\(50%/);
  });

  it.each([["nouvel", [] as unknown[], 0], ["en cours", [EN_COURS], 120]])(
    "ouvert, abonné %s : question hors des groupes, pleine largeur, hauteur naturelle ; rappel, abonnement, lettre, prénom = 2 × 2",
    async (_n, parcours, xp) => {
      compte("PREMIUM", parcours as unknown[], xp as number);
      ouvrir(true);
      const { container } = render(<ProfilDashboard />);
      await act(async () => undefined);
      const [, b] = groupes(container);
      expect(b.children).toHaveLength(4);
      expect(b.querySelector("#rappel-parcours")).not.toBeNull();
      expect(b.querySelector("#abonnement")).not.toBeNull();
      expect(b.querySelector("[data-lettre-hebdo]")).not.toBeNull();
      expect(b.lastElementChild).toBe(screen.getByTestId("profil-prenom"));
      const cadre = container.querySelector("[data-profil-questions-cadre]") as HTMLElement;
      expect(cadre.closest("[data-profil-groupe]")).toBeNull();
      expect(classes(cadre)).toContain("md:col-span-2");
      expect(classes(screen.getByTestId("profil-ligne-mes-questions"))).not.toContain("h-full");
      // Sous le groupe, avant la suppression du compte.
      expect(b.nextElementSibling).toBe(cadre);
      // Statistiques à côté de « Ton cap » : compteurs en 2 × 2 dès `lg` (hauteur voisine, plus d'étirement).
      expect(classes(container.querySelector("[data-profil-stats]"))).toEqual(expect.arrayContaining(["sm:grid-cols-4", "lg:grid-cols-2"]));
    },
  );

  it("ouvert, prénom : champ et bouton empilés à côté d'une voisine, sur une ligne quand la carte est seule", async () => {
    compte("PREMIUM", []);
    ouvrir(true);
    render(<ProfilDashboard />);
    await act(async () => undefined);
    const carte = screen.getByTestId("profil-prenom");
    expect(carte.className.endsWith(PRENOM_CARTE_OUVERTE)).toBe(true);
    expect(classes(carte)).toEqual(expect.arrayContaining(["lg:[&:nth-child(odd)_form]:flex-row", "lg:[&:nth-child(odd)_form]:items-end"]));
    const form = carte.querySelector("form") as HTMLElement;
    expect(form.className).toBe(PRENOM_FORM_OUVERT);
    expect(classes(form)).toEqual(expect.arrayContaining(["sm:flex-row", "lg:flex-col", "lg:items-start"]));
  });

  it("ouvert, inscrit gratuit : abonnement et prénom côte à côte (groupe pair), aucune ligne de question", async () => {
    compte("FREE", []);
    ouvrir(true);
    const { container } = render(<ProfilDashboard />);
    await act(async () => undefined);
    const gs = groupes(container);
    expect(gs).toHaveLength(1);
    expect(gs[0].children).toHaveLength(2);
    expect(gs[0].lastElementChild).toBe(screen.getByTestId("profil-prenom"));
    expect(container.querySelector("[data-profil-questions-cadre]")).toBeNull();
  });

  it("ouvert : « Voir tout », « Découvrir les parcours », « Supprimer mon compte », « Enregistrer » en 44 px dès 768", async () => {
    compte("PREMIUM", []);
    ouvrir(true);
    render(<ProfilDashboard />);
    await act(async () => undefined);
    expect(CIBLE_44_MD).toBe("md:h-11");
    for (const nom of ["Voir tout", "Découvrir les parcours", "Supprimer mon compte", "Enregistrer"]) {
      expect(classes(bouton(nom))).toContain("md:h-11");
    }
  });

  it("fermé : boutons d'avant (32 px dès 768), ligne de question absente, encadré d'avant", async () => {
    compte("PREMIUM", []);
    const { container } = render(<ProfilDashboard />);
    await act(async () => undefined);
    for (const nom of ["Voir tout", "Découvrir les parcours", "Supprimer mon compte", "Enregistrer"]) {
      expect(classes(bouton(nom))).not.toContain("md:h-11");
    }
    expect(container.querySelector("[data-profil-questions-cadre]")).toBeNull();
    expect(screen.queryByTestId("profil-ligne-mes-questions")).toBeNull();
    expect(container.querySelector("[data-profil-stats]")).toBeNull();
    expect(container.querySelector(".sm\\:grid-cols-4")?.className).toBe("grid grid-cols-2 gap-4 text-center sm:grid-cols-4");
    const carte = screen.getByTestId("profil-prenom");
    expect(carte.className).toMatch(/ md:col-span-2$/);
    expect(carte.className).not.toContain("nth-child");
    expect((carte.querySelector("form") as HTMLElement).className).toBe("flex flex-col gap-3 sm:flex-row sm:items-end");
  });
});

describe("points 5 et 6 : carte « Supprimer mon compte »", () => {
  it("ouvert : texte à gauche en `max-w-prose`, action à droite dès `lg` ; formulaire en 44 px", () => {
    ouvrir(true);
    const { container } = render(<SupprimerCompteCard abonne finPeriode="2026-12-09T09:00:00.000Z" />);
    const contenu = container.querySelector("[data-suppression-colonnes]") as HTMLElement;
    expect(contenu.className).toBe(SUPPRESSION_CONTENU_OUVERT);
    expect(classes(contenu)).toEqual(expect.arrayContaining(["lg:flex", "lg:items-center", "lg:justify-between", "lg:gap-8"]));
    const [texte, action] = [...contenu.children] as HTMLElement[];
    expect(texte.className).toBe("max-w-prose");
    expect(within(texte).getByRole("note")).toBeInTheDocument();
    expect(within(action).getByRole("button", { name: "Supprimer mon compte" })).toBeInTheDocument();
    fireEvent.click(within(action).getByRole("button", { name: "Supprimer mon compte" }));
    for (const nom of ["Supprimer définitivement", "Annuler"]) expect(classes(screen.getByRole("button", { name: nom }))).toContain("md:h-11");
    expect(within(action).getByRole("textbox")).toBeInTheDocument();
  });

  it("fermé : contenu d'avant, sans colonne ajoutée", () => {
    const { container } = render(<SupprimerCompteCard abonne={false} />);
    expect(container.querySelector("[data-suppression-colonnes]")).toBeNull();
    const b = screen.getByRole("button", { name: "Supprimer mon compte" });
    // Bouton et paragraphes enfants directs du même contenu de carte, comme avant.
    expect(b.parentElement?.querySelector(":scope > p")).not.toBeNull();
    expect(classes(b)).toEqual(expect.arrayContaining(["-ml-3", "mt-4", "text-error-text"]));
    expect(classes(b)).not.toContain("md:h-11");
  });
});

describe("point 8 : finitions /carnet et /lettre", () => {
  const lire = (f: string): unknown => JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", f), "utf8"));
  const [precedent, courant] = parseCarnets([lire("2026-10.json"), lire("2026-11.json")]);

  // s26 (`docs/design/favoris-carnet-s26.md` §4) : sommaire en tuiles, le numéro en tête de chaque tuile (`META`, chiffres
  // tabulaires) ; plus de colonne de numéros alignés à droite.
  it("sommaire du carnet (s26) : numéro en tête de tuile, chiffres tabulaires", () => {
    ouvrir(true);
    const { container } = render(
      <CarnetPage view={carnetViewForPlan(courant, "PREMIUM")} months={[courant.mois, precedent.mois]} returnTo="/carnet" src="carnet" />,
    );
    const numeros = [...container.querySelectorAll("[data-carnet-sommaire] a > span:first-child")] as HTMLElement[];
    expect(numeros.length).toBeGreaterThan(9);
    expect(numeros[9].textContent).toBe("10");
    for (const n of numeros) expect(classes(n)).toEqual(expect.arrayContaining(["tabular-nums", "text-sm"]));
  });

  it("archive de la lettre : titre et objet en typographie française, texte inchangé", async () => {
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: await serveur(LettresAbonneCartes()) }} />);
    const carte = container.querySelector('a[data-lettre="2"]') as HTMLElement;
    const [titre, objet] = [...(carte.querySelector("span.flex-col") as HTMLElement).children].map((e) => e.textContent);
    expect(titre).toBe(frTypo("Après l'exposé"));
    expect(objet).toBe(frTypo("Alors, t'as perdu ta langue ?"));
    expect(titre).toContain("’");
    expect(`${titre}${objet}`).not.toContain("'");
  });
});

/**
 * « Aujourd'hui » s25 v7, tour 13 (décision de Thomas du 16/11, « vas-y je te fais confiance ») : l'aperçu vend les
 * RÉPLIQUES. 1. Z1 de l'extrait = vitrine : la situation en clair une seule fois, les répliques de la fiche par défaut
 * en trois cartes fermées (libellé réel, verrou, barres), leur texte ABSENT du rendu ; plus de bouton éteint.
 * 2. Un seul bouton de paiement en haut : l'en-tête masque le sien sur un aperçu à offre en haut (ouvert seulement).
 * 3. H1 de l'aperçu en texte dégradé (`text-gradient` de l'accueil), même taille ; s26, Thomas 18/11 : en BLANC comme
 * chez l'abonné, plus de dégradé. 4. Légende à 48 px de l'offre.
 * 5. Abonné : bouton de Z1 à gauche sous le texte pour tous les comptes. Positions : specs Playwright.
 */
import { act, render, screen } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/mon-espace"),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("next-auth/react", () => ({ useSession: jest.fn(), signOut: jest.fn() }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: jest.fn(async () => ({ userId: "u1" })) }));

import { ApercuAujourdhui } from "@/components/espace/apercu/tableau-verrouille";
import { ficheApercu } from "@/components/espace/apercu/exemples";
import { offreEnHaut } from "@/components/espace/apercu/offre-en-haut";
import { EnTeteUniversel } from "@/components/layout/en-tete-universel";
import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { EN_TETE } from "@/config/textes/cta-articles-accueil";
import { frEspace } from "@/lib/fr-typo";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const { usePathname } = jest.requireMock("next/navigation") as { usePathname: jest.Mock };
const classes = (e: Element | null | undefined) => (e?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const VANNE = { content: "Énoncé réel de test.", punchline: "Chute réelle de test." };

/** Sans espaces ni ponctuation typographique : une phrase ressort même si `frEspace` a posé ses espaces insécables. */
const nu = (t: string) => t.normalize("NFC").replace(/[\s\u00a0\u202f\u2060'’«»"]/g, "");

const fiche = ficheApercu("aujourdhui");
if (fiche.type !== "situation") throw new Error("la fiche d'aperçu d'Aujourd'hui doit être une situation");
const REPLIQUES = Object.entries(fiche.contenu.repliques);

describe("point 1 : vitrine des répliques, verrouillage réel", () => {
  it("le texte des répliques est absent du rendu (DOM) ; HTML serveur : `aujourdhui-v7-tour13-verrou.test.tsx`", () => {
    render(<ApercuAujourdhui visiteur vanne={VANNE} />);
    const texte = nu(document.body.textContent ?? "");
    for (const [, r] of REPLIQUES) {
      expect(texte).not.toContain(nu(r.texte));
      expect(texte).not.toContain(nu(r.pourquoi));
    }
  });

  it("trois cartes fermées : libellés réels dans l'ordre de la fiche, un verrou chacune, deux barres neutres, aucun violet", () => {
    render(<ApercuAujourdhui visiteur vanne={VANNE} />);
    const z1 = document.querySelector("[data-apercu-extrait] [data-tuile-fermee='nette'] [data-action-du-jour]") as HTMLElement;
    expect(z1.querySelector("h2")?.textContent).toBe(frEspace(TEXTES_AUJOURDHUI.premierPas.sceneParDefaut));
    expect(z1.querySelector("[aria-disabled='true'], a")).toBeNull();
    const liste = z1.querySelector("[data-repliques-fermees]") as HTMLElement;
    expect(classes(liste)).toEqual(expect.arrayContaining(["grid", "grid-cols-1", "md:grid-cols-3"]));
    const cartes = Array.from(liste.querySelectorAll("[data-replique-fermee]"));
    expect(cartes.map((c) => c.getAttribute("data-replique-fermee"))).toEqual(REPLIQUES.map(([k]) => k));
    expect(cartes.map((c) => c.querySelector("p")?.textContent)).toEqual(
      REPLIQUES.map(([k]) => frEspace(TEXTES_CARTES.registres[k as keyof typeof TEXTES_CARTES.registres])),
    );
    for (const c of cartes) {
      expect(c.querySelectorAll("svg")).toHaveLength(1);
      const barres = c.querySelectorAll("[data-barres-replique] > span");
      expect(barres).toHaveLength(2);
      for (const b of Array.from(barres)) expect(classes(b)).toEqual(expect.arrayContaining(["bg-border-hover", "rounded-full"]));
      expect(c.innerHTML).not.toMatch(/accent|violet/);
      expect(c.textContent).toBe(c.querySelector("p")?.textContent);
    }
    expect(z1.innerHTML).not.toMatch(/accent-primary|accent-secondary/);
  });
});

describe("point 2 : un seul bouton de paiement en haut", () => {
  beforeAll(() => {
    class RO {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.assign(globalThis, { ResizeObserver: RO });
    global.fetch = jest.fn(async () => ({ ok: false, json: async () => ({}) })) as unknown as typeof fetch;
  });
  beforeEach(() => {
    drapeau.__ESPACE_OUVERT__ = true;
  });
  afterAll(() => {
    drapeau.__ESPACE_OUVERT__ = false;
  });

  // s26 : « Quoi répondre », « Bibliothèque » et « S'entraîner » rejoignent « Aujourd'hui » (`apercus-s26-verrou.test.tsx`) ;
  // l'adresse témoin sans offre en haut devient « Mes questions », encore sur l'ancien aperçu.
  it("`offreEnHaut` : les aperçus verrouillés seulement (offre en haut de l'aperçu), paramètres ignorés", () => {
    expect(offreEnHaut("/mon-espace")).toBe(true);
    expect(offreEnHaut("/mon-espace?depuis=accueil#x")).toBe(true);
    expect(offreEnHaut("/mon-espace/quoi-repondre")).toBe(true);
    // s26 : `/favoris` et le carnet passent offre en haut (`apercus-s26-verrou.test.tsx`) ; ils sortent de cette liste.
    // s26 (`docs/ux/questions-repliques-lettre-profil-s26.md` §1.1) : Mes questions passe offre en haut ; l'adresse témoin
    // devient un fil de Mes questions (hors aperçu).
    expect(offreEnHaut("/mon-espace/questions")).toBe(true);
    for (const autre of ["/", "/vannes", "/mon-espace/questions/clx0fil", "/mon-espace/fiche/situation/coloc-la-poele", null]) {
      expect(offreEnHaut(autre)).toBe(false);
    }
  });

  it.each([
    ["visiteur", { data: null, status: "unauthenticated" }],
    ["gratuit", { data: { user: { id: "u1", plan: "FREE" } }, status: "authenticated" }],
  ])("%s : bouton d'offre de l'en-tête masqué sur /mon-espace, présent ailleurs", async (_nom, session) => {
    useSession.mockReturnValue(session);
    // s26 : Mes questions et Mes répliques rejoignent les aperçus offre en haut (bouton de l'en-tête masqué) ; /lettre
    // aussi (inscription, un seul aplat).
    for (const [chemin, attendu] of [["/mon-espace", 0], ["/mon-espace/s-entrainer", 0], ["/mon-espace/questions", 0], ["/mon-espace/repliques", 0], ["/lettre", 0], ["/", 1], ["/vannes", 1], ["/mon-espace/questions/clx0fil", 1]] as const) {
      usePathname.mockReturnValue(chemin);
      const { unmount } = render(<EnTeteUniversel />);
      await act(async () => {});
      expect(document.querySelectorAll("[data-en-tete-prix]")).toHaveLength(attendu);
      expect(screen.queryAllByRole("link", { name: EN_TETE.nomAccessible })).toHaveLength(attendu);
      unmount();
    }
  });
});

// s26, Thomas 18/11 : le H1 de l'aperçu passe en BLANC comme chez l'abonné (`TITRE_PAGE` seul, plus de dégradé).
describe("point 3 : H1 de l'aperçu en blanc (s26, Thomas 18/11), même taille", () => {
  it("`TITRE_PAGE` seul (blanc `text-text-primary`), sans `text-gradient`, `text-transparent` ni `data-titre-degrade`", () => {
    render(<ApercuAujourdhui visiteur />);
    const h1 = document.querySelector("#apercu-titre") as HTMLElement;
    expect(classes(h1)).toEqual(expect.arrayContaining(["text-text-primary", "text-2xl", "lg:text-3xl", "font-semibold", "font-display"]));
    expect(classes(h1)).not.toContain("text-gradient");
    expect(classes(h1)).not.toContain("text-transparent");
    expect(h1.hasAttribute("data-titre-degrade")).toBe(false);
  });
});

describe("point 4 : légende à 48 px de l'offre", () => {
  it("48 px au-dessus de l'extrait dès 768, plus de 64 dès 1024 ; carte d'offre étirée au bas du hero dès 1024", () => {
    render(<ApercuAujourdhui visiteur />);
    expect(classes(document.querySelector("[data-apercu-extrait]")).filter((c) => /(^|:)mt-/.test(c))).toEqual(["mt-6", "md:mt-12"]);
    expect(classes(document.querySelector("[data-apercu-offre]"))).toContain("lg:h-full");
  });
});

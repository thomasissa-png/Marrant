/**
 * Navigation v6 (s25, `docs/ux/navigation-v6-menu-rubriques.md`, maquette D validée le 15/11) : bande des rubriques
 * pour les 3 états, rubrique allumée, cadenas et noms accessibles, « … », menu mobile réduit, retours, placement
 * d'arrivée de la bande. Interrupteur OUVERT seulement ici, par un mock ; fermé, `inertie-espace.test.tsx` garde le
 * site d'aujourd'hui.
 */
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
  },
}));
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("next-auth/react", () => ({ useSession: jest.fn(), signOut: jest.fn() }));

import { EnTeteUniversel } from "@/components/layout/en-tete-universel";
import { DansTonEspace } from "@/components/espace/aujourdhui/dans-ton-espace";
import { RetourDe } from "@/components/espace/lien-retour";
import { RUBRIQUES, parentEspace, rubriqueAllumee } from "@/components/espace/rubriques";
import { fautes, placementBande, type Boite } from "@/components/layout/placement-bande";
import { TEXTES_ESPACE_NAVIGATION as T } from "@/config/textes/espace-navigation";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const { usePathname } = jest.requireMock("next/navigation") as { usePathname: jest.Mock };
const SESSIONS = {
  visiteur: { data: null, status: "unauthenticated" },
  gratuit: { data: { user: { id: "u1", plan: "FREE" } }, status: "authenticated" },
  abonne: { data: { user: { id: "u2", plan: "PREMIUM" } }, status: "authenticated" },
} as const;
type Etat = keyof typeof SESSIONS;
const ORDRE = ["Aujourd’hui", "Parcours", "Quoi répondre", "Bibliothèque", "S’entraîner", "Vannes", "Conseils", "Vidéos", "Articles", "La lettre", "Favoris", "Carnet"];
const HREFS = ["/mon-espace", "/parcours", "/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/vannes", "/conseils", "/videos", "/blog", "/lettre", "/favoris", "/carnet"];

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
  usePathname.mockReturnValue("/");
  useSession.mockReturnValue(SESSIONS.visiteur);
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

const bande = () => screen.getByRole("navigation", { name: T.bande.nom });
const rubriques = () => Array.from(bande().querySelectorAll<HTMLAnchorElement>("[data-rubrique]"));

describe("bande des rubriques, 3 états (§1, §2)", () => {
  it.each(Object.keys(SESSIONS) as Etat[])("%s : même ordre, mêmes adresses, liens réels ; plus de barre de liens ni « Mon espace »", async (etat) => {
    useSession.mockReturnValue(SESSIONS[etat]);
    render(<EnTeteUniversel />);
    await act(async () => {});
    expect(rubriques().map((a) => a.textContent)).toEqual(ORDRE);
    expect(rubriques().map((a) => a.getAttribute("href"))).toEqual(HREFS);
    expect(bande().querySelectorAll("[data-separateur]")).toHaveLength(2);
    expect(screen.queryByRole("navigation", { name: "Navigation principale" })).toBeNull();
    expect(screen.queryByRole("link", { name: T.monEspace })).toBeNull();
    expect(within(bande()).getByRole("button", { name: T.bande.plus })).toHaveAttribute("aria-expanded", "false");
  });

  it.each([
    ["visiteur", true],
    ["gratuit", true],
    ["abonne", false],
  ] as const)("%s : cadenas et « rubrique Premium » sur les 5 rubriques du groupe 1 et Favoris : %s", async (etat, verrou) => {
    useSession.mockReturnValue(SESSIONS[etat]);
    render(<EnTeteUniversel />);
    await act(async () => {});
    rubriques().forEach((a, i) => {
      const premium = (i < 5 || i === 10) && verrou;
      expect(a.querySelector("svg") !== null).toBe(premium);
      if (premium) expect(a).toHaveAccessibleName(`${ORDRE[i]}, rubrique Premium`);
      else expect(a).toHaveAccessibleName(ORDRE[i]);
    });
  });

  // s25 v6 tour 1 (relectures en-tête D1, F1 et piste P1) : bande resserrée pour que « Carnet » tienne à 1280+ chez le
  // non-abonné (budget chiffré plus bas) ; cibles de 44 px gardées, texte inchangé ; cadenas à la couleur du libellé.
  it("bande resserrée : chips `px-1.5` et 44 px de haut, séparateurs `mx-1`, soulignement aligné, cadenas `text-secondary`", async () => {
    usePathname.mockReturnValue("/vannes");
    render(<EnTeteUniversel />);
    await act(async () => {});
    for (const a of rubriques()) {
      const c = a.className.split(" ");
      expect(c).toEqual(expect.arrayContaining(["px-1.5", "h-11", "text-sm"]));
      expect(c).not.toContain("px-3");
    }
    const actif = rubriques().find((a) => a.getAttribute("aria-current") === "page")!;
    expect(actif.className.split(" ")).toContain("after:inset-x-1.5");
    bande().querySelectorAll("[data-separateur]").forEach((sep) => expect(sep.className.split(" ")).toContain("mx-1"));
    expect(rubriques()[0].querySelector("svg")!.getAttribute("class")).toContain("text-text-secondary");
  });

  // Arbitrage du 15/11 (intégration s25) : pas de bande sur /abonnement et ses sous-adresses (pli de la page de conversion
  // validée en s21) ; la rangée reste ; /abonnementx n'est pas une sous-adresse. Fenêtre basse : bloc non collant.
  it.each(Object.keys(SESSIONS) as Etat[])("%s : bande absente de /abonnement et /abonnement/success, présente ailleurs ; bloc non collant sous 500 px de haut", async (etat) => {
    useSession.mockReturnValue(SESSIONS[etat]);
    for (const [chemin, presente] of [["/abonnement", false], ["/abonnement/success", false], ["/abonnementx", true], ["/register", true], ["/vannes", true]] as const) {
      usePathname.mockReturnValue(chemin);
      const { unmount, container } = render(<EnTeteUniversel />);
      await act(async () => {});
      expect([chemin, screen.queryByRole("navigation", { name: T.bande.nom }) !== null]).toEqual([chemin, presente]);
      const entete = container.querySelector("header[data-en-tete-universel]")!;
      expect(entete.className).toContain("sticky");
      expect(entete.className).toContain("[@media(max-height:499px)]:relative");
      expect(screen.getByRole("link", { name: "deviens-marrant.fr" })).toBeInTheDocument();
      // Réserve des ancres : 128 px sous le bloc collant, 0 quand il défile avec la page.
      // Sans bande (/abonnement) : aucune réserve posée, comme le site fermé.
      expect(container.querySelector("style")?.textContent).toBe(presente ? "html{scroll-padding-top:8rem}@media (max-height:499px){html{scroll-padding-top:0}}" : undefined);
      unmount();
    }
  });

  it("« … » : Mes questions et Mes répliques, Échap ferme et rend le focus", async () => {
    render(<EnTeteUniversel />);
    const plus = within(bande()).getByRole("button", { name: T.bande.plus });
    await userEvent.click(plus);
    expect(plus).toHaveAttribute("aria-expanded", "true");
    const liste = screen.getByRole("list", { name: T.bande.listePlus });
    expect(within(liste).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["/mon-espace/questions", "/mon-espace/repliques"]);
    expect(within(liste).getByRole("link", { name: "Mes questions, rubrique Premium" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(liste).not.toBeVisible();
    expect(plus).toHaveFocus();
  });
});

describe("rubrique allumée (§4)", () => {
  it.each([
    ["/mon-espace", "aujourdhui"],
    ["/parcours", "parcours"],
    ["/parcours/repartie", "parcours"],
    ["/mon-espace/fiche/bilan/bilan-repartie", "parcours"],
    ["/mon-espace/quoi-repondre", "quoiRepondre"],
    ["/mon-espace/fiche/situation/coloc-la-poele", "quoiRepondre"],
    ["/mon-espace/fiche/a-plat/x", "quoiRepondre"],
    ["/mon-espace/bibliotheque", "bibliotheque"],
    ["/mon-espace/fiche/vocabulaire/x", "bibliotheque"],
    ["/mon-espace/bonus/x", "bibliotheque"],
    ["/mon-espace/s-entrainer", "sEntrainer"],
    ["/mon-espace/fiche/seance/x", "sEntrainer"],
    ["/vannes/theme/couple", "vannes"],
    ["/conseils/x", "conseils"],
    ["/videos", "videos"],
    ["/blog/x", "articles"],
    ["/lettre", "lettre"],
    ["/mon-espace/lettres/2026-W46", "lettre"],
    ["/favoris", "favoris"],
    ["/carnet/2026-11", "carnet"],
    ["/mon-espace/questions/abc", "mesQuestions"],
    ["/mon-espace/repliques", "mesRepliques"],
    ["/profil", "compte"],
    ["/", null],
    ["/abonnement", null],
    ["/glossaire", null],
    ["/mon-espace/fiche/inconnu/x", null],
  ])("%s : %s", (chemin, attendu) => {
    expect(rubriqueAllumee(chemin)).toBe(attendu);
  });

  it.each(Object.keys(SESSIONS) as Etat[])("%s : une seule rubrique allumée, « … » allumé sur Mes répliques, aucune sur l'accueil", async (etat) => {
    useSession.mockReturnValue(SESSIONS[etat]);
    usePathname.mockReturnValue("/mon-espace/fiche/jeu/x");
    const { unmount } = render(<EnTeteUniversel />);
    await act(async () => {});
    expect(rubriques().filter((a) => a.getAttribute("aria-current") === "page").map((a) => a.textContent)).toEqual(["S’entraîner"]);
    unmount();
    usePathname.mockReturnValue("/mon-espace/repliques");
    const deux = render(<EnTeteUniversel />);
    await act(async () => {});
    expect(rubriques().some((a) => a.hasAttribute("aria-current"))).toBe(false);
    expect(within(bande()).getByRole("button", { name: T.bande.plus })).toHaveAttribute("aria-current", "true");
    deux.unmount();
    usePathname.mockReturnValue("/");
    render(<EnTeteUniversel />);
    await act(async () => {});
    expect(bande().querySelector("[aria-current]")).toBeNull();
  });
});

describe("ce que la v6 retire (§4)", () => {
  it("menu mobile : actions et recherche seulement, aucun lien du site ni de l'espace", async () => {
    useSession.mockReturnValue(SESSIONS.abonne);
    render(<EnTeteUniversel />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const menu = screen.getByRole("navigation", { name: "Navigation mobile" });
    // Arbitrage du 15/11 : les rubriques de la bande n'y sont qu'en fenêtre basse (masquées au-dessus de 500 px de haut).
    const rubriquesMenu = menu.querySelector<HTMLElement>("[data-rubriques-menu]")!;
    expect(rubriquesMenu.className.split(" ")).toEqual(expect.arrayContaining(["hidden", "[@media(max-height:499px)]:flex"]));
    expect(within(menu).getAllByRole("link").filter((a) => !rubriquesMenu.contains(a)).map((a) => a.textContent)).toEqual(["Mon profil"]);
    expect(within(menu).getByRole("button", { name: "Déconnexion" })).toBeInTheDocument();
  });

  // s25 v6 tour 1 (relectures en-tête D2 et F2) : suggestions de la recherche du menu (375, 320) dans le flux du menu,
  // pas en surimpression tranchée par son bas : le menu grandit et défile ; les lignes suivantes passent dessous.
  it.each(Object.keys(SESSIONS) as Etat[])("%s : suggestions de la recherche du menu dans le flux, avant les actions", async (etat) => {
    useSession.mockReturnValue(SESSIONS[etat]);
    render(<EnTeteUniversel />);
    await act(async () => {});
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const menu = screen.getByRole("navigation", { name: "Navigation mobile" });
    const champ = within(menu).getByRole("combobox");
    await userEvent.click(champ);
    await userEvent.keyboard("{ArrowDown}");
    const liste = within(menu).getByRole("listbox", { name: "Suggestions de recherche" });
    expect(within(liste).getAllByRole("option")).toHaveLength(6);
    const c = liste.className.split(" ");
    expect(c).not.toContain("absolute");
    expect(c.some((x) => /^z-/.test(x))).toBe(false);
    expect(c).toContain("relative");
    // Les actions (offre, Connexion, compte) suivent la liste dans le flux du menu.
    const actions = within(menu).queryAllByRole("link").filter((a) => !a.closest("[data-rubriques-menu]"));
    for (const a of actions) expect(liste.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(menu.className.split(" ")).toEqual(expect.arrayContaining(["overflow-y-auto"]));
  });

  it.each([
    ["visiteur", "/vannes", "Vannes"],
    ["gratuit", "/mon-espace/repliques", "Mes répliques"],
    ["abonne", "/mon-espace/quoi-repondre", "Quoi répondre"],
  ] as const)("%s, fenêtre basse : rubriques de la bande dans le menu, même ordre, cadenas, page allumée", async (etat, chemin, actif) => {
    useSession.mockReturnValue(SESSIONS[etat]);
    usePathname.mockReturnValue(chemin);
    render(<EnTeteUniversel />);
    await act(async () => {});
    // Bande masquée sous 500 px de haut ; bouton Menu présent aussi dès 768 px (et dès 520 pour le visiteur) dans ce cas.
    expect(document.querySelector("[data-bande-rubriques]")!.className).toContain("[@media(max-height:499px)]:hidden");
    const bouton = screen.getByRole("button", { name: "Menu" });
    expect(bouton.className).toContain("[@media(min-width:768px)_and_(min-height:500px)]:hidden");
    expect(bouton.className).not.toMatch(/(^| )(md|min-\[520px\]):hidden/);
    await userEvent.click(bouton);
    const liste = within(screen.getByRole("navigation", { name: "Navigation mobile" })).getByRole("list", { name: T.bande.nom });
    const liens = within(liste).getAllByRole("link");
    expect(liens.map((a) => a.textContent)).toEqual([...ORDRE, "Mes questions", "Mes répliques"]);
    expect(liens.map((a) => a.getAttribute("href"))).toEqual([...HREFS, "/mon-espace/questions", "/mon-espace/repliques"]);
    liens.forEach((a, i) => {
      const premium = (i < 5 || i === 10 || i > 11) && etat !== "abonne";
      expect(a.querySelector("svg") !== null).toBe(premium);
      expect(a).toHaveAccessibleName(premium ? `${a.textContent}, rubrique Premium` : a.textContent!);
    });
    expect(liens.filter((a) => a.getAttribute("aria-current") === "page").map((a) => a.textContent)).toEqual([actif]);
  });

  it("Aujourd'hui : plus d'index « Dans ton espace »", () => {
    const { container } = render(<DansTonEspace />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each(["/mon-espace/quoi-repondre", "/mon-espace/bibliotheque", "/mon-espace/s-entrainer", "/mon-espace/questions", "/mon-espace/repliques"])(
    "%s : plus de « Retour : Mon espace »",
    (chemin) => {
      expect(parentEspace(chemin)).toBeNull();
      const { container } = render(<RetourDe chemin={chemin} />);
      expect(container).toBeEmptyDOMElement();
    },
  );

  it.each([
    ["/mon-espace/fiche/situation/coloc-la-poele", T.index.quoiRepondre, "/mon-espace/quoi-repondre"],
    ["/mon-espace/fiche/jeu/x", T.index.sEntrainer, "/mon-espace/s-entrainer"],
    ["/mon-espace/fiche/humour-noir/x", T.index.bibliotheque, "/mon-espace/bibliotheque"],
    ["/mon-espace/bonus/x", T.index.bibliotheque, "/mon-espace/bibliotheque"],
    ["/mon-espace/fiche/bilan/bilan-repartie", "Répartie", "/parcours/repartie"],
    ["/mon-espace/lettres/2026-W46", "La lettre", "/lettre"],
    ["/mon-espace/lettres", "La lettre", "/lettre"],
    ["/mon-espace/questions/abc", T.index.mesQuestions, "/mon-espace/questions"],
  ])("pages de détail, %s : « Retour : %s » gardé", (chemin, label, href) => {
    expect(parentEspace(chemin)).toEqual({ label, href });
  });

  it("chaque rubrique a un libellé non vide, sans tiret cadratin", () => {
    for (const r of RUBRIQUES) expect(r.label).toMatch(/^[^—]+$/);
  });
});

/** Boîtes de la bande à partir des largeurs mesurées (séparateurs : 1 px et 4 px de chaque côté, v6 tour 1). */
function boites(largeurs: number[]): { boites: Boite[]; total: number } {
  const b: Boite[] = [];
  let x = 0;
  largeurs.forEach((w, i) => {
    if (i === 5 || i === 10) x += 9;
    b.push({ gauche: x, largeur: w });
    x += w;
  });
  return { boites: b, total: x + 8 };
}
// Largeurs des rubriques mesurées dans le Chromium local (Inter 14 px medium, s25, serveur ouvert, 375 à 1920 px), avec
// `px-3` puis moins 12 px (`px-1.5`, v6 tour 1) ; non-abonné : cadenas de 14 px et 5 px d’écart sur les 5 premières et
// Favoris (+19 px).
const SANS = [88.8, 71.9, 107.8, 95.6, 84.4, 61.7, 69.5, 58.3, 63.3, 66.2, 60.5, 57.2];
const AVEC = [107.8, 90.9, 126.8, 114.6, 103.4, 61.7, 69.5, 58.3, 63.3, 66.2, 79.5, 57.2];

describe("placement d'arrivée de la bande (consigne du 15/11, relecture design D tour 4)", () => {
  it.each([
    ["375, non-abonné", AVEC, 287],
    ["375, abonné", SANS, 287],
    ["768, non-abonné", AVEC, 664],
    ["768, abonné", SANS, 664],
    ["320, non-abonné", AVEC, 232],
    ["320, abonné", SANS, 232],
  ])("%s : chaque rubrique active entière hors fondu ; faute seulement aux bornes", (_, largeurs, vue) => {
    const { boites: b, total } = boites(largeurs);
    const max = total - vue;
    for (let actif = 0; actif < b.length; actif++) {
      const m = { boites: b, actif, largeurVue: vue, largeurTotale: total };
      const t = placementBande(m);
      const f = fautes(m, t);
      expect([actif, t, f.actifEntier]).toEqual([actif, t, true]);
      // Faute tolérée seulement quand la rubrique active borne la bande (aucune autre position ne la garde entière).
      if (f.dures > 0) expect([actif, t === 0 || Math.abs(t - max) < 1]).toEqual([actif, true]);
    }
  });

  it("au milieu de la bande, aucune faute (Vannes, Conseils, Vidéos actives, 375 et 768 px, 3 états)", () => {
    for (const [largeurs, vue] of [[AVEC, 287], [SANS, 287], [AVEC, 664], [SANS, 664]] as const) {
      const { boites: b, total } = boites([...largeurs]);
      for (const actif of [5, 6, 7]) {
        const m = { boites: b, actif, largeurVue: vue, largeurTotale: total };
        expect([vue, actif, fautes(m, placementBande(m)).dures]).toEqual([vue, actif, 0]);
      }
    }
  });

  it("rubrique active au début, accueil (aucune) : aucun défilement (Aujourd'hui collé au bord gauche)", () => {
    const { boites: b, total } = boites(AVEC);
    expect(placementBande({ boites: b, actif: 0, largeurVue: 287, largeurTotale: total })).toBe(0);
    expect(placementBande({ boites: b, actif: -1, largeurVue: 287, largeurTotale: total })).toBe(0);
  });

  it("abonné à 1280 px : tout tient, aucun défilement", () => {
    const { boites: b, total } = boites(SANS);
    expect(total).toBeLessThanOrEqual(1160);
    expect(placementBande({ boites: b, actif: 11, largeurVue: 1160, largeurTotale: total })).toBe(0);
  });

  // s25 v6 tour 1 (relectures en-tête D1 et F1) : « Carnet » entier à 1280, 1456 et 1920 px (coque de 1 216, vue de
  // 1 160) pour le non-abonné aussi, libellés majorés de 4 px chacun (Chrome de la CI) : au moins 80 px libres.
  it.each([0, 4])("non-abonné à 1280 px et plus, libellés élargis de %i px chacun : tout tient, au moins 80 px libres", (elargi) => {
    const { boites: b, total } = boites(AVEC.map((w) => w + elargi));
    const libre = 1160 - (b[11].gauche + b[11].largeur);
    expect(libre).toBeGreaterThanOrEqual(80);
    expect(total).toBeLessThanOrEqual(1160);
    for (let actif = 0; actif < b.length; actif++) expect(placementBande({ boites: b, actif, largeurVue: 1160, largeurTotale: total })).toBe(0);
  });
});

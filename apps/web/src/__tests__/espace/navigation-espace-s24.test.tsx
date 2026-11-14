/**
 * Navigation universelle (s24, `docs/ux/navigation-universelle-s24.md` v5) : en-tête unique pour visiteur,
 * compte gratuit et abonné, index de « Mon espace », retours par type de page, élément allumé, cloche.
 * Interrupteur OUVERT seulement ici, par un mock (jamais dans le code livré) ; fermé, le test d'inertie
 * (`inertie-espace.test.tsx`) garde l'en-tête de la production.
 */
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
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

import { Header } from "@/components/layout/header";
import { EnTeteUniversel } from "@/components/layout/en-tete-universel";
import { Cloche } from "@/components/espace/cloche";
import { INDEX_ESPACE, elementBarreAllume, ligneEspaceAllumee, parentEspace } from "@/components/espace/rubriques";
import { TEXTES_ESPACE_NAVIGATION as T, nomCloche } from "@/config/textes/espace-navigation";
import { sansPrefixe } from "@/components/espace/liste-fiches";

const drapeau = globalThis as { __ESPACE_OUVERT__?: boolean };
const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const { usePathname } = jest.requireMock("next/navigation") as { usePathname: jest.Mock };
const SESSIONS = {
  visiteur: { data: null, status: "unauthenticated" },
  gratuit: { data: { user: { id: "u1", plan: "FREE" } }, status: "authenticated" },
  abonne: { data: { user: { id: "u2", plan: "PREMIUM" } }, status: "authenticated" },
} as const;
const SITE = ["Parcours", "Vannes", "Conseils", "Vidéos", "Articles"];

beforeAll(() => {
  // jsdom : ni ResizeObserver ni document.fonts ; Radix a besoin de ResizeObserver.
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.assign(globalThis, { ResizeObserver: RO });
  global.fetch = jest.fn(async () => ({ ok: false, json: async () => ({}) })) as unknown as typeof fetch;
});
beforeEach(() => {
  drapeau.__ESPACE_OUVERT__ = false;
  usePathname.mockReturnValue("/");
  useSession.mockReturnValue(SESSIONS.visiteur);
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

const liensBarre = () =>
  within(screen.getByRole("navigation", { name: "Navigation principale" }))
    .getAllByRole("link")
    .map((a) => a.textContent);

describe("interrupteur (§0)", () => {
  it.each(Object.keys(SESSIONS))("fermé, %s : en-tête d'origine (onglet Accueil), ni « Mon espace » ni cloche", async (etat) => {
    useSession.mockReturnValue(SESSIONS[etat as keyof typeof SESSIONS]);
    const { container } = render(<Header />);
    await act(async () => {});
    expect(liensBarre()[0]).toBe("Accueil");
    expect(container.innerHTML).not.toMatch(/Notifications|data-en-tete-universel|Mon espace/);
  });
});

describe("en-tête unique, interrupteur ouvert (§1)", () => {
  beforeEach(() => {
    drapeau.__ESPACE_OUVERT__ = true;
  });

  it("visiteur : Parcours en premier, « La lettre » en dernier, Connexion, bouton d'offre, logo vers l'accueil", async () => {
    render(<EnTeteUniversel />);
    await act(async () => {});
    expect(liensBarre()).toEqual([...SITE, "La lettre"]);
    expect(screen.getByRole("link", { name: "deviens-marrant.fr" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Connexion" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Premium, 1,99/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Notifications/ })).toBeNull();
  });

  it("compte gratuit : mêmes liens, pas de Connexion, bouton d'offre", async () => {
    useSession.mockReturnValue(SESSIONS.gratuit);
    render(<EnTeteUniversel />);
    await act(async () => {});
    expect(liensBarre()).toEqual([...SITE, "La lettre"]);
    expect(screen.queryByRole("link", { name: "Connexion" })).toBeNull();
    expect(screen.getByRole("link", { name: /^Premium, 1,99/ })).toBeInTheDocument();
  });

  it("abonné : « Mon espace » puis 5 liens, logo vers Aujourd'hui, cloche, aucun bouton d'offre", async () => {
    useSession.mockReturnValue(SESSIONS.abonne);
    usePathname.mockReturnValue("/mon-espace/quoi-repondre");
    render(<EnTeteUniversel />);
    expect(await screen.findByRole("button", { name: nomCloche(0) })).toBeInTheDocument();
    expect(liensBarre()).toEqual([T.monEspace, ...SITE]);
    expect(screen.getByRole("link", { name: T.monEspace })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "deviens-marrant.fr" })).toHaveAttribute("href", "/mon-espace");
    expect(screen.queryByRole("link", { name: /^Premium, 1,99/ })).toBeNull();
  });

  it("menu mobile de l'abonné : « Mon espace », ses 8 entrées, puis les liens du site ; Échap rend le focus", async () => {
    useSession.mockReturnValue(SESSIONS.abonne);
    usePathname.mockReturnValue("/mon-espace/fiche/situation/coloc-la-poele");
    render(<EnTeteUniversel />);
    const bouton = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(bouton);
    const menu = screen.getByRole("navigation", { name: "Navigation mobile" });
    const liens = within(menu).getAllByRole("link").map((a) => a.textContent);
    expect(liens.slice(0, 10)).toEqual([T.monEspace, ...INDEX_ESPACE.map((e) => e.label), "Parcours"]);
    expect(within(menu).getByRole("link", { name: T.index.quoiRepondre })).toHaveAttribute("aria-current", "page");
    expect(menu.querySelector("p")?.textContent).toBe(T.monEspace);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "Navigation mobile" })).toBeNull();
    expect(bouton).toHaveFocus();
  });
});

describe("retour par type de page (§4.3)", () => {
  it.each([
    ["/mon-espace/fiche/situation/coloc-la-poele", T.index.quoiRepondre, "/mon-espace/quoi-repondre"],
    ["/mon-espace/fiche/a-plat/x", T.index.quoiRepondre, "/mon-espace/quoi-repondre"],
    ["/mon-espace/fiche/jeu/quelle-replique-1", T.index.sEntrainer, "/mon-espace/s-entrainer"],
    ["/mon-espace/fiche/seance/x", T.index.sEntrainer, "/mon-espace/s-entrainer"],
    ["/mon-espace/fiche/construction/x", T.index.bibliotheque, "/mon-espace/bibliotheque"],
    ["/mon-espace/fiche/humour-noir/x", T.index.bibliotheque, "/mon-espace/bibliotheque"],
    ["/mon-espace/bonus/x", T.index.bibliotheque, "/mon-espace/bibliotheque"],
    ["/mon-espace/fiche/bilan/bilan-repartie", "Répartie", "/parcours/repartie"],
    ["/mon-espace/lettres/2026-W46", T.index.lettres, "/mon-espace/lettres"],
    ["/mon-espace/questions/abc", T.index.mesQuestions, "/mon-espace/questions"],
    ["/mon-espace/quoi-repondre", T.monEspace, "/mon-espace"],
    ["/mon-espace/s-entrainer", T.monEspace, "/mon-espace"],
  ])("%s : « Retour : %s »", (chemin, label, href) => {
    expect(parentEspace(chemin)).toMatchObject({ label, href });
  });

  it.each(["/mon-espace", "/favoris", "/carnet", "/carnet/2026-11", "/parcours"])("%s : aucun retour ajouté", (chemin) => {
    expect(parentEspace(chemin)).toBeNull();
  });
});

describe("élément allumé (§1)", () => {
  it.each([
    ["/mon-espace", "abonne", "monEspace"],
    ["/mon-espace/fiche/bilan/bilan-repartie", "abonne", "/parcours"],
    ["/carnet/2026-11", "abonne", "monEspace"],
    ["/favoris", "abonne", "monEspace"],
    ["/favoris", "gratuit", "compte"],
    ["/profil", "abonne", "compte"],
    ["/lettre", "abonne", null],
    ["/lettre", "visiteur", "/lettre"],
    ["/blog/x", "abonne", "/blog"],
    ["/carnet", "visiteur", null],
    ["/", "visiteur", null],
  ] as const)("barre, %s (%s) : %s", (chemin, etat, attendu) => {
    expect(elementBarreAllume(chemin, etat)).toBe(attendu);
  });

  it.each([
    ["/mon-espace", "monEspace"],
    ["/mon-espace/bibliotheque", "bibliotheque"],
    ["/mon-espace/fiche/jeu/x", "sEntrainer"],
    ["/carnet/2026-11", "carnet"],
    ["/favoris", "favoris"],
    ["/mon-espace/fiche/bilan/bilan-repartie", null],
  ])("menu mobile de l'abonné, %s : %s", (chemin, attendu) => {
    expect(ligneEspaceAllumee(chemin)).toBe(attendu);
  });
});

describe("nom du groupe non répété à chaque ligne (relecture des captures nav s24, tour 2)", () => {
  it.each([
    ["Vocabulaire : quand on te lance une pique", "Vocabulaire", "Quand on te lance une pique"],
    ["Coloc : la poêle", "Coloc", "La poêle"],
    ["Soirée : « Tu pars déjà ? »", "Soirée", "« Tu pars déjà ? »"],
    ["Réunion : « On ne t'entend pas »", "Réunion et entretien", "« On ne t'entend pas »"],
    ["Fac : l'exposé", "Études et fac", "Fac : l'exposé"],
    ["Comment c'est construit : Le faux secret", "Comment c’est construit", "Le faux secret"],
    ["Le faux secret", "Comment c'est construit", "Le faux secret"],
  ])("%s sous « %s » : %s", (titre, groupe, attendu) => {
    expect(sansPrefixe(titre, groupe)).toBe(attendu);
  });
});

it("menu mobile de l'abonné : les 5 liens du site sur deux colonnes, « Mon profil » et « Déconnexion » dans le flux", async () => {
  drapeau.__ESPACE_OUVERT__ = true;
  useSession.mockReturnValue(SESSIONS.abonne);
  render(<EnTeteUniversel />);
  await userEvent.click(screen.getByRole("button", { name: "Menu" }));
  const menu = screen.getByRole("navigation", { name: "Navigation mobile" });
  expect(menu.querySelector("[data-liens-site]")?.className).toMatch(/grid-cols-2/);
  expect(menu.querySelector("[data-actions-compte]")?.className).not.toMatch(/sticky/);
  expect(within(menu).getByRole("link", { name: "Mon profil" })).toBeInTheDocument();
});

const vide = (nonLues = 0) => ({ nonLues, reponses: [], nouveautes: [], lettre: null });

describe("cloche (coque ; contenu au lot D8 : `cloche-s24.test.tsx`)", () => {
  it.each([
    [0, "Notifications, aucune réponse non lue"],
    [1, "Notifications, 1 réponse de l'équipe non lue"],
    [2, "Notifications, 2 réponses de l'équipe non lues"],
  ])("%i réponse(s) non lue(s) : nom « %s », pastille seulement si > 0", (n, nom) => {
    const { container } = render(<Cloche contenu={vide(n)} />);
    const bouton = screen.getByRole("button", { name: nom });
    expect(bouton.className).toMatch(/\bh-11\b/);
    expect(bouton).toHaveAttribute("aria-haspopup", "dialog");
    const pastille = container.querySelector("[data-pastille]");
    if (n === 0) expect(pastille).toBeNull();
    else {
      expect(pastille?.className).toMatch(/bg-accent-link/);
      expect(pastille?.className).not.toMatch(/animate-/);
      expect(pastille?.textContent).toBe("");
    }
  });

  it("panneau : état vide, « Fermer » et Échap ferment, focus rendu au bouton", async () => {
    render(<Cloche contenu={vide()} />);
    const bouton = screen.getByRole("button", { name: nomCloche(0) });
    await userEvent.click(bouton);
    const panneau = await screen.findByRole("dialog", { name: T.cloche.titre });
    expect(panneau).toHaveTextContent(T.cloche.vide);
    expect(within(panneau).getByRole("button", { name: T.cloche.fermer })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(bouton).toHaveFocus();
    await userEvent.click(bouton);
    await userEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: T.cloche.fermer }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(bouton).toHaveFocus();
  });
});

describe("garde-fous de fichiers (plan §2 règles 7 et 8)", () => {
  const SRC = join(__dirname, "../..");
  const arbre = (d: string): string[] =>
    readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? arbre(join(d, e.name)) : [join(d, e.name)]));
  const composants = arbre(join(SRC, "components/espace"));
  const textes = join(SRC, "config/textes/espace-navigation.ts");

  it("aucun #hex ni valeur [Npx] dans les composants de l'espace (points de rupture nommés : tailwind.config.ts)", () => {
    for (const f of [...composants, textes]) {
      const code = readFileSync(f, "utf8");
      expect([f, code.match(/#[0-9a-fA-F]{3,8}\b/g)]).toEqual([f, null]);
      expect([f, code.match(/\[[^\]]*\d+px[^\]]*\]/g)]).toEqual([f, null]);
    }
  });

  it("textes : zéro tiret cadratin, zéro émoji, aucune mention d'IA", () => {
    const code = readFileSync(textes, "utf8");
    expect(code).not.toMatch(/—/);
    expect(code).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(code).not.toMatch(/\b(IA|intelligence artificielle)\b/);
  });

  it("chaque ligne de l'index a un libellé du fichier de textes", () => {
    const libelles = Object.values(T.index) as string[];
    for (const r of INDEX_ESPACE) expect(libelles).toContain(r.label);
  });

  it("ni barre de rubriques ni menu « Plus » : fichiers supprimés", () => {
    for (const f of ["espace-barre.tsx", "espace-barre-client.tsx", "menu-plus.tsx", "styles-barre.ts", "en-tete-espace.tsx"]) {
      expect(composants.some((c) => c.endsWith(`/${f}`))).toBe(false);
    }
  });
});

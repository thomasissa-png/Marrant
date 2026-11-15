/**
 * Navigation universelle (s24, `docs/ux/navigation-universelle-s24.md` v5) : en-tête unique pour visiteur,
 * compte gratuit et abonné, index de « Mon espace », retours par type de page, élément allumé, cloche.
 * Interrupteur OUVERT seulement ici, par un mock (jamais dans le code livré) ; fermé, le test d'inertie
 * (`inertie-espace.test.tsx`) garde l'en-tête de la production.
 * s25, navigation v6 : les critères de la v5 que la bande des rubriques remplace (liens du site et « Mon espace » en
 * barre, index du menu mobile, « Retour : Mon espace », élément de barre allumé) sont retirés d'ici ; la v6 est
 * couverte par `__tests__/layout/navigation-v6-s25.test.tsx`.
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
import { RUBRIQUES } from "@/components/espace/rubriques";
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

it("menu mobile du visiteur : « Connexion » à gauche, même graisse que les liens du site (s25, tour 2, design F1 et F2)", async () => {
  drapeau.__ESPACE_OUVERT__ = true;
  useSession.mockReturnValue(SESSIONS.visiteur);
  render(<EnTeteUniversel />);
  await userEvent.click(screen.getByRole("button", { name: "Menu" }));
  const menu = screen.getByRole("navigation", { name: "Navigation mobile" });
  const connexion = within(menu).getByRole("link", { name: "Connexion" });
  expect(connexion.className).toMatch(/\bjustify-start\b/);
  expect(connexion.className).toMatch(/\bfont-medium\b/);
  expect(connexion.className).not.toMatch(/\bfont-semibold\b/);
  expect(connexion.className).toMatch(/\bmt-4\b/);
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

  it("chaque rubrique de l'espace dans la bande a un libellé du fichier de textes", () => {
    const libelles = [...Object.values(T.index), T.bande.aujourdhui, T.parcours] as string[];
    for (const r of RUBRIQUES.filter((x) => x.groupe === 1 || x.groupe === "plus")) expect(libelles).toContain(r.label);
  });

  it("ni barre de rubriques ni menu « Plus » : fichiers supprimés", () => {
    for (const f of ["espace-barre.tsx", "espace-barre-client.tsx", "menu-plus.tsx", "styles-barre.ts", "en-tete-espace.tsx"]) {
      expect(composants.some((c) => c.endsWith(`/${f}`))).toBe(false);
    }
  });
});

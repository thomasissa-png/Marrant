/**
 * Lot D2 de l'espace client (s24, `docs/espace-client/plan-developpement-s24.md` §3) :
 * barre de rubriques, en-tête abonné (loupe, cloche, compte), menu « Plus ».
 * Interrupteur OUVERT seulement ici, par un mock (jamais dans le code livré) ; fermé, le
 * test d'inertie (`inertie-espace.test.tsx`) garde l'en-tête de la production.
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
import EspaceBarreClient from "@/components/espace/espace-barre-client";
import { Cloche } from "@/components/espace/cloche";
import { RUBRIQUES, MENU_PLUS, rubriqueActive } from "@/components/espace/rubriques";
import { TEXTES_ESPACE_NAVIGATION as T, nomCloche } from "@/config/textes/espace-navigation";
import { margeIndice } from "@/components/espace/styles-barre";

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
});
beforeEach(() => {
  drapeau.__ESPACE_OUVERT__ = false;
  usePathname.mockReturnValue("/");
  useSession.mockReturnValue(SESSIONS.visiteur);
});
afterAll(() => {
  drapeau.__ESPACE_OUVERT__ = false;
});

describe("interrupteur et sessions (critères 2 et 20 du brief)", () => {
  it.each(Object.keys(SESSIONS))("fermé, %s : en-tête d'origine, ni barre ni cloche", async (etat) => {
    useSession.mockReturnValue(SESSIONS[etat as keyof typeof SESSIONS]);
    const { container } = render(<Header />);
    await act(async () => {});
    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: T.monEspace })).toBeNull();
    expect(container.innerHTML).not.toMatch(/Notifications|data-espace-barre|data-en-tete-espace/);
  });

  it.each(["visiteur", "gratuit"] as const)("ouvert, %s : ni barre ni cloche", async (etat) => {
    drapeau.__ESPACE_OUVERT__ = true;
    useSession.mockReturnValue(SESSIONS[etat]);
    const { container } = render(<Header />);
    await act(async () => {});
    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/Notifications|data-espace-barre|data-en-tete-espace/);
  });

  it("ouvert, abonné : en-tête de l'espace et barre (chargés côté navigateur), plus d'onglets d'origine", async () => {
    drapeau.__ESPACE_OUVERT__ = true;
    useSession.mockReturnValue(SESSIONS.abonne);
    usePathname.mockReturnValue("/parcours");
    render(<Header />);
    const barre = await screen.findByRole("navigation", { name: T.monEspace });
    expect(within(barre).getByRole("link", { name: T.rubriques.parcours })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("navigation", { name: "Navigation principale" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Menu" })).toBeNull();
    expect(screen.getByRole("button", { name: nomCloche(0) })).toBeInTheDocument();
  });
});

describe("barre de rubriques", () => {
  it("6 entrées au plus, libellés = espace-navigation.ts, dans l'ordre de C1", () => {
    render(<EspaceBarreClient pathname="/mon-espace" />);
    const barre = screen.getByRole("navigation", { name: T.monEspace });
    const entrees = Array.from(barre.querySelectorAll<HTMLElement>("a, button"));
    expect(entrees.length).toBeLessThanOrEqual(6);
    expect(entrees.map((e) => e.textContent?.trim())).toEqual([
      T.rubriques.aujourdhui,
      T.rubriques.parcours,
      T.rubriques.quoiRepondre,
      T.rubriques.bibliotheque,
      T.rubriques.mesQuestions,
      T.rubriques.plus,
    ]);
  });

  it.each([
    ["/mon-espace", T.rubriques.aujourdhui],
    ["/parcours/repartie", T.rubriques.parcours],
    ["/mon-espace/quoi-repondre", T.rubriques.quoiRepondre],
    ["/carnet", T.rubriques.quoiRepondre],
    ["/mon-espace/bibliotheque", T.rubriques.bibliotheque],
    ["/vannes/theme/boulot", T.rubriques.bibliotheque],
    ["/mon-espace/questions/abc", T.rubriques.mesQuestions],
    ["/mon-espace/repliques", T.rubriques.plus],
    ["/favoris", T.rubriques.plus],
  ])("%s : « %s » porte aria-current=page, une seule entrée", (chemin, libelle) => {
    render(<EspaceBarreClient pathname={chemin} />);
    const barre = screen.getByRole("navigation", { name: T.monEspace });
    const courantes = barre.querySelectorAll('[aria-current="page"]');
    expect(courantes).toHaveLength(1);
    expect(courantes[0].textContent?.trim()).toBe(libelle);
  });

  it.each(["/", "/profil", "/adresse-inexistante"])("%s : aucune entrée courante", (chemin) => {
    expect(rubriqueActive(chemin)).toBeNull();
  });

  it("« Aujourd'hui » est la première entrée, épinglée, et prend le focus au clavier", async () => {
    render(<EspaceBarreClient pathname="/mon-espace/questions" />);
    const aujourdhui = screen.getByRole("link", { name: T.rubriques.aujourdhui });
    expect(aujourdhui.className).toMatch(/sticky/);
    aujourdhui.focus();
    expect(aujourdhui).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("link", { name: T.rubriques.parcours })).toHaveFocus();
  });

  it("menu « Plus » : 3 groupes, 6 lignes dans l'ordre, Échap rend le focus", async () => {
    render(<EspaceBarreClient pathname="/mon-espace" />);
    const plus = screen.getByRole("button", { name: T.rubriques.plus });
    expect(plus).toHaveAttribute("aria-haspopup", "menu");
    plus.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await screen.findByRole("menu", { name: T.menuPlus.nom });
    expect(within(menu).getAllByRole("menuitem").map((m) => m.textContent)).toEqual(
      MENU_PLUS.flatMap((g) => g.lignes.map((l) => l.label)),
    );
    expect(menu.textContent).toContain(T.menuPlus.groupeMonContenu);
    expect(menu.textContent).toContain(T.menuPlus.groupeLeReste);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(plus).toHaveFocus();
  });
});

describe("indice de suite (margeIndice)", () => {
  /** Partie visible de la première entrée qui passe le bord, marge `x` appliquée. */
  const coupe = (largeurs: number[], zone: number, x: number) => {
    let g = 0;
    for (const w of largeurs) {
      if (g + w + 2 * x > zone) return zone - g;
      g += w + 2 * x;
    }
    return null;
  };
  // Largeurs relevées à 375 et 320 px (Chromium, Inter 14 px, marge de 12 px).
  const A_375 = [101, 84, 120, 108, 122, 72];

  it("tout tient : aucune marge ajoutée", () => {
    expect(margeIndice([100, 100, 100], 400, 12)).toBe(0);
  });
  it.each([
    [355, 12],
    [308, 12],
  ])("zone de %i px : l'entrée coupée au bord montre de 16 à 24 px", (zone, base) => {
    const x = margeIndice(A_375, zone, base);
    const visible = coupe(A_375, zone, x) ?? 0;
    expect(visible).toBeGreaterThanOrEqual(16);
    expect(visible).toBeLessThanOrEqual(24);
    expect(x).toBeGreaterThanOrEqual(-4);
    expect(x).toBeLessThanOrEqual(8);
  });
  it("l'entrée courante tient entière à côté de « Aujourd'hui » avant l'indice", () => {
    const x = margeIndice([80, 66, 98, 86, 100, 60], 188, 8, 2);
    expect(80 + 98 + 4 * x).toBeLessThanOrEqual(188);
  });
});

describe("en-tête abonné", () => {
  it("menu de compte : « Mon espace », « Mon profil », « Déconnexion » (Favoris dans « Plus »)", async () => {
    render(<EspaceBarreClient pathname="/mon-espace" />);
    await userEvent.click(screen.getByRole("button", { name: T.compte.nom }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getAllByRole("menuitem").map((m) => m.textContent?.trim())).toEqual([T.monEspace, "Mon profil", "Déconnexion"]);
    expect(within(menu).getByRole("menuitem", { name: T.monEspace })).toHaveAttribute("href", "/mon-espace");
  });

  it("recherche : loupe de 44 px qui ouvre un champ, Échap ferme et rend le focus", async () => {
    render(<EspaceBarreClient pathname="/mon-espace" />);
    const loupe = screen.getByRole("button", { name: T.recherche.ouvrir });
    expect(loupe.className).toMatch(/\bh-11\b/);
    expect(loupe.className).toMatch(/\bw-11\b/);
    await userEvent.click(loupe);
    expect(loupe).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("combobox", { name: "Rechercher" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    expect(document.getElementById("recherche-espace")).toBeNull();
    expect(loupe).toHaveFocus();
  });
});

describe("cloche (coque)", () => {
  it.each([
    [0, "Notifications, aucune réponse non lue"],
    [1, "Notifications, 1 réponse de l'équipe non lue"],
    [2, "Notifications, 2 réponses de l'équipe non lues"],
  ])("%i réponse(s) non lue(s) : nom « %s », pastille seulement si > 0", (n, nom) => {
    const { container } = render(<Cloche nonLues={n} />);
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
    render(<Cloche />);
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
  const composants = readdirSync(join(SRC, "components/espace")).map((f) => join(SRC, "components/espace", f));
  const textes = join(SRC, "config/textes/espace-navigation.ts");

  it("aucun #hex ni valeur [Npx] dans les composants de l'espace (points de rupture exceptés)", () => {
    for (const f of [...composants, textes]) {
      const code = readFileSync(f, "utf8");
      expect([f, code.match(/#[0-9a-fA-F]{3,8}\b/g)]).toEqual([f, null]);
      expect([f, code.replace(/(min|max)-\[\d+px\]:/g, "").match(/\[[^\]]*\d+px[^\]]*\]/g)]).toEqual([f, null]);
    }
  });

  it("textes : zéro tiret cadratin, zéro émoji, aucune mention d'IA", () => {
    const code = readFileSync(textes, "utf8");
    expect(code).not.toMatch(/—/);
    expect(code).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(code).not.toMatch(/\b(IA|intelligence artificielle)\b/);
  });

  it("chaque rubrique a un libellé du fichier de textes", () => {
    const libelles = Object.values(T.rubriques) as string[];
    for (const r of RUBRIQUES) expect(libelles).toContain(r.label);
  });
});

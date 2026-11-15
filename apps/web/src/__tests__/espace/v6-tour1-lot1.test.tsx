/**
 * Navigation v6, tour 1, lot 1 (espace) : `docs/espace-client/travail-en-cours/plan-corrections-v6-tour-1.md`,
 * points 1 (espace), 2, 3, 4, 5, 14, 15. Rendu ouvert seulement (fermé : /mon-espace est la 404, `/favoris` garde
 * sa grille d'avant, contrôlé ici et par `inertie-espace.test.tsx`). Mesures en vrai navigateur :
 * `playwright/tests/local/espace-v6-tour1-lot1.spec.ts`.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fireEvent, render, screen, within } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: jest.fn(),
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/mon-espace",
}));
jest.mock("next/server", () => ({ NextResponse: { json: jest.fn() } }));
jest.mock("next/headers", () => ({ headers: () => ({ get: () => null }) }));
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/prisma", () => ({ prisma: {} }));

import { BOUTON_DESTRUCTIF, BOUTON_PRINCIPAL, CADRE_CARTE, CARTE, FILET_CARTE, SOMMAIRE_REPLIABLE } from "@/components/espace/carte/styles";
import { ApercuRubrique } from "@/components/espace/apercu/apercu-rubrique";
import { CartesDuJour } from "@/components/espace/aujourdhui/cartes-du-jour";
import { GesteFiche } from "@/components/espace/carte/geste-fiche";
import { ListeRepliques } from "@/components/espace/repliques/liste-repliques";
import { TEXTES_APERCU } from "@/config/textes/espace-apercu";

const SRC = join(__dirname, "../..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const classes = (el: Element | null) => (el?.getAttribute("class") ?? "").split(/\s+/);

describe("point 1 : la carte de l'espace parle la langue de l'accueil", () => {
  it("rayon `rounded-xl`, `overflow-hidden` et filet `h-1` dégradé de l'accueil", () => {
    const accueil = lire("components/home/daily-content.tsx");
    expect(accueil).toContain("overflow-hidden rounded-xl");
    expect(accueil).toContain("h-1 bg-gradient-to-r from-accent-primary to-accent-secondary");
    expect(FILET_CARTE).toBe("before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-accent-primary before:to-accent-secondary");
    for (const c of ["relative", "overflow-hidden", "rounded-xl", ...FILET_CARTE.split(" ")]) expect(CADRE_CARTE.split(" ")).toContain(c);
    expect(CARTE).toContain(CADRE_CARTE);
  });

  it("plus aucune carte grise `rounded-lg` dans l'espace (seule la fenêtre de confirmation en garde une)", () => {
    const fichiers: string[] = [];
    const parcourir = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) parcourir(p);
        else if (/\.tsx?$/.test(n)) fichiers.push(p);
      }
    };
    parcourir(join(SRC, "components/espace"));
    parcourir(join(SRC, "app/(dashboard)/mon-espace"));
    const grises = fichiers
      .filter((f) => /rounded-lg border border-border bg-background-card/.test(readFileSync(f, "utf8")))
      .map((f) => relative(SRC, f));
    expect(grises).toEqual(["components/espace/questions/confirmer-retrait.tsx"]);
  });
});

// v6 tour 2 (arbitrage 1) : les deux colonnes du tour 1 sont abandonnées ; la mise en page est vérifiée dans
// `v6-tour2-lot1.test.tsx`. Restent ici : l'offre hors de l'exemple, à filet, et ses deux liens.
describe("point 2 : aperçu, offre hors de l'exemple (mise en page : v6 tour 2)", () => {
  it.each(["aujourdhui", "quoiRepondre", "bibliotheque", "sEntrainer", "mesQuestions", "mesRepliques", "favoris"] as const)("%s", (rubrique) => {
    const { container } = render(<ApercuRubrique rubrique={rubrique} visiteur />);
    const article = container.querySelector("article") as HTMLElement;
    const offre = container.querySelector("[data-apercu-offre]") as HTMLElement;
    expect(article.contains(offre)).toBe(false);
    expect(classes(offre)).toEqual(expect.arrayContaining(["rounded-xl", "before:h-1"]));
    const liens = within(offre).getAllByRole("link");
    expect(liens.map((l) => l.className)).toEqual([BOUTON_PRINCIPAL, expect.stringContaining("min-h-11")]);
    expect(liens[1].textContent).toBe(TEXTES_APERCU.connexion);
  });

  it("S'entraîner : « Ce qu'on aurait pu dire » ouvert dans l'aperçu", () => {
    const { container } = render(<ApercuRubrique rubrique="sEntrainer" visiteur={false} />);
    const details = container.querySelector("[data-apercu-fiche] details") as HTMLDetailsElement;
    expect(details.open).toBe(true);
  });
});

describe("point 4 : Aujourd'hui, l'action du jour pleine coque et dominante", () => {
  const cartes = [{ titre: "Une carte", href: "/mon-espace/s-entrainer#carte-1", nouvelle: true }];

  it("rafale principale : filet, `md:p-8`, titre `md:text-3xl` ; secondaire (rafale faite) : non", () => {
    const { container, unmount } = render(<CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini={false} />);
    expect(classes(container.querySelector("section"))).toEqual(expect.arrayContaining(["md:p-8", "rounded-xl", "before:h-1"]));
    expect(classes(container.querySelector("h2"))).toContain("md:text-3xl");
    unmount();
    const secondaire = render(<CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini principale={false} />).container;
    expect(classes(secondaire.querySelector("section"))).not.toContain("md:p-8");
    expect(classes(secondaire.querySelector("h2"))).not.toContain("md:text-3xl");
  });

  it("page : plus de colonne 2 vide ; secondaires côte à côte, le dernier impair sur toute la rangée", () => {
    const page = lire("app/(dashboard)/mon-espace/page.tsx");
    expect(page).not.toContain('md:grid-cols-2" data-aujourdhui-grille');
    expect(page).toContain('className="grid grid-cols-1 gap-6 md:grid-cols-2 md:[&>:last-child:nth-child(odd)]:col-span-2" data-aujourdhui-secondaires');
    const jour = lire("components/espace/aujourdhui/contenu-du-jour.tsx");
    expect(jour).toContain("grid grid-cols-1 items-stretch gap-6");
    expect(jour).not.toContain("md:max-w-md");
    expect(jour).not.toMatch(/bg-red/);
  });
});

describe("point 5 : fiches", () => {
  it("geste seul dans sa carte : plus de filet en tête ; sous un corps de carte : le filet reste", () => {
    const props = { ficheId: "f", consigne: "Consigne", retourInitial: null, repliqueInitiale: null };
    const { unmount } = render(<GesteFiche {...props} />);
    expect(classes(screen.getByTestId("geste-fiche"))).toContain("border-t");
    unmount();
    render(<GesteFiche {...props} separe={false} />);
    expect(classes(screen.getByTestId("geste-fiche"))).not.toContain("border-t");
    expect(lire("components/espace/fiche.tsx")).toContain("separe={false}");
  });

  it("tout `<summary>` qui révèle du contenu : bouton secondaire de 44 px avec chevron", () => {
    for (const f of ["components/espace/fiche/corps-divers.tsx", "components/espace/fiche/corps-technique.tsx", "components/espace/questions/fil.tsx"]) {
      const source = lire(f);
      expect(source).toContain("<summary className={SOMMAIRE_REPLIABLE}>");
      expect(source).toContain("<ChevronRepli />");
      expect(source).toContain("group/repli");
    }
    expect(SOMMAIRE_REPLIABLE).toMatch(/\bmin-h-11\b.*\bborder-border-input\b/);
  });
});

describe("points 14 et 15", () => {
  it("Favoris abonné, ouvert : colonnes égales, plus de `col-span-2` isolé ; fermé : la grille d'avant", () => {
    const source = lire("components/favoris/favoris-list.tsx");
    expect(source).toContain('"grid items-stretch gap-4 md:grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3"');
    expect(source).not.toContain("md:col-span-2 lg:col-span-1");
    expect(source).toContain(': "grid gap-4 md:grid-flow-row-dense md:grid-cols-2"');
    expect(source).toContain('!ESPACE_CLIENT_PUBLIE && fav.id === dernierCourtSeul ? " md:col-span-2" : ""');
  });

  it("Mes répliques : même colonne vide ou pleine, première réplique en bouton plein, « Supprimer » destructif", () => {
    // v6 tour 2 (point 6) : même coque que Mes questions, la liste garde sa largeur de lecture, calée à gauche.
    expect(lire("app/(dashboard)/mon-espace/repliques/page.tsx")).toContain('<div className="w-full max-w-3xl">');
    const { unmount } = render(<ListeRepliques initiales={[]} lectureSeule={false} />);
    expect(within(screen.getByTestId("repliques-vide")).getByRole("link").className).toBe(BOUTON_PRINCIPAL);
    unmount();
    const r = { ficheId: "f1", texte: "Ma réplique", titre: null, href: null, modifieLe: "2026-11-15" };
    render(<ListeRepliques initiales={[r]} lectureSeule={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    const [supprimer, annuler] = within(screen.getByRole("group")).getAllByRole("button");
    expect(supprimer.className).toBe(BOUTON_DESTRUCTIF);
    expect(annuler.className).not.toBe(BOUTON_DESTRUCTIF);
  });

  it("Mes questions : « Retirer » de la confirmation en style destructif, « Annuler » en secondaire", () => {
    const source = lire("components/espace/questions/confirmer-retrait.tsx");
    expect(source).toContain("className={`${BOUTON_DESTRUCTIF} max-e300:w-full`} aria-busy={enCours}");
    expect(source).toContain("<Dialog.Close ref={annuler} className={`${BOUTON_SECONDAIRE} max-e300:w-full`}");
  });
});

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
    // s26 DA du site (décision de Thomas du 20/11) : le bandeau de l'accueil est extrait dans `home/da-site.tsx` (même
    // chaîne), que `daily-content.tsx` importe.
    const accueil = lire("components/home/daily-content.tsx");
    const daSite = lire("components/home/da-site.tsx");
    expect(accueil).toContain("overflow-hidden rounded-xl");
    expect(accueil).toContain("<div className={BANDEAU_ACCUEIL} />");
    expect(daSite).toContain("h-1 bg-gradient-to-r from-accent-primary to-accent-secondary");
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
  // s26 : Favoris passe à `ApercuVerrouille` (`apercu-rubriques.test.tsx`), il sort de cet ancien aperçu.
  it.each(["aujourdhui", "quoiRepondre", "bibliotheque", "sEntrainer", "mesQuestions", "mesRepliques"] as const)("%s", (rubrique) => {
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

  // Échelle s25 (`docs/design/typo-harmonie-espace-s25.md`) : la dominance vient de la place, du fond et du seul bouton
  // plein, plus de la taille : même marge (24 px) et même titre (20 px) partout. v7 tour 7 (décision de Thomas du
  // 16/11) : plus de filet violet sur « Aujourd'hui », Z1 se distingue par un fond un cran plus clair.
  it("rafale principale : teinte légère et bouton plein, sans filet ; secondaire (rafale faite) : sans filet ; marge et titre de l'échelle", () => {
    const { container, unmount } = render(<CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini={false} />);
    // v7 tour 8 : Z1, seule zone d'accent, teinte violette légère et bord doux (plus le fond élevé neutre du tour 7).
    expect(classes(container.querySelector("section"))).toEqual(expect.arrayContaining(["p-6", "rounded-xl", "from-accent-primary/10", "border-accent-primary/40"]));
    expect(classes(container.querySelector("section")).some((c) => c.startsWith("before:"))).toBe(false);
    expect(classes(container.querySelector("h2"))).toEqual(expect.arrayContaining(["text-xl", "font-semibold"]));
    expect(container.querySelector("a.bg-accent-secondary-hover")).not.toBeNull();
    unmount();
    const secondaire = render(<CartesDuJour cartes={cartes} href="/mon-espace/s-entrainer" fini principale={false} />).container;
    expect(classes(secondaire.querySelector("section"))).not.toContain("before:h-1");
    expect(classes(secondaire.querySelector("h2"))).toEqual(expect.arrayContaining(["text-xl", "font-semibold"]));
  });

  // Refonte s25 (`docs/design/aujourdhui-refonte-s25.md` §5.1) : la grille 12 colonnes remplace la colonne et ses
  // secondaires ; même intention (jamais une cellule vide) : rangée 2 partagée 3 x 4, 2 x 6 ou 1 x 12.
  it("page : plus de colonne vide ; rangée 2 partagée en 12 colonnes selon le nombre de zones présentes", () => {
    const page = lire("app/(dashboard)/mon-espace/page.tsx");
    expect(page).toContain('className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-cols-12 max-e300:mt-3" data-aujourdhui-grille');
    expect(page).toContain('if (n >= 3) return i === 2 ? "md:col-span-2 lg:col-span-4" : "lg:col-span-4";');
    // v7 tour 2 : 2 zones = 2 x 6 dès 1024, l'une sous l'autre à 768 (plus de tuile creusée par sa voisine).
    expect(page).toContain('if (n === 2) return "md:col-span-2 lg:col-span-6";');
    // v7 tour 7 (point 5) : parcours et mission seuls, 5 + 7 (comme le nouvel abonné) : 12 colonnes, aucune vide.
    // v7 tour 11 : côte à côte dès 768 aussi (grille en 5 + 7 de 768 à 1023), la barre empilée dans la tuile du parcours.
    expect(page).toContain('span: paireParcoursMission ? "lg:col-span-5" : undefined');
    expect(page).toContain('span: paireParcoursMission ? "lg:col-span-7" : undefined');
    expect(page).toContain("<ParcoursTuile etape={etape} colonne={paireParcoursMission} />");
    expect(page).toContain('return "md:col-span-2 lg:col-span-12";');
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
    // v6 tour 4 (point 7) : 6 colonnes dès `lg` pour recomposer la dernière rangée sans orpheline ; cartes d'une même
    // rangée toujours de même largeur et de même hauteur (`v6-tour4-lot1.test.tsx`).
    expect(source).toContain('"grid items-stretch gap-4 md:grid-flow-row-dense md:grid-cols-2 lg:grid-cols-6"');
    expect(source).not.toContain("md:col-span-2 lg:col-span-1");
    expect(source).toContain(': "grid gap-4 md:grid-flow-row-dense md:grid-cols-2"');
    expect(source).toContain('!ESPACE_CLIENT_PUBLIE && fav.id === dernierCourtSeul ? " md:col-span-2" : ""');
  });

  it("Mes répliques : même colonne vide ou pleine, première réplique en bouton plein, « Supprimer » destructif", () => {
    // v6 tour 3 (arbitrage 3, remplace le tour 2) : la liste en grille pleine coque, l'état vide centré.
    // s26 DA, aujourd'hui questions répliques (T8) : la page passe aussi les fiches proposées au champ d'écriture.
    expect(lire("app/(dashboard)/mon-espace/repliques/page.tsx")).toContain("<ListeRepliques initiales={repliques} lectureSeule={false} grille aEcrire={aEcrire} />");
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

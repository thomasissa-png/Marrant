/**
 * Navigation v6, tour 3, lot 1 (espace) : `docs/espace-client/travail-en-cours/plan-corrections-v6-tour-3.md`,
 * points 1 (espace et favoris), 2, 3, 4, 6 et 7. Rendu ouvert seulement (fermé : /mon-espace est la 404, `/favoris`
 * garde ses classes d'avant, contrôlé ici et par `inertie-espace.test.tsx`). Mesures en vrai navigateur :
 * `playwright/tests/local/espace-v6-tour3-lot1.spec.ts`.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { render, screen, within } from "@testing-library/react";

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

import { CARTE, EN_TETE_CENTRE, LIEN, LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { ApercuRubrique } from "@/components/espace/apercu/apercu-rubrique";
import { categoriesQuoiRepondre, ficheApercu } from "@/components/espace/apercu/exemples";
import { CorpsSituation } from "@/components/espace/fiche/corps-situation";
import { ListeRepliques } from "@/components/espace/repliques/liste-repliques";
import { LienRetour } from "@/components/espace/lien-retour";
import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { frEspaceProfond } from "@/lib/fr-typo";

const SRC = join(__dirname, "../..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const classes = (el: Element | null) => (el?.getAttribute("class") ?? "").split(/\s+/);
// Textes tels qu'affichés (typographie de l'espace : espaces insécables).
const C = frEspaceProfond(TEXTES_CARTES);

describe("point 1 : en-têtes des rubriques centrés comme l'accueil (ouvert)", () => {
  it("le centrage pose `text-center` et le sous-titre en `mx-auto`, sans toucher `PageHeader`", () => {
    expect(EN_TETE_CENTRE).toBe("text-center [&_header>p]:mx-auto");
  });

  it.each(["questions", "repliques"])("rubrique %s : `PageHeader` dans le conteneur centré", (r) => {
    expect(lire(`app/(dashboard)/mon-espace/${r}/page.tsx`)).toMatch(/<div className=\{EN_TETE_CENTRE\}>\s*<PageHeader /);
  });

  // s26 (`docs/design/rubriques-abonne-s26.md` §0, spec UX §2.2) : vue abonné alignée à gauche comme « Aujourd'hui ».
  it.each(["bibliotheque", "s-entrainer", "quoi-repondre"])("rubrique %s (s26) : en-tête à gauche, H1 en `TITRE_PAGE`, plus centré", (r) => {
    const page = lire(`app/(dashboard)/mon-espace/${r}/page.tsx`);
    expect(page).toMatch(/<header>\s*<h1 className=\{TITRE_PAGE\}>/);
    expect(page).not.toMatch(/EN_TETE_CENTRE|PageHeader|text-center/);
  });

  it.each(["quoi-repondre/loading.tsx", "quoi-repondre/error.tsx", "questions/loading.tsx", "questions/error.tsx"])("%s : même en-tête centré", (f) => {
    expect(lire(`app/(dashboard)/mon-espace/${f}`)).toContain("[&>header]:text-center");
  });

  // s26 (`docs/design/parcours-vannes-s26.md` §1.2) : /parcours de l'abonné sort de cette règle, titre blanc à gauche
  // (`TITRE_PAGE`) dans la colonne de 8.
  it("/parcours abonné (`ParcoursEspace`, rendu ouvert seulement) : H1 à gauche (s26)", () => {
    const source = lire("components/espace/parcours/parcours-espace.tsx");
    expect(source).toContain('<h1 className={cn(TITRE_PAGE, "mb-8 max-e300:mb-3", COLONNE)}>');
    expect(source).not.toContain("text-center");
    expect(source).toContain("if (!ESPACE_CLIENT_PUBLIE || !premium) return null;");
  });

  // Refonte s25 (`docs/design/aujourdhui-refonte-s25.md` §2, retour de Thomas du 16/11) : « Aujourd'hui » devient un
  // tableau de bord, en-tête aligné à gauche sur la barre (H1, date), repère à droite ; il sort de cette règle.
  it("Aujourd'hui : l'en-tête aligné à gauche (refonte s25), plus centré", () => {
    const page = lire("app/(dashboard)/mon-espace/page.tsx");
    expect(page).toContain('<header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">');
    expect(page).not.toContain("text-center");
  });

  // s26 (`docs/design/favoris-carnet-s26.md` §2.1) : ouvert, l'en-tête de l'abonné passe à gauche en `TITRE_PAGE` (comme
  // les rubriques de l'espace) ; fermé, classes d'avant (rendu octet pour octet : `inertie-espace`).
  it("/favoris fermé : le titre garde ses classes d'avant ; ouvert (s26) : aligné à gauche, `TITRE_PAGE`", () => {
    const page = lire("app/(dashboard)/favoris/page.tsx");
    expect(page).toContain('<div className="mb-8">');
    expect(page).toContain("<h1 className={TITRE_PAGE}>{TITRE}</h1>");
    expect(page).not.toContain("text-center");
    expect(page).toMatch(/\n {2}return <ContenuFavoris \/>;\n\}/);
  });
});

// v6 tour 4 (arbitrage 1, Thomas) : la grille de cartes jumelles du tour 3 est remplacée par une colonne centrée
// (`v6-tour4-lot1.test.tsx`). Intention gardée : aucun trou dans une carte, aucune colonne vide à côté d'une carte.
describe("point 2 : S'entraîner, aucun trou dans une carte ni à côté (colonne centrée depuis le tour 4)", () => {
  // s26 : cadre selon la place (`cadreCarte` : zone d'action ou corps replié ; mission : `CADRE_CARTE_RUBRIQUE`), même
  // intention : ni étirement, ni colonnes internes.
  it("cartes et mission : un cadre, ni étirement ni colonnes internes (s26)", () => {
    for (const f of ["components/espace/carte/carte-registre.tsx", "components/espace/carte/carte-et-toi.tsx", "components/espace/mission/mission-carte.tsx"]) {
      const source = lire(f);
      expect(source).toMatch(/className=\{cadreCarte\(cadre\)\}|className=\{cn\(CADRE_CARTE_RUBRIQUE, /);
      expect(source).not.toMatch(/Entrainement\(|h-full|mt-auto|md:contents|lg:grid-cols-2/);
    }
  });

  it("la page : grille 7/5 dès 1024 px (s26), jamais de grille à deux colonnes dès 768, plus de `max-w-prose`", () => {
    const page = lire("app/(dashboard)/mon-espace/s-entrainer/page.tsx");
    // s26 tour 2 : la marge haute de la grille dépend des segments de rafale, sortis pleine largeur sous l'en-tête.
    expect(page).toContain('"grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start"');
    expect(page).not.toMatch(/md:grid-cols-2|md:col-span-2|max-w-prose/);
    expect(CARTE).toContain("space-y-4");
  });
});

describe("point 3 : Mes répliques, grille pleine coque, état vide centré", () => {
  const r = { ficheId: "f1", texte: "Ma réplique", titre: null, href: null, modifieLe: "2026-11-15" };

  it("page : grille dès deux répliques (`md:grid-cols-2 xl:grid-cols-3`, cartes de même hauteur)", () => {
    render(<ListeRepliques initiales={[r, { ...r, ficheId: "f2" }]} lectureSeule={false} grille />);
    const ul = screen.getByRole("list");
    expect(classes(ul)).toEqual(expect.arrayContaining(["grid", "md:grid-cols-2", "xl:grid-cols-3"]));
    expect(classes(ul.querySelector("li"))).toEqual(expect.arrayContaining(["flex", "flex-col"]));
  });

  it("page, une seule réplique : colonne centrée `mx-auto max-w-3xl` (jamais une carte calée à gauche)", () => {
    render(<ListeRepliques initiales={[r]} lectureSeule={false} grille />);
    expect(classes(screen.getByRole("list"))).toEqual(expect.arrayContaining(["mx-auto", "max-w-3xl"]));
  });

  it("page, sans réplique : l'état vide en colonne centrée `mx-auto max-w-3xl`", () => {
    render(<ListeRepliques initiales={[]} lectureSeule={false} grille />);
    expect(classes(screen.getByTestId("repliques-vide"))).toEqual(expect.arrayContaining(["mx-auto", "max-w-3xl"]));
  });

  it("profil (lecture seule, sans `grille`) : le rendu d'avant", () => {
    const { unmount } = render(<ListeRepliques initiales={[r]} lectureSeule />);
    expect(screen.getByRole("list").className).toBe("flex flex-col gap-3");
    unmount();
    render(<ListeRepliques initiales={[]} lectureSeule />);
    expect(classes(screen.getByTestId("repliques-vide"))).not.toContain("mx-auto");
  });
});

// s26 (`docs/ux/favoris-carnet-s26.md` §1.2) : la colonne unique du tour 3 laisse place à la grille 12 col de
// `ApercuVerrouille` (5/7, `v6-tour2-lot1.test.tsx`) ; intention gardée : jamais de colonne vide à côté d'une carte.
describe("point 4 : aperçu Favoris, aucune colonne vide (s26 : grille 5/7)", () => {
  it("catalogue vide : deux tuiles fermées 6/6, jamais une seule", () => {
    const source = lire("components/espace/apercu/apercu-favoris.tsx");
    expect(source).toMatch(/<TypeFerme type="JOKE" className="lg:col-span-6" \/>\s*<TypeFerme type="TIP" className="lg:col-span-6" \/>/);
  });
});

describe("point 6 : aperçus avec situation, fiche en entier, sans porte ni boutons", () => {
  it.each(["quoiRepondre", "aujourdhui"] as const)("%s : suite rendue, ni « Tu avais une réponse ? » ni « Oui »", (rubrique) => {
    const { container } = render(<ApercuRubrique rubrique={rubrique} visiteur />);
    expect(screen.getByTestId("fiche-suite")).toBeTruthy();
    expect(container.textContent).not.toContain(C.question);
    expect(container.textContent).not.toContain(C.reponseDabord);
    expect(container.textContent).not.toContain(C.consigne);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });

  it("fiche de l'abonné (sans `suiteOuverte`) : la porte et ses trois boutons, suite cachée, comme avant", () => {
    const f = ficheApercu("quoiRepondre");
    if (f.type !== "situation") throw new Error("situation attendue");
    const { container } = render(
      <CorpsSituation premierePhrase={false} scene={f.contenu.scene} repliques={f.contenu.repliques} quandMonter={f.contenu.quandMonterDUnCran} erreur={f.contenu.erreur} />,
    );
    expect(container.textContent).toContain(C.question);
    expect(container.querySelectorAll("button")).toHaveLength(3);
    expect(screen.queryByTestId("fiche-suite")).toBeNull();
  });

  it("Quoi répondre : le catalogue en lecture seule sous l'exemple (libellés et effectifs existants)", () => {
    const groupes = categoriesQuoiRepondre();
    expect(groupes.length).toBeGreaterThan(1);
    expect(groupes[0]).toEqual(expect.objectContaining({ cle: "coloc", titre: TEXTES_QUOI_REPONDRE.univers.coloc }));
    const { container } = render(<ApercuRubrique rubrique="quoiRepondre" visiteur />);
    const catalogue = container.querySelector("[data-apercu-catalogue]") as HTMLElement;
    const items = within(catalogue).getAllByRole("listitem");
    expect(items).toHaveLength(groupes.length);
    expect(items[0].textContent?.replace(/\s/g, " ")).toBe(`${groupes[0].titre} (${groupes[0].nombre})`);
    expect(catalogue.querySelectorAll("a, button")).toHaveLength(0);
    // Sous l'exemple, avant l'offre.
    const ordre = Array.from(container.querySelectorAll("article, [data-apercu-catalogue], [data-apercu-offre]"));
    expect(ordre.map((e) => e.tagName === "ARTICLE" ? "exemple" : e.hasAttribute("data-apercu-offre") ? "offre" : "catalogue")).toEqual(["exemple", "catalogue", "offre"]);
  });

  it("les autres aperçus n'ont pas de catalogue", () => {
    const { container } = render(<ApercuRubrique rubrique="bibliotheque" visiteur />);
    expect(container.querySelector("[data-apercu-catalogue]")).toBeNull();
  });
});

describe("point 7 : liens autonomes en cible de 44 px", () => {
  it("`LIEN` (Vannes / Conseils / Vidéos, Connexion, Définition complète) et le retour des fiches", () => {
    expect(LIEN.split(" ")).toEqual(expect.arrayContaining(["inline-flex", "min-h-11", "items-center"]));
    render(<LienRetour href="/mon-espace/bibliotheque" label="Bibliothèque" />);
    expect(classes(screen.getByRole("link"))).toEqual(expect.arrayContaining(["inline-flex", "min-h-11", "items-center"]));
    // s26 (spec design §0) : liens secondaires de la Bibliothèque en `LIEN_NEUTRE` (jamais violet), même cible de 44 px.
    expect(LIEN_NEUTRE.split(" ")).toEqual(expect.arrayContaining(["inline-flex", "min-h-11", "items-center"]));
    expect(lire("components/espace/bloc-bibliotheque.tsx")).toContain("<Link href={c.href} className={LIEN_NEUTRE}>");
    expect(lire("components/espace/fiche/corps-technique.tsx")).toContain("<Link href={m.definitionComplete} className={LIEN}>");
    expect(lire("components/espace/apercu/apercu-rubrique.tsx")).toContain("className={`${LIEN} min-w-11`}");
  });
});

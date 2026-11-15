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

import { ACTIONS_ENTRAINEMENT, CARTE, EN_TETE_CENTRE, LIEN, cadreEntrainement, texteEntrainement } from "@/components/espace/carte/styles";
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

  it.each(["bibliotheque", "s-entrainer", "quoi-repondre", "questions", "repliques"])("rubrique %s : `PageHeader` dans le conteneur centré", (r) => {
    expect(lire(`app/(dashboard)/mon-espace/${r}/page.tsx`)).toMatch(/<div className=\{EN_TETE_CENTRE\}>\s*<PageHeader /);
  });

  it.each(["quoi-repondre/loading.tsx", "quoi-repondre/error.tsx", "questions/loading.tsx", "questions/error.tsx"])("%s : même en-tête centré", (f) => {
    expect(lire(`app/(dashboard)/mon-espace/${f}`)).toContain("[&>header]:text-center");
  });

  it("Aujourd'hui : l'en-tête de la page centré", () => {
    expect(lire("app/(dashboard)/mon-espace/page.tsx")).toContain('<header className="mb-8 text-center md:mb-10">');
  });

  it("/favoris fermé : le titre garde ses classes d'avant (rendu octet pour octet : `inertie-espace`) ; ouvert : centré", () => {
    const page = lire("app/(dashboard)/favoris/page.tsx");
    expect(page).toContain('<div className={centre ? "mb-8 text-center" : "mb-8"}>');
    expect(page).toContain("<ContenuFavoris centre />");
    expect(page).toMatch(/\n {2}return <ContenuFavoris \/>;\n\}/);
  });
});

describe("point 2 : S'entraîner, cartes jumelles de même hauteur, carte seule répartie dès `lg`", () => {
  it("jumelle : pleine hauteur, texte extensible, actions en bas ; seule : deux colonnes dès `lg`", () => {
    expect(cadreEntrainement(false)).toBe(`${CARTE} flex h-full flex-col`);
    expect(texteEntrainement(false).split(" ")).toContain("flex-1");
    expect(cadreEntrainement(true)).toBe(`${CARTE} lg:grid lg:grid-cols-2 lg:gap-x-8 lg:space-y-0`);
    expect(texteEntrainement(true).split(" ")).not.toContain("flex-1");
    expect(ACTIONS_ENTRAINEMENT).toBe("min-w-0 space-y-4");
  });

  it("la page passe `seule` aux cartes, la grille en `items-stretch`, plus de mesure plafonnée", () => {
    const page = lire("app/(dashboard)/mon-espace/s-entrainer/page.tsx");
    expect(page).toContain('"grid grid-cols-1 items-stretch gap-6 md:grid-cols-2"');
    expect(page.match(/seule=\{seuleSurSaLigne\}/g)).toHaveLength(2);
    expect(page).not.toMatch(/max-w-prose/);
    for (const f of ["components/espace/carte/carte-registre.tsx", "components/espace/carte/carte-et-toi.tsx"]) {
      expect(lire(f)).toContain("className={cadreEntrainement(seule)}");
    }
    expect(lire("components/espace/mission/mission-carte.tsx")).toContain("className={cadreEntrainement(true)}");
  });
});

describe("point 3 : Mes répliques, grille pleine coque, état vide centré", () => {
  const r = { ficheId: "f1", texte: "Ma réplique", titre: null, href: null, modifieLe: "2026-11-15" };

  it("page : grille ; liste en `md:grid-cols-2 xl:grid-cols-3`, cartes de même hauteur", () => {
    render(<ListeRepliques initiales={[r]} lectureSeule={false} grille />);
    const ul = screen.getByRole("list");
    expect(classes(ul)).toEqual(expect.arrayContaining(["grid", "md:grid-cols-2", "xl:grid-cols-3"]));
    expect(classes(ul.querySelector("li"))).toEqual(expect.arrayContaining(["flex", "flex-col"]));
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

describe("point 4 : aperçu Favoris, les deux contenus l'un sous l'autre", () => {
  it("plus de deux colonnes", () => {
    const source = lire("components/espace/apercu/exemple.tsx");
    expect(source).toContain('<ul className="grid grid-cols-1 gap-4" data-apercu-fiche="favoris-exemples">');
    expect(source).not.toMatch(/className="[^"]*sm:grid-cols-2/);
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
    expect(lire("components/espace/bloc-bibliotheque.tsx")).toContain("<Link href={c.href} className={LIEN}>");
    expect(lire("components/espace/fiche/corps-technique.tsx")).toContain("<Link href={m.definitionComplete} className={LIEN}>");
    expect(lire("components/espace/apercu/apercu-rubrique.tsx")).toContain("className={`${LIEN} min-w-11`}");
  });
});

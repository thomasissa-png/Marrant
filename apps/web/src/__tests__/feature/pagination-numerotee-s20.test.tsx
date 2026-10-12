/**
 * @jest-environment node
 */
/**
 * s20, spec maillage S1 (docs/seo/maillage-decouverte-s20.md §4) : pagination numérotée.
 * Le HTML SERVEUR (renderToString, sans JS) de chaque liste contient un lien vers
 * chaque page (page 1 = URL de base), la page courante en <span aria-current="page">
 * sans lien ; canonique inchangée, ?page= hors bornes toujours 404.
 */
import { renderToString } from "react-dom/server";
import { ListPagination } from "@/components/ui/list-pagination";
import { VannesList } from "@/components/vannes/vannes-list";
import { paginationGridColumns, paginationItems } from "@/lib/list-pagination";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/vannes",
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));
jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: () => ({
    isFavorite: () => false,
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getFavoriteId: () => null,
  }),
}));

const mockGetJokesPage = jest.fn();
jest.mock("@/lib/catalogue-pages", () => ({
  getJokesPage: (page: number) => mockGetJokesPage(page),
}));
jest.mock("@/lib/content-stats-server", () => ({
  getContentStatsRounded: async () => ({ jokes: 140, tips: 120, videos: 80 }),
}));

/** Liens de la pagination dans un HTML : href → texte accessible (aria-label). */
function paginationLinks(html: string): { href: string; label: string | null }[] {
  const nav = html.match(/<nav aria-label="Pagination"[\s\S]*?<\/nav>/)?.[0] ?? "";
  return Array.from(nav.matchAll(/<a ([^>]*)>/g)).map((m) => ({
    href: (m[1].match(/href="([^"]*)"/)?.[1] ?? "").replace(/&amp;/g, "&"),
    label: m[1].match(/aria-label="([^"]*)"/)?.[1] ?? null,
  }));
}

function numberedTargets(html: string, basePath: string): number[] {
  return paginationLinks(html)
    .filter((l) => l.label !== null && /^Page \d+$/.test(l.label))
    .map((l) => (l.href === basePath ? 1 : Number(l.href.split("?page=")[1])))
    .sort((a, b) => a - b);
}

function currentPage(html: string): number | null {
  const m = html.match(/<span aria-current="page"[^>]*><span[^>]*>Page <\/span>(\d+)<span[^>]*> sur (?:<!-- -->)?\d+<\/span><\/span>/);
  return m ? Number(m[1]) : null;
}

describe("paginationItems", () => {
  it("≤ 15 pages : toutes les pages", () => {
    expect(paginationItems(1, 12)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(paginationItems(8, 8)).toHaveLength(8);
    expect(paginationItems(3, 15)).toHaveLength(15);
    expect(paginationItems(1, 1)).toEqual([]);
  });

  it("> 15 pages : 1, 2, courante ±2, avant-dernière, dernière, « … » entre les trous", () => {
    expect(paginationItems(10, 30)).toEqual([1, 2, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 29, 30]);
    expect(paginationItems(1, 30)).toEqual([1, 2, 3, "ellipsis", 29, 30]);
    expect(paginationItems(30, 30)).toEqual([1, 2, "ellipsis", 28, 29, 30]);
    expect(paginationItems(4, 16)).toEqual([1, 2, 3, 4, 5, 6, "ellipsis", 15, 16]);
  });
});

describe("ListPagination : HTML serveur", () => {
  it.each([
    ["/vannes", 1, 12],
    ["/vannes", 12, 12],
    ["/conseils", 7, 12],
    ["/videos", 8, 8],
  ])("%s page %i / %i : un lien par page, la courante sans lien", (basePath, page, totalPages) => {
    const html = renderToString(<ListPagination basePath={basePath} page={page} totalPages={totalPages} />);
    const expected = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p !== page);
    expect(numberedTargets(html, basePath)).toEqual(expected);
    expect(currentPage(html)).toBe(page);
    // Page courante : aucun lien vers elle-même dans la rangée.
    const self = page === 1 ? basePath : `${basePath}?page=${page}`;
    expect(paginationLinks(html).filter((l) => l.label === `Page ${page}` || (l.label && l.href === self))).toEqual([]);
    // Liens réels, jamais masqués (ni classe `hidden` ni display:none), jamais nofollow.
    // `aria-hidden` (chevrons, « … », extrémité inactive) et `sr-only` restent permis.
    expect(html).not.toMatch(/nofollow|display:\s*none/);
    expect(html).not.toMatch(/class="[^"]*\bhidden\b/);
    // Libellés Précédent / Suivant présents dans le HTML serveur.
    expect(html).toContain("Précédent");
    expect(html).toContain("Suivant");
    // Page 1 = URL de base, sans ?page=1.
    expect(html).not.toContain("?page=1\"");
  });

  it("> 15 pages : « … » non lié", () => {
    const html = renderToString(<ListPagination basePath="/vannes" page={10} totalPages={30} />);
    expect(numberedTargets(html, "/vannes")).toEqual([1, 2, 8, 9, 11, 12, 29, 30]);
    expect(html.match(/…/g)).toHaveLength(2);
    expect(paginationLinks(html).some((l) => l.label === null && l.href.includes("…"))).toBe(false);
  });

  it("cible tactile 44 px sur mobile et tablette tactile, pas régulier des numéros", () => {
    const html = renderToString(<ListPagination basePath="/vannes" page={6} totalPages={12} />);
    expect(html).toContain("max-md:h-11");
    expect(html).toContain("max-md:min-w-11");
    expect(html).toContain("[@media(pointer:coarse)]:h-11");
    expect(html).toContain("touch-manipulation");
    expect(html).toContain("tabular-nums");
    expect(html).toContain("md:min-w-8");
  });

  it("page courante : aria-current, violet du site, « sur Y » pour les lecteurs d'écran", () => {
    const html = renderToString(<ListPagination basePath="/vannes" page={6} totalPages={12} />);
    const current = html.match(/<span aria-current="page" class="([^"]*)">([\s\S]*?)<\/span><\/li>/);
    expect(current).not.toBeNull();
    expect(current![1]).toEqual(expect.stringContaining("bg-accent-secondary-hover"));
    expect(current![1]).toEqual(expect.stringContaining("text-white"));
    expect(current![1]).toEqual(expect.stringContaining("cursor-default"));
    expect(current![2].replace(/<[^>]+>/g, "")).toBe("Page 6 sur 12");
  });

  it("extrémités inactives : span aria-hidden de même taille, jamais de bouton désactivé", () => {
    const first = renderToString(<ListPagination basePath="/vannes" page={1} totalPages={12} />);
    const last = renderToString(<ListPagination basePath="/vannes" page={12} totalPages={12} />);
    for (const html of [first, last]) {
      expect(html).not.toContain("<button");
      expect(html).not.toMatch(/\sdisabled(=|>|\s)/); // attribut, pas les variantes `disabled:`
    }
    expect(first).toMatch(/<li class="flex md:mr-3"><span aria-hidden="true" class="[^"]*max-md:h-11[^"]*">/);
    expect(last).toMatch(/<li class="flex md:ml-3"><span aria-hidden="true" class="[^"]*max-md:h-11[^"]*">/);
    expect(paginationLinks(first).find((l) => l.label === "Page suivante (page 2)")?.href).toBe("/vannes?page=2");
    expect(paginationLinks(last).find((l) => l.label === "Page précédente (page 11)")?.href).toBe("/vannes?page=11");
  });

  it("grille mobile : une seule liste (Précédent, numéros, Suivant), rangées égales", () => {
    const html = renderToString(<ListPagination basePath="/vannes" page={6} totalPages={12} />);
    expect(html.match(/<ol /g)).toHaveLength(1);
    expect(html).toMatch(/<ol role="list" style="--cols:7;--cols-xs:5"/);
    expect(html).toContain("grid-cols-[repeat(var(--cols),minmax(0,1fr))]");
    expect(html).toContain("max-[359px]:grid-cols-[repeat(var(--cols-xs),minmax(0,1fr))]");
    expect(html).toContain("md:flex");
    // Chevrons bordés sur mobile, libellé texte en sr-only (pas display:none).
    expect(html).toContain("max-md:border");
    expect(html).toContain('<span class="max-md:sr-only">Précédent</span>');
    expect(paginationGridColumns(14)).toEqual({ cols: 7, colsXs: 5 }); // 12 pages : 7 + 7
    expect(paginationGridColumns(10)).toEqual({ cols: 5, colsXs: 5 }); // 8 pages : 5 + 5
    expect(paginationGridColumns(13)).toEqual({ cols: 7, colsXs: 5 }); // > 15 pages, ellipses
    expect(paginationGridColumns(4)).toEqual({ cols: 4, colsXs: 4 });
  });

  it("« … » masqué aux lecteurs d'écran", () => {
    const html = renderToString(<ListPagination basePath="/vannes" page={10} totalPages={30} />);
    expect(html.match(/<li aria-hidden="true" class="flex"><span[^>]*>…<\/span><\/li>/g)).toHaveLength(2);
  });
});

describe("/vannes : liste serveur, canonique et 404", () => {
  const serverPage = (page: number, totalPages = 12) => ({
    items: [
      {
        id: `j${page}`,
        content: `Setup ${page}`,
        punchline: "Chute",
        category: "ABSURDE",
        type: "ONESHOT",
        maturityLevel: 1,
        comedyTechnique: null,
        techniqueExplanation: null,
        howToApply: null,
      },
    ],
    page,
    limit: 12,
    total: totalPages * 12,
    totalPages,
  });

  beforeEach(() => mockGetJokesPage.mockReset());

  it("HTML serveur de VannesList page 6 : 11 liens numérotés + la page courante", () => {
    const html = renderToString(<VannesList initialData={serverPage(6)} initialPage={6} />);
    expect(numberedTargets(html, "/vannes")).toEqual([1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12]);
    expect(currentPage(html)).toBe(6);
  });

  it("canonique auto-référente inchangée, pas de robots spécifique", async () => {
    const { generateMetadata } = require("@/app/(dashboard)/vannes/page");
    const meta2 = await generateMetadata({ searchParams: { page: "2" } });
    expect(meta2.alternates.canonical).toBe("https://deviens-marrant.fr/vannes?page=2");
    expect(meta2.robots).toBeUndefined();
    const meta1 = await generateMetadata({ searchParams: {} });
    expect(meta1.alternates.canonical).toBe("https://deviens-marrant.fr/vannes");
  });

  it("?page=13 sur 12 pages : toujours 404", async () => {
    mockGetJokesPage.mockResolvedValue(serverPage(13));
    const VannesPage = require("@/app/(dashboard)/vannes/page").default;
    await expect(VannesPage({ searchParams: { page: "13" } })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

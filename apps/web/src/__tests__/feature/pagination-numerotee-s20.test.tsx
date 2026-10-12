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
import { paginationItems } from "@/lib/list-pagination";

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
    .filter((l) => l.label?.startsWith("Page "))
    .map((l) => (l.href === basePath ? 1 : Number(l.href.split("?page=")[1])))
    .sort((a, b) => a - b);
}

function currentPage(html: string): number | null {
  const m = html.match(/<span aria-current="page"[^>]*>(?:<span[^>]*>Page <\/span>)?(\d+)<\/span>/);
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
    // Liens réels, jamais masqués, jamais nofollow.
    expect(html).not.toMatch(/nofollow|display:\s*none|hidden/);
    // Page 1 = URL de base, sans ?page=1.
    expect(html).not.toContain("?page=1\"");
  });

  it("> 15 pages : « … » non lié", () => {
    const html = renderToString(<ListPagination basePath="/vannes" page={10} totalPages={30} />);
    expect(numberedTargets(html, "/vannes")).toEqual([1, 2, 8, 9, 11, 12, 29, 30]);
    expect(html.match(/…/g)).toHaveLength(2);
    expect(paginationLinks(html).some((l) => l.label === null && l.href.includes("…"))).toBe(false);
  });

  it("cible tactile 44 px sur mobile et retour à la ligne", () => {
    const html = renderToString(<ListPagination basePath="/vannes" page={6} totalPages={12} />);
    expect(html).toContain("flex-wrap");
    expect(html).toContain("max-md:h-11");
    expect(html).toContain("max-md:min-w-11");
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

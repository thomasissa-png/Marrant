/**
 * @jest-environment node
 */
/**
 * s20, spec maillage S5 (docs/seo/maillage-decouverte-s20.md §4) : aucun `lastmod`
 * postérieur à aujourd'hui (UTC) ; `/blog` = date du dernier article visible ;
 * fiches du catalogue inchangées.
 */
import { blogIndexLastMod, capLastModToToday } from "@/lib/sitemap-lastmod";

const NOW = new Date("2026-10-12T15:00:00.000Z");
const TODAY_START = new Date("2026-10-12T00:00:00.000Z");

const mockDailyFindFirst = jest.fn();
const mockBlogFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    dailyContent: { findFirst: (args: unknown) => mockDailyFindFirst(args) },
    blogArticle: { findMany: (args: unknown) => mockBlogFindMany(args) },
  },
}));
jest.mock("@/lib/sitemap-parcours", () => ({
  getParcoursSitemapDates: async () => ({ hub: new Date("2026-10-11"), bySlug: {} }),
}));
const FICHE_DATE = new Date("2026-09-30T08:12:00.000Z");
jest.mock("@/lib/sitemap-catalogue", () => ({
  getCatalogueSitemapEntries: async () => [
    { url: "https://deviens-marrant.fr/vannes/une-vanne-abc", lastModified: FICHE_DATE, changeFrequency: "monthly", priority: 0.6 },
  ],
}));

describe("capLastModToToday / blogIndexLastMod", () => {
  it("date future → début du jour UTC ; date passée ou du jour inchangée", () => {
    expect(capLastModToToday(new Date("2026-12-31"), NOW)).toEqual(TODAY_START);
    expect(capLastModToToday("2026-10-13", NOW)).toEqual(TODAY_START);
    expect(capLastModToToday("2026-10-12", NOW)).toBe("2026-10-12");
    expect(capLastModToToday(FICHE_DATE, NOW)).toBe(FICHE_DATE);
    expect(capLastModToToday(undefined, NOW)).toBeUndefined();
  });

  it("/blog : article le plus récemment publié, modification réelle prioritaire, futur ignoré", () => {
    const fallback = new Date("2026-09-29");
    const candidates = [
      { publishedAt: new Date("2026-10-08"), lastModified: new Date("2026-10-09") },
      { publishedAt: new Date("2026-10-15"), lastModified: new Date("2026-10-15") }, // programmé
      { publishedAt: new Date("2026-03-13"), lastModified: new Date("2026-10-11") },
    ];
    expect(blogIndexLastMod(candidates, NOW, fallback)).toEqual(new Date("2026-10-09"));
    expect(blogIndexLastMod([], NOW, fallback)).toBe(fallback);
  });
});

describe("app/sitemap.ts", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: NOW, doNotFake: ["nextTick", "setImmediate"] });
    mockDailyFindFirst.mockReset();
    mockBlogFindMany.mockReset();
  });
  afterEach(() => jest.useRealTimers());

  const load = async () => (await import("@/app/sitemap")).default();
  const byUrl = (entries: { url: string; lastModified?: string | Date }[], path: string) =>
    entries.find((e) => e.url === `https://deviens-marrant.fr${path}`);

  it("contenu du jour préparé jusqu'au 31/12 : requête bornée à aujourd'hui (UTC), aucun lastmod futur", async () => {
    // La base, interrogée avec la borne, renvoie le contenu du jour.
    mockDailyFindFirst.mockResolvedValue({ date: TODAY_START });
    mockBlogFindMany.mockResolvedValue([
      { slug: "se-presenter-avec-humour", publishedAt: new Date("2026-10-12T06:00:00Z"), updatedAt: new Date("2026-10-12T05:00:00Z") },
    ]);
    const entries = await load();
    expect(mockDailyFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { date: { lt: new Date("2026-10-13T00:00:00.000Z") } } }),
    );
    const tomorrow = new Date("2026-10-13T00:00:00.000Z").getTime();
    for (const e of entries) {
      expect(new Date(e.lastModified as Date | string).getTime()).toBeLessThan(tomorrow);
    }
    for (const path of ["", "/vannes", "/conseils", "/videos", "/blague-du-jour"]) {
      expect(byUrl(entries, path)?.lastModified).toEqual(TODAY_START);
    }
    // /blog : date de publication du dernier article visible (pas la vanne du jour).
    expect(byUrl(entries, "/blog")?.lastModified).toEqual(new Date("2026-10-12T06:00:00Z"));
    // Fiches inchangées.
    expect(byUrl(entries, "/vannes/une-vanne-abc")?.lastModified).toBe(FICHE_DATE);
  });

  it("même si la base renvoie une date future (garde-fou), la sortie reste ≤ aujourd'hui", async () => {
    mockDailyFindFirst.mockResolvedValue({ date: new Date("2026-12-31") });
    mockBlogFindMany.mockResolvedValue([]);
    const entries = await load();
    expect(byUrl(entries, "")?.lastModified).toEqual(TODAY_START);
    const tomorrow = new Date("2026-10-13T00:00:00.000Z").getTime();
    expect(entries.every((e) => new Date(e.lastModified as Date | string).getTime() < tomorrow)).toBe(true);
    // /blog sans article en base : dernier article statique visible.
    const blog = new Date(byUrl(entries, "/blog")?.lastModified as Date);
    expect(blog.getTime()).toBeLessThan(tomorrow);
    expect(blog.getTime()).toBeGreaterThanOrEqual(new Date("2026-05-05").getTime());
  });

  it("base indisponible : repli sur la date des pages structurelles", async () => {
    // s21 : pages structurelles au 18/10 ; on se place après cette date (sinon bornée à aujourd'hui).
    jest.setSystemTime(new Date("2026-10-20T15:00:00.000Z"));
    mockDailyFindFirst.mockRejectedValue(new Error("DB indisponible"));
    mockBlogFindMany.mockRejectedValue(new Error("DB indisponible"));
    const entries = await load();
    expect(byUrl(entries, "/vannes")?.lastModified).toEqual(new Date("2026-10-18"));
  });

  it("s21 : lastmod des pages modifiées par la branche (CGU et confidentialité au 17/10, à propos au 18/10)", async () => {
    jest.setSystemTime(new Date("2026-10-20T15:00:00.000Z"));
    mockDailyFindFirst.mockRejectedValue(new Error("DB indisponible"));
    mockBlogFindMany.mockRejectedValue(new Error("DB indisponible"));
    const entries = await load();
    expect(byUrl(entries, "/cgu")?.lastModified).toEqual(new Date("2026-10-17"));
    expect(byUrl(entries, "/confidentialite")?.lastModified).toEqual(new Date("2026-10-17"));
    expect(byUrl(entries, "/a-propos")?.lastModified).toEqual(new Date("2026-10-18"));
    expect(byUrl(entries, "/abonnement")?.lastModified).toEqual(new Date("2026-10-18"));
    expect(byUrl(entries, "/mentions-legales")?.lastModified).toEqual(new Date("2026-05-06"));
  });
});

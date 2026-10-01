/**
 * Page /liens (lien unique de la bio Instagram, décision du 01/10/2026).
 * Dernier article visible (base + statiques, comme /blog), vanne du jour
 * (même source que /blague-du-jour), 3 liens fixes, tout en UTM « bio ».
 */
import { render, screen } from "@testing-library/react";

const prismaMock = {
  blogArticle: { findFirst: jest.fn() },
  dailyContent: { findUnique: jest.fn() },
  joke: { count: jest.fn(), findFirst: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

const UTM = "utm_source=instagram&utm_medium=social&utm_campaign=bio";
const NOW = new Date("2026-10-01T08:00:00Z");

const dbArticle = {
  slug: "article-en-base",
  title: "Article en base le plus récent",
  excerpt: "Résumé de l'article en base.",
  publishedAt: new Date("2026-09-28T07:00:00Z"),
  readingTime: "6 min",
};
const dailyJoke = {
  id: "cmliens0001",
  isActive: true,
  content: "Setup du jour",
  punchline: "Chute du jour",
  category: "BOULOT",
  comedyTechnique: "Décalage",
  techniqueExplanation: "Explication.",
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  prismaMock.blogArticle.findFirst.mockResolvedValue(dbArticle);
  prismaMock.dailyContent.findUnique.mockResolvedValue({ joke: dailyJoke });
  prismaMock.joke.count.mockResolvedValue(0);
  prismaMock.joke.findFirst.mockResolvedValue(null);
});

describe("getLatestBlogArticle", () => {
  const { getLatestBlogArticle } = require("@/lib/latest-blog-article");

  it("article en base visible et daté → retenu, requête bornée à la date et hors slugs redirigés", async () => {
    const article = await getLatestBlogArticle(NOW);
    expect(article).toMatchObject({ slug: "article-en-base", date: "2026-09-28" });
    const args = prismaMock.blogArticle.findFirst.mock.calls[0][0];
    expect(args.where.AND[0]).toEqual({
      isPublished: true,
      OR: [{ publishedAt: null }, { publishedAt: { lte: NOW } }],
    });
    expect(args.where.AND[1]).toEqual({ publishedAt: { not: null } });
    expect(args.where.slug.notIn).toEqual(expect.any(Array));
    expect(args.orderBy).toEqual({ publishedAt: "desc" });
  });

  it("base indisponible → article statique le plus récent non futur", async () => {
    prismaMock.blogArticle.findFirst.mockRejectedValue(new Error("DB indisponible"));
    const article = await getLatestBlogArticle(NOW);
    expect(article).not.toBeNull();
    expect(article.date <= "2026-10-01").toBe(true);
  });

  it("article statique plus récent que la base → l'article statique gagne", async () => {
    prismaMock.blogArticle.findFirst.mockResolvedValue({ ...dbArticle, publishedAt: new Date("2020-01-01T00:00:00Z") });
    const article = await getLatestBlogArticle(NOW);
    expect(article.slug).not.toBe("article-en-base");
  });
});

describe("/liens", () => {
  const page = require("@/app/liens/page");

  it("noindex, ISR 5 min", () => {
    expect(page.revalidate).toBe(300);
    expect(page.metadata.robots).toEqual({ index: false, follow: true });
  });

  it("affiche le dernier article, la vanne du jour et les 3 liens fixes, tous en UTM bio", async () => {
    render(await page.default());
    expect(screen.getByText("Article en base le plus récent")).toBeInTheDocument();
    expect(screen.getByText("Setup du jour")).toBeInTheDocument();
    expect(screen.getByText("Chute du jour")).toBeInTheDocument();

    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href") ?? "");
    expect(hrefs).toEqual(
      expect.arrayContaining([
        `/blog/article-en-base?${UTM}`,
        `/parcours/repartie?${UTM}`,
        `/vannes?${UTM}`,
        `/conseils?${UTM}`,
      ]),
    );
    expect(hrefs.some((h) => h.startsWith("/vannes/") && h.endsWith(`?${UTM}`))).toBe(true);
    for (const href of hrefs) expect(href).toContain(UTM);
    expect(document.body.textContent).not.toContain("—");
  });

  it("base indisponible → page rendue sans vanne, avec un article statique et les liens fixes", async () => {
    prismaMock.blogArticle.findFirst.mockRejectedValue(new Error("DB indisponible"));
    prismaMock.dailyContent.findUnique.mockRejectedValue(new Error("DB indisponible"));
    render(await page.default());
    expect(screen.queryByText("Setup du jour")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dernier article" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Avoir de la répartie" })).toBeInTheDocument();
  });
});

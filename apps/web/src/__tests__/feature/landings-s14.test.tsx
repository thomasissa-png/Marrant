/**
 * Landings s14 : /blague-du-jour (lot S3a) et /vannes/theme/<slug> (lot S3b).
 */
import { render, screen } from "@testing-library/react";
import { VANNES_THEMES, getVannesTheme } from "@/lib/vannes-themes";
import { parseShortIdFromSlug, buildJokeSlug } from "@/lib/catalogue-slug";

const prismaMock = {
  dailyContent: { findUnique: jest.fn() },
  joke: { count: jest.fn(), findFirst: jest.fn(), findMany: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
jest.mock("@/lib/db-retry", () => ({ withDbRetry: <T,>(fn: () => Promise<T>) => fn() }));
jest.mock("@/lib/content-stats-server", () => ({
  getContentStatsRounded: jest.fn(async () => ({ jokes: 300, tips: 0, videos: 0 })),
}));

const notFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
jest.mock("next/navigation", () => ({ notFound: () => notFound() }));

const TODAY = new Date(Date.UTC(2026, 8, 30)); // jour 273
const joke = (id: string, isActive = true) => ({
  id,
  isActive,
  content: `Setup ${id}`,
  punchline: `Chute ${id}`,
  category: "BOULOT",
  comedyTechnique: "Décalage",
  techniqueExplanation: "Explication.",
});

beforeEach(() => {
  jest.clearAllMocks();
  prismaMock.dailyContent.findUnique.mockResolvedValue(null);
  prismaMock.joke.count.mockResolvedValue(0);
  prismaMock.joke.findFirst.mockResolvedValue(null);
  prismaMock.joke.findMany.mockResolvedValue([]);
});

describe("loadDailyJoke (même source que /api/daily)", () => {
  const { loadDailyJoke, getDailyJoke } = require("@/lib/daily-joke");

  it("DailyContent du jour actif → cette vanne", async () => {
    prismaMock.dailyContent.findUnique.mockResolvedValue({ joke: joke("cmdaily0001") });
    const result = await loadDailyJoke(TODAY);
    expect(result).toMatchObject({ id: "cmdaily0001", punchline: "Chute cmdaily0001" });
    expect(prismaMock.dailyContent.findUnique.mock.calls[0][0].where).toEqual({ date: TODAY });
    expect(prismaMock.joke.findFirst).not.toHaveBeenCalled();
  });

  it("pas de DailyContent → repli déterministe (vannes relues, jour de l'année modulo)", async () => {
    prismaMock.joke.count.mockResolvedValue(10);
    prismaMock.joke.findFirst.mockResolvedValue(joke("cmfallback1"));
    const result = await loadDailyJoke(TODAY);
    expect(result?.id).toBe("cmfallback1");
    const args = prismaMock.joke.findFirst.mock.calls[0][0];
    expect(args.where.copyVerdict).toEqual({ in: ["GARDER", "REECRIRE"] });
    expect(args.orderBy).toEqual({ id: "asc" });
    expect(args.skip).toBe(273 % 10);
  });

  it("vanne du jour retirée depuis → repli", async () => {
    prismaMock.dailyContent.findUnique.mockResolvedValue({ joke: joke("cmretired01", false) });
    prismaMock.joke.count.mockResolvedValue(3);
    prismaMock.joke.findFirst.mockResolvedValue(joke("cmfallback2"));
    expect((await loadDailyJoke(TODAY))?.id).toBe("cmfallback2");
  });

  it("base indisponible → null (build sans base)", async () => {
    prismaMock.dailyContent.findUnique.mockRejectedValue(new Error("DB indisponible"));
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await getDailyJoke()).toBeNull();
  });
});

describe("/blague-du-jour", () => {
  it("affiche la vanne, sa chute, son décryptage et la FAQ avec le compteur dynamique", async () => {
    prismaMock.dailyContent.findUnique.mockResolvedValue({ joke: joke("cmdaily0002") });
    const mod = require("@/app/(dashboard)/blague-du-jour/page");
    expect(mod.revalidate).toBe(600);
    expect(mod.metadata.title).toBe("Blague du jour : une vanne à ressortir");
    const { container } = render(await mod.default());
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("La blague du jour");
    expect(screen.getByText("Chute cmdaily0002")).toBeInTheDocument();
    expect(screen.getByText("Explication.")).toBeInTheDocument();
    const html = container.innerHTML;
    expect(html).toContain("Il y en a 300+, chacune avec sa chute.");
    expect(html).not.toContain("550+");
    expect(html).not.toContain("—");
    expect(html).toContain('"@type":"FAQPage"');
  });

  it("sans base : page rendue sans vanne, sans erreur", async () => {
    prismaMock.dailyContent.findUnique.mockRejectedValue(new Error("DB indisponible"));
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const mod = require("@/app/(dashboard)/blague-du-jour/page");
    render(await mod.default());
    expect(screen.queryByText(/La chute/)).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

describe("pages thème /vannes/theme/<slug>", () => {
  const page = require("@/app/(dashboard)/vannes/theme/[slug]/page");

  it("7 thèmes validés, sans « ecole », textes sans tiret cadratin", () => {
    expect(VANNES_THEMES.map((t) => t.slug)).toEqual([
      "boulot", "couple", "dating", "soirees", "famille", "gaming", "autoderision",
    ]);
    expect(getVannesTheme("famille")?.category).toBe("PARENTS");
    for (const t of VANNES_THEMES) {
      expect(t.title.length).toBeLessThanOrEqual(40);
      expect(t.description.length).toBeLessThanOrEqual(155);
      expect(`${t.title}${t.description}${t.h1}${t.intro}`).not.toContain("—");
    }
  });

  it("aucune vanne ne peut produire le slug « theme »", () => {
    expect(parseShortIdFromSlug("theme")).toBeNull();
    expect(buildJokeSlug({ id: "cmabcdefgh123", content: "Thème" })).not.toBe("theme");
  });

  it("liste serveur des vannes actives de la catégorie, liens vers les fiches", async () => {
    prismaMock.joke.findMany
      .mockResolvedValueOnce([{ id: "cmjoke00001", content: "Setup A" }])
      .mockResolvedValueOnce([{ ...joke("cmjoke00001"), content: "Setup A", type: "ONE_LINER", maturityLevel: 1 }]);
    render(await page.default({ params: { slug: "famille" }, searchParams: {} }));
    expect(prismaMock.joke.findMany.mock.calls[0][0].where).toEqual({ isActive: true, category: "PARENTS" });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Blagues de famille");
    expect(screen.getByRole("link", { name: "Setup A" }).getAttribute("href")).toBe(
      `/vannes/${buildJokeSlug({ id: "cmjoke00001", content: "Setup A" })}`,
    );
  });

  it("canonical auto-référent, avec ?page=N", async () => {
    const meta = await page.generateMetadata({ params: { slug: "boulot" }, searchParams: { page: "2", utm_source: "x" } });
    expect(meta.alternates.canonical).toBe("https://deviens-marrant.fr/vannes/theme/boulot?page=2");
    expect(meta.title).toBe("Blagues de boulot à sortir au bureau");
  });

  it("thème inconnu ou « ecole » → 404 ; page hors catalogue → 404", async () => {
    await expect(page.default({ params: { slug: "ecole" }, searchParams: {} })).rejects.toThrow("NEXT_NOT_FOUND");
    prismaMock.joke.findMany.mockResolvedValue([]);
    await expect(page.default({ params: { slug: "boulot" }, searchParams: { page: "5" } })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });
});

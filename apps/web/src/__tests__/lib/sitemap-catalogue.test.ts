import { getCatalogueSitemapEntries } from "@/lib/sitemap-catalogue";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: jest.fn() },
    tip: { findMany: jest.fn() },
    video: { findMany: jest.fn() },
  },
}));

// Casts pour accéder aux mocks Jest sans require()
const mockedJoke = prisma.joke.findMany as unknown as jest.Mock;
const mockedTip = prisma.tip.findMany as unknown as jest.Mock;
const mockedVideo = prisma.video.findMany as unknown as jest.Mock;

describe("sitemap-catalogue — getCatalogueSitemapEntries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("génère une entrée URL pour chaque vanne, conseil et vidéo actifs", async () => {
    mockedJoke.mockResolvedValue([
      { id: "cjoke000001abc", content: "Ma vanne", updatedAt: new Date("2026-01-01") },
    ]);
    mockedTip.mockResolvedValue([
      { id: "ctip0000001xyz", title: "Mon conseil", updatedAt: new Date("2026-01-02") },
    ]);
    mockedVideo.mockResolvedValue([
      { id: "cvideo00001def", title: "Ma vidéo", updatedAt: new Date("2026-01-03") },
    ]);

    const entries = await getCatalogueSitemapEntries();

    expect(entries).toHaveLength(3);
    expect(entries[0].url).toMatch(/^https:\/\/deviens-marrant\.fr\/vannes\/ma-vanne-cjoke00000/);
    expect(entries[1].url).toMatch(/^https:\/\/deviens-marrant\.fr\/conseils\/mon-conseil-ctip000000/);
    expect(entries[2].url).toMatch(/^https:\/\/deviens-marrant\.fr\/videos\/ma-video-cvideo0000/);
  });

  it("filtre uniquement les contenus actifs (where isActive true)", async () => {
    mockedJoke.mockResolvedValue([]);
    mockedTip.mockResolvedValue([]);
    mockedVideo.mockResolvedValue([]);

    await getCatalogueSitemapEntries();

    expect(mockedJoke).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: true } })
    );
    expect(mockedTip).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: true } })
    );
    expect(mockedVideo).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: true } })
    );
  });

  it("retourne un tableau vide si la DB crash (fallback build sans DB)", async () => {
    mockedJoke.mockRejectedValue(new Error("DB indisponible"));

    const entries = await getCatalogueSitemapEntries();

    expect(entries).toEqual([]);
  });

  it("chaque entrée a lastModified, changeFrequency et priority définis", async () => {
    mockedJoke.mockResolvedValue([
      { id: "cjoke000001abc", content: "test", updatedAt: new Date("2026-05-01") },
    ]);
    mockedTip.mockResolvedValue([]);
    mockedVideo.mockResolvedValue([]);

    const entries = await getCatalogueSitemapEntries();

    expect(entries[0].lastModified).toEqual(new Date("2026-05-01"));
    expect(entries[0].changeFrequency).toBe("monthly");
    expect(entries[0].priority).toBeGreaterThan(0);
  });
});

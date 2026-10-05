/**
 * @jest-environment node
 *
 * IndexNow catalogue (s15) : le cron hebdo notifie les URL du sitemap dont le
 * lastmod a moins de 8 jours, en un seul POST.
 */
import { getRecentSitemapUrls, notifyRecentSitemapUrls, INDEXNOW_MAX_URLS_PER_POST } from "@/lib/indexnow-sitemap";

const NOW = new Date("2026-10-05T09:00:00Z");
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

const mockSitemap = jest.fn();
jest.mock("@/app/sitemap", () => ({ __esModule: true, default: () => mockSitemap() }));

const mockSubmit = jest.fn();
jest.mock("@/lib/indexnow", () => ({
  submitToIndexNow: (...args: unknown[]) => mockSubmit(...args),
}));

const BASE = "https://deviens-marrant.fr";

beforeEach(() => {
  mockSubmit.mockReset();
  mockSubmit.mockImplementation(async (urls: string[]) => ({ ok: true, status: 200, submitted: urls.length }));
  mockSitemap.mockResolvedValue([
    { url: `${BASE}/vannes/vieille-vanne-abc`, lastModified: daysAgo(30) },
    { url: `${BASE}/vannes/nouvelle-vanne-def`, lastModified: daysAgo(1) },
    { url: `${BASE}/conseils/conseil-ghi`, lastModified: daysAgo(7.5).toISOString() },
    { url: `${BASE}/videos/video-jkl`, lastModified: daysAgo(3) },
    { url: `${BASE}/parcours/repartie`, lastModified: daysAgo(2) },
    { url: `${BASE}/cgu`, lastModified: daysAgo(150) },
    { url: `${BASE}/sans-date` },
  ]);
});

describe("getRecentSitemapUrls", () => {
  it("garde les lastmod de moins de 8 jours, les plus récents d'abord", async () => {
    expect(await getRecentSitemapUrls(NOW)).toEqual([
      `${BASE}/vannes/nouvelle-vanne-def`,
      `${BASE}/parcours/repartie`,
      `${BASE}/videos/video-jkl`,
      `${BASE}/conseils/conseil-ghi`,
    ]);
  });

  it("plafonne à la limite d'un POST IndexNow", async () => {
    mockSitemap.mockResolvedValue(
      Array.from({ length: INDEXNOW_MAX_URLS_PER_POST + 5 }, (_, i) => ({
        url: `${BASE}/vannes/v-${i}`,
        lastModified: daysAgo(1),
      })),
    );
    expect(await getRecentSitemapUrls(NOW)).toHaveLength(INDEXNOW_MAX_URLS_PER_POST);
  });
});

describe("notifyRecentSitemapUrls", () => {
  it("un seul POST avec les URL récentes", async () => {
    const res = await notifyRecentSitemapUrls(NOW);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit.mock.calls[0][0]).toHaveLength(4);
    expect(res.submitted).toBe(4);
  });

  it("rien de récent : aucun appel", async () => {
    mockSitemap.mockResolvedValue([{ url: `${BASE}/cgu`, lastModified: daysAgo(100) }]);
    expect(await notifyRecentSitemapUrls(NOW)).toEqual({ submitted: 0, reason: "none-recent" });
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});

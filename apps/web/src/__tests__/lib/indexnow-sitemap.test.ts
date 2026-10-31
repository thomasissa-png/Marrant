/**
 * @jest-environment node
 *
 * IndexNow catalogue (s15) : le cron hebdo notifie les URL du sitemap dont le
 * lastmod a moins de 8 jours, en un seul POST. s23 : toutes les URL si un bloc
 * commun a changé (config/indexnow) il y a moins de 8 jours, sans soumission manuelle.
 */
import {
  getRecentSitemapUrls,
  isSiteWideChangeRecent,
  notifyRecentSitemapUrls,
  INDEXNOW_MAX_URLS_PER_POST,
} from "@/lib/indexnow-sitemap";

const NOW = new Date("2026-10-05T09:00:00Z");
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);

const mockSitemap = jest.fn();
jest.mock("@/app/sitemap", () => ({ __esModule: true, default: () => mockSitemap() }));

const mockSubmit = jest.fn();
jest.mock("@/lib/indexnow", () => ({
  submitToIndexNow: (...args: unknown[]) => mockSubmit(...args),
}));

// Dates du changement commun pilotées par chaque test (défaut : ancien, rien à soumettre en plus).
const mockSiteWide: { changedAt: string; submittedAt: string | null } = { changedAt: "2026-01-01", submittedAt: null };
jest.mock("@/config/indexnow", () => ({
  get SITE_WIDE_CHANGE_AT() {
    return mockSiteWide.changedAt;
  },
  get SITE_WIDE_SUBMITTED_AT() {
    return mockSiteWide.submittedAt;
  },
}));

const BASE = "https://deviens-marrant.fr";

beforeEach(() => {
  mockSiteWide.changedAt = "2026-01-01";
  mockSiteWide.submittedAt = null;
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

describe("s23 : changement d'un bloc commun (config/indexnow)", () => {
  it("moins de 8 jours, rien soumis à la main : vrai", () => {
    expect(isSiteWideChangeRecent(NOW, 8, "2026-10-01", null)).toBe(true);
    expect(isSiteWideChangeRecent(NOW, 8, "2026-10-01", "2026-09-20")).toBe(true);
  });

  it("déjà soumis à la main le jour même ou après : faux", () => {
    expect(isSiteWideChangeRecent(NOW, 8, "2026-10-01", "2026-10-01")).toBe(false);
    expect(isSiteWideChangeRecent(NOW, 8, "2026-10-01", "2026-10-02")).toBe(false);
  });

  it("8 jours ou plus, date future ou invalide : faux", () => {
    expect(isSiteWideChangeRecent(NOW, 8, "2026-09-27", null)).toBe(false);
    expect(isSiteWideChangeRecent(NOW, 8, "2026-10-06", null)).toBe(false);
    expect(isSiteWideChangeRecent(NOW, 8, "pas-une-date", null)).toBe(false);
  });

  it("valeurs livrées (31/10/2026, déjà soumis à la main) : le cron du 02/11 ne resoumet pas tout", () => {
    const { SITE_WIDE_CHANGE_AT, SITE_WIDE_SUBMITTED_AT } = jest.requireActual("@/config/indexnow");
    expect(SITE_WIDE_CHANGE_AT).toBe("2026-10-31");
    expect(isSiteWideChangeRecent(new Date("2026-11-02T09:00:00Z"), 8, SITE_WIDE_CHANGE_AT, SITE_WIDE_SUBMITTED_AT)).toBe(false);
  });

  it("changement récent : toutes les URL du sitemap, sans date comprise, en un seul POST", async () => {
    mockSiteWide.changedAt = "2026-10-01";
    const res = await notifyRecentSitemapUrls(NOW);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit.mock.calls[0][0]).toHaveLength(7);
    expect(mockSubmit.mock.calls[0][0]).toEqual(expect.arrayContaining([`${BASE}/cgu`, `${BASE}/sans-date`]));
    expect(res.submitted).toBe(7);
  });

  it("changement récent : plafonné à la limite d'un POST IndexNow", async () => {
    mockSitemap.mockResolvedValue(
      Array.from({ length: INDEXNOW_MAX_URLS_PER_POST + 5 }, (_, i) => ({ url: `${BASE}/vannes/v-${i}`, lastModified: daysAgo(200) })),
    );
    expect(await getRecentSitemapUrls(NOW, 8, true)).toHaveLength(INDEXNOW_MAX_URLS_PER_POST);
  });
});

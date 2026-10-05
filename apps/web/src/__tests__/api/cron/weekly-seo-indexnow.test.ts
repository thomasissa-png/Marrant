/**
 * @jest-environment node
 *
 * Cron weekly-seo (s15) : en plus de l'article, notifie IndexNow des URL
 * récentes du sitemap, dans les deux modes (contenu préparé ou génération).
 */
import { GET } from "@/app/api/cron/weekly-seo/route";

const mockNotify = jest.fn();
jest.mock("@/lib/indexnow-sitemap", () => ({
  notifyRecentSitemapUrls: (...args: unknown[]) => mockNotify(...args),
}));

const mockSubmit = jest.fn();
jest.mock("@/lib/indexnow", () => ({
  submitToIndexNow: (...args: unknown[]) => mockSubmit(...args),
}));

const mockEnabled = jest.fn();
const mockPublishDue = jest.fn();
jest.mock("@/lib/scheduler/prepared-content", () => ({
  isContentGenerationEnabled: () => mockEnabled(),
  publishDueScheduledArticles: () => mockPublishDue(),
}));

const mockUpdateCalendar = jest.fn();
const mockPublishWeekly = jest.fn();
jest.mock("@/lib/ai/agents/seo-blog-agent", () => ({
  updateSeoCalendar: () => mockUpdateCalendar(),
  publishWeeklyArticle: () => mockPublishWeekly(),
}));

const SECRET = "cron-secret-weekly";

function call(authorization?: string) {
  return GET(
    new Request("https://deviens-marrant.fr/api/cron/weekly-seo", {
      headers: authorization ? { authorization } : {},
    }),
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.CRON_SECRET = SECRET;
  mockNotify.mockResolvedValue({ submitted: 12, result: { ok: true, status: 200, submitted: 12 } });
  mockPublishDue.mockResolvedValue({ published: [] });
});

afterAll(() => {
  delete process.env.CRON_SECRET;
});

describe("GET /api/cron/weekly-seo : IndexNow catalogue", () => {
  it("sans secret : 401, aucune notification", async () => {
    const res = await call();
    expect(res.status).toBe(401);
    expect(mockNotify).not.toHaveBeenCalled();
  });

  it("contenu préparé (génération coupée) : notification des URL récentes", async () => {
    mockEnabled.mockReturnValue(false);
    const res = await call(`Bearer ${SECRET}`);
    expect(res.status).toBe(200);
    expect(mockNotify).toHaveBeenCalledTimes(1);
    expect((await res.json()).indexnow).toEqual(expect.objectContaining({ submitted: 12 }));
  });

  it("mode génération : article notifié puis URL récentes", async () => {
    mockEnabled.mockReturnValue(true);
    mockUpdateCalendar.mockResolvedValue({ planned: 4 });
    mockPublishWeekly.mockResolvedValue({ article: { slug: "nouvel-article" } });
    const res = await call(`Bearer ${SECRET}`);
    expect(res.status).toBe(200);
    expect(mockSubmit).toHaveBeenCalledWith(["/blog/nouvel-article", "/blog", "/sitemap.xml"]);
    expect(mockNotify).toHaveBeenCalledTimes(1);
  });

  it("échec IndexNow : le cron répond quand même 200 (non bloquant)", async () => {
    mockEnabled.mockReturnValue(false);
    mockNotify.mockRejectedValue(new Error("réseau"));
    const res = await call(`Bearer ${SECRET}`);
    expect(res.status).toBe(200);
    expect((await res.json()).indexnow).toEqual({ submitted: 0, reason: "error" });
  });
});

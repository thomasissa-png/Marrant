/**
 * @jest-environment node
 *
 * Contenu préparé à l'avance (décision fondateur 30/09/2026) :
 * CONTENT_GENERATION_ENABLED ≠ "true" → aucun LLM dans daily-content,
 * weekly-seo, monthly-plan ; trou du calendrier comblé depuis le stock validé.
 */
const mockPrisma = {
  dailyContent: { findUnique: jest.fn(), create: jest.fn() },
  joke: { count: jest.fn(), findFirst: jest.fn() },
  tip: { count: jest.fn(), findFirst: jest.fn() },
  video: { count: jest.fn(), findFirst: jest.fn() },
  blogArticle: { updateMany: jest.fn(), findFirst: jest.fn(), findMany: jest.fn() },
  contentPlan: { findFirst: jest.fn() },
  jobLock: { deleteMany: jest.fn(), create: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockPrisma;
  },
}));

// Toute génération IA ferait échouer les tests.
const mockLlm = jest.fn(() => {
  throw new Error("LLM appelé alors que CONTENT_GENERATION_ENABLED != true");
});
jest.mock("@/lib/ai/daily-publisher", () => ({ publishDailyContent: () => mockLlm() }));
jest.mock("@/lib/ai/content-planner", () => ({ generateMonthlyPlans: () => mockLlm() }));
jest.mock("@/lib/ai/agents/seo-blog-agent", () => ({ publishWeeklyArticle: () => mockLlm(), updateSeoCalendar: () => mockLlm() }));
jest.mock("@/lib/social-post-daily-lock", () => ({ tryAcquireSocialDailyLock: jest.fn().mockResolvedValue(false) }));
jest.mock("@/lib/ai/ceo-helpers", () => ({ ensureCeoConfig: jest.fn().mockResolvedValue({ enabled: false }) }));
jest.mock("@/lib/ai/copy-review-runner", () => ({ runDailyCopyReviewOnce: jest.fn() }));
const mockRevalidatePath = jest.fn();
jest.mock("next/cache", () => ({ revalidatePath: (p: string) => mockRevalidatePath(p) }));
const mockFetch = jest.fn();

import { createSchedulerJobs } from "@/lib/scheduler/jobs";
import {
  ensureDailyContentFromStock,
  publishDueScheduledArticles,
  isContentGenerationEnabled,
  startOfIsoWeekUtc,
} from "@/lib/scheduler/prepared-content";

const ok = () => Promise.resolve(new Response("{}", { status: 200 }));
const TODAY = new Date("2026-10-01T00:00:00Z");

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.CONTENT_GENERATION_ENABLED;
  mockPrisma.dailyContent.findUnique.mockResolvedValue(null);
  mockPrisma.dailyContent.create.mockResolvedValue({});
  mockPrisma.joke.count.mockResolvedValue(203);
  mockPrisma.joke.findFirst.mockResolvedValue({ id: "joke-garder" });
  mockPrisma.tip.count.mockResolvedValue(400);
  mockPrisma.tip.findFirst.mockResolvedValue({ id: "tip-1" });
  mockPrisma.video.count.mockResolvedValue(80);
  mockPrisma.video.findFirst.mockResolvedValue({ id: "video-1" });
  mockPrisma.blogArticle.updateMany.mockResolvedValue({ count: 0 });
  mockPrisma.blogArticle.findMany.mockResolvedValue([]);
  mockPrisma.jobLock.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.jobLock.create.mockResolvedValue({});
  mockFetch.mockResolvedValue(new Response("", { status: 200 }));
  global.fetch = mockFetch as unknown as typeof fetch;
  process.env.INDEXNOW_KEY = "35cc97ed505a4ae89d8470d259fc5662";
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.useRealTimers());

describe("interrupteur", () => {
  it("désactivé par défaut, activé seulement par \"true\"", () => {
    expect(isContentGenerationEnabled()).toBe(false);
    process.env.CONTENT_GENERATION_ENABLED = "false";
    expect(isContentGenerationEnabled()).toBe(false);
    process.env.CONTENT_GENERATION_ENABLED = "true";
    expect(isContentGenerationEnabled()).toBe(true);
  });
});

describe("scheduler-tick avec contenu préparé : zéro LLM", () => {
  it("5h UTC le 01/10 (main daily-content) et lundi 9h (weekly-seo) : aucune génération", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate", "queueMicrotask"] });
    for (const t of ["2026-10-01T05:00:00Z", "2026-10-05T09:30:00Z", "2026-10-30T12:00:00Z"]) {
      jest.setSystemTime(new Date(t));
      await createSchedulerJobs(ok).runAllJobs();
    }
    expect(mockLlm).not.toHaveBeenCalled();
    expect(mockPrisma.contentPlan.findFirst).not.toHaveBeenCalled(); // monthly-plan court-circuité
    expect(mockPrisma.blogArticle.findMany).toHaveBeenCalled(); // weekly-seo : article planifié cherché
  });

  it("contenu du jour déjà en calendrier : rien n'est créé", async () => {
    mockPrisma.dailyContent.findUnique.mockResolvedValue({ id: "cal" });
    expect(await ensureDailyContentFromStock(TODAY)).toEqual({ status: "exists" });
    expect(mockPrisma.dailyContent.create).not.toHaveBeenCalled();
  });
});

describe("ensureDailyContentFromStock", () => {
  it("crée depuis une vanne GARDER avec décryptage jamais utilisée, choix déterministe", async () => {
    const res = await ensureDailyContentFromStock(TODAY);
    expect(res).toEqual({ status: "created", jokeId: "joke-garder", tipId: "tip-1", videoId: "video-1" });
    const jokeQuery = mockPrisma.joke.findFirst.mock.calls[0][0];
    expect(jokeQuery.where).toMatchObject({
      isActive: true,
      copyVerdict: "GARDER",
      comedyTechnique: { not: null },
      howToApply: { not: null },
      dailyContents: { none: {} },
    });
    // 01/10 = 274e jour → skip 274 % 203 = 71 (même jour, même vanne).
    expect(jokeQuery.skip).toBe(274 % 203);
    expect(mockPrisma.dailyContent.create).toHaveBeenCalledWith({
      data: { date: TODAY, jokeId: "joke-garder", tipId: "tip-1", videoId: "video-1" },
    });
  });

  it("toutes les vannes validées déjà utilisées : réutilise une vanne GARDER", async () => {
    mockPrisma.joke.count.mockResolvedValueOnce(0).mockResolvedValueOnce(258);
    await ensureDailyContentFromStock(TODAY);
    expect(mockPrisma.joke.findFirst.mock.calls[0][0].where.dailyContents).toBeUndefined();
  });

  it("stock vide : ne crée rien, signale le manque", async () => {
    mockPrisma.joke.count.mockResolvedValue(0);
    expect(await ensureDailyContentFromStock(TODAY)).toEqual({ status: "missing-stock", missing: ["vanne GARDER avec décryptage"] });
    expect(mockPrisma.dailyContent.create).not.toHaveBeenCalled();
  });

  it("course avec le calendrier (P2002) : considéré comme existant", async () => {
    mockPrisma.dailyContent.create.mockRejectedValue(Object.assign(new Error("unique"), { code: "P2002" }));
    expect(await ensureDailyContentFromStock(TODAY)).toEqual({ status: "exists" });
  });
});

describe("publishDueScheduledArticles (publication programmée)", () => {
  const MONDAY_0515 = new Date("2026-10-05T05:15:00Z");
  const due = [{ id: "a1", slug: "blagues-halloween-soiree-deguisee" }];

  it("rien d'échu : aucun verrou, aucune écriture", async () => {
    expect(await publishDueScheduledArticles(MONDAY_0515)).toEqual([]);
    expect(mockPrisma.blogArticle.findMany).toHaveBeenCalledWith({
      where: { isPublished: false, publishedAt: { gte: new Date("2026-10-05T00:00:00Z"), lte: MONDAY_0515 } },
      select: { id: true, slug: true },
      orderBy: { publishedAt: "asc" },
    });
    expect(mockPrisma.jobLock.create).not.toHaveBeenCalled();
    expect(mockPrisma.blogArticle.updateMany).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("article échu : bascule compare-and-set, revalidation, ping IndexNow, verrou relâché", async () => {
    mockPrisma.blogArticle.findMany.mockResolvedValue(due);
    mockPrisma.blogArticle.updateMany.mockResolvedValue({ count: 1 });
    expect(await publishDueScheduledArticles(MONDAY_0515)).toEqual(["blagues-halloween-soiree-deguisee"]);

    expect(mockPrisma.jobLock.create.mock.calls[0][0].data.jobKey).toBe("publish-scheduled-articles-2026-10-05");
    expect(mockPrisma.blogArticle.updateMany).toHaveBeenCalledWith({
      where: { id: "a1", isPublished: false },
      data: { isPublished: true },
    });
    expect(mockRevalidatePath.mock.calls.map((c) => c[0])).toEqual([
      "/blog", "/blog/blagues-halloween-soiree-deguisee", "/sitemap.xml", "/llms.txt", "/llms-full.txt",
    ]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.indexnow.org/indexnow");
    expect(JSON.parse(init.body)).toMatchObject({
      host: "deviens-marrant.fr",
      key: "35cc97ed505a4ae89d8470d259fc5662",
      urlList: [
        "https://deviens-marrant.fr/blog/blagues-halloween-soiree-deguisee",
        "https://deviens-marrant.fr/blog",
        "https://deviens-marrant.fr/sitemap.xml",
      ],
    });
    expect(mockPrisma.jobLock.deleteMany).toHaveBeenLastCalledWith({
      where: { jobKey: "publish-scheduled-articles-2026-10-05" },
    });
  });

  it("idempotent : article déjà basculé par un autre processus (count 0) → ni revalidation ni ping", async () => {
    mockPrisma.blogArticle.findMany.mockResolvedValue(due);
    mockPrisma.blogArticle.updateMany.mockResolvedValue({ count: 0 });
    expect(await publishDueScheduledArticles(MONDAY_0515)).toEqual([]);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("verrou détenu ailleurs : on ne touche à rien", async () => {
    mockPrisma.blogArticle.findMany.mockResolvedValue(due);
    mockPrisma.jobLock.create.mockRejectedValue(Object.assign(new Error("unique"), { code: "P2002" }));
    expect(await publishDueScheduledArticles(MONDAY_0515)).toEqual([]);
    expect(mockPrisma.blogArticle.updateMany).not.toHaveBeenCalled();
  });

  it("revalidatePath indisponible (hors requête) et IndexNow en panne : l'article reste publié", async () => {
    mockPrisma.blogArticle.findMany.mockResolvedValue(due);
    mockPrisma.blogArticle.updateMany.mockResolvedValue({ count: 1 });
    mockRevalidatePath.mockImplementationOnce(() => {
      throw new Error("Invariant: static generation store missing in revalidateTag");
    });
    mockFetch.mockRejectedValue(new Error("timeout"));
    expect(await publishDueScheduledArticles(MONDAY_0515)).toEqual(["blagues-halloween-soiree-deguisee"]);
  });

  it("clé IndexNow absente ou placeholder : pas d'appel réseau", async () => {
    mockPrisma.blogArticle.findMany.mockResolvedValue(due);
    mockPrisma.blogArticle.updateMany.mockResolvedValue({ count: 1 });
    process.env.INDEXNOW_KEY = "...";
    expect(await publishDueScheduledArticles(MONDAY_0515)).toHaveLength(1);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("scheduler-tick lundi 05:15 UTC, génération coupée : l'article planifié est publié sans LLM", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate", "queueMicrotask"] });
    jest.setSystemTime(MONDAY_0515);
    mockPrisma.blogArticle.findMany.mockResolvedValue(due);
    mockPrisma.blogArticle.updateMany.mockResolvedValue({ count: 1 });
    await createSchedulerJobs(ok).runAllJobs();
    expect(mockPrisma.blogArticle.updateMany).toHaveBeenCalledWith({
      where: { id: "a1", isPublished: false },
      data: { isPublished: true },
    });
    expect(mockLlm).not.toHaveBeenCalled();
  });

  it("début de semaine ISO (dimanche → lundi précédent) : un article retiré ancien n'est jamais republié", () => {
    expect(startOfIsoWeekUtc(new Date("2026-10-11T23:00:00Z")).toISOString()).toBe("2026-10-05T00:00:00.000Z");
  });
});


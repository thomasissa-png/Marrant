/**
 * @jest-environment node
 *
 * Incident s14 (docs/infra/diagnostic-crons-s14.md) : garde-fous des crons.
 *  - plafond PERSISTANT de 2 tentatives par job et par fenêtre (vrais jobs de
 *    src/lib/scheduler/jobs.ts, JobLock simulé en mémoire comme la table) ;
 *  - repli catalogue sans mélange d'enums (BOULOT ≠ TipCategory) ;
 *  - alias « exercice » ; wrapper OpenNext sans cache des réponses HTTP.
 */

// JobLock simulé : même contrat que Postgres (clé unique → P2002).
const locks = new Map<string, { expiresAt: Date }>();
const mockPrisma = {
  jobLock: {
    deleteMany: jest.fn(async ({ where }: { where: { jobKey?: string; expiresAt?: { lt: Date } } }) => {
      for (const [key, v] of Array.from(locks.entries())) {
        if ((where.jobKey === undefined || where.jobKey === key) && (!where.expiresAt || v.expiresAt < where.expiresAt.lt)) {
          locks.delete(key);
        }
      }
      return { count: 0 };
    }),
    create: jest.fn(async ({ data }: { data: { jobKey: string; expiresAt: Date } }) => {
      if (locks.has(data.jobKey)) throw Object.assign(new Error("unique"), { code: "P2002" });
      locks.set(data.jobKey, { expiresAt: data.expiresAt });
      return data;
    }),
  },
  dailyContent: { findUnique: jest.fn().mockResolvedValue(null) },
  blogArticle: { findFirst: jest.fn().mockResolvedValue(null) },
  contentPlan: { findFirst: jest.fn().mockResolvedValue(null) },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockPrisma;
  },
}));

const mockPublishDailyContent = jest.fn();
const mockGenerateMonthlyPlans = jest.fn();
const mockPublishWeeklyArticle = jest.fn();
jest.mock("@/lib/ai/daily-publisher", () => ({ publishDailyContent: (...a: unknown[]) => mockPublishDailyContent(...a) }));
jest.mock("@/lib/ai/content-planner", () => ({ generateMonthlyPlans: (...a: unknown[]) => mockGenerateMonthlyPlans(...a) }));
jest.mock("@/lib/ai/agents/seo-blog-agent", () => ({
  publishWeeklyArticle: () => mockPublishWeeklyArticle(),
  updateSeoCalendar: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/lib/social-post-daily-lock", () => ({ tryAcquireSocialDailyLock: jest.fn().mockResolvedValue(false) }));
jest.mock("@/lib/ai/ceo-helpers", () => ({ ensureCeoConfig: jest.fn().mockResolvedValue({ enabled: false }) }));
jest.mock("@/lib/ai/copy-review-runner", () => ({ runDailyCopyReviewOnce: jest.fn() }));

import { createSchedulerJobs } from "@/lib/scheduler/jobs";
import { tryConsumeJobAttempt, nextUtcDay, nextUtcMonday, nextUtcMonth } from "@/lib/job-lock";
import { categoryExclusion } from "@/lib/ai/category-exclusion";
import { withFrenchExerciseAlias } from "@/lib/ai/json-aliases";
import { withoutHttpFetchCache, isHttpFetchCacheValue } from "@/lib/cloudflare/no-http-fetch-cache";

const ok = () => Promise.resolve(new Response("{}", { status: 200 }));

beforeEach(() => {
  // Ces scénarios couvrent la génération IA (interrupteur activé).
  process.env.CONTENT_GENERATION_ENABLED = "true";
  locks.clear();
  jest.clearAllMocks();
  mockPublishDailyContent.mockResolvedValue({ errors: [] });
  mockGenerateMonthlyPlans.mockResolvedValue(undefined);
  mockPublishWeeklyArticle.mockResolvedValue({ success: false, error: "Article rejeté (JSON tronqué)" });
});

afterEach(() => jest.useRealTimers());

describe("tryConsumeJobAttempt (plafond persistant)", () => {
  it("accorde 2 tentatives puis refuse jusqu'à la fin de la fenêtre", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate", "queueMicrotask"] });
    jest.setSystemTime(new Date("2026-10-01T05:00:00Z"));
    const end = nextUtcDay(new Date());
    expect(await tryConsumeJobAttempt("daily-content", "2026-10-01", end)).toBe(1);
    expect(await tryConsumeJobAttempt("daily-content", "2026-10-01", end)).toBe(2);
    expect(await tryConsumeJobAttempt("daily-content", "2026-10-01", end)).toBe(0);
    // Les jetons expirent à la fin de la fenêtre (TTL calé sur windowEnd).
    expect(locks.get("attempt:daily-content:2026-10-01:1")?.expiresAt.toISOString()).toBe("2026-10-02T00:00:00.000Z");
    // Fenêtre suivante : compteur neuf.
    jest.setSystemTime(end);
    expect(await tryConsumeJobAttempt("daily-content", "2026-10-02", nextUtcDay(end))).toBe(1);
  });

  it("base indisponible → 0 (fail-closed)", async () => {
    mockPrisma.jobLock.create.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    mockPrisma.jobLock.create.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(await tryConsumeJobAttempt("weekly-seo", "2026-W40", new Date("2026-10-05T00:00:00Z"))).toBe(0);
  });

  it("bornes de fenêtres UTC", () => {
    expect(nextUtcMonday(new Date("2026-09-30T12:00:00Z")).toISOString()).toBe("2026-10-05T00:00:00.000Z");
    expect(nextUtcMonday(new Date("2026-10-04T23:00:00Z")).toISOString()).toBe("2026-10-05T00:00:00.000Z");
    expect(nextUtcMonth(new Date("2026-12-30T12:00:00Z")).toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });
});

describe("scheduler-tick : plus de relance toutes les 15 min", () => {
  it("mercredi 30/09 12h UTC, 4 ticks : daily-content, weekly-seo et monthly-plan tentent 2 fois max", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate", "queueMicrotask"] });
    jest.setSystemTime(new Date("2026-09-30T12:00:00Z"));
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    const { runAllJobs } = createSchedulerJobs(ok);

    for (let tick = 0; tick < 4; tick++) await runAllJobs();

    expect(mockPublishDailyContent).toHaveBeenCalledTimes(2);
    expect(mockPublishWeeklyArticle).toHaveBeenCalledTimes(2);
    // monthly-plan (octobre) : 2 essais ; daily-content (septembre) : 2 essais.
    const octobre = mockGenerateMonthlyPlans.mock.calls.filter(([m]) => m === 10);
    const septembre = mockGenerateMonthlyPlans.mock.calls.filter(([m]) => m === 9);
    expect(octobre).toHaveLength(2);
    expect(septembre).toHaveLength(2);
    // Un échec de publication de l'article est journalisé comme tel (plus de faux « succès »).
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Article NON publié"));
  });

  it("plans mensuels en échec (ex. budget LLM atteint) : le contenu du jour est quand même publié", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate", "queueMicrotask"] });
    jest.setSystemTime(new Date("2026-10-01T05:00:00Z"));
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockGenerateMonthlyPlans.mockRejectedValue(new Error("Budget LLM 24 h atteint"));
    const { runAllJobs } = createSchedulerJobs(ok);
    await runAllJobs();
    expect(mockPublishDailyContent).toHaveBeenCalledTimes(1);
  });
});

describe("repli catalogue : enums séparés", () => {
  const TIP = ["TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE", "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS"];
  it("BOULOT (JokeCategory) n'est jamais passé au filtre des conseils", () => {
    expect(categoryExclusion(new Set(["BOULOT"]), TIP)).toEqual({});
  });
  it("conserve les valeurs valides de l'enum ciblé", () => {
    expect(categoryExclusion(new Set(["BOULOT", "STORYTELLING"]), TIP)).toEqual({ category: { notIn: ["STORYTELLING"] } });
  });
});

describe("alias JSON « exercice »", () => {
  it("recopie exercice → exercise quand exercise est absent", () => {
    const parsed = withFrenchExerciseAlias({ title: "t", exercice: "DÉFI BOUCLE : …" } as { title: string; exercise?: string });
    expect(parsed.exercise).toBe("DÉFI BOUCLE : …");
  });
  it("ne remplace pas un exercise déjà présent", () => {
    expect(withFrenchExerciseAlias({ exercise: "A", exercice: "B" } as { exercise?: string }).exercise).toBe("A");
  });
});

describe("incremental cache OpenNext sans réponses HTTP", () => {
  const anthropicEntry = { kind: "FETCH", data: { url: "https://api.anthropic.com/v1/messages", body: "…", headers: {}, status: 200 }, revalidate: 31536000 };
  const unstableCacheEntry = { kind: "FETCH", data: { body: "[1,2]", headers: {}, status: 200 }, revalidate: 3600 };
  const makeInner = () => ({
    name: "r2",
    get: jest.fn(async () => ({ value: anthropicEntry, lastModified: 1 })),
    set: jest.fn(async () => {}),
    delete: jest.fn(async () => {}),
  });

  it("n'écrit jamais une réponse HTTP (Anthropic, Buffer…)", async () => {
    const inner = makeInner();
    await withoutHttpFetchCache(inner).set("k", anthropicEntry, "fetch");
    expect(inner.set).not.toHaveBeenCalled();
  });
  it("ne relit jamais une réponse HTTP déjà présente", async () => {
    expect(await withoutHttpFetchCache(makeInner()).get("k", "fetch")).toBeNull();
  });
  it("laisse passer unstable_cache et l'ISR", async () => {
    const inner = makeInner();
    const cache = withoutHttpFetchCache(inner);
    await cache.set("k", unstableCacheEntry, "fetch");
    await cache.set("page", { type: "app" }, "cache");
    expect(inner.set).toHaveBeenCalledTimes(2);
    expect(isHttpFetchCacheValue(unstableCacheEntry)).toBe(false);
    expect(isHttpFetchCacheValue(anthropicEntry)).toBe(true);
  });
});

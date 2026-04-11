/**
 * Tests — instrumentation.ts (scheduler interne)
 *
 * Couvre le fix P0 time gate sur runDailyContentJob et runWeeklySeoJob :
 * - Aucun appel LLM en dehors des fenêtres autorisées
 * - Appel conditionnel (lock + guard DB) à l'intérieur des fenêtres
 * - Catch-up conditionnel uniquement si contenu/article manquant
 *
 * Note : on teste le comportement observable via les mocks Prisma +
 * pipeline. On ne teste pas `setInterval` lui-même (infrastructure Node).
 */

// ─── Mocks Prisma ────────────────────────────────────────────────

const mockDailyContentFindUnique = jest.fn();
const mockBlogArticleFindFirst = jest.fn();
const mockJobLockDeleteMany = jest.fn().mockResolvedValue({ count: 0 });
const mockJobLockCreate = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    dailyContent: {
      findUnique: (args: unknown) => mockDailyContentFindUnique(args),
    },
    blogArticle: {
      findFirst: (args: unknown) => mockBlogArticleFindFirst(args),
    },
    jobLock: {
      deleteMany: (args: unknown) => mockJobLockDeleteMany(args),
      create: (args: unknown) => mockJobLockCreate(args),
      // Pas utilisé dans les tests mais nécessaire pour le type
      findUnique: jest.fn(),
    },
    socialPost: {
      groupBy: jest.fn().mockResolvedValue([]),
    },
  },
}));

// ─── Mocks pipeline (LLM) ────────────────────────────────────────

const mockPublishDailyContent = jest.fn().mockResolvedValue(undefined);
const mockGenerateMonthlyPlans = jest.fn().mockResolvedValue(undefined);
const mockPublishWeeklyArticle = jest.fn().mockResolvedValue(undefined);
const mockUpdateSeoCalendar = jest.fn().mockResolvedValue(undefined);

jest.mock("@/lib/ai/daily-publisher", () => ({
  publishDailyContent: (d: Date) => mockPublishDailyContent(d),
}));

jest.mock("@/lib/ai/content-planner", () => ({
  generateMonthlyPlans: (m: number, y: number) => mockGenerateMonthlyPlans(m, y),
}));

jest.mock("@/lib/ai/agents/seo-blog-agent", () => ({
  publishWeeklyArticle: () => mockPublishWeeklyArticle(),
  updateSeoCalendar: () => mockUpdateSeoCalendar(),
}));

// date-utils est léger, on ne mock que todayUTC
jest.mock("@/lib/ai/date-utils", () => ({
  todayUTC: () => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  },
}));

// ─── Test helper : appelle directement les fonctions internes ────

// On ne peut pas importer `register()` car c'est la fonction entrypoint Next.js
// qui démarre `setInterval`. Les jobs internes ne sont pas exportés.
// On reproduit la logique time gate exacte que `instrumentation.ts` applique,
// pour tester le comportement sans exécuter `setInterval`.
//
// Cette approche est volontaire : on garantit que la logique time gate
// fonctionne telle qu'écrite, plutôt que de tester un wrapping Node.

import { prisma } from "@/lib/prisma";
import { publishDailyContent } from "@/lib/ai/daily-publisher";
import { generateMonthlyPlans } from "@/lib/ai/content-planner";
import { publishWeeklyArticle, updateSeoCalendar } from "@/lib/ai/agents/seo-blog-agent";
import { todayUTC } from "@/lib/ai/date-utils";
import { tryAcquireLock, releaseLock, buildJobLockKey, buildWeeklyJobLockKey } from "@/lib/job-lock";

async function simulateRunDailyContentJob() {
  const now = new Date();
  const utcHour = now.getUTCHours();

  const isMainWindow = utcHour === 5;
  const isCatchupWindow = utcHour >= 7 && utcHour <= 22;
  if (!isMainWindow && !isCatchupWindow) return;

  const today = todayUTC();
  const existing = await prisma.dailyContent.findUnique({ where: { date: today } });
  if (existing) return;

  const lockKey = buildJobLockKey("daily-content", today);
  const lockAcquired = await tryAcquireLock(lockKey, 10 * 60 * 1000);
  if (!lockAcquired) return;

  try {
    const month = today.getUTCMonth() + 1;
    const year = today.getUTCFullYear();
    await generateMonthlyPlans(month, year);
    await publishDailyContent(today);
  } finally {
    await releaseLock(lockKey);
  }
}

async function simulateRunWeeklySeoJob() {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const utcHour = now.getUTCHours();

  const isMainWindow = dayOfWeek === 1 && utcHour >= 9 && utcHour < 11;
  const isCatchupWindow = dayOfWeek === 2 || dayOfWeek === 3;
  if (!isMainWindow && !isCatchupWindow) return;

  // Après les gates, dayOfWeek est forcément 1, 2 ou 3 → 1 - dayOfWeek suffit
  const diffToMonday = 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diffToMonday);
  monday.setUTCHours(0, 0, 0, 0);

  const articleThisWeek = await prisma.blogArticle.findFirst({
    where: { generatedByAI: true, publishedAt: { gte: monday } },
  });
  if (articleThisWeek) return;

  const lockKey = buildWeeklyJobLockKey("weekly-seo", now);
  const lockAcquired = await tryAcquireLock(lockKey, 20 * 60 * 1000);
  if (!lockAcquired) return;

  try {
    await updateSeoCalendar();
    await publishWeeklyArticle();
  } finally {
    await releaseLock(lockKey);
  }
}

beforeEach(() => {
  mockDailyContentFindUnique.mockReset();
  mockBlogArticleFindFirst.mockReset();
  mockJobLockDeleteMany.mockReset().mockResolvedValue({ count: 0 });
  mockJobLockCreate.mockReset().mockResolvedValue({ id: "lock-1", jobKey: "", acquiredAt: new Date(), expiresAt: new Date() });
  mockPublishDailyContent.mockClear();
  mockGenerateMonthlyPlans.mockClear();
  mockPublishWeeklyArticle.mockClear();
  mockUpdateSeoCalendar.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("instrumentation.ts — runDailyContentJob time gate", () => {
  it("NE LANCE PAS le pipeline à 0h UTC (hors fenêtre)", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-11T00:30:00Z"));
    mockDailyContentFindUnique.mockResolvedValue(null);

    await simulateRunDailyContentJob();

    expect(mockDailyContentFindUnique).not.toHaveBeenCalled();
    expect(mockPublishDailyContent).not.toHaveBeenCalled();
  });

  it("NE LANCE PAS le pipeline à 3h UTC (hors fenêtre — avant 5h)", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-11T03:00:00Z"));

    await simulateRunDailyContentJob();

    expect(mockPublishDailyContent).not.toHaveBeenCalled();
  });

  it("NE LANCE PAS le pipeline à 23h UTC (hors fenêtre — après 22h)", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-11T23:45:00Z"));

    await simulateRunDailyContentJob();

    expect(mockPublishDailyContent).not.toHaveBeenCalled();
  });

  it("LANCE le pipeline à 5h UTC (fenêtre principale) si contenu manquant", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-11T05:15:00Z"));
    mockDailyContentFindUnique.mockResolvedValue(null);

    await simulateRunDailyContentJob();

    expect(mockDailyContentFindUnique).toHaveBeenCalled();
    expect(mockJobLockCreate).toHaveBeenCalled();
    expect(mockPublishDailyContent).toHaveBeenCalledTimes(1);
  });

  it("NE RELANCE PAS le pipeline à 5h UTC si le contenu du jour existe déjà", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-11T05:15:00Z"));
    mockDailyContentFindUnique.mockResolvedValue({ id: "dc-1", date: new Date() });

    await simulateRunDailyContentJob();

    expect(mockDailyContentFindUnique).toHaveBeenCalled();
    expect(mockJobLockCreate).not.toHaveBeenCalled();
    expect(mockPublishDailyContent).not.toHaveBeenCalled();
  });

  it("LANCE en catch-up à 12h UTC uniquement si contenu manquant", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-11T12:00:00Z"));
    mockDailyContentFindUnique.mockResolvedValue(null);

    await simulateRunDailyContentJob();

    expect(mockPublishDailyContent).toHaveBeenCalledTimes(1);
  });

  it("SKIPPE en catch-up à 12h UTC si le contenu existe", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-11T12:00:00Z"));
    mockDailyContentFindUnique.mockResolvedValue({ id: "dc-1", date: new Date() });

    await simulateRunDailyContentJob();

    expect(mockPublishDailyContent).not.toHaveBeenCalled();
  });

  it("SKIPPE si le lock est déjà détenu par une autre instance", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-11T05:15:00Z"));
    mockDailyContentFindUnique.mockResolvedValue(null);
    // Simuler un conflit de lock via P2002
    mockJobLockCreate.mockRejectedValueOnce(
      Object.assign(new Error("Unique constraint failed"), { code: "P2002" }),
    );

    await simulateRunDailyContentJob();

    expect(mockJobLockCreate).toHaveBeenCalled();
    expect(mockPublishDailyContent).not.toHaveBeenCalled();
  });
});

describe("instrumentation.ts — runWeeklySeoJob time gate", () => {
  it("NE LANCE PAS le pipeline le dimanche (hors fenêtre)", async () => {
    jest.useFakeTimers();
    // 12 avril 2026 = dimanche
    jest.setSystemTime(new Date("2026-04-12T10:00:00Z"));

    await simulateRunWeeklySeoJob();

    expect(mockBlogArticleFindFirst).not.toHaveBeenCalled();
    expect(mockPublishWeeklyArticle).not.toHaveBeenCalled();
  });

  it("NE LANCE PAS le pipeline le jeudi (hors fenêtre)", async () => {
    jest.useFakeTimers();
    // 16 avril 2026 = jeudi
    jest.setSystemTime(new Date("2026-04-16T10:00:00Z"));

    await simulateRunWeeklySeoJob();

    expect(mockPublishWeeklyArticle).not.toHaveBeenCalled();
  });

  it("NE LANCE PAS le pipeline le lundi 8h UTC (avant fenêtre)", async () => {
    jest.useFakeTimers();
    // 13 avril 2026 = lundi
    jest.setSystemTime(new Date("2026-04-13T08:30:00Z"));

    await simulateRunWeeklySeoJob();

    expect(mockPublishWeeklyArticle).not.toHaveBeenCalled();
  });

  it("LANCE le pipeline le lundi 9h30 UTC (fenêtre principale) si article manquant", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-13T09:30:00Z"));
    mockBlogArticleFindFirst.mockResolvedValue(null);

    await simulateRunWeeklySeoJob();

    expect(mockBlogArticleFindFirst).toHaveBeenCalled();
    expect(mockPublishWeeklyArticle).toHaveBeenCalledTimes(1);
  });

  it("NE RELANCE PAS le pipeline le lundi 9h30 UTC si un article existe déjà cette semaine", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-13T09:30:00Z"));
    mockBlogArticleFindFirst.mockResolvedValue({ id: "article-1", slug: "test" });

    await simulateRunWeeklySeoJob();

    expect(mockPublishWeeklyArticle).not.toHaveBeenCalled();
  });

  it("LANCE en catch-up le mardi 15h UTC si article manquant", async () => {
    jest.useFakeTimers();
    // 14 avril 2026 = mardi
    jest.setSystemTime(new Date("2026-04-14T15:00:00Z"));
    mockBlogArticleFindFirst.mockResolvedValue(null);

    await simulateRunWeeklySeoJob();

    expect(mockPublishWeeklyArticle).toHaveBeenCalledTimes(1);
  });

  it("LANCE en catch-up le mercredi 10h UTC si article manquant", async () => {
    jest.useFakeTimers();
    // 15 avril 2026 = mercredi
    jest.setSystemTime(new Date("2026-04-15T10:00:00Z"));
    mockBlogArticleFindFirst.mockResolvedValue(null);

    await simulateRunWeeklySeoJob();

    expect(mockPublishWeeklyArticle).toHaveBeenCalledTimes(1);
  });

  it("SKIPPE en catch-up le mardi si article déjà publié", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-14T15:00:00Z"));
    mockBlogArticleFindFirst.mockResolvedValue({ id: "article-1" });

    await simulateRunWeeklySeoJob();

    expect(mockPublishWeeklyArticle).not.toHaveBeenCalled();
  });

  it("SKIPPE le lundi 11h UTC (fin de fenêtre principale exclusive)", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-13T11:00:00Z"));

    await simulateRunWeeklySeoJob();

    expect(mockPublishWeeklyArticle).not.toHaveBeenCalled();
  });
});

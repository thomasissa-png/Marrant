/**
 * Lots Q1 + Q3 (s14) dans publishDailyContent : vanne générée au niveau →
 * GARDER ; repli sur le pool validé ; gates de publication du conseil.
 * Prisma, agents et Director mockés (aucun appel LLM).
 */
const mockGenerateDailyJoke = jest.fn();
const mockValidateJoke = jest.fn();
const mockDirectorRewriteJoke = jest.fn();
const mockGenerateDailyTip = jest.fn();
const mockValidateTip = jest.fn();

jest.mock("@/lib/ai/agents/joke-agent", () => ({
  generateDailyJoke: (...a: unknown[]) => mockGenerateDailyJoke(...a),
  generateJokeDecryptage: jest.fn().mockResolvedValue({ comedyTechnique: "T", techniqueExplanation: "E", howToApply: "H" }),
}));
jest.mock("@/lib/ai/agents/tip-agent", () => ({
  generateDailyTip: (...a: unknown[]) => mockGenerateDailyTip(...a),
}));
jest.mock("@/lib/ai/agents/video-agent", () => ({ selectDailyVideo: jest.fn() }));
jest.mock("@/lib/ai/agents/standup-director-agent", () => ({
  validateJoke: (...a: unknown[]) => mockValidateJoke(...a),
  validateTip: (...a: unknown[]) => mockValidateTip(...a),
  validateVideoSelection: jest.fn(),
  directorRewriteJoke: (...a: unknown[]) => mockDirectorRewriteJoke(...a),
  directorRewriteTip: jest.fn(),
}));
jest.mock("@/lib/ai/content-planner", () => ({ getPlanSummary: jest.fn().mockResolvedValue("plan") }));

const mockPrisma = {
  dailyContent: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), delete: jest.fn() },
  contentPlan: { findUnique: jest.fn() },
  contentPlanEntry: { update: jest.fn() },
  joke: { findMany: jest.fn(), create: jest.fn(), findFirst: jest.fn(), count: jest.fn() },
  tip: { findMany: jest.fn(), create: jest.fn(), findFirst: jest.fn(), count: jest.fn() },
  video: { findMany: jest.fn(), findFirst: jest.fn(), count: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockPrisma;
  },
}));

import { publishDailyContent } from "@/lib/ai/daily-publisher";

const FRESH = {
  content: "J'ai mis mon agenda dans le frigo pour penser à le regarder.",
  punchline: "Maintenant je note mes rendez-vous sur le beurre.",
  category: "COUPLE",
  type: "ONE_LINER",
  maturityLevel: 1,
  comedyTechnique: "La boucle absurde",
  techniqueExplanation: "Tu pousses la solution jusqu'à l'absurde.",
  howToApply: "Prends une astuce et va trop loin.",
};
const CLEAN_TIP = {
  title: "Le silence après la vanne",
  content: "Quand tu sors une vanne, attends deux secondes avant de sourire.",
  category: "TIMING",
  difficulty: "DEBUTANT",
  example: "Ton collègue : « T'as vu la réunion ? » Toi : « J'y étais. Mentalement, non. »",
  exercise: "DÉFI SILENCE : compte deux secondes après chaque blague.",
};
const APPROVED = { verdict: "APPROVED", score: 9, strengths: [], issues: [], directorNote: "" };
const REJECTED = { verdict: "REJECTED", score: 5, strengths: [], issues: ["faible"], directorNote: "" };
const TODAY = new Date(Date.UTC(2026, 9, 1));

type Where = Record<string, unknown> | undefined;
const isValidatedPool = (where: Where) => where?.copyVerdict === "GARDER";

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  mockPrisma.dailyContent.findUnique.mockResolvedValue(null);
  mockPrisma.dailyContent.findMany.mockResolvedValue([]);
  mockPrisma.dailyContent.create.mockResolvedValue({});
  mockPrisma.contentPlan.findUnique.mockResolvedValue(null);
  mockPrisma.joke.findMany.mockResolvedValue([]);
  mockPrisma.joke.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
    Promise.resolve({ id: "new-joke", category: "COUPLE", ...data }),
  );
  mockPrisma.joke.count.mockResolvedValue(10);
  mockPrisma.joke.findFirst.mockImplementation(({ where }: { where: Where }) =>
    Promise.resolve(isValidatedPool(where) ? { id: "garder-joke", category: "SITUATION" } : { id: "legacy-joke", category: "SITUATION" }),
  );
  mockPrisma.tip.findMany.mockResolvedValue([]);
  mockPrisma.tip.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
    Promise.resolve({ id: "new-tip", category: "TIMING", ...data }),
  );
  mockPrisma.tip.count.mockResolvedValue(5);
  mockPrisma.tip.findFirst.mockResolvedValue({ id: "stock-tip", category: "TIMING" });
  mockPrisma.video.findMany.mockResolvedValue([]);
  mockPrisma.video.findFirst.mockResolvedValue(null);
  mockPrisma.video.count.mockResolvedValue(0);
  mockGenerateDailyJoke.mockResolvedValue(FRESH);
  mockValidateJoke.mockResolvedValue(APPROVED);
  mockGenerateDailyTip.mockResolvedValue(CLEAN_TIP);
  mockValidateTip.mockResolvedValue(APPROVED);
});

describe("Q1 : vanne du jour", () => {
  it("vanne générée APPROVED avec la barre → enregistrée GARDER + version + date de relecture", async () => {
    await publishDailyContent(TODAY);
    const data = mockPrisma.joke.create.mock.calls[0][0].data;
    expect(data.copyVerdict).toBe("GARDER");
    expect(data.copyReviewVersion).toBe(1);
    expect(data.copyReviewedAt).toBeInstanceOf(Date);
  });

  it("réécriture du Director (non revalidée) → pas marquée GARDER", async () => {
    mockValidateJoke.mockResolvedValue(REJECTED);
    mockDirectorRewriteJoke.mockResolvedValue({ content: "Setup réécrit par le directeur.", punchline: "Chute neuve." });
    await publishDailyContent(TODAY);
    const data = mockPrisma.joke.create.mock.calls[0][0].data;
    expect(data.copyVerdict).toBeUndefined();
  });

  it("tirets cadratins retirés de la vanne avant enregistrement", async () => {
    mockGenerateDailyJoke.mockResolvedValue({ ...FRESH, punchline: "Maintenant — je note tout sur le beurre." });
    await publishDailyContent(TODAY);
    expect(mockPrisma.joke.create.mock.calls[0][0].data.punchline).not.toContain("—");
  });

  it("génération en échec → repli sur le pool validé (GARDER + décryptage)", async () => {
    mockGenerateDailyJoke.mockRejectedValue(new Error("API down"));
    await publishDailyContent(TODAY);
    const poolCall = mockPrisma.joke.count.mock.calls.find(([a]: [{ where: Where }]) => isValidatedPool(a.where));
    expect(poolCall?.[0].where).toMatchObject({ isActive: true, copyVerdict: "GARDER", comedyTechnique: { not: null } });
    expect(mockPrisma.dailyContent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ jokeId: "garder-joke" }) });
  });

  it("pool validé vide (transition) → repli historique", async () => {
    mockGenerateDailyJoke.mockRejectedValue(new Error("API down"));
    mockPrisma.joke.count.mockImplementation(({ where }: { where: Where }) => Promise.resolve(isValidatedPool(where) ? 0 : 10));
    await publishDailyContent(TODAY);
    expect(mockPrisma.dailyContent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ jokeId: "legacy-joke" }) });
  });
});

describe("Q3 : gates du conseil du jour", () => {
  it("tirets cadratins corrigés, conseil publié sans régénération", async () => {
    mockGenerateDailyTip.mockResolvedValue({ ...CLEAN_TIP, content: "Attends deux secondes — pas plus — avant de sourire." });
    await publishDailyContent(TODAY);
    expect(mockGenerateDailyTip).toHaveBeenCalledTimes(1);
    expect(mockPrisma.tip.create.mock.calls[0][0].data.content).toBe("Attends deux secondes, pas plus, avant de sourire.");
  });

  it("vouvoiement → UNE régénération revalidée par le Director, puis publication", async () => {
    mockGenerateDailyTip
      .mockResolvedValueOnce({ ...CLEAN_TIP, content: "Vous devez attendre deux secondes." })
      .mockResolvedValueOnce(CLEAN_TIP);
    await publishDailyContent(TODAY);
    expect(mockGenerateDailyTip).toHaveBeenCalledTimes(2);
    expect(mockGenerateDailyTip.mock.calls[1][0].plannedTheme).toMatch(/REJET AUTOMATIQUE/);
    expect(mockValidateTip).toHaveBeenCalledTimes(2);
    expect(mockPrisma.tip.create.mock.calls[0][0].data.content).toBe(CLEAN_TIP.content);
  });

  it("deux rejets → aucun conseil IA créé, conseil du stock en repli", async () => {
    mockGenerateDailyTip.mockResolvedValue({ ...CLEAN_TIP, example: "Ce conseil a été généré par une IA." });
    const res = await publishDailyContent(TODAY);
    expect(mockGenerateDailyTip).toHaveBeenCalledTimes(2);
    expect(mockPrisma.tip.create).not.toHaveBeenCalled();
    expect(res.errors.join(" ")).toMatch(/gates de publication/);
    expect(mockPrisma.dailyContent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ tipId: "stock-tip" }) });
  });

  it("régénération propre mais refusée par le Director → conseil du stock", async () => {
    mockGenerateDailyTip
      .mockResolvedValueOnce({ ...CLEAN_TIP, title: "Putain de silence" })
      .mockResolvedValueOnce(CLEAN_TIP);
    mockValidateTip.mockResolvedValueOnce(APPROVED).mockResolvedValueOnce(REJECTED);
    await publishDailyContent(TODAY);
    expect(mockPrisma.tip.create).not.toHaveBeenCalled();
    expect(mockPrisma.dailyContent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ tipId: "stock-tip" }) });
  });
});

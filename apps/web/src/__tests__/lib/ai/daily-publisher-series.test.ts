/**
 * Lot V7 — intégration du filtre anti-séries dans publishDailyContent.
 * Prisma, agents et Director mockés (aucun appel LLM). Le filtre
 * (joke-series-guard) est le vrai.
 */
const mockGenerateDailyJoke = jest.fn();
const mockValidateJoke = jest.fn();
const mockDirectorRewriteJoke = jest.fn();

jest.mock("@/lib/ai/agents/joke-agent", () => ({
  generateDailyJoke: (...a: unknown[]) => mockGenerateDailyJoke(...a),
  generateJokeDecryptage: jest.fn().mockResolvedValue({ comedyTechnique: "T", techniqueExplanation: "E", howToApply: "H" }),
}));
jest.mock("@/lib/ai/agents/tip-agent", () => ({
  generateDailyTip: jest.fn().mockResolvedValue({ title: "Conseil", content: "c", category: "TIMING", difficulty: "BEGINNER", example: "e", exercise: "x" }),
}));
jest.mock("@/lib/ai/agents/video-agent", () => ({ selectDailyVideo: jest.fn() }));
jest.mock("@/lib/ai/agents/standup-director-agent", () => ({
  validateJoke: (...a: unknown[]) => mockValidateJoke(...a),
  validateTip: jest.fn().mockResolvedValue({ verdict: "APPROVED", score: 9, strengths: [], issues: [], directorNote: "" }),
  validateVideoSelection: jest.fn(),
  directorRewriteJoke: (...a: unknown[]) => mockDirectorRewriteJoke(...a),
  directorRewriteTip: jest.fn(),
}));
jest.mock("@/lib/ai/content-planner", () => ({ getPlanSummary: jest.fn().mockResolvedValue("plan") }));

const RESTO_SERIES = [
  "Mon copain : 'Choisis le resto samedi, ça m'est égal.' J'ai choisi un vegan.",
  "Mon copain : 'Choisis le resto, ça m'est égal.'",
  "Mon copain m'a demandé de choisir le resto pour samedi soir.",
  "Mon copain m'a dit 'choisis toi le resto pour samedi, ça m'est égal'.",
];

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

const DUP = { content: "Mon copain : « Choisis le resto samedi, ça m'est égal. »", punchline: "Il a pris la carte.", category: "COUPLE", type: "ONE_LINER", maturityLevel: 1 };
const FRESH = { content: "J'ai mis mon agenda dans le frigo pour penser à le regarder.", punchline: "Maintenant je note mes rendez-vous sur le beurre.", category: "COUPLE", type: "ONE_LINER", maturityLevel: 1 };
const APPROVED = { verdict: "APPROVED", score: 9, strengths: [], issues: [], directorNote: "" };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  mockPrisma.dailyContent.findUnique.mockResolvedValue(null);
  mockPrisma.dailyContent.findMany.mockResolvedValue([]);
  mockPrisma.dailyContent.create.mockResolvedValue({});
  mockPrisma.contentPlan.findUnique.mockResolvedValue(null);
  // Deux lectures joke.findMany : 14 récentes (take) puis tout le catalogue (anti-séries)
  mockPrisma.joke.findMany.mockImplementation((args: { take?: number }) =>
    Promise.resolve(args?.take ? [] : RESTO_SERIES.map((content) => ({ content, isActive: true }))),
  );
  mockPrisma.joke.create.mockImplementation(({ data }: { data: { content: string } }) => Promise.resolve({ id: "new-joke", category: "COUPLE", ...data }));
  mockPrisma.joke.findFirst.mockResolvedValue({ id: "fallback-joke", category: "SITUATION" });
  mockPrisma.joke.count.mockResolvedValue(10);
  mockPrisma.tip.findMany.mockResolvedValue([]);
  mockPrisma.tip.create.mockResolvedValue({ id: "tip", category: "TIMING" });
  mockPrisma.video.findMany.mockResolvedValue([]);
  mockPrisma.video.findFirst.mockResolvedValue(null);
  mockPrisma.video.count.mockResolvedValue(0);
  mockValidateJoke.mockResolvedValue(APPROVED);
});

const TODAY = new Date(Date.UTC(2026, 9, 1));

describe("publishDailyContent — anti-séries V7", () => {
  it("lit tout le catalogue (actifs + inactifs) et injecte la liste d'amorces", async () => {
    mockGenerateDailyJoke.mockResolvedValue(FRESH);
    await publishDailyContent(TODAY);
    expect(mockPrisma.joke.findMany).toHaveBeenCalledWith({ select: { content: true, isActive: true } });
    const ctx = mockGenerateDailyJoke.mock.calls[0][0];
    expect(ctx.avoidListPrompt).toContain("AMORCES DÉJÀ EXPLOITÉES");
    expect(mockValidateJoke).toHaveBeenCalledWith(FRESH, expect.any(String), expect.objectContaining({ dailyGeneration: true }));
  });

  it("quasi-doublon → une régénération, puis publication de la vanne neuve", async () => {
    mockGenerateDailyJoke.mockResolvedValueOnce(DUP).mockResolvedValueOnce(FRESH);
    const res = await publishDailyContent(TODAY);
    expect(mockGenerateDailyJoke).toHaveBeenCalledTimes(2);
    expect(mockGenerateDailyJoke.mock.calls[1][0].plannedTheme).toContain("REJET ANTI-SÉRIES");
    expect(mockPrisma.joke.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.joke.create.mock.calls[0][0].data.content).toBe(FRESH.content);
    expect(res.joke?.id).toBe("new-joke");
  });

  it("deux doublons → aucune vanne IA créée, Director non appelé, fallback catalogue", async () => {
    mockGenerateDailyJoke.mockResolvedValue(DUP);
    const res = await publishDailyContent(TODAY);
    expect(mockValidateJoke).not.toHaveBeenCalled();
    expect(mockPrisma.joke.create).not.toHaveBeenCalled();
    expect(res.errors.join(" ")).toMatch(/anti-séries/);
    expect(mockPrisma.dailyContent.create).toHaveBeenCalledWith({ data: expect.objectContaining({ jokeId: "fallback-joke" }) });
  });

  it("réécriture Director qui retombe dans une série → non publiée", async () => {
    mockGenerateDailyJoke.mockResolvedValue(FRESH);
    mockValidateJoke.mockResolvedValue({ verdict: "REJECTED", score: 5, strengths: [], issues: ["faible"], directorNote: "" });
    mockDirectorRewriteJoke.mockResolvedValue(DUP);
    const res = await publishDailyContent(TODAY);
    expect(mockDirectorRewriteJoke).toHaveBeenCalledTimes(1);
    expect(mockPrisma.joke.create).not.toHaveBeenCalled();
    expect(res.joke).toBeNull();
  });

  it("catalogue illisible → filtre désactivé, la génération continue", async () => {
    mockPrisma.joke.findMany.mockImplementation((args: { take?: number }) =>
      args?.take ? Promise.resolve([]) : Promise.reject(new Error("DB down")),
    );
    mockGenerateDailyJoke.mockResolvedValue(DUP);
    const res = await publishDailyContent(TODAY);
    expect(mockGenerateDailyJoke.mock.calls[0][0].avoidListPrompt).toBe("");
    expect(res.joke?.id).toBe("new-joke");
  });
});

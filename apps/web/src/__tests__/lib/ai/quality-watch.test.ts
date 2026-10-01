/**
 * @jest-environment node
 *
 * Lot Q4 (s14) : contrôle qualité du matin + route cron. Prisma, Director,
 * verrou et e-mail mockés (aucun appel LLM, aucun envoi).
 */
const mockValidateJoke = jest.fn();
const mockSendAdminAlert = jest.fn();
const mockTryAcquireLock = jest.fn();

jest.mock("@/lib/ai/agents/standup-director-agent", () => ({
  validateJoke: (...a: unknown[]) => mockValidateJoke(...a),
}));
jest.mock("@/lib/email", () => ({ sendAdminAlert: (...a: unknown[]) => mockSendAdminAlert(...a) }));
jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: (...a: unknown[]) => mockTryAcquireLock(...a),
  buildJobLockKey: (name: string, d: Date) => `${name}:${d.toISOString().slice(0, 10)}`,
}));

const mockPrisma = {
  dailyContent: { findUnique: jest.fn(), update: jest.fn() },
  joke: { count: jest.fn(), findFirst: jest.fn() },
  tip: { count: jest.fn(), findMany: jest.fn(), update: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockPrisma;
  },
}));

import { runQualityWatch } from "@/lib/ai/quality-watch";
import { GET } from "@/app/api/cron/quality-watch/route";

const NOW = new Date(Date.UTC(2026, 8, 30, 7, 0));
const DATE = new Date(Date.UTC(2026, 8, 30));
const JOKE = { id: "j-day", content: "J'ai offert des fleurs.", punchline: "Elle est allergique.", category: "COUPLE", type: "ONE_LINER", maturityLevel: 1, copyVerdict: null };
const TIP = {
  id: "t-day",
  title: "Le silence après la vanne",
  content: "Quand tu sors une vanne, attends deux secondes avant de sourire.",
  example: "Ton collègue : « T'as vu la réunion ? » Toi : « J'y étais. »",
  exercise: "DÉFI SILENCE : compte deux secondes.",
};
const APPROVED = { verdict: "APPROVED", score: 9, strengths: [], issues: [], directorNote: "" };
const BELOW = { verdict: "REJECTED", score: 5, strengths: [], issues: ["chute télégraphiée"], directorNote: "" };

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  mockTryAcquireLock.mockResolvedValue(true);
  mockPrisma.dailyContent.findUnique.mockResolvedValue({ date: DATE, joke: JOKE, tip: TIP });
  mockPrisma.dailyContent.update.mockResolvedValue({});
  mockPrisma.joke.count.mockResolvedValue(3);
  mockPrisma.joke.findFirst.mockResolvedValue({ id: "j-garder", category: "SITUATION" });
  mockPrisma.tip.count.mockResolvedValue(4);
  mockPrisma.tip.findMany.mockResolvedValue([{ ...TIP, id: "t-stock" }]);
  mockPrisma.tip.update.mockResolvedValue({});
  mockValidateJoke.mockResolvedValue(APPROVED);
});

describe("runQualityWatch", () => {
  it("tout est au niveau : 1 appel LLM avec la barre, aucun remplacement, aucun e-mail", async () => {
    const r = await runQualityWatch({ now: NOW });
    expect(mockValidateJoke).toHaveBeenCalledTimes(1);
    expect(mockValidateJoke.mock.calls[0][2]).toEqual({ dailyGeneration: true });
    expect(r.llmCalls).toBe(1);
    expect(mockPrisma.dailyContent.update).not.toHaveBeenCalled();
    expect(mockSendAdminAlert).not.toHaveBeenCalled();
  });

  it("vanne sous la barre → remplacée par une vanne du pool GARDER (hors vanne actuelle) + e-mail", async () => {
    mockValidateJoke.mockResolvedValue(BELOW);
    const r = await runQualityWatch({ now: NOW });
    const poolWhere = mockPrisma.joke.count.mock.calls[0][0].where;
    expect(poolWhere).toMatchObject({ isActive: true, copyVerdict: "GARDER", comedyTechnique: { not: null }, id: { notIn: ["j-day"] } });
    expect(mockPrisma.dailyContent.update).toHaveBeenCalledWith({ where: { date: DATE }, data: { jokeId: "j-garder" } });
    expect(r.joke.replacedBy).toBe("j-garder");
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
    expect(mockSendAdminAlert.mock.calls[0][1]).toContain("chute télégraphiée");
  });

  it("NEEDS_REVISION = moyen → remplacée aussi (rien de moyen)", async () => {
    mockValidateJoke.mockResolvedValue({ ...BELOW, verdict: "NEEDS_REVISION", score: 8 });
    const r = await runQualityWatch({ now: NOW });
    expect(r.joke.replacedBy).toBe("j-garder");
  });

  it("pool vide → pas de remplacement, défaut signalé par e-mail", async () => {
    mockValidateJoke.mockResolvedValue(BELOW);
    mockPrisma.joke.count.mockResolvedValue(0);
    const r = await runQualityWatch({ now: NOW });
    expect(mockPrisma.dailyContent.update).not.toHaveBeenCalled();
    expect(r.defects.join(" ")).toMatch(/aucune vanne validée/);
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
  });

  it("vanne GARDER (catalogue relu à l'aveugle, étalons compris) : conservée sans appel LLM ni e-mail", async () => {
    mockPrisma.dailyContent.findUnique.mockResolvedValueOnce({ date: DATE, joke: { ...JOKE, copyVerdict: "GARDER" }, tip: TIP });
    const r = await runQualityWatch({ now: NOW });
    expect(mockValidateJoke).not.toHaveBeenCalled();
    expect(r.llmCalls).toBe(0);
    expect(r.joke.verdict).toBe("GARDER");
    expect(r.joke.replacedBy).toBeUndefined();
    expect(mockSendAdminAlert).not.toHaveBeenCalled();
  });

  it("validation impossible : vanne non validée remplacée, défaut signalé", async () => {
    mockValidateJoke.mockRejectedValue(new Error("API down"));
    const replaced = await runQualityWatch({ now: NOW });
    expect(replaced.joke.replacedBy).toBe("j-garder");
    expect(replaced.defects.join(" ")).toMatch(/Validation de la vanne impossible/);
  });

  it("conseil avec tirets cadratins → corrigé en base, pas d'e-mail pour ça seul", async () => {
    mockPrisma.dailyContent.findUnique.mockResolvedValue({ date: DATE, joke: JOKE, tip: { ...TIP, content: "Attends — pas plus — deux secondes." } });
    const r = await runQualityWatch({ now: NOW });
    expect(mockPrisma.tip.update).toHaveBeenCalledWith({
      where: { id: "t-day" },
      data: expect.objectContaining({ content: "Attends, pas plus, deux secondes." }),
    });
    expect(r.tip.emDashFixed).toBe(true);
    expect(mockSendAdminAlert).not.toHaveBeenCalled();
  });

  it("conseil rejeté par les gates (vouvoiement) → remplacé par un conseil du stock propre + e-mail", async () => {
    mockPrisma.dailyContent.findUnique.mockResolvedValue({ date: DATE, joke: JOKE, tip: { ...TIP, content: "Vous devez attendre." } });
    mockPrisma.tip.findMany.mockResolvedValue([
      { ...TIP, id: "t-bad", content: "Putain, attends." },
      { ...TIP, id: "t-stock" },
    ]);
    const r = await runQualityWatch({ now: NOW });
    expect(mockPrisma.tip.findMany.mock.calls[0][0].where).toEqual({ isActive: true, id: { not: "t-day" } });
    expect(mockPrisma.dailyContent.update).toHaveBeenCalledWith({ where: { date: DATE }, data: { tipId: "t-stock" } });
    expect(r.tip.replacedBy).toBe("t-stock");
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
  });

  it("verrou déjà pris → aucun appel LLM ; force l'ignore", async () => {
    mockTryAcquireLock.mockResolvedValue(false);
    const skipped = await runQualityWatch({ now: NOW });
    expect(skipped.skipped).toBeDefined();
    expect(mockValidateJoke).not.toHaveBeenCalled();
    await runQualityWatch({ now: NOW, force: true });
    expect(mockValidateJoke).toHaveBeenCalledTimes(1);
  });

  it("DailyContent absent → défaut signalé, aucun appel LLM", async () => {
    mockPrisma.dailyContent.findUnique.mockResolvedValue(null);
    const r = await runQualityWatch({ now: NOW });
    expect(mockValidateJoke).not.toHaveBeenCalled();
    expect(r.defects.length).toBe(1);
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
  });
});

describe("GET /api/cron/quality-watch", () => {
  const OLD = process.env.CRON_SECRET;
  afterAll(() => {
    process.env.CRON_SECRET = OLD;
  });

  it("401 sans Bearer CRON_SECRET valide", async () => {
    process.env.CRON_SECRET = "s3cret";
    const res = await GET(new Request("https://x/api/cron/quality-watch", { headers: { authorization: "Bearer nope" } }));
    expect(res.status).toBe(401);
    expect(mockValidateJoke).not.toHaveBeenCalled();
  });

  it("200 avec le bon Bearer", async () => {
    process.env.CRON_SECRET = "s3cret";
    const res = await GET(new Request("https://x/api/cron/quality-watch", { headers: { authorization: "Bearer s3cret" } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.llmCalls).toBe(1);
  });
});

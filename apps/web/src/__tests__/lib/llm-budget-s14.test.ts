/**
 * @jest-environment node
 *
 * Coupe-circuit budget LLM (s14) : seuils 24 h glissantes et mois UTC, sur les
 * DEUX clients (callWithRetry des crons/agents, src/lib/claude.ts de /api/ai),
 * alerte e-mail 1×/jour. /api/ai est coupée (410) depuis le 03/10 ; le quota persistant reste testé.
 * Aucun appel réseau : SDK Anthropic, Prisma et e-mail mockés.
 */

// Implémentation RÉELLE du garde-fou (jest.setup.ts le neutralise par défaut).
jest.mock("@/lib/ai/budget-guard", () => jest.requireActual("@/lib/ai/budget-guard"));

const mockCreate = jest.fn();
// Client construit à l'import de client.ts : accès paresseux au mock.
jest.mock("@anthropic-ai/sdk", () =>
  jest.fn().mockImplementation(() => ({ messages: { create: (...a: unknown[]) => mockCreate(...a) } })),
);

let spent24h = 0;
let spentMonth = 0;
const locks = new Set<string>();
const quotaRows: string[] = [];
const mockPrisma = {
  llmUsageLog: {
    aggregate: jest.fn(async ({ where }: { where: { createdAt: { gte: Date } } }) => {
      const isMonth = where.createdAt.gte.getUTCDate() === 1 && where.createdAt.gte.getUTCHours() === 0;
      return { _sum: { costUsd: isMonth ? spentMonth : spent24h } };
    }),
    create: jest.fn().mockResolvedValue({}),
  },
  jobLock: {
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    create: jest.fn(async ({ data }: { data: { jobKey: string } }) => {
      if (data.jobKey.startsWith("quota:")) {
        quotaRows.push(data.jobKey);
        return data;
      }
      if (locks.has(data.jobKey)) throw Object.assign(new Error("unique"), { code: "P2002" });
      locks.add(data.jobKey);
      return data;
    }),
    count: jest.fn(async ({ where }: { where: { jobKey: { startsWith: string } } }) =>
      quotaRows.filter((k) => k.startsWith(where.jobKey.startsWith)).length),
  },
  user: { findUnique: jest.fn().mockResolvedValue({ plan: "PREMIUM" }) },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockPrisma;
  },
}));

const mockSendAdminAlert = jest.fn().mockResolvedValue(undefined);
// s15 (06/10) : alertes enregistrées (lib/admin-alerts), plus d'e-mail direct. Le mock reçoit (sujet, html, clé).
jest.mock("@/lib/admin-alerts", () => ({
  recordAdminAlert: (i: { cle: string; sujet: string; html: string }) => mockSendAdminAlert(i.sujet, i.html, i.cle),
}));
jest.mock("next-auth", () => ({ getServerSession: jest.fn().mockResolvedValue({ user: { id: "u1" } }) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
// Limiteur mémoire neutralisé : on teste ici la limite PERSISTANTE.
jest.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ allowed: true }) }));

import { assertLlmBudget, LlmBudgetExceededError, getLlmBudgets } from "@/lib/ai/budget-guard";
import { callWithRetry, noStoreFetch } from "@/lib/ai/client";
import { generateJoke } from "@/lib/claude";
import { consumeDailyQuota } from "@/lib/persistent-quota";

const message = (text: string) => ({
  content: [{ type: "text", text }],
  stop_reason: "end_turn",
  usage: { input_tokens: 100, output_tokens: 50 },
});
const params = { model: "claude-sonnet-5-5", max_tokens: 100, messages: [{ role: "user" as const, content: "x" }] };
const ENV = { ...process.env };

beforeEach(() => {
  spent24h = 0;
  spentMonth = 0;
  locks.clear();
  quotaRows.length = 0;
  jest.clearAllMocks();
  process.env = { ...ENV };
  delete process.env.LLM_DAILY_BUDGET_USD;
  delete process.env.LLM_MONTHLY_BUDGET_USD;
  delete process.env.AI_USER_DAILY_LIMIT;
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  mockCreate.mockResolvedValue(message('{"content":"a","punchline":"b","category":"BOULOT"}'));
});

describe("assertLlmBudget : deux seuils", () => {
  it("défauts 5 $ / 24 h et 40 $ / mois", () => {
    expect(getLlmBudgets()).toEqual({ dailyUsd: 5, monthlyUsd: 40 });
  });

  it("sous les seuils : passe, aucune alerte", async () => {
    spent24h = 4.99;
    spentMonth = 39.99;
    await expect(assertLlmBudget()).resolves.toBeUndefined();
    expect(mockSendAdminAlert).not.toHaveBeenCalled();
  });

  it("24 h glissantes ≥ LLM_DAILY_BUDGET_USD : bloque", async () => {
    spent24h = 5;
    await expect(assertLlmBudget()).rejects.toMatchObject({ name: "LlmBudgetExceededError", scope: "daily" });
  });

  it("mois UTC ≥ LLM_MONTHLY_BUDGET_USD : bloque même si le jour est sous le seuil", async () => {
    spent24h = 1;
    spentMonth = 40;
    await expect(assertLlmBudget()).rejects.toMatchObject({ scope: "monthly" });
  });

  it("seuils surchargés par variables d'environnement", async () => {
    process.env.LLM_DAILY_BUDGET_USD = "1";
    process.env.LLM_MONTHLY_BUDGET_USD = "abc"; // invalide → défaut
    spent24h = 1.5;
    expect(getLlmBudgets()).toEqual({ dailyUsd: 1, monthlyUsd: 40 });
    await expect(assertLlmBudget()).rejects.toMatchObject({ scope: "daily" });
  });

  it("dépense illisible (base KO) : fail-closed", async () => {
    mockPrisma.llmUsageLog.aggregate.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    await expect(assertLlmBudget()).rejects.toMatchObject({ scope: "unavailable" });
  });

  it("une seule alerte e-mail par jour UTC", async () => {
    spent24h = 12;
    const now = new Date("2026-10-01T05:00:00Z");
    await expect(assertLlmBudget({ agent: "joke-agent", fn: "generateDailyJoke" }, now)).rejects.toBeInstanceOf(LlmBudgetExceededError);
    await expect(assertLlmBudget({}, now)).rejects.toBeInstanceOf(LlmBudgetExceededError);
    await expect(assertLlmBudget({}, new Date("2026-10-01T22:00:00Z"))).rejects.toBeInstanceOf(LlmBudgetExceededError);
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(1);
    expect(mockSendAdminAlert.mock.calls[0][0]).toContain("Coupe-circuit LLM");
    await expect(assertLlmBudget({}, new Date("2026-10-02T01:00:00Z"))).rejects.toBeInstanceOf(LlmBudgetExceededError);
    expect(mockSendAdminAlert).toHaveBeenCalledTimes(2);
  });
});

describe("client 1 : callWithRetry (crons, agents)", () => {
  it("budget dépassé : aucun appel SDK, aucune relance, aucune ligne LlmUsageLog", async () => {
    spent24h = 6;
    await expect(callWithRetry(params, 2, { agent: "seo-blog-agent", fn: "generateArticle" })).rejects.toBeInstanceOf(LlmBudgetExceededError);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockPrisma.llmUsageLog.create).not.toHaveBeenCalled();
  });

  it("seuil mensuel dépassé : aucun appel SDK", async () => {
    spentMonth = 41;
    await expect(callWithRetry(params, 2, { agent: "a", fn: "b" })).rejects.toMatchObject({ scope: "monthly" });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("sous budget : 1 appel, journalisé même sans meta (compteur exact)", async () => {
    await callWithRetry(params);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockPrisma.llmUsageLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ agent: "non-attribue", fn: "inconnu" }) }),
    );
  });

  it("le client Anthropic utilise un fetch en cache: no-store", async () => {
    const spy = jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    await noStoreFetch("https://api.anthropic.com/v1/messages", { method: "POST" });
    expect(spy).toHaveBeenCalledWith("https://api.anthropic.com/v1/messages", { method: "POST", cache: "no-store" });
    spy.mockRestore();
  });
});

describe("client 2 : src/lib/claude.ts (POST /api/ai)", () => {
  it("budget dépassé : aucun appel SDK", async () => {
    spent24h = 5.5;
    await expect(generateJoke({})).rejects.toBeInstanceOf(LlmBudgetExceededError);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("sous budget : appel journalisé sous agent api-ai", async () => {
    await generateJoke({});
    expect(mockPrisma.llmUsageLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ agent: "api-ai", fn: "generateJoke" }) }),
    );
  });
});

describe("POST /api/ai : fonction coupée (décision Thomas 03/10)", () => {
  it("POST : 410, message neutre, sans appel LLM ni lecture en base", async () => {
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST();
    expect(res.status).toBe(410);
    const { error } = await res.json();
    expect(error).not.toMatch(/\bIA\b|intelligence artificielle/i);
    expect(error).not.toContain("\u2014");
    expect(mockCreate).not.toHaveBeenCalled();
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("GET : 410 également", async () => {
    const { GET } = await import("@/app/api/ai/route");
    expect((await GET()).status).toBe(410);
  });
});

describe("quota persistant (lib/persistent-quota)", () => {
  it("quota : base KO → refus (fail-closed)", async () => {
    mockPrisma.jobLock.count.mockRejectedValueOnce(new Error("down"));
    expect((await consumeDailyQuota("ai:u2", 30)).allowed).toBe(false);
  });
});

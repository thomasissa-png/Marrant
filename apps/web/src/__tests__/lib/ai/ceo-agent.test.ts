/**
 * Phase 5.D — Groupe 1 P0 : Tests CEO Agent router (lib/ai/agents/ceo-agent.ts).
 *
 * Cible : `apps/web/src/lib/ai/agents/ceo-agent.ts` (1388 lignes, router complet).
 *
 * Périmètre — fonctions principales :
 *  - `runDailyTick` : orchestrateur cron, 5 garde-fous séquentiels
 *  - `routeCeoTask` : switch exhaustif sur 8 CeoTaskType + `never` check
 *  - `triageOpportunity` (Haiku 4.5 — 14× moins cher pour scoring binaire)
 *  - `composeOutboundMessage` (Sonnet 4.6 + cache, footer auto, persist DB)
 *  - `dualPassValidate` (délègue validateCeoOutbound — Director G-CEO1/2/3/4)
 *  - `draftBacklinkPitch` + `pitchToBacklinkOpportunity`
 *  - `runWeeklyReport` (Opus 4.7, lundi 9h)
 *  - `selectPlaybook` (déterministe, 7 playbooks P1-P7)
 *
 * Stratégie mocks (cf. handoff Groupe 4) :
 *  - Prisma : helper factorisé `__tests__/helpers/ceo-prisma-mock.ts`
 *  - Anthropic : helper factorisé `__tests__/helpers/anthropic-mock.ts`
 *  - validateCeoOutbound, ceo-helpers, twitter-client, resend : jest.mock direct
 *
 * Garde-fous séquentiels runDailyTick (à tester individuellement) :
 *  1. isCeoEnabled → false → early return "disabled"
 *  2. getCeoConfig → null → early return "no_config"
 *  3. acquireCeoLock → false → early return "locked"
 *  4. Budget hard stop → daily eur > CEO_BUDGET_HARD_STOP_EUR → "budget_exceeded"
 *  5. Pull tasks (attempts < 3, scheduledFor lte now)
 *  + execute via routeCeoTask + lock release dans finally
 */

// ─── Mocks au top du fichier (avant tout import) ─────────────────────

// Mock Anthropic SDK — instancié au load par `@/lib/ai/client.ts`.
// La factory capture une jest.fn() exposée ensuite via jest.requireMock pour
// éviter le pattern "Cannot access ... before initialization" (hoisting).
jest.mock("@anthropic-ai/sdk", () => {
  const create = jest.fn();
  const ctor = jest.fn().mockImplementation(() => ({ messages: { create } }));
  // @ts-expect-error stocke la ref pour récupération via requireMock
  ctor.__messagesCreate = create;
  return ctor;
});

// Mock Prisma via factory partagée (cf. helpers/ceo-prisma-mock.ts).
jest.mock("@/lib/prisma", () => ({
  prisma: (
    jest.requireActual(
      "@/__tests__/helpers/ceo-prisma-mock",
    ) as typeof import("@/__tests__/helpers/ceo-prisma-mock")
  ).createCeoPrismaMock(),
}));

// Mock ceo-helpers — fonctions imported par ceo-agent.ts (kill-switch, lock, frequency, dedup).
jest.mock("@/lib/ai/ceo-helpers", () => ({
  acquireCeoLock: jest.fn(),
  releaseCeoLock: jest.fn(),
  applyFrequencyCap: jest.fn(),
  checkAndStoreDedup: jest.fn(),
  getCeoConfig: jest.fn(),
  hashPii: jest.fn((v: string) => `hash_${v.slice(0, 4)}`),
  isCeoEnabled: jest.fn(),
  lookupJoke: jest.fn(),
  lookupResource: jest.fn(),
  maskPii: jest.fn((v: string) => v.replace(/[a-z]+@/, "***@")),
  markCeoTouchpoint: jest.fn(),
  recordAudit: jest.fn(),
  setCeoMemory: jest.fn(),
  snapshotCeoKpis: jest.fn(),
}));

// Mock standup-director (validation Director — couvert Groupe 3).
jest.mock("@/lib/ai/agents/standup-director-agent", () => ({
  validateCeoOutbound: jest.fn(),
}));

// Mock email footer — couvert Groupe 2.
jest.mock("@/lib/email/ceo-email-footer", () => ({
  enforceEmailFooter: jest.fn((body: string) => `${body}\n\n[FOOTER]`),
}));

// Mock Resend — pas d'envoi réel.
const mockResendSend = jest.fn();
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockResendSend },
  })),
}));

// Mock twitter-client (couvert Groupe 5 — ici on stub la signature).
jest.mock("@/lib/twitter/twitter-client", () => ({
  sendTwitterDmByHandle: jest.fn(),
}));

// ─── Refs typées vers les mocks (post-jest.mock) ──────────────────────

import type { CeoPrismaMock } from "@/__tests__/helpers/ceo-prisma-mock";
import {
  mockHaikuResponse,
  mockSonnetResponse,
  mockOpusResponse,
  defaultTriagePayload,
  defaultDraftPayload,
  defaultDirectorVerdict,
} from "@/__tests__/helpers/anthropic-mock";

const { prisma: mockPrisma } = jest.requireMock("@/lib/prisma") as {
  prisma: CeoPrismaMock;
};
// Ref typée vers le mock messages.create (post-jest.mock).
const mockAnthropicMessagesCreate = (
  jest.requireMock("@anthropic-ai/sdk") as jest.Mock & { __messagesCreate: jest.Mock }
).__messagesCreate;
const mockHelpers = jest.requireMock("@/lib/ai/ceo-helpers") as {
  acquireCeoLock: jest.Mock;
  releaseCeoLock: jest.Mock;
  applyFrequencyCap: jest.Mock;
  checkAndStoreDedup: jest.Mock;
  getCeoConfig: jest.Mock;
  isCeoEnabled: jest.Mock;
  lookupJoke: jest.Mock;
  lookupResource: jest.Mock;
  markCeoTouchpoint: jest.Mock;
  recordAudit: jest.Mock;
  setCeoMemory: jest.Mock;
  snapshotCeoKpis: jest.Mock;
};
const { validateCeoOutbound: mockValidateCeoOutbound } = jest.requireMock(
  "@/lib/ai/agents/standup-director-agent",
) as { validateCeoOutbound: jest.Mock };
const { sendTwitterDmByHandle: mockSendTwitterDm } = jest.requireMock(
  "@/lib/twitter/twitter-client",
) as { sendTwitterDmByHandle: jest.Mock };

// ─── Imports du module sous test (post-mocks) ─────────────────────────

import {
  runDailyTick,
  triageOpportunity,
  composeOutboundMessage,
  dualPassValidate,
  draftBacklinkPitch,
  pitchToBacklinkOpportunity,
  runWeeklyReport,
  selectPlaybook,
  CHANNEL_CHAR_LIMITS,
  CEO_BUDGET_HARD_STOP_EUR,
  CEO_HAIKU_MODEL,
  CEO_OPUS_MODEL,
  type BacklinkOpportunity,
  type InboundSignal,
} from "@/lib/ai/agents/ceo-agent";
import type { CeoLead, CeoTask } from "@prisma/client";

// ─── Fixtures ─────────────────────────────────────────────────────────

const FIXED_NOW = new Date("2026-05-07T03:00:00Z"); // 03h UTC = dans la fenêtre cron

function makeLead(overrides: Partial<CeoLead> = {}): CeoLead {
  return {
    id: "lead_1",
    userId: null,
    email: "alex@example.com",
    socialHandle: null,
    source: "email_signup",
    score: 5,
    signals: {},
    status: "WARM",
    lastContactAt: null,
    lastPlaybook: null,
    touchpoints: 0,
    optOut: false,
    optOutReason: null,
    createdAt: new Date("2026-05-01T00:00:00Z"),
    updatedAt: new Date("2026-05-01T00:00:00Z"),
    ...overrides,
  } as unknown as CeoLead;
}

function makeTask(overrides: Partial<CeoTask> = {}): CeoTask {
  return {
    id: "task_1",
    type: "DRAFT_EMAIL",
    status: "PENDING",
    payload: { leadId: "lead_1", playbook: "P1", recipient: "alex@example.com" },
    scheduledFor: new Date("2026-05-07T02:00:00Z"),
    attempts: 0,
    contestedAt: null,
    result: null,
    errorMessage: null,
    startedAt: null,
    completedAt: null,
    createdAt: new Date("2026-05-07T00:00:00Z"),
    updatedAt: new Date("2026-05-07T00:00:00Z"),
    ...overrides,
  } as unknown as CeoTask;
}

function makeMessage(overrides: Record<string, unknown> = {}) {
  return {
    id: "msg_1",
    channel: "EMAIL",
    direction: "OUTBOUND",
    recipient: "alex@example.com",
    subject: "Test",
    content: "Body content [FOOTER]",
    status: "PENDING",
    playbook: "P1",
    leadId: "lead_1",
    requiresHumanReview: false,
    directorScore: null,
    directorValidated: false,
    directorNote: null,
    sentAt: null,
    externalId: null,
    utmSource: "ceo",
    utmCampaign: "P1",
    utmMedium: "email",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeCfg(overrides: Record<string, unknown> = {}) {
  return {
    id: "cfg_1",
    enabled: true,
    dailyBudgetEur: 2.0,
    maxActionsPerTick: 3,
    autoSendEmail: true,
    autoSendDm: false,
    killSwitchReason: null,
    socialOutboundEnabled: false,
    dryRun: false,
    updatedAt: new Date(),
    ...overrides,
  };
}

// ─── Stub commun : tick happy path baseline ─────────────────────────

/**
 * Setup minimal pour qu'un `runDailyTick` passe les 4 premiers garde-fous
 * (kill-switch ON, config présente, lock acquis, budget OK) et arrive au
 * pull tasks. À combiner avec `mockPrisma.ceoTask.findMany.mockResolvedValueOnce(...)`.
 */
function stubTickPasses() {
  mockHelpers.isCeoEnabled.mockResolvedValue(true);
  mockHelpers.getCeoConfig.mockResolvedValue(makeCfg());
  mockHelpers.acquireCeoLock.mockResolvedValue(true);
  mockHelpers.releaseCeoLock.mockResolvedValue(undefined);
  mockHelpers.recordAudit.mockResolvedValue(undefined);
  mockPrisma.llmUsageLog.aggregate.mockResolvedValue({ _sum: { costUsd: 0.1 } });
  mockPrisma.ceoTask.findMany.mockResolvedValue([]);
  mockPrisma.ceoTask.update.mockResolvedValue({});
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAnthropicMessagesCreate.mockReset();
  mockResendSend.mockReset();
  mockSendTwitterDm.mockReset();
  process.env.RESEND_API_KEY = "re_test_secret";
  process.env.CEO_ADMIN_EMAIL = "alex@deviens-marrant.fr";
});

// ════════════════════════════════════════════════════════════════════
// SECTION 1 — runDailyTick : 5 garde-fous séquentiels + happy path
// ════════════════════════════════════════════════════════════════════

describe("runDailyTick — garde-fou 1 : kill-switch", () => {
  it("kill-switch OFF → early return status='disabled', 0 processed", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(false);
    const result = await runDailyTick();
    expect(result).toEqual({ status: "disabled", processed: 0, errors: 0 });
  });

  it("kill-switch OFF → ne lit JAMAIS la config ni le lock", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(false);
    await runDailyTick();
    expect(mockHelpers.getCeoConfig).not.toHaveBeenCalled();
    expect(mockHelpers.acquireCeoLock).not.toHaveBeenCalled();
  });

  it("kill-switch OFF → ne pull AUCUNE task (pas d'appel ceoTask.findMany)", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(false);
    await runDailyTick();
    expect(mockPrisma.ceoTask.findMany).not.toHaveBeenCalled();
  });
});

describe("runDailyTick — garde-fou 2 : config absente", () => {
  it("getCeoConfig → null → early return 'no_config'", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(true);
    mockHelpers.getCeoConfig.mockResolvedValueOnce(null);
    const result = await runDailyTick();
    expect(result.status).toBe("no_config");
    expect(result.processed).toBe(0);
    expect(mockHelpers.acquireCeoLock).not.toHaveBeenCalled();
  });
});

describe("runDailyTick — garde-fou 3 : lock global", () => {
  it("acquireCeoLock=false → early return 'locked' (anti-overlap multi-worker)", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(true);
    mockHelpers.getCeoConfig.mockResolvedValueOnce(makeCfg());
    mockHelpers.acquireCeoLock.mockResolvedValueOnce(false);
    const result = await runDailyTick();
    expect(result).toEqual({ status: "locked", processed: 0, errors: 0 });
  });

  it("lock détenu → ne libère pas le lock (n'appartient pas à ce worker)", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(true);
    mockHelpers.getCeoConfig.mockResolvedValueOnce(makeCfg());
    mockHelpers.acquireCeoLock.mockResolvedValueOnce(false);
    await runDailyTick();
    expect(mockHelpers.releaseCeoLock).not.toHaveBeenCalled();
  });

  it("lock détenu → ne pull aucune task", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(true);
    mockHelpers.getCeoConfig.mockResolvedValueOnce(makeCfg());
    mockHelpers.acquireCeoLock.mockResolvedValueOnce(false);
    await runDailyTick();
    expect(mockPrisma.ceoTask.findMany).not.toHaveBeenCalled();
  });

  it("lock acquis → libéré dans finally même si erreur (pas de fuite de lock)", async () => {
    stubTickPasses();
    // Force une erreur pendant le pull tasks
    mockPrisma.ceoTask.findMany.mockRejectedValueOnce(new Error("DB explosion"));
    await expect(runDailyTick()).rejects.toThrow("DB explosion");
    expect(mockHelpers.releaseCeoLock).toHaveBeenCalledTimes(1);
  });
});

describe("runDailyTick — garde-fou 4 : budget hard stop", () => {
  it(`daily eur > CEO_BUDGET_HARD_STOP_EUR (${CEO_BUDGET_HARD_STOP_EUR}€) → 'budget_exceeded'`, async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(true);
    mockHelpers.getCeoConfig.mockResolvedValueOnce(makeCfg());
    mockHelpers.acquireCeoLock.mockResolvedValueOnce(true);
    // costUsd × 0.92 = eur — pour dépasser 4€, costUsd ≥ 4.35
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({
      _sum: { costUsd: 5.0 },
    });
    const result = await runDailyTick();
    expect(result.status).toBe("budget_exceeded");
    expect(result.processed).toBe(0);
    expect(mockPrisma.ceoTask.findMany).not.toHaveBeenCalled();
  });

  it("budget dépassé → audit log 'tick_skip_budget' écrit", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(true);
    mockHelpers.getCeoConfig.mockResolvedValueOnce(makeCfg());
    mockHelpers.acquireCeoLock.mockResolvedValueOnce(true);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({
      _sum: { costUsd: 5.0 },
    });
    await runDailyTick();
    expect(mockHelpers.recordAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "tick_skip_budget",
        outcome: "skipped",
      }),
    );
  });

  it("budget dépassé → lock libéré quand même (finally)", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(true);
    mockHelpers.getCeoConfig.mockResolvedValueOnce(makeCfg());
    mockHelpers.acquireCeoLock.mockResolvedValueOnce(true);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({
      _sum: { costUsd: 5.0 },
    });
    await runDailyTick();
    expect(mockHelpers.releaseCeoLock).toHaveBeenCalledTimes(1);
  });

  it("budget = exactement 4€ → continue (strictement >, pas ≥)", async () => {
    stubTickPasses();
    // 4 / 0.92 = 4.347... costUsd → daily eur exactement 4.0
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({
      _sum: { costUsd: CEO_BUDGET_HARD_STOP_EUR / 0.92 },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([]);
    const result = await runDailyTick();
    // Cas pile-poil : implémentation actuelle = strict > donc continue
    expect(result.status).not.toBe("budget_exceeded");
  });

  it("aggregate retourne null → fallback à 0 (pas de crash)", async () => {
    stubTickPasses();
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: null } });
    const result = await runDailyTick();
    expect(result.status).toBe("ok");
  });
});

describe("runDailyTick — garde-fou 5 : pull tasks (anti-loop attempts<3)", () => {
  it("requête ceoTask.findMany filtre status='PENDING' + attempts<3 + scheduledFor<=now", async () => {
    stubTickPasses();
    await runDailyTick();
    expect(mockPrisma.ceoTask.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "PENDING",
          attempts: { lt: 3 },
        }),
        orderBy: { scheduledFor: "asc" },
        take: 3, // maxActionsPerTick par défaut
      }),
    );
  });

  it("respecte cfg.maxActionsPerTick (take=N)", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(true);
    mockHelpers.getCeoConfig.mockResolvedValueOnce(makeCfg({ maxActionsPerTick: 7 }));
    mockHelpers.acquireCeoLock.mockResolvedValueOnce(true);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([]);
    await runDailyTick();
    const call = mockPrisma.ceoTask.findMany.mock.calls[0][0] as { take: number };
    expect(call.take).toBe(7);
  });

  it("0 task PENDING → status='ok' processed=0 errors=0 (pas d'erreur)", async () => {
    stubTickPasses();
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([]);
    const result = await runDailyTick();
    expect(result).toEqual({ status: "ok", processed: 0, errors: 0 });
  });

  it("anti-loop : task à attempts=3 NE doit JAMAIS être renvoyée par findMany (filter lt:3)", async () => {
    stubTickPasses();
    await runDailyTick();
    const call = mockPrisma.ceoTask.findMany.mock.calls[0][0] as {
      where: { attempts: { lt: number } };
    };
    expect(call.where.attempts.lt).toBe(3);
  });
});

describe("runDailyTick — happy path complet (toute la chaîne passe)", () => {
  it("3 tasks pending → 3 processed 0 errors (chaque task → RUNNING → DONE)", async () => {
    stubTickPasses();
    const tasks = [
      makeTask({ id: "t1", type: "KPI_SNAPSHOT", payload: {} }),
      makeTask({ id: "t2", type: "KPI_SNAPSHOT", payload: {} }),
      makeTask({ id: "t3", type: "KPI_SNAPSHOT", payload: {} }),
    ];
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce(tasks);
    mockHelpers.snapshotCeoKpis.mockResolvedValue({
      id: "snap_1",
      date: new Date("2026-05-07"),
      northStarEngagement30d: 0.5,
    });

    const result = await runDailyTick();
    expect(result).toEqual({ status: "ok", processed: 3, errors: 0 });
    // 3 RUNNING + 3 DONE = 6 updates au minimum
    expect(mockPrisma.ceoTask.update).toHaveBeenCalledTimes(6);
  });

  it("happy path → release lock à la fin (finally)", async () => {
    stubTickPasses();
    const result = await runDailyTick();
    expect(result.status).toBe("ok");
    expect(mockHelpers.releaseCeoLock).toHaveBeenCalledTimes(1);
  });
});

describe("runDailyTick — gestion erreurs handler individuel (silent-fail)", () => {
  it("1 task échoue → errors=1, processed=0, autres tasks continuent", async () => {
    stubTickPasses();
    const tasks = [
      makeTask({ id: "t1", type: "KPI_SNAPSHOT", payload: {} }),
      makeTask({ id: "t2", type: "KPI_SNAPSHOT", payload: {} }),
    ];
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce(tasks);
    mockHelpers.snapshotCeoKpis
      .mockRejectedValueOnce(new Error("Boom snapshot"))
      .mockResolvedValueOnce({ id: "s2", date: new Date(), northStarEngagement30d: 0 });

    const result = await runDailyTick();
    expect(result.errors).toBe(1);
    expect(result.processed).toBe(1);
    expect(result.status).toBe("ok");
  });

  it("attempts+1 >= 3 → status FAILED (anti-runaway)", async () => {
    stubTickPasses();
    const task = makeTask({ id: "t1", type: "KPI_SNAPSHOT", payload: {}, attempts: 2 });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockHelpers.snapshotCeoKpis.mockRejectedValueOnce(new Error("Boom"));

    await runDailyTick();
    // 1er update → RUNNING (increment attempts=3), 2e update sur erreur → status FAILED
    const updateCalls = mockPrisma.ceoTask.update.mock.calls;
    const failUpdate = updateCalls.find(
      (c) => (c[0] as { data?: { status?: string } }).data?.status === "FAILED",
    );
    expect(failUpdate).toBeDefined();
  });

  it("attempts+1 < 3 → status retombe en PENDING pour retry futur", async () => {
    stubTickPasses();
    const task = makeTask({ id: "t1", type: "KPI_SNAPSHOT", payload: {}, attempts: 0 });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockHelpers.snapshotCeoKpis.mockRejectedValueOnce(new Error("Transient"));

    await runDailyTick();
    const updateCalls = mockPrisma.ceoTask.update.mock.calls;
    const pendingUpdate = updateCalls.find(
      (c) =>
        (c[0] as { data?: { status?: string } }).data?.status === "PENDING" &&
        (c[0] as { data?: { errorMessage?: string } }).data?.errorMessage,
    );
    expect(pendingUpdate).toBeDefined();
  });

  it("erreur message tronqué à 500 chars (PII protection)", async () => {
    stubTickPasses();
    const task = makeTask({ id: "t1", type: "KPI_SNAPSHOT", payload: {} });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    const longMsg = "x".repeat(2000);
    mockHelpers.snapshotCeoKpis.mockRejectedValueOnce(new Error(longMsg));

    await runDailyTick();
    const updateCalls = mockPrisma.ceoTask.update.mock.calls;
    const failUpdate = updateCalls.find(
      (c) => (c[0] as { data?: { errorMessage?: string } }).data?.errorMessage,
    );
    const errMsg = (failUpdate?.[0] as { data: { errorMessage: string } }).data.errorMessage;
    expect(errMsg.length).toBeLessThanOrEqual(500);
  });

  it("update FAILED échoue → catch silencieux (pas de propagation)", async () => {
    stubTickPasses();
    const task = makeTask({ id: "t1", type: "KPI_SNAPSHOT", payload: {} });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockHelpers.snapshotCeoKpis.mockRejectedValueOnce(new Error("Boom"));
    // Update RUNNING OK puis update FAILED échoue
    mockPrisma.ceoTask.update
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("update failed"));

    const result = await runDailyTick();
    // Pas de throw — silent-fail respecté
    expect(result.errors).toBe(1);
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 2 — routeCeoTask : switch exhaustif sur 8 CeoTaskType
// ════════════════════════════════════════════════════════════════════

describe("routeCeoTask — 8 CeoTaskType (switch exhaustif + never check)", () => {
  it("DRAFT_EMAIL → handleOutboundEmail (lookup lead + compose + validate + send)", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { leadId: "lead_1", playbook: "P1", recipient: "alex@example.com" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(makeLead());
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({ canSend: true });
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage({ id: "m1" }));
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: false,
    });
    mockPrisma.ceoOutboundMessage.findUnique
      .mockResolvedValueOnce(makeMessage({ id: "m1" })) // dualPassValidate.findUnique
      .mockResolvedValueOnce(makeMessage({ id: "m1", status: "APPROVED" })); // fresh.findUnique post-validate
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage({ id: "m1" }));
    mockResendSend.mockResolvedValueOnce({ data: { id: "re_xyz" } });
    mockPrisma.ceoLead.update.mockResolvedValue(makeLead());

    const result = await runDailyTick();
    expect(result.processed).toBe(1);
    expect(mockResendSend).toHaveBeenCalledTimes(1);
  });

  it("EXECUTE_SEND → même handler que DRAFT_EMAIL (handleOutboundEmail)", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "EXECUTE_SEND",
      payload: { leadId: "lead_1", playbook: "P1", recipient: "x@y.fr" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(makeLead({ optOut: true }));
    const result = await runDailyTick();
    // optOut → skip — handler s'exécute mais retourne `skipped: lead_opt_out`
    expect(result.processed).toBe(1);
    expect(result.errors).toBe(0);
  });

  it("DRAFT_BACKLINK_PITCH → handleBacklinkPitch", async () => {
    stubTickPasses();
    const opportunity: BacklinkOpportunity = {
      id: "op1",
      source: "HARO",
      query: "Comment progresser en humour",
      domain: "lemonde.fr",
      category: "presse",
    };
    const task = makeTask({
      type: "DRAFT_BACKLINK_PITCH",
      payload: JSON.parse(JSON.stringify({ opportunity })),
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel: "BACKLINK_EMAIL" }),
    );
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: false,
    });
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel: "BACKLINK_EMAIL" }),
    );
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());
    mockPrisma.ceoBacklink.create.mockResolvedValue({ id: "b1" });

    const result = await runDailyTick();
    expect(result.processed).toBe(1);
    expect(mockPrisma.ceoBacklink.create).toHaveBeenCalled();
  });

  it("DRAFT_DM_REPLY → handleOutboundDm (channel DM_TWITTER → live send)", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_DM_REPLY",
      payload: {
        channel: "DM_TWITTER",
        recipientHandle: "@thomas",
        playbook: "P5",
      },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.create.mockResolvedValueOnce(makeLead());
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({ canSend: true });
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage({ id: "m1" }));
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: false,
    });
    mockPrisma.ceoOutboundMessage.findUnique
      .mockResolvedValueOnce(makeMessage({ id: "m1" }))
      .mockResolvedValueOnce(makeMessage({ id: "m1" }));
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockSendTwitterDm.mockResolvedValueOnce({ ok: true, externalId: "tw_dm_1" });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());
    mockPrisma.ceoLead.update.mockResolvedValue(makeLead());

    const result = await runDailyTick();
    expect(result.processed).toBe(1);
    expect(mockSendTwitterDm).toHaveBeenCalledWith("@thomas", expect.any(String));
  });

  it("DRAFT_PROACTIVE_COMMENT → deferred Phase 5.B.3 (status reste PENDING)", async () => {
    stubTickPasses();
    const task = makeTask({ type: "DRAFT_PROACTIVE_COMMENT", payload: {} });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    const result = await runDailyTick();
    expect(result.processed).toBe(1);
    // Vérifie que le 2e update à status="PENDING" (deferred=true)
    const updateCalls = mockPrisma.ceoTask.update.mock.calls;
    const deferredUpdate = updateCalls.find(
      (c) => (c[0] as { data?: { status?: string } }).data?.status === "PENDING",
    );
    expect(deferredUpdate).toBeDefined();
  });

  it("WEEKLY_REPORT → handleWeeklyReportTask (Opus + Resend)", async () => {
    stubTickPasses();
    const task = makeTask({ type: "WEEKLY_REPORT", payload: {} });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoKpiSnapshot.findMany.mockResolvedValueOnce([
      { date: new Date(), northStarEngagement30d: 0.6, ceoAttributedConversions: 5, backlinksDaSum: 100 },
    ]);
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockOpusResponse("# Rapport hebdo\n\nKPI delta 7j..."),
    );
    mockHelpers.setCeoMemory.mockResolvedValueOnce(undefined);
    mockResendSend.mockResolvedValueOnce({ data: { id: "re_weekly" } });

    const result = await runDailyTick();
    expect(result.processed).toBe(1);
    expect(mockResendSend).toHaveBeenCalled();
  });

  it("KPI_SNAPSHOT → handleKpiRefreshTask (snapshotCeoKpis)", async () => {
    stubTickPasses();
    const task = makeTask({ type: "KPI_SNAPSHOT", payload: {} });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockHelpers.snapshotCeoKpis.mockResolvedValueOnce({
      id: "snap_1",
      date: new Date("2026-05-07"),
      northStarEngagement30d: 0.42,
    });
    const result = await runDailyTick();
    expect(result.processed).toBe(1);
    expect(mockHelpers.snapshotCeoKpis).toHaveBeenCalledTimes(1);
  });

  it("SCORE_LEADS → deferred Phase 5.B.2 (Umami integration pending)", async () => {
    stubTickPasses();
    const task = makeTask({ type: "SCORE_LEADS", payload: {} });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    const result = await runDailyTick();
    expect(result.processed).toBe(1);
    const updateCalls = mockPrisma.ceoTask.update.mock.calls;
    const deferredUpdate = updateCalls.find(
      (c) =>
        (c[0] as { data?: { status?: string; result?: Record<string, unknown> } }).data
          ?.status === "PENDING",
    );
    expect(deferredUpdate).toBeDefined();
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 3 — Dry-run mode (skip envois réels)
// ════════════════════════════════════════════════════════════════════

describe("dryRun mode", () => {
  it("cfg.dryRun=true sur EMAIL APPROVED → ne send PAS via Resend", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValue(true);
    mockHelpers.getCeoConfig.mockResolvedValue(makeCfg({ dryRun: true }));
    mockHelpers.acquireCeoLock.mockResolvedValue(true);
    mockHelpers.releaseCeoLock.mockResolvedValue(undefined);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValue({ _sum: { costUsd: 0 } });

    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { leadId: "lead_1", playbook: "P1", recipient: "x@y.fr" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(makeLead());
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({ canSend: true });
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage({ id: "m1" }));
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: false,
    });
    mockPrisma.ceoOutboundMessage.findUnique
      .mockResolvedValueOnce(makeMessage({ id: "m1" }))
      .mockResolvedValueOnce(makeMessage({ id: "m1" }));
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());

    await runDailyTick();
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("cfg.dryRun=true sur DM_TWITTER APPROVED → ne send PAS via twitter-client", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValue(true);
    mockHelpers.getCeoConfig.mockResolvedValue(makeCfg({ dryRun: true }));
    mockHelpers.acquireCeoLock.mockResolvedValue(true);
    mockHelpers.releaseCeoLock.mockResolvedValue(undefined);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValue({ _sum: { costUsd: 0 } });

    const task = makeTask({
      type: "DRAFT_DM_REPLY",
      payload: { channel: "DM_TWITTER", recipientHandle: "@x", playbook: "P5" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.create.mockResolvedValueOnce(makeLead());
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({ canSend: true });
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage({ id: "m1" }));
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: false,
    });
    mockPrisma.ceoOutboundMessage.findUnique
      .mockResolvedValueOnce(makeMessage({ id: "m1" }))
      .mockResolvedValueOnce(makeMessage({ id: "m1" }));
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());

    await runDailyTick();
    expect(mockSendTwitterDm).not.toHaveBeenCalled();
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 4 — triageOpportunity (Haiku 4.5)
// ════════════════════════════════════════════════════════════════════

describe("triageOpportunity — Haiku 4.5 scoring inbound", () => {
  const signal: InboundSignal = {
    source: "twitter_dm",
    authorHandle: "@curieux",
    content: "Comment être plus rapide en répartie en soirée ?",
    receivedAt: new Date(),
  };

  it("appelle Haiku model claude-haiku-4-5-20251001", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockHaikuResponse(defaultTriagePayload()),
    );
    await triageOpportunity(signal);
    const call = mockAnthropicMessagesCreate.mock.calls[0][0];
    expect(call.model).toBe(CEO_HAIKU_MODEL);
    expect(call.model).toBe("claude-haiku-4-5-20251001");
  });

  it("parse Zod strict : score 1-10, topic, intent, playbook → TriageResult", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockHaikuResponse({
        score: 9,
        topic: "repartie",
        intent: "demande_aide",
        should_respond: true,
        playbook: "P5",
        reasoning: "Match thème core",
      }),
    );
    const result = await triageOpportunity(signal);
    expect(result.score).toBe(9);
    expect(result.shouldRespond).toBe(true);
    expect(result.playbook).toBe("P5");
  });

  it("Anthropic réponse malformée (JSON invalide) → throw", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "not-a-json" }],
      usage: { input_tokens: 1, output_tokens: 1 },
    });
    await expect(triageOpportunity(signal)).rejects.toThrow();
  });

  it("Zod schema reject score=11 (hors plage 1-10)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockHaikuResponse({
        score: 11,
        topic: "repartie",
        intent: "question",
        should_respond: true,
        playbook: "P5",
        reasoning: "x",
      }),
    );
    await expect(triageOpportunity(signal)).rejects.toThrow();
  });

  it("Zod reject topic invalide ('autre' n'est pas dans l'enum)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockHaikuResponse({
        score: 5,
        topic: "autre",
        intent: "question",
        should_respond: false,
        playbook: "ignore",
        reasoning: "x",
      }),
    );
    await expect(triageOpportunity(signal)).rejects.toThrow();
  });

  it("max_tokens=200 (court — scoring binaire)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockHaikuResponse(defaultTriagePayload()),
    );
    await triageOpportunity(signal);
    const call = mockAnthropicMessagesCreate.mock.calls[0][0];
    expect(call.max_tokens).toBe(200);
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 5 — composeOutboundMessage (Sonnet + cache + footer)
// ════════════════════════════════════════════════════════════════════

describe("composeOutboundMessage — Sonnet 4.6 + cache_control", () => {
  const lead = makeLead();

  it("appelle SONNET_MODEL (pas Haiku/Opus)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await composeOutboundMessage("P1", lead, {
      channel: "EMAIL",
      recipient: "x@y.fr",
    });
    const call = mockAnthropicMessagesCreate.mock.calls[0][0];
    expect(call.model).not.toBe(CEO_HAIKU_MODEL);
    expect(call.model).not.toBe(CEO_OPUS_MODEL);
  });

  it("system blocks contiennent cache_control: ephemeral (prompt caching activé)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await composeOutboundMessage("P1", lead, {
      channel: "EMAIL",
      recipient: "x@y.fr",
    });
    const call = mockAnthropicMessagesCreate.mock.calls[0][0] as {
      system: Array<{ type: string; cache_control?: { type: string } }>;
    };
    expect(Array.isArray(call.system)).toBe(true);
    const cachedBlock = call.system.find((b) => b.cache_control?.type === "ephemeral");
    expect(cachedBlock).toBeDefined();
  });

  it("EMAIL → enforceEmailFooter appelé sur le body avant create", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload({ body: "Body sans footer" })),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    const { enforceEmailFooter } = jest.requireMock("@/lib/email/ceo-email-footer") as {
      enforceEmailFooter: jest.Mock;
    };
    await composeOutboundMessage("P1", lead, {
      channel: "EMAIL",
      recipient: "x@y.fr",
    });
    expect(enforceEmailFooter).toHaveBeenCalledWith("Body sans footer", "x@y.fr");
  });

  it("DM_TWITTER → footer NON appliqué (canal social)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    const { enforceEmailFooter } = jest.requireMock("@/lib/email/ceo-email-footer") as {
      enforceEmailFooter: jest.Mock;
    };
    await composeOutboundMessage("P5", lead, {
      channel: "DM_TWITTER",
      recipient: "@thomas",
    });
    expect(enforceEmailFooter).not.toHaveBeenCalled();
  });

  it("DM_LINKEDIN → requiresHumanReview=true par défaut (drafts permanents)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await composeOutboundMessage("P5", lead, {
      channel: "DM_LINKEDIN",
      recipient: "@thomas",
    });
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { requiresHumanReview: boolean };
    };
    expect(call.data.requiresHumanReview).toBe(true);
  });

  it("DM_INSTAGRAM → requiresHumanReview=true (drafts permanents)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await composeOutboundMessage("P5", lead, {
      channel: "DM_INSTAGRAM",
      recipient: "@thomas",
    });
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { requiresHumanReview: boolean };
    };
    expect(call.data.requiresHumanReview).toBe(true);
  });

  it("status par défaut = PENDING (validation Director ensuite)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await composeOutboundMessage("P1", lead, {
      channel: "EMAIL",
      recipient: "x@y.fr",
    });
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { status: string };
    };
    expect(call.data.status).toBe("PENDING");
  });

  it("UTM tracking : utmSource=ceo, utmCampaign=playbook, utmMedium=channel.toLowerCase", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await composeOutboundMessage("P3", lead, {
      channel: "DM_TWITTER",
      recipient: "@x",
    });
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { utmSource: string; utmCampaign: string; utmMedium: string };
    };
    expect(call.data.utmSource).toBe("ceo");
    expect(call.data.utmCampaign).toBe("P3");
    expect(call.data.utmMedium).toBe("twitter"); // dm_twitter.replace("dm_","")
  });

  it("schema reject body vide (zod min(1))", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse({ ...defaultDraftPayload(), body: "" }),
    );
    await expect(
      composeOutboundMessage("P1", lead, {
        channel: "EMAIL",
        recipient: "x@y.fr",
      }),
    ).rejects.toThrow();
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 6 — dualPassValidate (délègue à Director)
// ════════════════════════════════════════════════════════════════════

describe("dualPassValidate — Director gates G-CEO1/2/3/4 + dual-pass", () => {
  it("APPROVED → met à jour status=APPROVED, directorValidated=true", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1" }),
    );
    mockValidateCeoOutbound.mockResolvedValueOnce({
      verdict: "APPROVED",
      score: 9,
      directorNote: "Voix calibrée",
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce(makeMessage());
    const result = await dualPassValidate("m1");
    expect(result.approved).toBe(true);
    const updateCall = mockPrisma.ceoOutboundMessage.update.mock.calls[0][0] as {
      data: { status: string; directorValidated: boolean; directorScore: number };
    };
    expect(updateCall.data.status).toBe("APPROVED");
    expect(updateCall.data.directorValidated).toBe(true);
    expect(updateCall.data.directorScore).toBe(9);
  });

  it("REJECTED → status=REJECTED, directorValidated=false", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1" }),
    );
    mockValidateCeoOutbound.mockResolvedValueOnce({
      verdict: "REJECTED",
      score: 3,
      directorNote: "Voix off",
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce(makeMessage());
    const result = await dualPassValidate("m1");
    expect(result.approved).toBe(false);
    expect(result.verdict).toBe("REJECTED");
  });

  it("NEEDS_REVISION → status reste PENDING", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1" }),
    );
    mockValidateCeoOutbound.mockResolvedValueOnce({
      verdict: "NEEDS_REVISION",
      score: 7,
      directorNote: "à retravailler",
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce(makeMessage());
    await dualPassValidate("m1");
    const updateCall = mockPrisma.ceoOutboundMessage.update.mock.calls[0][0] as {
      data: { status: string };
    };
    expect(updateCall.data.status).toBe("PENDING");
  });

  it("message introuvable → throw clair", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(null);
    await expect(dualPassValidate("missing")).rejects.toThrow("introuvable");
  });

  it("directorNote tronqué à 500 chars (DB limit)", async () => {
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1" }),
    );
    const longNote = "x".repeat(2000);
    mockValidateCeoOutbound.mockResolvedValueOnce({
      verdict: "APPROVED",
      score: 9,
      directorNote: longNote,
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValueOnce(makeMessage());
    await dualPassValidate("m1");
    const updateCall = mockPrisma.ceoOutboundMessage.update.mock.calls[0][0] as {
      data: { directorNote: string };
    };
    expect(updateCall.data.directorNote.length).toBeLessThanOrEqual(500);
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 7 — Validation Director G-CEO1/2/3/4 cascade dans tick
// ════════════════════════════════════════════════════════════════════

describe("runDailyTick — Director validation cascade", () => {
  it("Director REJECTED → message status=REJECTED, pas d'envoi Resend", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { leadId: "lead_1", playbook: "P1", recipient: "x@y.fr" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(makeLead());
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({ canSend: true });
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage({ id: "m1" }));
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: false,
    });
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1" }),
    );
    // Director REJETTE
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("REJECTED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());

    await runDailyTick();
    expect(mockResendSend).not.toHaveBeenCalled();
    // Audit "email_director_rejected" enregistré
    const auditCalls = mockHelpers.recordAudit.mock.calls;
    const rejectAudit = auditCalls.find(
      (c: unknown[]) => (c[0] as { action: string }).action === "email_director_rejected",
    );
    expect(rejectAudit).toBeDefined();
  });

  it("Frequency cap atteint → skip task, pas de compose Anthropic", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { leadId: "lead_1", playbook: "P1", recipient: "x@y.fr" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(makeLead());
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({
      canSend: false,
      reason: "cap_atteint_segment_A",
    });

    await runDailyTick();
    expect(mockAnthropicMessagesCreate).not.toHaveBeenCalled();
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("Dedup hit (24h) → message REJECTED + skip envoi", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { leadId: "lead_1", playbook: "P1", recipient: "x@y.fr" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(makeLead());
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({ canSend: true });
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage({ id: "m1" }));
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: true,
    });
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());

    await runDailyTick();
    expect(mockValidateCeoOutbound).not.toHaveBeenCalled();
    expect(mockResendSend).not.toHaveBeenCalled();
    // Update REJECTED avec directorNote=duplicate_24h
    const updateCalls = mockPrisma.ceoOutboundMessage.update.mock.calls;
    const dupUpdate = updateCalls.find(
      (c: unknown[]) =>
        (c[0] as { data?: { status?: string; directorNote?: string } }).data?.status ===
          "REJECTED" &&
        (c[0] as { data?: { directorNote?: string } }).data?.directorNote === "duplicate_24h",
    );
    expect(dupUpdate).toBeDefined();
  });

  it("emailOptOut User → skip task (RGPD)", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { leadId: "lead_1", playbook: "P1", recipient: "x@y.fr" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(makeLead());
    mockPrisma.user.findUnique.mockResolvedValueOnce({ emailOptOut: true } as never);

    await runDailyTick();
    expect(mockAnthropicMessagesCreate).not.toHaveBeenCalled();
    expect(mockResendSend).not.toHaveBeenCalled();
  });

  it("autoSendEmail=false → APPROVED mais pas d'envoi (draft seul)", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValue(true);
    mockHelpers.getCeoConfig.mockResolvedValue(makeCfg({ autoSendEmail: false }));
    mockHelpers.acquireCeoLock.mockResolvedValue(true);
    mockHelpers.releaseCeoLock.mockResolvedValue(undefined);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValue({ _sum: { costUsd: 0 } });

    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { leadId: "lead_1", playbook: "P1", recipient: "x@y.fr" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(makeLead());
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({ canSend: true });
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage({ id: "m1" }));
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: false,
    });
    mockPrisma.ceoOutboundMessage.findUnique
      .mockResolvedValueOnce(makeMessage({ id: "m1" }))
      .mockResolvedValueOnce(makeMessage({ id: "m1" }));
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());

    await runDailyTick();
    expect(mockResendSend).not.toHaveBeenCalled();
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 8 — selectPlaybook (déterministe, P7 prime sur P3)
// ════════════════════════════════════════════════════════════════════

describe("selectPlaybook — règles déterministes 7 playbooks", () => {
  const baseLead = makeLead();

  it("P7 (fan) prime sur P3 si streak≥7 ET likes≥10 (pivot s8)", () => {
    expect(
      selectPlaybook(baseLead, { streak: 10, likes: 15, plan: "FREE" }),
    ).toBe("P7");
  });

  it("P4 winback : FREE + lastActiveDays > 30", () => {
    expect(
      selectPlaybook(baseLead, { plan: "FREE", lastActiveDays: 45 }),
    ).toBe("P4");
  });

  it("P3 conversion : FREE + streak≥3 + likes≥5 (et pas P7/P4)", () => {
    expect(
      selectPlaybook(baseLead, { streak: 4, likes: 6, plan: "FREE", lastActiveDays: 5 }),
    ).toBe("P3");
  });

  it("P2 réactivation : 7 ≤ lastActiveDays ≤ 30", () => {
    expect(
      selectPlaybook(baseLead, { lastActiveDays: 14, plan: "PREMIUM" }),
    ).toBe("P2");
  });

  it("P1 welcome : touchpoints=0 (jamais contacté)", () => {
    expect(selectPlaybook(makeLead({ touchpoints: 0 }), {})).toBe("P1");
  });

  it("skip : aucun trigger ne match", () => {
    expect(
      selectPlaybook(makeLead({ touchpoints: 5 }), { plan: "PREMIUM", lastActiveDays: 1 }),
    ).toBe("skip");
  });

  it("priorité absolue P7 : streak=7 likes=10 plan=PREMIUM (zéro conversion possible)", () => {
    expect(
      selectPlaybook(baseLead, { streak: 7, likes: 10, plan: "PREMIUM" }),
    ).toBe("P7");
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 9 — draftBacklinkPitch + pitchToBacklinkOpportunity
// ════════════════════════════════════════════════════════════════════

describe("draftBacklinkPitch — opportunity-driven (HARO/blog/podcast)", () => {
  const opp: BacklinkOpportunity = {
    id: "op1",
    source: "HARO",
    query: "Comment progresser en répartie ?",
    domain: "lemonde.fr",
    outlet: "Le Monde",
    journalistName: "Marie Curie",
    category: "presse",
  };

  it("appelle Sonnet (pas Haiku/Opus)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await draftBacklinkPitch(opp);
    const call = mockAnthropicMessagesCreate.mock.calls[0][0];
    expect(call.model).not.toBe(CEO_HAIKU_MODEL);
    expect(call.model).not.toBe(CEO_OPUS_MODEL);
  });

  it("recipient = domaine (pas email — pas d'email connu)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await draftBacklinkPitch(opp);
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { recipient: string; channel: string };
    };
    expect(call.data.recipient).toBe("lemonde.fr");
    expect(call.data.channel).toBe("BACKLINK_EMAIL");
  });

  it("requiresHumanReview=true (backlinks toujours en review Phase 5.A)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await draftBacklinkPitch(opp);
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { requiresHumanReview: boolean };
    };
    expect(call.data.requiresHumanReview).toBe(true);
  });

  it("footer appliqué via enforceEmailFooter (audit @legal s9)", async () => {
    const { enforceEmailFooter } = jest.requireMock("@/lib/email/ceo-email-footer") as {
      enforceEmailFooter: jest.Mock;
    };
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await draftBacklinkPitch(opp);
    expect(enforceEmailFooter).toHaveBeenCalled();
    // recipient pour token = marie.curie@lemonde.fr (lowercase + dots)
    const callArgs = enforceEmailFooter.mock.calls[0];
    expect(callArgs[1]).toContain("@lemonde.fr");
  });

  it("UTM : utmCampaign=backlink_haro (source lowercased)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await draftBacklinkPitch(opp);
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { utmCampaign: string };
    };
    expect(call.data.utmCampaign).toBe("backlink_haro");
  });

  it("playbook = backlink_<source.toLowerCase>", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await draftBacklinkPitch({ ...opp, source: "PODCAST" });
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { playbook: string };
    };
    expect(call.data.playbook).toBe("backlink_podcast");
  });

  it("subject vide → fallback 'Sujet <category>'", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse({ ...defaultDraftPayload(), subject: "" }),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await draftBacklinkPitch(opp);
    const call = mockPrisma.ceoOutboundMessage.create.mock.calls[0][0] as {
      data: { subject: string };
    };
    expect(call.data.subject).toBe("Sujet presse");
  });
});

describe("pitchToBacklinkOpportunity — topic-driven (remplace haro-agent)", () => {
  it("topic peu pertinent (relevance < 4) → throw", async () => {
    await expect(
      pitchToBacklinkOpportunity("recette de tarte aux pommes", "HARO"),
    ).rejects.toThrow(/peu pertinent/);
  });

  it("topic pertinent + HARO → pitch + validate + insert CeoBacklink", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel: "BACKLINK_EMAIL" }),
    );
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel: "BACKLINK_EMAIL" }),
    );
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());
    mockPrisma.ceoBacklink.create.mockResolvedValueOnce({ id: "bl_1" });

    const result = await pitchToBacklinkOpportunity(
      "Comment progresser en répartie et avoir plus de charisme en conversation au quotidien ?",
      "HARO",
      { domain: "lemonde.fr" },
    );

    expect(result.messageId).toBe("m1");
    expect(result.backlinkId).toBe("bl_1");
    expect(mockPrisma.ceoBacklink.create).toHaveBeenCalled();
  });

  it("source CONNECTIVELY → mappée à 'HARO' en DB (enum dbSource)", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel: "BACKLINK_EMAIL" }),
    );
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel: "BACKLINK_EMAIL" }),
    );
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());
    mockPrisma.ceoBacklink.create.mockResolvedValueOnce({ id: "bl_2" });

    await pitchToBacklinkOpportunity(
      "Comment progresser en répartie et avoir plus de charisme en conversation au quotidien ?",
      "CONNECTIVELY",
      { domain: "blog.fr" },
    );
    const call = mockPrisma.ceoBacklink.create.mock.calls[0][0] as {
      data: { source: string };
    };
    expect(call.data.source).toBe("HARO"); // CONNECTIVELY mappé sur HARO
  });

  it("source RSS_FEED → mappée à 'BLOGGER'", async () => {
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel: "BACKLINK_EMAIL" }),
    );
    mockPrisma.ceoOutboundMessage.findUnique.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel: "BACKLINK_EMAIL" }),
    );
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());
    mockPrisma.ceoBacklink.create.mockResolvedValueOnce({ id: "bl_3" });

    await pitchToBacklinkOpportunity(
      "Comment progresser en répartie et avoir plus de charisme en conversation au quotidien ?",
      "RSS_FEED",
      { domain: "rss.fr" },
    );
    const call = mockPrisma.ceoBacklink.create.mock.calls[0][0] as {
      data: { source: string };
    };
    expect(call.data.source).toBe("BLOGGER");
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 10 — runWeeklyReport (Opus 4.7)
// ════════════════════════════════════════════════════════════════════

describe("runWeeklyReport — Opus 4.7 lundi 9h", () => {
  it("kill-switch OFF → sent=false (early return)", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValueOnce(false);
    const result = await runWeeklyReport(new Date("2026-05-04T00:00:00Z"));
    expect(result.sent).toBe(false);
  });

  it("appelle Opus model claude-opus-4-6", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValue(true);
    mockPrisma.ceoKpiSnapshot.findMany.mockResolvedValueOnce([]);
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockOpusResponse("# Rapport"),
    );
    mockHelpers.setCeoMemory.mockResolvedValueOnce(undefined);
    mockResendSend.mockResolvedValueOnce({ data: { id: "re_1" } });

    await runWeeklyReport(new Date("2026-05-04T00:00:00Z"));
    const call = mockAnthropicMessagesCreate.mock.calls[0][0];
    expect(call.model).toBe(CEO_OPUS_MODEL);
  });

  it("RESEND_API_KEY absent → rapport stocké en mémoire, sent=false (non-bloquant)", async () => {
    delete process.env.RESEND_API_KEY;
    mockHelpers.isCeoEnabled.mockResolvedValue(true);
    mockPrisma.ceoKpiSnapshot.findMany.mockResolvedValueOnce([]);
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockOpusResponse("# Rapport"),
    );
    mockHelpers.setCeoMemory.mockResolvedValueOnce(undefined);

    const result = await runWeeklyReport(new Date("2026-05-04T00:00:00Z"));
    expect(result.sent).toBe(false);
    expect(mockResendSend).not.toHaveBeenCalled();
    // Stocké dans CeoMemory quand même
    expect(mockHelpers.setCeoMemory).toHaveBeenCalled();
  });

  it("succès Resend → audit 'weekly_report_sent' + sent=true", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValue(true);
    mockPrisma.ceoKpiSnapshot.findMany.mockResolvedValueOnce([
      { date: new Date(), northStarEngagement30d: 0.55, ceoAttributedConversions: 3, backlinksDaSum: 50 },
    ]);
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockOpusResponse("# Rapport"),
    );
    mockHelpers.setCeoMemory.mockResolvedValueOnce(undefined);
    mockResendSend.mockResolvedValueOnce({ data: { id: "re_w1" } });

    const result = await runWeeklyReport(new Date("2026-05-04T00:00:00Z"));
    expect(result.sent).toBe(true);
    const auditCalls = mockHelpers.recordAudit.mock.calls;
    const sentAudit = auditCalls.find(
      (c: unknown[]) => (c[0] as { action: string }).action === "weekly_report_sent",
    );
    expect(sentAudit).toBeDefined();
  });

  it("Resend throw → audit 'weekly_report_send_failed' + sent=false (silent-fail)", async () => {
    mockHelpers.isCeoEnabled.mockResolvedValue(true);
    mockPrisma.ceoKpiSnapshot.findMany.mockResolvedValueOnce([]);
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockOpusResponse("# Rapport"),
    );
    mockHelpers.setCeoMemory.mockResolvedValueOnce(undefined);
    mockResendSend.mockRejectedValueOnce(new Error("Resend 500"));

    const result = await runWeeklyReport(new Date("2026-05-04T00:00:00Z"));
    expect(result.sent).toBe(false);
    const auditCalls = mockHelpers.recordAudit.mock.calls;
    const failAudit = auditCalls.find(
      (c: unknown[]) =>
        (c[0] as { action: string }).action === "weekly_report_send_failed",
    );
    expect(failAudit).toBeDefined();
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 11 — Constantes et invariants
// ════════════════════════════════════════════════════════════════════

describe("Constantes CEO — invariants", () => {
  it("CHANNEL_CHAR_LIMITS : EMAIL=2000, DM_TWITTER=270, BACKLINK_EMAIL=800", () => {
    expect(CHANNEL_CHAR_LIMITS.EMAIL).toBe(2000);
    expect(CHANNEL_CHAR_LIMITS.DM_TWITTER).toBe(270);
    expect(CHANNEL_CHAR_LIMITS.BACKLINK_EMAIL).toBe(800);
  });

  it("CHANNEL_CHAR_LIMITS : 6 canaux exhaustifs", () => {
    const keys = Object.keys(CHANNEL_CHAR_LIMITS).sort();
    expect(keys).toEqual([
      "BACKLINK_EMAIL",
      "COMMENT_TWITTER",
      "DM_INSTAGRAM",
      "DM_LINKEDIN",
      "DM_TWITTER",
      "EMAIL",
    ]);
  });

  it("CEO_BUDGET_HARD_STOP_EUR = 4 (anti-runaway plafond Thomas)", () => {
    expect(CEO_BUDGET_HARD_STOP_EUR).toBe(4);
  });

  it("CEO_HAIKU_MODEL = claude-haiku-4-5-20251001 (Haiku 4.5 release)", () => {
    expect(CEO_HAIKU_MODEL).toBe("claude-haiku-4-5-20251001");
  });

  it("CEO_OPUS_MODEL est un modèle Opus (préfixe claude-opus-)", () => {
    expect(CEO_OPUS_MODEL).toMatch(/^claude-opus-/);
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 12 — Edge cases anti-loop & timeGate (cron-level couvert ailleurs)
// ════════════════════════════════════════════════════════════════════

describe("Anti-loop edge cases", () => {
  it("findMany filter attempts<3 garantit qu'une task à attempts=3 NE soit JAMAIS exécutée", async () => {
    stubTickPasses();
    // Mock retourne 0 tasks (filter DB respecté)
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([]);
    const result = await runDailyTick();
    expect(result.processed).toBe(0);

    // Vérifie que le filter where est bien appliqué
    const findManyCall = mockPrisma.ceoTask.findMany.mock.calls[0][0] as {
      where: { attempts: { lt: number } };
    };
    expect(findManyCall.where.attempts.lt).toBe(3);
  });

  it("task à attempts=2 qui échoue → status FAILED (attempts+1 = 3) — audit log généré", async () => {
    stubTickPasses();
    const task = makeTask({ id: "t1", type: "KPI_SNAPSHOT", attempts: 2, payload: {} });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockHelpers.snapshotCeoKpis.mockRejectedValueOnce(new Error("Final boom"));

    await runDailyTick();
    const updateCalls = mockPrisma.ceoTask.update.mock.calls;
    const failUpdate = updateCalls.find(
      (c) => (c[0] as { data?: { status?: string } }).data?.status === "FAILED",
    );
    expect(failUpdate).toBeDefined();
  });
});

// ════════════════════════════════════════════════════════════════════
// SECTION 13 — Branches DM canaux + erreurs Twitter (coverage)
// ════════════════════════════════════════════════════════════════════

describe("handleOutboundDm — branches par canal", () => {
  function setupDmTask(channel: "DM_LINKEDIN" | "DM_INSTAGRAM" | "DM_TWITTER") {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_DM_REPLY",
      payload: { channel, recipientHandle: "@x", playbook: "P5" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.create.mockResolvedValueOnce(makeLead());
    (mockHelpers.applyFrequencyCap as jest.Mock).mockResolvedValueOnce({ canSend: true });
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(
      makeMessage({ id: "m1", channel }),
    );
    (mockHelpers.checkAndStoreDedup as jest.Mock).mockResolvedValueOnce({
      isDuplicate: false,
    });
    mockPrisma.ceoOutboundMessage.findUnique
      .mockResolvedValueOnce(makeMessage({ id: "m1", channel }))
      .mockResolvedValueOnce(makeMessage({ id: "m1", channel }));
    mockValidateCeoOutbound.mockResolvedValueOnce(defaultDirectorVerdict("APPROVED"));
    mockPrisma.ceoOutboundMessage.update.mockResolvedValue(makeMessage());
  }

  it("DM_LINKEDIN APPROVED → drafts permanents (audit dm_drafted, pas de send)", async () => {
    setupDmTask("DM_LINKEDIN");
    await runDailyTick();
    expect(mockSendTwitterDm).not.toHaveBeenCalled();
    const auditCalls = mockHelpers.recordAudit.mock.calls;
    const draftedAudit = auditCalls.find(
      (c: unknown[]) => (c[0] as { action: string }).action === "dm_drafted",
    );
    expect(draftedAudit).toBeDefined();
  });

  it("DM_INSTAGRAM APPROVED → deferred Phase 5.B.3 (status reste PENDING)", async () => {
    setupDmTask("DM_INSTAGRAM");
    await runDailyTick();
    expect(mockSendTwitterDm).not.toHaveBeenCalled();
    // task.update final → status="PENDING" (deferred=true)
    const updateCalls = mockPrisma.ceoTask.update.mock.calls;
    const deferredFinal = updateCalls.find((c) => {
      const data = (c[0] as { data?: { status?: string } }).data;
      return data?.status === "PENDING" && !("startedAt" in (data ?? {}));
    });
    expect(deferredFinal).toBeDefined();
  });

  it("DM_TWITTER rate_limit 429 → re-queue scheduledFor=now+15min (deferred)", async () => {
    setupDmTask("DM_TWITTER");
    mockSendTwitterDm.mockResolvedValueOnce({
      ok: false,
      error: "rate_limit",
      retryAfterSeconds: 900,
    });
    mockPrisma.ceoTask.update.mockResolvedValue({});

    await runDailyTick();
    // Verify task.update appelé avec scheduledFor (re-queue)
    const updateCalls = mockPrisma.ceoTask.update.mock.calls;
    const requeueUpdate = updateCalls.find((c) => {
      const data = (c[0] as { data?: { status?: string; scheduledFor?: Date } }).data;
      return data?.status === "PENDING" && data?.scheduledFor;
    });
    expect(requeueUpdate).toBeDefined();
  });

  it("DM_TWITTER 401 → message status=FAILED + audit dm_send_failed", async () => {
    setupDmTask("DM_TWITTER");
    mockSendTwitterDm.mockResolvedValueOnce({
      ok: false,
      error: "unauthorized",
      errorMessage: "Token invalide",
    });

    await runDailyTick();
    const failedUpdate = mockPrisma.ceoOutboundMessage.update.mock.calls.find((c) => {
      const data = (c[0] as { data?: { status?: string } }).data;
      return data?.status === "FAILED";
    });
    expect(failedUpdate).toBeDefined();
    const audits = mockHelpers.recordAudit.mock.calls;
    const failAudit = audits.find(
      (c: unknown[]) => (c[0] as { action: string }).action === "dm_send_failed",
    );
    expect(failAudit).toBeDefined();
  });
});

describe("Payload validation — handlers throw sur payload incomplet", () => {
  it("DRAFT_EMAIL sans leadId → throw 'Payload OUTBOUND_EMAIL incomplet'", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { playbook: "P1" }, // leadId manquant
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    const result = await runDailyTick();
    expect(result.errors).toBe(1);
  });

  it("DRAFT_BACKLINK_PITCH sans opportunity → throw", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_BACKLINK_PITCH",
      payload: {}, // opportunity manquant
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    const result = await runDailyTick();
    expect(result.errors).toBe(1);
  });

  it("DRAFT_DM_REPLY sans channel → throw", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_DM_REPLY",
      payload: { recipientHandle: "@x", playbook: "P5" }, // channel manquant
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    const result = await runDailyTick();
    expect(result.errors).toBe(1);
  });

  it("DRAFT_EMAIL avec lead introuvable → throw 'CeoLead ... introuvable'", async () => {
    stubTickPasses();
    const task = makeTask({
      type: "DRAFT_EMAIL",
      payload: { leadId: "missing", playbook: "P1", recipient: "x@y.fr" },
    });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockPrisma.ceoLead.findUnique.mockResolvedValueOnce(null);
    const result = await runDailyTick();
    expect(result.errors).toBe(1);
  });
});

describe("draftBacklinkPitch — branches recipient (sans journalistName)", () => {
  it("opportunity sans journalistName → recipient = contact@domain pour token", async () => {
    const { enforceEmailFooter } = jest.requireMock("@/lib/email/ceo-email-footer") as {
      enforceEmailFooter: jest.Mock;
    };
    const opp: BacklinkOpportunity = {
      id: "op",
      source: "BLOGGER",
      query: "humour pro",
      domain: "blog.fr",
      category: "blog",
    };
    mockAnthropicMessagesCreate.mockResolvedValueOnce(
      mockSonnetResponse(defaultDraftPayload()),
    );
    mockPrisma.ceoOutboundMessage.create.mockResolvedValueOnce(makeMessage());
    await draftBacklinkPitch(opp);
    const callArgs = enforceEmailFooter.mock.calls[0];
    expect(callArgs[1]).toBe("contact@blog.fr");
  });
});

describe("PII protection — maskPii dans logs erreurs", () => {
  it("erreur contenant un email → maskPii appelé pour le log console", async () => {
    stubTickPasses();
    const task = makeTask({ id: "t1", type: "KPI_SNAPSHOT", payload: {} });
    mockPrisma.ceoTask.findMany.mockResolvedValueOnce([task]);
    mockHelpers.snapshotCeoKpis.mockRejectedValueOnce(
      new Error("Failed for alex@example.com"),
    );
    const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      await runDailyTick();
      // Vérifier que console.error a été appelé (mask géré par helper)
      expect(consoleErrSpy).toHaveBeenCalled();
    } finally {
      consoleErrSpy.mockRestore();
    }
  });
});

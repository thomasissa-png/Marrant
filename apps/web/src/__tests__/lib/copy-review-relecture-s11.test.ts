/**
 * @jest-environment node
 *
 * Relecture de code s11 — correctifs du job copy-review :
 *  1. Un seul lot par jour : le verrou quotidien n'est pas relâché (avant :
 *     relâché après chaque lot → 8 lots/jour sur la fenêtre 3h-4h59 UTC).
 *  2. Une relecture ultérieure (COPY_REVIEW_VERSION incrémentée) n'écrase pas
 *     l'original sauvegardé par une version déjà réécrite.
 *  3. COPY_REVIEW_VERSION invalide → 1 (jamais NaN).
 */
const mockJokeFindMany = jest.fn();
const mockJokeUpdate = jest.fn();
const mockTipFindMany = jest.fn();
const mockTipUpdate = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: (...a: unknown[]) => mockJokeFindMany(...a), update: (...a: unknown[]) => mockJokeUpdate(...a) },
    tip: { findMany: (...a: unknown[]) => mockTipFindMany(...a), update: (...a: unknown[]) => mockTipUpdate(...a) },
  },
}));
jest.mock("@/lib/db-retry", () => ({
  withDbRetry: (fn: () => unknown) => Promise.resolve(fn()),
}));

const mockTryAcquireLock = jest.fn();
const mockReleaseLock = jest.fn();
jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: (...a: unknown[]) => mockTryAcquireLock(...a),
  releaseLock: (...a: unknown[]) => mockReleaseLock(...a),
  buildJobLockKey: (name: string, d: Date) => `${name}-${d.toISOString().slice(0, 10)}`,
}));

const mockReviewJoke = jest.fn();
const mockReviewTip = jest.fn();
jest.mock("@/lib/ai/agents/copy-review-agent", () => {
  const actual = jest.requireActual("@/lib/ai/agents/copy-review-agent");
  return {
    ...actual,
    reviewJoke: (...a: unknown[]) => mockReviewJoke(...a),
    reviewTip: (...a: unknown[]) => mockReviewTip(...a),
  };
});
const mockValidateJoke = jest.fn();
const mockValidateTip = jest.fn();
jest.mock("@/lib/ai/agents/standup-director-agent", () => ({
  validateJoke: (...a: unknown[]) => mockValidateJoke(...a),
  validateTip: (...a: unknown[]) => mockValidateTip(...a),
}));
jest.mock("@/lib/ai/personas", () => ({ getPersonaForDay: () => "YANIS" }));

import {
  COPY_REVIEW_DAILY_LOCK_TTL_MS,
  runCopyReviewBatch,
  runDailyCopyReviewOnce,
} from "@/lib/ai/copy-review-runner";
import { parseCopyReviewVersion } from "@/lib/ai/agents/copy-review-agent";

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.COPY_REVIEW_ENABLED;
  // s14 : la relecture IA ne tourne que si l'interrupteur de génération est ouvert.
  process.env.CONTENT_GENERATION_ENABLED = "true";
  mockJokeFindMany.mockResolvedValue([]);
  mockTipFindMany.mockResolvedValue([]);
  mockJokeUpdate.mockResolvedValue({});
  mockTipUpdate.mockResolvedValue({});
});

describe("runDailyCopyReviewOnce — un seul lot par jour", () => {
  it("prend un verrou daté couvrant toute la fenêtre et ne le relâche jamais", async () => {
    mockTryAcquireLock.mockResolvedValue(true);
    const now = new Date("2026-10-01T03:00:00Z");
    const stats = await runDailyCopyReviewOnce(now);
    expect(stats).not.toBeNull();
    expect(mockTryAcquireLock).toHaveBeenCalledWith("copy-review-2026-10-01", COPY_REVIEW_DAILY_LOCK_TTL_MS);
    // Fenêtre scheduler 3h00 → 4h45 (dernier tick) : le verrou doit tenir 2 h.
    expect(COPY_REVIEW_DAILY_LOCK_TTL_MS).toBeGreaterThanOrEqual(2 * 60 * 60 * 1000);
    expect(mockReleaseLock).not.toHaveBeenCalled();
  });

  it("verrou déjà pris (tick suivant) → aucun lot, aucune requête", async () => {
    mockTryAcquireLock.mockResolvedValue(false);
    expect(await runDailyCopyReviewOnce(new Date("2026-10-01T03:15:00Z"))).toBeNull();
    expect(mockJokeFindMany).not.toHaveBeenCalled();
  });

  it("interrupteur CONTENT_GENERATION_ENABLED coupé (s14) → ni verrou ni lot", async () => {
    delete process.env.CONTENT_GENERATION_ENABLED;
    expect(await runDailyCopyReviewOnce()).toBeNull();
    expect(mockTryAcquireLock).not.toHaveBeenCalled();
    expect(mockJokeFindMany).not.toHaveBeenCalled();
  });

  it("kill-switch → ni verrou ni lot", async () => {
    process.env.COPY_REVIEW_ENABLED = "false";
    expect(await runDailyCopyReviewOnce()).toBeNull();
    expect(mockTryAcquireLock).not.toHaveBeenCalled();
  });
});

describe("REECRIRE — l'original le plus ancien est conservé", () => {
  const approved = { verdict: "APPROVED", score: 9, issues: [] };

  it("vanne déjà réécrite en v1 : originalContent/originalPunchline inchangés", async () => {
    mockJokeFindMany.mockResolvedValue([
      {
        id: "j1", content: "setup v1", punchline: "chute v1", category: "SITUATION", type: "ONE_LINER",
        maturityLevel: 1, comedyTechnique: "t", techniqueExplanation: "e", howToApply: "h",
        originalContent: "setup d'origine", originalPunchline: "chute d'origine",
      },
    ]);
    mockReviewJoke.mockResolvedValue({
      verdict: "REECRIRE",
      reason: "r",
      rewritten: { content: "setup v2", punchline: "chute v2", comedyTechnique: "t", techniqueExplanation: "e", howToApply: "h" },
    });
    mockValidateJoke.mockResolvedValue(approved);
    await runCopyReviewBatch();
    const data = mockJokeUpdate.mock.calls[0][0].data;
    expect(data.content).toBe("setup v2");
    expect(data.originalContent).toBe("setup d'origine");
    expect(data.originalPunchline).toBe("chute d'origine");
  });

  it("première réécriture d'un conseil : l'original = le texte courant", async () => {
    mockTipFindMany.mockResolvedValue([
      {
        id: "t1", title: "Titre", content: "Contenu", example: "ex", exercise: "DÉFI X : y",
        category: "TIMING", difficulty: "DEBUTANT", originalTitle: null, originalContent: null,
      },
    ]);
    mockReviewTip.mockResolvedValue({
      verdict: "REECRIRE",
      reason: "r",
      rewritten: { title: "Titre v2", content: "Contenu v2", example: "ex2", exercise: "DÉFI Z : w" },
    });
    mockValidateTip.mockResolvedValue(approved);
    await runCopyReviewBatch();
    const data = mockTipUpdate.mock.calls[0][0].data;
    expect(data.originalTitle).toBe("Titre");
    expect(data.originalContent).toBe("Contenu");
  });
});

describe("parseCopyReviewVersion", () => {
  it.each([
    [undefined, 1],
    ["", 1],
    ["abc", 1],
    ["0", 1],
    ["-3", 1],
    ["2", 2],
    [" 3 ", 3],
  ])("%p → %p", (raw, expected) => {
    expect(parseCopyReviewVersion(raw as string | undefined)).toBe(expected);
  });
});

/**
 * @jest-environment node
 *
 * Tests — Copy Review Runner (s11) : orchestration du batch,
 * kill-switch, filtres SQL, sécurité Director sur les réécritures.
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

jest.mock("@/lib/ai/personas", () => ({
  getPersonaForDay: () => "YANIS",
}));

import {
  isCopyReviewEnabled,
  runCopyReviewBatch,
} from "@/lib/ai/copy-review-runner";

beforeEach(() => {
  mockJokeFindMany.mockReset();
  mockJokeUpdate.mockReset().mockResolvedValue({});
  mockTipFindMany.mockReset();
  mockTipUpdate.mockReset().mockResolvedValue({});
  mockReviewJoke.mockReset();
  mockReviewTip.mockReset();
  mockValidateJoke.mockReset();
  mockValidateTip.mockReset();
  mockJokeFindMany.mockResolvedValue([]);
  mockTipFindMany.mockResolvedValue([]);
  delete process.env.COPY_REVIEW_ENABLED;
  delete process.env.COPY_REVIEW_BATCH;
});

describe("isCopyReviewEnabled", () => {
  it("actif par défaut (aucune env var)", () => {
    expect(isCopyReviewEnabled()).toBe(true);
  });

  it("désactivé quand COPY_REVIEW_ENABLED=false", () => {
    process.env.COPY_REVIEW_ENABLED = "false";
    expect(isCopyReviewEnabled()).toBe(false);
  });

  it("désactivé pour '0', 'off', 'no'", () => {
    process.env.COPY_REVIEW_ENABLED = "0";
    expect(isCopyReviewEnabled()).toBe(false);
    process.env.COPY_REVIEW_ENABLED = "off";
    expect(isCopyReviewEnabled()).toBe(false);
    process.env.COPY_REVIEW_ENABLED = "no";
    expect(isCopyReviewEnabled()).toBe(false);
  });
});

describe("runCopyReviewBatch", () => {
  it("skip complet quand le kill-switch est actif", async () => {
    process.env.COPY_REVIEW_ENABLED = "false";
    const stats = await runCopyReviewBatch();
    expect(stats).toEqual(
      expect.objectContaining({
        jokesProcessed: 0,
        tipsProcessed: 0,
      }),
    );
    expect(mockJokeFindMany).not.toHaveBeenCalled();
  });

  it("GARDER : marque copyReviewedAt et copyVerdict, ne touche pas le texte", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "j1", content: "s", punchline: "p", category: "AUTODERISION", type: "STORY", maturityLevel: 1, comedyTechnique: null, techniqueExplanation: null, howToApply: null },
    ]);
    mockReviewJoke.mockResolvedValue({ verdict: "GARDER", reason: "OK charte" });

    const stats = await runCopyReviewBatch();
    expect(stats.jokesKept).toBe(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "j1" },
        data: expect.objectContaining({
          copyVerdict: "GARDER",
          copyReviewVersion: expect.any(Number),
        }),
      }),
    );
    // Ne modifie NI content NI punchline.
    const call = mockJokeUpdate.mock.calls[0][0];
    expect(call.data.content).toBeUndefined();
    expect(call.data.punchline).toBeUndefined();
  });

  it("RETIRER : isActive=false + copyVerdict RETIRER", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "j2", content: "s", punchline: "p", category: "AUTODERISION", type: "STORY", maturityLevel: 1, comedyTechnique: null, techniqueExplanation: null, howToApply: null },
    ]);
    mockReviewJoke.mockResolvedValue({
      verdict: "RETIRER",
      reason: "calembour phonétique irrattrapable",
    });

    const stats = await runCopyReviewBatch();
    expect(stats.jokesRemoved).toBe(1);
    expect(mockJokeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isActive: false, copyVerdict: "RETIRER" }),
      }),
    );
  });

  it("REECRIRE approuvée par le Director (score ≥ 8) → applique la réécriture avec originalContent", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "j3", content: "original setup", punchline: "original punch", category: "AUTODERISION", type: "STORY", maturityLevel: 1, comedyTechnique: null, techniqueExplanation: null, howToApply: null },
    ]);
    mockReviewJoke.mockResolvedValue({
      verdict: "REECRIRE",
      reason: "Idée tient",
      rewritten: {
        content: "nouveau setup",
        punchline: "nouveau punch",
        comedyTechnique: "Le contraste",
        techniqueExplanation: "explication",
        howToApply: "consigne + exemple",
      },
    });
    mockValidateJoke.mockResolvedValue({ verdict: "APPROVED", score: 9, strengths: [], issues: [], directorNote: "" });

    const stats = await runCopyReviewBatch();
    expect(stats.jokesRewritten).toBe(1);
    const call = mockJokeUpdate.mock.calls[0][0];
    expect(call.data.content).toBe("nouveau setup");
    expect(call.data.originalContent).toBe("original setup");
    expect(call.data.originalPunchline).toBe("original punch");
    expect(call.data.copyVerdict).toBe("REECRIRE");
  });

  it("REECRIRE REJECTED par le Director → on garde l'original, verdict marqué GARDER", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "j4", content: "s", punchline: "p", category: "AUTODERISION", type: "STORY", maturityLevel: 1, comedyTechnique: null, techniqueExplanation: null, howToApply: null },
    ]);
    mockReviewJoke.mockResolvedValue({
      verdict: "REECRIRE",
      reason: "Bof.",
      rewritten: {
        content: "reformulation faible",
        punchline: "punchline faible",
        comedyTechnique: "T",
        techniqueExplanation: "e",
        howToApply: "h",
      },
    });
    mockValidateJoke.mockResolvedValue({ verdict: "REJECTED", score: 4, strengths: [], issues: [], directorNote: "" });

    const stats = await runCopyReviewBatch();
    expect(stats.jokesGuarded).toBe(1);
    expect(stats.jokesRewritten).toBe(0);
    const call = mockJokeUpdate.mock.calls[0][0];
    expect(call.data.content).toBeUndefined();
    expect(call.data.copyVerdict).toBe("GARDER");
  });

  it("filtre SQL : ne prend que generatedByAI=true, isActive=true, non relus pour la version courante", async () => {
    mockJokeFindMany.mockResolvedValue([]);
    await runCopyReviewBatch();
    const where = mockJokeFindMany.mock.calls[0][0].where;
    expect(where.generatedByAI).toBe(true);
    expect(where.isActive).toBe(true);
    expect(where.OR).toBeDefined();
  });

  it("respecte COPY_REVIEW_BATCH pour la taille du lot", async () => {
    process.env.COPY_REVIEW_BATCH = "7";
    mockJokeFindMany.mockResolvedValue([]);
    mockTipFindMany.mockResolvedValue([]);
    await runCopyReviewBatch();
    expect(mockJokeFindMany.mock.calls[0][0].take).toBe(7);
    expect(mockTipFindMany.mock.calls[0][0].take).toBe(7);
  });

  it("erreur LLM sur une vanne → continue sur les suivantes, comptée dans errors", async () => {
    mockJokeFindMany.mockResolvedValue([
      { id: "j5", content: "s5", punchline: "p5", category: "AUTODERISION", type: "STORY", maturityLevel: 1, comedyTechnique: null, techniqueExplanation: null, howToApply: null },
      { id: "j6", content: "s6", punchline: "p6", category: "AUTODERISION", type: "STORY", maturityLevel: 1, comedyTechnique: null, techniqueExplanation: null, howToApply: null },
    ]);
    mockReviewJoke
      .mockRejectedValueOnce(new Error("LLM crash"))
      .mockResolvedValueOnce({ verdict: "GARDER", reason: "OK" });
    const stats = await runCopyReviewBatch();
    expect(stats.errors).toBe(1);
    expect(stats.jokesKept).toBe(1);
  });
});

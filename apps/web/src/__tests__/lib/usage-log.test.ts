/**
 * Tests — lib/ai/usage-log.ts
 *
 * Couvre :
 * - `computeCost` : tarifs Sonnet, Haiku, Opus, cache, modèle inconnu
 * - `logLLMUsage` : écriture Prisma réussie, silent-fail sur erreur DB
 * - `extractUsage` : champs usage Anthropic (tokens in/out + cache)
 *
 * Note Jest : on définit le mock Prisma via une factory inline (sans
 * référence externe) pour éviter le piège du hoisting de `jest.mock`.
 * On récupère ensuite la référence mockée via `(prisma as any).llmUsageLog.create`.
 */

// ─── Mock Prisma AVANT import (factory inline pour éviter hoisting) ──

jest.mock("@/lib/prisma", () => ({
  prisma: {
    llmUsageLog: {
      create: jest.fn().mockResolvedValue({ id: "log-123" }),
    },
  },
}));

// Supprime les logs console pour garder la sortie de test propre.
const originalWarn = console.warn;
const originalError = console.error;
beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});
afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

import { computeCost, logLLMUsage, extractUsage, PRICING } from "@/lib/ai/usage-log";
import { prisma } from "@/lib/prisma";
import type Anthropic from "@anthropic-ai/sdk";

const mockCreate = prisma.llmUsageLog.create as jest.Mock;

beforeEach(() => {
  mockCreate.mockClear();
  mockCreate.mockResolvedValue({ id: "log-123" });
  (console.warn as jest.Mock).mockClear();
  (console.error as jest.Mock).mockClear();
});

describe("computeCost — tarifs par modèle", () => {
  it("calcule le coût pour claude-sonnet-4-20250514", () => {
    // Sonnet 4 : 3$ input / 15$ output per million tokens
    // 1000 in + 500 out = (1000 * 3 + 500 * 15) / 1_000_000 = 0.0105 USD
    const cost = computeCost("claude-sonnet-4-20250514", {
      input_tokens: 1000,
      output_tokens: 500,
    });
    expect(cost).toBeCloseTo(0.0105, 6);
  });

  it("calcule le coût pour claude-haiku-4-5-20251001", () => {
    // Haiku 4.5 : 1$ input / 5$ output per million tokens
    // 1000 in + 500 out = (1000 * 1 + 500 * 5) / 1_000_000 = 0.0035 USD
    const cost = computeCost("claude-haiku-4-5-20251001", {
      input_tokens: 1000,
      output_tokens: 500,
    });
    expect(cost).toBeCloseTo(0.0035, 6);
  });

  it("calcule le coût pour claude-opus-4-6", () => {
    // Opus 4.6 : 5$ input / 25$ output per million tokens
    // 1000 in + 500 out = (1000 * 5 + 500 * 25) / 1_000_000 = 0.0175 USD
    const cost = computeCost("claude-opus-4-6", {
      input_tokens: 1000,
      output_tokens: 500,
    });
    expect(cost).toBeCloseTo(0.0175, 6);
  });

  it("intègre les tokens de cache (read + write) dans le coût", () => {
    // Sonnet : cacheRead 0.30$/M, cacheWrite 3.75$/M
    // 1000 input + 500 output + 2000 cache_read + 3000 cache_creation
    // = (1000*3 + 500*15 + 2000*0.3 + 3000*3.75) / 1_000_000
    // = (3000 + 7500 + 600 + 11250) / 1_000_000
    // = 22350 / 1_000_000 = 0.02235
    const cost = computeCost("claude-sonnet-4-20250514", {
      input_tokens: 1000,
      output_tokens: 500,
      cache_read_input_tokens: 2000,
      cache_creation_input_tokens: 3000,
    });
    expect(cost).toBeCloseTo(0.02235, 6);
  });

  it("retourne 0 + warning pour un modèle inconnu", () => {
    const cost = computeCost("claude-mystery-99", {
      input_tokens: 1000,
      output_tokens: 500,
    });
    expect(cost).toBe(0);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Modèle inconnu"),
    );
  });

  it("gère les champs usage null/undefined sans crasher", () => {
    const cost = computeCost("claude-sonnet-4-20250514", {
      input_tokens: 0,
      output_tokens: 0,
      cache_read_input_tokens: null,
      cache_creation_input_tokens: undefined,
    });
    expect(cost).toBe(0);
  });

  it("PRICING contient tous les modèles attendus", () => {
    expect(PRICING).toHaveProperty("claude-sonnet-4-20250514");
    expect(PRICING).toHaveProperty("claude-haiku-4-5-20251001");
    expect(PRICING).toHaveProperty("claude-opus-4-6");
  });
});

describe("logLLMUsage — écriture Prisma", () => {
  it("écrit un row avec les bonnes données sur succès", async () => {
    await logLLMUsage({
      agent: "joke-agent",
      fn: "generateDailyJoke",
      model: "claude-sonnet-4-20250514",
      usage: {
        input_tokens: 1500,
        output_tokens: 400,
        cache_read_input_tokens: 500,
        cache_creation_input_tokens: 200,
      },
      durationMs: 2300,
      success: true,
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.data).toMatchObject({
      agent: "joke-agent",
      fn: "generateDailyJoke",
      model: "claude-sonnet-4-20250514",
      inputTokens: 1500,
      outputTokens: 400,
      cacheReadTokens: 500,
      cacheCreationTokens: 200,
      durationMs: 2300,
      success: true,
    });
    expect(callArg.data.costUsd).toBeGreaterThan(0);
  });

  it("écrit un row avec success=false et errorMessage sur échec", async () => {
    await logLLMUsage({
      agent: "seo-blog-agent",
      fn: "generateArticle",
      model: "claude-sonnet-4-20250514",
      usage: { input_tokens: 0, output_tokens: 0 },
      success: false,
      errorMessage: "Timeout after 3 retries",
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.data.success).toBe(false);
    expect(callArg.data.errorMessage).toBe("Timeout after 3 retries");
  });

  it("silent-fail si l'écriture Prisma crash (ne throw pas)", async () => {
    mockCreate.mockRejectedValueOnce(new Error("DB unreachable"));

    await expect(
      logLLMUsage({
        agent: "tip-agent",
        fn: "generateDailyTip",
        model: "claude-sonnet-4-20250514",
        usage: { input_tokens: 100, output_tokens: 50 },
      }),
    ).resolves.toBeUndefined();

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("[llm-usage]"),
      expect.any(Error),
    );
  });

  it("silent-fail si la table n'existe pas (P2021)", async () => {
    const err: Error & { code?: string } = new Error("Table not found");
    err.code = "P2021";
    mockCreate.mockRejectedValueOnce(err);

    await expect(
      logLLMUsage({
        agent: "video-agent",
        fn: "selectDailyVideo",
        model: "claude-sonnet-4-20250514",
        usage: { input_tokens: 50, output_tokens: 20 },
      }),
    ).resolves.toBeUndefined();
  });
});

describe("extractUsage — parser réponse Anthropic", () => {
  it("extrait tokens in/out de base", () => {
    const response = {
      usage: {
        input_tokens: 1234,
        output_tokens: 567,
      },
    } as unknown as Anthropic.Message;

    const usage = extractUsage(response);
    expect(usage.input_tokens).toBe(1234);
    expect(usage.output_tokens).toBe(567);
  });

  it("extrait les tokens de cache quand présents", () => {
    const response = {
      usage: {
        input_tokens: 500,
        output_tokens: 200,
        cache_read_input_tokens: 1000,
        cache_creation_input_tokens: 300,
      },
    } as unknown as Anthropic.Message;

    const usage = extractUsage(response);
    expect(usage.cache_read_input_tokens).toBe(1000);
    expect(usage.cache_creation_input_tokens).toBe(300);
  });

  it("retourne 0 pour les champs absents (pas undefined)", () => {
    const response = {
      usage: {
        input_tokens: 500,
        output_tokens: 200,
      },
    } as unknown as Anthropic.Message;

    const usage = extractUsage(response);
    expect(usage.cache_read_input_tokens).toBe(0);
    expect(usage.cache_creation_input_tokens).toBe(0);
  });

  it("gère un usage totalement absent", () => {
    const response = {} as unknown as Anthropic.Message;
    const usage = extractUsage(response);
    expect(usage.input_tokens).toBe(0);
    expect(usage.output_tokens).toBe(0);
  });
});

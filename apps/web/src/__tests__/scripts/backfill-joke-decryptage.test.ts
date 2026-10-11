/**
 * Tests — scripts/backfill-joke-decryptage.ts (s10).
 *
 * Depuis s10, le script applique en priorité les décryptages PRÉ-RÉDIGÉS du
 * fichier bundlé (src/data/joke-decryptages.json), sans IA. L'IA n'est qu'un
 * fallback optionnel (--ai) pour les vannes ABSENTES du fichier.
 *
 * Couvre :
 *  - Mode from-file (défaut) : applique le décryptage du fichier par content.
 *  - Vanne hors fichier sans --ai : skip (laissée null), pas de crash.
 *  - Fallback IA (--ai) : génère pour les vannes hors fichier.
 *  - Idempotence : ne lit que comedyTechnique null.
 *  - Robustesse : un échec n'interrompt pas le batch ; dry-run n'écrit rien.
 */

import { backfillJokeDecryptage } from "../../../scripts/backfill-joke-decryptage";
import jokeDecryptages from "@/data/joke-decryptages.json";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

jest.mock("@/lib/ai/agents/joke-agent", () => ({
  generateJokeDecryptage: jest.fn(),
}));

import { prisma } from "@/lib/prisma";
import { generateJokeDecryptage } from "@/lib/ai/agents/joke-agent";

const mockFindMany = prisma.joke.findMany as jest.Mock;
const mockUpdate = prisma.joke.update as jest.Mock;
const mockGenerate = generateJokeDecryptage as jest.Mock;

// Première vanne réelle du fichier (matchée par content).
const fileEntry = (jokeDecryptages as Array<{ content: string; comedyTechnique: string }>)[0];

const fileJoke = (id: string) => ({
  id,
  content: fileEntry.content,
  punchline: `Chute ${id}`,
  category: "AUTODERISION",
  type: "CLASSIQUE",
});

// Vanne ABSENTE du fichier (content custom).
const orphanJoke = (id: string) => ({
  id,
  content: `Vanne hors fichier ${id}`,
  punchline: `Chute ${id}`,
  category: "ABSURDE",
  type: "ONESHOT",
});

const fakeDecryptage = {
  comedyTechnique: "La triple chute",
  techniqueExplanation: "Trois retournements.",
  howToApply: "Garde le meilleur pour la fin.",
};

const DEFAULT_OPTS = { dryRun: false, useAi: false, limit: null, delayMs: 0 };
const AI_OPTS = { dryRun: false, useAi: true, limit: null, delayMs: 0 };

describe("backfillJokeDecryptage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("ne lit que les vannes comedyTechnique null (idempotent)", async () => {
    mockFindMany.mockResolvedValue([]);
    await backfillJokeDecryptage(DEFAULT_OPTS);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { comedyTechnique: null } }),
    );
  });

  it("applique le décryptage PRÉ-RÉDIGÉ du fichier (sans IA)", async () => {
    mockFindMany.mockResolvedValue([fileJoke("1")]);
    mockUpdate.mockResolvedValue({});

    const result = await backfillJokeDecryptage(DEFAULT_OPTS);

    // Aucun appel IA : le décryptage vient du fichier.
    expect(mockGenerate).not.toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        comedyTechnique: fileEntry.comedyTechnique,
        techniqueExplanation: expect.any(String),
        howToApply: expect.any(String),
      },
    });
    expect(result).toEqual({ total: 1, success: 1, failed: 0, skipped: 0 });
  });

  it("skip (sans crash) une vanne absente du fichier quand --ai est OFF", async () => {
    mockFindMany.mockResolvedValue([orphanJoke("1")]);

    const result = await backfillJokeDecryptage(DEFAULT_OPTS);

    expect(mockGenerate).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(result).toEqual({ total: 1, success: 0, failed: 0, skipped: 1 });
  });

  it("fallback IA (--ai) : génère pour les vannes hors fichier", async () => {
    mockFindMany.mockResolvedValue([orphanJoke("1")]);
    mockGenerate.mockResolvedValue(fakeDecryptage);
    mockUpdate.mockResolvedValue({});

    const result = await backfillJokeDecryptage(AI_OPTS);

    expect(mockGenerate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        comedyTechnique: fakeDecryptage.comedyTechnique,
        techniqueExplanation: fakeDecryptage.techniqueExplanation,
        howToApply: fakeDecryptage.howToApply,
      },
    });
    expect(result).toEqual({ total: 1, success: 1, failed: 0, skipped: 0 });
  });

  it("priorise le fichier même quand --ai est ON (0 appel IA si match)", async () => {
    mockFindMany.mockResolvedValue([fileJoke("1")]);
    mockUpdate.mockResolvedValue({});

    await backfillJokeDecryptage(AI_OPTS);

    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("poursuit le batch quand une vanne échoue (try/catch par vanne)", async () => {
    mockFindMany.mockResolvedValue([fileJoke("1"), fileJoke("2"), fileJoke("3")]);
    mockUpdate
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("DB write fail"))
      .mockResolvedValueOnce({});

    const result = await backfillJokeDecryptage(DEFAULT_OPTS);

    expect(mockUpdate).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ total: 3, success: 2, failed: 1, skipped: 0 });
  });

  it("dry-run : n'écrit rien en DB", async () => {
    mockFindMany.mockResolvedValue([fileJoke("1")]);

    const result = await backfillJokeDecryptage({ ...DEFAULT_OPTS, dryRun: true });

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(result).toEqual({ total: 1, success: 1, failed: 0, skipped: 0 });
  });

  it("transmet la limite à la requête (take)", async () => {
    mockFindMany.mockResolvedValue([]);
    await backfillJokeDecryptage({ ...DEFAULT_OPTS, limit: 5 });

    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }));
  });

  it("ne pose pas take sans limite", async () => {
    mockFindMany.mockResolvedValue([]);
    await backfillJokeDecryptage(DEFAULT_OPTS);

    const callArg = mockFindMany.mock.calls[0][0];
    expect(callArg).not.toHaveProperty("take");
  });
});

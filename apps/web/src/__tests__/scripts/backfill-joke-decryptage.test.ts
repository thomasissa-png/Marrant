import { backfillJokeDecryptage } from "../../../scripts/backfill-joke-decryptage";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
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

const fakeJoke = (id: string) => ({
  id,
  content: `Setup ${id}`,
  punchline: `Chute ${id}`,
  category: "ABSURDE",
  type: "ONESHOT",
});

const fakeDecryptage = {
  comedyTechnique: "La triple chute",
  techniqueExplanation: "Trois retournements.",
  howToApply: "Garde le meilleur pour la fin.",
};

const NO_THROTTLE = { dryRun: false, limit: null, delayMs: 0 };

describe("backfillJokeDecryptage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("only queries jokes where comedyTechnique is null (idempotent)", async () => {
    mockFindMany.mockResolvedValue([]);
    await backfillJokeDecryptage(NO_THROTTLE);

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { comedyTechnique: null } })
    );
  });

  it("generates and persists décryptage for each null joke", async () => {
    mockFindMany.mockResolvedValue([fakeJoke("1"), fakeJoke("2")]);
    mockGenerate.mockResolvedValue(fakeDecryptage);
    mockUpdate.mockResolvedValue({});

    const result = await backfillJokeDecryptage(NO_THROTTLE);

    expect(mockGenerate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        comedyTechnique: fakeDecryptage.comedyTechnique,
        techniqueExplanation: fakeDecryptage.techniqueExplanation,
        howToApply: fakeDecryptage.howToApply,
      },
    });
    expect(result).toEqual({ total: 2, success: 2, failed: 0 });
  });

  it("continues the batch when one joke fails (try/catch per joke)", async () => {
    mockFindMany.mockResolvedValue([fakeJoke("1"), fakeJoke("2"), fakeJoke("3")]);
    mockGenerate
      .mockResolvedValueOnce(fakeDecryptage)
      .mockRejectedValueOnce(new Error("décryptage incomplet"))
      .mockResolvedValueOnce(fakeDecryptage);
    mockUpdate.mockResolvedValue({});

    const result = await backfillJokeDecryptage(NO_THROTTLE);

    // 3 tentatives de génération, mais seulement 2 updates (l'échec n'écrit pas)
    expect(mockGenerate).toHaveBeenCalledTimes(3);
    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ total: 3, success: 2, failed: 1 });
  });

  it("does not write to DB in dry-run mode", async () => {
    mockFindMany.mockResolvedValue([fakeJoke("1")]);
    mockGenerate.mockResolvedValue(fakeDecryptage);

    const result = await backfillJokeDecryptage({ ...NO_THROTTLE, dryRun: true });

    expect(mockGenerate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(result).toEqual({ total: 1, success: 1, failed: 0 });
  });

  it("passes the limit through to the query (take)", async () => {
    mockFindMany.mockResolvedValue([]);
    await backfillJokeDecryptage({ ...NO_THROTTLE, limit: 5 });

    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }));
  });

  it("does not set take when no limit is provided", async () => {
    mockFindMany.mockResolvedValue([]);
    await backfillJokeDecryptage(NO_THROTTLE);

    const callArg = mockFindMany.mock.calls[0][0];
    expect(callArg).not.toHaveProperty("take");
  });
});

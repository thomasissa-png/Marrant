/**
 * @jest-environment node
 *
 * Lot Q1 (s14) : repli déterministe de /api/daily = uniquement une vanne
 * validée (isActive, GARDER, décryptage). Pool vide → repli historique.
 */
const mockPrisma = {
  dailyContent: { findUnique: jest.fn() },
  joke: { count: jest.fn(), findFirst: jest.fn() },
  tip: { count: jest.fn(), findFirst: jest.fn() },
  video: { count: jest.fn(), findFirst: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockPrisma;
  },
}));

import { GET } from "@/app/api/daily/route";

type Where = Record<string, unknown> | undefined;
const isPool = (w: Where) => w?.copyVerdict === "GARDER";

beforeEach(() => {
  jest.clearAllMocks();
  mockPrisma.dailyContent.findUnique.mockResolvedValue(null);
  mockPrisma.tip.count.mockResolvedValue(3);
  mockPrisma.tip.findFirst.mockResolvedValue({ id: "tip" });
  mockPrisma.video.count.mockResolvedValue(0);
  mockPrisma.joke.findFirst.mockImplementation(({ where }: { where: Where }) =>
    Promise.resolve({ id: isPool(where) ? "garder-joke" : "legacy-joke" }),
  );
});

describe("GET /api/daily — repli vanne du jour", () => {
  it("DailyContent présent → renvoyé tel quel, aucun repli", async () => {
    mockPrisma.dailyContent.findUnique.mockResolvedValue({ date: "d", joke: { id: "dc-joke" }, tip: { id: "t" }, video: null });
    const body = await (await GET()).json();
    expect(body.joke.id).toBe("dc-joke");
    expect(mockPrisma.joke.count).not.toHaveBeenCalled();
  });

  it("pool validé non vide → vanne GARDER avec décryptage", async () => {
    mockPrisma.joke.count.mockResolvedValue(4);
    const body = await (await GET()).json();
    expect(body.joke.id).toBe("garder-joke");
    const where = mockPrisma.joke.findFirst.mock.calls[0][0].where;
    expect(where).toEqual({ isActive: true, copyVerdict: "GARDER", comedyTechnique: { not: null } });
    // Aucune requête sur le repli historique (REECRIRE inclus)
    expect(mockPrisma.joke.findFirst).toHaveBeenCalledTimes(1);
  });

  it("pool validé vide (transition) → repli historique", async () => {
    mockPrisma.joke.count.mockImplementation(({ where }: { where: Where }) => Promise.resolve(isPool(where) ? 0 : 7));
    const body = await (await GET()).json();
    expect(body.joke.id).toBe("legacy-joke");
  });
});

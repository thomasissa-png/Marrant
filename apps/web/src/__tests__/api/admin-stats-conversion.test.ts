/**
 * @jest-environment node
 *
 * Audit parcours s16 (data-analyst C5) : la conversion de `api/admin/stats`
 * ne compte plus les 11 anciens comptes gratuits au dénominateur.
 */
type Where = { plan?: string; createdAt?: { lt?: Date; gte?: Date } } | undefined;

const userCount = jest.fn(async (args?: { where?: Where }) => {
  const where = args?.where;
  if (where?.plan === "FREE" && where.createdAt?.lt) return 11; // anciens comptes gratuits
  if (where?.plan === "PREMIUM") return 2;
  if (where?.plan === "FREE") return 11;
  if (where?.createdAt) return 0;
  return 13;
});
const zero = jest.fn(async () => 0);
const none = jest.fn(async () => null);
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { count: (a?: { where?: Where }) => userCount(a), aggregate: async () => ({ _sum: { xp: 0 } }) },
    subscription: { count: () => zero(), findMany: async () => [] },
    joke: { count: () => zero() },
    tip: { count: () => zero() },
    video: { count: () => zero() },
    learningPath: { count: () => zero() },
    userFavorite: { count: () => zero() },
    socialPost: { count: () => zero(), findMany: async () => [] },
    dailyContent: { findFirst: () => none() },
    blogArticle: { findFirst: () => none() },
  },
}));
jest.mock("@/lib/stripe", () => ({ PREMIUM_PRICE_CENTS: 299 }));

import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/stats/route";

describe("GET /api/admin/stats : conversion", () => {
  beforeAll(() => {
    process.env.ADMIN_PASSWORD = "secret-test";
  });
  afterAll(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it("2 abonnés sur 13 comptes dont 11 anciens gratuits : 100 %, pas 15,4 %", async () => {
    const res = await GET(
      new NextRequest("https://deviens-marrant.fr/api/admin/stats", {
        headers: { authorization: "Bearer secret-test" },
      }),
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.conversionRate).toBe("100.0");
    expect(body.legacyFreeUsers).toBe(11);
    expect(userCount).toHaveBeenCalledWith({
      where: { plan: "FREE", createdAt: { lt: new Date("2026-10-06T05:45:00Z") } },
    });
  });
});

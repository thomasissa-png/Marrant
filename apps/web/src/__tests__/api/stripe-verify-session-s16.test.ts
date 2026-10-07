/**
 * @jest-environment node
 *
 * s16 (07/10/2026), reco 6 : verify-session écrit intervalle, montant et fin
 * de période comme le webhook (MRR juste même si le webhook est en retard).
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const sessionsRetrieve = jest.fn();
const subsRetrieve = jest.fn();
jest.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: { sessions: { retrieve: (...a: unknown[]) => sessionsRetrieve(...a) } },
    subscriptions: { retrieve: (...a: unknown[]) => subsRetrieve(...a) },
  },
}));
const prisma = {
  user: { findUnique: jest.fn(), update: jest.fn() },
  subscription: { upsert: jest.fn() },
  $transaction: jest.fn(),
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return prisma;
  },
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/stripe/verify-session/route";

const verify = () =>
  POST(new NextRequest("http://localhost/api/stripe/verify-session", { method: "POST", body: JSON.stringify({ sessionId: "cs_1" }) }));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  getServerSession.mockResolvedValue({ user: { id: "user-1" } });
  prisma.user.findUnique.mockResolvedValue({ plan: "FREE" });
  prisma.$transaction.mockResolvedValue([]);
  sessionsRetrieve.mockResolvedValue({ metadata: { userId: "user-1" }, payment_status: "paid", subscription: "sub_1", customer: "cus_1" });
  subsRetrieve.mockResolvedValue({
    id: "sub_1",
    status: "active",
    items: { data: [{ current_period_end: 1_791_072_000, price: { unit_amount: 2499, recurring: { interval: "year" } } }] },
  });
});

it("paiement confirmé : Premium avec intervalle, montant et fin de période (forme basil)", async () => {
  const res = await verify();
  expect(await res.json()).toEqual({ plan: "PREMIUM", activated: true });
  const upsert = prisma.subscription.upsert.mock.calls[0][0];
  const attendu = {
    status: "ACTIVE",
    stripeCustomerId: "cus_1",
    stripeSubscriptionId: "sub_1",
    billingInterval: "year",
    priceAmountCents: 2499,
    cancelAtPeriodEnd: false,
    currentPeriodEnd: new Date(1_791_072_000 * 1000),
  };
  expect(upsert.create).toMatchObject(attendu);
  expect(upsert.update).toMatchObject(attendu);
});

it("session d'un autre compte : 403, rien en base", async () => {
  sessionsRetrieve.mockResolvedValue({ metadata: { userId: "autre" }, payment_status: "paid", subscription: "sub_1" });
  const res = await verify();
  expect(res.status).toBe(403);
  expect(prisma.$transaction).not.toHaveBeenCalled();
});

it("paiement non confirmé : pas d'activation", async () => {
  sessionsRetrieve.mockResolvedValue({ metadata: { userId: "user-1" }, payment_status: "unpaid", subscription: "sub_1" });
  const body = await (await verify()).json();
  expect(body).toMatchObject({ plan: "FREE", activated: false });
  expect(prisma.$transaction).not.toHaveBeenCalled();
});

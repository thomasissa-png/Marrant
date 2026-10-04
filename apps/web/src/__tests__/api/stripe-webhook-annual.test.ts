/**
 * @jest-environment node
 *
 * Webhook Stripe et formule annuelle (04/10/2026) : un abonnement annuel suit
 * exactement le chemin du mensuel (plan PREMIUM, période, renouvellement,
 * annulation), sans comparaison au STRIPE_PREMIUM_PRICE_ID. Intervalle et
 * montant réels recopiés en base. Stripe et Prisma entièrement mockés.
 */

const constructEvent = jest.fn();
const retrieveSubscription = jest.fn();
jest.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: (...a: unknown[]) => constructEvent(...a) },
    subscriptions: { retrieve: (...a: unknown[]) => retrieveSubscription(...a) },
  },
}));
jest.mock("next/headers", () => ({
  headers: async () => new Map([["stripe-signature", "sig_test"]]),
}));

const prisma = {
  webhookEvent: { findUnique: jest.fn(), create: jest.fn() },
  user: { update: jest.fn() },
  subscription: { upsert: jest.fn(), update: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn() },
  $transaction: jest.fn(),
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return prisma;
  },
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/stripe/webhook/route";

const PERIOD_END = 1_791_072_000; // 04/10/2026 + 1 an (secondes)

function stripeSubscription(over: Record<string, unknown> = {}) {
  return {
    id: "sub_annual_1",
    status: "active",
    current_period_end: PERIOD_END,
    cancel_at_period_end: false,
    items: { data: [{ price: { id: "price_annual_live", unit_amount: 2499, recurring: { interval: "year" } } }] },
    ...over,
  };
}

async function deliver(type: string, object: unknown) {
  constructEvent.mockReturnValue({ id: `evt_${type}_${Math.random()}`, type, data: { object } });
  return POST(new NextRequest("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }));
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.STRIPE_PREMIUM_PRICE_ID = "price_monthly_live"; // différent de l'annuel : ne doit rien rejeter
  prisma.webhookEvent.findUnique.mockResolvedValue(null);
  prisma.$transaction.mockResolvedValue([]);
  prisma.subscription.findUnique.mockResolvedValue({ id: "db_sub_1", userId: "user-1" });
  prisma.subscription.findFirst.mockResolvedValue({ id: "db_sub_1", userId: "user-1" });
});

describe("webhook Stripe : abonnement annuel", () => {
  it("checkout.session.completed annuel : PREMIUM, période d'un an, intervalle et montant réels", async () => {
    retrieveSubscription.mockResolvedValue(stripeSubscription());
    const res = await deliver("checkout.session.completed", {
      metadata: { userId: "user-1", plan: "annual" },
      subscription: "sub_annual_1",
      customer: "cus_1",
    });
    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "PREMIUM" } });
    const upsert = prisma.subscription.upsert.mock.calls[0][0];
    const expected = {
      plan: "PREMIUM",
      status: "ACTIVE",
      stripeSubscriptionId: "sub_annual_1",
      currentPeriodEnd: new Date(PERIOD_END * 1000),
      billingInterval: "year",
      priceAmountCents: 2499,
      cancelAtPeriodEnd: false,
    };
    expect(upsert.create).toMatchObject(expected);
    expect(upsert.update).toMatchObject(expected);
    expect(prisma.webhookEvent.create).toHaveBeenCalled();
  });

  it("abonné de lancement mensuel à 0,99 € : traité pareil, montant réel conservé", async () => {
    retrieveSubscription.mockResolvedValue(
      stripeSubscription({ items: { data: [{ price: { unit_amount: 99, recurring: { interval: "month" } } }] } }),
    );
    await deliver("checkout.session.completed", { metadata: { userId: "user-1" }, subscription: "sub_1", customer: "cus_1" });
    expect(prisma.subscription.upsert.mock.calls[0][0].update).toMatchObject({
      plan: "PREMIUM",
      billingInterval: "month",
      priceAmountCents: 99,
    });
  });

  it("renouvellement annuel (subscription.updated) : nouvelle période, reste PREMIUM", async () => {
    const nextEnd = PERIOD_END + 365 * 86400;
    await deliver("customer.subscription.updated", stripeSubscription({ current_period_end: nextEnd }));
    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { id: "db_sub_1" },
      data: expect.objectContaining({
        status: "ACTIVE",
        currentPeriodEnd: new Date(nextEnd * 1000),
        billingInterval: "year",
      }),
    });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "PREMIUM" } });
  });

  it("annulation programmée en fin de période : reste PREMIUM, cancelAtPeriodEnd enregistré", async () => {
    await deliver("customer.subscription.updated", stripeSubscription({ cancel_at_period_end: true }));
    expect(prisma.subscription.update.mock.calls[0][0].data).toMatchObject({ status: "ACTIVE", cancelAtPeriodEnd: true });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "PREMIUM" } });
  });

  it("abonnement annuel annulé (canceled) : repasse FREE", async () => {
    await deliver("customer.subscription.updated", stripeSubscription({ status: "canceled" }));
    expect(prisma.subscription.update.mock.calls[0][0].data).toMatchObject({ status: "CANCELED" });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "FREE" } });
  });

  it("subscription.deleted annuel : CANCELED et FREE", async () => {
    await deliver("customer.subscription.deleted", stripeSubscription());
    expect(prisma.subscription.update).toHaveBeenCalledWith({ where: { id: "db_sub_1" }, data: { status: "CANCELED" } });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "FREE" } });
  });

  it("invoice.payment_succeeded annuel : période d'un an recopiée, PREMIUM", async () => {
    const nextEnd = PERIOD_END + 365 * 86400;
    await deliver("invoice.payment_succeeded", {
      customer: "cus_1",
      lines: { data: [{ period: { start: PERIOD_END, end: nextEnd } }] },
    });
    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { id: "db_sub_1" },
      data: { status: "ACTIVE", currentPeriodEnd: new Date(nextEnd * 1000) },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "PREMIUM" } });
  });
});

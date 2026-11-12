/**
 * @jest-environment node
 *
 * s24 lot 0 : mesure d'usage écrite par le webhook Stripe (souscription à l'heure de l'événement
 * `checkout.session.completed`, résiliation programmée
 * avec heure exacte et motif codé, renouvellement payé). Écriture en échec = webhook 200 quand
 * même, événement Stripe enregistré (Stripe ne rejoue pas). Aucune donnée personnelle.
 * Stripe, Prisma, alertes et e-mails entièrement simulés (mêmes simulations que s16).
 */
const constructEvent = jest.fn();
const retrieveSubscription = jest.fn();
const retrieveInvoice = jest.fn();
const retrieveCharge = jest.fn();
const listSubscriptions = jest.fn();
const cancelStripeSubscriptionNow = jest.fn();
jest.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: (...a: unknown[]) => constructEvent(...a) },
    subscriptions: {
      retrieve: (...a: unknown[]) => retrieveSubscription(...a),
      list: (...a: unknown[]) => listSubscriptions(...a),
    },
    invoices: { retrieve: (...a: unknown[]) => retrieveInvoice(...a) },
    charges: { retrieve: (...a: unknown[]) => retrieveCharge(...a) },
  },
  cancelStripeSubscriptionNow: (...a: unknown[]) => cancelStripeSubscriptionNow(...a),
}));
jest.mock("next/headers", () => ({ headers: async () => new Map([["stripe-signature", "sig_test"]]) }));
// s23 (@reviewer O3) : interrupteur de la page de résiliation lu à l'appel (fermé par défaut).
jest.mock("@/config/resiliation", () => ({
  ...jest.requireActual("@/config/resiliation"),
  get RESILIATION_PAGE_OUVERTE() {
    return (globalThis as { __RESILIATION_OUVERTE__?: boolean }).__RESILIATION_OUVERTE__ === true;
  },
}));

const prisma = {
  webhookEvent: { findUnique: jest.fn(), create: jest.fn(), updateMany: jest.fn() },
  user: { update: jest.fn(), findFirst: jest.fn() },
  subscription: { upsert: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  // s21 hebdo : la lettre de la semaine s'arrête avec le passage à FREE (avis @legal §6.2).
  premiumLetterPreference: { updateMany: jest.fn() },
  usageEvent: { create: jest.fn(), findFirst: jest.fn() },
  $transaction: jest.fn(),
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return prisma;
  },
}));
const recordAdminAlert = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/admin-alerts", () => ({
  ...jest.requireActual("@/lib/admin-alerts"),
  recordAdminAlert: (...a: unknown[]) => recordAdminAlert(...a),
}));
const notifySubscriptionConfirmed = jest.fn().mockResolvedValue(true);
const notifyPaymentFailed = jest.fn().mockResolvedValue(true);
const notifyCancellationScheduled = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/emails/paiement-notifications", () => ({
  notifySubscriptionConfirmed: (...a: unknown[]) => notifySubscriptionConfirmed(...a),
  notifyPaymentFailed: (...a: unknown[]) => notifyPaymentFailed(...a),
  notifyCancellationScheduled: (...a: unknown[]) => notifyCancellationScheduled(...a),
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/stripe/webhook/route";

const PERIOD_END = 1_791_072_000;
const DB_SUB = { id: "db_sub_1", userId: "user-1", stripeSubscriptionId: "sub_1", stripeCustomerId: "cus_1", billingInterval: "month" };

function stripeSub(over: Record<string, unknown> = {}) {
  return {
    id: "sub_1",
    status: "active",
    current_period_end: PERIOD_END,
    cancel_at_period_end: false,
    items: { data: [{ price: { unit_amount: 199, recurring: { interval: "month" } } }] },
    ...over,
  };
}

async function deliver(type: string, object: unknown, previous?: Record<string, unknown>, created = 1_759_900_000) {
  constructEvent.mockReturnValue({
    id: `evt_${Math.random()}`,
    type,
    created,
    data: { object, ...(previous ? { previous_attributes: previous } : {}) },
  });
  return POST(new NextRequest("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }));
}

const ecrits = () => prisma.usageEvent.create.mock.calls.map((c) => (c[0] as { data: Record<string, unknown> }).data);

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  prisma.webhookEvent.findUnique.mockResolvedValue(null);
  prisma.$transaction.mockResolvedValue([]);
  prisma.subscription.findUnique.mockResolvedValue(DB_SUB);
  prisma.user.findFirst.mockResolvedValue(null);
  prisma.usageEvent.create.mockResolvedValue({});
  retrieveSubscription.mockResolvedValue(stripeSub());
});
afterEach(() => jest.restoreAllMocks());

const session = (over: Record<string, unknown> = {}) => ({
  id: "cs_1",
  mode: "subscription",
  metadata: { userId: "user-1" },
  subscription: "sub_1",
  customer: "cus_1",
  created: 1_759_800_000,
  customer_details: { email: "yanis@exemple.fr", name: "Yanis" },
  ...over,
});

describe("souscription", () => {
  it("une ligne à l'heure de l'événement checkout.session.completed (pas la création de la session), formule, clé stable ; rien de personnel", async () => {
    // Session créée au clic « S'abonner » (1 759 800 000), paiement validé 7 min plus tard.
    const res = await deliver("checkout.session.completed", session(), undefined, 1_759_800_420);
    expect(res.status).toBe(200);
    expect(ecrits()).toEqual([
      {
        userId: "user-1",
        type: "souscription",
        detail: "month",
        occurredAt: new Date(1_759_800_420 * 1000),
        dedupKey: "souscription:user-1:1759800420",
      },
    ]);
    // L'e-mail de confirmation approuvé garde sa date de souscription (création de la session).
    expect(notifySubscriptionConfirmed).toHaveBeenCalledWith("user-1", expect.objectContaining({ dateSouscription: new Date(1_759_800_000 * 1000) }));
    expect(JSON.stringify(ecrits())).not.toMatch(/yanis|exemple|cus_1|cs_1/i);
  });

  it("événement rejoué : même clé (la contrainte d'unicité absorbe le doublon)", async () => {
    await deliver("checkout.session.completed", session());
    await deliver("checkout.session.completed", session());
    const cles = ecrits().map((d) => d.dedupKey);
    expect(cles).toHaveLength(2);
    expect(new Set(cles).size).toBe(1);
  });

  it("écriture en échec : webhook 200, Premium activé, événement Stripe enregistré, e-mail parti", async () => {
    prisma.usageEvent.create.mockRejectedValue(Object.assign(new Error("table absente"), { code: "P2021" }));
    const res = await deliver("checkout.session.completed", session());
    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "PREMIUM" } });
    expect(prisma.webhookEvent.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ provider: "stripe" }) }));
    expect(notifySubscriptionConfirmed).toHaveBeenCalled();
  });
});

describe("résiliation programmée", () => {
  it("heure de la demande (canceled_at) et motif codé du portail, jamais le commentaire", async () => {
    const res = await deliver(
      "customer.subscription.updated",
      stripeSub({
        cancel_at_period_end: true,
        canceled_at: 1_759_850_000,
        cancellation_details: { feedback: "too_expensive", comment: "Trop cher, Yanis", reason: "cancellation_requested" },
      }),
      { cancel_at_period_end: false },
    );
    expect(res.status).toBe(200);
    expect(ecrits()).toEqual([
      {
        userId: "user-1",
        type: "resiliation_programmee",
        detail: "too_expensive",
        occurredAt: new Date(1_759_850_000 * 1000),
        dedupKey: "resiliation_programmee:user-1:1759850000",
      },
    ]);
    expect(JSON.stringify(ecrits())).not.toMatch(/Yanis|Trop cher/);
  });

  it("sans canceled_at ni motif : heure de l'événement, détail vide", async () => {
    await deliver("customer.subscription.updated", stripeSub({ cancel_at_period_end: true }), { cancel_at_period_end: false }, 1_759_860_000);
    expect(ecrits()).toEqual([expect.objectContaining({ type: "resiliation_programmee", detail: null, occurredAt: new Date(1_759_860_000 * 1000) })]);
  });

  it("mise à jour sans résiliation (changement de carte) : rien", async () => {
    await deliver("customer.subscription.updated", stripeSub(), { items: {} });
    expect(prisma.usageEvent.create).not.toHaveBeenCalled();
  });

  it("écriture en échec : 200 et e-mail de résiliation envoyé comme avant", async () => {
    prisma.usageEvent.create.mockRejectedValue(new Error("base en panne"));
    const res = await deliver("customer.subscription.updated", stripeSub({ cancel_at_period_end: true }), { cancel_at_period_end: false });
    expect(res.status).toBe(200);
    expect(notifyCancellationScheduled).toHaveBeenCalled();
  });
});

describe("renouvellement payé (2e prélèvement)", () => {
  const facture = (over: Record<string, unknown> = {}) => ({
    id: "in_2", customer: "cus_1", subscription: "sub_1", billing_reason: "subscription_cycle", created: 1_762_500_000, ...over,
  });

  it("prélèvement de cycle : une ligne, formule de l'abonnement", async () => {
    const res = await deliver("invoice.payment_succeeded", facture());
    expect(res.status).toBe(200);
    expect(ecrits()).toEqual([
      {
        userId: "user-1",
        type: "renouvellement_paye",
        detail: "month",
        occurredAt: new Date(1_762_500_000 * 1000),
        dedupKey: "renouvellement_paye:user-1:1762500000",
      },
    ]);
  });

  it("premier paiement (subscription_create) : pas un renouvellement", async () => {
    await deliver("invoice.payment_succeeded", facture({ billing_reason: "subscription_create" }));
    expect(prisma.usageEvent.create).not.toHaveBeenCalled();
  });

  it("écriture en échec : 200, abonnement remis ACTIVE", async () => {
    prisma.usageEvent.create.mockRejectedValue(new Error("base en panne"));
    const res = await deliver("invoice.payment_succeeded", facture());
    expect(res.status).toBe(200);
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});

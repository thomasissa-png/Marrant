/**
 * @jest-environment node
 *
 * Webhook Stripe, correctifs de l'audit parcours s16 (07/10/2026) :
 *  - reco 2 : remboursement total → résiliation Stripe idempotente + base CANCELED/FREE ;
 *  - reco 3 : impayé → PAST_DUE, Premium CONSERVÉ, e-mail au 1er échec ;
 *    rétrogradation seulement à unpaid / canceled / incomplete_expired / deleted ;
 *  - reco 6 : activation en échec → 500, événement NON enregistré, alerte A ;
 *    utilisateur retrouvé par client Stripe ou e-mail si `userId` manque ;
 *  - reco 10 : e-mails de confirmation d'abonnement et de résiliation.
 * Stripe, Prisma, alertes et e-mails entièrement simulés.
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

const prisma = {
  webhookEvent: { findUnique: jest.fn(), create: jest.fn() },
  user: { update: jest.fn(), findFirst: jest.fn() },
  subscription: { upsert: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
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
const DB_SUB = { id: "db_sub_1", userId: "user-1", stripeSubscriptionId: "sub_1", stripeCustomerId: "cus_1" };

function stripeSub(over: Record<string, unknown> = {}) {
  return {
    id: "sub_1",
    status: "active",
    current_period_end: PERIOD_END,
    cancel_at_period_end: false,
    items: { data: [{ price: { unit_amount: 299, recurring: { interval: "month" } } }] },
    ...over,
  };
}

async function deliver(type: string, object: unknown, previous?: Record<string, unknown>) {
  constructEvent.mockReturnValue({
    id: `evt_${Math.random()}`,
    type,
    data: { object, ...(previous ? { previous_attributes: previous } : {}) },
  });
  return POST(new NextRequest("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }));
}

const alertKeys = () => recordAdminAlert.mock.calls.map((c) => (c[0] as { cle: string }).cle);

let errorSpy: jest.SpyInstance;
beforeEach(() => {
  jest.clearAllMocks();
  errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  prisma.webhookEvent.findUnique.mockResolvedValue(null);
  prisma.$transaction.mockResolvedValue([]);
  prisma.subscription.findUnique.mockResolvedValue(DB_SUB);
  prisma.user.findFirst.mockResolvedValue(null);
  cancelStripeSubscriptionNow.mockResolvedValue("canceled");
  retrieveSubscription.mockResolvedValue(stripeSub());
  // Lot H : la charge relue en acacia porte sa facture (développée).
  retrieveCharge.mockResolvedValue({ id: "ch_1", invoice: { id: "in_1", subscription: "sub_1" } });
  listSubscriptions.mockResolvedValue({ data: [{ id: "sub_1" }] });
});
afterEach(() => jest.restoreAllMocks());

describe("reco 2 : remboursement total", () => {
  it("résilie l'abonnement Stripe puis passe la base en CANCELED/FREE", async () => {
    const res = await deliver("charge.refunded", { id: "ch_1", customer: "cus_1", refunded: true });
    expect(res.status).toBe(200);
    expect(cancelStripeSubscriptionNow).toHaveBeenCalledWith("sub_1");
    expect(prisma.subscription.update).toHaveBeenCalledWith({ where: { id: "db_sub_1" }, data: { status: "CANCELED" } });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "FREE" } });
    expect(prisma.webhookEvent.create).toHaveBeenCalled();
  });

  it("abonnement déjà résilié à la main (procédure de Thomas) : aucune erreur, même résultat", async () => {
    cancelStripeSubscriptionNow.mockResolvedValue("already-canceled");
    const res = await deliver("charge.refunded", { id: "ch_1", customer: "cus_1", refunded: true });
    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "FREE" } });
  });

  it("résiliation Stripe en échec : 500, événement NON enregistré, alerte A", async () => {
    cancelStripeSubscriptionNow.mockRejectedValue(new Error("api down"));
    const res = await deliver("charge.refunded", { id: "ch_1", customer: "cus_1", refunded: true });
    expect(res.status).toBe(500);
    expect(prisma.webhookEvent.create).not.toHaveBeenCalled();
    expect(alertKeys()).toContain("paiement-remboursement-resiliation");
  });

  it("remboursement partiel : ni résiliation ni changement de plan", async () => {
    const res = await deliver("charge.refunded", { customer: "cus_1", refunded: false });
    expect(res.status).toBe(200);
    expect(cancelStripeSubscriptionNow).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("charge d'un AUTRE abonnement (doublon) : résilie celui-là, ne touche pas l'abonnement en base", async () => {
    retrieveInvoice.mockResolvedValue({ subscription: "sub_doublon" });
    const res = await deliver("charge.refunded", { customer: "cus_1", refunded: true, invoice: "in_1" });
    expect(res.status).toBe(200);
    expect(cancelStripeSubscriptionNow).toHaveBeenCalledWith("sub_doublon");
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

describe("reco 3 : impayé", () => {
  const invoice = (over: Record<string, unknown> = {}) => ({
    customer: "cus_1",
    // Forme clover (endpoint) : abonnement sous parent.subscription_details
    parent: { subscription_details: { subscription: "sub_1" } },
    attempt_count: 1,
    billing_reason: "subscription_cycle",
    hosted_invoice_url: "https://invoice.stripe.com/i/abc",
    ...over,
  });

  it("1er échec : PAST_DUE, Premium CONSERVÉ, e-mail avec montant et date prévue (étalon 3)", async () => {
    const res = await deliver("invoice.payment_failed", invoice({ amount_due: 299, created: 1_791_331_200 }));
    expect(res.status).toBe(200);
    expect(prisma.subscription.findUnique).toHaveBeenCalledWith({ where: { stripeSubscriptionId: "sub_1" } });
    expect(prisma.subscription.update).toHaveBeenCalledWith({ where: { id: "db_sub_1" }, data: { status: "PAST_DUE" } });
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(notifyPaymentFailed).toHaveBeenCalledWith("user-1", {
      montantCents: 299,
      datePrevue: new Date(1_791_331_200 * 1000),
    });
  });

  it("relances suivantes : pas de nouvel e-mail", async () => {
    await deliver("invoice.payment_failed", invoice({ attempt_count: 2 }));
    expect(notifyPaymentFailed).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("refus pendant le 1er paiement (checkout) : pas d'e-mail d'impayé", async () => {
    await deliver("invoice.payment_failed", invoice({ billing_reason: "subscription_create" }));
    expect(notifyPaymentFailed).not.toHaveBeenCalled();
  });

  it("aucun abonnement en base pour cette facture : rien", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    const res = await deliver("invoice.payment_failed", invoice());
    expect(res.status).toBe(200);
    expect(prisma.subscription.update).not.toHaveBeenCalled();
  });

  it("subscription.updated past_due : statut PAST_DUE sans changement de plan", async () => {
    await deliver("customer.subscription.updated", stripeSub({ status: "past_due" }));
    expect(prisma.subscription.update.mock.calls[0][0].data.status).toBe("PAST_DUE");
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it.each(["unpaid", "canceled", "incomplete_expired"])("subscription.updated %s : rétrogradation FREE", async (status) => {
    await deliver("customer.subscription.updated", stripeSub({ status }));
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "FREE" } });
  });

  it("subscription.deleted : rétrogradation FREE", async () => {
    await deliver("customer.subscription.deleted", stripeSub({ status: "canceled" }));
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "FREE" } });
  });
});

describe("reco 6 : activation après paiement", () => {
  const session = (over: Record<string, unknown> = {}) => ({
    id: "cs_1",
    mode: "subscription",
    metadata: { userId: "user-1" },
    subscription: "sub_1",
    customer: "cus_1",
    created: 1_759_800_000,
    ...over,
  });

  it("succès : Premium, intervalle et montant, e-mail de confirmation, événement enregistré", async () => {
    const res = await deliver("checkout.session.completed", session());
    expect(res.status).toBe(200);
    expect(prisma.subscription.upsert.mock.calls[0][0].create).toMatchObject({ billingInterval: "month", priceAmountCents: 299 });
    expect(notifySubscriptionConfirmed).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ interval: "month", montantCents: 299, prochainRenouvellement: new Date(PERIOD_END * 1000) }),
    );
    expect(prisma.webhookEvent.create).toHaveBeenCalled();
  });

  it("sans userId : retrouvé par le client Stripe connu en base", async () => {
    const res = await deliver("checkout.session.completed", session({ metadata: {} }));
    expect(res.status).toBe(200);
    expect(prisma.subscription.findUnique).toHaveBeenCalledWith({ where: { stripeCustomerId: "cus_1" }, select: { userId: true } });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "PREMIUM" } });
  });

  it("sans userId ni client connu : retrouvé par l'e-mail saisi chez Stripe", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    prisma.user.findFirst.mockResolvedValue({ id: "user-9" });
    const res = await deliver("checkout.session.completed", session({ metadata: {}, customer_details: { email: "Payeur@Exemple.fr" } }));
    expect(res.status).toBe(200);
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: { equals: "payeur@exemple.fr", mode: "insensitive" } },
      select: { id: true },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-9" }, data: { plan: "PREMIUM" } });
  });

  it("utilisateur introuvable : 500, événement NON enregistré, alerte A", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    const res = await deliver("checkout.session.completed", session({ metadata: {} }));
    expect(res.status).toBe(500);
    expect(prisma.webhookEvent.create).not.toHaveBeenCalled();
    expect(alertKeys()).toEqual(["paiement-activation-echec"]);
  });

  it("lecture de l'abonnement Stripe en échec : 500, NON enregistré, alerte A", async () => {
    retrieveSubscription.mockRejectedValue(new Error("stripe timeout"));
    const res = await deliver("checkout.session.completed", session());
    expect(res.status).toBe(500);
    expect(prisma.webhookEvent.create).not.toHaveBeenCalled();
    expect(alertKeys()).toEqual(["paiement-activation-echec"]);
  });

  it("erreur base pendant l'activation : 500, NON enregistré, alerte A, pas d'e-mail", async () => {
    prisma.$transaction.mockRejectedValue(new Error("db down"));
    const res = await deliver("checkout.session.completed", session());
    expect(res.status).toBe(500);
    expect(prisma.webhookEvent.create).not.toHaveBeenCalled();
    expect(alertKeys()).toEqual(["paiement-activation-echec"]);
    expect(notifySubscriptionConfirmed).not.toHaveBeenCalled();
  });
});

describe("reco 10 : accusé de résiliation", () => {
  it("résiliation programmée qui vient d'être posée : e-mail avec la fin d'accès", async () => {
    await deliver(
      "customer.subscription.updated",
      stripeSub({ cancel_at_period_end: true, canceled_at: 1_759_850_000 }),
      { cancel_at_period_end: false },
    );
    expect(notifyCancellationScheduled).toHaveBeenCalledWith("user-1", new Date(PERIOD_END * 1000));
    expect(prisma.subscription.update.mock.calls[0][0].data.cancelAtPeriodEnd).toBe(true);
  });

  it("autre mise à jour d'un abonnement déjà en résiliation : pas de nouvel e-mail", async () => {
    await deliver("customer.subscription.updated", stripeSub({ cancel_at_period_end: true }), { items: {} });
    expect(notifyCancellationScheduled).not.toHaveBeenCalled();
  });
});

describe("reco 8 : alertes du webhook", () => {
  it("secret absent : 500 + alerte A stripe-webhook-config", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const res = await POST(new NextRequest("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }));
    expect(res.status).toBe(500);
    expect(alertKeys()).toEqual(["stripe-webhook-config"]);
  });

  it("erreur inattendue : 500, NON enregistré, alerte A stripe-webhook-erreur", async () => {
    prisma.$transaction.mockRejectedValue(new Error("db down"));
    const res = await deliver("customer.subscription.deleted", stripeSub({ status: "canceled" }));
    expect(res.status).toBe(500);
    expect(prisma.webhookEvent.create).not.toHaveBeenCalled();
    expect(alertKeys()).toEqual(["stripe-webhook-erreur"]);
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe("lot H, P1-1 : remboursement en version clover (charge sans facture)", () => {
  const PREMIUM = { ...DB_SUB, stripeSubscriptionId: "sub_premium" };

  it("doublon remboursé : seule la charge du doublon est résiliée, Premium conservé", async () => {
    prisma.subscription.findUnique.mockResolvedValue(PREMIUM);
    retrieveCharge.mockResolvedValue({ id: "ch_doublon", invoice: { id: "in_d", subscription: "sub_doublon" } });
    listSubscriptions.mockResolvedValue({ data: [{ id: "sub_premium" }, { id: "sub_doublon" }] });
    const res = await deliver("charge.refunded", { id: "ch_doublon", customer: "cus_1", refunded: true });
    expect(res.status).toBe(200);
    expect(retrieveCharge).toHaveBeenCalledWith("ch_doublon", { expand: ["invoice"] });
    expect(cancelStripeSubscriptionNow).toHaveBeenCalledTimes(1);
    expect(cancelStripeSubscriptionNow).toHaveBeenCalledWith("sub_doublon");
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.subscription.update).not.toHaveBeenCalled();
  });

  it("facture référencée mais illisible : 500, rien résilié, événement NON enregistré, alerte A", async () => {
    retrieveCharge.mockResolvedValue({ id: "ch_1", invoice: "in_1" });
    retrieveInvoice.mockRejectedValue(new Error("api down"));
    const res = await deliver("charge.refunded", { id: "ch_1", customer: "cus_1", refunded: true });
    expect(res.status).toBe(500);
    expect(cancelStripeSubscriptionNow).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.webhookEvent.create).not.toHaveBeenCalled();
    expect(alertKeys()).toContain("paiement-remboursement-resiliation");
  });

  it("charge illisible : 500 (rejeu), aucun repli sur l'abonnement en base", async () => {
    retrieveCharge.mockRejectedValue(new Error("timeout"));
    const res = await deliver("charge.refunded", { id: "ch_1", customer: "cus_1", refunded: true });
    expect(res.status).toBe(500);
    expect(cancelStripeSubscriptionNow).not.toHaveBeenCalled();
  });

  it("sans facture et un seul abonnement chez Stripe : repli sur celui-ci", async () => {
    retrieveCharge.mockResolvedValue({ id: "ch_1", invoice: null });
    const res = await deliver("charge.refunded", { id: "ch_1", customer: "cus_1", refunded: true });
    expect(res.status).toBe(200);
    expect(cancelStripeSubscriptionNow).toHaveBeenCalledWith("sub_1");
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "user-1" }, data: { plan: "FREE" } });
  });

  it("sans facture et plusieurs abonnements : aucune résiliation, alerte, Premium conservé", async () => {
    retrieveCharge.mockResolvedValue({ id: "ch_1", invoice: null });
    listSubscriptions.mockResolvedValue({ data: [{ id: "sub_1" }, { id: "sub_2" }] });
    const res = await deliver("charge.refunded", { id: "ch_1", customer: "cus_1", refunded: true });
    expect(res.status).toBe(200);
    expect(cancelStripeSubscriptionNow).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(alertKeys()).toContain("paiement-remboursement-resiliation");
  });
});

describe("lot H, P2 : événements tardifs et e-mail unique", () => {
  const session = { id: "cs_1", mode: "subscription", metadata: { userId: "user-1" }, subscription: "sub_1", customer: "cus_1" };

  it("checkout pour un compte supprimé : rien recréé, 200, alerte A, pas d'e-mail", async () => {
    prisma.$transaction.mockRejectedValueOnce(Object.assign(new Error("Record to update not found"), { code: "P2025" }));
    const res = await deliver("checkout.session.completed", session);
    expect(res.status).toBe(200);
    expect(notifySubscriptionConfirmed).not.toHaveBeenCalled();
    expect(alertKeys()).toContain("paiement-activation-echec");
  });

  it("e-mail de confirmation déjà parti pour cet abonnement : pas de second envoi", async () => {
    prisma.webhookEvent.create.mockRejectedValueOnce(Object.assign(new Error("Unique constraint"), { code: "P2002" }));
    const res = await deliver("checkout.session.completed", session);
    expect(res.status).toBe(200);
    expect(prisma.webhookEvent.create.mock.calls[0][0].data.eventId).toBe("email-confirmation:sub_1");
    expect(notifySubscriptionConfirmed).not.toHaveBeenCalled();
  });

  it("invoice.payment_succeeded pour un client inconnu ou supprimé : no-op", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    const res = await deliver("invoice.payment_succeeded", { id: "in_9", customer: "cus_9", subscription: "sub_9" });
    expect(res.status).toBe(200);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("invoice.payment_succeeded tardif après remboursement (base CANCELED, Stripe canceled) : Premium NON remis", async () => {
    prisma.subscription.findUnique.mockResolvedValue({ ...DB_SUB, status: "CANCELED" });
    retrieveSubscription.mockResolvedValue(stripeSub({ status: "canceled" }));
    const res = await deliver("invoice.payment_succeeded", { id: "in_1", customer: "cus_1", subscription: "sub_1" });
    expect(res.status).toBe(200);
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("subscription.updated « active » tardif sur un abonnement résilié : ignoré", async () => {
    prisma.subscription.findUnique.mockResolvedValue({ ...DB_SUB, status: "CANCELED" });
    retrieveSubscription.mockResolvedValue(stripeSub({ status: "canceled" }));
    const res = await deliver("customer.subscription.updated", stripeSub());
    expect(res.status).toBe(200);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("subscription.updated pour un compte supprimé : no-op", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    const res = await deliver("customer.subscription.updated", stripeSub());
    expect(res.status).toBe(200);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});

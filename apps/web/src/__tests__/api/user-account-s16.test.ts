/**
 * @jest-environment node
 *
 * s16 recos 5 et 11 : lib/account (résumé d'abonnement, suppression du compte)
 * et routes DELETE /api/user, GET /api/user/subscription,
 * POST /api/user/subscription/portal. Stripe entièrement mocké.
 */
const mockDb = {
  user: { findUnique: jest.fn(), delete: jest.fn((a: unknown) => ({ op: "user.delete", a })) },
  subscription: { findUnique: jest.fn() },
  verificationToken: { deleteMany: jest.fn((a: unknown) => ({ op: "verificationToken.deleteMany", a })) },
  ceoLead: { deleteMany: jest.fn((a: unknown) => ({ op: "ceoLead.deleteMany", a })) },
  newsletterSubscriber: { deleteMany: jest.fn((a: unknown) => ({ op: "newsletterSubscriber.deleteMany", a })) },
  $transaction: jest.fn(async (ops: unknown[]) => ops),
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockDb;
  },
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const stripeApi = {
  subscriptions: { retrieve: jest.fn(), list: jest.fn() },
  billingPortal: { sessions: { create: jest.fn() } },
};
const cancelStripeSubscriptionNow = jest.fn();
const createPortalSession = jest.fn();
jest.mock("@/lib/stripe", () => ({
  getStripe: () => stripeApi,
  cancelStripeSubscriptionNow: (...a: unknown[]) => cancelStripeSubscriptionNow(...a),
  createPortalSession: (...a: unknown[]) => createPortalSession(...a),
}));

import { deleteAccount, getSubscriptionSummary } from "@/lib/account";
import { DELETE } from "@/app/api/user/route";
import { GET as getSubscription } from "@/app/api/user/subscription/route";
import { POST as postPortal } from "@/app/api/user/subscription/portal/route";
import { TEXTES_SUPPRESSION } from "@/config/textes/compte";

const end = new Date("2026-11-12T10:00:00Z");
function json(method: string, body: unknown) {
  return new Request("http://localhost/api/x", { method, body: JSON.stringify(body), headers: { "content-type": "application/json" } });
}

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  stripeApi.subscriptions.list.mockResolvedValue({ data: [] });
  cancelStripeSubscriptionNow.mockResolvedValue("canceled");
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe("getSubscriptionSummary (reco 11)", () => {
  const base = {
    status: "ACTIVE",
    billingInterval: "year",
    priceAmountCents: 2499,
    currentPeriodEnd: end,
    cancelAtPeriodEnd: false,
    stripeCustomerId: "cus_1",
    stripeSubscriptionId: "sub_1",
  };

  it("lit la base sans appeler Stripe quand tout est connu", async () => {
    mockDb.subscription.findUnique.mockResolvedValue(base);
    await expect(getSubscriptionSummary("u1")).resolves.toEqual({
      status: "ACTIVE",
      formule: "annual",
      priceCents: 2499,
      currentPeriodEnd: end.toISOString(),
      cancelAtPeriodEnd: false,
      hasPortal: true,
      hasStripeSubscription: true,
    });
    expect(stripeApi.subscriptions.retrieve).not.toHaveBeenCalled();
  });

  it("complète chez Stripe (lecture) un abonnement ancien sans formule", async () => {
    mockDb.subscription.findUnique.mockResolvedValue({ ...base, billingInterval: null, priceAmountCents: null, currentPeriodEnd: null });
    stripeApi.subscriptions.retrieve.mockResolvedValue({
      cancel_at_period_end: true,
      current_period_end: end.getTime() / 1000,
      items: { data: [{ price: { unit_amount: 299, recurring: { interval: "month" } } }] },
    });
    const s = await getSubscriptionSummary("u1");
    expect(s).toMatchObject({ formule: "monthly", priceCents: 299, currentPeriodEnd: end.toISOString(), cancelAtPeriodEnd: true });
  });

  it("Stripe indisponible : résumé partiel, pas d'erreur ; jamais abonné : null", async () => {
    mockDb.subscription.findUnique.mockResolvedValue({ ...base, billingInterval: null });
    stripeApi.subscriptions.retrieve.mockRejectedValue(new Error("timeout"));
    await expect(getSubscriptionSummary("u1")).resolves.toMatchObject({ formule: null, priceCents: 2499 });
    mockDb.subscription.findUnique.mockResolvedValue(null);
    await expect(getSubscriptionSummary("u1")).resolves.toBeNull();
  });
});

describe("deleteAccount (reco 5)", () => {
  const user = { email: "a@b.fr", subscription: { stripeSubscriptionId: "sub_1", stripeCustomerId: "cus_1" } };

  it("résilie chez Stripe (abonnement connu + autre abonnement vivant) AVANT d'effacer en transaction", async () => {
    mockDb.user.findUnique.mockResolvedValue(user);
    stripeApi.subscriptions.list.mockResolvedValue({
      data: [{ id: "sub_1", status: "active" }, { id: "sub_2", status: "past_due" }, { id: "sub_0", status: "canceled" }],
    });
    const order: string[] = [];
    cancelStripeSubscriptionNow.mockImplementation(async (id: string) => (order.push(`cancel:${id}`), "canceled"));
    mockDb.$transaction.mockImplementation(async (ops: unknown[]) => (order.push("transaction"), ops));

    await expect(deleteAccount("u1")).resolves.toEqual({ deleted: true, stripeCanceled: 2 });
    expect(order).toEqual(["cancel:sub_1", "cancel:sub_2", "transaction"]);
    const ops = (mockDb.$transaction.mock.calls[0][0] as Array<{ op: string }>).map((o) => o.op);
    expect(ops).toEqual(["verificationToken.deleteMany", "ceoLead.deleteMany", "newsletterSubscriber.deleteMany", "user.delete"]);
  });

  it("abonnement déjà résilié (remboursement) : idempotent, suppression faite", async () => {
    mockDb.user.findUnique.mockResolvedValue(user);
    cancelStripeSubscriptionNow.mockResolvedValue("already-canceled");
    await expect(deleteAccount("u1")).resolves.toEqual({ deleted: true, stripeCanceled: 0 });
  });

  it("Stripe en échec : rien n'est supprimé", async () => {
    mockDb.user.findUnique.mockResolvedValue(user);
    cancelStripeSubscriptionNow.mockRejectedValue(new Error("stripe down"));
    await expect(deleteAccount("u1")).rejects.toThrow("Résiliation Stripe impossible");
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("sans abonnement : aucun appel Stripe", async () => {
    mockDb.user.findUnique.mockResolvedValue({ email: "a@b.fr", subscription: null });
    await deleteAccount("u1");
    expect(stripeApi.subscriptions.list).not.toHaveBeenCalled();
    expect(cancelStripeSubscriptionNow).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/user", () => {
  it("sans session : 401", async () => {
    getServerSession.mockResolvedValue(null);
    expect((await DELETE(json("DELETE", { confirmation: "SUPPRIMER" }))).status).toBe(401);
  });

  it("mot de confirmation absent ou faux : 400, rien supprimé", async () => {
    for (const body of [{}, { confirmation: "oui" }]) {
      const res = await DELETE(json("DELETE", body));
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe(TEXTES_SUPPRESSION.motIncorrect);
    }
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
  });

  it("confirmé (casse et espaces ignorés) : supprimé, cookies de session effacés", async () => {
    mockDb.user.findUnique.mockResolvedValue({ email: "a@b.fr", subscription: null });
    const res = await DELETE(json("DELETE", { confirmation: " supprimer " }));
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toMatch(/next-auth\.session-token=;/);
  });

  it("Stripe en échec : 502 avec message clair", async () => {
    mockDb.user.findUnique.mockResolvedValue({ email: "a@b.fr", subscription: { stripeSubscriptionId: "sub_1", stripeCustomerId: null } });
    cancelStripeSubscriptionNow.mockRejectedValue(new Error("down"));
    const res = await DELETE(json("DELETE", { confirmation: "SUPPRIMER" }));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe(TEXTES_SUPPRESSION.echecStripe);
  });
});

describe("GET /api/user/subscription", () => {
  it("401 sans session ; résumé sinon", async () => {
    getServerSession.mockResolvedValueOnce(null);
    expect((await getSubscription()).status).toBe(401);
    mockDb.subscription.findUnique.mockResolvedValue(null);
    expect(await (await getSubscription()).json()).toEqual({ subscription: null });
  });
});

describe("POST /api/user/subscription/portal", () => {
  beforeEach(() => {
    mockDb.subscription.findUnique.mockResolvedValue({ stripeCustomerId: "cus_1", stripeSubscriptionId: "sub_1" });
  });

  it("changer de formule : parcours subscription_update ciblé, retour /profil", async () => {
    stripeApi.billingPortal.sessions.create.mockResolvedValue({ url: "https://billing.stripe.com/flow" });
    const res = await postPortal(json("POST", { parcours: "changer-formule" }));
    expect(await res.json()).toEqual({ url: "https://billing.stripe.com/flow", cible: true });
    expect(stripeApi.billingPortal.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_1",
        flow_data: expect.objectContaining({ type: "subscription_update", subscription_update: { subscription: "sub_1" } }),
      }),
    );
  });

  it("parcours refusé par la config du portail : repli sur le portail simple", async () => {
    stripeApi.billingPortal.sessions.create.mockRejectedValue(new Error("feature not enabled"));
    createPortalSession.mockResolvedValue("https://billing.stripe.com/simple");
    const res = await postPortal(json("POST", { parcours: "resilier" }));
    expect(await res.json()).toEqual({ url: "https://billing.stripe.com/simple", cible: false });
  });

  it("carte (impayé) : payment_method_update ; parcours inconnu : 400 ; sans client Stripe : 404", async () => {
    stripeApi.billingPortal.sessions.create.mockResolvedValue({ url: "u" });
    await postPortal(json("POST", { parcours: "carte" }));
    expect(stripeApi.billingPortal.sessions.create.mock.calls[0][0].flow_data.type).toBe("payment_method_update");
    expect((await postPortal(json("POST", { parcours: "autre" }))).status).toBe(400);
    mockDb.subscription.findUnique.mockResolvedValue(null);
    expect((await postPortal(json("POST", { parcours: "carte" }))).status).toBe(404);
  });
});

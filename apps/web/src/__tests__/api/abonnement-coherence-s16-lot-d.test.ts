/**
 * @jest-environment node
 *
 * Audit s16, lot D.
 * Point 4 : /api/stripe/status (lot A) et /api/user/subscription (profil, lot B)
 * disent la même chose pour l'impayé et la résiliation programmée
 * (lib/subscription-state) ; un abonnement terminé n'est plus « programmé ».
 * Point 5 : /api/stripe/checkout passe par la limite partagée (sharedRateLimit).
 */
const mockDb = {
  user: { findUnique: jest.fn() },
  subscription: { findUnique: jest.fn() },
};
jest.mock("@/lib/prisma", () => ({
  get prisma() {
    return mockDb;
  },
}));
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const createCheckoutSession = jest.fn();
jest.mock("@/lib/stripe", () => ({
  getStripe: () => ({ subscriptions: { retrieve: jest.fn() } }),
  cancelStripeSubscriptionNow: jest.fn(),
  createCheckoutSession: (...a: unknown[]) => createCheckoutSession(...a),
  AlreadySubscribedError: class extends Error {},
  PremiumPriceNotConfiguredError: class extends Error {},
}));
const sharedRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({
  sharedRateLimit: (...a: unknown[]) => sharedRateLimit(...a),
  retryAfterSeconds: () => 1234,
}));

import { GET as stripeStatus } from "@/app/api/stripe/status/route";
import { GET as userSubscription } from "@/app/api/user/subscription/route";
import { POST as checkout } from "@/app/api/stripe/checkout/route";
import { subscriptionFlags } from "@/lib/subscription-state";

const BASE = {
  stripeCustomerId: "cus_1",
  stripeSubscriptionId: "sub_1",
  billingInterval: "month",
  priceAmountCents: 299,
  currentPeriodEnd: new Date("2026-11-12T10:00:00.000Z"),
};

async function lireLesDeux(status: string, cancelAtPeriodEnd: boolean, plan: string) {
  mockDb.user.findUnique.mockResolvedValue({ plan });
  mockDb.subscription.findUnique.mockResolvedValue({ ...BASE, status, cancelAtPeriodEnd });
  const a = await (await stripeStatus()).json();
  const b = (await (await userSubscription()).json()).subscription;
  return { a, b };
}

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "user-1", email: "a@b.fr" } });
});

describe("point 4 : profil et /api/stripe/status alignés", () => {
  it("subscriptionFlags : impayé, programmée seulement si en cours", () => {
    expect(subscriptionFlags(null)).toEqual({ paymentIssue: false, cancelAtPeriodEnd: false });
    expect(subscriptionFlags({ status: "PAST_DUE", cancelAtPeriodEnd: true })).toEqual({ paymentIssue: true, cancelAtPeriodEnd: true });
    expect(subscriptionFlags({ status: "ACTIVE", cancelAtPeriodEnd: true }).cancelAtPeriodEnd).toBe(true);
    expect(subscriptionFlags({ status: "CANCELED", cancelAtPeriodEnd: true }).cancelAtPeriodEnd).toBe(false);
    expect(subscriptionFlags({ status: "INACTIVE", cancelAtPeriodEnd: true }).cancelAtPeriodEnd).toBe(false);
  });

  it("impayé : même statut, même échéance, Premium conservé", async () => {
    const { a, b } = await lireLesDeux("PAST_DUE", false, "PREMIUM");
    expect(a).toMatchObject({ plan: "PREMIUM", subscriptionStatus: "PAST_DUE", paymentIssue: true, cancelAtPeriodEnd: false });
    expect(b).toMatchObject({ status: "PAST_DUE", cancelAtPeriodEnd: false, hasPortal: true });
    expect(b.currentPeriodEnd).toBe(a.currentPeriodEnd);
  });

  it("résiliation programmée en cours : true des deux côtés, même date de fin", async () => {
    const { a, b } = await lireLesDeux("ACTIVE", true, "PREMIUM");
    expect(a.cancelAtPeriodEnd).toBe(true);
    expect(b.cancelAtPeriodEnd).toBe(true);
    expect(b.currentPeriodEnd).toBe(a.currentPeriodEnd);
  });

  it("abonnement terminé avec le drapeau resté en base : plus « programmée » nulle part", async () => {
    const { a, b } = await lireLesDeux("CANCELED", true, "FREE");
    expect(a).toMatchObject({ plan: "FREE", paymentIssue: false, cancelAtPeriodEnd: false });
    expect(b.cancelAtPeriodEnd).toBe(false);
  });
});

describe("point 5 : limite partagée au checkout", () => {
  it("compteur partagé par utilisateur, 5 par heure", async () => {
    sharedRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetAt: 0 });
    createCheckoutSession.mockResolvedValue("https://checkout.stripe.com/s");
    const res = await checkout(new Request("http://localhost/api/stripe/checkout", { method: "POST" }));
    expect(res.status).toBe(200);
    expect(sharedRateLimit).toHaveBeenCalledWith("checkout-user", "user-1", { maxRequests: 5, windowMs: 3600_000 });
  });

  it("limite atteinte : 429 + Retry-After, aucune session Stripe", async () => {
    sharedRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 60_000 });
    const res = await checkout(new Request("http://localhost/api/stripe/checkout", { method: "POST" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("1234");
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });

  it("visiteur : 401 avant tout comptage", async () => {
    getServerSession.mockResolvedValue(null);
    const res = await checkout(new Request("http://localhost/api/stripe/checkout", { method: "POST" }));
    expect(res.status).toBe(401);
    expect(sharedRateLimit).not.toHaveBeenCalled();
  });
});

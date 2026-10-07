/**
 * @jest-environment node
 *
 * Formule annuelle (04/10/2026) : app/api/stripe/checkout/route.ts (POST).
 * Corps optionnel { plan: "monthly" | "annual", returnTo } (mensuel par défaut) ;
 * annuel sans secret STRIPE_PREMIUM_ANNUAL_PRICE_ID → 503, jamais de repli sur le mensuel.
 * Aucun appel Stripe : lib/stripe entièrement mockée.
 */

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ allowed: true }) }));

const createCheckoutSession = jest.fn();
jest.mock("@/lib/stripe", () => {
  class PremiumPriceNotConfiguredError extends Error {
    constructor(public readonly plan: string) {
      super(`missing ${plan}`);
    }
  }
  class AlreadySubscribedError extends Error {
    constructor(public readonly status: string) {
      super(`already ${status}`);
    }
  }
  return {
    createCheckoutSession: (...a: unknown[]) => createCheckoutSession(...a),
    PremiumPriceNotConfiguredError,
    AlreadySubscribedError,
  };
});

import { POST } from "@/app/api/stripe/checkout/route";
import { AlreadySubscribedError, PremiumPriceNotConfiguredError } from "@/lib/stripe";

function post(body?: string) {
  return POST(
    new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      ...(body !== undefined ? { body, headers: { "Content-Type": "application/json" } } : {}),
    })
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "user-1", email: "a@b.fr" } });
  createCheckoutSession.mockResolvedValue("https://checkout.stripe.com/s");
});

describe("POST /api/stripe/checkout : formule", () => {
  it("sans corps (appels historiques) : mensuel", async () => {
    const res = await post();
    expect(res.status).toBe(200);
    expect(createCheckoutSession).toHaveBeenCalledWith("user-1", "a@b.fr", undefined, "monthly");
  });

  it("corps historique { returnTo } : mensuel, returnTo transmis", async () => {
    const res = await post(JSON.stringify({ returnTo: "/parcours/repartie" }));
    expect(res.status).toBe(200);
    expect(createCheckoutSession).toHaveBeenCalledWith("user-1", "a@b.fr", "/parcours/repartie", "monthly");
  });

  it("plan=annual transmis tel quel", async () => {
    const res = await post(JSON.stringify({ plan: "annual" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://checkout.stripe.com/s" });
    expect(createCheckoutSession).toHaveBeenCalledWith("user-1", "a@b.fr", undefined, "annual");
  });

  it("formule inconnue : 400, aucune session", async () => {
    const res = await post(JSON.stringify({ plan: "lifetime" }));
    expect(res.status).toBe(400);
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });

  it("annuel sans prix configuré : 503 explicite, un seul appel, aucun repli mensuel", async () => {
    createCheckoutSession.mockRejectedValue(new PremiumPriceNotConfiguredError("annual"));
    const res = await post(JSON.stringify({ plan: "annual" }));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toContain("annuel n'est pas encore disponible");
    expect(createCheckoutSession).toHaveBeenCalledTimes(1);
    expect(createCheckoutSession).not.toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything(), "monthly");
  });

  it("authentification requise", async () => {
    getServerSession.mockResolvedValue(null);
    const res = await post(JSON.stringify({ plan: "annual" }));
    expect(res.status).toBe(401);
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });
});

describe("POST /api/stripe/checkout : double abonnement refusé (s16)", () => {
  it.each([
    ["ACTIVE", "deja-abonne"],
    ["TRIALING", "deja-abonne"],
    ["PAST_DUE", "paiement-en-retard"],
    ["past_due", "paiement-en-retard"],
  ])("abonnement %s : 409, code %s, portail proposé, aucun lien de paiement", async (status, code) => {
    createCheckoutSession.mockRejectedValue(new AlreadySubscribedError(status));
    const res = await post(JSON.stringify({ plan: "annual" }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body).toMatchObject({ code, portal: true });
    expect(body.url).toBeUndefined();
    expect(body.error).not.toMatch(/—/);
  });

  it("erreur de prix Stripe : message client sans nom de variable d'environnement", async () => {
    createCheckoutSession.mockRejectedValue(new Error("No such price: 'price_x'"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await post();
    expect(res.status).toBe(500);
    expect((await res.json()).error).not.toMatch(/STRIPE_/);
    spy.mockRestore();
  });
});

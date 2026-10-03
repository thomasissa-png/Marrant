/**
 * @jest-environment node
 *
 * Formule annuelle (01/10/2026) : app/api/stripe/checkout/route.ts (POST).
 * Corps optionnel { plan: "monthly" | "annual" } (défaut mensuel), validé par zod ;
 * annuel sans secret STRIPE_PREMIUM_ANNUAL_PRICE_ID → 503, jamais de repli sur le mensuel.
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
  return {
    createCheckoutSession: (...a: unknown[]) => createCheckoutSession(...a),
    PremiumPriceNotConfiguredError,
  };
});

import { POST } from "@/app/api/stripe/checkout/route";
import { PremiumPriceNotConfiguredError } from "@/lib/stripe";

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

describe("POST /api/stripe/checkout", () => {
  it("defaults to the monthly plan without body (historical callers)", async () => {
    const res = await post();
    expect(res.status).toBe(200);
    expect(createCheckoutSession).toHaveBeenCalledWith("user-1", "a@b.fr", "monthly");
  });

  it("passes plan=annual through", async () => {
    const res = await post(JSON.stringify({ plan: "annual" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://checkout.stripe.com/s" });
    expect(createCheckoutSession).toHaveBeenCalledWith("user-1", "a@b.fr", "annual");
  });

  it("rejects an unknown plan with 400", async () => {
    const res = await post(JSON.stringify({ plan: "lifetime" }));
    expect(res.status).toBe(400);
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await post("{plan:");
    expect(res.status).toBe(400);
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });

  it("returns 503 with a clear message when the annual price is not configured", async () => {
    createCheckoutSession.mockRejectedValue(new PremiumPriceNotConfiguredError("annual"));
    const res = await post(JSON.stringify({ plan: "annual" }));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toContain("annuel n'est pas encore disponible");
    expect(createCheckoutSession).toHaveBeenCalledTimes(1);
  });

  it("requires authentication", async () => {
    getServerSession.mockResolvedValue(null);
    const res = await post(JSON.stringify({ plan: "annual" }));
    expect(res.status).toBe(401);
  });
});

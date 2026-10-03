// Test stripe constants and exports
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: "https://checkout.stripe.com/session-123" }),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({ url: "https://billing.stripe.com/portal-456" }),
      },
    },
    customers: {
      list: jest.fn().mockResolvedValue({ data: [] }),
      create: jest.fn().mockResolvedValue({ id: "cus_new_123" }),
    },
  }));
});

jest.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
  },
}));

import { stripe, PREMIUM_PRICE_ID, PREMIUM_PRICE_CENTS, createCheckoutSession, createPortalSession } from "@/lib/stripe";

describe("Stripe constants", () => {
  it("PREMIUM_PRICE_CENTS is 299 (2,99 €)", () => {
    expect(PREMIUM_PRICE_CENTS).toBe(299);
  });

  it("PREMIUM_PRICE_ID is defined", () => {
    expect(typeof PREMIUM_PRICE_ID).toBe("string");
  });

  it("stripe client is defined", () => {
    expect(stripe).toBeDefined();
  });
});

describe("createCheckoutSession", () => {
  it("creates a checkout session and returns URL", async () => {
    const url = await createCheckoutSession("user-1", "test@test.fr");
    expect(url).toBe("https://checkout.stripe.com/session-123");
  });

  it("calls stripe.checkout.sessions.create with customer ID", async () => {
    await createCheckoutSession("user-1", "test@test.fr");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        customer: "cus_new_123",
        metadata: { userId: "user-1" },
      })
    );
  });

  it("includes line items with premium price", async () => {
    await createCheckoutSession("user-1", "test@test.fr");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],
      })
    );
  });
});

describe("createCheckoutSession : retour à l'intention (returnTo, 03/10)", () => {
  const lastCall = () =>
    (stripe.checkout.sessions.create as jest.Mock).mock.calls.at(-1)[0] as { success_url: string; cancel_url: string };

  it("chemin interne : relayé encodé dans success_url et cancel_url", async () => {
    await createCheckoutSession("user-1", "test@test.fr", "/parcours/repartie");
    expect(lastCall().success_url).toMatch(/\/abonnement\/success\?session_id=\{CHECKOUT_SESSION_ID\}&returnTo=%2Fparcours%2Frepartie$/);
    expect(lastCall().cancel_url).toMatch(/\/abonnement\?upgrade=cancel&returnTo=%2Fparcours%2Frepartie$/);
  });

  it.each(["https://evil.example/x", "//evil.example", "/api/ai", "/abonnement"])(
    "valeur refusée (%s) : aucun returnTo transmis à Stripe",
    async (bad) => {
      await createCheckoutSession("user-1", "test@test.fr", bad);
      expect(lastCall().success_url).not.toContain("returnTo");
      expect(lastCall().cancel_url).not.toContain("returnTo");
    },
  );
});

describe("createPortalSession", () => {
  it("creates a portal session and returns URL", async () => {
    const url = await createPortalSession("cus_123");
    expect(url).toBe("https://billing.stripe.com/portal-456");
  });

  it("passes customer ID to stripe", async () => {
    await createPortalSession("cus_123");
    expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "cus_123" })
    );
  });
});

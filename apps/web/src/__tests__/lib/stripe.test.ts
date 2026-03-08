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
  }));
});

import { stripe, PREMIUM_PRICE_ID, PREMIUM_PRICE_CENTS, createCheckoutSession, createPortalSession } from "@/lib/stripe";

describe("Stripe constants", () => {
  it("PREMIUM_PRICE_CENTS is 999", () => {
    expect(PREMIUM_PRICE_CENTS).toBe(999);
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

  it("calls stripe.checkout.sessions.create with correct params", async () => {
    await createCheckoutSession("user-1", "test@test.fr");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        customer_email: "test@test.fr",
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

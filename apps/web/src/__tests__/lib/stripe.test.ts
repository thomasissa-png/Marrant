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
  it("PREMIUM_PRICE_CENTS is 99 (launch offer)", () => {
    expect(PREMIUM_PRICE_CENTS).toBe(99);
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

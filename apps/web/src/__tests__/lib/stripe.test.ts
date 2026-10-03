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

import {
  stripe,
  PREMIUM_PRICE_ID,
  PREMIUM_PRICE_CENTS,
  createCheckoutSession,
  createPortalSession,
  getPremiumPriceId,
  PremiumPriceNotConfiguredError,
} from "@/lib/stripe";

const MONTHLY = "price_test_monthly_1";
const ANNUAL = "price_test_annual_1";

beforeEach(() => {
  process.env.STRIPE_PREMIUM_PRICE_ID = MONTHLY;
  process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = ANNUAL;
  (stripe.checkout.sessions.create as jest.Mock).mockClear();
  (stripe.customers.create as jest.Mock).mockClear();
});

describe("Stripe constants", () => {
  it("PREMIUM_PRICE_CENTS is 499 (4,99 €)", () => {
    expect(PREMIUM_PRICE_CENTS).toBe(499);
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
        metadata: { userId: "user-1", plan: "monthly" },
      })
    );
  });

  it("uses the monthly price by default", async () => {
    await createCheckoutSession("user-1", "test@test.fr");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: MONTHLY, quantity: 1 }],
      })
    );
  });

  it("uses the annual price for plan=annual", async () => {
    await createCheckoutSession("user-1", "test@test.fr", "annual");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: ANNUAL, quantity: 1 }],
        metadata: { userId: "user-1", plan: "annual" },
      })
    );
  });

  it("refuses the annual plan when its secret is missing (no fallback to monthly)", async () => {
    delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
    await expect(createCheckoutSession("user-1", "test@test.fr", "annual")).rejects.toBeInstanceOf(
      PremiumPriceNotConfiguredError
    );
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    expect(stripe.customers.create).not.toHaveBeenCalled();
  });
});

describe("getPremiumPriceId", () => {
  it("returns the id of each plan", () => {
    expect(getPremiumPriceId("monthly")).toBe(MONTHLY);
    expect(getPremiumPriceId("annual")).toBe(ANNUAL);
  });

  it("rejects empty values and .env.example placeholders", () => {
    process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = "";
    expect(getPremiumPriceId("annual")).toBeNull();
    process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = "price_XXXXXXXXXXXXXXXXXXXX";
    expect(getPremiumPriceId("annual")).toBeNull();
    process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = "prod_123";
    expect(getPremiumPriceId("annual")).toBeNull();
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

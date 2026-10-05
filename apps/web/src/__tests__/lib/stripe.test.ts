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
  PremiumPriceNotConfiguredError,
} from "@/lib/stripe";
import { getPremiumPriceId, isAnnualPlanAvailable } from "@/lib/premium-plan-availability";

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
        metadata: { userId: "user-1", plan: "monthly" },
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

describe("createCheckoutSession : formule annuelle (04/10)", () => {
  const MONTHLY = "price_test_monthly_1";
  const ANNUAL = "price_test_annual_1";
  const saved = { m: process.env.STRIPE_PREMIUM_PRICE_ID, a: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID };

  beforeEach(() => {
    process.env.STRIPE_PREMIUM_PRICE_ID = MONTHLY;
    process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = ANNUAL;
    (stripe.checkout.sessions.create as jest.Mock).mockClear();
    (stripe.customers.create as jest.Mock).mockClear();
  });
  afterAll(() => {
    process.env.STRIPE_PREMIUM_PRICE_ID = saved.m;
    if (saved.a === undefined) delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
    else process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = saved.a;
  });

  it("mensuel par défaut, prix lu au runtime", async () => {
    await createCheckoutSession("user-1", "test@test.fr");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({ line_items: [{ price: MONTHLY, quantity: 1 }], metadata: { userId: "user-1", plan: "monthly" } })
    );
  });

  it("annuel : prix annuel et plan en metadata, returnTo conservé", async () => {
    await createCheckoutSession("user-1", "test@test.fr", "/parcours/repartie", "annual");
    const call = (stripe.checkout.sessions.create as jest.Mock).mock.calls.at(-1)[0];
    expect(call.line_items).toEqual([{ price: ANNUAL, quantity: 1 }]);
    expect(call.metadata).toEqual({ userId: "user-1", plan: "annual" });
    expect(call.success_url).toContain("returnTo=%2Fparcours%2Frepartie");
    // s15 : formule lue par /abonnement/success pour l'événement abonnement-reussi.
    expect(call.success_url).toMatch(/&formule=annuel$/);
    expect(call.cancel_url).not.toContain("formule");
  });

  it("mensuel : success_url sans paramètre formule (s15)", async () => {
    await createCheckoutSession("user-1", "test@test.fr");
    const call = (stripe.checkout.sessions.create as jest.Mock).mock.calls.at(-1)[0];
    expect(call.success_url).not.toContain("formule");
  });

  it.each([undefined, "", "price_XXXXXXXXXXXXXXXXXXXX", "prod_123"])(
    "annuel sans prix valide (%s) : erreur dédiée, aucun repli mensuel, aucun appel Stripe",
    async (value) => {
      if (value === undefined) delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      else process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = value;
      expect(isAnnualPlanAvailable()).toBe(false);
      await expect(createCheckoutSession("user-1", "test@test.fr", null, "annual")).rejects.toBeInstanceOf(
        PremiumPriceNotConfiguredError
      );
      expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
      expect(stripe.customers.create).not.toHaveBeenCalled();
    },
  );

  it("disponibilité : annuel visible dès que le secret est posé", () => {
    expect(isAnnualPlanAvailable()).toBe(true);
    expect(getPremiumPriceId("annual")).toBe(ANNUAL);
    expect(getPremiumPriceId("monthly")).toBe(MONTHLY);
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

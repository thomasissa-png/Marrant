/**
 * @jest-environment node
 *
 * s16 (07/10/2026) : lib/stripe.ts
 *  - garde « déjà abonné » (base puis Stripe) avant toute session Checkout ;
 *  - session Checkout : locale fr, texte TTC / 14 jours / résiliable, retour
 *    d'annulation lisible (`paiement=annule`) ;
 *  - case CGU seulement si STRIPE_CHECKOUT_CGU_CONSENT=true, avec repli sans
 *    case (et alerte A) si Stripe la refuse ;
 *  - résiliation immédiate idempotente.
 */
const sessionsCreate = jest.fn();
const subsList = jest.fn();
const subsRetrieve = jest.fn();
const subsCancel = jest.fn();
jest.mock("stripe", () =>
  jest.fn().mockImplementation(() => ({
    checkout: { sessions: { create: (...a: unknown[]) => sessionsCreate(...a) } },
    customers: { list: jest.fn().mockResolvedValue({ data: [] }), create: jest.fn().mockResolvedValue({ id: "cus_new" }) },
    subscriptions: {
      list: (...a: unknown[]) => subsList(...a),
      retrieve: (...a: unknown[]) => subsRetrieve(...a),
      cancel: (...a: unknown[]) => subsCancel(...a),
    },
  })),
);
const findUnique = jest.fn();
jest.mock("@/lib/prisma", () => ({ prisma: { subscription: { findUnique: (...a: unknown[]) => findUnique(...a) } } }));
const recordAdminAlert = jest.fn().mockResolvedValue(true);
jest.mock("@/lib/admin-alerts", () => ({
  recordAdminAlert: (...a: unknown[]) => recordAdminAlert(...a),
  CLES_TUNNEL: { checkoutCgu: "paiement-checkout-cgu" },
}));

import { AlreadySubscribedError, cancelStripeSubscriptionNow, createCheckoutSession } from "@/lib/stripe";
import { TEXTES_CHECKOUT } from "@/config/textes/paiement";

beforeEach(() => {
  jest.clearAllMocks();
  process.env.STRIPE_PREMIUM_PRICE_ID = "price_monthly_1";
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
  delete process.env.STRIPE_CHECKOUT_CGU_CONSENT;
  findUnique.mockResolvedValue(null);
  subsList.mockResolvedValue({ data: [] });
  sessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.com/s" });
});

describe("garde « déjà abonné »", () => {
  it.each(["ACTIVE", "TRIALING", "PAST_DUE"])("base %s : refus avant tout appel Stripe", async (status) => {
    findUnique.mockResolvedValue({ status, stripeCustomerId: "cus_1" });
    await expect(createCheckoutSession("u1", "a@b.fr")).rejects.toBeInstanceOf(AlreadySubscribedError);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it.each(["CANCELED", "INACTIVE"])("base %s : paiement autorisé", async (status) => {
    findUnique.mockResolvedValue({ status, stripeCustomerId: "cus_1" });
    await expect(createCheckoutSession("u1", "a@b.fr")).resolves.toBe("https://checkout.stripe.com/s");
    expect(subsList).toHaveBeenCalledWith({ customer: "cus_1", status: "all", limit: 20 });
  });

  it("base désynchronisée mais abonnement past_due chez Stripe : refus", async () => {
    findUnique.mockResolvedValue({ status: "CANCELED", stripeCustomerId: "cus_1" });
    subsList.mockResolvedValue({ data: [{ id: "sub_1", status: "canceled" }, { id: "sub_2", status: "past_due" }] });
    await expect(createCheckoutSession("u1", "a@b.fr")).rejects.toMatchObject({ status: "past_due" });
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it("contrôle Stripe impossible : on ne bloque pas le paiement", async () => {
    findUnique.mockResolvedValue({ status: "CANCELED", stripeCustomerId: "cus_1" });
    subsList.mockRejectedValue(new Error("timeout"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(createCheckoutSession("u1", "a@b.fr")).resolves.toBe("https://checkout.stripe.com/s");
    spy.mockRestore();
  });
});

describe("paramètres de la session Checkout", () => {
  it("locale fr, texte sous le bouton, retour d'annulation lisible, pas de case CGU par défaut", async () => {
    await createCheckoutSession("u1", "a@b.fr", null, "monthly");
    const params = sessionsCreate.mock.calls[0][0];
    expect(params.locale).toBe("fr");
    expect(params.custom_text).toEqual({ submit: { message: TEXTES_CHECKOUT.stripeSubmit } });
    expect(TEXTES_CHECKOUT.stripeSubmit).toMatch(/TTC/);
    expect(TEXTES_CHECKOUT.stripeSubmit).toMatch(/14 jours/);
    expect(TEXTES_CHECKOUT.stripeSubmit.length).toBeLessThanOrEqual(1200);
    expect(params.cancel_url).toBe("https://deviens-marrant.fr/abonnement?paiement=annule&upgrade=cancel");
    expect(params.consent_collection).toBeUndefined();
    expect(params.subscription_data).toEqual({ metadata: { userId: "u1", plan: "monthly" } });
  });

  it("STRIPE_CHECKOUT_CGU_CONSENT=true : case CGU obligatoire", async () => {
    process.env.STRIPE_CHECKOUT_CGU_CONSENT = "true";
    await createCheckoutSession("u1", "a@b.fr");
    expect(sessionsCreate.mock.calls[0][0].consent_collection).toEqual({ terms_of_service: "required" });
  });

  it("case CGU refusée par Stripe (URL absente) : repli sans case + alerte A, le paiement continue", async () => {
    process.env.STRIPE_CHECKOUT_CGU_CONSENT = "true";
    sessionsCreate
      .mockRejectedValueOnce(new Error("You cannot collect consent to your terms of service unless a URL is set in the Stripe Dashboard."))
      .mockResolvedValueOnce({ url: "https://checkout.stripe.com/sans-cgu" });
    await expect(createCheckoutSession("u1", "a@b.fr")).resolves.toBe("https://checkout.stripe.com/sans-cgu");
    expect(sessionsCreate.mock.calls[1][0].consent_collection).toBeUndefined();
    expect(recordAdminAlert).toHaveBeenCalledWith(expect.objectContaining({ cle: "paiement-checkout-cgu" }));
  });
});

describe("cancelStripeSubscriptionNow (idempotent)", () => {
  it("abonnement actif : résilié", async () => {
    subsRetrieve.mockResolvedValue({ status: "active" });
    await expect(cancelStripeSubscriptionNow("sub_1")).resolves.toBe("canceled");
    expect(subsCancel).toHaveBeenCalledWith("sub_1");
  });

  it.each(["canceled", "incomplete_expired"])("déjà %s : aucun appel d'annulation, pas d'erreur", async (status) => {
    subsRetrieve.mockResolvedValue({ status });
    await expect(cancelStripeSubscriptionNow("sub_1")).resolves.toBe("already-canceled");
    expect(subsCancel).not.toHaveBeenCalled();
  });

  it("abonnement introuvable : pas d'erreur", async () => {
    subsRetrieve.mockRejectedValue(Object.assign(new Error("No such subscription: 'sub_1'"), { code: "resource_missing" }));
    await expect(cancelStripeSubscriptionNow("sub_1")).resolves.toBe("already-canceled");
  });

  it("panne Stripe : l'erreur remonte (le webhook répond 500 et Stripe réessaie)", async () => {
    subsRetrieve.mockRejectedValue(new Error("api down"));
    await expect(cancelStripeSubscriptionNow("sub_1")).rejects.toThrow("api down");
  });
});

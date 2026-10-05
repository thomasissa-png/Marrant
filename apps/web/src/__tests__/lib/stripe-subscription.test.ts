
describe("subscriptionPeriodEnd (versions d'API Stripe)", () => {
  const { subscriptionPeriodEnd, periodEndData } = require("@/lib/stripe-subscription");

  it("lit current_period_end sur l'abonnement (acacia)", () => {
    expect(subscriptionPeriodEnd({ current_period_end: 1791000000, items: { data: [] } })?.getTime()).toBe(1791000000000);
  });

  it("lit current_period_end sur la ligne (basil, cas du bug du 01/10)", () => {
    const sub = { items: { data: [{ current_period_end: 1792000000 }] } };
    expect(subscriptionPeriodEnd(sub)?.getTime()).toBe(1792000000000);
    expect(periodEndData(sub)).toEqual({ currentPeriodEnd: new Date(1792000000000) });
  });

  it("n'écrit jamais de date invalide quand Stripe ne fournit rien", () => {
    expect(subscriptionPeriodEnd({ items: { data: [{}] } })).toBeNull();
    expect(periodEndData({ items: { data: [] } })).toEqual({});
  });
});

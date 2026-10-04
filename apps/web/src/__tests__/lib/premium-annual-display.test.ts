/**
 * Formule annuelle 24,99 €/an (04/10/2026) : chiffres dérivés, et affichage
 * conditionné au secret serveur STRIPE_PREMIUM_ANNUAL_PRICE_ID (FAQ, JSON-LD,
 * llms). MRR : annuel compté pour montant / 12, abonnés de lancement tels quels.
 */
import {
  PREMIUM_ANNUAL_EQUIVALENT_LABEL,
  PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS,
  PREMIUM_ANNUAL_PRICE_CENTS,
  PREMIUM_ANNUAL_PRICE_LABEL,
  PREMIUM_ANNUAL_SAVINGS_CENTS,
  PREMIUM_ANNUAL_SAVINGS_LABEL,
  PREMIUM_ANNUAL_SUMMARY,
  PREMIUM_PRICE_LABEL,
} from "@/config/premium";
import { faqs, getPremiumFaqs } from "@/lib/faqs";
import { buildProductJsonLd } from "@/components/seo/json-ld";
import { getLlmsFaqFull, getLlmsTarifs, LLMS_FAQ_FULL, LLMS_TARIFS } from "@/lib/llms-content";
import { monthlyRevenueCents } from "@/lib/stripe-subscription";
import { buildAbonnementUrl } from "@/lib/premium-return";

describe("chiffres de l'annuel (dérivés, pas en dur)", () => {
  it("24,99 €/an, soit 2,08 € par mois, 10,89 € économisés par an", () => {
    expect(PREMIUM_ANNUAL_PRICE_CENTS).toBe(2499);
    expect(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS).toBe(208);
    expect(PREMIUM_ANNUAL_SAVINGS_CENTS).toBe(1089);
    expect(PREMIUM_PRICE_LABEL).toBe("2,99 €/mois");
    expect(PREMIUM_ANNUAL_PRICE_LABEL).toBe("24,99 €/an");
    expect(PREMIUM_ANNUAL_EQUIVALENT_LABEL).toBe("soit 2,08 € par mois");
    expect(PREMIUM_ANNUAL_SAVINGS_LABEL).toBe("10,89 € économisés par an");
    expect(PREMIUM_ANNUAL_SUMMARY).toBe("24,99 €/an, soit 2,08 € par mois (10,89 € économisés par an)");
  });
});

describe("affichage conditionné", () => {
  const all = (v: unknown) => JSON.stringify(v);

  it("sans annuel : FAQ, JSON-LD et llms strictement inchangés", () => {
    expect(getPremiumFaqs(false)).toBe(faqs);
    expect(getLlmsTarifs(false)).toBe(LLMS_TARIFS);
    expect(getLlmsFaqFull(false)).toBe(LLMS_FAQ_FULL);
    const product = buildProductJsonLd();
    expect(product.offers).toMatchObject({ "@type": "Offer", price: "2.99" });
    expect(all(product)).not.toMatch(/24\.99|P1Y/);
    expect(all([faqs, LLMS_TARIFS, LLMS_FAQ_FULL])).not.toMatch(/24,99|annuel|par an/);
  });

  it("avec annuel : offres P1M 2.99 et P1Y 24.99", () => {
    const offers = buildProductJsonLd({ annualAvailable: true }).offers as Array<Record<string, unknown>>;
    expect(offers).toHaveLength(2);
    expect(offers[0]).toMatchObject({ price: "2.99", priceSpecification: { billingDuration: "P1M" } });
    expect(offers[1]).toMatchObject({ price: "24.99", priceSpecification: { billingDuration: "P1Y" } });
  });

  it("avec annuel : FAQ et llms citent les chiffres exacts, jamais « 4 mois », sans tiret cadratin", () => {
    const texts = all([getPremiumFaqs(true), getLlmsTarifs(true), getLlmsFaqFull(true)]);
    expect(texts).toContain("24,99 €/an");
    expect(texts).toContain("soit 2,08 € par mois");
    expect(texts).toContain("10,89 €");
    expect(texts).not.toMatch(/4 mois/);
    expect(texts).not.toContain("—");
    expect(getLlmsTarifs(true)).toHaveLength(LLMS_TARIFS.length + 1);
    expect(getLlmsTarifs(true).at(-1)).toMatch(/^Coaching/);
    expect(getPremiumFaqs(true)).toHaveLength(faqs.length);
  });
});

describe("MRR", () => {
  it("annuel = montant / 12, mensuel et lancement 0,99 € au montant réel, non synchronisé = repli", () => {
    expect(monthlyRevenueCents({ billingInterval: "year", priceAmountCents: 2499 }, 299)).toBeCloseTo(208.25);
    expect(monthlyRevenueCents({ billingInterval: "month", priceAmountCents: 299 }, 299)).toBe(299);
    expect(monthlyRevenueCents({ billingInterval: "month", priceAmountCents: 99 }, 299)).toBe(99);
    expect(monthlyRevenueCents({ billingInterval: null, priceAmountCents: null }, 299)).toBe(299);
  });
});

describe("buildAbonnementUrl et plan", () => {
  it("mensuel : URL inchangée ; annuel : plan=annual ajouté", () => {
    expect(buildAbonnementUrl(null)).toBe("/abonnement");
    expect(buildAbonnementUrl("/carnet")).toBe("/abonnement?returnTo=%2Fcarnet");
    expect(buildAbonnementUrl(null, "annual")).toBe("/abonnement?plan=annual");
    expect(buildAbonnementUrl("/carnet", "annual")).toBe("/abonnement?returnTo=%2Fcarnet&plan=annual");
  });
});

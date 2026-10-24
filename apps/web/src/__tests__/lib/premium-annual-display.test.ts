/**
 * Formule annuelle 16,99 €/an (24/10/2026, 24,99 € avant) : chiffres dérivés, et affichage
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
import { FAQ_VENTE, faqs, getPremiumFaqs } from "@/lib/faqs";
import { buildProductJsonLd } from "@/components/seo/json-ld";
import { getLlmsFaqFull, getLlmsTarifs, LLMS_FAQ_FULL, LLMS_TARIFS } from "@/lib/llms-content";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { monthlyRevenueCents } from "@/lib/stripe-subscription";
import { buildAbonnementUrl } from "@/lib/premium-return";

describe("chiffres de l'annuel (dérivés, pas en dur)", () => {
  it("16,99 €/an, soit 1,42 € par mois, 6,89 € économisés par an", () => {
    expect(PREMIUM_ANNUAL_PRICE_CENTS).toBe(1699);
    expect(PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS).toBe(142);
    expect(PREMIUM_ANNUAL_SAVINGS_CENTS).toBe(689);
    expect(PREMIUM_PRICE_LABEL).toBe("1,99\u00A0€/mois");
    expect(PREMIUM_ANNUAL_PRICE_LABEL).toBe("16,99\u00A0€/an");
    expect(PREMIUM_ANNUAL_EQUIVALENT_LABEL).toBe("soit 1,42\u00A0€ par mois");
    expect(PREMIUM_ANNUAL_SAVINGS_LABEL).toBe("6,89\u00A0€ économisés par an");
    expect(PREMIUM_ANNUAL_SUMMARY).toBe("16,99\u00A0€/an, soit 1,42\u00A0€ par mois (6,89\u00A0€ économisés par an)");
  });
});

describe("affichage conditionné", () => {
  const all = (v: unknown) => JSON.stringify(v);

  it("sans annuel : FAQ, JSON-LD et llms strictement inchangés", () => {
    // Concision v5 : la FAQ de /abonnement est la FAQ de vente (4 questions), réponse prix mensuelle.
    expect(getPremiumFaqs(false)).toBe(FAQ_VENTE);
    expect(FAQ_VENTE.every((f) => faqs.includes(f))).toBe(true);
    // GEO s21 (C1) : la réassurance du site, mot pour mot, ferme la liste.
    expect(getLlmsTarifs(false)).toEqual([...LLMS_TARIFS, REASSURANCE_UNIQUE]);
    expect(getLlmsFaqFull(false)).toBe(LLMS_FAQ_FULL);
    const product = buildProductJsonLd();
    expect(product.offers).toMatchObject({ "@type": "Offer", price: "1.99" });
    expect(all(product)).not.toMatch(/24\.99|P1Y/);
    expect(all([faqs, LLMS_TARIFS, LLMS_FAQ_FULL])).not.toMatch(/16,99|annuel|par an/);
  });

  it("avec annuel : offres P1M 1.99 et P1Y 16.99", () => {
    const offers = buildProductJsonLd({ annualAvailable: true }).offers as Array<Record<string, unknown>>;
    expect(offers).toHaveLength(2);
    expect(offers[0]).toMatchObject({ price: "1.99", priceSpecification: { billingDuration: "P1M" } });
    expect(offers[1]).toMatchObject({ price: "16.99", priceSpecification: { billingDuration: "P1Y" } });
  });

  it("avec annuel : FAQ et llms citent les chiffres exacts, jamais « 4 mois », sans tiret cadratin", () => {
    // Concision v5 : la réponse prix de la FAQ ne redit plus les prix annuels (déjà dans le sélecteur).
    expect(all(getPremiumFaqs(true))).toContain("Ça se renouvelle chaque mois ou chaque année, tant que tu ne résilies pas.");
    const texts = all([getLlmsTarifs(true), getLlmsFaqFull(true)]);
    expect(texts).toContain("16,99\u00A0€/an");
    expect(texts).toContain("soit 1,42\u00A0€ par mois");
    expect(texts).toContain("6,89\u00A0€");
    expect(texts).not.toMatch(/4 mois/);
    expect(texts).not.toContain("—");
    expect(getLlmsTarifs(true)).toHaveLength(LLMS_TARIFS.length + 2);
    // Coaching à 99 € retiré (13/10/2026) : la formule annuelle, puis la réassurance (GEO s21, C1).
    expect(getLlmsTarifs(true).at(-2)).toMatch(/^Premium en formule annuelle/);
    expect(getLlmsTarifs(true).at(-1)).toBe(REASSURANCE_UNIQUE);
    expect(getPremiumFaqs(true)).toHaveLength(FAQ_VENTE.length);
  });
});

describe("MRR", () => {
  it("annuel = montant / 12, mensuel et lancement 0,99 € au montant réel, non synchronisé = repli", () => {
    expect(monthlyRevenueCents({ billingInterval: "year", priceAmountCents: 1699 }, 199)).toBeCloseTo(1699 / 12);
    expect(monthlyRevenueCents({ billingInterval: "month", priceAmountCents: 199 }, 199)).toBe(199);
    expect(monthlyRevenueCents({ billingInterval: "month", priceAmountCents: 99 }, 199)).toBe(99);
    expect(monthlyRevenueCents({ billingInterval: null, priceAmountCents: null }, 199)).toBe(199);
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

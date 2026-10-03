import { z } from "zod";

/**
 * Formules Premium (décision fondateur 01/10/2026) : mensuel 4,99 €/mois,
 * annuel 39,99 €/an. Module pur (aucun SDK Stripe) : importable côté client.
 * Les identifiants de prix Stripe restent dans les secrets du Worker
 * (STRIPE_PREMIUM_PRICE_ID, STRIPE_PREMIUM_ANNUAL_PRICE_ID), voir lib/stripe.ts.
 */
export const PREMIUM_PLANS = ["monthly", "annual"] as const;
export type PremiumPlan = (typeof PREMIUM_PLANS)[number];

export const premiumPlanSchema = z.enum(PREMIUM_PLANS);

export const PREMIUM_MONTHLY_CENTS = 499;
export const PREMIUM_ANNUAL_CENTS = 3999;

/** 39,99 / 12 = 3,3325 € : affiché « 3,33 € par mois » (arrondi au centime inférieur, pas de surpromesse). */
export const PREMIUM_ANNUAL_MONTHLY_EQUIVALENT_CENTS = Math.floor(PREMIUM_ANNUAL_CENTS / 12);

/** 4,99 × 12 = 59,88 € ; 59,88 − 39,99 = 19,89 € économisés par an. */
export const PREMIUM_ANNUAL_SAVINGS_CENTS = PREMIUM_MONTHLY_CENTS * 12 - PREMIUM_ANNUAL_CENTS;

/** Format français : 499 → « 4,99 € ». */
export function formatEuros(cents: number): string {
  const euros = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return `${euros},${rest} €`;
}

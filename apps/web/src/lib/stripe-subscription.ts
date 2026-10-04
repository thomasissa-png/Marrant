import type Stripe from "stripe";

/** Champs de facturation recopiés en base depuis l'abonnement Stripe (webhook). */
export interface SubscriptionBilling {
  billingInterval: string | null;
  priceAmountCents: number | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Lit l'intervalle et le montant RÉELS du prix de l'abonnement (mensuel,
 * annuel, ou ancien prix de lancement à 0,99 €), sans jamais comparer à un
 * price id configuré : tout abonnement Stripe valide est traité de la même
 * façon, quel que soit son prix. Champs absents → null (jamais d'erreur).
 */
export function extractSubscriptionBilling(subscription: Stripe.Subscription): SubscriptionBilling {
  const price = subscription.items?.data?.[0]?.price;
  return {
    billingInterval: price?.recurring?.interval ?? null,
    priceAmountCents: typeof price?.unit_amount === "number" ? price.unit_amount : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end === true,
  };
}

/** Montant mensualisé d'un abonnement pour le MRR : un annuel compte pour montant / 12. */
export function monthlyRevenueCents(
  sub: { billingInterval: string | null; priceAmountCents: number | null },
  fallbackMonthlyCents: number,
): number {
  if (sub.priceAmountCents === null) return fallbackMonthlyCents; // abonnement pas encore resynchronisé
  if (sub.billingInterval === "year") return sub.priceAmountCents / 12;
  return sub.priceAmountCents;
}

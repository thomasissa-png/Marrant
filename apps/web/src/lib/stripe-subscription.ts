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

/**
 * Fin de période d'un abonnement, quelle que soit la version d'API Stripe :
 * jusqu'à 2025-02-24.acacia elle est sur l'abonnement (`current_period_end`),
 * depuis 2025-03-31.basil elle est sur chaque ligne (`items.data[].current_period_end`).
 * Les webhooks sont rendus dans la version de l'endpoint, pas celle du SDK
 * (bug du 01/10 : `new Date(undefined * 1000)` = date invalide → webhook en 500).
 */
export function subscriptionPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const raw = subscription as unknown as {
    current_period_end?: number;
    items?: { data?: Array<{ current_period_end?: number }> };
  };
  const seconds =
    raw.current_period_end ??
    raw.items?.data?.map((item) => item.current_period_end).find((v): v is number => typeof v === "number");
  return typeof seconds === "number" && Number.isFinite(seconds) ? new Date(seconds * 1000) : null;
}

/** Champ `currentPeriodEnd` à écrire, omis si Stripe ne le fournit pas (jamais de date invalide). */
export function periodEndData(subscription: Stripe.Subscription): { currentPeriodEnd?: Date } {
  const end = subscriptionPeriodEnd(subscription);
  return end ? { currentPeriodEnd: end } : {};
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

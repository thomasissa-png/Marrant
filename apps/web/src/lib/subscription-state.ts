/**
 * Lecture unique de l'état d'un abonnement en base, partagée par
 * GET /api/stripe/status (lot A) et GET /api/user/subscription (profil, lot B)
 * pour qu'ils disent toujours la même chose (audit s16, lot D) :
 * - impayé = statut PAST_DUE (Premium conservé pendant les relances Stripe) ;
 * - résiliation programmée = drapeau posé ET abonnement encore en cours. Après
 *   la fin réelle (CANCELED, INACTIVE), le drapeau resté en base ne compte plus.
 */
export type SubscriptionDbStatus = "ACTIVE" | "INACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING";

const EN_COURS: readonly SubscriptionDbStatus[] = ["ACTIVE", "PAST_DUE", "TRIALING"];

export function isSubscriptionLive(status: SubscriptionDbStatus | null | undefined): boolean {
  return status != null && EN_COURS.includes(status);
}

export function subscriptionFlags(
  sub: { status: SubscriptionDbStatus; cancelAtPeriodEnd: boolean } | null | undefined,
): { paymentIssue: boolean; cancelAtPeriodEnd: boolean } {
  if (!sub) return { paymentIssue: false, cancelAtPeriodEnd: false };
  return {
    paymentIssue: sub.status === "PAST_DUE",
    cancelAtPeriodEnd: isSubscriptionLive(sub.status) && sub.cancelAtPeriodEnd,
  };
}

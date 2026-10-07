/**
 * Compte utilisateur (s16, lot B) : résumé d'abonnement pour le profil
 * (reco 11) et suppression du compte (reco 5).
 *
 * Stripe n'est utilisé qu'en lecture (résumé) et pour la résiliation
 * immédiate et idempotente (`cancelStripeSubscriptionNow`, lot A).
 */
import { prisma } from "@/lib/prisma";
import { cancelStripeSubscriptionNow, getStripe } from "@/lib/stripe";
import { extractSubscriptionBilling, subscriptionPeriodEnd } from "@/lib/stripe-subscription";
import { isSubscriptionLive, subscriptionFlags } from "@/lib/subscription-state";

export type Formule = "monthly" | "annual";

export interface SubscriptionSummary {
  status: "ACTIVE" | "INACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING";
  formule: Formule | null;
  priceCents: number | null;
  /** Prochain prélèvement, ou fin d'accès si `cancelAtPeriodEnd` (ISO). */
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** Portail Stripe utilisable (client Stripe connu). */
  hasPortal: boolean;
  /** Abonnement Stripe identifié (parcours ciblés du portail possibles). */
  hasStripeSubscription: boolean;
}

/** Statuts Stripe qui facturent encore (à résilier avant suppression). */
const LIVE_STRIPE_STATUSES = ["active", "trialing", "past_due", "unpaid", "incomplete"];

function toFormule(interval: string | null): Formule | null {
  if (interval === "year") return "annual";
  if (interval === "month") return "monthly";
  return null;
}

/**
 * Résumé pour le profil. Base d'abord ; si la formule ou l'échéance manquent
 * (abonnement antérieur au webhook s14), lecture de l'abonnement chez Stripe.
 * Stripe indisponible → résumé partiel, jamais d'erreur.
 */
export async function getSubscriptionSummary(userId: string): Promise<SubscriptionSummary | null> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      status: true,
      billingInterval: true,
      priceAmountCents: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });
  if (!sub) return null;

  let interval = sub.billingInterval;
  let priceCents = sub.priceAmountCents;
  let periodEnd = sub.currentPeriodEnd;
  let cancelAtPeriodEnd = sub.cancelAtPeriodEnd;
  const live = isSubscriptionLive(sub.status);

  if (live && sub.stripeSubscriptionId && (!interval || priceCents === null || !periodEnd)) {
    try {
      const remote = await getStripe().subscriptions.retrieve(sub.stripeSubscriptionId);
      const billing = extractSubscriptionBilling(remote);
      interval = interval ?? billing.billingInterval;
      priceCents = priceCents ?? billing.priceAmountCents;
      periodEnd = periodEnd ?? subscriptionPeriodEnd(remote);
      cancelAtPeriodEnd = cancelAtPeriodEnd || billing.cancelAtPeriodEnd;
    } catch (err) {
      console.error(`[account] Lecture Stripe impossible (user ${userId}) :`, err);
    }
  }

  return {
    status: sub.status,
    formule: toFormule(interval),
    priceCents,
    currentPeriodEnd: periodEnd ? periodEnd.toISOString() : null,
    // Même règle que /api/stripe/status (lib/subscription-state, lot D).
    cancelAtPeriodEnd: subscriptionFlags({ status: sub.status, cancelAtPeriodEnd }).cancelAtPeriodEnd,
    hasPortal: Boolean(sub.stripeCustomerId),
    hasStripeSubscription: Boolean(sub.stripeSubscriptionId),
  };
}

/** Échec de résiliation Stripe : rien n'est supprimé (sinon prélèvements orphelins). */
export class StripeCancelError extends Error {
  constructor(cause: unknown) {
    super(`Résiliation Stripe impossible : ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = "StripeCancelError";
  }
}

/** Abonnements Stripe à résilier : celui connu en base + tout autre encore facturant chez ce client. */
async function stripeSubscriptionsToCancel(
  stripeSubscriptionId: string | null,
  stripeCustomerId: string | null,
): Promise<string[]> {
  const ids = new Set<string>();
  if (stripeSubscriptionId) ids.add(stripeSubscriptionId);
  if (stripeCustomerId) {
    const list = await getStripe().subscriptions.list({ customer: stripeCustomerId, status: "all", limit: 20 });
    for (const s of list.data) if (LIVE_STRIPE_STATUSES.includes(s.status)) ids.add(s.id);
  }
  return Array.from(ids);
}

/**
 * Suppression du compte : 1) résiliation immédiate chez Stripe (idempotente),
 * 2) effacement en base dans une transaction. Les relations en cascade
 * (comptes OAuth, sessions, favoris, likes, progression, abonnement, rappels,
 * jetons push, votes) partent avec l'utilisateur ; le reste est supprimé à la
 * main (jetons de réinitialisation, fiche prospect, newsletter).
 * Le client Stripe et ses factures restent chez Stripe (obligation comptable).
 */
export async function deleteAccount(userId: string): Promise<{ deleted: boolean; stripeCanceled: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      subscription: { select: { stripeSubscriptionId: true, stripeCustomerId: true } },
    },
  });
  if (!user) return { deleted: false, stripeCanceled: 0 };

  let stripeCanceled = 0;
  try {
    const ids = await stripeSubscriptionsToCancel(
      user.subscription?.stripeSubscriptionId ?? null,
      user.subscription?.stripeCustomerId ?? null,
    );
    for (const id of ids) {
      if ((await cancelStripeSubscriptionNow(id)) === "canceled") stripeCanceled++;
    }
  } catch (err) {
    throw new StripeCancelError(err);
  }

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier: user.email } }),
    prisma.ceoLead.deleteMany({ where: { OR: [{ userId }, { email: user.email }] } }),
    prisma.newsletterSubscriber.deleteMany({ where: { email: user.email } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return { deleted: true, stripeCanceled };
}

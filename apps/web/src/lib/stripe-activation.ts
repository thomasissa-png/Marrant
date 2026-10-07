/**
 * Activation Premium et rapprochements Stripe, partagés par le webhook et
 * verify-session (s16, 07/10/2026).
 */
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { extractSubscriptionBilling, periodEndData } from "@/lib/stripe-subscription";

/** Identifiant d'un champ Stripe « string | objet développé | null ». */
export function stripeId(value: unknown): string | null {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object" && typeof (value as { id?: unknown }).id === "string") {
    return (value as { id: string }).id;
  }
  return null;
}

/**
 * Abonnement d'une facture, quelle que soit la version d'API de l'événement :
 * jusqu'à acacia `invoice.subscription`, depuis basil
 * `invoice.parent.subscription_details.subscription` (endpoint en clover).
 */
export function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const raw = invoice as unknown as {
    subscription?: unknown;
    parent?: { subscription_details?: { subscription?: unknown } | null } | null;
  };
  return stripeId(raw.subscription) ?? stripeId(raw.parent?.subscription_details?.subscription);
}

/** Facture d'une charge (champ supprimé depuis basil : null dans ce cas). */
export function chargeInvoiceId(charge: Stripe.Charge): string | null {
  return stripeId((charge as unknown as { invoice?: unknown }).invoice);
}

/** Ligne d'abonnement en base pour une facture : par abonnement d'abord, client ensuite. */
export async function findDbSubscriptionForInvoice(invoice: Stripe.Invoice) {
  const subId = invoiceSubscriptionId(invoice);
  if (subId) {
    // Rapprochement exact : avec deux abonnements sur le même client, l'échec
    // de l'ancien ne touche jamais le nouveau.
    return prisma.subscription.findUnique({ where: { stripeSubscriptionId: subId } });
  }
  const customerId = stripeId(invoice.customer);
  if (!customerId) return null;
  return prisma.subscription.findUnique({ where: { stripeCustomerId: customerId } });
}

/** Passe l'utilisateur en Premium et enregistre l'abonnement (intervalle et montant réels compris). */
export async function activatePremium(input: {
  userId: string;
  customerId: string | null;
  subscription: Stripe.Subscription;
}): Promise<void> {
  const { userId, customerId, subscription } = input;
  const data = {
    plan: "PREMIUM" as const,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: "ACTIVE" as const,
    ...periodEndData(subscription),
    ...extractSubscriptionBilling(subscription),
  };
  // Transaction atomique : user.plan + subscription en une seule opération
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { plan: "PREMIUM" } }),
    prisma.subscription.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    }),
  ]);
}

export type CheckoutUserSource = "metadata" | "client-stripe" | "email";

/**
 * Utilisateur d'une session Checkout : `metadata.userId`, sinon le client
 * Stripe déjà connu en base, sinon l'e-mail saisi chez Stripe. null si introuvable.
 */
export async function resolveCheckoutUserId(
  session: Stripe.Checkout.Session
): Promise<{ userId: string; via: CheckoutUserSource } | null> {
  const fromMetadata = session.metadata?.userId;
  if (fromMetadata) return { userId: fromMetadata, via: "metadata" };

  const customerId = stripeId(session.customer);
  if (customerId) {
    const sub = await prisma.subscription.findUnique({
      where: { stripeCustomerId: customerId },
      select: { userId: true },
    });
    if (sub?.userId) return { userId: sub.userId, via: "client-stripe" };
  }

  const email = (session.customer_details?.email ?? session.customer_email ?? "").trim().toLowerCase();
  if (email) {
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    if (user?.id) return { userId: user.id, via: "email" };
  }
  return null;
}

import Stripe from "stripe";
import { sanitizeReturnTo } from "@/lib/premium-return";
import type { PremiumPlan } from "@/config/premium";
import { getPremiumPriceId, PREMIUM_PRICE_ENV } from "@/lib/premium-plan-availability";
import { TEXTES_CHECKOUT } from "@/config/textes/paiement";

// Client Stripe — singleton lazy (évite crash au build sans clé API)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
      // s16 : délai explicite (défaut SDK 80 s), un seul nouvel essai réseau.
      timeout: 10_000,
      maxNetworkRetries: 1,
    });
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/** Formule demandée mais prix Stripe absent : aucun repli sur une autre formule (503). */
export class PremiumPriceNotConfiguredError extends Error {
  constructor(public readonly plan: PremiumPlan) {
    super(`Prix Stripe non configuré pour la formule ${plan} (${PREMIUM_PRICE_ENV[plan]})`);
    this.name = "PremiumPriceNotConfiguredError";
  }
}

// Prix de l'abonnement premium mensuel (lu au chargement, conservé pour compatibilité :
// le checkout lit désormais le prix au runtime via getPremiumPriceId)
export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID ?? "";

// Montant de l'abonnement premium en centimes (2,99 €)
export const PREMIUM_PRICE_CENTS = parseInt(process.env.STRIPE_PREMIUM_PRICE_CENTS ?? "299", 10);

/**
 * s16 (07/10/2026) : refus d'un second abonnement. Un utilisateur dont
 * l'abonnement est actif, en essai ou en impayé (Stripe relance encore) ne
 * peut pas relancer un checkout : il passe par le portail (changer de carte,
 * de formule). Sans ce garde, un impayé suivi d'un ré-abonnement crée deux
 * prélèvements le jour où l'ancienne carte repasse.
 */
export const BLOCKING_DB_STATUSES = ["ACTIVE", "TRIALING", "PAST_DUE"] as const;
export const BLOCKING_STRIPE_STATUSES = ["active", "trialing", "past_due"] as const;

export class AlreadySubscribedError extends Error {
  constructor(public readonly status: string) {
    super(`Abonnement déjà en cours (${status})`);
    this.name = "AlreadySubscribedError";
  }
}

/**
 * Récupère ou crée un client Stripe pour l'utilisateur.
 * Évite les doublons en réutilisant le stripeCustomerId existant.
 */
async function getOrCreateStripeCustomer(
  userId: string,
  customerEmail: string,
  knownCustomerId: string | null
): Promise<string | null> {
  if (knownCustomerId) return knownCustomerId;

  try {
    // Chercher un customer Stripe existant par email
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0].id;
    }

    // Créer un nouveau customer Stripe
    const customer = await stripe.customers.create({
      email: customerEmail,
      metadata: { userId },
    });

    return customer.id;
  } catch (err) {
    console.error("[Stripe] Erreur getOrCreateStripeCustomer:", err);
    return null;
  }
}

/** Ligne d'abonnement en base (null si absente ou base illisible : le contrôle Stripe prend le relais). */
async function readDbSubscription(userId: string): Promise<{ status: string; stripeCustomerId: string | null } | null> {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.subscription.findUnique({
      where: { userId },
      select: { status: true, stripeCustomerId: true },
    });
  } catch {
    return null;
  }
}

/** Lève AlreadySubscribedError si le client Stripe a déjà un abonnement en cours. */
async function assertNoStripeSubscription(customerId: string): Promise<void> {
  let subs: Stripe.ApiList<Stripe.Subscription>;
  try {
    subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 20 });
  } catch (err) {
    // Contrôle impossible : on ne bloque pas le paiement (la base a déjà été lue).
    console.error("[Stripe] Contrôle des abonnements existants impossible :", err);
    return;
  }
  const enCours = subs.data.find((s) => (BLOCKING_STRIPE_STATUSES as readonly string[]).includes(s.status));
  if (enCours) throw new AlreadySubscribedError(enCours.status);
}

/** Case « J'accepte les CGU » de Stripe : activée seulement si l'URL des CGU est déclarée chez Stripe. */
export function isCheckoutTermsConsentEnabled(): boolean {
  return process.env.STRIPE_CHECKOUT_CGU_CONSENT === "true";
}

function isTermsConsentConfigError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /terms of service/i.test(message);
}

/**
 * Crée une session de paiement Stripe Checkout
 */
export async function createCheckoutSession(
  userId: string,
  customerEmail: string,
  /** Intention d'origine (chemin interne), relayée jusqu'à /abonnement/success. */
  rawReturnTo?: string | null,
  plan: PremiumPlan = "monthly"
): Promise<string> {
  // Vérifié AVANT toute création de customer : une formule sans prix configuré
  // est refusée, jamais remplacée en silence par une autre.
  const priceId = getPremiumPriceId(plan);
  if (!priceId) throw new PremiumPriceNotConfiguredError(plan);

  const dbSub = await readDbSubscription(userId);
  if (dbSub && (BLOCKING_DB_STATUSES as readonly string[]).includes(dbSub.status)) {
    throw new AlreadySubscribedError(dbSub.status);
  }

  const returnTo = sanitizeReturnTo(rawReturnTo);
  const returnQuery = returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : "";
  const customerId = await getOrCreateStripeCustomer(userId, customerEmail, dbSub?.stripeCustomerId ?? null);
  if (customerId) await assertNoStripeSubscription(customerId);

  // Si on a un customer Stripe existant, on l'utilise directement.
  // Sinon, on fallback sur customer_email (Stripe créera le customer automatiquement).
  const customerParams = customerId
    ? { customer: customerId }
    : { customer_email: customerEmail };

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    ...customerParams,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    locale: "fr",
    custom_text: { submit: { message: TEXTES_CHECKOUT.stripeSubmit } },
    // `formule=annuel` (annuel seulement) : mesure Umami abonnement-reussi sur la page de retour.
    success_url: `${process.env.NEXTAUTH_URL}/abonnement/success?session_id={CHECKOUT_SESSION_ID}${returnQuery}${plan === "annual" ? "&formule=annuel" : ""}`,
    // `paiement=annule` : message de retour (lot C) ; `upgrade=cancel` conservé pour l'événement Umami abonnement-annule.
    cancel_url: `${process.env.NEXTAUTH_URL}/abonnement?paiement=annule&upgrade=cancel${returnQuery}`,
    metadata: {
      userId,
      plan,
    },
    subscription_data: { metadata: { userId, plan } },
  };

  let session: Stripe.Checkout.Session;
  if (isCheckoutTermsConsentEnabled()) {
    try {
      session = await stripe.checkout.sessions.create({
        ...params,
        consent_collection: { terms_of_service: "required" },
      });
    } catch (err) {
      if (!isTermsConsentConfigError(err)) throw err;
      // URL des CGU absente des réglages Stripe : on ne casse pas le paiement.
      const { recordAdminAlert, CLES_TUNNEL } = await import("@/lib/admin-alerts");
      await recordAdminAlert({
        cle: CLES_TUNNEL.checkoutCgu,
        sujet: "Checkout sans case CGU : URL des CGU absente des réglages Stripe",
        html: `<p>Stripe refuse consent_collection.terms_of_service. Déclare l'URL https://deviens-marrant.fr/cgu dans Stripe (Paramètres, Informations publiques) ou retire STRIPE_CHECKOUT_CGU_CONSENT.</p><p>${err instanceof Error ? err.message : String(err)}</p>`,
      });
      session = await stripe.checkout.sessions.create(params);
    }
  } else {
    session = await stripe.checkout.sessions.create(params);
  }

  return session.url ?? "";
}

/**
 * Résiliation immédiate et idempotente (remboursement 14 jours, s16) : un
 * abonnement déjà résilié ou introuvable n'est pas une erreur.
 */
export async function cancelStripeSubscriptionNow(
  subscriptionId: string
): Promise<"canceled" | "already-canceled"> {
  try {
    const current = await stripe.subscriptions.retrieve(subscriptionId);
    if (current.status === "canceled" || current.status === "incomplete_expired") {
      return "already-canceled";
    }
    await stripe.subscriptions.cancel(subscriptionId);
    return "canceled";
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e?.code === "resource_missing" || /already been canceled|No such subscription/i.test(e?.message ?? "")) {
      return "already-canceled";
    }
    throw err;
  }
}

/**
 * Crée un portail client Stripe pour gérer l'abonnement
 */
export async function createPortalSession(
  stripeCustomerId: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/profil`,
  });

  return session.url;
}

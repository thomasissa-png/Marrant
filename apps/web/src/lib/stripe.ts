import Stripe from "stripe";
import type { PremiumPlan } from "@/lib/premium-plans";

// Client Stripe — singleton lazy (évite crash au build sans clé API)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
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

// Prix de l'abonnement premium mensuel (conservé pour compatibilité, préférer getPremiumPriceId)
export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID ?? "";

/** Secret Worker portant l'id du prix Stripe de chaque formule. */
export const PREMIUM_PRICE_ENV: Record<PremiumPlan, string> = {
  monthly: "STRIPE_PREMIUM_PRICE_ID",
  annual: "STRIPE_PREMIUM_ANNUAL_PRICE_ID",
};

/** Formule demandée mais prix Stripe absent ou placeholder : aucun repli sur une autre formule. */
export class PremiumPriceNotConfiguredError extends Error {
  constructor(public readonly plan: PremiumPlan) {
    super(`Prix Stripe non configuré pour la formule ${plan} (${PREMIUM_PRICE_ENV[plan]})`);
    this.name = "PremiumPriceNotConfiguredError";
  }
}

/**
 * Id du prix Stripe de la formule, lu au runtime (secret Worker posé au déploiement).
 * Placeholder (.env.example « price_XXXX… ») ou valeur vide → null.
 */
export function getPremiumPriceId(plan: PremiumPlan): string | null {
  const id = (process.env[PREMIUM_PRICE_ENV[plan]] ?? "").trim();
  if (!id.startsWith("price_") || /X{4,}/.test(id)) return null;
  return id;
}

// Montant de l'abonnement premium en centimes (4,99 €)
export const PREMIUM_PRICE_CENTS = parseInt(process.env.STRIPE_PREMIUM_PRICE_CENTS ?? "499", 10);

/**
 * Récupère ou crée un client Stripe pour l'utilisateur.
 * Évite les doublons en réutilisant le stripeCustomerId existant.
 */
async function getOrCreateStripeCustomer(
  userId: string,
  customerEmail: string
): Promise<string | null> {
  try {
    // Vérifier si l'utilisateur a déjà un customer Stripe via sa subscription
    const { prisma } = await import("@/lib/prisma");

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { stripeCustomerId: true },
    });

    if (subscription?.stripeCustomerId) {
      return subscription.stripeCustomerId;
    }
  } catch {
    // Pas de subscription en DB — on continue
  }

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

/**
 * Crée une session de paiement Stripe Checkout
 */
export async function createCheckoutSession(
  userId: string,
  customerEmail: string,
  plan: PremiumPlan = "monthly"
): Promise<string> {
  // Vérifié AVANT toute création de customer : l'annuel sans prix configuré est refusé,
  // jamais remplacé en silence par le mensuel.
  const priceId = getPremiumPriceId(plan);
  if (!priceId) throw new PremiumPriceNotConfiguredError(plan);

  const customerId = await getOrCreateStripeCustomer(userId, customerEmail);

  // Si on a un customer Stripe existant, on l'utilise directement.
  // Sinon, on fallback sur customer_email (Stripe créera le customer automatiquement).
  const customerParams = customerId
    ? { customer: customerId }
    : { customer_email: customerEmail };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    ...customerParams,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/abonnement/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/abonnement?upgrade=cancel`,
    metadata: {
      userId,
      plan,
    },
  });

  return session.url ?? "";
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

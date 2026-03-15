import Stripe from "stripe";

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

// Prix de l'abonnement premium
export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID ?? "";

// Montant offre de lancement en centimes
export const PREMIUM_PRICE_CENTS = parseInt(process.env.STRIPE_PREMIUM_PRICE_CENTS ?? "99", 10);

/**
 * Crée une session de paiement Stripe Checkout
 */
export async function createCheckoutSession(
  userId: string,
  customerEmail: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: [
      {
        price: PREMIUM_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/profil?upgrade=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/profil?upgrade=cancel`,
    metadata: {
      userId,
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

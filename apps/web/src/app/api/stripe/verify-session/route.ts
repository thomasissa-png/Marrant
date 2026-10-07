import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { activatePremium, stripeId } from "@/lib/stripe-activation";

/**
 * POST /api/stripe/verify-session
 * Vérifie une checkout session Stripe et active le premium si le paiement est confirmé.
 * Appelé par la page de succès quand le webhook n'a pas encore traité l'événement.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }

  const { sessionId } = body;
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "sessionId requis" }, { status: 400 });
  }

  try {
    // Vérifier d'abord si l'utilisateur est déjà PREMIUM (webhook déjà passé)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (user?.plan === "PREMIUM") {
      return NextResponse.json({ plan: "PREMIUM", activated: false });
    }

    // Récupérer la checkout session depuis Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Vérifier que cette session appartient bien à cet utilisateur
    if (checkoutSession.metadata?.userId !== userId) {
      return NextResponse.json({ error: "Session non autorisée" }, { status: 403 });
    }

    // Vérifier que le paiement est bien complété
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ plan: "FREE", activated: false, paymentStatus: checkoutSession.payment_status });
    }

    // Récupérer la subscription Stripe
    const subscriptionId = stripeId(checkoutSession.subscription);
    if (!subscriptionId) {
      return NextResponse.json({ error: "Pas de subscription associée" }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Activer le premium : même écriture que le webhook (intervalle, montant,
    // fin de période et résiliation programmée compris, s16).
    await activatePremium({ userId, customerId: stripeId(checkoutSession.customer), subscription });

    console.log(`[Stripe verify-session] User ${userId} activated to PREMIUM via direct verification`);

    return NextResponse.json({ plan: "PREMIUM", activated: true });
  } catch (error) {
    console.error("[Stripe verify-session] Erreur:", error);
    return NextResponse.json({ error: "Erreur de vérification" }, { status: 500 });
  }
}

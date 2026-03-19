import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !(session.user as { id?: string }).id) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    // Rate limit : 5 créations de checkout par utilisateur par heure
    const rl = rateLimit(`checkout:${userId}`, { maxRequests: 5, windowMs: 3600_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaie plus tard." },
        { status: 429 }
      );
    }
    const checkoutUrl = await createCheckoutSession(userId, session.user.email);

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Impossible de créer la session de paiement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[API /stripe/checkout]", message, error);

    // Messages d'erreur explicites selon le type
    if (message.includes("No such price") || message.includes("price")) {
      return NextResponse.json(
        { error: "Configuration Stripe incomplète : STRIPE_PREMIUM_PRICE_ID manquant ou invalide" },
        { status: 500 }
      );
    }
    if (message.includes("Invalid API Key") || message.includes("api_key")) {
      return NextResponse.json(
        { error: "Configuration Stripe incomplète : STRIPE_SECRET_KEY manquant ou invalide" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du paiement. Réessaie ou contacte le support." },
      { status: 500 }
    );
  }
}

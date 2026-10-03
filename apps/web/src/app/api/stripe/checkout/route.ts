import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

/** Corps facultatif : intention d'origine, revalidée dans createCheckoutSession (chemin interne). */
const bodySchema = z.object({ returnTo: z.string().max(512).optional() });

async function readReturnTo(request: Request): Promise<string | undefined> {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    return parsed.success ? parsed.data.returnTo : undefined;
  } catch {
    return undefined; // corps absent ou non JSON : paiement sans retour mémorisé
  }
}

export async function POST(request: Request) {
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
    const returnTo = await readReturnTo(request);
    const checkoutUrl = await createCheckoutSession(userId, session.user.email, returnTo);

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

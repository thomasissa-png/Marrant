import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlreadySubscribedError, createCheckoutSession, PremiumPriceNotConfiguredError } from "@/lib/stripe";
import { TEXTES_CHECKOUT } from "@/config/textes/paiement";
import { rateLimit } from "@/lib/rate-limit";
import { PREMIUM_PLANS, type PremiumPlan } from "@/config/premium";
import { z } from "zod";

/**
 * Corps facultatif :
 * - `returnTo` : intention d'origine, revalidée dans createCheckoutSession (chemin interne) ;
 * - `plan` : "monthly" (défaut, appels historiques sans corps) ou "annual".
 */
const returnToSchema = z.string().max(512).optional();
const planSchema = z.enum(PREMIUM_PLANS).default("monthly");

type CheckoutBody =
  | { ok: true; plan: PremiumPlan; returnTo?: string }
  | { ok: false };

async function readBody(request: Request): Promise<CheckoutBody> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: true, plan: "monthly" }; // corps absent ou non JSON : mensuel, sans retour mémorisé
  }
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const plan = planSchema.safeParse(obj.plan);
  if (!plan.success) return { ok: false }; // formule inconnue : jamais de repli silencieux
  const returnTo = returnToSchema.safeParse(obj.returnTo);
  return { ok: true, plan: plan.data, returnTo: returnTo.success ? returnTo.data : undefined };
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
    const body = await readBody(request);
    if (!body.ok) {
      return NextResponse.json(
        { error: "Formule inconnue : choisis l'abonnement mensuel ou annuel." },
        { status: 400 }
      );
    }
    const checkoutUrl = await createCheckoutSession(userId, session.user.email, body.returnTo, body.plan);

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Impossible de créer la session de paiement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    // s16 : abonnement déjà actif, en essai ou en impayé → jamais de second
    // abonnement (risque de double prélèvement) ; le client passe par le portail.
    if (error instanceof AlreadySubscribedError) {
      const impaye = error.status === "PAST_DUE" || error.status === "past_due";
      return NextResponse.json(
        {
          error: impaye ? TEXTES_CHECKOUT.impaye : TEXTES_CHECKOUT.dejaAbonne,
          code: impaye ? "paiement-en-retard" : "deja-abonne",
          portal: true,
        },
        { status: 409 }
      );
    }
    if (error instanceof PremiumPriceNotConfiguredError) {
      console.error("[API /stripe/checkout]", error.message);
      return NextResponse.json(
        {
          error:
            error.plan === "annual"
              ? "L'abonnement annuel n'est pas encore disponible. Choisis le mensuel ou réessaie plus tard."
              : "Le paiement est indisponible pour le moment. Réessaie dans un instant.",
        },
        { status: 503 }
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error("[API /stripe/checkout]", message, error);

    // Configuration Stripe cassée (prix ou clé) : détail dans les journaux,
    // jamais le nom d'une variable d'environnement côté client (s16).
    if (message.includes("No such price") || message.includes("price") || message.includes("Invalid API Key") || message.includes("api_key")) {
      return NextResponse.json(
        { error: "Le paiement est indisponible pour le moment. Réessaie dans un instant." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du paiement. Réessaie ou contacte le support." },
      { status: 500 }
    );
  }
}

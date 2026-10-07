import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { TEXTES_PORTAIL } from "@/config/textes/paiement";
import { refuserSiAutreSite } from "@/lib/same-site";

/**
 * POST /api/stripe/portal : portail client Stripe (carte, formule, résiliation).
 * s16 : ouvert à TOUT compte qui a un client Stripe, quel que soit son plan ou
 * le statut de l'abonnement (impayé PAST_DUE compris : c'est là qu'on change
 * de carte). Aucune condition sur `User.plan`.
 */
export async function POST(request: Request) {
  const refus = refuserSiAutreSite(request, "POST /api/stripe/portal");
  if (refus) return refus;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: TEXTES_PORTAIL.connexion }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { stripeCustomerId: true },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: TEXTES_PORTAIL.aucunAbonnement }, { status: 404 });
    }

    const portalUrl = await createPortalSession(subscription.stripeCustomerId);
    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("[API /stripe/portal]", error);
    return NextResponse.json({ error: TEXTES_PORTAIL.indisponible }, { status: 500 });
  }
}

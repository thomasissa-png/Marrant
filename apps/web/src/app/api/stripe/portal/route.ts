import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { stripeCustomerId: true },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: "Aucun abonnement trouvé" }, { status: 404 });
    }

    const portalUrl = await createPortalSession(subscription.stripeCustomerId);
    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("[API /stripe/portal]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

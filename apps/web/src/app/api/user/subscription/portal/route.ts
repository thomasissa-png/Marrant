import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type Stripe from "stripe";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPortalSession, getStripe } from "@/lib/stripe";
import { refuserSiAutreSite } from "@/lib/same-site";
import { TEXTES_ABONNEMENT, TEXTES_API } from "@/config/textes/compte";

const bodySchema = z.object({ parcours: z.enum(["changer-formule", "resilier", "carte"]) });
type Parcours = z.infer<typeof bodySchema>["parcours"];

function flowData(parcours: Parcours, subscription: string | null, returnUrl: string) {
  const after_completion = { type: "redirect" as const, redirect: { return_url: returnUrl } };
  if (parcours === "carte") return { type: "payment_method_update" as const, after_completion };
  if (!subscription) return null;
  if (parcours === "resilier") {
    return { type: "subscription_cancel" as const, subscription_cancel: { subscription }, after_completion };
  }
  return { type: "subscription_update" as const, subscription_update: { subscription }, after_completion };
}

/**
 * POST /api/user/subscription/portal { parcours } (s16, reco 11) : lien de
 * portail Stripe ciblé (changer de formule, résilier, mettre à jour la carte).
 * Si le portail refuse le parcours (option non activée dans sa configuration,
 * résiliation déjà programmée…), repli sur le portail simple.
 */
export async function POST(request: Request) {
  const refus = refuserSiAutreSite(request, "POST /api/user/subscription/portal");
  if (refus) return refus;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: TEXTES_API.nonConnecte }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: TEXTES_API.donneesInvalides }, { status: 400 });
  }

  try {
    const sub = await prisma.subscription.findUnique({
      where: { userId },
      select: { stripeCustomerId: true, stripeSubscriptionId: true },
    });
    if (!sub?.stripeCustomerId) {
      return NextResponse.json({ error: TEXTES_ABONNEMENT.portailIndisponible }, { status: 404 });
    }

    const returnUrl = `${process.env.NEXTAUTH_URL}/profil`;
    const flow = flowData(parsed.data.parcours, sub.stripeSubscriptionId, returnUrl);
    if (flow) {
      try {
        const portal = await getStripe().billingPortal.sessions.create({
          customer: sub.stripeCustomerId,
          return_url: returnUrl,
          flow_data: flow as Stripe.BillingPortal.SessionCreateParams.FlowData,
        });
        return NextResponse.json({ url: portal.url, cible: true });
      } catch (err) {
        console.warn(`[API /user/subscription/portal] Parcours ${parsed.data.parcours} refusé, portail simple :`, err);
      }
    }
    return NextResponse.json({ url: await createPortalSession(sub.stripeCustomerId), cible: false });
  } catch (error) {
    console.error("[API /user/subscription/portal]", error);
    return NextResponse.json({ error: TEXTES_ABONNEMENT.portailIndisponible }, { status: 500 });
  }
}

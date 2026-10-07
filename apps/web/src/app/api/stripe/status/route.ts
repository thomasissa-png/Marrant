import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subscriptionFlags } from "@/lib/subscription-state";

/**
 * GET /api/stripe/status : plan et état de l'abonnement de l'utilisateur connecté.
 *
 * Champs (s16, lus par /abonnement/success et /profil) :
 * - `plan` : "FREE" | "PREMIUM" (inchangé, compatible avec les appels existants) ;
 * - `subscriptionStatus` : "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING" | "INACTIVE" | null ;
 * - `paymentIssue` : true si impayé en cours (Premium conservé pendant les relances Stripe) ;
 * - `portalAvailable` : true dès qu'un client Stripe existe (bouton portail à afficher) ;
 * - `billingInterval` ("month" | "year" | null), `priceAmountCents`,
 *   `currentPeriodEnd` (ISO, prochain prélèvement ou fin d'accès),
 *   `cancelAtPeriodEnd` (résiliation programmée : l'accès court jusqu'à `currentPeriodEnd`).
 * `paymentIssue` et `cancelAtPeriodEnd` viennent de `subscriptionFlags`, comme
 * le profil (/api/user/subscription) : un abonnement terminé n'est jamais
 * « résiliation programmée » (lot D).
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const [user, sub] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { plan: true } }),
    prisma.subscription.findUnique({
      where: { userId },
      select: {
        status: true,
        stripeCustomerId: true,
        billingInterval: true,
        priceAmountCents: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
      },
    }),
  ]);

  const flags = subscriptionFlags(sub);
  return NextResponse.json({
    plan: user?.plan ?? "FREE",
    subscriptionStatus: sub?.status ?? null,
    paymentIssue: flags.paymentIssue,
    portalAvailable: Boolean(sub?.stripeCustomerId),
    billingInterval: sub?.billingInterval ?? null,
    priceAmountCents: sub?.priceAmountCents ?? null,
    currentPeriodEnd: sub?.currentPeriodEnd ? sub.currentPeriodEnd.toISOString() : null,
    cancelAtPeriodEnd: flags.cancelAtPeriodEnd,
  });
}

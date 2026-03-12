import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Déduplication en mémoire — empêche le traitement en double d'un même événement
const processedEvents = new Map<string, number>();
const DEDUP_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Nettoyage périodique
setInterval(() => {
  const now = Date.now();
  processedEvents.forEach((ts, key) => {
    if (now - ts > DEDUP_TTL_MS) processedEvents.delete(key);
  });
}, 60 * 1000);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (error) {
    console.error("[Stripe Webhook] Signature invalide:", error);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  // Déduplication : ignorer les événements déjà traités
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, deduplicated: true });
  }
  processedEvents.set(event.id, Date.now());

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Mettre à jour le user en PREMIUM
        await prisma.user.update({
          where: { id: userId },
          data: { plan: "PREMIUM" },
        });

        // Créer ou mettre à jour l'abonnement
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: "PREMIUM",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            status: "ACTIVE",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          update: {
            plan: "PREMIUM",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            status: "ACTIVE",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`[Stripe] User ${userId} upgraded to PREMIUM`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (sub) {
          const statusMap: Record<string, "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING" | "INACTIVE"> = {
            active: "ACTIVE",
            past_due: "PAST_DUE",
            canceled: "CANCELED",
            trialing: "TRIALING",
            unpaid: "INACTIVE",
          };

          await prisma.subscription.update({
            where: { id: sub.id },
            data: {
              status: statusMap[subscription.status] ?? "INACTIVE",
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });

          // Si annulé ou impayé, rétrograder en FREE
          if (["canceled", "unpaid"].includes(subscription.status)) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { plan: "FREE" },
            });
            console.log(`[Stripe] User ${sub.userId} downgraded to FREE`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: "CANCELED" },
          });
          await prisma.user.update({
            where: { id: sub.userId },
            data: { plan: "FREE" },
          });
          console.log(`[Stripe] Subscription deleted for user ${sub.userId}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const sub = await prisma.subscription.findUnique({
          where: { stripeCustomerId: invoice.customer as string },
        });

        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: "PAST_DUE" },
          });
          console.log(`[Stripe] Payment failed for user ${sub.userId}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Erreur traitement:", error);
    return NextResponse.json({ error: "Erreur traitement webhook" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET non configuré");
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 500 });
  }

  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("[Stripe Webhook] Signature invalide:", error);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  // Déduplication — ignorer les événements déjà traités
  const existing = await prisma.webhookEvent.findUnique({ where: { id: event.id } });
  if (existing) {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        let subscription: Stripe.Subscription;
        try {
          subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
        } catch (error) {
          console.error(`[Stripe] Erreur récupération subscription pour user ${userId}:`, error);
          break;
        }

        // Transaction atomique : user.plan + subscription en une seule opération
        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { plan: "PREMIUM" },
          }),
          prisma.subscription.upsert({
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
          }),
        ]);

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

          const newStatus = statusMap[subscription.status] ?? "INACTIVE";
          const shouldDowngrade = ["canceled", "unpaid"].includes(subscription.status);
          const shouldUpgrade = subscription.status === "active";

          // Transaction atomique : subscription + user.plan
          const planUpdate = shouldDowngrade
            ? { plan: "FREE" as const }
            : shouldUpgrade
              ? { plan: "PREMIUM" as const }
              : null;

          await prisma.$transaction([
            prisma.subscription.update({
              where: { id: sub.id },
              data: {
                status: newStatus,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            }),
            ...(planUpdate
              ? [prisma.user.update({
                  where: { id: sub.userId },
                  data: planUpdate,
                })]
              : []),
          ]);

          if (shouldDowngrade) {
            console.log(`[Stripe] User ${sub.userId} downgraded to FREE`);
          } else if (shouldUpgrade) {
            console.log(`[Stripe] User ${sub.userId} upgraded to PREMIUM`);
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
          // Transaction atomique
          await prisma.$transaction([
            prisma.subscription.update({
              where: { id: sub.id },
              data: { status: "CANCELED" },
            }),
            prisma.user.update({
              where: { id: sub.userId },
              data: { plan: "FREE" },
            }),
          ]);
          console.log(`[Stripe] Subscription deleted for user ${sub.userId}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

        if (customerId) {
          const sub = await prisma.subscription.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (sub) {
            await prisma.$transaction([
              prisma.subscription.update({
                where: { id: sub.id },
                data: { status: "PAST_DUE" },
              }),
              prisma.user.update({
                where: { id: sub.userId },
                data: { plan: "FREE" },
              }),
            ]);
            console.log(`[Stripe] Payment failed for user ${sub.userId}, downgraded to FREE`);
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

        if (customerId) {
          const sub = await prisma.subscription.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (sub) {
            // Mettre à jour le statut ET la période courante
            const periodEnd = invoice.lines?.data?.[0]?.period?.end;
            await prisma.$transaction([
              prisma.subscription.update({
                where: { id: sub.id },
                data: {
                  status: "ACTIVE",
                  ...(periodEnd ? { currentPeriodEnd: new Date(periodEnd * 1000) } : {}),
                },
              }),
              prisma.user.update({
                where: { id: sub.userId },
                data: { plan: "PREMIUM" },
              }),
            ]);
            console.log(`[Stripe] Payment succeeded for user ${sub.userId}`);
          }
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const customerId = typeof charge.customer === "string"
          ? charge.customer
          : charge.customer?.id;

        if (!customerId) break;

        // Vérifier si c'est un remboursement total
        const isFullRefund = charge.refunded;

        if (isFullRefund) {
          const sub = await prisma.subscription.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (sub) {
            await prisma.$transaction([
              prisma.subscription.update({
                where: { id: sub.id },
                data: { status: "CANCELED" },
              }),
              prisma.user.update({
                where: { id: sub.userId },
                data: { plan: "FREE" },
              }),
            ]);
            console.log(`[Stripe] Full refund, user ${sub.userId} downgraded to FREE`);
          }
        } else {
          console.log(`[Stripe] Partial refund for customer ${customerId} — no plan change`);
        }
        break;
      }
    }

    // Enregistrer l'événement APRÈS traitement réussi (pas avant)
    await prisma.webhookEvent.create({ data: { id: event.id } });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Erreur traitement:", error);
    // Ne PAS enregistrer le dedup — l'événement sera retenté par Stripe
    return NextResponse.json({ error: "Erreur traitement webhook" }, { status: 500 });
  }
}

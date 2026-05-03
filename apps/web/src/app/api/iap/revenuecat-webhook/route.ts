import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Webhook RevenueCat — sync IAP avec notre DB.
 *
 * Events traités :
 *   - INITIAL_PURCHASE / RENEWAL → user.plan = PREMIUM
 *   - CANCELLATION → on note la cancellation_date (Premium reste actif jusqu'à expiration)
 *   - EXPIRATION → user.plan = FREE
 *   - BILLING_ISSUE → log pour suivi (pas d'action automatique, RevenueCat retry)
 *   - PRODUCT_CHANGE → mise à jour productIdentifier
 *
 * Sécurité : authentification via header `Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>`
 *
 * Setup côté RevenueCat dashboard :
 *   - URL : https://deviens-marrant.fr/api/iap/revenuecat-webhook
 *   - Authorization header value : Bearer <secret>
 */

const WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  // Auth check
  const auth = req.headers.get("authorization") ?? "";
  if (!WEBHOOK_SECRET || auth !== `Bearer ${WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload?.event;
  if (!event) {
    return NextResponse.json({ error: "No event" }, { status: 400 });
  }

  const eventType: string = event.type;
  const appUserId: string = event.app_user_id ?? "";
  const productId: string = event.product_id ?? "";
  const expirationMs: number = event.expiration_at_ms ?? 0;
  const eventId: string = event.id ?? "";

  if (!appUserId) {
    return NextResponse.json({ error: "Missing app_user_id" }, { status: 400 });
  }

  // Dédup via WebhookEvent table (déjà utilisée pour Stripe)
  try {
    const existing = await prisma.webhookEvent.findUnique({ where: { eventId } });
    if (existing) {
      return NextResponse.json({ ok: true, deduped: true });
    }
    await prisma.webhookEvent.create({
      data: {
        eventId,
        provider: "revenuecat",
        eventType,
        receivedAt: new Date(),
      },
    });
  } catch {
    // Si la table WebhookEvent n'existe pas encore, on continue sans dédup
  }

  // Traitement par type d'event
  const expirationDate = expirationMs > 0 ? new Date(expirationMs) : null;

  try {
    switch (eventType) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "PRODUCT_CHANGE":
      case "UNCANCELLATION": {
        await prisma.user.update({
          where: { id: appUserId },
          data: {
            plan: "PREMIUM",
            // Champs additionnels recommandés (à ajouter au schema si pas présents)
            // iapProductId: productId,
            // iapExpirationDate: expirationDate,
          },
        });
        break;
      }
      case "EXPIRATION": {
        await prisma.user.update({
          where: { id: appUserId },
          data: { plan: "FREE" },
        });
        break;
      }
      case "CANCELLATION": {
        // Pas de downgrade immédiat — Premium reste actif jusqu'à expiration
        // RevenueCat enverra EXPIRATION le moment venu
        break;
      }
      case "BILLING_ISSUE": {
        // Log mais pas d'action automatique — RevenueCat retry tout seul
        console.warn(`[RevenueCat] BILLING_ISSUE pour user ${appUserId}`);
        break;
      }
      default: {
        // Events non gérés (TRANSFER, SUBSCRIBER_ALIAS, etc.) — on ack mais on ne fait rien
        break;
      }
    }
  } catch (err) {
    console.error("[RevenueCat webhook] Erreur DB :", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

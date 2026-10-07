import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, cancelStripeSubscriptionNow } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { extractSubscriptionBilling, periodEndData, subscriptionPeriodEnd } from "@/lib/stripe-subscription";
import {
  activatePremium,
  findDbSubscriptionForInvoice,
  invoiceSubscriptionId,
  resolveCheckoutUserId,
  stripeId,
} from "@/lib/stripe-activation";
import { CLES_TUNNEL, recordAdminAlert } from "@/lib/admin-alerts";
import {
  notifyCancellationScheduled,
  notifyPaymentFailed,
  notifySubscriptionConfirmed,
} from "@/lib/emails/paiement-notifications";
import Stripe from "stripe";

// Formule annuelle (s14, 04/10/2026) : aucun traitement ne dépend du prix ni de
// l'intervalle. Mensuel, annuel et anciens prix de lancement suivent exactement
// le même chemin ; l'intervalle et le montant réels sont seulement recopiés en base.
//
// s16 (07/10/2026) :
// - un paiement dont l'activation échoue n'est JAMAIS enregistré comme traité :
//   réponse 500 (Stripe réessaie pendant 3 jours) + alerte A ;
// - impayé : statut PAST_DUE, Premium CONSERVÉ pendant les relances Stripe ;
//   rétrogradation seulement à `deleted` / `unpaid` / `canceled` / `incomplete_expired` ;
// - remboursement total : l'abonnement Stripe est aussi résilié (idempotent) ;
// - e-mails : confirmation d'abonnement, paiement refusé, résiliation programmée.

const STATUS_MAP: Record<string, "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING" | "INACTIVE"> = {
  active: "ACTIVE",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  trialing: "TRIALING",
  unpaid: "INACTIVE",
  incomplete: "INACTIVE",
  incomplete_expired: "INACTIVE",
  paused: "INACTIVE",
};
const DOWNGRADE_STATUSES = ["canceled", "unpaid", "incomplete_expired"];
const UPGRADE_STATUSES = ["active", "trialing"];

/** Erreur qui doit faire rejouer l'événement ET lever une alerte précise. */
class RetryableWebhookError extends Error {
  constructor(public readonly cle: string, public readonly sujet: string, detail: string) {
    super(detail);
    this.name = "RetryableWebhookError";
  }
}

function messageDe(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Prisma P2025 : ligne à mettre à jour introuvable (ex. compte supprimé). */
function estEnregistrementAbsent(err: unknown): boolean {
  return (err as { code?: unknown })?.code === "P2025";
}

/**
 * E-mail de confirmation : une seule fois par abonnement, même si l'événement
 * est livré deux fois en parallèle ou retraité. Marqueur = ligne `WebhookEvent`
 * à identifiant unique (aucune migration). Base indisponible : on envoie quand
 * même (mieux vaut un doublon qu'aucune confirmation).
 */
async function reserverEmailConfirmation(subscriptionId: string): Promise<boolean> {
  try {
    await prisma.webhookEvent.create({
      data: { eventId: `email-confirmation:${subscriptionId}`, provider: "interne", eventType: "email.confirmation-abonnement", receivedAt: new Date() },
    });
    return true;
  } catch (err) {
    if ((err as { code?: unknown })?.code === "P2002") return false;
    console.warn("[Stripe] Marqueur d'e-mail de confirmation non enregistré :", messageDe(err));
    return true;
  }
}

/**
 * Événement tardif qui voudrait remettre Premium sur un abonnement CANCELED en
 * base (remboursement, suppression déjà traités) : l'état réel est relu chez
 * Stripe. Un abonnement résilié ne revient jamais à `active` : no-op journalisé.
 */
async function reactivationConfirmee(dbStatus: string, subscriptionId: string | null): Promise<boolean> {
  if (dbStatus !== "CANCELED") return true;
  if (!subscriptionId) return false;
  const live = await stripe.subscriptions.retrieve(subscriptionId);
  return UPGRADE_STATUSES.includes(live.status);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  if (session.mode && session.mode !== "subscription") return;
  const contexte = `Session ${session.id ?? "?"}, client ${stripeId(session.customer) ?? "?"}`;
  const echec = (detail: string) =>
    new RetryableWebhookError(
      CLES_TUNNEL.activationEchec,
      "Paiement reçu mais Premium non activé (Stripe va réessayer)",
      `${detail}. ${contexte}. À faire si l'alerte se répète : activer l'utilisateur à la main et vérifier l'abonnement dans Stripe.`,
    );

  let resolved: Awaited<ReturnType<typeof resolveCheckoutUserId>>;
  try {
    resolved = await resolveCheckoutUserId(session);
  } catch (err) {
    throw echec(`Recherche de l'utilisateur impossible : ${messageDe(err)}`);
  }
  if (!resolved) throw echec("Utilisateur introuvable (ni userId, ni client Stripe connu, ni e-mail de compte)");

  const subscriptionId = stripeId(session.subscription);
  if (!subscriptionId) throw echec(`Session sans abonnement (utilisateur ${resolved.userId})`);

  let subscription: Stripe.Subscription;
  try {
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  } catch (err) {
    throw echec(`Lecture de l'abonnement ${subscriptionId} impossible : ${messageDe(err)}`);
  }

  try {
    await activatePremium({ userId: resolved.userId, customerId: stripeId(session.customer), subscription });
  } catch (err) {
    if (estEnregistrementAbsent(err)) {
      // Compte supprimé entre le paiement et l'événement : rien n'est recréé.
      console.warn(`[Stripe] Checkout ${session.id ?? "?"} pour l'utilisateur supprimé ${resolved.userId} : aucune activation`);
      await recordAdminAlert({
        cle: CLES_TUNNEL.activationEchec,
        sujet: "Paiement reçu pour un compte supprimé (aucune activation)",
        html: `<p>${esc(contexte)}, abonnement ${esc(subscriptionId)}, utilisateur ${esc(resolved.userId)} introuvable.</p><p>À faire : résilier et rembourser cet abonnement dans Stripe.</p>`,
      });
      return;
    }
    throw echec(`Écriture en base impossible pour l'utilisateur ${resolved.userId} : ${messageDe(err)}`);
  }
  console.log(`[Stripe] User ${resolved.userId} upgraded to PREMIUM (via ${resolved.via})`);

  if (!(await reserverEmailConfirmation(subscription.id))) {
    console.log(`[Stripe] Confirmation déjà envoyée pour ${subscription.id}, pas de second e-mail`);
    return;
  }
  const billing = extractSubscriptionBilling(subscription);
  await notifySubscriptionConfirmed(resolved.userId, {
    interval: billing.billingInterval,
    montantCents: billing.priceAmountCents,
    dateSouscription: session.created ? new Date(session.created * 1000) : new Date(),
    prochainRenouvellement: subscriptionPeriodEnd(subscription),
  });
}

/** Résiliation programmée qui vient d'être posée (portail) : null sinon. */
function resiliationProgrammee(
  subscription: Stripe.Subscription,
  previous: Partial<Record<string, unknown>> | undefined,
): { finAcces: Date | null } | null {
  const raw = subscription as unknown as { cancel_at?: number | null };
  const programmee = subscription.cancel_at_period_end === true || typeof raw.cancel_at === "number";
  if (!programmee || !previous) return null;
  const etaitProgrammee =
    ("cancel_at_period_end" in previous && previous.cancel_at_period_end === true) ||
    ("cancel_at" in previous && typeof previous.cancel_at === "number");
  const vientDEtrePosee = ("cancel_at_period_end" in previous || "cancel_at" in previous) && !etaitProgrammee;
  if (!vientDEtrePosee) return null;
  const finAcces = typeof raw.cancel_at === "number" ? new Date(raw.cancel_at * 1000) : subscriptionPeriodEnd(subscription);
  return { finAcces };
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  previous: Partial<Record<string, unknown>> | undefined,
): Promise<void> {
  const sub = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscription.id } });
  if (!sub) {
    console.log(`[Stripe] subscription.updated ${subscription.id} : aucun abonnement en base (compte supprimé ou inconnu), ignoré`);
    return;
  }
  if (UPGRADE_STATUSES.includes(subscription.status) && !(await reactivationConfirmee(sub.status, subscription.id))) {
    console.log(`[Stripe] subscription.updated tardif pour ${subscription.id} (résilié), ignoré`);
    return;
  }

  const newStatus = STATUS_MAP[subscription.status] ?? "INACTIVE";
  const shouldDowngrade = DOWNGRADE_STATUSES.includes(subscription.status);
  // past_due : aucun changement de plan (Premium conservé pendant les relances).
  const planUpdate = shouldDowngrade
    ? { plan: "FREE" as const }
    : UPGRADE_STATUSES.includes(subscription.status)
      ? { plan: "PREMIUM" as const }
      : null;

  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: sub.id },
      data: { status: newStatus, ...periodEndData(subscription), ...extractSubscriptionBilling(subscription) },
    }),
    ...(planUpdate ? [prisma.user.update({ where: { id: sub.userId }, data: planUpdate })] : []),
  ]);
  if (planUpdate) console.log(`[Stripe] User ${sub.userId} → ${planUpdate.plan} (${subscription.status})`);

  const resiliation = shouldDowngrade ? null : resiliationProgrammee(subscription, previous);
  if (resiliation) await notifyCancellationScheduled(sub.userId, resiliation.finAcces);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const sub = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscription.id } });
  if (!sub) return;
  await prisma.$transaction([
    prisma.subscription.update({ where: { id: sub.id }, data: { status: "CANCELED" } }),
    prisma.user.update({ where: { id: sub.userId }, data: { plan: "FREE" } }),
  ]);
  console.log(`[Stripe] Subscription deleted for user ${sub.userId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const sub = await findDbSubscriptionForInvoice(invoice);
  if (!sub) return; // ex. 1er paiement refusé pendant le checkout : aucun abonnement en base
  // Premium CONSERVÉ : seul le statut change. Stripe relance ; la rétrogradation
  // viendra de `customer.subscription.updated` (unpaid/canceled) ou `deleted`.
  await prisma.subscription.update({ where: { id: sub.id }, data: { status: "PAST_DUE" } });
  console.log(`[Stripe] Payment failed for user ${sub.userId}, PAST_DUE (Premium conservé)`);

  const premierEchec = (invoice.attempt_count ?? 1) <= 1 && invoice.billing_reason !== "subscription_create";
  if (premierEchec) {
    await notifyPaymentFailed(sub.userId, {
      montantCents: typeof invoice.amount_due === "number" ? invoice.amount_due : null,
      datePrevue: typeof invoice.created === "number" ? new Date(invoice.created * 1000) : null,
    });
  }
  await recordAdminAlert({
    cle: "abonnement-impaye",
    sujet: "Paiement d'abonnement refusé (Premium conservé pendant les relances)",
    html: `<p>Utilisateur ${esc(sub.userId)}, tentative ${invoice.attempt_count ?? "?"}. E-mail client ${premierEchec ? "envoyé" : "non renvoyé"}.</p>`,
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  const sub = await findDbSubscriptionForInvoice(invoice);
  if (!sub) {
    console.log(`[Stripe] invoice.payment_succeeded ${invoice.id ?? "?"} : aucun abonnement en base (compte supprimé ou inconnu), ignoré`);
    return;
  }
  if (!(await reactivationConfirmee(sub.status, invoiceSubscriptionId(invoice) ?? sub.stripeSubscriptionId))) {
    console.log(`[Stripe] invoice.payment_succeeded tardif pour l'abonnement résilié de ${sub.userId}, ignoré`);
    return;
  }
  const periodEnd = invoice.lines?.data?.[0]?.period?.end;
  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "ACTIVE", ...(periodEnd ? { currentPeriodEnd: new Date(periodEnd * 1000) } : {}) },
    }),
    prisma.user.update({ where: { id: sub.userId }, data: { plan: "PREMIUM" } }),
  ]);
  console.log(`[Stripe] Payment succeeded for user ${sub.userId}`);
}

/**
 * Abonnement d'une charge remboursée (lot H, P1-1). L'endpoint reçoit ses
 * événements en version clover, où la charge n'a plus de champ `invoice` :
 * la charge est donc relue par le SDK (épinglé en acacia, qui porte encore
 * `invoice`). Facture référencée mais illisible → erreur rejouable (500).
 * Sans facture : repli UNIQUEMENT si le client n'a qu'un abonnement chez
 * Stripe ; plusieurs → « ambigu » (alerte, aucune résiliation à l'aveugle).
 */
type AbonnementRembourse =
  | { kind: "trouve"; subscriptionId: string | null; via: string }
  | { kind: "hors-abonnement"; invoiceId: string }
  | { kind: "ambigu"; candidats: string[] };

async function abonnementRembourse(
  charge: Stripe.Charge,
  customerId: string,
  dbSubscriptionId: string | null,
): Promise<AbonnementRembourse> {
  const rejouable = (detail: string) =>
    new RetryableWebhookError(
      CLES_TUNNEL.remboursementResiliation,
      "Remboursement total : abonnement à résilier non identifié (Stripe va réessayer)",
      `${detail}. Charge ${charge.id ?? "?"}, client ${customerId}. À faire si l'alerte se répète : résilier à la main dans Stripe l'abonnement remboursé.`,
    );

  let invoiceRef: unknown = (charge as unknown as { invoice?: unknown }).invoice ?? null;
  if (!invoiceRef && charge.id) {
    try {
      const relue = await stripe.charges.retrieve(charge.id, { expand: ["invoice"] });
      invoiceRef = (relue as unknown as { invoice?: unknown }).invoice ?? null;
    } catch (err) {
      throw rejouable(`Lecture de la charge impossible : ${messageDe(err)}`);
    }
  }

  const invoiceId = stripeId(invoiceRef);
  if (invoiceId) {
    let invoice = typeof invoiceRef === "object" ? (invoiceRef as Stripe.Invoice) : null;
    let subscriptionId = invoice ? invoiceSubscriptionId(invoice) : null;
    if (!subscriptionId) {
      try {
        invoice = await stripe.invoices.retrieve(invoiceId);
      } catch (err) {
        throw rejouable(`Facture ${invoiceId} illisible : ${messageDe(err)}`);
      }
      subscriptionId = invoiceSubscriptionId(invoice);
    }
    return subscriptionId
      ? { kind: "trouve", subscriptionId, via: `facture ${invoiceId}` }
      : { kind: "hors-abonnement", invoiceId };
  }

  // Aucune facture : on ne devine l'abonnement que s'il n'y en a qu'un.
  let candidats: string[];
  try {
    const list = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 10 });
    candidats = list.data.map((s) => s.id);
  } catch (err) {
    throw rejouable(`Liste des abonnements du client illisible : ${messageDe(err)}`);
  }
  if (candidats.length > 1) return { kind: "ambigu", candidats };
  return { kind: "trouve", subscriptionId: candidats[0] ?? dbSubscriptionId, via: "seul abonnement du client" };
}

async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const customerId = stripeId(charge.customer);
  if (!customerId) return;
  if (!charge.refunded) {
    console.log(`[Stripe] Partial refund for customer ${customerId}, no plan change`);
    return;
  }

  const dbSub = await prisma.subscription.findUnique({ where: { stripeCustomerId: customerId } });
  const cible = await abonnementRembourse(charge, customerId, dbSub?.stripeSubscriptionId ?? null);
  if (cible.kind === "hors-abonnement") {
    console.log(`[Stripe] Full refund of invoice ${cible.invoiceId} (no subscription), no plan change`);
    return;
  }
  if (cible.kind === "ambigu") {
    await recordAdminAlert({
      cle: CLES_TUNNEL.remboursementResiliation,
      sujet: "Remboursement total : plusieurs abonnements pour ce client, aucun résilié automatiquement",
      html: `<p>Charge ${esc(charge.id ?? "?")}, client ${esc(customerId)}, abonnements : ${esc(cible.candidats.join(", "))}.</p><p>À faire : dans Stripe, résilier l'abonnement remboursé, puis vérifier le compte (Premium ou non).</p>`,
    });
    console.warn(`[Stripe] Full refund for customer ${customerId} : ${cible.candidats.length} abonnements, résiliation laissée à l'admin`);
    return;
  }
  const subscriptionId = cible.subscriptionId;

  if (subscriptionId) {
    try {
      const res = await cancelStripeSubscriptionNow(subscriptionId);
      console.log(`[Stripe] Full refund (${cible.via}), subscription ${subscriptionId} ${res}`);
    } catch (err) {
      throw new RetryableWebhookError(
        CLES_TUNNEL.remboursementResiliation,
        "Remboursement total : abonnement Stripe NON résilié (risque de nouveau prélèvement)",
        `Abonnement ${subscriptionId}, client ${customerId} : ${messageDe(err)}. À faire si l'alerte se répète : résilier l'abonnement à la main dans Stripe.`,
      );
    }
  }

  if (dbSub && (!subscriptionId || dbSub.stripeSubscriptionId === subscriptionId || !dbSub.stripeSubscriptionId)) {
    await prisma.$transaction([
      prisma.subscription.update({ where: { id: dbSub.id }, data: { status: "CANCELED" } }),
      prisma.user.update({ where: { id: dbSub.userId }, data: { plan: "FREE" } }),
    ]);
    console.log(`[Stripe] Full refund, user ${dbSub.userId} downgraded to FREE`);
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET non configuré");
    await recordAdminAlert({
      cle: CLES_TUNNEL.webhookConfig,
      sujet: "Webhook Stripe sans secret : aucun paiement n'est traité",
      html: "<p>STRIPE_WEBHOOK_SECRET absent du Worker. Stripe reçoit des 500 et réessaie.</p>",
    });
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
  const existing = await prisma.webhookEvent.findUnique({ where: { eventId: event.id } });
  if (existing) {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
          (event.data as { previous_attributes?: Partial<Record<string, unknown>> }).previous_attributes,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
    }

    // Enregistrer l'événement APRÈS traitement réussi (pas avant)
    await prisma.webhookEvent.create({
      data: {
        eventId: event.id,
        provider: "stripe",
        eventType: event.type,
        receivedAt: new Date(),
      },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Erreur traitement:", error);
    // Ne PAS enregistrer le dedup : l'événement sera retenté par Stripe.
    if (error instanceof RetryableWebhookError) {
      await recordAdminAlert({ cle: error.cle, sujet: error.sujet, html: `<p>${esc(error.message)}</p><p>Événement ${event.id} (${event.type}).</p>` });
    } else {
      await recordAdminAlert({
        cle: CLES_TUNNEL.webhookErreur,
        sujet: "Webhook Stripe en erreur (Stripe va réessayer)",
        html: `<p>Événement ${event.id} (${event.type}) : ${esc(messageDe(error))}</p>`,
      });
    }
    return NextResponse.json({ error: "Erreur traitement webhook" }, { status: 500 });
  }
}

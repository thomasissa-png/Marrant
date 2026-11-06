/**
 * Résiliation depuis notre écran /resiliation (s23, décision de Thomas du 06/11/2026 : raison
 * demandée AVANT, sur notre écran de confirmation). Spec : `docs/ux/page-resiliation-s23-spec.md` §3.
 *
 * Ordre IMPOSÉ : (1) Stripe `cancel_at_period_end: true` (mensuel et annuel, même appel) ;
 * (2) motif facultatif en base, dans un try/catch, JAMAIS bloquant ; (3) accusé « C'est noté ».
 * Erreur Stripe ou Premium sans client Stripe : demande transmise à l'équipe (e-mail + alerte),
 * accusé « Ta demande est bien reçue » à l'abonné. Rien ici ne lève vers la route.
 */
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { extractSubscriptionBilling, subscriptionPeriodEnd } from "@/lib/stripe-subscription";
import { getSubscriptionSummary, type Formule } from "@/lib/account";
import { recordAdminAlert } from "@/lib/admin-alerts";
import { sendAdminHtmlEmail, trySendTransactionalTextEmail } from "@/lib/email";
import { firstNameFrom } from "@/lib/emails/annual-renewal-reminder";
import { RESILIATION_CODES, RESILIATION_COMMENTAIRE_MAX, type RaisonResiliation } from "@/config/resiliation";
import {
  emailAccuseResiliation,
  emailDemandeResiliationRecue,
  emailEquipeResiliation,
} from "@/config/textes/resiliation-emails";

const JOUR_MS = 24 * 3600_000;
/** Fenêtre de l'anti-doublon de l'accusé (écran et webhook réservent la même clé). */
export const ACCUSE_FENETRE_MS = 10 * 60_000;
/** Une demande transmise à l'équipe au plus par compte et par 24 h (Réessayer, 2 onglets). */
const DEMANDE_FENETRE_MS = JOUR_MS;

/** Statuts en base qui facturent encore (Premium conservé pendant les relances). */
const STATUTS_VIVANTS = ["ACTIVE", "TRIALING", "PAST_DUE"];

export function cleAccuseResiliation(stripeSubscriptionId: string): string {
  return `email-resiliation:${stripeSubscriptionId}`;
}

/**
 * Réserve l'envoi de l'accusé de résiliation d'un abonnement (marqueur `WebhookEvent`, aucune
 * migration). `true` = c'est à l'appelant d'envoyer. Un marqueur de moins de 10 minutes = accusé
 * déjà pris en charge (double clic, ou webhook qui suit notre écran) ; plus ancien = résiliation
 * précédente suivie d'une réactivation : on le rafraîchit et on envoie. Base indisponible : `true`
 * (mieux vaut un doublon qu'aucun accusé, C1).
 */
export async function reserverAccuseResiliation(stripeSubscriptionId: string, now: Date = new Date()): Promise<boolean> {
  const eventId = cleAccuseResiliation(stripeSubscriptionId);
  try {
    await prisma.webhookEvent.create({
      data: { eventId, provider: "interne", eventType: "email.resiliation", receivedAt: now },
    });
    return true;
  } catch (err) {
    if ((err as { code?: unknown })?.code !== "P2002") {
      console.warn("[resiliation] Marqueur d'accusé non enregistré :", err instanceof Error ? err.message : err);
      return true;
    }
  }
  try {
    const { count } = await prisma.webhookEvent.updateMany({
      where: { eventId, receivedAt: { lt: new Date(now.getTime() - ACCUSE_FENETRE_MS) } },
      data: { receivedAt: now },
    });
    return count > 0;
  } catch (err) {
    console.warn("[resiliation] Marqueur d'accusé illisible :", err instanceof Error ? err.message : err);
    return true;
  }
}

/** Libère la réservation (Stripe en échec : la résiliation faite à la main déclenchera l'accusé du webhook). */
async function libererAccuse(stripeSubscriptionId: string): Promise<void> {
  try {
    await prisma.webhookEvent.deleteMany({ where: { eventId: cleAccuseResiliation(stripeSubscriptionId) } });
  } catch (err) {
    console.warn("[resiliation] Marqueur d'accusé non libéré :", err instanceof Error ? err.message : err);
  }
}

/** Fin d'accès d'un abonnement résilié en fin de période : `cancel_at`, sinon fin de période. */
export function finAccesStripe(subscription: Stripe.Subscription): Date | null {
  const raw = subscription as unknown as { cancel_at?: number | null };
  return typeof raw.cancel_at === "number" ? new Date(raw.cancel_at * 1000) : subscriptionPeriodEnd(subscription);
}

/** Raisons connues seulement, sans doublon, dans l'ordre fixe de la liste. */
export function nettoyerRaisons(brutes: readonly unknown[]): RaisonResiliation[] {
  const recues = new Set(brutes.filter((r): r is string => typeof r === "string"));
  return RESILIATION_CODES.filter((code) => recues.has(code));
}

export function nettoyerCommentaire(brut: unknown): string | null {
  if (typeof brut !== "string") return null;
  const texte = brut.trim().slice(0, RESILIATION_COMMENTAIRE_MAX).trim();
  return texte.length > 0 ? texte : null;
}

// ---------------------------------------------------------------------------
// Lecture pour l'écran (/resiliation, /resiliation/confirmee) : toujours relue, jamais en cache.
// ---------------------------------------------------------------------------

export interface DonneesResiliation {
  etat: "a_resilier" | "deja_resilie" | "aucun";
  email: string;
  prenom: string | null;
  formule: Formule | null;
  priceCents: number | null;
  /** Fin du contrat (ISO), null si inconnue (lecture en échec) : « à la fin de la période déjà payée ». */
  dateFin: string | null;
  /** Premium sans abonnement Stripe (accès offert, manuel) : ni « période payée » ni prélèvement (UX O7). */
  sansAbonnementStripe?: boolean;
  /** Ni client ni abonnement Stripe : achat App Store possible, détecté dans l'appli (UX O5, C6). */
  sansClientStripe?: boolean;
  /** Statut PAST_DUE (@legal O7) : la facture en cours peut encore être prélevée après la résiliation. */
  impaye?: boolean;
}

export async function lireResiliation(userId: string): Promise<DonneesResiliation | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true, plan: true } });
  if (!user) return null;
  let summary: Awaited<ReturnType<typeof getSubscriptionSummary>> = null;
  let resumeLu = true;
  try {
    summary = await getSubscriptionSummary(userId);
  } catch (err) {
    resumeLu = false;
    console.warn("[resiliation] Résumé d'abonnement illisible :", err instanceof Error ? err.message : err);
  }
  const vivant = summary ? STATUTS_VIVANTS.includes(summary.status) : false;
  const premium = user.plan === "PREMIUM" || vivant;
  const base = {
    email: user.email ?? "",
    prenom: firstNameFrom(user.name),
    formule: summary?.formule ?? null,
    priceCents: summary?.priceCents ?? null,
    dateFin: summary?.currentPeriodEnd ?? null,
    // Lecture en échec : on ne sait pas, on garde le texte « période déjà payée » (UX O7).
    sansAbonnementStripe: resumeLu && !summary?.hasStripeSubscription,
    sansClientStripe: resumeLu && !summary?.hasPortal && !summary?.hasStripeSubscription,
    impaye: summary?.status === "PAST_DUE",
  };
  if (!premium) return { etat: "aucun", ...base };
  if (summary?.cancelAtPeriodEnd) return { etat: "deja_resilie", ...base };
  return { etat: "a_resilier", ...base };
}

// ---------------------------------------------------------------------------
// Action (route POST /api/user/subscription/resiliation)
// ---------------------------------------------------------------------------

export type ReponseResiliation =
  | { etat: "resilie" | "deja_resilie"; dateFin: string | null; formule: Formule | null }
  | { etat: "transmis"; dateFin: string | null; formule: Formule | null }
  | { etat: "aucun" }
  | { etat: "app_store" };

export interface DemandeResiliation {
  userId: string;
  raisons: RaisonResiliation[];
  commentaire: string | null;
  /** Clé aléatoire générée par l'écran (idempotence Stripe et ligne de motif unique). */
  cle: string;
  /** Requête venue de l'application mobile (origine Capacitor). */
  depuisAppli: boolean;
  now?: Date;
}

function versFormule(interval: string | null | undefined): Formule | null {
  if (interval === "year") return "annual";
  if (interval === "month") return "monthly";
  return null;
}

function codeErreur(err: unknown): string {
  const e = err as { code?: unknown; type?: unknown; statusCode?: unknown; name?: unknown };
  const parts = [e?.type, e?.code, e?.statusCode].filter((v) => typeof v === "string" || typeof v === "number");
  if (parts.length > 0) return parts.join(" / ");
  return typeof e?.name === "string" ? e.name : "inconnu";
}

/** Motif facultatif : une ligne seulement s'il y a une raison ou un mot. Ne lève jamais. */
export async function enregistrerMotif(v: {
  userId: string;
  raisons: RaisonResiliation[];
  commentaire: string | null;
  formule: Formule | null;
  debutAbonnement: Date | null;
  cle: string;
  now: Date;
}): Promise<boolean> {
  if (v.raisons.length === 0 && !v.commentaire) return false;
  try {
    const tenureDays = v.debutAbonnement
      ? Math.max(0, Math.floor((v.now.getTime() - v.debutAbonnement.getTime()) / JOUR_MS))
      : null;
    await prisma.cancellationFeedback.create({
      data: {
        userId: v.userId,
        reasons: v.raisons,
        comment: v.commentaire,
        formule: v.formule,
        tenureDays,
        source: "ecran",
        requestKey: v.cle,
        createdAt: v.now,
      },
    });
    return true;
  } catch (err) {
    // P2002 (même clé : double clic) = déjà enregistré. Tout autre échec : journal seulement,
    // la résiliation reste réussie (spec §3.2). Jamais le texte du mot dans le journal.
    if ((err as { code?: unknown })?.code === "P2002") return true;
    console.error("[resiliation] Motif non enregistré (résiliation conservée) :", (err as { code?: unknown })?.code ?? (err instanceof Error ? err.name : "erreur"));
    return false;
  }
}

/** Demande transmise à l'équipe (au plus une fois par 24 h et par compte). Ne lève jamais. */
async function transmettreAEquipe(v: {
  userId: string;
  email: string | null;
  prenom: string | null;
  dateFin: Date | null;
  cause: "stripe" | "sans-client-stripe";
  code: string;
  stripeSubscriptionId: string | null;
  now: Date;
}): Promise<void> {
  const eventId = `resiliation-demande:${v.userId}`;
  let premiere = true;
  try {
    await prisma.webhookEvent.create({ data: { eventId, provider: "interne", eventType: "resiliation.demande", receivedAt: v.now } });
  } catch (err) {
    if ((err as { code?: unknown })?.code === "P2002") {
      try {
        const { count } = await prisma.webhookEvent.updateMany({
          where: { eventId, receivedAt: { lt: new Date(v.now.getTime() - DEMANDE_FENETRE_MS) } },
          data: { receivedAt: v.now },
        });
        premiere = count > 0;
      } catch {
        premiere = true;
      }
    }
  }
  const sujet = emailEquipeResiliation({
    userId: v.userId,
    demandeLe: v.now,
    cause: v.cause,
    code: v.code,
    stripeSubscriptionId: v.stripeSubscriptionId,
  });
  // L'alerte est toujours enregistrée (trace durable de la demande, digest du matin).
  await recordAdminAlert({ cle: "paiement-resiliation-a-faire", sujet: sujet.subject, html: sujet.html }).catch(() => false);
  if (!premiere) return;
  try {
    await sendAdminHtmlEmail(sujet.subject, sujet.html);
  } catch (err) {
    console.error("[resiliation] E-mail à l'équipe non parti :", err instanceof Error ? err.message : err);
  }
  if (v.email) {
    const accuse = emailDemandeResiliationRecue({ prenom: v.prenom, dateFin: v.dateFin, demandeLe: v.now, offert: v.cause === "sans-client-stripe" });
    await trySendTransactionalTextEmail(v.email, accuse.subject, accuse.text, "resiliation");
  }
}

/**
 * Résilie en fin de période (mensuel et annuel), puis enregistre le motif, puis envoie l'accusé.
 * Ne lève jamais : toute erreur finit en `transmis` (l'équipe résilie à la main) ou en succès.
 */
export async function resilierAbonnement(d: DemandeResiliation): Promise<ReponseResiliation> {
  const now = d.now ?? new Date();
  const user = await prisma.user.findUnique({ where: { id: d.userId }, select: { email: true, name: true, plan: true } });
  if (!user) return { etat: "aucun" };
  const sub = await prisma.subscription.findUnique({
    where: { userId: d.userId },
    select: {
      id: true,
      status: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      billingInterval: true,
      priceAmountCents: true,
      createdAt: true,
    },
  });
  const prenom = firstNameFrom(user.name);
  const vivant = sub ? STATUTS_VIVANTS.includes(sub.status) : false;
  if (user.plan !== "PREMIUM" && !vivant) return { etat: "aucun" };

  const formuleBase = versFormule(sub?.billingInterval);
  const finBase = sub?.currentPeriodEnd ?? null;

  // Déjà résilié (2e onglet, rechargement) : ni appel Stripe, ni e-mail, ni motif.
  if (sub?.cancelAtPeriodEnd) {
    return { etat: "deja_resilie", dateFin: finBase?.toISOString() ?? null, formule: formuleBase };
  }

  const motif = (formule: Formule | null) =>
    enregistrerMotif({
      userId: d.userId,
      raisons: d.raisons,
      commentaire: d.commentaire,
      formule,
      debutAbonnement: sub?.createdAt ?? null,
      cle: d.cle,
      now,
    });

  const subscriptionId = sub?.stripeSubscriptionId ?? null;
  if (!subscriptionId) {
    // Achat sur l'App Store (C6) : la résiliation passe par Apple. [HYPOTHÈSE : aucun lien en base
    // entre RevenueCat et le compte ; détecté par l'origine de l'appli et l'absence de client Stripe.]
    if (d.depuisAppli && !sub?.stripeCustomerId) return { etat: "app_store" };
    // Premium sans client Stripe (accès offert ou manuel) : pas de cul-de-sac, l'équipe résilie.
    await motif(formuleBase);
    await transmettreAEquipe({
      userId: d.userId,
      email: user.email,
      prenom,
      dateFin: finBase,
      cause: "sans-client-stripe",
      code: sub?.stripeCustomerId ? "client-sans-abonnement" : "sans-client-stripe",
      stripeSubscriptionId: null,
      now,
    });
    return { etat: "transmis", dateFin: finBase?.toISOString() ?? null, formule: formuleBase };
  }

  // 1. Stripe D'ABORD. Réservation de l'accusé AVANT l'appel : le webhook qui suit la trouve et
  //    n'envoie pas l'ancien e-mail (spec §3.3) ; libérée si Stripe échoue.
  const doitEnvoyerAccuse = await reserverAccuseResiliation(subscriptionId, now);
  let remote: Stripe.Subscription;
  try {
    remote = await getStripe().subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: true },
      { idempotencyKey: `resiliation-${d.userId}-${d.cle}` },
    );
  } catch (err) {
    if (doitEnvoyerAccuse) await libererAccuse(subscriptionId);
    const code = codeErreur(err);
    console.error(`[resiliation] Stripe a refusé la résiliation de ${subscriptionId} (${code}) : demande transmise à l'équipe`);
    await motif(formuleBase);
    await transmettreAEquipe({
      userId: d.userId,
      email: user.email,
      prenom,
      dateFin: finBase,
      cause: "stripe",
      code,
      stripeSubscriptionId: subscriptionId,
      now,
    });
    return { etat: "transmis", dateFin: finBase?.toISOString() ?? null, formule: formuleBase };
  }

  // Date de fin relue dans la réponse Stripe, jamais recalculée.
  const billing = extractSubscriptionBilling(remote);
  const dateFin = finAccesStripe(remote) ?? finBase;
  const formule = versFormule(billing.billingInterval) ?? formuleBase;
  const priceCents = billing.priceAmountCents ?? sub?.priceAmountCents ?? null;

  // Base alignée tout de suite (profil, page finale) ; le webhook la resynchronise ensuite.
  try {
    await prisma.subscription.update({
      where: { id: sub!.id },
      data: { cancelAtPeriodEnd: true, ...(dateFin ? { currentPeriodEnd: dateFin } : {}) },
    });
  } catch (err) {
    console.warn("[resiliation] Base non alignée (le webhook s'en charge) :", err instanceof Error ? err.message : err);
  }

  // 2. Motif ENSUITE, jamais bloquant.
  const aRepondu = d.raisons.length > 0 || d.commentaire !== null;
  await motif(formule);

  // 3. Accusé « C'est noté » (C1 + C2). Un échec d'envoi n'annule rien (alerte A par lib/email).
  if (doitEnvoyerAccuse && user.email) {
    // @legal O7 : statut lu en base AVANT l'appel Stripe (impayé = facture en cours encore prélevable).
    const impaye = sub?.status === "PAST_DUE";
    const accuse = emailAccuseResiliation({ prenom, formule, priceCents, dateFin, demandeLe: now, aRepondu, impaye });
    await trySendTransactionalTextEmail(user.email, accuse.subject, accuse.text, "resiliation");
  }
  return { etat: "resilie", dateFin: dateFin?.toISOString() ?? null, formule };
}

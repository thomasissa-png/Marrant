/**
 * Onboarding Premium s23 : journal d'envoi, jeton d'arrêt, ancre J0 et fin d'accès.
 *
 * Journal (C5 @legal) SANS MIGRATION : table existante `WebhookEvent`, déjà utilisée comme marqueur
 * interne par le webhook (`email-confirmation:<abonnement>`). Une ligne par (étape, compte), clé
 * unique `eventId` = `onboarding-premium:<étape>:<userId>`, `provider` = `interne` :
 *  - E0    : ancre J0, `receivedAt` = date de souscription (écrite au bienvenue s23 seulement :
 *            les abonnés antérieurs à l'ouverture n'ont pas d'ancre, donc ni E1 ni E2) ;
 *  - E1/E1b/E2 : réservée AVANT l'envoi (unicité), `eventType` = statut (`reserve`, `envoye:<version>`,
 *            `saute:<motif>`), `receivedAt` = réservation, `processedAt` = envoi ;
 *  - FIN   : fin d'accès exacte d'une résiliation programmée (`cancel_at` de Stripe, sinon fin de
 *            période, réserve 2 @legal), `receivedAt` = fin d'accès, posée par le webhook ;
 *  - ARRET : clic sur le lien d'arrêt (opposition), `receivedAt` = date. Jamais effacée par le code.
 * Aucune adresse, aucun prénom, aucun motif de résiliation (C7) : l'identifiant de compte seul.
 * Ces fonctions ne lèvent jamais côté webhook (un journal raté ne fait pas rejouer Stripe).
 */
import { createHmac, timingSafeEqual } from "crypto";
import { ONBOARDING_ARRET_CHEMIN } from "@/config/onboarding-premium";

export const PREFIXE_JOURNAL = "onboarding-premium";
export type CleJournal = "E0" | "E1" | "E1b" | "E2" | "FIN" | "ARRET";

export function cleJournal(etape: CleJournal, userId: string): string {
  return `${PREFIXE_JOURNAL}:${etape}:${userId}`;
}

export function typeJournal(etape: CleJournal, statut: string): string {
  return `email.${PREFIXE_JOURNAL}.${etape}.${statut}`;
}

/** Sous-ensemble Prisma de `WebhookEvent` utilisé ici (injectable en test). */
export interface JournalDb {
  webhookEvent: {
    create(args: { data: { eventId: string; provider: string; eventType: string; receivedAt: Date; processedAt: Date } }): Promise<unknown>;
    upsert(args: {
      where: { eventId: string };
      create: { eventId: string; provider: string; eventType: string; receivedAt: Date; processedAt: Date };
      update: { eventType: string; receivedAt: Date; processedAt: Date };
    }): Promise<unknown>;
  };
}

function codeErreur(err: unknown): unknown {
  return (err as { code?: unknown } | null)?.code;
}

/** Ancre J0 (bienvenue s23 envoyé). Idempotente : une ancre existante n'est jamais déplacée. */
export async function noterAncreJ0(db: JournalDb, userId: string, dateSouscription: Date, now: Date): Promise<boolean> {
  try {
    await db.webhookEvent.create({
      data: { eventId: cleJournal("E0", userId), provider: "interne", eventType: typeJournal("E0", "envoye"), receivedAt: dateSouscription, processedAt: now },
    });
    return true;
  } catch (err) {
    if (codeErreur(err) !== "P2002") console.warn("[onboarding] Ancre J0 non enregistrée :", err instanceof Error ? err.message : err);
    return false;
  }
}

/** Fin d'accès exacte d'une résiliation programmée (webhook). Remplace la précédente. */
export async function noterFinAcces(db: JournalDb, userId: string, finAcces: Date | null, now: Date): Promise<void> {
  if (!finAcces || Number.isNaN(finAcces.getTime())) return;
  try {
    const ligne = { eventType: typeJournal("FIN", "programmee"), receivedAt: finAcces, processedAt: now };
    await db.webhookEvent.upsert({
      where: { eventId: cleJournal("FIN", userId) },
      create: { eventId: cleJournal("FIN", userId), provider: "interne", ...ligne },
      update: ligne,
    });
  } catch (err) {
    console.warn("[onboarding] Fin d'accès non enregistrée :", err instanceof Error ? err.message : err);
  }
}

/** Arrêt par le lien (idempotent : déjà arrêté = « ok »). */
export async function arreterOnboarding(db: JournalDb, userId: string, now: Date): Promise<void> {
  try {
    await db.webhookEvent.create({
      data: { eventId: cleJournal("ARRET", userId), provider: "interne", eventType: typeJournal("ARRET", "lien-email"), receivedAt: now, processedAt: now },
    });
  } catch (err) {
    if (codeErreur(err) !== "P2002") throw err;
  }
}

// --- Jeton d'arrêt (HMAC propre à l'onboarding, sur le modèle du rappel des parcours) ---

const TOKEN_PURPOSE = "onboarding-premium";

export function secretArret(): string | null {
  const s = process.env.UNSUBSCRIBE_HMAC_SECRET;
  return s && s.length >= 32 ? s : null;
}

function signature(userId: string, key: string): string {
  return createHmac("sha256", key).update(`${TOKEN_PURPOSE}:${userId}`).digest("hex").slice(0, 32);
}

/** Jeton d'arrêt (null si le secret manque : aucun envoi sans lien d'arrêt). */
export function signerJetonOnboarding(userId: string): string | null {
  const key = secretArret();
  if (!key) return null;
  return `${Buffer.from(userId).toString("base64url")}.${signature(userId, key)}`;
}

/** userId si le jeton est valide, sinon null. */
export function verifierJetonOnboarding(token: string | null | undefined): string | null {
  const key = secretArret();
  if (!key || !token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const userId = Buffer.from(payload, "base64url").toString("utf8");
  if (!userId) return null;
  const attendu = Buffer.from(signature(userId, key));
  const recu = Buffer.from(sig);
  return attendu.length === recu.length && timingSafeEqual(attendu, recu) ? userId : null;
}

export function urlArretOnboarding(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${ONBOARDING_ARRET_CHEMIN}?token=${encodeURIComponent(token)}`;
}

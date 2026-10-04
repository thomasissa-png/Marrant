/**
 * Rappel légal de reconduction de la formule annuelle (L.215-1, s14 04/10/2026).
 * Règles : docs/legal/annuel-renouvellement-s14.md, section 2.
 *
 * - Fenêtre : cible J-40 avant `currentPeriodEnd`, rattrapage jusqu'à J-32,
 *   jamais à J-31 ou après (limite légale : 1 mois). J-45 à J-41 est permis
 *   par le texte mais inutile avec un passage quotidien (on vise J-40).
 * - Cibles : abonnement ACTIVE, intervalle « year », sans annulation programmée
 *   (`cancelAtPeriodEnd`). Le mensuel n'est jamais concerné.
 * - Anti-doublon : ligne RenewalReminder (subscriptionId, periodEnd) unique,
 *   insérée AVANT l'envoi. Une ligne existante bloque l'envoi, sauf statut
 *   FAILED (envoi précédent en erreur) reprise atomiquement pour un nouvel essai.
 */
import { Prisma, type PrismaClient } from "@prisma/client";
import { PREMIUM_ANNUAL_PRICE_CENTS } from "@/config/premium";
import { firstNameFrom, renderAnnualRenewalReminder } from "@/lib/emails/annual-renewal-reminder";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Jour cible (J-40) : premier passage où le rappel part. */
export const REMINDER_TARGET_DAYS = 40;
/** Dernier jour de rattrapage (J-32). À J-31, plus aucun envoi. */
export const REMINDER_LATEST_DAYS = 32;
/** Borne haute autorisée par le texte légal interne (J-45). */
export const REMINDER_EARLIEST_ALLOWED_DAYS = 45;

/** Nombre de jours entiers avant la fin de période (J-40 = 40 jours pleins restants). */
export function daysUntil(periodEnd: Date, now: Date): number {
  return Math.floor((periodEnd.getTime() - now.getTime()) / DAY_MS);
}

/** Vrai si un rappel peut partir maintenant pour cette fin de période (J-40 à J-32). */
export function isInReminderWindow(periodEnd: Date, now: Date): boolean {
  const days = daysUntil(periodEnd, now);
  return days >= REMINDER_LATEST_DAYS && days <= Math.min(REMINDER_TARGET_DAYS, REMINDER_EARLIEST_ALLOWED_DAYS);
}

/** Bornes de la requête : fin de période dans [now + 32 j, now + 41 j[. */
export function reminderWindowBounds(now: Date): { gte: Date; lt: Date } {
  return {
    gte: new Date(now.getTime() + REMINDER_LATEST_DAYS * DAY_MS),
    lt: new Date(now.getTime() + (REMINDER_TARGET_DAYS + 1) * DAY_MS),
  };
}

export interface ReminderDeps {
  prisma: Pick<PrismaClient, "subscription" | "renewalReminder">;
  sendEmail: (to: string, subject: string, text: string) => Promise<void>;
  manageUrl: string;
}

export interface ReminderRunResult {
  candidates: number;
  sent: number;
  skipped: number;
  failed: number;
}

function isUniqueViolation(err: unknown): boolean {
  return (
    (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") ||
    (typeof err === "object" && err !== null && (err as { code?: unknown }).code === "P2002")
  );
}

/** Réserve l'envoi (subscriptionId, periodEnd) AVANT l'email. Retourne l'id de la ligne, ou null si déjà traité. */
async function claimReminder(deps: ReminderDeps, subscriptionId: string, periodEnd: Date): Promise<string | null> {
  try {
    const row = await deps.prisma.renewalReminder.create({
      data: { subscriptionId, periodEnd, status: "PENDING" },
    });
    return row.id;
  } catch (err) {
    if (!isUniqueViolation(err)) throw err;
  }
  const existing = await deps.prisma.renewalReminder.findUnique({
    where: { subscriptionId_periodEnd: { subscriptionId, periodEnd } },
  });
  if (!existing || existing.status !== "FAILED") return null; // déjà envoyé ou en cours
  // Reprise atomique d'un échec : un seul passage concurrent gagne.
  const { count } = await deps.prisma.renewalReminder.updateMany({
    where: { id: existing.id, status: "FAILED" },
    data: { status: "PENDING", error: null },
  });
  return count === 1 ? existing.id : null;
}

export async function runAnnualRenewalReminders(now: Date, deps: ReminderDeps): Promise<ReminderRunResult> {
  const candidates = await deps.prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      billingInterval: "year",
      cancelAtPeriodEnd: false,
      currentPeriodEnd: reminderWindowBounds(now),
    },
    select: {
      id: true,
      currentPeriodEnd: true,
      priceAmountCents: true,
      user: { select: { email: true, name: true } },
    },
  });

  const result: ReminderRunResult = { candidates: candidates.length, sent: 0, skipped: 0, failed: 0 };

  for (const sub of candidates) {
    const periodEnd = sub.currentPeriodEnd;
    // Double garde (au cas où la requête serait élargie un jour) : jamais hors J-40..J-32.
    if (!periodEnd || !sub.user?.email || !isInReminderWindow(periodEnd, now)) {
      result.skipped++;
      continue;
    }

    const reminderId = await claimReminder(deps, sub.id, periodEnd);
    if (!reminderId) {
      result.skipped++;
      continue;
    }

    const email = renderAnnualRenewalReminder({
      prenom: firstNameFrom(sub.user.name),
      renewalDate: periodEnd,
      amountCents: sub.priceAmountCents ?? PREMIUM_ANNUAL_PRICE_CENTS,
      manageUrl: deps.manageUrl,
    });

    try {
      await deps.sendEmail(sub.user.email, email.subject, email.text);
      await deps.prisma.renewalReminder.update({
        where: { id: reminderId },
        data: { status: "SENT", sentAt: new Date() },
      });
      result.sent++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await deps.prisma.renewalReminder.update({
        where: { id: reminderId },
        data: { status: "FAILED", error: message.slice(0, 500) },
      });
      result.failed++;
      console.error(`[renewal-reminder] Échec d'envoi pour l'abonnement ${sub.id} : ${message}`);
    }
  }

  return result;
}

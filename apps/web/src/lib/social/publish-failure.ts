/**
 * Traçabilité des échecs de publication sociale (audit s14, correctif C1).
 *
 * 1. Le message d'erreur exact renvoyé par Buffer est écrit dans
 *    `SocialPost.directorNote` (colonne existante, aucune migration). Avant s14,
 *    les FAILED « permanents » étaient enregistrés sans message : la cause des
 *    41 échecs Instagram n'a été retrouvée que dans les e-mails.
 * 2. Les e-mails d'échec sont limités à UN par jour UTC (verrou `JobLock`
 *    persistant, valable sous Workers où la mémoire ne survit pas d'un tick à
 *    l'autre). Avant s14 : ~200 e-mails répétitifs, un par tick en échec.
 */
import { buildJobLockKey, nextUtcDay, tryAcquireLock } from "@/lib/job-lock";
import { sendAdminAlert } from "@/lib/email";

export const PUBLISH_ERROR_PREFIX = "Échec publication Buffer : ";
const MAX_ERROR_LENGTH = 900;

/** Note enregistrée sur le post en échec (message brut, tronqué à 900 caractères). */
export function buildPublishErrorNote(errMsg: string, retry?: number): string {
  const clean = errMsg.replace(/\s+/g, " ").trim() || "Erreur inconnue";
  const truncated = clean.length > MAX_ERROR_LENGTH ? `${clean.slice(0, MAX_ERROR_LENGTH)}…` : clean;
  const suffix = retry ? ` [retry:${retry}]` : "";
  return `${PUBLISH_ERROR_PREFIX}${truncated}${suffix}`;
}

export const FAILURE_ALERT_JOB = "publish-social-failure-alert";

/**
 * Envoie l'alerte d'échec au plus une fois par jour UTC (toutes alertes
 * publish-social confondues). Retourne `true` si l'e-mail est parti.
 * Fail-closed : base indisponible → pas d'e-mail (le message reste en base et
 * dans les logs Workers).
 */
export async function sendDailyPublishFailureAlert(
  subject: string,
  html: string,
  now: Date = new Date(),
): Promise<boolean> {
  const key = buildJobLockKey(FAILURE_ALERT_JOB, now);
  const ttlMs = nextUtcDay(now).getTime() - now.getTime();
  const acquired = await tryAcquireLock(key, ttlMs);
  if (!acquired) {
    console.warn(`[PublishSocial] Alerte « ${subject} » non envoyée : déjà une alerte aujourd'hui (${key}).`);
    return false;
  }
  try {
    await sendAdminAlert(subject, html);
    return true;
  } catch (err) {
    console.error("[PublishSocial] Envoi de l'alerte en échec :", err);
    return false;
  }
}

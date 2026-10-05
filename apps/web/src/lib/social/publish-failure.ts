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
import { buildJobLockKey, isLockHeld, nextUtcDay, tryAcquireLock } from "@/lib/job-lock";
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
 * Envoie l'alerte d'échec au plus une fois par jour UTC et par `alertJob`.
 * Retourne `true` si l'e-mail est parti.
 *
 * Ordre (s15 cycle 3, défaut D1) : 1. verrou du jour déjà posé ? alors rien ;
 * 2. envoi ; 3. verrou posé SEULEMENT après un envoi accepté par Resend. Un
 * envoi en échec (clé absente, Resend en erreur) ne pose pas de verrou :
 * l'alerte est retentée au passage suivant. Base illisible : pas d'e-mail
 * (fail-closed, le message reste en base et dans les logs), retenté ensuite.
 * Deux passages concurrents peuvent exceptionnellement envoyer 2 e-mails :
 * un doublon vaut mieux qu'une alerte perdue.
 */
export async function sendDailyPublishFailureAlert(
  subject: string,
  html: string,
  now: Date = new Date(),
  alertJob: string = FAILURE_ALERT_JOB,
): Promise<boolean> {
  const key = buildJobLockKey(alertJob, now);
  try {
    if (await isLockHeld(key, now)) {
      console.warn(`[PublishSocial] Alerte « ${subject} » non envoyée : déjà une alerte aujourd'hui (${key}).`);
      return false;
    }
  } catch (err) {
    console.error("[PublishSocial] Verrou d'alerte illisible, alerte reportée :", err);
    return false;
  }
  const sent = await sendAdminAlert(subject, html);
  if (!sent) {
    console.error(`[PublishSocial] Alerte « ${subject} » non envoyée (e-mail refusé) : nouvel essai au prochain passage.`);
    return false;
  }
  const ttlMs = nextUtcDay(now).getTime() - now.getTime();
  await tryAcquireLock(key, ttlMs);
  return true;
}

/**
 * Traçabilité des échecs de publication sociale (audit s14, correctif C1).
 *
 * 1. Le message d'erreur exact renvoyé par Buffer est écrit dans
 *    `SocialPost.directorNote` (colonne existante, aucune migration). Avant s14,
 *    les FAILED « permanents » étaient enregistrés sans message : la cause des
 *    41 échecs Instagram n'a été retrouvée que dans les e-mails.
 * 2. Les alertes du pipeline social ne partent plus par e-mail (s15, 06/10/2026,
 *    choix de Thomas : 3 e-mails « file basse » en une nuit = trop). Elles sont
 *    enregistrées (`lib/admin-alerts.ts`) : classe A (action de Thomas) dans le
 *    digest du matin, classe B lue par la session via `GET /api/admin/alertes`.
 */
import { recordAdminAlert } from "@/lib/admin-alerts";

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

/** Clé de l'alerte « token Buffer invalide » (classe A : Thomas régénère le token). */
export const TOKEN_ALERT_JOB = "social-token-buffer";

/**
 * Enregistre l'alerte sous la clé `alertJob` (un enregistrement par clé et par
 * jour de Paris, les répétitions sont comptées). Aucun e-mail direct : le digest
 * quotidien (`lib/admin-digest.ts`) envoie les alertes A, la session lit les B.
 * Retourne `true` si l'alerte est en base ; `false` si la base est illisible
 * (l'appelant retente au passage suivant, comme avant). Nom conservé (s14) pour
 * ne pas toucher les ~15 appelants.
 */
export async function sendDailyPublishFailureAlert(
  subject: string,
  html: string,
  now: Date = new Date(),
  alertJob: string = FAILURE_ALERT_JOB,
): Promise<boolean> {
  return recordAdminAlert({ cle: alertJob, sujet: subject, html, now });
}

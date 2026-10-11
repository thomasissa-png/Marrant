/**
 * Alerte email admin sur panne LLM structurelle (non-retryable).
 *
 * Contexte historique — s11, session 9 :
 * Le modèle `claude-sonnet-4-20250514` a été retiré par Anthropic le
 * 15/06/2026. Toutes les générations IA (vannes, conseils, blog, social,
 * vidéos) ont échoué en silence pendant 3,5 mois. Les erreurs étaient
 * simplement loggées dans `LlmUsageLog` avec `success=false` — personne ne
 * les lisait.
 *
 * Ce module garantit qu'un tel incident ne peut plus passer inaperçu :
 *   - dès qu'une erreur NON-retryable de type modèle introuvable / auth /
 *     permission / crédit remonte de `callWithRetry`, on enregistre une
 *     alerte admin (`recordAdminAlert`, s15 06/10 : crédit, clé, permission =
 *     classe A dans le digest du matin ; le reste = classe B lue par la session)
 *   - throttling : max 1 alerte par TYPE d'erreur / 24h (persistance via
 *     `JobLock`), pour éviter le spam si le pipeline se relance 20 fois
 *   - silent-fail total : une erreur d'envoi email ou de DB ne re-throw
 *     JAMAIS. L'appelant (`callWithRetry`) doit continuer à propager
 *     l'erreur LLM originale sans être perturbé.
 *
 * Utilise la classification par classes typées du SDK Anthropic 0.39
 * (`Anthropic.NotFoundError` etc.) plutôt que du string matching fragile.
 */

import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { LlmRefusalError } from "./client";

// `recordAdminAlert` est importé dynamiquement dans `notifyLLMFailure` pour
// ne charger le module d'alertes qu'en cas de panne (hors du chemin des Server
// Components qui touchent client.ts : instrumentation, crons, etc.). Le coût d'un dynamic import est négligeable — cette fonction
// est appelée au maximum une fois par type d'erreur / 24h.

/**
 * Types de pannes structurelles qu'on alerte.
 * Chaque type a sa propre clé de throttling → un incident modèle-retiré
 * n'empêche pas d'être alerté d'une panne crédit qui arriverait le même jour.
 */
export type LLMFailureType =
  | "model_not_found"
  | "authentication"
  | "permission"
  | "credit"
  | "unknown_non_retryable";

export interface NotifyLLMFailureParams {
  error: unknown;
  model: string;
  agent?: string;
  fn?: string;
}

/**
 * Classifie l'erreur en type de panne. Retourne `null` si l'erreur n'est
 * pas structurelle (dans ce cas, on n'alerte pas — c'est probablement une
 * erreur applicative ou un bug côté nous).
 */
export function classifyLLMFailure(error: unknown): LLMFailureType | null {
  // 0. Refus modèle (`stop_reason: "refusal"`) — NON alerté.
  //    Un refus isolé sur une requête donnée n'indique pas une panne
  //    structurelle : c'est du feedback modèle. Alerter dessus produirait
  //    du bruit et masquerait les vraies pannes.
  if (error instanceof LlmRefusalError) return null;

  // 1. Classes typées du SDK (Anthropic 0.39+ ET 0.129+, mêmes classes
  //    exposées comme statiques de `Anthropic`). Chaque classe correspond
  //    à un status HTTP précis, pas de string matching fragile.
  if (error instanceof Anthropic.NotFoundError) return "model_not_found";
  if (error instanceof Anthropic.AuthenticationError) return "authentication";
  if (error instanceof Anthropic.PermissionDeniedError) return "permission";

  // 2. BadRequestError avec message évoquant le crédit / le quota
  //    (le SDK n'a pas de classe dédiée — on inspecte le message renvoyé
  //    par l'API, qui suit le format "credit balance is too low" ou
  //    "insufficient_quota"). C'est le SEUL string matching qu'on tolère.
  if (error instanceof Anthropic.BadRequestError) {
    const msg = (error.message ?? "").toLowerCase();
    if (
      msg.includes("credit") ||
      msg.includes("quota") ||
      msg.includes("insufficient_")
    ) {
      return "credit";
    }
    // Autres BadRequest (paramètre refusé par le modèle, prompt mal formé) :
    // la même requête échouera à CHAQUE run → pipeline cassé en silence,
    // exactement la classe d'incident s11. On alerte (throttle 1 / 24 h).
    // Ex. : `ANTHROPIC_SONNET_MODEL` pointé vers un modèle qui refuse
    // `output_config.effort` ou `temperature` → 400 sur tous les appels.
    return "unknown_non_retryable";
  }

  // 3. APIError générique avec status 402 (Payment Required) ou 429 non-retryable
  if (error instanceof Anthropic.APIError) {
    if (error.status === 402) return "credit";
    // Toute autre APIError structurelle non retryée → catégorie fourre-tout.
    // On alerte quand même, faible risque de bruit.
    if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 403 ||
      error.status === 404
    ) {
      return "unknown_non_retryable";
    }
  }

  // 4. Erreur non typée / réseau — on n'alerte pas ici
  //    (les erreurs réseau sont déjà retryées 3x avant d'arriver).
  return null;
}

/**
 * Sujet + corps HTML de l'email d'alerte, par type.
 */
function buildAlertContent(
  type: LLMFailureType,
  params: NotifyLLMFailureParams,
): { subject: string; body: string } {
  const errMessage =
    params.error instanceof Error
      ? params.error.message
      : String(params.error);
  const status =
    params.error instanceof Anthropic.APIError ? params.error.status : "?";

  const titles: Record<LLMFailureType, string> = {
    model_not_found: "Modèle LLM introuvable — génération IA cassée",
    authentication: "Auth Anthropic invalide — génération IA cassée",
    permission: "Permission Anthropic refusée — génération IA cassée",
    credit: "Crédit Anthropic épuisé — génération IA cassée",
    unknown_non_retryable: "Erreur LLM non-retryable — génération IA à risque",
  };

  const remediation: Record<LLMFailureType, string> = {
    model_not_found:
      "Vérifie la variable Replit <code>ANTHROPIC_SONNET_MODEL</code> ou <code>ANTHROPIC_OPUS_MODEL</code> et le catalogue à <a href='https://docs.anthropic.com/en/docs/about-claude/models'>docs.anthropic.com/models</a>. Modifie la valeur dans Replit Secrets puis redéploie.",
    authentication:
      "La clé <code>ANTHROPIC_API_KEY</code> est invalide ou révoquée. Regénère une clé sur <a href='https://console.anthropic.com'>console.anthropic.com</a> et mets-la à jour dans Replit Secrets.",
    permission:
      "Le compte Anthropic n'a pas la permission d'appeler ce modèle. Vérifie la configuration du workspace et les modèles autorisés.",
    credit:
      "Le crédit Anthropic est épuisé ou la carte a été rejetée. Recharge le compte sur <a href='https://console.anthropic.com'>console.anthropic.com</a>.",
    unknown_non_retryable:
      "Requête refusée par l'API (paramètre invalide pour ce modèle, prompt mal formé…). Consulte le message ci-dessus et les logs Replit ; si tu viens de changer <code>ANTHROPIC_SONNET_MODEL</code> / <code>ANTHROPIC_OPUS_MODEL</code> / <code>ANTHROPIC_EFFORT</code>, reviens à la valeur précédente.",
  };

  const subject = `[Marrant] ${titles[type]}`;
  const body = `
  <p><strong>Type :</strong> ${type}</p>
  <p><strong>Modèle :</strong> <code>${escapeHtml(params.model)}</code></p>
  ${params.agent ? `<p><strong>Agent :</strong> ${escapeHtml(params.agent)} → ${escapeHtml(params.fn ?? "?")}</p>` : ""}
  <p><strong>Status HTTP :</strong> ${status}</p>
  <p><strong>Message :</strong></p>
  <pre style="background:#f3f4f6;padding:12px;border-radius:6px;font-size:12px;white-space:pre-wrap;">${escapeHtml(errMessage)}</pre>
  <p><strong>Action recommandée :</strong></p>
  <p>${remediation[type]}</p>
  <p style="font-size:12px;color:#666;margin-top:16px;">Cette alerte est throttlée à 1 par type / 24h. Prochaine alerte possible dans 24h.</p>
`;
  return { subject, body };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Vérifie si une alerte de ce type peut être envoyée (throttling 24h).
 * Utilise `JobLock` pour la persistance : la clé `llm-alert-<type>` est
 * posée pour 24h. Si elle existe déjà, on n'envoie pas.
 *
 * Silent-fail : si la DB crash, on retourne `false` pour NE PAS envoyer
 * (préférer manquer une alerte plutôt que spammer).
 */
async function shouldSendAlert(type: LLMFailureType): Promise<boolean> {
  const ttlMs = 24 * 60 * 60 * 1000;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs);
  const jobKey = `llm-alert-${type}`;

  try {
    // Nettoyage : supprime le lock si expiré (permet ré-envoi après 24h).
    await prisma.jobLock.deleteMany({
      where: { jobKey, expiresAt: { lt: now } },
    });

    // Tente de créer un nouveau lock. Si un lock actif existe déjà,
    // l'unique constraint (P2002) fait échouer la création → on ne
    // renvoie pas l'alerte.
    await prisma.jobLock.create({
      data: { jobKey, acquiredAt: now, expiresAt },
    });
    return true;
  } catch {
    // Silent-fail : DB down ou lock déjà pris → on n'envoie pas.
    return false;
  }
}

/**
 * Point d'entrée public : appelé par `callWithRetry` sur toute erreur
 * non-retryable. Silent-fail garanti — ne throw jamais.
 */
export async function notifyLLMFailure(
  params: NotifyLLMFailureParams,
): Promise<void> {
  try {
    const type = classifyLLMFailure(params.error);
    if (!type) return;

    const canSend = await shouldSendAlert(type);
    if (!canSend) return;

    const { subject, body } = buildAlertContent(type, params);
    // s15 (06/10) : plus d'e-mail direct. Crédit, clé, permission = classe A
    // (digest du matin) ; modèle introuvable, requête refusée = classe B (session).
    const { recordAdminAlert } = await import("@/lib/admin-alerts");
    await recordAdminAlert({ cle: `llm-alert-${type}`, sujet: subject, html: body });
  } catch (err) {
    // Silent-fail final — on log en console pour investigation manuelle
    // mais on ne re-throw jamais (le pipeline LLM ne doit pas être
    // impacté par un bug d'alerting).
    console.warn(
      `[llm-alert] Echec envoi alerte : ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

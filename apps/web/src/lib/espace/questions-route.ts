/**
 * Outils communs des routes de « Mes questions » (s24, lot D7) : limites reprises de
 * `api/question-equipe` (3 envois par 10 minutes, 10 par jour, par compte, jamais affichées) et
 * notification interne à l'équipe avec l'adresse du compte LUE EN BASE (jamais celle d'un corps).
 */
import { prisma } from "@/lib/prisma";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { sendServiceTextEmail } from "@/lib/email";
import { adresseReponse } from "@/lib/question-equipe";
import { QUESTION_EQUIPE_LIMITES } from "@/config/question-equipe";
import { jsonEspace } from "@/lib/espace/api";
import { journaliserQuestions } from "@/lib/espace/questions";
import type { EnvoyerEmail } from "@/lib/espace/questions-equipe";

/** null si l'envoi passe, sinon la réponse 429 + Retry-After. */
export async function limiterQuestions(userId: string, maintenant: number = Date.now()) {
  for (const [nom, limite] of Object.entries(QUESTION_EQUIPE_LIMITES)) {
    const rl = await sharedRateLimit(`espace-questions-${nom}`, userId, limite, maintenant);
    if (!rl.allowed) return jsonEspace({ error: "trop" }, 429, { "Retry-After": String(retryAfterSeconds(rl, maintenant)) });
  }
  return null;
}

/** Envoi réel par Resend (e-mail de service, objet fixe en alerte, jamais le texte). */
export const envoyerParResend: EnvoyerEmail = (to, subject, text, options) => sendServiceTextEmail(to, subject, text, "question-equipe", options);

/**
 * Notification interne APRÈS l'enregistrement : adresse du compte relue en base ; adresse inutilisable
 * ou échec de l'envoi : journal sans texte, et rien n'est perdu (le fil est dans l'outil).
 */
export async function notifier(userId: string, envoi: (replyTo: string, envoyer: EnvoyerEmail) => Promise<void>): Promise<void> {
  try {
    const compte = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    const replyTo = adresseReponse(compte?.email);
    if (!replyTo) return journaliserQuestions("notification", { name: "AdresseInutilisable" });
    await envoi(replyTo, envoyerParResend);
  } catch (error) {
    journaliserQuestions("notification", error);
  }
}

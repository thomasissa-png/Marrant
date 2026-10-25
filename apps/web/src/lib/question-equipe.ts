/**
 * « Ta question à l'équipe » (V1, s22) : validation et envoi de la question à l'équipe.
 * Avis @legal du 25/10, condition C5 :
 *  - `Reply-To` = adresse du compte lue en BASE pour l'identifiant de la session, jamais
 *    une valeur du corps de la requête ;
 *  - champs d'en-tête nettoyés (CR, LF et autres caractères de contrôle retirés) ;
 *  - objet FIXE, sans donnée de l'abonné ;
 *  - le texte de la question n'est jamais journalisé (console), ni envoyé à Umami, ni
 *    écrit en base : il ne vit que dans l'e-mail (Resend, puis boîte contact@ chez IONOS).
 */
import { z } from "zod";
import { QUESTION_EQUIPE_DESTINATAIRE, QUESTION_EQUIPE_MAX } from "@/config/question-equipe";
import { QUESTION_EQUIPE_EMAIL } from "@/config/textes/question-equipe-s22";
import { avecDelai } from "@/lib/lettre/inscription";

/** Délai maximal de l'appel à Resend (règle du projet : 5 s pour un service externe). */
export const QUESTION_EQUIPE_EMAIL_TIMEOUT_MS = 5_000;

/** Corps accepté : la question seule. Tout autre champ (ex. `replyTo`, `email`) est ignoré. */
export const questionBody = z.object({ question: z.string() });

export type ValidationQuestion = { ok: true; question: string } | { ok: false; erreur: "vide" | "trop-long" };

/**
 * Normalise puis valide : fins de ligne unifiées, caractères de contrôle retirés (sauf
 * retour à la ligne et tabulation, utiles dans un récit), espaces de bord retirés.
 */
export function validerQuestion(brut: string): ValidationQuestion {
  const question = brut
    .replace(/\r\n?/g, "\n")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  if (question.length === 0) return { ok: false, erreur: "vide" };
  if ([...question].length > QUESTION_EQUIPE_MAX) return { ok: false, erreur: "trop-long" };
  return { ok: true, question };
}

/** Valeur d'en-tête sûre : aucun CR, LF ni caractère de contrôle (anti-injection d'en-têtes). */
export function nettoyerEnTete(valeur: string): string {
  // eslint-disable-next-line no-control-regex
  return valeur.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, "").trim();
}

/** Adresse de réponse : adresse du compte nettoyée, ou `null` si elle n'a pas la forme d'une adresse. */
export function adresseReponse(emailDuCompte: string | null | undefined): string | null {
  if (!emailDuCompte) return null;
  const propre = nettoyerEnTete(emailDuCompte);
  return z.string().email().safeParse(propre).success ? propre : null;
}

export type EnvoyerQuestion = (
  to: string,
  subject: string,
  text: string,
  options: { replyTo: string },
) => Promise<void>;

/** Envoi unique à l'équipe. Lève si Resend refuse ou dépasse le délai (message sans contenu). */
export async function envoyerQuestionEquipe(p: { question: string; replyTo: string; envoyer: EnvoyerQuestion }): Promise<void> {
  await avecDelai(
    p.envoyer(QUESTION_EQUIPE_DESTINATAIRE, nettoyerEnTete(QUESTION_EQUIPE_EMAIL.objet), QUESTION_EQUIPE_EMAIL.corps(p.question), {
      replyTo: nettoyerEnTete(p.replyTo),
    }),
    QUESTION_EQUIPE_EMAIL_TIMEOUT_MS,
    "Envoi de la question à l'équipe",
  );
}

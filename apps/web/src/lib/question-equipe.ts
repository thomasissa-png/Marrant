/**
 * « Ta question à l'équipe » (V1, s22) : validation et envoi de la question à l'équipe.
 * Avis @legal du 25/10, condition C5 :
 *  - `Reply-To` = adresse du compte lue en BASE pour l'identifiant de la session, jamais
 *    une valeur du corps de la requête ;
 *  - champs d'en-tête nettoyés (CR, LF et autres caractères de contrôle retirés) ;
 *  - objet fixe, sans donnée de l'abonné, horodaté (jour et heure de Paris) pour que le
 *    webmail ne range pas toutes les questions dans un seul fil ;
 *  - clé d'idempotence Resend (`Idempotency-Key`) : un renvoi du même texte par le même
 *    compte dans les 10 minutes (Resend plus lent que 5 s, réponse perdue) ne crée pas de
 *    second e-mail ;
 *  - le texte de la question n'est jamais journalisé (console), ni envoyé à Umami, ni
 *    écrit en base : il ne vit que dans l'e-mail (Resend, puis boîte alex@ chez IONOS) ;
 *  - corps = la question puis la ligne d'envoi (date et heure de Paris de la tentative, comme
 *    l'objet : même tentative, même corps, donc même requête pour la clé d'idempotence).
 */
import { createHash } from "node:crypto";
import { z } from "zod";
import { QUESTION_EQUIPE_DESTINATAIRE, QUESTION_EQUIPE_MAX } from "@/config/question-equipe";
import { QUESTION_EQUIPE_EMAIL } from "@/config/textes/question-equipe-s22";
import { avecDelai } from "@/lib/lettre/inscription";

/** Délai maximal de l'appel à Resend (règle du projet : 5 s pour un service externe). */
export const QUESTION_EQUIPE_EMAIL_TIMEOUT_MS = 5_000;

/** Fenêtre d'idempotence : un renvoi identique dans ces 10 minutes ne part pas deux fois. */
export const QUESTION_EQUIPE_FENETRE_MS = 10 * 60_000;
/** Avance tolérée de l'horloge du navigateur sur celle du serveur. */
const AVANCE_TOLEREE_MS = 60_000;

/**
 * Corps accepté : la question et, en option, la `tentative` du navigateur (`<ms>-<aléa>`,
 * créée au premier envoi d'un texte, renvoyée telle quelle tant que le texte ne change pas,
 * pendant 10 minutes au plus). Tout autre champ (ex. `replyTo`, `email`) est ignoré.
 */
export const questionBody = z.object({ question: z.string(), tentative: z.string().max(64).optional() });

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

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/**
 * Début de la tentative : l'horodatage du navigateur s'il est plausible (10 minutes passées
 * au plus, 1 minute d'avance au plus), sinon le début de la fenêtre de 10 minutes du serveur
 * (ancien onglet sans tentative, horloge très décalée). `jeton` entre dans la clé.
 */
export function debutTentative(tentative: string | undefined, now: number): { debut: number; jeton: string } {
  const m = tentative?.match(/^(\d{13})-([A-Za-z0-9]{8,40})$/);
  const t = m ? Number(m[1]) : NaN;
  if (m && now - t <= QUESTION_EQUIPE_FENETRE_MS && t - now <= AVANCE_TOLEREE_MS) return { debut: t, jeton: m[0] };
  const fenetre = Math.floor(now / QUESTION_EQUIPE_FENETRE_MS) * QUESTION_EQUIPE_FENETRE_MS;
  return { debut: fenetre, jeton: `fenetre-${fenetre}` };
}

/** Clé `Idempotency-Key` : compte + empreinte du texte + tentative. Aucune donnée lisible. */
export function cleIdempotence(compte: string, question: string, jeton: string): string {
  return `question-equipe/${sha256(`${compte}\n${sha256(question)}\n${jeton}`)}`;
}

const FORMAT_PARIS = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const partiesParis = (ms: number) => Object.fromEntries(FORMAT_PARIS.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));

/** « 25/10 14:32 » (jour et heure de Paris). */
export function horodatageParis(ms: number): string {
  const p = partiesParis(ms);
  return `${p.day}/${p.month} ${p.hour}:${p.minute}`;
}

/** { le: « 25/10/2026 », a: « 14:32 » } (jour et heure de Paris), pour la ligne d'envoi du corps. */
export function dateEnvoiParis(ms: number): { le: string; a: string } {
  const p = partiesParis(ms);
  return { le: `${p.day}/${p.month}/${p.year}`, a: `${p.hour}:${p.minute}` };
}

export type EnvoyerQuestion = (
  to: string,
  subject: string,
  text: string,
  options: { replyTo: string; idempotencyKey: string },
) => Promise<void>;

/**
 * Envoi unique à l'équipe. Même compte, même texte, même tentative = même objet et même
 * clé : Resend renvoie la réponse du premier envoi au lieu d'envoyer un second e-mail.
 * Lève si Resend refuse ou dépasse le délai (message sans contenu).
 */
export async function envoyerQuestionEquipe(p: {
  question: string;
  replyTo: string;
  compte: string;
  tentative?: string;
  now?: number;
  envoyer: EnvoyerQuestion;
}): Promise<void> {
  const { debut, jeton } = debutTentative(p.tentative, p.now ?? Date.now());
  const { le, a } = dateEnvoiParis(debut);
  await avecDelai(
    p.envoyer(QUESTION_EQUIPE_DESTINATAIRE, nettoyerEnTete(QUESTION_EQUIPE_EMAIL.objet(horodatageParis(debut))), QUESTION_EQUIPE_EMAIL.corps(p.question, le, a), {
      replyTo: nettoyerEnTete(p.replyTo),
      idempotencyKey: cleIdempotence(p.compte, p.question, jeton),
    }),
    QUESTION_EQUIPE_EMAIL_TIMEOUT_MS,
    "Envoi de la question à l'équipe",
  );
}

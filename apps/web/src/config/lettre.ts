/**
 * Lettre mensuelle gratuite (s21, spec UX `docs/ux/lettre-inscription-s21.md`).
 *
 * Interrupteur `LETTRE_OUVERTE` (motif `BOULOT_PUBLIE`) :
 *  - `false` (défaut) : rien n'est visible ni envoyé. Composant d'inscription
 *    absent des 3 emplacements, lien de pied de page absent, `/lettre` en 404
 *    (sauf la désinscription, toujours possible), `POST /api/newsletter` en 410,
 *    confirmation en 404, tâche d'envoi mensuelle inactive.
 *  - `true` : ouverture, sur feu vert de Thomas seulement, après les prérequis
 *    du §7.1 (premier numéro validé à l'aveugle, tâche d'envoi testée, jour
 *    d'envoi fixé). Voir REPLIT_ACTIONS.md (entrée s21 Lettre mensuelle).
 *
 * Module sans dépendance : importable côté client.
 */
export const LETTRE_OUVERTE = false;

/** Emplacements du composant (spec §1). `page` = /lettre. */
export const LETTRE_EMPLACEMENTS = ["article", "quiz", "page"] as const;
export type LettreEmplacement = (typeof LETTRE_EMPLACEMENTS)[number];

/**
 * Version du consentement. Toute modification du texte de la case
 * (`TEXTES_LETTRE.formulaire.case`) = nouvelle version (spec §2.3). Le texte
 * « v2 » de @legal (L1, mention de Premium) est stocké sous `lettre-mensuelle-v1` :
 * c'est le premier texte jamais présenté au public.
 * Le serveur stocke `<version> : <texte exact>`, jamais le texte du navigateur.
 */
export const LETTRE_CONSENT_VERSION = "lettre-mensuelle-v1";

/** Drapeau d'appareil après un envoi réussi (spec §2.4, état « déjà inscrit »). */
export const LETTRE_STORAGE_KEY = "dm-lettre";
export const LETTRE_DRAPEAU_JOURS = 14;

/** Délai minimal entre deux e-mails de confirmation à la même adresse (bouton « Renvoyer »). */
export const LETTRE_RENVOI_SECONDES = 60;

/*
 * Durées et plafonds (décisions @legal s21, `docs/legal/lettre-et-questions-s21.md` L4).
 * [HYPOTHÈSES à valider par un avocat, A3] : valeurs centralisées ici, jamais ailleurs.
 */
/** Lien de confirmation valable 7 jours ; au-delà, l'inscrit non confirmé est effacé. */
export const LETTRE_PENDING_JOURS = 7;
/** E-mails de confirmation au plus par adresse et par inscription. */
export const LETTRE_CONFIRMATIONS_MAX = 2;
/** Un e-mail « déjà dans la liste » au plus par adresse sur cette durée. */
export const LETTRE_DEJA_INSCRIT_HEURES = 24;
/** Reconfirmation demandée par e-mail 24 mois après la dernière confirmation. */
export const LETTRE_RECONFIRMATION_MOIS = 24;
/** Sans clic sous 30 jours après la demande de reconfirmation : désinscription. */
export const LETTRE_RECONFIRMATION_DELAI_JOURS = 30;
/** Trace de désinscription (adresse, dates, version du consentement) gardée 3 ans. */
export const LETTRE_TRACE_DESINSCRIPTION_ANS = 3;

/** Délais côté navigateur (spec §2.4, état Envoi). */
export const LETTRE_ATTENTE_LONGUE_MS = 8_000;
export const LETTRE_ABANDON_MS = 15_000;

/** Envoi mensuel : destinataires traités au plus par passage du planificateur (15 min). */
export const LETTRE_LOT_PAR_PASSAGE = 200;
/** Essais au plus par destinataire et par numéro (échec Resend). */
export const LETTRE_ESSAIS_MAX = 3;

/** Valeur de `NewsletterSubscriber.source` (spec §7.2 point 11). */
export function lettreSource(emplacement: LettreEmplacement, slug?: string | null): string {
  if (emplacement === "article" && slug) return `article:${slug}`.slice(0, 190);
  return emplacement;
}

/** Emplacement relu depuis `source` (mesure `lettre-confirmee`, jamais depuis l'e-mail). */
export function emplacementDeSource(source: string | null | undefined): LettreEmplacement | null {
  if (!source) return null;
  const tete = source.split(":")[0];
  return (LETTRE_EMPLACEMENTS as readonly string[]).includes(tete) ? (tete as LettreEmplacement) : null;
}

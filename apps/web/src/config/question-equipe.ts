/**
 * « Ta question à l'équipe » (V1, s22) : encadré du profil Premium, envoi par e-mail à
 * l'équipe, rien en base. Décisions de Thomas du 25/10 (`docs/founder-preferences.md`) ;
 * avis @legal du 25/10 (conditions C1 à C5).
 *
 * Interrupteur `QUESTION_EQUIPE_OUVERTE` FERMÉ par défaut : tant qu'il l'est, l'encadré
 * n'est pas rendu, l'API répond 404 et les ajouts de la confidentialité (section 9, partie
 * 4) et des CGU (article 10) ne sont pas publiés. L'ouvrir = go écrit de Thomas, après la
 * relecture à l'aveugle des textes et les conditions @legal C2 (outils de rédaction) et C4
 * (conduite « sensible ») ; une ouverture exige `QUESTION_EQUIPE_DATE_TEXTES` (test).
 */
export const QUESTION_EQUIPE_OUVERTE: boolean = false;

/**
 * Date de publication des textes juridiques du service (« Dernière mise à jour » de la
 * confidentialité et des CGU), au format « 9 novembre 2026 ». À remplir en ouvrant
 * l'interrupteur ; le test `question-equipe-s22` refuse une ouverture sans date.
 */
export const QUESTION_EQUIPE_DATE_TEXTES: string = "";

/** Boîte de l'équipe (IONOS), seule destinataire. */
export const QUESTION_EQUIPE_DESTINATAIRE = "contact@deviens-marrant.fr";

/** Longueur maximale de la question (caractères, après retrait des espaces de bord). */
export const QUESTION_EQUIPE_MAX = 1000;

/**
 * Garde-fou anti-abus (jamais affiché, décision du 25/10 « pas de limite affichée ») :
 * par compte, 3 envois par 10 minutes et 10 par 24 heures. Compteur partagé en base
 * (`sharedRateLimit`, table `JobLock`, clé hachée : aucune donnée personnelle, jamais le
 * texte) ; repli en mémoire si la base est indisponible.
 */
export const QUESTION_EQUIPE_LIMITES = {
  court: { maxRequests: 3, windowMs: 10 * 60_000 },
  jour: { maxRequests: 10, windowMs: 24 * 3600_000 },
} as const;

export const QUESTION_EQUIPE_API = "/api/question-equipe";

/** Ancre de la section 9 de la confidentialité (lien « Confidentialité » de l'encadré). */
export const QUESTION_EQUIPE_CONFIDENTIALITE_ANCRE = "question-equipe";
export const QUESTION_EQUIPE_CONFIDENTIALITE_HREF = `/confidentialite#${QUESTION_EQUIPE_CONFIDENTIALITE_ANCRE}`;

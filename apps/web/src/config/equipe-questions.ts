/**
 * « Ta question à l'équipe » (s21, 17/10/2026) : réglages centralisés.
 *
 * Spec : `docs/product/ta-question-a-l-equipe-s21.md` (lots A, B, D), avec les
 * écarts décidés en session 21 : réponse visée en moins de 48 h, aucune limite
 * affichée (garde-fou invisible), mode de validation configurable, accord par
 * extrait (@legal Q4, B8), conservation 6 mois après la fin de l'abonnement
 * (@legal Q3, hypothèse).
 *
 * INTERRUPTEUR : `QUESTIONS_OUVERTES` FERMÉ. Tant qu'il vaut `false`, aucune page,
 * aucune route abonné, aucune entrée de menu ni lien n'existe pour personne
 * (404). Ouverture uniquement sur décision de Thomas (motif `BOULOT_PUBLIE`).
 * Le back-office (`/admin/equipe-questions`, mot de passe admin) reste
 * utilisable fermé : il sert au pilote des 2 premières questions (spec §8).
 */

/** Interrupteur général. NE PAS passer à true sans la décision de Thomas. */
export const QUESTIONS_OUVERTES = false;

/** Lecture de l'interrupteur (fonction : les tests la remplacent). */
export function questionsOuvertes(): boolean {
  return QUESTIONS_OUVERTES;
}

/**
 * Mode de validation des réponses.
 * - `validation_humaine` (défaut) : aucune réponse ne part sans le clic
 *   « Marquer relue » PUIS « Envoyer » dans le back-office (règle du 01/10 :
 *   aucune IA ne publie seule).
 * - `relecture_automatique` : un brouillon qui passe la grille automatique est
 *   marqué relu et envoyé par la tâche planifiée, sans clic. DÉCISION DE THOMAS
 *   ATTENDUE : ne pas activer (contredit la règle du 01/10 en l'état).
 */
export type ModeValidation = "validation_humaine" | "relecture_automatique";
export const MODE_VALIDATION: ModeValidation = "validation_humaine";

export function modeValidation(): ModeValidation {
  return MODE_VALIDATION;
}

/** Délai de réponse visé (affiché à l'abonné sous forme de date). */
export const DELAI_REPONSE_HEURES = 48;

/** Alerte « échéance proche » quand il reste moins de N heures. */
export const ALERTE_ECHEANCE_HEURES_RESTANTES = 12;

/**
 * Garde-fou invisible contre les abus : jamais affiché comme une limite.
 * Au-delà, message poli « on te répond d'abord sur les précédentes ».
 * Les questions écartées ne comptent pas (la question est rendue, spec §3.1).
 */
export const GARDE_FOU = { maxQuestions: 5, fenetreJours: 7 } as const;

/** Longueurs des champs (spec §2.2). */
export const LIMITES = {
  situationMin: 30,
  situationMax: 1000,
  retourMax: 300,
  reponseMax: 4000,
  extraitMax: 1200,
} as const;

/**
 * Conservation (@legal Q3, hypothèse) : questions et réponses gardées tant que
 * l'abonnement est actif et 6 mois après sa fin, puis effacées par la tâche
 * planifiée (`purgerQuestionsExpirees`).
 */
export const CONSERVATION_MOIS_APRES_FIN = 6;

/** Versions des textes d'accord (preuve écrite côté serveur, jamais reçue du navigateur). */
export const VERSION_CASE_REUTILISATION = "equipe-reutilisation-v2";
export const VERSION_ACCORD_EXTRAIT = "equipe-extrait-v1";

/**
 * Adresse qui reçoit les alertes « question reçue » et « échéance proche ».
 * Variable `EQUIPE_QUESTIONS_ADMIN_EMAIL`, sinon l'adresse admin du site.
 */
export function adresseAlerteAdmin(defaut: string): string {
  const v = process.env.EQUIPE_QUESTIONS_ADMIN_EMAIL?.trim();
  return v && v.includes("@") ? v : defaut;
}

/** Signature obligatoire de chaque réponse (décision du 17/10). */
export const SIGNATURE_EQUIPE = "L'Équipe Deviens Marrant";

/** Chemin public de la fonction (noindex, hors sitemap). */
export const CHEMIN_QUESTIONS = "/ta-question-a-l-equipe";

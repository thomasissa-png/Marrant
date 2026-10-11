/**
 * Textes du lot G « corrections juridiques » (relecture @legal du 07/10/2026,
 * `docs/marrant/audit-parcours-s16/relecture-legal.md`). Repris mot pour mot
 * de @legal quand il les a rédigés ; les autres sont PROVISOIRES (tutoiement,
 * zéro tiret cadratin), à calibrer avec Thomas (règle des étalons).
 *
 * Règle tranchée par Thomas (founder-preferences, 07/10/2026) : le
 * remboursement sous 14 jours ne vaut que pour le PREMIER paiement d'un
 * abonnement, jamais pour un renouvellement.
 */

/**
 * Périmètre du délai de rétractation : CGU art. 6, page /retractation et accusé
 * de réception. 1re phrase : PROVISOIRE lot G (règle de Thomas) ; 2e phrase :
 * texte exact @legal (point 3).
 */
export const RETRACTATION_PERIMETRE =
  "Le remboursement sous 14 jours ne vaut que pour le premier paiement de ton abonnement, jamais pour un renouvellement. Ce délai court à partir de ta souscription ; un renouvellement n'ouvre pas un nouveau délai de 14 jours.";

/** Titre placé avant le modèle légal de formulaire (texte exact @legal, point 2). */
export const MODELE_FORMULAIRE_TITRE = "Modèle de formulaire de rétractation (facultatif, le formulaire en ligne suffit)";

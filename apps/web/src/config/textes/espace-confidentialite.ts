/**
 * Politique de confidentialité, ajouts de l'espace client (s24, lot D4, porte G9) : question C9
 * « Où veux-tu être plus à l'aise ? ». Source : `docs/legal/espace-c9-information-s24.md` (@legal,
 * « Ligne à ajouter à confidentialite/page.tsx »), mot pour mot, sans le point final des puces (style
 * des listes de la page). Draft à faire valider par un avocat avant ouverture.
 *
 * NON PUBLIÉ : rendu seulement interrupteur `ESPACE_CLIENT_PUBLIE` ouvert (même mécanique que la
 * résiliation et l'onboarding : la date de mise à jour ne bouge qu'une fois ouvert).
 */

/**
 * Date de mise en ligne de ces lignes, au format « 12 novembre 2026 ». VIDE tant que l'espace n'est pas
 * ouvert (aucune date inventée) : à remplir le jour du déploiement de l'ouverture (REPLIT_ACTIONS.md,
 * entrée « À DÉPLOYER (s24) : lot D4 »). Vide = la date de la page ne change pas.
 */
export const ESPACE_DATE_TEXTES = "";

export const CONFIDENTIALITE_ESPACE = {
  /** Partie 2 (données), nouvelle puce. */
  donnees:
    "Ta réponse à la question « Où veux-tu être plus à l'aise ? » (entre potes, au boulot, pour plaire ou partout), la date de ta réponse et la date où on t'a proposé une situation de rencontre, si tu es abonné",
  /** Partie 3 (base), nouvelle puce. */
  base: "Choisir les situations qu'on te propose selon ta réponse : exécution du contrat",
  /**
   * Partie 6 (durée) : la phrase existante (« La date de chaque étape validée et tes retours sur les
   * exercices sont gardés tant que ton compte existe, et effacés avec lui. ») complétée par « ta réponse
   * sur l'endroit où tu veux être plus à l'aise ». [À VÉRIFIER @legal : place de l'ajout dans la phrase.]
   */
  dureeEtapes:
    "La date de chaque étape validée, tes retours sur les exercices et ta réponse sur l'endroit où tu veux être plus à l'aise sont gardés tant que ton compte existe, et effacés avec lui.",
} as const;

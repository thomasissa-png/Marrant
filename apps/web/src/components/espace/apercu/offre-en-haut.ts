import { ESPACE_ACCUEIL } from "@/config/espace-client";

/**
 * v7 tour 13 (décision de Thomas du 16/11 : « un seul bouton de paiement en haut ») : adresses de l'espace dont
 * l'aperçu (visiteur et inscrit gratuit) pose son bloc d'offre EN HAUT de page (`ApercuVerrouille`, hero et carte
 * d'offre). Sur ces adresses, l'en-tête universel (interrupteur ouvert seulement) masque son bouton d'offre, rangée
 * du haut à toutes les largeurs : plus deux boutons « Premium · 1,99 €/mois » côte à côte. Les rubriques encore sur
 * l'ancien aperçu (`ApercuRubrique`, offre sous l'exemple) n'y sont pas : leur seul bouton du haut reste celui de
 * l'en-tête. Une rubrique qui passe à `ApercuVerrouille` s'ajoute ici. Module sans dépendance serveur (lu par
 * l'en-tête, composant client) ; l'abonné n'a jamais ce bouton, la règle ne le concerne pas.
 */
export const ADRESSES_OFFRE_EN_HAUT: readonly string[] = [ESPACE_ACCUEIL];

/** Vrai pour l'adresse exacte d'un aperçu à offre en haut (paramètres et ancre ignorés). */
export function offreEnHaut(chemin: string | null | undefined): boolean {
  if (!chemin) return false;
  return ADRESSES_OFFRE_EN_HAUT.includes(chemin.split(/[?#]/)[0]);
}

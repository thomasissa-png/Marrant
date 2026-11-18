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
export const ADRESSES_OFFRE_EN_HAUT: readonly string[] = [
  ESPACE_ACCUEIL,
  // s26 (`docs/ux/rubriques-premium-s26.md` §0) : les trois rubriques passées à `ApercuVerrouille`. Écrites ici, pas
  // lues de `ADRESSES_APERCU` (`acces.ts` importe la garde, côté serveur) ; égalité vérifiée par le test.
  `${ESPACE_ACCUEIL}/quoi-repondre`,
  `${ESPACE_ACCUEIL}/bibliotheque`,
  `${ESPACE_ACCUEIL}/s-entrainer`,
  // s26 (`docs/ux/favoris-carnet-s26.md` §1.2 et §2.2) : l'aperçu de Favoris passe à `ApercuVerrouille` ; le carnet du
  // visiteur et de l'inscrit gratuit pose son bouton d'offre en haut (hero 8/4). L'abonné n'a jamais ce bouton.
  "/favoris",
  "/carnet",
];

/** s26 : les carnets d'un mois (`/carnet/<mois>`) ont le même hero que `/carnet`. */
const CARNET_DU_MOIS = /^\/carnet\/[^/]+$/;

/** Vrai pour l'adresse exacte d'un aperçu à offre en haut (paramètres et ancre ignorés). */
export function offreEnHaut(chemin: string | null | undefined): boolean {
  if (!chemin) return false;
  const adresse = chemin.split(/[?#]/)[0];
  return ADRESSES_OFFRE_EN_HAUT.includes(adresse) || CARNET_DU_MOIS.test(adresse);
}

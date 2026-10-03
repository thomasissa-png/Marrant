/**
 * Offre Premium : valeurs business centralisées (décisions Thomas, 03/10/2026).
 *
 * - Prix unique 2,99 €/mois (formule annuelle retirée pour l'instant).
 * - Valeur principale : tous les parcours en entier, première étape offerte.
 * - Contenu mensuel : le carnet de situations de répartie (src/data/carnet/,
 *   page /carnet), ajouté le 03/10/2026 une fois le premier carnet écrit.
 *
 * Les rythmes des parcours sont vérifiés contre docs/content/parcours-seed.json
 * par un test (src/__tests__/lib/premium-offer.test.ts).
 */

export const PREMIUM_PRICE_LABEL = "2,99 €/mois";

export interface PremiumParcoursOffer {
  slug: string;
  name: string;
  timePerWeek: string;
  /** Durée en semaines = nombre d'étapes du parcours (une étape par semaine). */
  weeks: number;
}

/**
 * Copie légère du seed (le JSON complet ne doit pas partir dans le bundle client).
 * Slugs, rythmes et nombre de semaines vérifiés contre le seed par un test.
 */
export const PREMIUM_PARCOURS: readonly PremiumParcoursOffer[] = [
  { slug: "machine-a-cafe", name: "Machine à Café", timePerWeek: "15 min/semaine", weeks: 3 },
  { slug: "repartie", name: "Répartie", timePerWeek: "20 min/semaine", weeks: 4 },
  { slug: "confiance", name: "Confiance", timePerWeek: "20 min/semaine", weeks: 6 },
];

/** Nombre de parcours affiché partout (« les 3 parcours en entier »). */
export const PARCOURS_COUNT = PREMIUM_PARCOURS.length;

export type ParcoursSlug = "machine-a-cafe" | "repartie" | "confiance";

/** Durée (en semaines) d'un parcours, source unique des « N semaines » affichés. */
export function parcoursWeeks(slug: ParcoursSlug): number {
  const parcours = PREMIUM_PARCOURS.find((p) => p.slug === slug);
  if (!parcours) throw new Error(`Parcours inconnu : ${slug}`);
  return parcours.weeks;
}

/** Parcours le plus court et le plus long (« de 3 à 6 semaines »). */
export const PARCOURS_MIN_WEEKS = Math.min(...PREMIUM_PARCOURS.map((p) => p.weeks));
export const PARCOURS_MAX_WEEKS = Math.max(...PREMIUM_PARCOURS.map((p) => p.weeks));

/**
 * Limites du compte gratuit : SOURCE UNIQUE. Appliquées par /api/jokes,
 * /api/tips et /api/videos, et reprises par tous les textes publics
 * (abonnement, CTA blog, avantages, llms.txt). Changer une valeur ici change
 * la limite réelle ET le texte affiché.
 */
export const FREE_JOKE_LIMIT = 10;
export const FREE_TIP_LIMIT = 3;
export const FREE_VIDEO_LIMIT = 3;

/** « 10 vannes, 3 conseils, 3 vidéos » : énumération des limites gratuites. */
export const FREE_CATALOGUE_LIMITS_LABEL = `${FREE_JOKE_LIMIT} vannes, ${FREE_TIP_LIMIT} conseils, ${FREE_VIDEO_LIMIT} vidéos`;

/** Avantage « carnet mensuel » : libellé unique (avantages, paywall, JSON-LD, llms.txt). */
export const PREMIUM_CARNET_BENEFIT =
  "le carnet mensuel de situations de répartie (nouveau chaque mois)";

/** Destination par défaut après paiement quand aucune intention n'a été mémorisée. */
export const PREMIUM_DEFAULT_RETURN = "/parcours";

/** Paramètre ajouté à la destination après paiement : déclenche le message de bienvenue. */
export const PREMIUM_WELCOME_PARAM = "premium";
export const PREMIUM_WELCOME_VALUE = "bienvenue";

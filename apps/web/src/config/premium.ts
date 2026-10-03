/**
 * Offre Premium : valeurs business centralisées (décisions Thomas, 03/10/2026).
 *
 * - Prix unique 2,99 €/mois (formule annuelle retirée pour l'instant).
 * - Valeur principale : les 3 parcours en entier, première étape offerte.
 * - Aucune promesse de contenu mensuel tant qu'il n'existe pas.
 *
 * Les rythmes des parcours sont vérifiés contre docs/content/parcours-seed.json
 * par un test (src/__tests__/lib/premium-offer.test.ts).
 */

export const PREMIUM_PRICE_LABEL = "2,99 €/mois";

export interface PremiumParcoursOffer {
  slug: string;
  name: string;
  timePerWeek: string;
}

export const PREMIUM_PARCOURS: readonly PremiumParcoursOffer[] = [
  { slug: "machine-a-cafe", name: "Machine à Café", timePerWeek: "15 min/semaine" },
  { slug: "repartie", name: "Répartie", timePerWeek: "20 min/semaine" },
  { slug: "confiance", name: "Confiance", timePerWeek: "20 min/semaine" },
];

/** Destination par défaut après paiement quand aucune intention n'a été mémorisée. */
export const PREMIUM_DEFAULT_RETURN = "/parcours";

/** Paramètre ajouté à la destination après paiement : déclenche le message de bienvenue. */
export const PREMIUM_WELCOME_PARAM = "premium";
export const PREMIUM_WELCOME_VALUE = "bienvenue";

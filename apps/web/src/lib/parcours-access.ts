/**
 * Accès aux étapes des parcours (décision Thomas, s14) :
 * - étape 1 : gratuite pour tous (anonymes compris, en lecture) ;
 * - étapes 2 et suivantes : réservées aux abonnés Premium.
 *
 * « Abonné » = même notion que les favoris Premium : `user.plan === "PREMIUM"`
 * (voir app/api/favorites/route.ts). Règle partagée par l'affichage
 * (components/parcours/parcours-detail.tsx) et l'API de progression
 * (app/api/parcours/[id]/progress/route.ts), qui refuse en 403.
 */

/** Dernière étape accessible sans abonnement. */
export const LAST_FREE_PARCOURS_STEP = 1;

export function isPremiumPlan(plan: string | null | undefined): boolean {
  return plan === "PREMIUM";
}

export function canAccessParcoursStep(
  stepOrder: number,
  plan: string | null | undefined,
): boolean {
  return stepOrder <= LAST_FREE_PARCOURS_STEP || isPremiumPlan(plan);
}

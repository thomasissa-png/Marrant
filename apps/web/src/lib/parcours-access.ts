/**
 * Accès aux étapes des parcours (décision Thomas, s14 ; plus de compte gratuit, s15) :
 * - LIRE l'étape 1 : libre pour tous (visiteurs et comptes non abonnés) ;
 * - LIRE les étapes 2 et suivantes : réservé aux abonnés Premium ;
 * - VALIDER une étape (progression, XP), étape 1 comprise : Premium uniquement
 *   (spec `docs/product/suppression-compte-gratuit-s15.md` §1.1).
 *
 * « Abonné » = `user.plan === "PREMIUM"` (même notion que les favoris).
 * Règles partagées par l'affichage (components/parcours/parcours-detail.tsx)
 * et l'API de progression (app/api/parcours/[id]/progress/route.ts), qui
 * refuse en 403.
 */

/** Dernière étape lisible sans abonnement. */
export const LAST_FREE_PARCOURS_STEP = 1;

/** Helper unique « est abonné », utilisable côté serveur comme côté client. */
export function isPremiumPlan(plan: string | null | undefined): boolean {
  return plan === "PREMIUM";
}

/** Lecture d'une étape : l'étape 1 pour tous, les suivantes pour les abonnés. */
export function canAccessParcoursStep(
  stepOrder: number,
  plan: string | null | undefined,
): boolean {
  return stepOrder <= LAST_FREE_PARCOURS_STEP || isPremiumPlan(plan);
}

/** Validation d'une étape (suivi de progression) : abonnés uniquement, toutes étapes. */
export function canValidateParcoursStep(plan: string | null | undefined): boolean {
  return isPremiumPlan(plan);
}

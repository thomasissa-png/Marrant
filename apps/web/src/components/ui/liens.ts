/**
 * Styles des liens d'appel (cta-forme-place-s21 §1.3). Module sans dépendance : importable
 * par tout composant client sans embarquer de textes (s21 QA m3 : ces constantes vivaient
 * dans mur-liste.tsx, qui tirait cta-pages.ts et les titres d'étapes dans le JS client).
 */

/** Lien fort L1 : le payant en niveau 3 sous le plein (accueil, fin d'article, quiz). */
export const LIEN_L1 =
  "inline-flex min-h-11 items-center text-base font-semibold text-text-primary underline decoration-accent-link decoration-2 underline-offset-4 hover:text-accent-link";

/** Lien discret L2. */
export const LIEN_L2 = "inline-flex min-h-11 items-center text-sm text-accent-link underline underline-offset-2";

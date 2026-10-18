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

/**
 * Titre de carte cliquable des murs de liste (/conseils, /videos) : seul lien de la carte vers sa
 * fiche, explorable par Google, atteignable au clavier (anneau de focus visible).
 */
export const TITRE_CARTE_LIEN =
  "rounded-sm text-inherit decoration-accent-link decoration-2 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2";

/**
 * Flèche de coin (inférieur droit) des cartes de /vannes : seul lien de la carte vers sa fiche, sans texte visible
 * (nom accessible par aria-label), pour laisser à l'amorce son geste (révéler la chute). Même
 * gabarit que favori et partage : cible de 44 px, pastille de 32 px, anneau de focus visible.
 */
export const FLECHE_CARTE_LIEN =
  "group/fiche flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";

/** Pastille visible de la flèche de coin (32 px). */
export const FLECHE_CARTE_PASTILLE =
  "flex h-8 w-8 items-center justify-center rounded-full bg-background-elevated text-text-muted transition-colors duration-200 group-hover/fiche:bg-accent-primary/10 group-hover/fiche:text-accent-link";

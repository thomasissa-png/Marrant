/**
 * Ligne repliée de la lettre (fin d'étape 1) : mêmes classes pour l'enveloppe légère
 * (`LettreRepliee`) et pour le formulaire chargé au dépliage (`LettreInscription`), afin
 * que la ligne ne bouge pas d'un pixel quand l'un remplace l'autre (QA v4 m-7).
 */
export const LIGNE_REPLIEE_CLASSES =
  "min-h-11 text-left underline decoration-text-muted/60 underline-offset-2 hover:text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary";

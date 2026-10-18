/**
 * Gabarit de mise en page unique (revue visuelle s21, docs/design/revue-visuelle-s21/audit.md).
 *
 * - Coque : `max-w-7xl px-4` (layout). Pages catalogue (listes, blog, glossaire, profil,
 *   favoris) : tout
 *   bloc prend la pleine colonne ; seul le texte courant garde `MESURE_TEXTE`.
 * - Pages de lecture (fiches, article, parcours, carnet, à propos, lettre, abonnement,
 *   quiz) : `COLONNE_LECTURE`, et chaque bloc de la page en prend toute la largeur.
 * - Bloc d'appel (murs, bloc d'exercice, fins d'article et de page) : `BLOC_APPEL`, contenu à
 *   gauche, bouton plein `BOUTON_BLOC_APPEL` à la largeur de son texte dès 640 px.
 *
 * Module sans dépendance : importable par les composants serveur et client.
 */

/** Colonne centrée des pages de lecture (768 px). */
export const COLONNE_LECTURE = "mx-auto w-full max-w-3xl";

/** Mesure de lecture du texte courant dans une colonne pleine (aligné à gauche). */
export const MESURE_TEXTE = "max-w-3xl";

/** Carte d'appel : même cadre partout, contenu aligné à gauche. */
export const BLOC_APPEL = "rounded-lg border border-border bg-background-card p-5 sm:p-6";

/** Titre d'un bloc d'appel. */
export const TITRE_BLOC_APPEL = "font-display text-lg font-bold leading-snug text-text-primary [text-wrap:balance] sm:text-xl";

/** Bouton plein d'un bloc d'appel (à combiner avec `buttonVariants({ variant: "primary", size: "lg" })`). */
export const BOUTON_BLOC_APPEL = "h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance] sm:w-auto";

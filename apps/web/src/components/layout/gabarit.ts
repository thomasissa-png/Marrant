/**
 * Gabarit de mise en page unique (revue visuelle s21, docs/design/revue-visuelle-s21/audit.md).
 *
 * - Coque : `max-w-7xl px-4 xl:px-8` (en-tête, contenu, pied). Pages catalogue (listes, blog,
 *   glossaire, profil, favoris) : tout bloc prend la pleine colonne ; seul le texte courant garde
 *   `MESURE_TEXTE`.
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

/**
 * Carte d'appel : même cadre partout, contenu aligné à gauche. Marge interne `p-5 md:p-6`, la même
 * que les encadrés des fiches (chute, « Pourquoi ça marche », exemple, technique, « Dans un
 * parcours ») : bords de texte alignés d'un encadré à l'autre (revue visuelle s21, R06).
 */
export const BLOC_APPEL = "rounded-lg border border-border bg-background-card p-5 md:p-6";

/** Titre d'un bloc d'appel. */
export const TITRE_BLOC_APPEL = "font-display text-lg font-bold leading-snug text-text-primary [text-wrap:balance] sm:text-xl";

/**
 * Bouton plein qui porte le prix (« Ouvrir les 5 parcours · 2,99 €/mois ») : une seule ligne à
 * 375 px (revue visuelle s21, R07), corps de 15 px et marges de 12 px sous 400 px, sans toucher
 * au libellé. À combiner avec `buttonVariants({ variant: "primary", size: "lg" })`.
 */
export const BOUTON_PRIX_UNE_LIGNE = "h-auto min-h-12 px-3 py-2 max-[399px]:whitespace-nowrap max-[399px]:text-[15px]";

/** Bouton plein d'un bloc d'appel (à combiner avec `buttonVariants({ variant: "primary", size: "lg" })`). */
export const BOUTON_BLOC_APPEL = "h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance] sm:w-auto";

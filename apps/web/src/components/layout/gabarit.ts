/**
 * Gabarit de mise en page unique (revue visuelle s21, docs/design/revue-visuelle-s21/audit.md).
 *
 * - Coque : `max-w-7xl px-4 md:px-6 xl:px-8` (en-tête, contenu, pied). Pages catalogue (listes, blog,
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
 * Marge interne des encadrés (chute, « Pourquoi ça marche », exemple, technique, « Dans un parcours »)
 * et des blocs d'appel : la même partout, bords de texte alignés d'un encadré à l'autre (revue visuelle
 * s21, R06). Tour 4 (T3-01) : 16 px de marge latérale sous 400 px, pour que le bouton à prix le plus long
 * tienne sur une ligne à 375 px (voir `CORPS_APPEL_MOBILE`).
 */
export const MARGE_ENCADRE = "p-5 max-[399px]:px-4 md:p-6";

/** Carte d'appel : même cadre partout, contenu aligné à gauche, marge `MARGE_ENCADRE`. */
export const BLOC_APPEL = `rounded-lg border border-border bg-background-card ${MARGE_ENCADRE}`;

/** Titre d'un bloc d'appel. */
export const TITRE_BLOC_APPEL = "font-display text-lg font-bold leading-snug text-text-primary [text-wrap:balance] sm:text-xl";

/**
 * Revue visuelle s21, tour 4 (T3-01) : sous 400 px, tout bouton plein d'appel (avec ou sans prix) passe en
 * 15 px avec 6 px de marge interne (bouton pleine largeur, texte centré : l'air visible reste de part et
 * d'autre du texte). Trajet de conversion s21, tour 2 : « Ouvrir la suite des conseils · 2,99 €/mois »
 * (v2 M02, ≈ 309 px en 15 px) ; approche resserrée (`tracking-tight`, -0,025 em) pour tenir dans les
 * 297 px utiles d'un bloc d'appel à 375 px : une ligne partout, figée par
 * `playwright/tests/local/bouton-appel-s21.spec.ts`. Pas de `whitespace-nowrap` : à 320 px, un libellé
 * trop long revient à la ligne, équilibré, au lieu de sortir de son bouton (libellés inchangés).
 */
export const CORPS_APPEL_MOBILE = "max-[399px]:px-1.5 max-[399px]:text-[15px] max-[399px]:tracking-tight";

/**
 * Bouton plein qui porte le prix hors bloc d'appel (/abonnement, accueil, résultat d'onboarding) : une
 * seule ligne à 375 px (R07, T3-01), sans toucher au libellé. À combiner avec
 * `buttonVariants({ variant: "primary", size: "lg" })`.
 */
export const BOUTON_PRIX_UNE_LIGNE = `h-auto min-h-12 px-3 py-2 [text-wrap:balance] ${CORPS_APPEL_MOBILE}`;

/** Bouton plein d'un bloc d'appel (à combiner avec `buttonVariants({ variant: "primary", size: "lg" })`). */
export const BOUTON_BLOC_APPEL = `h-auto min-h-12 w-full whitespace-normal px-4 py-2 text-center [text-wrap:balance] sm:w-auto ${CORPS_APPEL_MOBILE}`;

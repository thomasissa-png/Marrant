/**
 * DA du site, telle que la page d'accueil la porte (« Ton contenu du jour », « Trois outils… », « Tu te reconnais ? ») :
 * classes et petits composants extraits de `daily-content.tsx`, `feature-cards.tsx` et de l'accueil, SANS changement de
 * rendu (mêmes chaînes de classes au caractère près). s26 DA du site (décision de Thomas du 20/11, « le design, c'est
 * celui des pages déjà validées ; on a une DA avec du violet et tout ») : l'espace ouvert (Quoi répondre, Parcours) les
 * importe d'ici au lieu de les recopier. Aucun « use client » : utilisable côté serveur comme côté navigateur.
 */

/** Carte de l'accueil à bandeau (« Trois outils… ») : le bandeau est le premier enfant, le contenu dessous. */
export const CARTE_ACCUEIL = "relative flex flex-col overflow-hidden rounded-xl border border-border bg-background-card";

/** Bandeau violet de 4 px en haut d'une carte (« Vanne du jour », « 90+ vannes… »). */
export const BANDEAU_ACCUEIL = "h-1 bg-gradient-to-r from-accent-primary to-accent-secondary";
/** Même bandeau, dégradé inversé (« Conseil du jour », « 30+ techniques… »). */
export const BANDEAU_ACCUEIL_INVERSE = "h-1 bg-gradient-to-r from-accent-secondary to-accent-primary";
/** Même bandeau, dégradé centré (« Vidéo du jour », « 80+ vidéos… »). */
export const BANDEAU_ACCUEIL_CENTRE = "h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary";

/** Carte « Tu te reconnais ? » (sans bandeau) ; la marge interne est `MARGE_ENCADRE` (`components/layout/gabarit`). */
export const CARTE_PERSONA = "flex flex-col rounded-xl border border-border bg-background-card";
/** Émoji en tête d'une carte « Tu te reconnais ? » ou « Trois outils… ». */
export const EMOJI_CARTE = "text-3xl";
/** Émoji de la rangée de pastilles d'une carte « Ton contenu du jour ». */
export const EMOJI_CONTENU = "text-2xl";
/** Rangée « émoji + pastilles » en tête d'une carte « Ton contenu du jour ». */
export const RANGEE_PASTILLES = "flex flex-wrap items-center gap-2";
/** Titre d'une carte de l'accueil (`h3` des trois sections). */
export const TITRE_CARTE_ACCUEIL = "font-display text-lg font-bold text-text-primary";
/** Lien violet de bas de carte « Tu te reconnais ? » (« Parcours Répartie · 4 semaines → »). */
export const LIEN_CARTE_ACCUEIL = "inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link hover:underline";
/** Pied d'actions d'une carte « Ton contenu du jour » (réactions, partage, favori), sous un filet. */
export const PIED_CARTE_ACCUEIL = "mt-auto flex items-center gap-2 border-t border-border pt-4";

/** Bloc « Exemple concret » / « Ce que tu vas apprendre » (fond élevé). */
export const BLOC_EXEMPLE = "rounded-lg bg-background-elevated";
/** Bloc « Exercice du jour » / « Exercice pratique » (contour et fond violets légers). */
export const BLOC_EXERCICE = "rounded-lg border border-accent-primary/20 bg-accent-primary/5";

/** En-tête d'un bloc repliable (exemple, exercice, apprentissages) : cible 44 px (T04). */
export const DETAILS_SUMMARY =
  "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-link [&::-webkit-details-marker]:hidden";

/** Libellé violet d'un bloc de l'accueil quand il n'est pas repliable (même lettrage que `DETAILS_SUMMARY`). */
export const LIBELLE_BLOC = "text-xs font-semibold uppercase tracking-wider text-accent-link";

export function Chevron() {
  return (
    <svg className="h-4 w-4 shrink-0 transition-transform group-open/d:rotate-180" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

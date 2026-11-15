/**
 * Carte « Dans ton espace » de « Aujourd'hui » (v5 §3 et §4.2) : supprimée par la navigation v6
 * (`docs/ux/navigation-v6-menu-rubriques.md` §4 : la bande des rubriques, toujours affichée, la remplace).
 * Le composant ne rend plus rien ; son appel dans `app/(dashboard)/mon-espace/page.tsx` est retiré (lot B, colonne 2
 * de la grille d'Aujourd'hui à redessiner par @design). Gardé pour le test `navigation-v6-s25` ; à supprimer avec lui.
 */
export function DansTonEspace() {
  return null;
}

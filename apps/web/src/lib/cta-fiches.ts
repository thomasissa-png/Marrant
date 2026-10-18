/**
 * Parcours proposé en contour (étape 1 gratuite) sur une fiche vanne, conseil
 * ou vidéo (B8 à B10) : celui de l'étape qui utilise la fiche s'il existe
 * (étape 1 d'abord, `sortRefs`), sinon celui qui colle à la catégorie,
 * sinon Répartie (le plus large, même repli que les articles).
 *
 * [HYPOTHÈSE : seule la catégorie BOULOT a un parcours dédié (Boulot) ; aucune
 * table catégorie → parcours n'existe dans les docs, à valider par Thomas.]
 */
import { isParcoursSlug, PARCOURS_SLUGS, type ParcoursSlug } from "@/lib/entrees-parcours";
import { PARCOURS_PAR_DEFAUT } from "@/lib/blog-parcours";
import { sortRefs, type FicheParcoursRef } from "@/lib/entrees-parcours-fiches";

const PARCOURS_PAR_CATEGORIE: Readonly<Record<string, ParcoursSlug>> = {
  BOULOT: "boulot",
};

export function parcoursPourFiche(refs: readonly FicheParcoursRef[], category?: string | null): ParcoursSlug {
  const ref = sortRefs([...refs]).find((r) => isParcoursSlug(r.slug));
  if (ref) return ref.slug;
  const parCategorie = category ? PARCOURS_PAR_CATEGORIE[category] : undefined;
  if (parCategorie && PARCOURS_SLUGS.includes(parCategorie)) return parCategorie;
  return PARCOURS_PAR_DEFAUT;
}

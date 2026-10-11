/**
 * Libellés lisibles des catégories de blog (valeurs brutes de la base :
 * REPARTIE, AUTODERISION…). Rendu uniquement : la valeur stockée, les URL
 * `?category=` et le JSON-LD gardent la valeur brute.
 */
export const BLOG_CATEGORY_LABELS: Record<string, string> = {
  REPARTIE: "Répartie",
  AUTODERISION: "Autodérision",
  STORYTELLING: "Storytelling",
  PSYCHOLOGIE: "Psychologie",
  ANALYSE: "Analyse",
  CATALOGUE: "Catalogue",
  CONTEXTE: "Contexte",
  GUIDE: "Guide",
  HABITUDES: "Habitudes",
  PRATIQUE: "Pratique",
  TIMING: "Timing",
};

/** Catégorie inconnue du mapping : casse phrase de la valeur brute. */
export function blogCategoryLabel(category: string): string {
  return (
    BLOG_CATEGORY_LABELS[category] ??
    category.charAt(0) + category.slice(1).toLowerCase()
  );
}

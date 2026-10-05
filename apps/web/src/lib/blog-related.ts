/**
 * Cartes « À lire ensuite » d'un article de blog.
 *
 * Ordre de base : articles du cluster, puis même catégorie, puis récents (3 cartes).
 * Jamais 2 fois la même destination sur la page : un article déjà proposé en
 * « Suivant » ou « Précédent » (navigation cluster) est retiré. La place libérée
 * revient au prochain article du même cluster s'il en reste un ; sinon la section
 * affiche moins de cartes (notation iter2, D1).
 */

export const RELATED_COUNT = 3;

export function pickRelatedArticles<T extends { slug: string }>(
  candidates: { cluster: T[]; sameCategory: T[]; others: T[] },
  navSlugs: (string | null | undefined)[],
  count: number = RELATED_COUNT,
): T[] {
  const nav = new Set(navSlugs.filter((s): s is string => Boolean(s)));
  const base = [...candidates.cluster, ...candidates.sameCategory, ...candidates.others].slice(0, count);
  const kept = base.filter((a) => !nav.has(a.slug));
  const shown = new Set(kept.map((a) => a.slug));
  const clusterFill = candidates.cluster.filter((a) => !nav.has(a.slug) && !shown.has(a.slug));
  return [...kept, ...clusterFill].slice(0, count);
}

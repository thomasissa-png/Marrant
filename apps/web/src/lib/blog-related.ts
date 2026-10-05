/**
 * Cartes « À lire ensuite » d'un article de blog.
 *
 * Ordre de base : articles du cluster, puis même catégorie, puis récents (3 cartes).
 * Jamais 2 fois la même destination sur la page : un article déjà proposé en
 * « Suivant » ou « Précédent » (navigation cluster) est retiré. La place libérée
 * revient au prochain article du même cluster s'il en reste un ; sinon la section
 * affiche moins de cartes (notation iter2, D1).
 *
 * Articles CATALOGUE en base (forte frappe) : pas de cluster par catégorie, dont
 * les satellites (faire rire une fille, un homme) sont hors sujet sous un message
 * pour sa mère ; liste dédiée à la place (curatedRelatedSlugs, notation B4 iter1).
 */
import { FORTE_FRAPPE_SLUGS } from "@/config/blog-forte-frappe";
import { FORTE_FRAPPE_RELATED } from "@/config/blog-related-cards";
import { getClusterForSlug } from "@/lib/blog-clusters";

export const RELATED_COUNT = 3;

/** Étalon des articles forte frappe : dernier recours des listes dédiées. */
export const FORTE_FRAPPE_ETALON_SLUG = "meilleures-blagues-droles-2026";

/**
 * Slugs candidats « À lire ensuite » d'un article CATALOGUE hors cluster
 * (rangé dans aucun cluster par son slug), par ordre de priorité :
 * - liste dédiée (config/blog-related-cards), puis l'étalon ;
 * - sans liste : l'étalon puis les autres articles forte frappe.
 * `null` = règle générale (cluster, même catégorie, récents). Les slugs non
 * visibles sont filtrés par l'appelant.
 */
export function curatedRelatedSlugs(slug: string, category: string): string[] | null {
  if (getClusterForSlug(slug)) return null;
  const curated = FORTE_FRAPPE_RELATED[slug];
  if (!curated && category !== "CATALOGUE") return null;
  const ordered = curated ? [...curated, FORTE_FRAPPE_ETALON_SLUG] : [FORTE_FRAPPE_ETALON_SLUG, ...FORTE_FRAPPE_SLUGS];
  return [...new Set(ordered)].filter((s) => s !== slug);
}

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

/**
 * Visibilité publique d'un article de blog en base (s14, publication programmée).
 *
 * Un article n'est visible (liste /blog, page article, sitemap, llms.txt,
 * llms-full.txt) que s'il est publié ET que sa date de publication est échue.
 * `isPublished` reste le verrou principal ; la date est un garde-fou : un
 * article planifié passé à `isPublished=true` trop tôt par erreur ne sort pas
 * avant sa date. `publishedAt` nul = anciens articles publiés sans date, visibles.
 */
import type { Prisma } from "@prisma/client";

export function visibleBlogArticleWhere(now: Date = new Date()): Prisma.BlogArticleWhereInput {
  return {
    isPublished: true,
    OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
  };
}

export function isBlogArticleVisible(
  article: { isPublished: boolean; publishedAt: Date | null },
  now: Date = new Date(),
): boolean {
  if (!article.isPublished) return false;
  return article.publishedAt === null || article.publishedAt.getTime() <= now.getTime();
}

/**
 * Date de modification publiable : `updatedAt` seulement s'il suit la publication.
 * Un article programmé, corrigé avant sa sortie, n'a pas été « mis à jour »
 * (notation A1 iter3 F1) : ni « Mis à jour le », ni dateModified, ni lastmod.
 */
export function publicUpdatedAt(article: { publishedAt: Date | null; updatedAt: Date | null }): Date | null {
  if (!article.updatedAt) return null;
  if (article.publishedAt && article.updatedAt.getTime() <= article.publishedAt.getTime()) return null;
  return article.updatedAt;
}

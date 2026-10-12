import { blogArticles } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import { REDIRECTED_BLOG_SLUGS, UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import { visibleBlogArticleWhere } from "@/lib/blog-visibility";

/**
 * Derniers articles de l'accueil (maillage S3b, docs/seo/maillage-decouverte-s20.md §4).
 *
 * Même source que /blog : articles en base visibles (`visibleBlogArticleWhere`,
 * publié et daté du passé) hors slugs redirigés, puis articles statiques hors
 * slugs dépubliés ; la base a priorité sur un slug commun. Tri par date de
 * publication décroissante, pilier exclu (déjà lié juste au-dessus).
 * Écarts assumés, comme `latest-blog-article.ts` : un article en base sans date
 * (anciens articles) n'est jamais « récent » (/blog lui prête la date du jour),
 * et un article statique daté du futur n'est pas retenu.
 * Base en erreur (build sans base, panne) : repli sur les seuls articles statiques.
 */

export const PILIER_SLUG = "comment-devenir-drole";
export const DERNIERS_ARTICLES_COUNT = 3;

export interface DernierArticle {
  slug: string;
  title: string;
  /** AAAA-MM-JJ */
  date: string;
}

const toDay = (d: Date) => d.toISOString().split("T")[0];

export async function getDerniersArticles(
  now: Date = new Date(),
  limit: number = DERNIERS_ARTICLES_COUNT,
): Promise<DernierArticle[]> {
  let dbRows: { slug: string; title: string; publishedAt: Date | null }[] = [];
  try {
    dbRows = await prisma.blogArticle.findMany({
      where: { ...visibleBlogArticleWhere(now), slug: { notIn: [...REDIRECTED_BLOG_SLUGS] } },
      select: { slug: true, title: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("[derniers-articles] base indisponible, repli statique", error);
    dbRows = [];
  }

  // Tout slug présent en base masque son homonyme statique, même sans date.
  const dbSlugs = new Set(dbRows.map((a) => a.slug));
  const redirected = new Set<string>(REDIRECTED_BLOG_SLUGS);
  const today = toDay(now);

  const candidates: DernierArticle[] = [
    ...dbRows.flatMap((a) => (a.publishedAt ? [{ slug: a.slug, title: a.title, date: toDay(a.publishedAt) }] : [])),
    ...blogArticles
      .filter((a) => !UNPUBLISHED_STATIC_SLUGS.has(a.slug) && !redirected.has(a.slug) && !dbSlugs.has(a.slug))
      .filter((a) => a.date <= today)
      .map((a) => ({ slug: a.slug, title: a.title, date: a.date })),
  ];

  return candidates
    .filter((a) => a.slug !== PILIER_SLUG)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

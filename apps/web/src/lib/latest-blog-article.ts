import { blogArticles } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import { REDIRECTED_BLOG_SLUGS, UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import { visibleBlogArticleWhere } from "@/lib/blog-visibility";

/**
 * Article de blog le plus récent visible (page /liens, lien de bio Instagram).
 *
 * Même source que /blog : articles en base visibles (`visibleBlogArticleWhere`,
 * publié et daté du passé) hors slugs redirigés, puis articles statiques de
 * `blog-articles.ts` hors slugs dépubliés. La base a priorité sur un slug commun.
 * Écarts assumés : un article en base sans date (anciens articles) n'est jamais
 * « le plus récent » (/blog lui attribue la date du jour à l'affichage), et un
 * article statique daté du futur n'est pas retenu.
 */

export interface LatestBlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  /** AAAA-MM-JJ */
  date: string;
  /**
   * Instant de publication (ISO), pour la règle des 48 h de /liens. Article
   * statique (date seule) : minuit UTC du jour indiqué.
   */
  publishedAt: string;
  readingTime: string;
}

const toDay = (d: Date) => d.toISOString().split("T")[0];

/** Lève en cas d'erreur base : `getLatestBlogArticle` gère le repli. */
async function loadLatestDbArticle(now: Date): Promise<LatestBlogArticle | null> {
  const article = await prisma.blogArticle.findFirst({
    where: {
      AND: [visibleBlogArticleWhere(now), { publishedAt: { not: null } }],
      slug: { notIn: [...REDIRECTED_BLOG_SLUGS] },
    },
    select: { slug: true, title: true, excerpt: true, publishedAt: true, readingTime: true },
    orderBy: { publishedAt: "desc" },
  });
  if (!article?.publishedAt) return null;
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    date: toDay(article.publishedAt),
    publishedAt: article.publishedAt.toISOString(),
    readingTime: article.readingTime,
  };
}

function latestStaticArticle(now: Date, excludedSlugs: Set<string>): LatestBlogArticle | null {
  const today = toDay(now);
  const redirected = new Set(REDIRECTED_BLOG_SLUGS);
  const candidates = blogArticles
    .filter((a) => !UNPUBLISHED_STATIC_SLUGS.has(a.slug) && !redirected.has(a.slug))
    .filter((a) => !excludedSlugs.has(a.slug) && a.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date));
  const a = candidates[0];
  return a
    ? {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        date: a.date,
        publishedAt: `${a.date}T00:00:00.000Z`,
        readingTime: a.readingTime,
      }
    : null;
}

export async function getLatestBlogArticle(now: Date = new Date()): Promise<LatestBlogArticle | null> {
  let dbArticle: LatestBlogArticle | null = null;
  try {
    dbArticle = await loadLatestDbArticle(now);
  } catch (error) {
    // Base indisponible (build sans base, panne) : on retombe sur les articles statiques.
    console.error("[latest-blog-article] base indisponible", error);
  }
  const staticArticle = latestStaticArticle(now, new Set(dbArticle ? [dbArticle.slug] : []));
  if (!dbArticle) return staticArticle;
  if (!staticArticle) return dbArticle;
  return staticArticle.date > dbArticle.date ? staticArticle : dbArticle;
}

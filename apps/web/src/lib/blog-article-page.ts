/**
 * Données de la page article, partagées par `/blog/[slug]` (public) et
 * `/blog/apercu/[slug]` (aperçu admin) : même article, même maillage.
 */
import { blogArticles, getArticleBySlug, type BlogArticle } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { getRelatedSlugs, getNextInCluster, getPrevInCluster, resolveCluster } from "@/lib/blog-clusters";
import { pickRelatedArticles } from "@/lib/blog-related";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo-redirects";
import { isBlogArticleVisible, visibleBlogArticleWhere } from "@/lib/blog-visibility";
import { splitTrailingFaq } from "@/lib/blog-faq";

/** Article rendu (statique ou base) : même forme que les articles statiques. */
export type BlogArticleData = BlogArticle;

export interface ArticleLink {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  date: string;
}

export interface BlogArticleNavigation {
  cluster: ReturnType<typeof resolveCluster>;
  nextArticle: ArticleLink | null;
  prevArticle: ArticleLink | null;
  relatedArticles: ArticleLink[];
}

/** Article trouvé + état de publication (pour le bandeau d'aperçu). */
export interface FoundBlogArticle {
  article: BlogArticleData;
  /** Date de publication (prévue ou passée), null si non programmée. */
  publishAt: Date | null;
  /** Visible publiquement aujourd'hui (publié ET date échue). */
  isVisible: boolean;
}

/**
 * Cherche un article : statiques d'abord (toujours publiés), puis base.
 * `includeScheduled` (aperçu uniquement) renvoie aussi un article en base non
 * publié ou programmé ; sinon seuls les articles visibles (lib/blog-visibility).
 * Erreur DB = exception (page 500 retentée, version ISR en cache gardée) et non
 * `null` : notFound() servirait un 404 mis en cache sur un article qui existe.
 */
export async function findBlogArticle(
  slug: string,
  { includeScheduled = false }: { includeScheduled?: boolean } = {},
): Promise<FoundBlogArticle | null> {
  const staticArticle = getArticleBySlug(slug);
  if (staticArticle) {
    return { article: staticArticle, publishAt: new Date(`${staticArticle.date}T00:00:00Z`), isVisible: true };
  }

  const dbArticle = await withDbRetry(
    () => prisma.blogArticle.findUnique({ where: { slug } }),
    { label: "blog:findArticle" },
  );
  if (!dbArticle) return null;
  const isVisible = isBlogArticleVisible(dbArticle);
  if (!isVisible && !includeScheduled) return null;

  // FAQ stockée en fin de `content` (lib/blog-faq) : rendue comme celle des statiques.
  const { content, faqs } = splitTrailingFaq(dbArticle.content);
  return {
    article: {
      slug: dbArticle.slug,
      title: dbArticle.metaTitle || dbArticle.title,
      excerpt: dbArticle.metaDescription || dbArticle.excerpt,
      content,
      date: dbArticle.publishedAt
        ? dbArticle.publishedAt.toISOString().split("T")[0]
        : dbArticle.createdAt.toISOString().split("T")[0],
      // Vrai updatedAt de la DB (colonne Prisma) : utilisé pour Article.dateModified
      updatedAt: dbArticle.updatedAt ? dbArticle.updatedAt.toISOString().split("T")[0] : undefined,
      readingTime: dbArticle.readingTime,
      category: dbArticle.category,
      faqs,
    },
    publishAt: dbArticle.publishedAt,
    isVisible,
  };
}

/** Articles liés, précédent / suivant du cluster : uniquement des articles visibles. */
export async function loadBlogArticleNavigation(article: BlogArticleData): Promise<BlogArticleNavigation> {
  // Articles redirigés (fusion/cannibalisation/renommage) exclus : jamais de lien
  // interne vers une URL qui redirige (liés, précédent/suivant).
  const redirected = new Set<string>(REDIRECTED_BLOG_SLUGS);
  const allAvailableArticles: ArticleLink[] = blogArticles
    .filter((a) => !redirected.has(a.slug))
    .map((a) => ({ slug: a.slug, title: a.title, category: a.category, readingTime: a.readingTime, date: a.date }));
  try {
    const dbArticles = await prisma.blogArticle.findMany({
      where: { ...visibleBlogArticleWhere(), slug: { notIn: [...REDIRECTED_BLOG_SLUGS] } },
      select: { slug: true, title: true, category: true, readingTime: true, publishedAt: true },
    });
    const seen = new Set(allAvailableArticles.map((a) => a.slug));
    for (const a of dbArticles) {
      if (seen.has(a.slug)) continue;
      allAvailableArticles.push({
        slug: a.slug, title: a.title, category: a.category, readingTime: a.readingTime,
        date: a.publishedAt ? a.publishedAt.toISOString().split("T")[0] : "",
      });
    }
  } catch {}

  // Cluster d'abord, puis même catégorie, puis récents.
  const cluster = resolveCluster(article.slug, article.category);
  const clusterRelatedSlugs = getRelatedSlugs(article.slug, article.category);
  const clusterArticles = clusterRelatedSlugs
    .map((s) => allAvailableArticles.find((a) => a.slug === s))
    .filter(Boolean) as ArticleLink[];
  const sameCategoryArticles = allAvailableArticles
    .filter((a) => a.slug !== article.slug && a.category === article.category && !clusterRelatedSlugs.includes(a.slug))
    .sort((a, b) => b.date.localeCompare(a.date));
  const otherArticles = allAvailableArticles
    .filter((a) => a.slug !== article.slug && a.category !== article.category && !clusterRelatedSlugs.includes(a.slug))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Suivant / précédent dans le cluster (slugs pré-enregistrés uniquement).
  const nextSlug = getNextInCluster(article.slug);
  const prevSlug = getPrevInCluster(article.slug);
  const nextArticle = (nextSlug && allAvailableArticles.find((a) => a.slug === nextSlug)) || null;
  const prevArticle = (prevSlug && allAvailableArticles.find((a) => a.slug === prevSlug)) || null;

  // « À lire ensuite » ne reprend pas les cartes Suivant / Précédent affichées.
  const relatedArticles = pickRelatedArticles(
    { cluster: clusterArticles, sameCategory: sameCategoryArticles, others: otherArticles },
    cluster ? [nextArticle?.slug, prevArticle?.slug] : [],
  );

  return { cluster, nextArticle, prevArticle, relatedArticles };
}

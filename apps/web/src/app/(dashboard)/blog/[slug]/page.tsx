import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArticleCta } from "@/components/blog/article-cta";
import { blogArticles, getArticleBySlug } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import {
  JsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHowToJsonLd,
  authorPersonJsonLd,
} from "@/components/seo/json-ld";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { frTypo } from "@/lib/fr-typo";
import { blogCategoryLabel } from "@/lib/blog-labels";
import { formatIsoDateFr } from "@/lib/utils";
import { getRelatedSlugs, getNextInCluster, getPrevInCluster, resolveCluster } from "@/lib/blog-clusters";
import { BlogArticleParcoursMaillage } from "@/components/blog/blog-article-parcours-maillage";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo-redirects";
import { fitDescription, fitTitle } from "@/lib/seo-meta";
import { isBlogArticleVisible, visibleBlogArticleWhere } from "@/lib/blog-visibility";
import { splitTrailingFaq } from "@/lib/blog-faq";

export const revalidate = 3600;

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

async function findArticle(slug: string) {
  // Chercher d'abord dans les articles statiques (inclut faqs)
  const staticArticle = getArticleBySlug(slug);
  if (staticArticle) return staticArticle;

  // Sinon chercher en base de données. Erreur DB = exception (page 500 retentée,
  // version ISR en cache gardée) et non `null` : notFound() servirait un 404
  // mis en cache sur un article qui existe.
  const dbArticle = await withDbRetry(
    () => prisma.blogArticle.findUnique({ where: { slug } }),
    { label: "blog:findArticle" },
  );
  // Visible = publié ET date échue (lib/blog-visibility) : jamais d'article planifié.
  // FAQ stockée en fin de `content` (lib/blog-faq) : rendue comme celle des statiques.
  if (dbArticle && isBlogArticleVisible(dbArticle)) {
    const { content, faqs } = splitTrailingFaq(dbArticle.content);
    return {
      slug: dbArticle.slug,
      title: dbArticle.metaTitle || dbArticle.title,
      excerpt: dbArticle.metaDescription || dbArticle.excerpt,
      content,
      date: dbArticle.publishedAt
        ? dbArticle.publishedAt.toISOString().split("T")[0]
        : dbArticle.createdAt.toISOString().split("T")[0],
      // Vrai updatedAt de la DB (colonne Prisma) — utilisé pour Article.dateModified
      updatedAt: dbArticle.updatedAt
        ? dbArticle.updatedAt.toISOString().split("T")[0]
        : undefined,
      readingTime: dbArticle.readingTime,
      category: dbArticle.category,
      faqs,
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await findArticle(params.slug);
  if (!article) {
    return { title: "Article introuvable" };
  }
  // Titre = H1 exact (jamais tronqué en « ... ») : template si ≤ 60 car. avec
  // la marque, sinon titre seul (cf. lib/seo-meta.ts — passe SEO finale s11).
  const description = fitDescription(article.excerpt);
  return {
    title: fitTitle(article.title),
    description,
    alternates: {
      canonical: `https://deviens-marrant.fr/blog/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: `https://deviens-marrant.fr/blog/${article.slug}`,
      siteName: "deviens-marrant.fr",
      locale: "fr_FR",
      publishedTime: article.date,
      modifiedTime: "updatedAt" in article && article.updatedAt ? article.updatedAt : article.date,
      authors: ["https://deviens-marrant.fr/a-propos"],
      section: article.category,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await findArticle(params.slug);

  if (!article) {
    notFound();
  }

  // Merge static + DB articles for lookup
  // Articles redirigés (fusion/cannibalisation/renommage) exclus : jamais de lien
  // interne vers une URL qui redirige (liés, précédent/suivant).
  const redirected = new Set<string>(REDIRECTED_BLOG_SLUGS);
  let allAvailableArticles: { slug: string; title: string; category: string; readingTime: string; date: string }[] = blogArticles
    .filter((a) => !redirected.has(a.slug))
    .map((a) => ({
      slug: a.slug, title: a.title, category: a.category, readingTime: a.readingTime, date: a.date,
    }));
  try {
    const dbArticles = await prisma.blogArticle.findMany({
      where: { ...visibleBlogArticleWhere(), slug: { notIn: [...REDIRECTED_BLOG_SLUGS] } },
      select: { slug: true, title: true, category: true, readingTime: true, publishedAt: true },
    });
    const dbMapped = dbArticles.map((a) => ({
      slug: a.slug, title: a.title, category: a.category, readingTime: a.readingTime,
      date: a.publishedAt ? a.publishedAt.toISOString().split("T")[0] : "",
    }));
    const seen = new Set(allAvailableArticles.map((a) => a.slug));
    for (const a of dbMapped) {
      if (!seen.has(a.slug)) allAvailableArticles.push(a);
    }
  } catch {}

  // Cluster-based related articles (with category fallback for DB articles)
  const cluster = resolveCluster(article.slug, article.category);
  const clusterRelatedSlugs = getRelatedSlugs(article.slug, article.category);

  // Prefer cluster articles, then fill with same-category articles, then recent
  const clusterArticles = clusterRelatedSlugs
    .map((s) => allAvailableArticles.find((a) => a.slug === s))
    .filter(Boolean) as typeof allAvailableArticles;
  const sameCategoryArticles = allAvailableArticles
    .filter((a) => a.slug !== article.slug && a.category === article.category && !clusterRelatedSlugs.includes(a.slug))
    .sort((a, b) => b.date.localeCompare(a.date));
  const otherArticles = allAvailableArticles
    .filter((a) => a.slug !== article.slug && a.category !== article.category && !clusterRelatedSlugs.includes(a.slug))
    .sort((a, b) => b.date.localeCompare(a.date));
  const relatedArticles = [...clusterArticles, ...sameCategoryArticles, ...otherArticles].slice(0, 3);

  // Next/prev in cluster (only for pre-registered slugs — sequential nav)
  const nextSlug = getNextInCluster(article.slug);
  const prevSlug = getPrevInCluster(article.slug);
  const nextArticle = nextSlug ? allAvailableArticles.find((a) => a.slug === nextSlug) : null;
  const prevArticle = prevSlug ? allAvailableArticles.find((a) => a.slug === prevSlug) : null;

  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={buildArticleJsonLd(article)} />
      <JsonLd data={authorPersonJsonLd} />
      {"faqs" in article && article.faqs && article.faqs.length > 0 && (
        <JsonLd data={buildFaqJsonLd(article.faqs)} />
      )}
      {/* HowTo schema pour les articles tutoriels — Rich Snippets avec étapes dans les SERP */}
      {["GUIDE", "PRATIQUE", "ROADMAP"].includes(article.category) && (() => {
        const h2Matches = article.content.match(/^## (.+)$/gm);
        if (h2Matches && h2Matches.length >= 3) {
          const steps = h2Matches.slice(0, 8).map((h2: string) => {
            const name = h2.replace(/^## /, "").replace(/\*\*/g, "");
            return { name, text: name };
          });
          return <JsonLd data={buildHowToJsonLd({ name: article.title, description: article.excerpt, steps })} />;
        }
        return null;
      })()}
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Blog", url: "https://deviens-marrant.fr/blog" },
          {
            name: article.title,
            url: `https://deviens-marrant.fr/blog/${article.slug}`,
          },
        ])}
      />

      {/* Breadcrumb visuel */}
      <nav
        aria-label="Fil d'Ariane"
        className="mb-6 text-sm text-text-muted"
      >
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-text-primary max-md:py-3.5">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="inline-block max-w-[55vw] truncate align-bottom text-text-secondary sm:max-w-none">
          {frTypo(article.title)}
        </span>
      </nav>

      <Badge variant="primary" className="mb-4">
        {blogCategoryLabel(article.category)}
      </Badge>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        {frTypo(article.title)}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <span>Par <Link href="/a-propos" className="text-text-secondary hover:text-accent-link">Alex Durand</Link></span>
        <span>·</span>
        <time dateTime={article.date}>{formatIsoDateFr(article.date)}</time>
        {/* Fraîcheur visible = même source que Article.dateModified (JSON-LD). */}
        {"updatedAt" in article && article.updatedAt && article.updatedAt !== article.date && (
          <>
            <span>·</span>
            <span>
              Mis à jour le <time dateTime={article.updatedAt}>{formatIsoDateFr(article.updatedAt)}</time>
            </span>
          </>
        )}
        <span>·</span>
        <span>{article.readingTime} de lecture</span>
      </div>

      <MarkdownRenderer content={article.content} className="mt-8" />

      {/* FAQ Schema */}
      {"faqs" in article && article.faqs && article.faqs.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-xl font-bold text-text-primary">
            Questions fréquentes
          </h2>
          <dl className="mt-4 space-y-4">
            {article.faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-border bg-background-card p-4">
                <dt className="text-sm font-semibold text-text-primary">{faq.question}</dt>
                <dd className="mt-2 text-sm text-text-secondary">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Navigation dans le cluster */}
      {cluster && (nextArticle || prevArticle) && (
        <nav className="mt-12 border-t border-border pt-8" aria-label="Navigation dans le cluster">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-text-muted">
            {cluster.name}
          </p>
          {/* T37 : carte seule = demi-largeur en desktop (côté de son sens), texte à gauche en mobile */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {prevArticle && (
              <Link
                href={`/blog/${prevArticle.slug}`}
                className={`rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40 ${nextArticle ? "flex-1" : "sm:w-1/2"}`}
              >
                <span className="text-xs text-text-muted">Précédent</span>
                <p className="mt-1 text-sm font-semibold text-text-primary line-clamp-2">
                  {prevArticle.title}
                </p>
              </Link>
            )}
            {nextArticle && (
              <Link
                href={`/blog/${nextArticle.slug}`}
                className={`rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40 sm:text-right ${prevArticle ? "flex-1" : "sm:ml-auto sm:w-1/2"}`}
              >
                <span className="text-xs text-text-muted">Suivant</span>
                <p className="mt-1 text-sm font-semibold text-text-primary line-clamp-2">
                  {nextArticle.title}
                </p>
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Articles similaires */}
      {relatedArticles.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-xl font-bold text-text-primary">
            À lire ensuite
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
              >
                <Badge variant="primary" className="mb-2 text-xs">
                  {blogCategoryLabel(related.category)}
                </Badge>
                <h3 className="text-sm font-semibold text-text-primary line-clamp-2">
                  {related.title}
                </h3>
                <p className="mt-1 text-xs text-text-muted">
                  {related.readingTime} de lecture
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Maillage contextuel vers le parcours pertinent selon le cluster. */}
      <BlogArticleParcoursMaillage
        articleSlug={article.slug}
        articleCategory={article.category}
      />

      {/* CTA double (essai gratuit + premium), collé au parcours recommandé (T35) */}
      <ArticleCta />
    </article>
  );
}

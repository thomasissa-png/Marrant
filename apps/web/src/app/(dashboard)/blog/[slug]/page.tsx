import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogArticles, getArticleBySlug } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import {
  JsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHowToJsonLd,
  authorPersonJsonLd,
} from "@/components/seo/json-ld";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { getRelatedSlugs, getNextInCluster, getPrevInCluster, resolveCluster } from "@/lib/blog-clusters";

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

  // Sinon chercher en base de données
  try {
    const dbArticle = await prisma.blogArticle.findUnique({
      where: { slug },
    });
    if (dbArticle && dbArticle.isPublished) {
      return {
        slug: dbArticle.slug,
        title: dbArticle.metaTitle || dbArticle.title,
        excerpt: dbArticle.metaDescription || dbArticle.excerpt,
        content: dbArticle.content,
        date: dbArticle.publishedAt
          ? dbArticle.publishedAt.toISOString().split("T")[0]
          : dbArticle.createdAt.toISOString().split("T")[0],
        readingTime: dbArticle.readingTime,
        category: dbArticle.category,
      };
    }
  } catch {
    // Table pas encore migrée
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
  // Template adds " | deviens-marrant.fr" (21 chars) — keep title ≤ 39 chars for total ≤ 60
  const seoTitle = article.title.length > 39
    ? article.title.slice(0, 36) + "..."
    : article.title;
  return {
    title: seoTitle,
    description: article.excerpt,
    alternates: {
      canonical: `https://deviens-marrant.fr/blog/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `https://deviens-marrant.fr/blog/${article.slug}`,
      siteName: "deviens-marrant.fr",
      locale: "fr_FR",
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ["https://deviens-marrant.fr/a-propos"],
      section: article.category,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
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
  let allAvailableArticles: { slug: string; title: string; category: string; readingTime: string; date: string }[] = blogArticles.map((a) => ({
    slug: a.slug, title: a.title, category: a.category, readingTime: a.readingTime, date: a.date,
  }));
  try {
    const dbArticles = await prisma.blogArticle.findMany({
      where: { isPublished: true },
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
    <article className="mx-auto max-w-3xl py-8">
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
        <Link href="/" className="hover:text-text-primary">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-text-primary">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">{article.title}</span>
      </nav>

      <Badge variant="primary" className="mb-4">
        {article.category}
      </Badge>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        {article.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <span>Par <Link href="/a-propos" className="text-text-secondary hover:text-accent-primary">Alex Durand</Link></span>
        <span>·</span>
        <span>{article.date}</span>
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
          <div className="flex gap-4">
            {prevArticle && (
              <Link
                href={`/blog/${prevArticle.slug}`}
                className="flex-1 rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
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
                className="flex-1 rounded-lg border border-border bg-background-card p-4 text-right transition-colors hover:border-accent-primary/40"
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
            Continue ta progression
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
              >
                <Badge variant="primary" className="mb-2 text-xs">
                  {related.category}
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

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
        <p className="font-display text-xl font-bold text-text-primary">
          Envie de passer à l&apos;action ?
        </p>
        <p className="mt-2 text-text-secondary">
          Des exercices concrets, des parcours pas à pas, et un système de
          progression qui te motive chaque jour.
        </p>
        <Link href="/register" className="mt-4 inline-block">
          <Button variant="primary" size="lg">
            Commencer à 0,99 €/mois
          </Button>
        </Link>
      </div>
    </article>
  );
}

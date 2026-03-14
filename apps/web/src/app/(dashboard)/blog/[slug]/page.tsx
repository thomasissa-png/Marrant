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
} from "@/components/seo/json-ld";

export const revalidate = 3600;

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

async function findArticle(slug: string) {
  // Chercher d'abord dans les articles statiques
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
  return {
    title: article.title,
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
      authors: ["deviens-marrant.fr"],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
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

  const paragraphs = article.content.split("\n\n");

  // Trouver des articles similaires pour le cross-linking
  const relatedArticles = blogArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl py-8">
      <JsonLd data={buildArticleJsonLd(article)} />
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
        <span>Par Alex Durand</span>
        <span>·</span>
        <span>{article.date}</span>
        <span>·</span>
        <span>{article.readingTime} de lecture</span>
      </div>

      <div className="mt-8 space-y-4 text-text-secondary leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

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
            Essaie gratuitement
          </Button>
        </Link>
      </div>
    </article>
  );
}

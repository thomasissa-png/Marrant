import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogArticles, getArticleBySlug } from "@/lib/blog-articles";

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: "Article introuvable" };
  }
  return {
    title: `${article.title} | Blog deviensmarrant`,
    description: article.excerpt,
  };
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const paragraphs = article.content.split("\n\n");

  return (
    <article className="mx-auto max-w-3xl py-8">
      <Badge variant="primary" className="mb-4">
        {article.category}
      </Badge>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        {article.title}
      </h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
        <span>{article.date}</span>
        <span>·</span>
        <span>{article.readingTime} de lecture</span>
      </div>

      <div className="mt-8 space-y-4 text-text-secondary leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

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

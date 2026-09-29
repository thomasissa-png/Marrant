"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { frTypo } from "@/lib/fr-typo";
import { blogCategoryLabel } from "@/lib/blog-labels";
import { formatIsoDateFr } from "@/lib/utils";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
}

interface BlogListClientProps {
  articles: Article[];
  categories: string[];
}

export function BlogListClient({ articles, categories }: BlogListClientProps) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || undefined;

  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  return (
    <>
      {/* Category filter : une seule rangée défilante sur mobile, cibles 44 px (T32) */}
      <div className="-mx-4 mb-6 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
        <Link
          href="/blog"
          className={`inline-flex min-h-[44px] shrink-0 snap-start items-center whitespace-nowrap rounded-full px-4 text-sm transition-colors ${
            !selectedCategory
              ? "bg-accent-secondary-hover text-white"
              : "bg-background-elevated text-text-secondary hover:text-text-primary"
          }`}
        >
          Tous
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${cat}`}
            className={`inline-flex min-h-[44px] shrink-0 snap-start items-center whitespace-nowrap rounded-full px-4 text-sm transition-colors ${
              selectedCategory === cat
                ? "bg-accent-secondary-hover text-white"
                : "bg-background-elevated text-text-secondary hover:text-text-primary"
            }`}
          >
            {blogCategoryLabel(cat)}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredArticles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="block">
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col p-0">
                <Badge variant="primary" className="mb-3 w-fit">
                  {blogCategoryLabel(article.category)}
                </Badge>
                <h2 className="font-display text-lg font-bold text-text-primary">
                  {frTypo(article.title)}
                </h2>
                <p className="mt-2 flex-1 text-sm text-text-secondary">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                  <span>{formatIsoDateFr(article.date)}</span>
                  <span>·</span>
                  <span>{article.readingTime} de lecture</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <p className="py-12 text-center text-text-muted">
          Aucun article dans cette catégorie pour le moment.
        </p>
      )}
    </>
  );
}

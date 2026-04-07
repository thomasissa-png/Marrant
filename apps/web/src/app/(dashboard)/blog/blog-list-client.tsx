"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`rounded-full px-3 py-1 text-sm transition-colors ${
            !selectedCategory
              ? "bg-accent-primary text-white"
              : "bg-background-elevated text-text-secondary hover:text-text-primary"
          }`}
        >
          Tous
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${cat}`}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              selectedCategory === cat
                ? "bg-accent-primary text-white"
                : "bg-background-elevated text-text-secondary hover:text-text-primary"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredArticles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col p-5">
                <Badge variant="primary" className="mb-3 w-fit">
                  {article.category}
                </Badge>
                <h2 className="font-display text-lg font-bold text-text-primary">
                  {article.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-text-secondary">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                  <span>{article.date}</span>
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

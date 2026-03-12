import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogArticles } from "@/lib/blog-articles";

export const metadata: Metadata = {
  title: "Blog | Conseils humour, répartie et techniques",
  description:
    "Articles pratiques pour améliorer ton humour, ta répartie et tes interactions sociales. Techniques de pros, exercices concrets et conseils actionnables.",
};

export default function BlogPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Blog humour et répartie
        </h1>
        <p className="mt-2 text-text-secondary">
          Articles pratiques pour progresser en humour, répartie et
          conversation. Des techniques concrètes, des exemples et des
          exercices à tester dès aujourd&apos;hui.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {blogArticles.map((article) => (
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
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogArticles } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Blog humour — comment devenir drôle, avoir de la répartie et faire rire",
  description:
    "Articles et guides complets pour apprendre à devenir drôle, avoir de la répartie et développer son sens de l'humour. Techniques d'humoristes, exercices concrets, conseils pour timides et débutants. Deviens marrant pas à pas.",
  alternates: { canonical: "https://deviens-marrant.fr/blog" },
};

export const revalidate = 3600; // Revalider toutes les heures

async function getAllArticles() {
  // Articles dynamiques depuis la base de données
  let dbArticles: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    publishedAt: Date | null;
    readingTime: string;
  }[] = [];

  try {
    dbArticles = await prisma.blogArticle.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        publishedAt: true,
        readingTime: true,
      },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    // La table n'existe peut-être pas encore (avant migration)
  }

  // Fusionner les articles statiques et dynamiques
  const allArticles = [
    ...dbArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      date: a.publishedAt
        ? a.publishedAt.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      readingTime: a.readingTime,
    })),
    ...blogArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      date: a.date,
      readingTime: a.readingTime,
    })),
  ];

  // Dédupliquer par slug (DB a priorité)
  const seen = new Set<string>();
  return allArticles.filter((a) => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });
}

export default async function BlogPage() {
  const allArticles = await getAllArticles();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Blog", url: "https://deviens-marrant.fr/blog" },
        ])}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Blog</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Comment devenir drôle : guides et techniques d&apos;humour
        </h1>
        <p className="mt-2 text-text-secondary">
          Articles complets pour apprendre à devenir drôle, avoir de la
          répartie et développer ton sens de l&apos;humour. Des techniques
          d&apos;humoristes pros, des exercices concrets et des guides pas à
          pas, que tu sois débutant, timide ou en quête de nouvelles
          inspirations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {allArticles.map((article) => (
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

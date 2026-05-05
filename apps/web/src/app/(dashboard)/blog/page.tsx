import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { blogArticles } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
} from "@/components/seo/json-ld";
import { BlogListClient } from "./blog-list-client";

export const metadata: Metadata = {
  title: "Blog humour — guides et techniques",
  description:
    "Le blog qui t'apprend l'humour en te faisant rire. Techniques de stand-up, analyses d'humoristes et exercices testés. Si tu souris pas, on a raté notre job.",
  keywords: [
    "blog humour",
    "guide répartie",
    "comment devenir drôle",
    "techniques humour",
    "apprendre à être drôle",
    "exercices humour",
  ],
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
  const unique = allArticles.filter((a) => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });

  // Trier du plus récent au plus ancien
  return unique.sort((a, b) => b.date.localeCompare(a.date));
}

export default async function BlogPage() {
  const allArticles = await getAllArticles();

  // Extract unique categories
  const categories = Array.from(new Set(allArticles.map((a) => a.category))).sort();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Blog", url: "https://deviens-marrant.fr/blog" },
        ])}
      />
      <JsonLd
        data={buildItemListJsonLd(
          allArticles.map((article, index) => ({
            name: article.title,
            url: `https://deviens-marrant.fr/blog/${article.slug}`,
            position: index + 1,
          }))
        )}
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
          Guides pratiques pour devenir drôle, avoir de la répartie et
          développer ton humour. Des techniques volées aux meilleurs
          humoristes, des exercices testables immédiatement, et zéro blabla.
          Si tu lis un article et que tu ne souris pas au moins une fois,
          on a raté notre job.
        </p>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-text-secondary">Chargement des articles…</div>}>
        <BlogListClient articles={allArticles} categories={categories} />
      </Suspense>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Explore aussi</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/glossaire" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Glossaire humour</h3>
            <p className="mt-1 text-xs text-text-secondary">Répartie, timing, punchline : les termes clés expliqués simplement.</p>
          </Link>
          <Link href="/parcours" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Parcours structurés</h3>
            <p className="mt-1 text-xs text-text-secondary">Progresse semaine après semaine avec des exercices concrets.</p>
          </Link>
          <Link href="/a-propos" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">À propos</h3>
            <p className="mt-1 text-xs text-text-secondary">Notre mission : prouver que l&apos;humour s&apos;apprend.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

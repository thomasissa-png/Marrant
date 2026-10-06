import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { blogArticles } from "@/lib/blog-articles";
import { prisma } from "@/lib/prisma";
import { REDIRECTED_BLOG_SLUGS, UNPUBLISHED_STATIC_SLUGS } from "@/lib/seo-redirects";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
} from "@/components/seo/json-ld";
import { BlogListClient, BlogListView } from "./blog-list-client";
import { PageHeader } from "@/components/layout/page-header";
import { visibleBlogArticleWhere } from "@/lib/blog-visibility";

export const metadata: Metadata = {
  title: "Blog humour — guides et techniques",
  description:
    "Le blog qui t'apprend l'humour en te faisant rire : techniques de stand-up, répartie, analyses d'humoristes et exercices à tester. Si tu souris pas, on a raté.",
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
      where: { ...visibleBlogArticleWhere(), slug: { notIn: [...REDIRECTED_BLOG_SLUGS] } },
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
    ...blogArticles
      // Exclure les slugs dépubliés (cannibalisation s11 — fusion en pillar).
      .filter((a) => !UNPUBLISHED_STATIC_SLUGS.has(a.slug))
      .map((a) => ({
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
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Blog</span>
      </nav>
      <PageHeader
        title={<>Comment devenir drôle&nbsp;: guides et techniques d&apos;humour</>}
        lead={
          <>
            Guides pratiques pour devenir drôle, avoir de la répartie et
            développer ton humour. Des techniques volées aux meilleurs
            humoristes, des exercices testables immédiatement, et zéro blabla.
            Si tu lis un article et que tu ne souris pas au moins une fois,
            on a raté notre job.
          </>
        }
      />

      {/* Bloc « Commence ici » vers le pilier SEO (docs/seo/pilier-non-indexe-s15.md, L3).
          Pas de titre Hn : la hiérarchie de titres de /blog reste inchangée. */}
      <aside aria-label="Commence ici" className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Commence ici</p>
        <Link
          href="/blog/comment-devenir-drole"
          className="block rounded-lg border border-accent-primary/40 bg-background-card p-4 transition-colors hover:border-accent-primary"
        >
          <span className="block font-display text-lg font-bold text-text-primary">Comment devenir drôle : le guide</span>
          <span className="mt-1 block text-sm text-text-secondary">
            Les 5 piliers, ce qu&apos;en dit la science et un plan sur 30 jours.
          </span>
        </Link>
      </aside>

      {/* Fallback = liste complète rendue dans le HTML statique (liens crawlables, lot S1 s14) ;
          le client applique ensuite le filtre `?category=`. */}
      <Suspense fallback={<BlogListView articles={allArticles} categories={categories} />}>
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
            <p className="mt-1 text-xs text-text-secondary">Tu as lu la théorie ? Les parcours te font passer à la pratique, une semaine à la fois.</p>
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

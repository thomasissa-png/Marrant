// Rendu : ISR 1 h (contenu public, statiques pré-générés). Gabarit partagé avec
// l'aperçu admin /blog/apercu/[slug] (components/blog/blog-article-view.tsx).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleView } from "@/components/blog/blog-article-view";
import { blogArticles } from "@/lib/blog-articles";
import { findBlogArticle, loadBlogArticleNavigation } from "@/lib/blog-article-page";
import { fitDescription, fitTitle } from "@/lib/seo-meta";

export const revalidate = 3600;

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = (await findBlogArticle(params.slug))?.article;
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
      modifiedTime: article.updatedAt || article.date,
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
  const found = await findBlogArticle(params.slug);
  if (!found) {
    notFound();
  }
  const navigation = await loadBlogArticleNavigation(found.article);
  return <BlogArticleView article={found.article} navigation={navigation} />;
}

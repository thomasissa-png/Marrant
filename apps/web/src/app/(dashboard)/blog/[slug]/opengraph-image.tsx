import { ImageResponse } from "next/og";
import { blogArticles } from "@/lib/blog-articles";
import { findBlogArticle } from "@/lib/blog-article-page";
import { blogCategoryLabel } from "@/lib/blog-labels";
import { getFonts } from "@/lib/social/polices";
import { OgArticle } from "@/lib/social/templates/cartes-og";

// Runtime Node.js (défaut) : OpenNext/Cloudflare refuse les routes `runtime = "edge"`
// dans le bundle serveur (migration Cloudflare, étape B). Même rendu `next/og`.
// Gabarit : spec @design cycle 8 §1 (titre Plus Jakarta 800, 3 lignes, plancher 48 px).
export const alt = "Article blog | deviens-marrant.fr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Même fraîcheur que la page : un article en base publié après le build a son image (s15, 06/10).
export const revalidate = 3600;

/** Repli : article introuvable, programmé ou base en erreur (jamais « Article introuvable »). */
const TITRE_REPLI_BLOG = "Le blog humour et répartie";

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export default async function OgImage({ params }: { params: { slug: string } }) {
  // Polices AVANT toute composition : elles alimentent la mise en lignes mesurée.
  const fonts = await getFonts();
  // s15 (06/10) : articles statiques ET articles en base (même résolution que la page).
  // Sans `includeScheduled` : un article programmé renvoie null, son titre ne fuit pas.
  const article = (await findBlogArticle(params.slug).catch(() => null))?.article ?? null;
  const title = article?.title ?? TITRE_REPLI_BLOG;
  // Libellé lisible, comme sur la page (jamais le code interne, ex. « CATALOGUE »).
  const category = article?.category ? blogCategoryLabel(article.category) : "";

  return new ImageResponse(<OgArticle titre={title} etiquette={category || undefined} />, { ...size, fonts });
}

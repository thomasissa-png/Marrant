// Rendu : SSR dynamique, aucun cache partagé (aperçu admin d'un article, même
// programmé). Gabarit identique à /blog/[slug] + bandeau de date. Accès :
// `Authorization: Bearer <ADMIN_PASSWORD>` ou cookie posé par le middleware
// (`?cle=`). Sans autorisation : 404, rien n'est révélé. Absent du sitemap et de
// llms (ils ne listent que /blog/<slug> visibles) ; Umami muet sous /blog/apercu.
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { BlogArticleView } from "@/components/blog/blog-article-view";
import { BlogPreviewBanner } from "@/components/blog/blog-preview-banner";
import { BLOG_PREVIEW_COOKIE } from "@/config/blog-preview";
import { findBlogArticle, loadBlogArticleNavigation } from "@/lib/blog-article-page";
import { isPreviewAuthorized } from "@/lib/blog-preview-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aperçu d'article",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default async function BlogArticlePreviewPage({ params }: { params: { slug: string } }) {
  const authorized = await isPreviewAuthorized({
    authorization: headers().get("authorization"),
    cookie: cookies().get(BLOG_PREVIEW_COOKIE)?.value,
  });
  if (!authorized) {
    notFound();
  }

  const found = await findBlogArticle(params.slug, { includeScheduled: true });
  if (!found) {
    notFound();
  }
  const navigation = await loadBlogArticleNavigation(found.article);

  return (
    <BlogArticleView
      article={found.article}
      navigation={navigation}
      banner={<BlogPreviewBanner publishAt={found.publishAt} isVisible={found.isVisible} />}
    />
  );
}

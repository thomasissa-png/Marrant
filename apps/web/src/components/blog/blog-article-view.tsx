import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArticleCta } from "@/components/blog/article-cta";
import { BlogArticleTracking } from "@/components/blog/blog-article-tracking";
import { BlogVanneShare } from "@/components/blog/blog-vanne-share";
import { BlogArticleParcoursMaillage } from "@/components/blog/blog-article-parcours-maillage";
import { BlogArticleRelated } from "@/components/blog/blog-article-related";
import { BLOG_CTA_BY_SLUG } from "@/config/blog-cta";
import { FORTE_FRAPPE_SHARE } from "@/config/blog-forte-frappe";
import {
  JsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHowToJsonLd,
  authorPersonJsonLd,
} from "@/components/seo/json-ld";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { frTypo } from "@/lib/fr-typo";
import { blogCategoryLabel } from "@/lib/blog-labels";
import { formatIsoDateFr } from "@/lib/utils";
import type { BlogArticleData, BlogArticleNavigation } from "@/lib/blog-article-page";

interface BlogArticleViewProps {
  article: BlogArticleData;
  navigation: BlogArticleNavigation;
  /** Bandeau au-dessus de l'article (aperçu admin uniquement). */
  banner?: ReactNode;
}

/** Gabarit d'un article, commun à `/blog/[slug]` et `/blog/apercu/[slug]`. */
export function BlogArticleView({ article, navigation, banner }: BlogArticleViewProps) {
  // CTA de fin : textes et position propres à l'article si config/blog-cta.ts en définit.
  // Inscription attribuable à l'article : /onboarding lit seulement callbackUrl, `src`
  // est ignoré par la page et visible dans Umami (vue de /onboarding?src=blog-<slug>).
  const ctaCopy = BLOG_CTA_BY_SLUG[article.slug];
  const cta = <ArticleCta {...ctaCopy} freeCallbackUrl={`/onboarding?src=blog-${article.slug}`} />;
  // Bouton Partager sur chaque ligne numérotée des articles à forte frappe,
  // statiques ou en base (config/blog-forte-frappe.ts : liste et mode de partage).
  const shareMode = FORTE_FRAPPE_SHARE[article.slug];
  const faqs = article.faqs ?? [];
  const howToSteps = ["GUIDE", "PRATIQUE", "ROADMAP"].includes(article.category)
    ? (article.content.match(/^## (.+)$/gm) ?? [])
    : [];

  return (
    <article className="mx-auto max-w-3xl">
      {banner}
      <JsonLd data={buildArticleJsonLd(article)} />
      <JsonLd data={authorPersonJsonLd} />
      {faqs.length > 0 && <JsonLd data={buildFaqJsonLd(faqs)} />}
      {/* HowTo schema pour les articles tutoriels : Rich Snippets avec étapes dans les SERP */}
      {howToSteps.length >= 3 && (
        <JsonLd
          data={buildHowToJsonLd({
            name: article.title,
            description: article.excerpt,
            steps: howToSteps.slice(0, 8).map((h2) => {
              const name = h2.replace(/^## /, "").replace(/\*\*/g, "");
              return { name, text: name };
            }),
          })}
        />
      )}
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Blog", url: "https://deviens-marrant.fr/blog" },
          { name: article.title, url: `https://deviens-marrant.fr/blog/${article.slug}` },
        ])}
      />

      {/* Breadcrumb visuel */}
      <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-text-primary max-md:py-3.5">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="inline-block max-w-[55vw] truncate align-bottom text-text-secondary sm:max-w-none">
          {frTypo(article.title)}
        </span>
      </nav>

      <Badge variant="primary" className="mb-4">
        {blogCategoryLabel(article.category)}
      </Badge>
      <h1 className="font-display text-3xl font-bold md:text-4xl">{frTypo(article.title)}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <span>Par <Link href="/a-propos" className="text-text-secondary hover:text-accent-link">Alex Durand</Link></span>
        <span>·</span>
        <time dateTime={article.date}>{formatIsoDateFr(article.date)}</time>
        {/* Fraîcheur visible = même source que Article.dateModified (JSON-LD) ;
            jamais une date antérieure ou égale à la publication (dates ISO comparables). */}
        {article.updatedAt && article.updatedAt > article.date && (
          <>
            <span>·</span>
            <span>
              Mis à jour le <time dateTime={article.updatedAt}>{formatIsoDateFr(article.updatedAt)}</time>
            </span>
          </>
        )}
        <span>·</span>
        <span>{article.readingTime} de lecture</span>
      </div>

      {/* Mesure Umami (blog-sortie-clic, blog-cta-clic, blog-scroll) : wrapper client, contenu inchangé.
          Sous /blog/apercu, lib/umami.ts et le layout racine bloquent tout envoi. */}
      <BlogArticleTracking slug={article.slug}>
        <div data-blog-body>
          <MarkdownRenderer content={article.content} className="mt-8" shareJokes={Boolean(shareMode)} />
        </div>
        {shareMode && <BlogVanneShare slug={article.slug} mode={shareMode} />}

        {/* Article à CTA dédié (config/blog-cta.ts) : CTA au moment où la lecture
            se termine, avant FAQ et maillage. Sinon, CTA en bas (défaut). */}
        {ctaCopy && cta}

        {faqs.length > 0 && (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="font-display text-xl font-bold text-text-primary">Questions fréquentes</h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border border-border bg-background-card p-4">
                  <dt className="text-sm font-semibold text-text-primary">{frTypo(faq.question)}</dt>
                  <dd className="mt-2 text-sm text-text-secondary">{frTypo(faq.answer)}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <BlogArticleRelated navigation={navigation} />

        {/* Maillage contextuel vers le parcours pertinent selon le cluster. */}
        <div data-blog-zone="parcours">
          <BlogArticleParcoursMaillage articleSlug={article.slug} articleCategory={article.category} />
        </div>

        {/* CTA double (essai gratuit + premium), collé au parcours recommandé (T35)
            pour les articles sans CTA dédié. */}
        {!ctaCopy && cta}
      </BlogArticleTracking>
    </article>
  );
}

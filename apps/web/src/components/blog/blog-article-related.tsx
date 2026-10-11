import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { frTypo } from "@/lib/fr-typo";
import { blogCategoryLabel } from "@/lib/blog-labels";
import type { BlogArticleNavigation } from "@/lib/blog-article-page";

/** Sorties de fin d'article : précédent / suivant du cluster, puis « À lire ensuite ». */
export function BlogArticleRelated({ navigation }: { navigation: BlogArticleNavigation }) {
  const { cluster, nextArticle, prevArticle, relatedArticles } = navigation;

  return (
    <>
      {/* Navigation dans le cluster */}
      {cluster && (nextArticle || prevArticle) && (
        <nav className="mt-12 border-t border-border pt-8" aria-label="Navigation dans le cluster" data-blog-zone="cluster">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-text-muted">
            {cluster.name}
          </p>
          {/* T37 : carte seule = demi-largeur en desktop (côté de son sens), texte à gauche en mobile */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {prevArticle && (
              <Link
                href={`/blog/${prevArticle.slug}`}
                className={`rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40 ${nextArticle ? "flex-1" : "sm:w-1/2"}`}
              >
                <span className="text-xs text-text-muted">Précédent</span>
                <p className="mt-1 text-sm font-semibold text-text-primary line-clamp-2">
                  {frTypo(prevArticle.title)}
                </p>
              </Link>
            )}
            {nextArticle && (
              <Link
                href={`/blog/${nextArticle.slug}`}
                className={`rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40 sm:text-right ${prevArticle ? "flex-1" : "sm:ml-auto sm:w-1/2"}`}
              >
                <span className="text-xs text-text-muted">Suivant</span>
                <p className="mt-1 text-sm font-semibold text-text-primary line-clamp-2">
                  {frTypo(nextArticle.title)}
                </p>
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Articles similaires */}
      {relatedArticles.length > 0 && (
        <div className="mt-12 border-t border-border pt-8" data-blog-zone="related">
          <h2 className="font-display text-xl font-bold text-text-primary">À lire ensuite</h2>
          <div className={`mt-4 grid gap-4 ${relatedArticles.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40"
              >
                <Badge variant="primary" className="mb-2 text-xs">
                  {blogCategoryLabel(related.category)}
                </Badge>
                <h3 className="text-sm font-semibold text-text-primary line-clamp-2">{frTypo(related.title)}</h3>
                <p className="mt-1 text-xs text-text-muted">{related.readingTime} de lecture</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

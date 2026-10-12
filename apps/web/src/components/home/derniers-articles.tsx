import Link from "next/link";
import type { DernierArticle } from "@/lib/derniers-articles";

/**
 * Accueil, maillage S3b (docs/seo/maillage-decouverte-s20.md §4, validé par
 * Thomas le 12/10) : 3 liens titres vers les articles visibles les plus récents,
 * hors pilier. Styles repris du bloc « Explore aussi » de /blog.
 * Composant serveur sans état : la page charge la liste (`getDerniersArticles`,
 * repli statique si la base répond mal) ; fraîcheur = ISR de l'accueil (page.tsx).
 */
export function DerniersArticles({ articles }: { articles: readonly DernierArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="derniers-articles" className="pb-12 md:pb-16">
      <h2 id="derniers-articles" className="font-display mb-4 text-xl font-bold">
        Derniers articles
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/blog/${a.slug}`}
              className="block h-full rounded-lg border border-border bg-background-card p-4 text-sm font-semibold text-text-primary transition-colors hover:border-accent-primary/40"
            >
              {a.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}


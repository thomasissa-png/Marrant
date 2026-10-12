import Link from "next/link";
import type { DernierArticle } from "@/lib/derniers-articles";
import { frTypo } from "@/lib/fr-typo";

/**
 * Accueil, maillage S3b (docs/seo/maillage-decouverte-s20.md §4, validé par
 * Thomas le 12/10) : 3 liens titres vers les articles visibles les plus récents,
 * hors pilier. Styles du bloc « Explore aussi » de /blog, retouchés par la relecture
 * @design s20 (titre centré, grille des cartes personas, frTypo, anneau de focus).
 * Composant serveur sans état : la page charge la liste (`getDerniersArticles`,
 * repli statique si la base répond mal) ; fraîcheur = ISR de l'accueil (page.tsx).
 */
export function DerniersArticles({ articles }: { articles: readonly DernierArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="derniers-articles" className="pb-12 md:pb-16">
      <h2 id="derniers-articles" className="font-display mb-4 text-center text-xl font-bold md:mb-6 md:text-2xl">
        Derniers articles
      </h2>
      <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/blog/${a.slug}`}
              className="block h-full rounded-lg border border-border bg-background-card p-4 text-sm font-semibold text-text-primary transition-colors [text-wrap:balance] hover:border-accent-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {frTypo(a.title)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}


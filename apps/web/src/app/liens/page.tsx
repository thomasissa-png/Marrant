import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getLatestBlogArticle } from "@/lib/latest-blog-article";
import { getDailyJoke } from "@/lib/daily-joke";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { frTypo } from "@/lib/fr-typo";
import { cn } from "@/lib/utils";

// Stratégie de rendu : ISR 5 min. Page de lien de bio Instagram, posée une seule
// fois : elle suit seule le dernier article publié (même source que /blog) et la
// vanne du jour (même source que /blague-du-jour). Hors du groupe (dashboard) :
// pas d'en-tête ni de pied de page, page légère pensée mobile. Sans base (build,
// panne) : articles statiques et liens fixes, puis régénération.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Liens",
  description: "Le dernier article, la vanne du jour et les parcours de deviens-marrant.fr.",
  alternates: { canonical: "https://deviens-marrant.fr/liens" },
  robots: { index: false, follow: true },
};

const UTM = "utm_source=instagram&utm_medium=social&utm_campaign=bio";

/** Ajoute les UTM du lien de bio à un chemin interne. */
function withBioUtm(path: string): string {
  return `${path}${path.includes("?") ? "&" : "?"}${UTM}`;
}

const FIXED_LINKS = [
  { href: "/parcours/repartie", label: "Avoir de la répartie" },
  { href: "/vannes", label: "Voir toutes les vannes" },
  { href: "/conseils", label: "Conseils" },
] as const;

const SECTION_LABEL = "mb-2 text-xs font-semibold uppercase tracking-wider text-accent-link";
const CARD = "block rounded-xl border border-border bg-background-elevated p-5 transition-colors hover:border-border-hover";

export default async function LiensPage() {
  const [article, joke] = await Promise.all([getLatestBlogArticle(), getDailyJoke()]);

  return (
    <main id="main-content" className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-10">
      <header className="text-center">
        <h1 className="font-display text-2xl font-bold">
          <Link href={withBioUtm("/")} className="text-gradient">
            deviens-marrant.fr
          </Link>
        </h1>
      </header>

      {article && (
        <section aria-labelledby="dernier-article">
          <h2 id="dernier-article" className={SECTION_LABEL}>
            Dernier article
          </h2>
          <Link href={withBioUtm(`/blog/${article.slug}`)} className={CARD}>
            <span className="font-display text-lg font-bold text-text-primary">{frTypo(article.title)}</span>
            <span className="mt-2 block text-sm text-text-secondary">{frTypo(article.excerpt)}</span>
            <span className="mt-3 block text-sm font-medium text-accent-link">Lire l’article ({article.readingTime})</span>
          </Link>
        </section>
      )}

      {joke && (
        <section aria-labelledby="vanne-du-jour">
          <h2 id="vanne-du-jour" className={SECTION_LABEL}>
            La blague du jour
          </h2>
          <Link
            href={withBioUtm(`/vannes/${buildJokeSlug(joke)}`)}
            className={cn(CARD, "border-accent-primary/30 bg-accent-primary/10")}
          >
            <span className="block text-text-primary">{joke.content}</span>
            <span className="mt-3 block font-semibold text-text-primary">{joke.punchline}</span>
          </Link>
        </section>
      )}

      <nav aria-label="Liens utiles" className="flex flex-col gap-3">
        {FIXED_LINKS.map((link) => (
          <Link
            key={link.href}
            href={withBioUtm(link.href)}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}

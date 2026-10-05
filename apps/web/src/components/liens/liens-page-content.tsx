import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getLatestBlogArticle } from "@/lib/latest-blog-article";
import { getDailyJoke } from "@/lib/daily-joke";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { frTypo } from "@/lib/fr-typo";
import { buildBioHref, orderLiensBlocs, type LiensBloc } from "@/lib/liens";
import type { Origine } from "@/lib/attribution";
import { cn } from "@/lib/utils";

const SECTION_LABEL = "mb-2 text-xs font-semibold uppercase tracking-wider text-accent-link";
const CARD = "block rounded-xl border border-border bg-background-card p-5 transition-colors hover:border-border-hover";

const FIXED_LINKS: Record<"parcours" | "vannes" | "conseils", { href: string; label: string }> = {
  parcours: { href: "/parcours/repartie", label: "Avoir de la répartie" },
  vannes: { href: "/vannes", label: "Voir toutes les vannes" },
  conseils: { href: "/conseils", label: "Conseils" },
};

interface LiensPageContentProps {
  origine: Origine;
  now?: Date;
}

/**
 * Contenu commun des 3 liens de bio (`/liens`, `/liens/x`, `/liens/li`) :
 * blocs dans l'ordre de lib/liens (règle des 48 h), UTM du réseau, un
 * `utm_content` par bloc. Sans base (build, panne) : article statique, quiz
 * et liens fixes, puis régénération ISR.
 */
export async function LiensPageContent({ origine, now = new Date() }: LiensPageContentProps) {
  const [article, joke] = await Promise.all([getLatestBlogArticle(now), getDailyJoke()]);
  const blocs = orderLiensBlocs(
    { articlePublishedAt: article?.publishedAt ?? null, hasArticle: !!article, hasVanne: !!joke },
    now,
  );
  const href = (path: string, bloc: LiensBloc) => buildBioHref(path, origine, bloc);

  const cards: Partial<Record<LiensBloc, ReactNode>> = {
    article: article && (
      <section key="article" aria-labelledby="dernier-article" data-bloc="article">
        <h2 id="dernier-article" className={SECTION_LABEL}>
          Dernier article
        </h2>
        <Link href={href(`/blog/${article.slug}`, "article")} className={CARD}>
          <span className="font-display text-lg font-bold text-text-primary">{frTypo(article.title)}</span>
          <span className="mt-2 block text-sm text-text-secondary">{frTypo(article.excerpt)}</span>
          <span className="mt-3 block text-sm font-medium text-accent-link">Lire l’article ({article.readingTime})</span>
        </Link>
      </section>
    ),
    quiz: (
      <section key="quiz" aria-labelledby="quiz-humour" data-bloc="quiz">
        <h2 id="quiz-humour" className={SECTION_LABEL}>
          Le quiz
        </h2>
        <Link href={href("/quiz-humour", "quiz")} className={CARD}>
          <span className="font-display text-lg font-bold text-text-primary">{frTypo("Quel type d'humour es-tu ?")}</span>
          <span className="mt-2 block text-sm text-text-secondary">Environ 2 minutes, sans inscription.</span>
          <span className="mt-3 block text-sm font-medium text-accent-link">Faire le quiz</span>
        </Link>
      </section>
    ),
    vanne: joke && (
      <section key="vanne" aria-labelledby="vanne-du-jour" data-bloc="vanne">
        <h2 id="vanne-du-jour" className={SECTION_LABEL}>
          La blague du jour
        </h2>
        <Link
          href={href(`/vannes/${buildJokeSlug(joke)}`, "vanne")}
          className={cn(CARD, "border-accent-primary/30 bg-accent-primary/10 hover:border-accent-primary/60")}
        >
          <span className="block text-text-primary">{joke.content}</span>
          <span className="mt-3 block font-semibold text-text-primary">{joke.punchline}</span>
        </Link>
      </section>
    ),
  };
  const fixed = blocs.filter((b): b is keyof typeof FIXED_LINKS => b in FIXED_LINKS);

  return (
    <main id="main-content" className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-10">
      <header className="text-center">
        <h1 className="font-display text-2xl font-bold">
          <Link href={`/?utm_source=${origine}&utm_medium=social&utm_campaign=bio`} className="text-gradient">
            deviens-marrant.fr
          </Link>
        </h1>
      </header>

      {blocs.map((b) => cards[b] ?? null)}

      <nav aria-label="Liens utiles" className="flex flex-col gap-3">
        {fixed.map((b, index) => (
          <Link
            key={b}
            href={href(FIXED_LINKS[b].href, b)}
            data-bloc={b}
            className={cn(buttonVariants({ variant: index === 0 ? "primary" : "outline", size: "lg" }), "w-full justify-center")}
          >
            {FIXED_LINKS[b].label}
          </Link>
        ))}
      </nav>
    </main>
  );
}

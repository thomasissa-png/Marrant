import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/components/seo/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { FaqSection } from "@/components/home/faq-section";
import { buttonVariants } from "@/components/ui/button";
import { VannesThemeNav } from "@/components/vannes/vannes-theme-nav";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { getDailyJoke } from "@/lib/daily-joke";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { frTypo } from "@/lib/fr-typo";

// Stratégie de rendu : ISR 10 min. La vanne du jour change à minuit UTC (même
// source que /api/daily : DailyContent du jour, sinon repli déterministe). Sans
// base (build, panne) : la page sort sans la vanne, puis se régénère.
export const revalidate = 600;

const PAGE_URL = "https://deviens-marrant.fr/blague-du-jour";
const TITLE = "Blague du jour : une vanne à ressortir";
const DESCRIPTION =
  "La blague du jour, avec sa chute et son décryptage pour comprendre pourquoi elle marche. Une vanne à ressortir ce soir ou à la machine à café.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, locale: "fr_FR", type: "website" },
};

/** FAQ validée (docs/copy/landings-s14.md) ; compteur dynamique, jamais figé. */
function buildFaqs(jokeCount: number) {
  const count = jokeCount > 0 ? `Il y en a ${jokeCount}+` : "Il y en a bien d'autres";
  return [
    {
      question: "C'est quoi la blague du jour ?",
      answer:
        "Une vanne choisie pour la journée, avec sa chute et son décryptage. Elle change au fil des jours, et les précédentes se retrouvent dans le catalogue des vannes.",
    },
    {
      question: "Comment la ressortir sans avoir l'air de la réciter ?",
      answer:
        "Raconte-la avec tes mots, pas mot pour mot. Garde la chute pour la fin, marque une courte pause juste avant, et attends le bon moment de la conversation. Le décryptage te dit pourquoi elle marche : tu peux l'adapter à ta situation.",
    },
    {
      question: "Où trouver d'autres vannes que celle du jour ?",
      answer: `Dans le catalogue, classé par situation : boulot, couple, soirée, école. ${count}, chacune avec sa chute.`,
    },
  ];
}

export default async function BlagueDuJourPage() {
  const [joke, stats] = await Promise.all([getDailyJoke(), getContentStatsRounded()]);
  const faqs = buildFaqs(stats.jokes);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Blague du jour", url: PAGE_URL },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Blague du jour</span>
      </nav>
      <PageHeader
        title="La blague du jour"
        lead={frTypo(
          "Une vanne, sa chute, et l'explication de ce qui la fait marcher. Tu la lis, tu la retiens, tu la ressors ce soir au bon moment. Demain, une autre prend sa place.",
        )}
      />

      {joke && (
        <article className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold">
            <Link href={`/vannes/${buildJokeSlug(joke)}`} className="hover:text-accent-link">
              {joke.content}
            </Link>
          </h2>
          <div className="mt-6 rounded-xl border border-accent-primary/30 bg-accent-primary/10 p-5">
            <div className="mb-1 text-xs uppercase tracking-wider text-accent-link">La chute</div>
            <p className="text-lg font-semibold text-text-primary">{joke.punchline}</p>
          </div>
          {joke.comedyTechnique && (
            <section
              aria-labelledby="pourquoi-ca-marche"
              className="mt-6 rounded-xl border border-accent-primary/20 bg-accent-primary/5 p-5"
            >
              <h3 id="pourquoi-ca-marche" className="text-xs font-semibold uppercase tracking-wide text-accent-link">
                Pourquoi ça marche&nbsp;: {joke.comedyTechnique}
              </h3>
              {joke.techniqueExplanation && (
                <p className="mt-2 text-sm text-text-secondary">{joke.techniqueExplanation}</p>
              )}
            </section>
          )}
        </article>
      )}

      <div className="mt-8">
        <Link href="/vannes" className={buttonVariants({ variant: "outline" })}>
          Voir toutes les vannes
        </Link>
      </div>
      <VannesThemeNav className="mt-6" />

      <section className="mt-12 border-t border-border pt-8">
        <FaqSection items={faqs} />
      </section>
    </>
  );
}

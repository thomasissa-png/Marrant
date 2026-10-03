import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { VannesList } from "@/components/vannes/vannes-list";
import { VannesThemeNav } from "@/components/vannes/vannes-theme-nav";
import { FaqSection } from "@/components/home/faq-section";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildCollectionPageJsonLd,
} from "@/components/seo/json-ld";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { PageHeader } from "@/components/layout/page-header";
import { getJokesPage } from "@/lib/catalogue-pages";
import { listCanonical, parsePageParam } from "@/lib/list-pagination";

// Stratégie de rendu : SSR (lecture de `?page=N`, lot S1 s14 P0-1). Les données de
// liste sont en cache serveur 1 h (unstable_cache, lib/catalogue-pages) : le HTML
// initial contient les liens vers les fiches et une pagination crawlable. Sans base
// (build, panne), la liste retombe sur le chargement client d'avant.
interface ListPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: ListPageProps): Promise<Metadata> {
  const page = parsePageParam(searchParams.page);
  const stats = await getContentStatsRounded();
  const prefix = stats.jokes > 0 ? `${stats.jokes}+ vannes` : "Des vannes";
  return {
    title: `${prefix} drôles à ressortir ce soir`,
    description: `${prefix} classées par situation (soirée, boulot, couple, école), chacune avec sa chute et son décryptage pour que tu saches la replacer au bon moment.`,
    keywords: [
      "blague drôle",
      "blagues courtes",
      "vanne drôle",
      "blague du jour",
      "vannes à ressortir",
      "blagues entre amis",
      "blague courte drôle",
      "phrase drôle",
    ],
    alternates: { canonical: listCanonical("/vannes", page) },
  };
}

const vannesFaqs = [
  {
    question: "Comment trouver la bonne vanne pour une situation ?",
    answer:
      "Passe par les filtres : boulot, couple, soirée, école, gaming. Chaque vanne est rangée par contexte, pour que tu trouves en 3 secondes celle qui colle à ta situation plutôt que celle qui jette un froid. Mets tes préférées en favoris : tu les auras sous la main le jour J.",
  },
  {
    question: "Comment retenir une blague pour la ressortir au bon moment ?",
    answer:
      "Le truc, c'est la répétition espacée : tu lis une vanne le matin et tu essaies de la ressortir dans la journée. Tes favoris te servent de carnet à relire de temps en temps. Au bout de 3-4 répétitions, elle sort toute seule, et de préférence au bon moment.",
  },
  {
    question: "Est-ce que les vannes sont adaptées à toutes les situations ?",
    answer:
      "Chaque vanne est rangée par catégorie et passe le Test Stand-Up : « est-ce que je peux la sortir ce soir en soirée ? ». Rien de vulgaire, pas d'objets qui parlent, pas de jeux de mots forcés : seulement des vannes qu'on peut sortir entre potes ou au boulot sans que la pièce se refroidisse.",
  },
];

export default async function VannesPage({ searchParams }: ListPageProps) {
  const page = parsePageParam(searchParams.page);
  // Recherche `?q=` : filtrée côté client (API), pas de liste serveur à remplacer.
  const hasQuery = typeof searchParams.q === "string" && searchParams.q.length > 0;
  const [stats, listPage] = await Promise.all([
    getContentStatsRounded(),
    hasQuery ? Promise.resolve(null) : getJokesPage(page),
  ]);
  // Page hors catalogue (?page=999) : 404 plutôt qu'une liste vide indexable.
  if (listPage && page > Math.max(1, listPage.totalPages)) notFound();
  // Pas de chiffre de repli inventé (ex-200) : base KO = numberOfItems omis.
  const jokeCount = stats.jokes;
  const jokeLabel = stats.jokes > 0 ? `${stats.jokes}+` : "Des";
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Vannes", url: "https://deviens-marrant.fr/vannes" },
        ])}
      />
      {/* FAQ balisée une seule fois (page 1), pas sur chaque page de pagination. */}
      {page === 1 && <JsonLd data={buildFaqJsonLd(vannesFaqs)} />}
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: `${jokeLabel} vannes drôles à ressortir ce soir`,
          description: `${jokeLabel} vannes classées par situation (soirée, boulot, couple, école), chacune avec sa chute et son décryptage pour que tu saches la replacer au bon moment.`,
          url: "https://deviens-marrant.fr/vannes",
          numberOfItems: jokeCount,
          relatedArticles: [
            { title: "Comment devenir drôle : le guide", url: "https://deviens-marrant.fr/blog/comment-devenir-drole" },
            { title: "5 erreurs qui tuent tes blagues", url: "https://deviens-marrant.fr/blog/erreurs-blagues" },
          ],
        })}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Vannes</span>
      </nav>
      <PageHeader
        title={<>Vannes drôles à ressortir ce soir, pas trois jours plus tard</>}
        lead={
          <>
            Boulot, couple, soirées, école, gaming&nbsp;: choisis ta situation, clique
            pour révéler la chute et garde tes préférées sous le coude. La
            théorie, c&apos;est bien. Avoir une vanne prête au moment où tout le
            monde te regarde, c&apos;est mieux.
          </>
        }
      />
      {/* Pages thème (lot S3b s14) : liens serveur, visibles aussi sans abonnement. */}
      <VannesThemeNav />

      <Suspense fallback={null}>
        <VannesList initialData={listPage} initialPage={page} />
      </Suspense>

      {/* FAQ SEO */}
      {/* Accordéon fermé (passe UX s12, T19) : le contenu reste dans le DOM pour le SEO. */}
      <section className="mt-12 border-t border-border pt-8">
        <FaqSection items={vannesFaqs} align="left" />
      </section>

      {/* Contenu SEO — pourquoi nos vannes */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Pourquoi ces vannes sont différentes</h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            Chaque vanne de notre catalogue passe le <strong className="text-text-primary">Test Stand-Up</strong> : « est-ce que je peux la sortir ce soir en soirée et faire rire ? » Si la réponse est non, elle n&apos;est pas sur le site. Pas de blagues Carambar, pas d&apos;objets qui parlent, pas de jeux de mots qui nécessitent un doctorat en linguistique.
          </p>
          <p>
            Nos vannes sont classées par situation (<strong className="text-text-primary">boulot, couple, soirée, potes</strong>) pour que tu trouves en 3 secondes celle qui colle à ton contexte. Tu veux comprendre <Link href="/blog/comment-devenir-drole" className="text-accent-link hover:underline">comment devenir drôle</Link> ? Commence par avoir 5 vannes prêtes à dégainer.
          </p>
          <p>
            Tu veux aller plus loin ? Apprends à <Link href="/blog/comment-raconter-une-blague-sans-la-rater" className="text-accent-link hover:underline">raconter une blague sans la massacrer</Link> ou découvre les <Link href="/blog/erreurs-blagues" className="text-accent-link hover:underline">5 erreurs qui tuent tes blagues</Link>.
          </p>
        </div>
      </section>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">La suite, si tu as pris goût</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="font-display text-base font-bold text-text-primary">Techniques de répartie</h3>
            <p className="mt-1 text-sm text-text-secondary">{stats.tips > 0 ? `${stats.tips}+` : "Des dizaines de"} techniques concrètes pour avoir de la répartie et placer tes vannes au bon moment.</p>
          </Link>
          <Link href="/videos" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="font-display text-base font-bold text-text-primary">Vidéos stand-up analysées</h3>
            <p className="mt-1 text-sm text-text-secondary">Regarde comment les pros de la scène construisent leurs blagues.</p>
          </Link>
          <Link href="/blog/timing-humour" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="font-display text-base font-bold text-text-primary">Timing : bide ou carton, même vanne</h3>
            <p className="mt-1 text-sm text-text-secondary">Le silence juste avant la chute fait la moitié du travail. Encore faut-il savoir combien de temps le tenir.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

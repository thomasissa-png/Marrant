import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { VideosGrid } from "@/components/videos/videos-grid";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildCollectionPageJsonLd,
} from "@/components/seo/json-ld";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { PageHeader } from "@/components/layout/page-header";
import { getVideosPage } from "@/lib/catalogue-pages";
import { listCanonical, parsePageParam } from "@/lib/list-pagination";

// Stratégie de rendu : SSR (lecture de `?page=N`, lot S1 s14 P0-1). Les données de
// liste sont en cache serveur 1 h (unstable_cache, lib/catalogue-pages) : le HTML
// initial contient les liens vers les fiches et une pagination crawlable. Sans base
// (build, panne), la liste retombe sur le chargement client d'avant.
interface ListPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
import { frTypo } from "@/lib/fr-typo";

export async function generateMetadata({ searchParams }: ListPageProps): Promise<Metadata> {
  const page = parsePageParam(searchParams.page);
  const stats = await getContentStatsRounded();
  const videos = stats.videos > 0 ? `${stats.videos}+ vidéos` : "Des dizaines de vidéos";
  return {
    title: "Stand-up analysé : les techniques des pros",
    description: `${videos} de stand-up français décortiquées technique par technique, avec un défi concret pour réutiliser le procédé.`,
    keywords: [
      "stand-up français",
      "vidéos humour analysées",
      "techniques stand-up",
      "analyse stand-up",
      "apprendre humour vidéo",
    ],
    alternates: { canonical: listCanonical("/videos", page) },
  };
}

const videosFaqs = [
  {
    question: "Comment apprendre l'humour en regardant des vidéos de stand-up ?",
    answer:
      "Chaque vidéo est annotée avec la technique utilisée par l'humoriste : timing, autodérision, observation, storytelling, absurde. Tu regardes le passage, tu repères le mécanisme comique, puis tu fais l'exercice proposé pour le tester dans ta vie. À la fin, tu ne sais plus seulement que c'était drôle : tu sais pourquoi.",
  },
  {
    question: "Quels styles de stand-up sont analysés sur deviens-marrant.fr ?",
    answer:
      "On décortique les meilleurs passages de pros de la scène française, avec des styles très différents : observation, storytelling, absurde, autodérision. Chaque vidéo est sélectionnée pour sa valeur pédagogique, pas juste parce qu'elle est drôle.",
  },
  {
    question: "C'est quoi la différence avec juste regarder YouTube ?",
    answer:
      "YouTube te montre des humoristes ; ici, on te montre comment ils s'y prennent. Chaque vidéo arrive avec les points clés à retenir et un défi concret à tester aujourd'hui. Et avec les streaks et les XP, tu tiens sur la durée, y compris les semaines où tu as moins envie.",
  },
];

export default async function VideosPage({ searchParams }: ListPageProps) {
  const page = parsePageParam(searchParams.page);
  // Recherche `?q=` : filtrée côté client (API), pas de liste serveur à remplacer.
  const hasQuery = typeof searchParams.q === "string" && searchParams.q.length > 0;
  const [stats, listPage] = await Promise.all([
    getContentStatsRounded(),
    hasQuery ? Promise.resolve(null) : getVideosPage(page),
  ]);
  // Page hors catalogue (?page=999) : 404 plutôt qu'une liste vide indexable.
  if (listPage && page > Math.max(1, listPage.totalPages)) notFound();
  const videoCount = stats.videos > 0 ? stats.videos : 60;
  const videoLabel = stats.videos > 0 ? `${stats.videos}+ vidéos` : "des dizaines de vidéos";
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Vidéos", url: "https://deviens-marrant.fr/videos" },
        ])}
      />
      {/* FAQ balisée une seule fois (page 1), pas sur chaque page de pagination. */}
      {page === 1 && <JsonLd data={buildFaqJsonLd(videosFaqs)} />}
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Stand-up analysé : les techniques des pros",
          description: `${videoLabel} de stand-up français décortiquées technique par technique, avec un défi concret pour réutiliser le procédé.`,
          url: "https://deviens-marrant.fr/videos",
          numberOfItems: videoCount,
          relatedArticles: [
            { title: "Timing humour : le secret de la blague", url: "https://deviens-marrant.fr/blog/timing-humour" },
            { title: "Comment devenir drôle : 5 piliers et un plan sur 30 jours", url: "https://deviens-marrant.fr/blog/comment-devenir-drole" },
          ],
        })}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Vidéos</span>
      </nav>
      <PageHeader
        title={<>Apprends à être drôle en piquant leur mécanique aux meilleurs humoristes</>}
        lead={
          <>
            Chaque pro de la scène a sa mécanique : on décortique leurs
            meilleurs passages. Chaque vidéo est annotée avec la
            technique utilisée : timing, autodérision, observation, storytelling.
            Tu regardes, tu comprends le mécanisme, tu le reproduis.
          </>
        }
      />

      <Suspense fallback={null}>
        <VideosGrid initialData={listPage} initialPage={page} />
      </Suspense>

      {/* FAQ SEO */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Questions fréquentes</h2>
        <dl className="max-w-3xl space-y-4">
          {videosFaqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border bg-background-card p-4">
              <dt className="text-sm font-semibold text-text-primary">{frTypo(faq.question)}</dt>
              <dd className="mt-2 text-sm text-text-secondary">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contenu SEO — methode pedagogique */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Notre méthode : regarder, comprendre, reproduire</h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            Entre regarder du stand-up sur YouTube et apprendre le stand-up, il y a une étape : <strong className="text-text-primary">l&apos;analyse technique</strong>. Chaque vidéo est annotée avec la technique utilisée : timing, escalade comique, callback, fausse piste. Tu comprends le <em>pourquoi</em> du rire.
          </p>
          <p>
            Après chaque vidéo, un <strong className="text-text-primary">défi concret</strong> te fait pratiquer la technique dans ta vie. C&apos;est comme ça que <Link href="/blog/comment-devenir-drole" className="text-accent-link underline underline-offset-2">tu deviens drôle</Link> : pas en regardant, en faisant.
          </p>
          <p>
            Tu veux comprendre comment <strong className="text-text-primary">les pros de la scène</strong> maîtrisent leurs silences ? Lis notre décryptage du <Link href="/blog/timing-humour" className="text-accent-link underline underline-offset-2">timing en humour</Link>. Et pour les techniques de <Link href="/blog/comment-avoir-de-la-repartie" className="text-accent-link underline underline-offset-2">répartie</Link>, nos 10 techniques expliquées sont un bon complément.
          </p>
        </div>
      </section>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Et maintenant, à toi de jouer</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">{stats.jokes > 0 ? `${stats.jokes}+` : "Des"} vannes drôles</h3>
            <p className="mt-1 text-xs text-text-secondary">Passe à la pratique avec des vannes prêtes à ressortir dès ce soir.</p>
          </Link>
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">{stats.tips > 0 ? `${stats.tips}+` : "Des dizaines de"} techniques de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">Les techniques des pros, ramenées à la taille d&apos;une pause café.</p>
          </Link>
          <Link href="/blog/erreurs-blagues" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">5 erreurs qui tuent tes blagues</h3>
            <p className="mt-1 text-xs text-text-secondary">Les erreurs qui plombent une vanne avant même la chute, et comment les éviter.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

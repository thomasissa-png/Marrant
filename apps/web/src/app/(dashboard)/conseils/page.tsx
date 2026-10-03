import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ConseilsList } from "@/components/conseils/conseils-list";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildCollectionPageJsonLd,
} from "@/components/seo/json-ld";
import { getContentStatsRounded } from "@/lib/content-stats-server";
import { PageHeader } from "@/components/layout/page-header";
import { getTipsPage } from "@/lib/catalogue-pages";
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
  const tipsLabel = stats.tips > 0 ? `${stats.tips}+` : "Des dizaines de";
  return {
    title: `${tipsLabel} techniques de répartie + exercices`,
    description: `${tipsLabel} techniques de répartie et d'humour (timing, autodérision, storytelling), chacune avec un exemple, un dialogue et un défi à tester dès ce soir.`,
    keywords: [
      "avoir de la répartie",
      "comment avoir de la répartie",
      "techniques de répartie",
      "conseils humour",
      "exercices répartie",
      "autodérision",
      "storytelling humour",
      "répartie au travail",
    ],
    alternates: { canonical: listCanonical("/conseils", page) },
  };
}

const conseilsFaqs = [
  {
    question: "C'est quoi la répartie exactement ?",
    answer:
      "La répartie, c'est trouver la bonne réponse pendant que la conversation est encore là, pas le soir en te brossant les dents. Souvent drôle, toujours rapide, elle repose sur des techniques précises : l'accusé de réception, le rebond sur un mot-clé, le retournement. Et comme toute technique, ça s'apprend et ça s'affûte en pratiquant.",
  },
  {
    question: "Combien de temps faut-il pour avoir de la répartie ?",
    answer:
      "Avec 5-10 minutes de pratique quotidienne, tu peux voir une vraie différence en 2 à 4 semaines. Le Parcours Répartie dure 4 semaines et te donne des exercices concrets à tester chaque jour. Le vrai secret, c'est la régularité : 5 minutes par jour valent mieux qu'une heure une fois par semaine, la veille d'un repas de famille.",
  },
  {
    question: "Comment avoir de la répartie sans être méchant ?",
    answer:
      "La vraie répartie, ce n'est pas écraser l'autre : c'est transformer une pique en moment drôle pour tout le monde, y compris pour celui qui l'a lancée. L'autodérision ou le détour par l'absurde permettent de désamorcer sans blesser. Tu gagnes l'échange, et personne n'a besoin de le perdre.",
  },
];

export default async function ConseilsPage({ searchParams }: ListPageProps) {
  const page = parsePageParam(searchParams.page);
  // Recherche `?q=` : filtrée côté client (API), pas de liste serveur à remplacer.
  const hasQuery = typeof searchParams.q === "string" && searchParams.q.length > 0;
  const [stats, listPage] = await Promise.all([
    getContentStatsRounded(),
    hasQuery ? Promise.resolve(null) : getTipsPage(page),
  ]);
  // Page hors catalogue (?page=999) : 404 plutôt qu'une liste vide indexable.
  if (listPage && page > Math.max(1, listPage.totalPages)) notFound();
  const tipCount = stats.tips > 0 ? stats.tips : 50;
  const tipsLabel = stats.tips > 0 ? `${stats.tips}+` : "Des dizaines de";
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Conseils", url: "https://deviens-marrant.fr/conseils" },
        ])}
      />
      {/* FAQ balisée une seule fois (page 1), pas sur chaque page de pagination. */}
      {page === 1 && <JsonLd data={buildFaqJsonLd(conseilsFaqs)} />}
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: `${tipsLabel} techniques de répartie + exercices`,
          description: `${tipsLabel} techniques de répartie et d'humour (timing, autodérision, storytelling), chacune avec un exemple, un dialogue et un défi à tester dès ce soir.`,
          url: "https://deviens-marrant.fr/conseils",
          numberOfItems: tipCount,
          relatedArticles: [
            { title: "Répartie : 10 techniques efficaces", url: "https://deviens-marrant.fr/blog/comment-avoir-de-la-repartie" },
            { title: "Répartie débutant : 5 étapes simples", url: "https://deviens-marrant.fr/blog/repartie-debutant-5-etapes" },
          ],
        })}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Conseils</span>
      </nav>
      <PageHeader
        title={<>Comment avoir de la répartie et devenir plus drôle</>}
        lead={
          <>
            Répartie, timing, storytelling : les techniques des meilleurs
            humoristes français, expliquées comme si on était à la même table.
            Chaque conseil vient avec un exemple concret et un défi à tester
            aujourd&apos;hui. Pas de théorie creuse&nbsp;: tu lis, tu testes, tu
            progresses.
          </>
        }
      />

      <Suspense fallback={null}>
        <ConseilsList initialData={listPage} initialPage={page} />
      </Suspense>

      {/* FAQ SEO */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Questions fréquentes</h2>
        <dl className="max-w-3xl space-y-4">
          {conseilsFaqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border bg-background-card p-4">
              <dt className="text-sm font-semibold text-text-primary">{frTypo(faq.question)}</dt>
              <dd className="mt-2 text-sm text-text-secondary">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contenu SEO — approfondir avec le blog */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Approfondir les techniques</h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            La répartie ne se reçoit pas à la naissance avec la couleur des yeux : c&apos;est un <strong className="text-text-primary">muscle qui se travaille</strong>. Nos {stats.tips > 0 ? `${stats.tips}+ conseils` : "dizaines de conseils"} couvrent les techniques que les pros de la scène utilisent tous les soirs.
          </p>
          <p>
            Tu débutes ? Notre guide <Link href="/blog/comment-avoir-de-la-repartie" className="text-accent-link hover:underline">Répartie : 10 techniques efficaces</Link> te donne les bases. Tu veux comprendre le mécanisme du rire ? Lis <Link href="/blog/comment-devenir-drole" className="text-accent-link hover:underline">comment devenir drôle</Link>, le guide complet avec plan d&apos;action sur 30 jours.
          </p>
          <p>
            Et pour savoir combien de temps tenir le silence avant la chute, lis notre article sur le <Link href="/blog/timing-humour" className="text-accent-link hover:underline">timing en humour</Link>.
          </p>
        </div>
      </section>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Explore aussi</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">{stats.jokes > 0 ? `${stats.jokes}+` : "Des centaines de"} vannes drôles</h3>
            <p className="mt-1 text-xs text-text-secondary">Des vannes testées et classées par situation, prêtes à ressortir.</p>
          </Link>
          <Link href="/parcours" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Parcours structurés</h3>
            <p className="mt-1 text-xs text-text-secondary">Progresse semaine après semaine avec des exercices concrets et des XP.</p>
          </Link>
          <Link href="/blog/autoderision-interactions" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">L&apos;autodérision qui marche</h3>
            <p className="mt-1 text-xs text-text-secondary">Rire de toi sans te démolir : ce qui fait sourire les autres, et ce qui les met mal à l&apos;aise.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

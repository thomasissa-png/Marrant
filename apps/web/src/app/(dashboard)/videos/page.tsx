import type { Metadata } from "next";
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

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getContentStatsRounded();
  const videos = stats.videos > 0 ? `${stats.videos}+ vidéos` : "Des dizaines de vidéos";
  return {
    title: "Stand-up analysé : Fary, Mirabel & co.",
    description: `${videos} de Fary, Mirabel, Blanche Gardin décortiquées. Chaque technique annotée + un défi concret. Tu regardes, tu comprends, tu reproduis.`,
    keywords: [
      "stand-up français",
      "vidéos humour analysées",
      "Paul Mirabel techniques",
      "Blanche Gardin humour",
      "Fary stand-up",
      "apprendre humour vidéo",
      "Roman Frayssinet",
      "Waly Dia stand-up",
    ],
    alternates: { canonical: "https://deviens-marrant.fr/videos" },
  };
}

const videosFaqs = [
  {
    question: "Comment apprendre l'humour en regardant des vidéos de stand-up ?",
    answer:
      "Chaque vidéo est annotée avec la technique utilisée par l'humoriste : timing, autodérision, observation, storytelling, absurde. Tu regardes le passage, tu repères le mécanisme comique, puis tu fais l'exercice proposé pour le tester dans ta vie. À la fin, tu ne sais plus seulement que c'était drôle : tu sais pourquoi.",
  },
  {
    question: "Quels humoristes sont analysés sur deviens-marrant.fr ?",
    answer:
      "On décortique les meilleurs passages de Paul Mirabel, Fary, Blanche Gardin, Roman Frayssinet, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg, et bien d'autres. Chaque vidéo est sélectionnée pour sa valeur pédagogique, pas juste parce qu'elle est drôle.",
  },
  {
    question: "C'est quoi la différence avec juste regarder YouTube ?",
    answer:
      "YouTube te montre des humoristes ; ici, on te montre comment ils s'y prennent. Chaque vidéo arrive avec les points clés à retenir et un défi concret à tester aujourd'hui. Et avec les streaks et les XP, tu tiens sur la durée, y compris les semaines où tu as moins envie.",
  },
];

export default async function VideosPage() {
  const stats = await getContentStatsRounded();
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
      <JsonLd data={buildFaqJsonLd(videosFaqs)} />
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Stand-up analysé : Fary, Mirabel & co.",
          description: `${videoLabel} de stand-up décortiquées. Chaque technique annotée + un défi concret.`,
          url: "https://deviens-marrant.fr/videos",
          numberOfItems: videoCount,
          relatedArticles: [
            { title: "Techniques de stand-up pour la vie sociale", url: "https://deviens-marrant.fr/blog/timing-humour" },
            { title: "Comment devenir drôle", url: "https://deviens-marrant.fr/blog/comment-devenir-drole" },
          ],
        })}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Vidéos</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Apprends à être drôle en piquant leur mécanique aux meilleurs humoristes
        </h1>
        <p className="mt-2 text-text-secondary">
          Fary, Paul Mirabel, Blanche Gardin, Roman Frayssinet, Waly Dia — on
          décortique leurs meilleurs passages. Chaque vidéo est annotée avec la
          technique utilisée : timing, autodérision, observation, storytelling.
          Tu regardes, tu comprends le mécanisme, tu le reproduis.
        </p>
      </div>

      <Suspense fallback={null}>
        <VideosGrid />
      </Suspense>

      {/* FAQ SEO */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Questions fréquentes</h2>
        <dl className="space-y-4">
          {videosFaqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border bg-background-card p-4">
              <dt className="text-sm font-semibold text-text-primary">{faq.question}</dt>
              <dd className="mt-2 text-sm text-text-secondary">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contenu SEO — methode pedagogique */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Notre méthode : regarder, comprendre, reproduire</h2>
        <div className="space-y-3 text-sm text-text-secondary">
          <p>
            Entre regarder du stand-up sur YouTube et apprendre le stand-up, il y a une étape : <strong className="text-text-primary">l&apos;analyse technique</strong>. Chaque vidéo est annotée avec la technique utilisée : timing, escalade comique, callback, fausse piste. Tu comprends le <em>pourquoi</em> du rire.
          </p>
          <p>
            Après chaque vidéo, un <strong className="text-text-primary">défi concret</strong> te fait pratiquer la technique dans ta vie. C&apos;est comme ça que <Link href="/blog/comment-devenir-drole" className="text-accent-primary hover:underline">tu deviens drôle</Link> — pas en regardant, en faisant.
          </p>
          <p>
            Tu veux comprendre comment <strong className="text-text-primary">Roman Frayssinet</strong> maîtrise ses silences ? Lis notre décryptage du <Link href="/blog/timing-humour" className="text-accent-primary hover:underline">timing en humour</Link>. Et pour les techniques de <Link href="/blog/comment-avoir-de-la-repartie" className="text-accent-primary hover:underline">répartie</Link>, nos 10 techniques expliquées sont un bon complément.
          </p>
        </div>
      </section>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Et maintenant, à toi de jouer</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">{stats.jokes > 0 ? `${stats.jokes}+` : "Des centaines de"} vannes drôles</h3>
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

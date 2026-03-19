import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { VideosGrid } from "@/components/videos/videos-grid";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Vidéos stand-up analysées | Fary, Mirabel, Blanche Gardin",
  description:
    "89 vidéos de stand-up décortiquées : Fary, Paul Mirabel, Blanche Gardin, Roman Frayssinet. Technique annotée + exercice concret par vidéo.",
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

const videosFaqs = [
  {
    question: "Comment apprendre l'humour en regardant des vidéos de stand-up ?",
    answer:
      "Chaque vidéo est annotée avec la technique utilisée par l'humoriste : timing, autodérision, observation, storytelling, absurde. Tu regardes le passage, tu comprends le mécanisme comique, puis tu fais l'exercice proposé pour le reproduire dans ta vie. C'est la différence entre regarder du tennis et prendre des cours de tennis.",
  },
  {
    question: "Quels humoristes sont analysés sur deviens-marrant.fr ?",
    answer:
      "On décortique les meilleurs passages de Paul Mirabel, Fary, Blanche Gardin, Roman Frayssinet, Waly Dia, Panayotis Pascot, Pierre Croce, Inès Reg, et bien d'autres. Chaque vidéo est sélectionnée pour sa valeur pédagogique, pas juste parce qu'elle est drôle.",
  },
  {
    question: "C'est quoi la différence avec juste regarder YouTube ?",
    answer:
      "YouTube te montre des humoristes. Nous, on t'apprend leurs techniques. Chaque vidéo est analysée avec les points clés à retenir (learnings) et un exercice concret à tester aujourd'hui (DÉFI). Avec le système de streaks et d'XP, tu gardes la motivation sur la durée.",
  },
];

export default function VideosPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Vidéos", url: "https://deviens-marrant.fr/videos" },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(videosFaqs)} />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Vidéos</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Apprends à être drôle avec les meilleurs humoristes
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
            La différence entre regarder du stand-up sur YouTube et apprendre le stand-up, c&apos;est <strong className="text-text-primary">l&apos;analyse technique</strong>. Chaque vidéo est annotée avec la technique utilisée : timing, escalade comique, callback, fausse piste. Tu comprends le <em>pourquoi</em> du rire.
          </p>
          <p>
            Après chaque vidéo, un <strong className="text-text-primary">DÉFI concret</strong> te fait pratiquer la technique dans ta vie. C&apos;est comme ça que <Link href="/blog/comment-devenir-drole" className="text-accent-primary hover:underline">tu deviens drôle</Link> — pas en regardant, en faisant.
          </p>
          <p>
            Tu veux comprendre comment <strong className="text-text-primary">Roman Frayssinet</strong> maîtrise ses silences ? Lis notre décryptage du <Link href="/blog/timing-humour" className="text-accent-primary hover:underline">timing en humour</Link>. Et pour les techniques de <Link href="/blog/comment-avoir-de-la-repartie" className="text-accent-primary hover:underline">répartie</Link>, nos 10 techniques expliquées sont un bon complément.
          </p>
        </div>
      </section>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Continue ta progression</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">289 vannes drôles</h3>
            <p className="mt-1 text-xs text-text-secondary">Mets en pratique ce que tu apprends — des vannes prêtes à ressortir.</p>
          </Link>
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">66 techniques de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">Les techniques des pros, adaptées à ta vie quotidienne.</p>
          </Link>
          <Link href="/blog/erreurs-blagues" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">5 erreurs qui tuent tes blagues</h3>
            <p className="mt-1 text-xs text-text-secondary">Les erreurs classiques et comment les éviter pour faire mouche.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

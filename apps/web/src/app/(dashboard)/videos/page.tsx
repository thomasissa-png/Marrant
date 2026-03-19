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
  title: "Vidéos stand-up analysées",
  description:
    "Apprends l'humour avec Fary, Paul Mirabel, Blanche Gardin et Roman Frayssinet. Chaque vidéo annotée : timing, répartie, autodérision, storytelling.",
  keywords: [
    "stand-up français",
    "vidéos humour analysées",
    "Paul Mirabel techniques",
    "Blanche Gardin humour",
    "Fary stand-up",
    "apprendre humour vidéo",
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

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Continue ta progression</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Vannes et blagues drôles</h3>
            <p className="mt-1 text-xs text-text-secondary">Des centaines de vannes classées par catégorie, prêtes à ressortir.</p>
          </Link>
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">Techniques concrètes pour avoir de la répartie et devenir plus drôle.</p>
          </Link>
          <Link href="/parcours" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Parcours structurés</h3>
            <p className="mt-1 text-xs text-text-secondary">Deviens drôle pas à pas avec des parcours de 3 à 6 semaines.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

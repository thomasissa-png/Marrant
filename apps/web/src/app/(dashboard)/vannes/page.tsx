import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { VannesList } from "@/components/vannes/vannes-list";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Vannes et blagues drôles",
  description:
    "Des centaines de vannes drôles à ressortir en soirée, au boulot ou entre amis. Classées par catégorie, chute cachée. Deviens la personne drôle du groupe.",
  keywords: [
    "vanne drôle",
    "blague du jour",
    "vanne du jour",
    "blagues courtes",
    "vannes à ressortir",
    "blagues entre amis",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/vannes" },
};

const vannesFaqs = [
  {
    question: "Comment trouver la bonne vanne pour une situation ?",
    answer:
      "Utilise les filtres par catégorie : boulot, couple, soirée, école, gaming. Chaque vanne est classée par contexte pour que tu trouves en 3 secondes celle qui colle à ta situation. Sauvegarde tes préférées dans tes favoris pour les avoir sous la main.",
  },
  {
    question: "Comment retenir une blague pour la ressortir au bon moment ?",
    answer:
      "Le secret, c'est la répétition espacée. Lis une vanne le matin, essaie de la resortir dans la journée. Nos favoris te permettent de créer ta propre sélection et de la relire régulièrement. En 3-4 répétitions, elle est gravée.",
  },
  {
    question: "Est-ce que les vannes sont adaptées à toutes les situations ?",
    answer:
      "Chaque vanne est catégorisée et testée avec le Test Stand-Up : « est-ce que je peux la sortir ce soir en soirée ? ». Aucune vanne vulgaire, aucun objet qui parle, aucun jeu de mots forcé. Du contenu sortable en société, entre potes ou au boulot.",
  },
];

export default function VannesPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Vannes", url: "https://deviens-marrant.fr/vannes" },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(vannesFaqs)} />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Vannes</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Vannes drôles à ressortir en toute occasion
        </h1>
        <p className="mt-2 text-text-secondary">
          Boulot, couple, soirées, école, gaming — trouve la vanne parfaite
          pour chaque situation. Clique pour révéler la chute, sauvegarde tes
          préférées, et ressors-les ce soir. La théorie, c&apos;est bien.
          Avoir une vanne prête, c&apos;est mieux.
        </p>
      </div>

      <Suspense fallback={null}>
        <VannesList />
      </Suspense>

      {/* FAQ SEO */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Questions fréquentes</h2>
        <dl className="space-y-4">
          {vannesFaqs.map((faq, i) => (
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
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">Apprends les techniques pour avoir de la répartie et placer tes vannes au bon moment.</p>
          </Link>
          <Link href="/videos" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Vidéos stand-up analysées</h3>
            <p className="mt-1 text-xs text-text-secondary">Regarde comment les pros construisent leurs blagues et apprends leurs techniques.</p>
          </Link>
          <Link href="/glossaire" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Glossaire humour</h3>
            <p className="mt-1 text-xs text-text-secondary">Punchline, timing, callback : comprends les termes pour mieux les utiliser.</p>
          </Link>
        </div>
      </nav>
    </>
  );
}

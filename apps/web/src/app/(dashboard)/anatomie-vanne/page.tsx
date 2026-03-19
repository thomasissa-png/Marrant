import type { Metadata } from "next";
import Link from "next/link";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Anatomie d'une vanne : setup, pivot et punchline",
  description:
    "Décortique les 3 composants d'une blague qui fait rire : setup, pivot et punchline. Avec exemples concrets de Paul Mirabel, Fary et Blanche Gardin.",
  keywords: [
    "anatomie blague",
    "structure blague",
    "punchline définition",
    "setup punchline",
    "comment écrire une blague",
    "structure vanne",
    "pivot humour",
    "technique stand-up",
    "écrire une vanne",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/anatomie-vanne" },
  openGraph: {
    title: "Anatomie d'une vanne : la science du rire en 3 parties",
    description:
      "Setup → Pivot → Punchline. Comprends pourquoi certaines vannes tuent et d'autres tombent à plat.",
    url: "https://deviens-marrant.fr/anatomie-vanne",
  },
};

const anatomyFaqs = [
  {
    question: "C'est quoi le setup d'une blague ?",
    answer:
      "Le setup, c'est la mise en place. C'est la première partie de la vanne qui installe le contexte et crée une attente chez l'auditeur. Un bon setup est court, clair et oriente l'esprit dans une direction... pour mieux le surprendre avec la chute.",
  },
  {
    question: "Comment écrire une bonne punchline ?",
    answer:
      "Une bonne punchline est plus courte que le setup, inattendue et crée un décalage. La règle d'or : supprime tous les mots inutiles. Les meilleures punchlines tiennent en moins de 10 mots. Teste-la à voix haute — si tu dois expliquer pourquoi c'est drôle, c'est raté.",
  },
  {
    question: "C'est quoi le pivot dans une vanne ?",
    answer:
      "Le pivot est le moment exact où la blague change de direction. C'est le mécanisme qui crée la surprise : un mot à double sens, un retournement de situation, une association inattendue. Sans pivot, pas de surprise. Sans surprise, pas de rire.",
  },
  {
    question: "Quelle est la différence entre une blague et un one-liner ?",
    answer:
      "Un one-liner condense setup, pivot et punchline en une seule phrase. La structure est la même, mais compressée à l'extrême. Les one-liners demandent plus de travail d'écriture car chaque mot doit être optimisé.",
  },
];

const vanneExamples = [
  {
    category: "Observation",
    setup: "J'ai essayé de faire du sport chez moi avec une appli.",
    pivot: "La direction change — de l'effort à l'échec",
    punchline: "Mon canapé a gagné au bout de 4 minutes.",
    analysis:
      "Setup court (contexte relatable), pivot invisible (l'appli = motivation ≠ réalité), punchline en 8 mots avec personnification du canapé.",
  },
  {
    category: "Autodérision",
    setup: "Mon coiffeur m'a demandé ce que je voulais comme coupe.",
    pivot: "L'attente d'une réponse normale → réponse inattendue",
    punchline: "J'ai dit 'de la confiance en moi'.",
    analysis:
      "Setup universel (tout le monde va chez le coiffeur), pivot sur le double sens de 'coupe', punchline émotionnelle qui crée la complicité.",
  },
  {
    category: "Absurde",
    setup: "Mon GPS m'a dit de tourner à droite.",
    pivot: "L'obéissance aveugle poussée à l'absurde",
    punchline: "J'étais dans un ascenseur.",
    analysis:
      "Setup ultra-court (7 mots), pivot spatial (la route ≠ un ascenseur), punchline en 5 mots qui crée une image mentale absurde.",
  },
];

export default function AnatomieVannePage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          {
            name: "Anatomie d'une vanne",
            url: "https://deviens-marrant.fr/anatomie-vanne",
          },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(anatomyFaqs)} />

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            Anatomie d&apos;une vanne
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Pourquoi certaines vannes tuent et d&apos;autres tombent à plat ?
            <br />
            Réponse en 3 parties.
          </p>
        </div>

        {/* The 3 parts — visual infographic-style */}
        <section className="mb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Setup */}
            <div className="relative rounded-xl border border-border bg-background-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/10 text-3xl">
                🎯
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-accent-primary">
                Partie 1
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-text-primary">
                Le Setup
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                La <strong>mise en place</strong>. Tu installes le contexte et tu orientes
                l&apos;esprit de ton audience dans une direction. Plus c&apos;est court et clair,
                mieux c&apos;est.
              </p>
              <div className="mt-4 rounded-lg bg-background-elevated p-3">
                <p className="text-xs font-semibold text-text-muted">Règle d&apos;or</p>
                <p className="mt-1 text-sm text-text-primary">
                  Le setup doit être <strong>plus long</strong> que la punchline.
                  Il pose le décor — la chute le fait exploser.
                </p>
              </div>
            </div>

            {/* Pivot */}
            <div className="relative rounded-xl border border-accent-primary/30 bg-background-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/20 text-3xl">
                🔄
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-accent-primary">
                Partie 2
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-text-primary">
                Le Pivot
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                Le <strong>point de bascule</strong>. Le moment exact où la blague change de
                direction. C&apos;est le mécanisme invisible qui crée la surprise.
              </p>
              <div className="mt-4 rounded-lg bg-background-elevated p-3">
                <p className="text-xs font-semibold text-text-muted">Types de pivots</p>
                <p className="mt-1 text-sm text-text-primary">
                  Double sens, retournement, association inattendue, exagération,
                  sous-entendu, décalage temporel.
                </p>
              </div>
            </div>

            {/* Punchline */}
            <div className="relative rounded-xl border border-border bg-background-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-3xl">
                💥
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-error">
                Partie 3
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-text-primary">
                La Punchline
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                La <strong>chute</strong>. La phrase qui déclenche le rire. Elle doit être
                inattendue, concise et impossible à voir venir.
              </p>
              <div className="mt-4 rounded-lg bg-background-elevated p-3">
                <p className="text-xs font-semibold text-text-muted">Règle d&apos;or</p>
                <p className="mt-1 text-sm text-text-primary">
                  Plus c&apos;est court, plus ça claque. Les meilleures punchlines
                  tiennent en <strong>moins de 10 mots</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Arrow flow visual */}
          <div className="mt-6 hidden items-center justify-center gap-4 text-text-muted md:flex">
            <span className="text-sm">Setup</span>
            <span>→</span>
            <span className="text-sm font-semibold text-accent-primary">
              Pivot
            </span>
            <span>→</span>
            <span className="text-sm">Punchline</span>
            <span>=</span>
            <span className="text-sm font-bold text-success">Rire</span>
          </div>
        </section>

        {/* Exemples décortiqués */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">
            3 vannes décortiquées
          </h2>
          <div className="space-y-6">
            {vanneExamples.map((ex, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-background-card overflow-hidden"
              >
                <div className="border-b border-border bg-background-elevated px-6 py-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent-primary">
                    {ex.category}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-text-muted">
                      Setup
                    </p>
                    <p className="mt-1 text-text-primary">{ex.setup}</p>
                  </div>
                  <div className="flex items-center gap-2 text-accent-primary">
                    <span className="text-lg">🔄</span>
                    <p className="text-sm italic">{ex.pivot}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-error">
                      Punchline
                    </p>
                    <p className="mt-1 text-lg font-semibold text-text-primary">
                      &laquo; {ex.punchline} &raquo;
                    </p>
                  </div>
                  <div className="rounded-lg bg-background-elevated p-3">
                    <p className="text-xs font-semibold text-text-muted">
                      Analyse
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {ex.analysis}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Types de pivots */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">
            Les 6 types de pivots
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Double sens",
                emoji: "🔀",
                desc: "Un mot a deux significations — tu en installes une et tu révèles l'autre.",
                example: "\"J'ai perdu 10 kilos.\" → \"Si quelqu'un les trouve...\"",
              },
              {
                name: "Retournement",
                emoji: "🪃",
                desc: "La situation se retourne complètement contre les attentes.",
                example: "\"Mon psy m'a dit que j'étais normal.\" → \"J'ai changé de psy.\"",
              },
              {
                name: "Exagération",
                emoji: "📈",
                desc: "Tu pousses un détail tellement loin qu'il devient absurde.",
                example: "\"J'ai tellement bossé que même mon café s'est endormi.\"",
              },
              {
                name: "Décalage",
                emoji: "🎭",
                desc: "Tu mélanges deux univers qui n'ont rien à voir.",
                example: "\"Mon GPS m'a dit de tourner à droite. J'étais dans un ascenseur.\"",
              },
              {
                name: "Sous-entendu",
                emoji: "😏",
                desc: "Tu ne dis pas tout — le cerveau de l'audience complète et rit.",
                example: "\"Ma copine m'a dit 'choisis, c'est moi ou le foot'. Elle me manque.\"",
              },
              {
                name: "Anti-chute",
                emoji: "🙃",
                desc: "Tu installes une attente de blague... et la chute est banale (mais c'est ça qui est drôle).",
                example: "\"Le secret de la réussite ? Se lever tôt.\" → \"Voilà, c'est tout.\"",
              },
            ].map((pivot) => (
              <div
                key={pivot.name}
                className="rounded-xl border border-border bg-background-card p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{pivot.emoji}</span>
                  <h3 className="font-semibold text-text-primary">
                    {pivot.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{pivot.desc}</p>
                <p className="mt-2 text-sm italic text-text-muted">
                  {pivot.example}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Erreurs courantes */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">
            Les 5 erreurs qui tuent une vanne
          </h2>
          <div className="space-y-3">
            {[
              {
                error: "La punchline est plus longue que le setup",
                fix: "Raccourcis la chute. Si elle fait plus de 10 mots, supprime les mots inutiles.",
              },
              {
                error: "Le pivot est prévisible",
                fix: "Si tu vois la chute venir, ton audience aussi. Prends le chemin le plus inattendu.",
              },
              {
                error: "Le setup est trop long",
                fix: "Si tu mets plus de 20 secondes à planter le décor, tu as perdu. Coupe tout ce qui n'est pas essentiel.",
              },
              {
                error: "Pas de vrai pivot — juste un jeu de mots forcé",
                fix: "Un calembour qui ne marche qu'à l'écrit, c'est un jeu de mots. Pas une vanne.",
              },
              {
                error: "Tu expliques pourquoi c'est drôle après la chute",
                fix: "Si tu dois expliquer, c'est que la vanne n'est pas claire. Réécris-la.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-background-card p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-error">✗</span>
                  <div>
                    <p className="font-medium text-text-primary">
                      {item.error}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      <span className="text-success">→</span> {item.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-xl border border-accent-primary/30 bg-background-card p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary">
            Maintenant, à toi de jouer
          </h2>
          <p className="mt-3 text-text-secondary">
            Tu connais la théorie. Place à la pratique.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/vannes"
              className="inline-flex items-center justify-center rounded-lg bg-accent-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-primary-hover"
            >
              Voir des vannes en action
            </Link>
            <Link
              href="/quiz-humour"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-background-elevated"
            >
              Découvre ton profil humour
            </Link>
            <Link
              href="/conseils"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-background-elevated"
            >
              Techniques de pro
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="mb-6 font-display text-xl font-bold text-text-primary">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {anatomyFaqs.map((faq) => (
              <details key={faq.question} className="group">
                <summary className="cursor-pointer font-medium text-text-primary hover:text-accent-primary">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-text-secondary pl-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

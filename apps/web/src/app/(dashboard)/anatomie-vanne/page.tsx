import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_OG_IMAGE } from "@/lib/seo-meta";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: { absolute: "Anatomie d'une vanne : setup, pivot et punchline" },
  description:
    "Setup, pivot et punchline : décortique les 3 composants d'une blague qui fait rire, avec des exemples concrets de Paul Mirabel, Fary et Blanche Gardin.",
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
      "Setup, pivot, punchline : comprends pourquoi certaines vannes tuent et d'autres tombent à plat.",
    url: "https://deviens-marrant.fr/anatomie-vanne",
    images: [DEFAULT_OG_IMAGE],
  },
};

const anatomyFaqs = [
  {
    question: "C'est quoi le setup d'une blague ?",
    answer:
      "Le setup, c'est la mise en place : la première partie de la vanne, celle qui installe le contexte et crée une attente chez ceux qui écoutent. Un bon setup est court, clair, et il emmène tout le monde dans une direction, pour que la chute puisse les envoyer dans une autre.",
  },
  {
    question: "Comment écrire une bonne punchline ?",
    answer:
      "Une bonne punchline est plus courte que le setup, inattendue, et elle crée un décalage. La règle d'or : enlève tous les mots qui ne servent pas la chute. Les meilleures punchlines tiennent en moins de 10 mots. Teste-la à voix haute devant quelqu'un : si tu dois expliquer pourquoi c'est drôle, c'est qu'elle n'est pas encore prête.",
  },
  {
    question: "C'est quoi le pivot dans une vanne ?",
    answer:
      "Le pivot, c'est le moment exact où la blague change de direction, le mécanisme qui crée la surprise : un mot à double sens, une situation qui se retourne, une association inattendue. Sans pivot, pas de surprise, et sans surprise, pas de rire.",
  },
  {
    question: "Quelle est la différence entre une blague et un one-liner ?",
    answer:
      "Un one-liner fait tenir setup, pivot et punchline dans une seule phrase. La structure est la même, en version compressée. C'est plus court à dire, mais plus long à écrire : chaque mot doit mériter sa place, parce qu'il n'y a nulle part où cacher un mot en trop.",
  },
];

const vanneExamples = [
  {
    category: "Observation",
    setup: "J'ai lancé une séance de sport sur une appli, dans mon salon.",
    pivot: "On attend l'effort, on découvre qui a vraiment remarqué l'abandon",
    punchline: "Après 4 minutes, elle m'a demandé : « Toujours là ? »",
    analysis:
      "Setup court et relatable (tout le monde a déjà ouvert une appli de sport pleine de bonnes intentions). Le pivot est invisible : l'appli censée te motiver se met à vérifier que tu n'es pas parti. La punchline tient en 8 mots, et c'est l'appli qui la délivre à ta place : tu n'as même pas besoin d'avouer que tu t'es arrêté.",
  },
  {
    category: "Autodérision",
    setup: "Chez le coiffeur, on m'a demandé ce que je voulais comme coupe.",
    pivot: "On attend une coupe, tu demandes une personnalité",
    punchline: "J'ai montré la photo d'un mec sûr de lui.",
    analysis:
      "Setup universel (tout le monde a déjà séché devant cette question). Le pivot déplace la demande : ce qu'on veut vraiment chez le coiffeur, ce n'est pas une coupe, c'est l'assurance qui va avec. La punchline tient en 9 mots, et comme la cible, c'est toi, personne n'est vexé.",
  },
  {
    category: "Absurde",
    setup: "Mon voisin met la musique à fond tous les soirs.",
    pivot: "La politesse poussée jusqu'à s'excuser d'être la victime",
    punchline: "Hier, je suis allé m'excuser de dormir.",
    analysis:
      "Setup de 10 mots que tout le monde a vécu. Le pivot inverse les rôles : au lieu de te plaindre, tu t'excuses, comme si c'était toi qui dérangeais. La punchline tient en 7 mots et l'image reste : toi, en pyjama, sur son palier, désolé d'avoir sommeil.",
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

      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            Anatomie d&apos;une vanne
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Pourquoi la même vanne fait un carton chez l&apos;un et un blanc chez l&apos;autre&nbsp;?
            <br className="hidden sm:block" />
            Réponse en 3 parties, sans la moindre équation.
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
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-accent-link">
                Partie 1
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-text-primary">
                Le Setup
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                La <strong>mise en place</strong>. Tu installes le contexte et tu emmènes
                les gens dans une direction, en leur laissant croire qu&apos;ils savent où
                tu vas. Plus c&apos;est court et clair, mieux ça marche.
              </p>
              <div className="mt-4 rounded-lg bg-background-elevated p-3">
                <p className="text-xs font-semibold text-text-muted">Règle d&apos;or</p>
                <p className="mt-1 text-sm text-text-primary">
                  Le setup doit être <strong>plus long</strong> que la punchline.
                  Il pose le décor, la chute le renverse.
                </p>
              </div>
            </div>

            {/* Pivot */}
            <div className="relative rounded-xl border border-accent-primary/30 bg-background-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/20 text-3xl">
                🔄
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-accent-link">
                Partie 2
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-text-primary">
                Le Pivot
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                Le <strong>point de bascule</strong> : le moment exact où la blague change de
                direction. Personne ne le voit passer, et c&apos;est précisément pour ça que
                la surprise fonctionne.
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
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-red-400">
                Partie 3
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-text-primary">
                La Punchline
              </h2>
              <p className="mt-3 text-sm text-text-secondary">
                La <strong>chute</strong> : la phrase qui déclenche le rire. Elle doit
                surprendre et rester courte, et une fois entendue, elle doit paraître
                évidente, comme si tu avais pu la trouver toi-même.
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
            <span className="text-sm font-semibold text-accent-link">
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
                  <span className="text-xs font-bold uppercase tracking-widest text-accent-link">
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
                  <div className="flex items-center gap-2 text-accent-link">
                    <span className="text-lg">🔄</span>
                    <p className="text-sm italic">{ex.pivot}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-red-400">
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
                desc: "Un mot a deux sens : tu en installes un, et la chute révèle l'autre.",
                example: "« Mon chef m'a dit de prendre des initiatives. » → « J'ai pris mon vendredi. »",
              },
              {
                name: "Retournement",
                emoji: "🪃",
                desc: "La situation part dans le sens exactement opposé à celui qu'on attendait.",
                example: "« Mon psy m'a dit que j'étais normal. » → « J'ai changé de psy. »",
              },
              {
                name: "Exagération",
                emoji: "📈",
                desc: "Tu pousses un détail tellement loin qu'il devient absurde.",
                example: "« J'ai tellement de mails non lus que les plus anciens m'écrivent pour prendre de mes nouvelles. »",
              },
              {
                name: "Décalage",
                emoji: "🎭",
                desc: "Tu mélanges deux univers qui n'ont rien à voir.",
                example: "« J'ai présenté mon nouveau canapé à mes parents. Mon père lui a demandé ce qu'il faisait dans la vie. »",
              },
              {
                name: "Sous-entendu",
                emoji: "😏",
                desc: "Tu ne dis pas tout : le public complète tout seul, et c'est en complétant qu'il rit.",
                example: "« Ma mère m'a demandé comment était le repas chez mes beaux-parents. J'ai dit que la nappe était très jolie. »",
              },
              {
                name: "Anti-chute",
                emoji: "🙃",
                desc: "Tu installes une attente énorme, et la chute est d'une banalité totale. C'est l'écart qui fait rire.",
                example: "« Mon père m'a pris à part, l'air grave, pour me transmettre le secret de famille. » → « On met le lait après les céréales. »",
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
                fix: "Raccourcis la chute. Si elle dépasse 10 mots, traque ceux qui ne servent à rien : il y en a toujours.",
              },
              {
                error: "Le pivot est prévisible",
                fix: "Si toi, tu vois la chute arriver, les autres l'ont vue avant toi. Écarte la première idée qui vient et cherche celle d'après.",
              },
              {
                error: "Le setup est trop long",
                fix: "Si tu mets plus de 20 secondes à planter le décor, les gens ont déjà commencé à regarder leur verre. Coupe tout ce dont la chute n'a pas besoin.",
              },
              {
                error: "Pas de vrai pivot : juste un jeu de mots forcé",
                fix: "Un calembour qui ne marche que parce que « ça sonne pareil », c'est un jeu de mots, pas une vanne. Cherche un retournement d'idée plutôt qu'un retournement de syllabes.",
              },
              {
                error: "Tu expliques pourquoi c'est drôle après la chute",
                fix: "Si tu dois expliquer, c'est que la vanne n'est pas encore claire. Réécris-la, et garde l'explication pour toi.",
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
            La théorie tient sur une page. La pratique, elle, commence à la prochaine conversation.
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
                <summary className="cursor-pointer font-medium text-text-primary hover:text-accent-link">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-text-secondary pl-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

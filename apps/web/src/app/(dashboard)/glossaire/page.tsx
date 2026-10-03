import type { Metadata } from "next";
import Link from "next/link";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildDefinedTermListJsonLd,
} from "@/components/seo/json-ld";
import { PageHeader } from "@/components/layout/page-header";
import { frTypo } from "@/lib/fr-typo";
import { buttonVariants } from "@/components/ui/button";

/** Ancre d'un terme : même règle que l'URL du JSON-LD DefinedTerm. */
const termAnchor = (term: string) => term.toLowerCase().replace(/\s+/g, "-");

export const metadata: Metadata = {
  title: "Glossaire humour : 12 termes clés",
  description:
    "Punchline, timing, callback, one-liner : le dico de l'humour qui explique 12 termes clés des pros, chacun avec un exemple concret pour bien le replacer.",
  keywords: [
    "définition répartie",
    "qu'est-ce que la répartie",
    "timing humour définition",
    "autodérision définition",
    "glossaire humour",
    "vocabulaire humour",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/glossaire" },
};

const glossary = [
  {
    term: "Répartie",
    definition:
      "Capacité à répondre vite et juste à une remarque, souvent avec humour, pendant que la conversation est encore là (et pas le soir sous la douche). La répartie repose sur des techniques précises comme l'accusé de réception, le rebond sur mot-clé ou le retournement, et elle se travaille comme n'importe quel réflexe : en pratiquant souvent.",
    related: "/conseils",
    relatedLabel: "Techniques de répartie",
  },
  {
    term: "Timing",
    definition:
      "Le choix du moment exact où placer une blague, une pause ou une punchline. Le timing, ce sont les silences, le rythme et la capacité à sentir la salle, que ce soit un comedy club ou un dîner entre amis. C'est souvent ce qui sépare un éclat de rire d'un « ah… d'accord ».",
    related: "/videos",
    relatedLabel: "Voir le timing en action",
  },
  {
    term: "Autodérision",
    definition:
      "Technique d'humour qui consiste à rire de soi, sans se démolir. Bien dosée, elle désarme la personne en face et montre que tu es à l'aise avec toi-même. La nuance compte : tu ne te rabaisses pas, tu fais de tes petits défauts une blague que tout le monde peut partager, toi le premier.",
    related: "/conseils",
    relatedLabel: "Apprendre l'autodérision",
  },
  {
    term: "Punchline",
    definition:
      "La chute d'une blague : la phrase finale qui déclenche le rire. Une bonne punchline est inattendue, courte, et elle prend le setup (la mise en place) à contre-pied. Les meilleurs humoristes la travaillent mot par mot, parce qu'un seul mot de trop suffit à la dégonfler.",
    related: "/vannes",
    relatedLabel: "Exemples de punchlines",
  },
  {
    term: "Storytelling",
    definition:
      "L'art de raconter une histoire drôle sans perdre personne en route. En humour, le storytelling repose sur 3 ingrédients : une structure claire (une situation, une complication, une chute), des détails précis qu'on peut presque voir, et un rythme qui donne envie d'entendre la suite.",
    related: "/parcours",
    relatedLabel: "Parcours storytelling",
  },
  {
    term: "One-liner",
    definition:
      "Blague courte en une seule phrase, facile à retenir et à ressortir. Le one-liner est l’arme la plus légère à emporter en soirée : il ne demande pas de contexte et passe presque partout. C'est le format idéal pour débuter, parce que s'il ne prend pas, la conversation a déjà repris avant que quelqu'un le remarque.",
    related: "/vannes",
    relatedLabel: "Voir les one-liners",
  },
  {
    term: "Observationnel",
    definition:
      "Style d'humour qui part de l'observation du quotidien : l'humoriste décrit ce que tout le monde vit sans jamais le dire à voix haute, et le public rit de se reconnaître. C'est le terrain de jeu favori de nombreux pros de la scène française.",
    related: "/videos",
    relatedLabel: "Vidéos observationnelles",
  },
  {
    term: "Setup",
    definition:
      "La mise en place d'une blague : la partie qui crée l'attente avant la punchline. Un bon setup emmène le public dans une direction pour que la chute l'envoie dans une autre. Plus le setup est crédible, plus la surprise est forte, et plus la punchline est drôle.",
    related: "/blog",
    relatedLabel: "Guide des techniques",
  },
  {
    term: "Callback",
    definition:
      "Technique qui consiste à ressortir une blague déjà faite, plus tard dans la conversation. Le callback récompense ceux qui ont suivi et donne à tout le monde l'impression de partager une private joke, alors qu'elle est née pendant l'apéro. Très utilisé en stand-up comme entre potes.",
    related: "/conseils",
    relatedLabel: "Techniques avancées",
  },
  {
    term: "Escalade comique",
    definition:
      "Technique de répartie où tu surenchéris sur une remarque en l'exagérant jusqu'à l'absurde. Au lieu de nier ou de te justifier, tu pousses le propos encore plus loin que la personne en face, qui se retrouve à devoir te retenir. Les pros de la scène s'en servent régulièrement en spectacle.",
    related: "/blog/comment-avoir-de-la-repartie",
    relatedLabel: "10 techniques de répartie",
  },
  {
    term: "Accusé de réception",
    definition:
      "Première technique de répartie : face à une remarque, tu commences par accuser réception (« Intéressant », « Pas faux », « Bien vu ») pour gagner 2-3 secondes et trouver ta vraie réponse. Vu de l'extérieur, tu as l'air de réfléchir calmement, alors qu'en dedans c'est la panique au standard.",
    related: "/conseils",
    relatedLabel: "Pratiquer la technique",
  },
  {
    term: "Rebond sur mot-clé",
    definition:
      "Technique de répartie qui consiste à attraper un mot dans la phrase de l'autre et à construire ta réponse dessus. Exemple : « T'es jamais content », et tu rebondis sur « jamais » : « Si, une fois. Le serveur s'était trompé dans l'addition. En ma faveur. »",
    related: "/conseils",
    relatedLabel: "Exercices de rebond",
  },
];

export default function GlossairePage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          { name: "Glossaire", url: "https://deviens-marrant.fr/glossaire" },
        ])}
      />
      <JsonLd
        data={buildDefinedTermListJsonLd(
          glossary.map((item) => ({
            term: item.term,
            definition: item.definition,
            url: `https://deviens-marrant.fr/glossaire#${termAnchor(item.term)}`,
          })),
        )}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary max-md:py-3.5">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Glossaire</span>
      </nav>

      <PageHeader
        title={<>Glossaire humour&nbsp;: les termes à connaître pour devenir drôle</>}
        lead={
          <>
            Répartie, timing, autodérision, punchline… Les mots que les
            humoristes utilisent entre eux, expliqués simplement et avec des
            exemples concrets. Parce que savoir comment s&apos;appelle une
            technique, c&apos;est déjà un peu savoir s&apos;en servir.
          </>
        }
      />

      {/* T49 : index collant des 12 termes (libellés = termes existants), sous le header sticky */}
      <nav
        aria-label="Glossaire"
        className="sticky top-16 z-30 mb-6 border-b border-border bg-background/90 backdrop-blur-md"
      >
        {/* À partir de 1024 px, l'index passe à la ligne au lieu de couper un terme (« Accusé de réception »). */}
        <ul className="flex snap-x gap-0 overflow-x-auto py-1 lg:flex-wrap lg:overflow-visible">
          {glossary.map((item) => (
            <li key={item.term} className="shrink-0 snap-start">
              <a
                href={`#${termAnchor(item.term)}`}
                className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-md px-2 text-sm text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
              >
                {item.term}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-4xl space-y-6">
        {glossary.map((item) => (
          <section
            key={item.term}
            id={termAnchor(item.term)}
            className="scroll-mt-32 rounded-xl border border-border bg-background-card p-6 lg:scroll-mt-44"
          >
            <h2 className="font-display text-xl font-bold text-text-primary">
              {item.term}
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-text-secondary">
              {frTypo(item.definition)}
            </p>
            <Link
              href={item.related}
              className="mt-3 inline-block text-sm font-medium text-accent-link hover:underline"
            >
              {item.relatedLabel} →
            </Link>
          </section>
        ))}
      </div>

      {/* Cross-linking SEO */}
      <nav className="mt-12 border-t border-border pt-8">
        <h2 className="font-display mb-4 text-xl font-bold">Passe de la théorie à la pratique</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/vannes" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Vannes et blagues drôles</h3>
            <p className="mt-1 text-xs text-text-secondary">Repère le setup, la punchline et le timing dans des vannes prêtes à ressortir.</p>
          </Link>
          <Link href="/conseils" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">Conseils de répartie</h3>
            <p className="mt-1 text-xs text-text-secondary">Techniques concrètes de timing, autodérision et storytelling.</p>
          </Link>
          <Link href="/a-propos" className="rounded-lg border border-border bg-background-card p-4 transition-colors hover:border-accent-primary/40">
            <h3 className="text-sm font-semibold text-text-primary">À propos</h3>
            <p className="mt-1 text-xs text-text-secondary">Qui est derrière deviens-marrant.fr, et pourquoi on pense que l&apos;humour s&apos;apprend.</p>
          </Link>
        </div>
      </nav>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
        <p className="font-display text-xl font-bold text-text-primary">
          Le vocabulaire, c&apos;est fait. Place aux rires.
        </p>
        <p className="mt-2 text-text-secondary">
          Des exercices concrets, des parcours étape par étape et tes XP pour
          voir le chemin parcouru. Connaître le mot « callback », c&apos;est
          bien ; en placer un au dîner de samedi, c&apos;est mieux.
        </p>
        <Link href="/abonnement" className={buttonVariants({ variant: "primary", size: "lg", className: "mt-4" })}>
          Commencer à 2,99 €/mois
        </Link>
      </div>
    </>
  );
}

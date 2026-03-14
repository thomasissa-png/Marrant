import type { Metadata } from "next";
import Link from "next/link";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Glossaire humour — définitions répartie, timing, autodérision",
  description:
    "Définitions des termes clés de l'humour : répartie, timing, autodérision, storytelling, punchline, one-liner. Le vocabulaire pour devenir drôle.",
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
      "Capacité à répondre rapidement et avec à-propos à une remarque, souvent avec humour. La répartie repose sur des techniques précises comme l'accusé de réception, le rebond sur mot-clé ou le retournement. Elle se travaille avec de la pratique régulière.",
    related: "/conseils",
    relatedLabel: "Techniques de répartie",
  },
  {
    term: "Timing",
    definition:
      "Art de choisir le moment exact où placer une blague, une pause ou une punchline pour maximiser l'effet comique. Un bon timing inclut les silences, le rythme et la capacité à lire l'audience. C'est souvent la différence entre un éclat de rire et un flop.",
    related: "/videos",
    relatedLabel: "Voir le timing en action",
  },
  {
    term: "Autodérision",
    definition:
      "Technique d'humour qui consiste à rire de soi-même avec confiance. L'autodérision désarme l'interlocuteur et montre une sécurité émotionnelle. Ce n'est pas se dévaloriser, mais transformer ses faiblesses en source de rire partagé.",
    related: "/conseils",
    relatedLabel: "Apprendre l'autodérision",
  },
  {
    term: "Punchline",
    definition:
      "La chute d'une blague — la phrase finale qui déclenche le rire. Une bonne punchline est inattendue, concise et crée un décalage avec le setup (la mise en place). Les meilleurs humoristes travaillent leurs punchlines mot par mot.",
    related: "/vannes",
    relatedLabel: "Exemples de punchlines",
  },
  {
    term: "Storytelling",
    definition:
      "Art de raconter une histoire de manière captivante et drôle. En humour, le storytelling repose sur 3 ingrédients : une structure claire (situation → complication → chute), des détails sensoriels et un rythme qui maintient l'attention.",
    related: "/parcours",
    relatedLabel: "Parcours storytelling",
  },
  {
    term: "One-liner",
    definition:
      "Blague courte en une seule phrase, facile à mémoriser et à ressortir. Le one-liner est l'arme secrète en société : il ne demande pas de contexte et fonctionne dans toutes les situations. Idéal pour débuter.",
    related: "/vannes",
    relatedLabel: "Voir les one-liners",
  },
  {
    term: "Observationnel",
    definition:
      "Style d'humour basé sur l'observation du quotidien. L'humoriste décrit des situations que tout le monde vit mais que personne ne formule. Seinfeld, Florence Foresti et Gad Elmaleh sont des maîtres de l'humour observationnel.",
    related: "/videos",
    relatedLabel: "Vidéos observationnelles",
  },
  {
    term: "Setup",
    definition:
      "La mise en place d'une blague — la partie qui crée l'attente avant la punchline. Un bon setup oriente l'audience dans une direction pour que la chute crée un effet de surprise. Plus le setup est crédible, plus la punchline est drôle.",
    related: "/blog",
    relatedLabel: "Guide des techniques",
  },
  {
    term: "Callback",
    definition:
      "Technique qui consiste à faire référence à une blague précédente plus tard dans la conversation. Le callback récompense l'audience attentive et crée un sentiment de complicité. Très utilisé en stand-up et en conversation de groupe.",
    related: "/conseils",
    relatedLabel: "Techniques avancées",
  },
  {
    term: "Escalade comique",
    definition:
      "Technique de répartie où l'on surenchérit sur une remarque en l'exagérant de manière absurde. Au lieu de nier ou de se justifier, on pousse le propos encore plus loin pour créer un effet comique. Gad Elmaleh l'utilise en spectacle.",
    related: "/blog",
    relatedLabel: "7 techniques de répartie",
  },
  {
    term: "Accusé de réception",
    definition:
      "Première technique de répartie : face à une remarque, on commence par accuser réception (« Intéressant », « Pas faux », « Bien vu ») pour gagner 2-3 secondes et formuler sa vraie réponse. Simple et redoutablement efficace.",
    related: "/conseils",
    relatedLabel: "Pratiquer la technique",
  },
  {
    term: "Rebond sur mot-clé",
    definition:
      "Technique de répartie qui consiste à prendre un mot dans la phrase de l'interlocuteur et à construire sa réponse dessus. Exemple : « T'es toujours en retard » → rebond sur « toujours » : « Toujours ? La dernière fois j'étais à l'heure, c'est juste que personne ne m'a vu. »",
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
      <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-text-secondary">Glossaire</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Glossaire humour : les termes à connaître pour devenir drôle
        </h1>
        <p className="mt-2 text-text-secondary">
          Répartie, timing, autodérision, punchline... Tous les termes clés
          de l&apos;humour expliqués simplement. Le vocabulaire indispensable
          pour comprendre les techniques et progresser.
        </p>
      </div>

      <div className="space-y-6">
        {glossary.map((item) => (
          <section
            key={item.term}
            id={item.term.toLowerCase().replace(/\s+/g, "-")}
            className="rounded-xl border border-border bg-background-card p-6"
          >
            <h2 className="font-display text-xl font-bold text-text-primary">
              {item.term}
            </h2>
            <p className="mt-3 text-text-secondary leading-relaxed">
              {item.definition}
            </p>
            <Link
              href={item.related}
              className="mt-3 inline-block text-sm font-medium text-accent-primary hover:underline"
            >
              {item.relatedLabel} →
            </Link>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-lg border border-border bg-background-card p-6 text-center">
        <p className="font-display text-xl font-bold text-text-primary">
          Prêt à mettre ces termes en pratique ?
        </p>
        <p className="mt-2 text-text-secondary">
          Des exercices concrets, des parcours pas à pas, et un système de
          progression pour devenir drôle au quotidien.
        </p>
        <Link href="/register" className="mt-4 inline-block">
          <button className="rounded-lg bg-accent-primary px-6 py-3 font-medium text-white hover:bg-accent-primary/90">
            Commencer à 0,99 €/mois
          </button>
        </Link>
      </div>
    </>
  );
}

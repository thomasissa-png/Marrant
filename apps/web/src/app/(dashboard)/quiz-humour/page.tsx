import type { Metadata } from "next";
import { ViralQuiz } from "@/components/quiz/viral-quiz";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Quiz : quel type d'humour es-tu ?",
  description:
    "Découvre ton profil humour en 2 minutes : Observateur, Storyteller, Absurde, Punchlineur ou Taquin ? Quiz gratuit inspiré des techniques du stand-up.",
  keywords: [
    "quiz humour",
    "type humour",
    "quel humour",
    "profil humour",
    "test humour",
    "style humour",
    "quiz personnalité drôle",
    "quel humoriste es-tu",
  ],
  alternates: { canonical: "https://deviens-marrant.fr/quiz-humour" },
  openGraph: {
    title: "Quel type d'humour es-tu ? Quiz en 12 questions",
    description:
      "Observateur comme Frayssinet ? Storyteller comme Mirabel ? Découvre ton profil humour en 2 minutes.",
    url: "https://deviens-marrant.fr/quiz-humour",
    type: "website",
  },
};

const quizFaqs = [
  {
    question: "Combien de temps dure le quiz ?",
    answer:
      "Le quiz prend environ 2 minutes. Il comporte 12 questions à choix multiples, chacune liée à des situations du quotidien (soirées, boulot, dates, messages...).",
  },
  {
    question: "Quels sont les profils humour possibles ?",
    answer:
      "Il existe 5 profils : L'Observateur (style Roman Frayssinet), Le Storyteller (style Paul Mirabel), L'Absurde (style Fary), Le Punchlineur (style Blanche Gardin) et Le Taquin (style Waly Dia). Chaque profil est associé à des forces et des conseils personnalisés.",
  },
  {
    question: "Le quiz est-il gratuit ?",
    answer:
      "Oui, le quiz est 100% gratuit et accessible sans inscription. Tu peux le refaire autant de fois que tu veux et partager ton résultat.",
  },
  {
    question: "Comment le profil est-il calculé ?",
    answer:
      "Chaque réponse attribue des points aux 5 profils. À la fin des 12 questions, le profil avec le plus de points devient ton profil dominant. Les questions couvrent tes réactions en soirée, au travail, en conversation et face au stress.",
  },
  {
    question: "Je peux partager mon résultat ?",
    answer:
      "Oui ! À la fin du quiz, un bouton de partage te permet d'envoyer ton profil par message, sur les réseaux sociaux ou de copier le lien. Challenge tes potes pour comparer vos profils.",
  },
];

export default function QuizHumourPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Accueil", url: "https://deviens-marrant.fr" },
          {
            name: "Quiz Humour",
            url: "https://deviens-marrant.fr/quiz-humour",
          },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(quizFaqs)} />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            Quel type d&apos;humour es-tu ?
          </h1>
          <p className="mt-3 text-text-secondary">
            12 questions pour découvrir ton profil humour — 2 minutes chrono
          </p>
        </div>

        <ViralQuiz />

        {/* SEO content below quiz */}
        <section className="mt-16 space-y-8">
          <div className="rounded-xl border border-border bg-background-card p-6">
            <h2 className="font-display text-xl font-bold text-text-primary">
              5 profils, 5 styles de stand-up
            </h2>
            <p className="mt-3 text-text-secondary">
              Chaque profil correspond à un style d&apos;humour qu&apos;on retrouve chez les
              meilleurs humoristes français. <strong>L&apos;Observateur</strong> comme Roman
              Frayssinet repère les détails absurdes du quotidien. <strong>Le
              Storyteller</strong> comme Paul Mirabel transforme la moindre anecdote en
              sketch. <strong>L&apos;Absurde</strong> comme Fary surprend en permanence avec
              des associations imprévisibles. <strong>Le Punchlineur</strong> comme Blanche
              Gardin fait mouche en peu de mots. <strong>Le Taquin</strong> comme Waly Dia a
              toujours la bonne réplique au bon moment.
            </p>
            <p className="mt-3 text-text-secondary">
              Connaître ton profil, c&apos;est savoir quelles <a href="/conseils" className="text-accent-primary hover:underline">techniques
              travailler en priorité</a> pour progresser plus vite. Un Storyteller n&apos;a pas
              les mêmes exercices qu&apos;un Punchlineur — et c&apos;est normal.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background-card p-6">
            <h2 className="font-display text-xl font-bold text-text-primary">
              À quoi sert ce quiz ?
            </h2>
            <p className="mt-3 text-text-secondary">
              Pas à te coller une étiquette. À te donner un <strong>point de
              départ</strong> pour progresser. Que tu veuilles{" "}
              <a href="/blog/comment-devenir-drole" className="text-accent-primary hover:underline">devenir plus drôle</a>,{" "}
              <a href="/blog/comment-avoir-de-la-repartie" className="text-accent-primary hover:underline">avoir de la répartie</a> ou
              juste <a href="/vannes" className="text-accent-primary hover:underline">stocker des vannes</a> pour la machine à café — ton
              profil te guide vers les bons contenus.
            </p>
            <p className="mt-3 text-text-secondary">
              Et si tu veux aller plus loin, nos{" "}
              <a href="/parcours" className="text-accent-primary hover:underline">parcours structurés</a>{" "}
              et nos{" "}
              <a href="/videos" className="text-accent-primary hover:underline">analyses de vidéos stand-up</a>{" "}
              t&apos;accompagnent semaine par semaine.
            </p>
          </div>

          {/* FAQ */}
          <div className="rounded-xl border border-border bg-background-card p-6">
            <h2 className="font-display text-xl font-bold text-text-primary">
              Questions fréquentes
            </h2>
            <div className="mt-4 space-y-4">
              {quizFaqs.map((faq) => (
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
          </div>
        </section>
      </main>
    </>
  );
}

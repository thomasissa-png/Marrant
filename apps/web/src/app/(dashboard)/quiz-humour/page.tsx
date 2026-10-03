import type { Metadata } from "next";
import { ViralQuiz } from "@/components/quiz/viral-quiz";
import { QUIZ_QUESTIONS } from "@/components/quiz/quiz-data";
import {
  JsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Quiz : quel type d'humour es-tu ?",
  description:
    "Observateur, Storyteller, Absurde, Punchlineur ou Taquin ? Ce quiz gratuit inspiré du stand-up te dit en 2 minutes quel type d'humour est le tien.",
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
    title: `Quel type d'humour es-tu ? Quiz en ${QUIZ_QUESTIONS.length} questions`,
    description:
      "Observateur, Storyteller, Absurde, Punchlineur ou Taquin ? Découvre ton profil humour en 2 minutes.",
    url: "https://deviens-marrant.fr/quiz-humour",
    type: "website",
  },
};

const quizFaqs = [
  {
    question: "Combien de temps dure le quiz ?",
    answer:
      `Environ 2 minutes, le temps que ton café refroidisse. Tu réponds à ${QUIZ_QUESTIONS.length} questions à choix multiples, toutes tirées de situations que tu connais : soirées, boulot, rencards, messages.`,
  },
  {
    question: "Quels sont les profils humour possibles ?",
    answer:
      "Il existe 5 profils : L'Observateur (l'observation précise), Le Storyteller (le récit qui monte), L'Absurde (la surprise permanente), Le Punchlineur (le mot juste et les silences) et Le Taquin (la répartie complice). Chaque profil vient avec sa force principale et un conseil concret pour progresser dans ton style.",
  },
  {
    question: "Le quiz est-il gratuit ?",
    answer:
      "Oui, le quiz est 100% gratuit et se fait sans inscription. Tu peux le refaire autant de fois que tu veux, jusqu'à tomber sur le profil qui te plaît (on ne dira rien).",
  },
  {
    question: "Comment le profil est-il calculé ?",
    answer:
      `Chaque réponse donne des points aux 5 profils. Au bout des ${QUIZ_QUESTIONS.length} questions, celui qui en a le plus devient ton profil dominant. Les questions passent en revue tes réflexes en soirée, au travail, en conversation et quand la pression monte.`,
  },
  {
    question: "Je peux partager mon résultat ?",
    answer:
      "Oui. À la fin du quiz, le bouton de partage t'aide à envoyer ton profil par message, sur les réseaux ou à copier le lien. Fais-le passer à tes potes : comparer vos profils, c'est souvent plus drôle que le quiz lui-même.",
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

      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            Quel type d&apos;humour es-tu ?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-balance text-text-secondary">
            {QUIZ_QUESTIONS.length} questions sur tes réflexes en soirée, au boulot et par message. Compte 2 minutes, moins que pour choisir un film.
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
              pros de la scène. <strong>L&apos;Observateur</strong> repère les détails
              absurdes du quotidien. <strong>Le Storyteller</strong> transforme la moindre
              anecdote en sketch. <strong>L&apos;Absurde</strong> surprend en permanence avec
              des associations imprévisibles. <strong>Le Punchlineur</strong> tape juste
              avec trois fois rien. <strong>Le Taquin</strong> a toujours la bonne réplique
              au bon moment.
            </p>
            <p className="mt-3 text-text-secondary">
              Connaître ton profil, c&apos;est savoir quelles <a href="/conseils" className="text-accent-link hover:underline">techniques
              travailler en priorité</a> pour progresser plus vite. Un Storyteller et un
              Punchlineur ne s&apos;entraînent pas de la même façon, un peu comme un marathonien
              et un sprinteur qui partageraient le même vestiaire.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background-card p-6">
            <h2 className="font-display text-xl font-bold text-text-primary">
              À quoi sert ce quiz ?
            </h2>
            <p className="mt-3 text-text-secondary">
              Pas à te coller une étiquette sur le front, plutôt à te donner un <strong>point de
              départ</strong> pour progresser. Que tu veuilles{" "}
              <a href="/blog/comment-devenir-drole" className="text-accent-link hover:underline">devenir plus drôle</a>,{" "}
              <a href="/blog/comment-avoir-de-la-repartie" className="text-accent-link hover:underline">avoir de la répartie</a> ou
              juste <a href="/vannes" className="text-accent-link hover:underline">avoir des vannes d&apos;avance</a> pour la machine à café, ton
              profil t&apos;indique par quoi commencer.
            </p>
            <p className="mt-3 text-text-secondary">
              Et le jour où tu veux aller plus loin, nos{" "}
              <a href="/parcours" className="text-accent-link hover:underline">parcours structurés</a>{" "}
              et nos{" "}
              <a href="/videos" className="text-accent-link hover:underline">analyses de vidéos stand-up</a>{" "}
              prennent le relais, une semaine à la fois.
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
                  <summary className="cursor-pointer font-medium text-text-primary hover:text-accent-link">
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
      </div>
    </>
  );
}

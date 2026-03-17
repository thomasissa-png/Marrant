"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AuthModal } from "@/components/auth/auth-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const parcours = [
  {
    emoji: "☕",
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    duration: "3 semaines",
    timePerWeek: "15 min/semaine",
    difficulty: "DEBUTANT → INTERMEDIAIRE",
    persona: "Idéal si tu travailles en équipe et veux briller à la pause, en réunion ou en afterwork",
    description:
      "Tu veux avoir des anecdotes et vannes à ressortir au bon moment ? En 3 semaines, tu auras un arsenal de vannes courtes, le bon timing pour les placer, et des techniques pour captiver tes collègues.",
    testimonial:
      "« Avant je restais muette à la machine à café. Maintenant c'est moi qu'on vient voir pour la vanne du jour. »",
    modules: [
      {
        week: "Semaine 1",
        title: "Vannes courtes et mémorisables",
        detail:
          "Apprends à retenir et placer des one-liners et jeux de mots qui font mouche. Tu repars avec 10 vannes prêtes à l'emploi, testées pour la pause café et les réunions.",
        format: "5 vannes à mémoriser + 2 quiz de mise en situation",
        xp: 50,
        free: true,
      },
      {
        week: "Semaine 2",
        title: "L'art du timing social",
        detail:
          "Quand placer ta blague en réunion, comment lire le groupe à la machine à café et sentir le bon moment en afterwork. La différence entre un flop et un éclat de rire, c'est souvent 3 secondes.",
        format: "3 exercices de lecture de groupe + 1 scénario interactif",
        xp: 75,
        free: false,
      },
      {
        week: "Semaine 3",
        title: "Raconter une anecdote captivante",
        detail:
          "Transforme tes histoires de boulot et de weekend en anecdotes qui font rire. Structure, détails, chute : les 3 ingrédients d'une bonne histoire à raconter entre collègues.",
        format: "Template d'anecdote + 2 exercices de réécriture",
        xp: 100,
        free: false,
      },
    ],
  },
  {
    emoji: "⚡",
    slug: "repartie",
    title: "Parcours Répartie",
    duration: "4 semaines",
    timePerWeek: "20 min/semaine",
    difficulty: "DEBUTANT → INTERMEDIAIRE",
    persona: "Pour toi si tu es étudiant, en soirée, en coloc ou en TD, et que tu veux t'affirmer",
    description:
      "Tu veux savoir quoi répondre du tac au tac sans rester muet ? En 4 semaines, tu passes de celui qui cherche ses mots à celui qui a toujours la bonne réplique. Exercices progressifs, zéro pression — même si tu es timide.",
    testimonial:
      "« Mes potes n'en reviennent pas. En soirée, c'est moi qui ai les meilleures répliques maintenant. »",
    modules: [
      {
        week: "Semaine 1",
        title: "Les bases de la répartie",
        detail:
          "Rebondir sur une remarque, accuser réception, reformuler avec humour. Les 3 réflexes de base qui te permettent de ne plus rester muet — en TD, en soirée ou en coloc. C'est normal d'être timide au début, on y va progressivement.",
        format: "3 techniques à pratiquer + 5 situations de soirée simulées",
        xp: 50,
        free: true,
      },
      {
        week: "Semaine 2",
        title: "Le rythme et les silences",
        detail:
          "Apprends à utiliser les pauses, le regard et le rythme. Un bon silence avant ta réplique vaut mieux que 10 mots précipités. La clé pour que tes potes écoutent quand tu parles.",
        format: "4 exercices de rythme + 1 vidéo d'analyse",
        xp: 75,
        free: false,
      },
      {
        week: "Semaine 3",
        title: "Retourner les piques avec le sourire",
        detail:
          "Quand un pote te chambre en soirée ou qu'on te lance une pique en TD : apprends à retourner la situation avec humour, sans agressivité. Tu désarmes et tu marques des points.",
        format: "6 scénarios de chambrages + réponses guidées",
        xp: 100,
        free: false,
      },
      {
        week: "Semaine 4",
        title: "Répartie avancée et improvisation",
        detail:
          "Improviser, rebondir sur l'inattendu, trouver la réplique parfaite en moins de 2 secondes. Tu es prêt pour toutes les situations — BDE, coloc, soirée, premier rendez-vous.",
        format: "3 exercices d'impro chronométrés + quiz final",
        xp: 150,
        free: false,
      },
    ],
  },
  {
    emoji: "🌱",
    slug: "confiance",
    title: "Parcours Confiance",
    duration: "6 semaines",
    timePerWeek: "20 min/semaine",
    difficulty: "DEBUTANT → EXPERT",
    persona: "Parfait si tu veux renouer avec l'humour et retrouver ta légèreté après une période difficile",
    description:
      "Un parcours complet et bienveillant pour retrouver le rire et te sentir à l'aise dans toutes tes interactions. Vannes, répartie, observation, registres avancés : tu explores tout à ton rythme et tu trouves ton propre style.",
    testimonial:
      "« Après ma séparation, j'avais perdu mon humour. Ce parcours m'a aidé à retrouver ma légèreté, étape par étape. »",
    modules: [
      {
        week: "Semaine 1",
        title: "Redécouvrir ce qui te fait rire",
        detail:
          "Observer le quotidien avec un oeil comique, noter ce qui te fait sourire, comprendre ton humour. Le point de départ pour reconstruire ta confiance, sans pression.",
        format: "Journal d'observation comique + 3 exercices de notation",
        xp: 50,
        free: true,
      },
      {
        week: "Semaine 2",
        title: "Rire de soi avec bienveillance",
        detail:
          "L'autodérision bienveillante : transformer un moment gênant en anecdote drôle sans se dévaloriser. Tu apprends à rire de toi tout en te respectant — c'est un équilibre subtil et puissant.",
        format: "2 exercices de réécriture + 1 template d'anecdote personnelle",
        xp: 75,
        free: false,
      },
      {
        week: "Semaine 3",
        title: "L'art de l'observation comique",
        detail:
          "Repérer le détail absurde dans une situation banale, le décalage dans une conversation, l'ironie du quotidien. Tu développes un regard neuf qui alimente tes conversations en dîners et sorties entre amis.",
        format: "5 exercices d'observation + carnet de notes comiques",
        xp: 100,
        free: false,
      },
      {
        week: "Semaine 4",
        title: "Être à l'aise en groupe",
        detail:
          "Participer aux conversations avec légèreté, rebondir sur les remarques, ne plus être spectateur. Des techniques concrètes pour les dîners entre amis, les apéros et les nouvelles rencontres.",
        format: "4 mises en situation + techniques d'entrée en conversation",
        xp: 125,
        free: false,
      },
      {
        week: "Semaine 5",
        title: "Les registres avancés",
        detail:
          "Absurde, ironie, second degré : explore les registres qui correspondent à ta personnalité. Chacun a un style — à toi de trouver celui qui te ressemble.",
        format: "Quiz de style humoristique + 3 exercices par registre",
        xp: 150,
        free: false,
      },
      {
        week: "Semaine 6",
        title: "Affirmer ton style personnel",
        detail:
          "Identifier ce qui marche pour toi, créer ton propre répertoire, ancrer tes nouvelles habitudes. Tu repars avec un kit d'humour personnalisé, adapté à ta vie sociale.",
        format: "Bilan de personnalité comique + répertoire personnalisé",
        xp: 200,
        free: false,
      },
    ],
  },
];

// ==============================
// Mini quiz d'orientation parcours
// ==============================

interface QuizResult {
  slug: string;
  title: string;
  reason: string;
}

const ORIENTATION_QUESTIONS = [
  {
    question: "Dans quelle situation tu voudrais être plus drôle ?",
    options: [
      { label: "Au boulot, en réunion, à la pause", value: "work", emoji: "☕" },
      { label: "En soirée, avec mes potes, en coloc", value: "social", emoji: "🎉" },
      { label: "Partout — je veux retrouver ma légèreté", value: "global", emoji: "🌱" },
    ],
  },
  {
    question: "Quel est ton plus gros frein ?",
    options: [
      { label: "Je manque de blagues à ressortir", value: "content", emoji: "📝" },
      { label: "Je ne sais pas quoi répondre sur le moment", value: "repartie", emoji: "⚡" },
      { label: "J'ai perdu confiance en moi", value: "confiance", emoji: "💪" },
    ],
  },
];

function getQuizResult(answers: string[]): QuizResult {
  if (answers.includes("confiance") || answers.includes("global")) {
    return {
      slug: "confiance",
      title: "Parcours Confiance",
      reason: "Tu cherches un parcours complet et bienveillant pour retrouver ta légèreté.",
    };
  }
  if (answers.includes("repartie") || answers.includes("social")) {
    return {
      slug: "repartie",
      title: "Parcours Répartie",
      reason: "Tu veux avoir la bonne réplique au bon moment — on va t'y aider.",
    };
  }
  return {
    slug: "machine-a-cafe",
    title: "Parcours Machine à Café",
    reason: "Tu veux un arsenal de vannes et d'anecdotes à ressortir au quotidien.",
  };
}

function OrientationQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const router = useRouter();

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < ORIENTATION_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getQuizResult(newAnswers));
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    return (
      <Card className="text-center">
        <CardContent className="py-6">
          <p className="text-sm font-medium text-accent-primary">On te recommande :</p>
          <h3 className="mt-2 font-display text-xl font-bold">{result.title}</h3>
          <p className="mt-2 text-sm text-text-secondary">{result.reason}</p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button variant="primary" size="sm" onClick={() => { const el = document.getElementById(`parcours-${result.slug}`); el?.scrollIntoView({ behavior: "smooth" }); }}>
              Voir ce parcours
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Refaire le quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const q = ORIENTATION_QUESTIONS[step];
  return (
    <Card>
      <CardContent className="py-6">
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="primary">Question {step + 1}/{ORIENTATION_QUESTIONS.length}</Badge>
          <div className="flex gap-1">
            {ORIENTATION_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full transition-colors ${
                  i <= step ? "bg-accent-primary" : "bg-background-elevated"
                }`}
              />
            ))}
          </div>
        </div>
        <h3 className="mb-4 font-display text-lg font-bold">{q.question}</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          {q.options.map((o) => (
            <button
              key={o.value}
              onClick={() => handleAnswer(o.value)}
              className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background-card p-3 text-left text-sm font-medium transition-all hover:border-accent-primary hover:bg-background-elevated active:scale-[0.98]"
            >
              <span className="text-xl">{o.emoji}</span>
              {o.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ==============================
// Main component
// ==============================

export function ParcoursContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authCallbackSlug, setAuthCallbackSlug] = useState<string | null>(null);
  const { status } = useSession();
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<Record<string, Record<string, number>>>({});

  // Fetch user progress from API when authenticated
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/parcours")
      .then((res) => (res.ok ? res.json() : { paths: [] }))
      .then((data) => {
        if (!data.paths) return;
        // Build a slug -> step count map
        const pathMap: Record<string, { stepCount: number; id: string }> = {};
        for (const p of data.paths) {
          // Match by title to our hardcoded slugs
          const match = parcours.find((hp) => hp.title === p.title);
          if (match) {
            pathMap[match.slug] = { stepCount: p.steps?.length ?? 0, id: p.id };
          }
        }

        // Now fetch progress
        fetch("/api/user/progress")
          .then((res) => (res.ok ? res.json() : { progress: {} }))
          .then((progressData) => {
            const result: Record<string, Record<string, number>> = {};
            for (const [slug, info] of Object.entries(pathMap)) {
              const completed = (progressData.progress as Record<string, number>)[(info as { id: string }).id] ?? 0;
              result[slug] = { completed, total: (info as { stepCount: number }).stepCount };
            }
            setUserProgress(result);
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, [status]);

  const handleCta = (slug: string) => {
    if (status === "authenticated") {
      router.push(`/parcours/${slug}`);
      return;
    }
    setAuthCallbackSlug(slug);
    setAuthModalOpen(true);
  };

  return (
    <>
      {/* Hero section */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold">
          Parcours pour devenir drôle et maîtriser la répartie
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
          Choisis ton parcours et progresse semaine après semaine. Chaque
          programme est conçu pour t&apos;amener d&apos;un niveau à l&apos;autre
          avec des exercices concrets et des conseils pratiques.
        </p>
        <p className="mt-3 text-sm font-medium text-accent-primary">
          Gagne des XP à chaque module, maintiens ton streak et suis ta progression
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Accès complet avec ton abonnement à 0,99 &euro;/mois
        </p>
      </div>

      {/* Orientation quiz */}
      <div className="mb-10">
        <h2 className="mb-4 text-center font-display text-xl font-bold">
          Quel parcours est fait pour toi ?
        </h2>
        <OrientationQuiz />
      </div>

      {/* Parcours cards */}
      <div className="flex flex-col gap-8">
        {parcours.map((p) => {
          const totalXp = p.modules.reduce((sum, m) => sum + m.xp, 0);
          const prog = userProgress[p.slug];
          const progressValue = prog ? prog.completed : 0;
          const progressMax = prog ? prog.total : p.modules.length;
          return (
            <Card key={p.title} className="p-6" id={`parcours-${p.slug}`}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="primary">{p.difficulty}</Badge>
                  <span className="text-sm text-text-secondary">
                    {p.duration}
                  </span>
                  <span className="text-sm text-text-muted">
                    · {p.timePerWeek}
                  </span>
                </div>
                <CardTitle className="mt-3 text-2xl">
                  <span className="mr-2">{p.emoji}</span>
                  {p.title}
                </CardTitle>
                <p className="mt-1 text-sm font-medium text-accent-primary">
                  {p.persona}
                </p>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-text-secondary">{p.description}</p>

                {/* Testimonial */}
                <p className="mb-6 rounded-lg bg-accent-primary/5 p-3 text-sm italic text-text-secondary">
                  {p.testimonial}
                </p>

                {/* Progress indicator */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
                    <span>
                      {progressValue > 0
                        ? `${progressValue}/${progressMax} étapes`
                        : "Progression"}
                    </span>
                    <span>{totalXp} XP à gagner</span>
                  </div>
                  <ProgressBar value={progressValue} max={progressMax} />
                </div>

                {/* Weekly modules */}
                <div className="mb-6 space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                    Programme
                  </h4>
                  <ol className="space-y-2">
                    {p.modules.map((m) => (
                      <li
                        key={m.week}
                        className="flex items-start gap-3 rounded-md bg-background-elevated p-3"
                      >
                        <Badge variant="secondary" className="mt-0.5 shrink-0">
                          {m.week}
                        </Badge>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary">
                              {m.title}
                            </span>
                            {m.free && (
                              <Badge variant="primary">Essai gratuit</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">
                            {m.detail}
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            Format : {m.format}
                          </p>
                          <span className="mt-1 inline-block text-xs text-accent-primary">
                            +{m.xp} XP
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => handleCta(p.slug)}
                  >
                    {progressValue > 0 ? "Continuer ce parcours" : "Commencer ce parcours"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="register"
        callbackUrl={authCallbackSlug ? `/parcours/${authCallbackSlug}` : "/parcours"}
      />
    </>
  );
}

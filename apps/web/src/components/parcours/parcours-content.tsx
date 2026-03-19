"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AuthModal } from "@/components/auth/auth-modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

// Build display data from seed — single source of truth
const parcours = parcoursSeed.map((p) => ({
  emoji: p.icon,
  slug: p.slug,
  title: p.title,
  duration: p.duration,
  timePerWeek: p.timePerWeek,
  difficulty: p.difficultyLabel,
  persona: p.personaTagline,
  description: p.description,
  testimonial: p.testimonial,
  modules: p.steps.map((s) => ({
    week: `Semaine ${s.week}`,
    title: s.moduleTitle,
    detail: s.moduleDetail,
    format: s.moduleFormat,
    xp: s.moduleXp,
    free: s.free,
  })),
}));

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
          .catch((err) => {
            console.error("[ParcoursContent] Erreur chargement progression:", err);
          });
      })
      .catch((err) => {
        console.error("[ParcoursContent] Erreur chargement parcours:", err);
      });
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

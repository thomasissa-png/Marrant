"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AuthModal } from "@/components/auth/auth-modal";
import Link from "next/link";

interface VideoRef {
  youtubeId: string;
  artist: string;
  title: string;
  why: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Step {
  id: string;
  order: number;
  dayNumber: number;
  tip: {
    id: string;
    title: string;
    content: string;
    category: string;
    difficulty: string;
    example: string;
    exercise: string;
  };
  // Rich content from seed
  moduleTitle?: string;
  moduleDetail?: string;
  moduleFormat?: string;
  moduleXp?: number;
  why?: string;
  free?: boolean;
  jokeIds?: number[];
  videos?: VideoRef[];
  quiz?: QuizQuestion[];
}

interface PathData {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration: string;
  difficulty: string;
  icon: string;
  steps: Step[];
  nextParcours?: string | null;
  nextParcoursReason?: string | null;
  personaTagline?: string | null;
  testimonial?: string | null;
}

interface UserProgress {
  completedSteps: number[];
  currentStep: number;
  completedAt: string | null;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  EXPERT: "Expert",
};

// ==============================
// Mini-quiz component
// ==============================

function StepQuiz({
  quiz,
  onComplete,
}: {
  quiz: QuizQuestion[];
  onComplete: () => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quiz[currentQ];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === q.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const allCorrect = score === quiz.length;
    return (
      <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4 text-center">
        <p className="font-display text-lg font-bold">
          {allCorrect ? "Parfait !" : `${score}/${quiz.length} bonnes réponses`}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          {allCorrect
            ? "Tu maîtrises ce module. Tu peux valider l'étape."
            : "Pas grave, l'important c'est de pratiquer. Tu peux valider l'étape."}
        </p>
        <Button variant="primary" size="sm" className="mt-3" onClick={onComplete}>
          Continuer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          Quiz {currentQ + 1}/{quiz.length}
        </Badge>
      </div>
      <p className="font-medium text-text-primary">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let className =
            "w-full rounded-lg border p-3 text-left text-sm transition-all";
          if (showResult) {
            if (i === q.correctIndex) {
              className += " border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400";
            } else if (i === selected && i !== q.correctIndex) {
              className += " border-red-400 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400";
            } else {
              className += " border-border bg-background-card text-text-muted";
            }
          } else {
            className +=
              " border-border bg-background-card hover:border-accent-primary hover:bg-background-elevated cursor-pointer";
          }
          return (
            <button key={i} className={className} onClick={() => handleAnswer(i)}>
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={handleNext}>
            {currentQ < quiz.length - 1 ? "Question suivante" : "Voir le résultat"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ==============================
// Video card component
// ==============================

function VideoCard({ video }: { video: VideoRef }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="relative aspect-video bg-background-elevated">
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={`${video.artist} — ${video.title}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
          aria-label={`Regarder ${video.title} de ${video.artist} sur YouTube`}
        >
          <svg className="h-12 w-12 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </a>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary">{video.artist}</p>
        <p className="text-xs text-text-secondary">{video.title}</p>
        <p className="mt-1 text-xs text-text-muted italic">{video.why}</p>
      </div>
    </div>
  );
}

// ==============================
// Joke teaser component
// ==============================

function JokeTeaser({ jokeIds }: { jokeIds: number[] }) {
  if (!jokeIds.length) return null;
  return (
    <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
      <h4 className="mb-2 text-sm font-semibold text-text-primary">
        Vannes à pratiquer
      </h4>
      <p className="text-sm text-text-secondary">
        {jokeIds.length} vannes sélectionnées pour ce module.{" "}
        <Link
          href="/vannes"
          className="text-accent-primary hover:underline"
        >
          Découvre-les dans le catalogue
        </Link>
      </p>
    </div>
  );
}

// ==============================
// Main component
// ==============================

export function ParcoursDetail({ slug }: { slug: string }) {
  const [path, setPath] = useState<PathData | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completing, setCompleting] = useState<number | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [xpGained, setXpGained] = useState<{ step: number; xp: number } | null>(null);
  const [quizDone, setQuizDone] = useState<Set<number>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    fetch(`/api/parcours/by-slug/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setPath(data.path);
          setProgress(data.userProgress);
          // Auto-expand the first incomplete step
          const completed = data.userProgress?.completedSteps ?? [];
          const firstIncomplete = data.path.steps.find(
            (s: Step) => !completed.includes(s.order)
          );
          if (firstIncomplete) {
            setExpandedStep(firstIncomplete.order);
          }
        } else {
          setFetchError(true);
        }
      })
      .catch(() => {
        setFetchError(true);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleCompleteStep = async (stepOrder: number) => {
    if (!path || status !== "authenticated") {
      setAuthModalOpen(true);
      return;
    }

    setCompleting(stepOrder);
    setCompletionError(null);
    try {
      const res = await fetch(`/api/parcours/${path.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepOrder }),
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
        if (data.xpGained > 0) {
          setXpGained({ step: stepOrder, xp: data.xpGained });
          setTimeout(() => setXpGained(null), 3000);
        }
        // Auto-expand the next step after completion
        const nextStep = path.steps.find((s) => s.order > stepOrder);
        if (nextStep) {
          setTimeout(() => setExpandedStep(nextStep.order), 500);
        }
      } else if (res.status === 429) {
        setCompletionError("Trop de tentatives. Attends un moment.");
      } else {
        setCompletionError("Impossible de valider cette étape. Réessaie.");
      }
    } catch {
      setCompletionError("Erreur réseau. Vérifie ta connexion et réessaie.");
    } finally {
      setCompleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="py-8">
              <div className="h-6 w-2/3 rounded bg-background-elevated" />
              <div className="mt-3 h-4 w-full rounded bg-background-elevated" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!path || fetchError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-text-secondary">
            {fetchError
              ? "Impossible de charger ce parcours. Réessaie plus tard."
              : "Parcours introuvable."}{" "}
            <Link href="/parcours" className="text-accent-primary hover:underline">
              Voir tous les parcours
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedSteps = progress?.completedSteps ?? [];
  const totalSteps = path.steps.length;
  const isPathCompleted = progress?.completedAt !== null && progress?.completedAt !== undefined;
  const totalXp = path.steps.reduce((sum, s) => sum + (s.moduleXp ?? 20), 0);
  // Detect seed fallback (not in DB) — cannot track progress
  const isSeedFallback = path.id.startsWith("seed-");

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/parcours" className="hover:text-text-primary">Parcours</Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">{path.title}</span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-4xl">{path.icon}</span>
          <div>
            <h1 className="font-display text-3xl font-bold">{path.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="primary">
                {DIFFICULTY_LABELS[path.difficulty] ?? path.difficulty}
              </Badge>
              <span className="text-sm text-text-muted">{path.duration}</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-text-secondary">{path.description}</p>
        {path.personaTagline && (
          <p className="mt-2 text-sm font-medium text-accent-primary">
            {path.personaTagline}
          </p>
        )}
        {path.testimonial && (
          <p className="mt-3 rounded-lg bg-accent-primary/5 p-3 text-sm italic text-text-secondary">
            {path.testimonial}
          </p>
        )}
      </div>

      {/* Progress */}
      <Card className="mb-8">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {isPathCompleted
                ? "Parcours terminé !"
                : `${completedSteps.length}/${totalSteps} étapes complétées`}
            </span>
            <span className="font-medium text-accent-primary">
              {totalXp} XP au total
            </span>
          </div>
          <ProgressBar
            value={completedSteps.length}
            max={totalSteps}
            variant="gradient"
          />
        </CardContent>
      </Card>

      {/* Completion error banner */}
      {completionError && (
        <div
          className="mb-4 rounded-lg bg-error/10 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {completionError}
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4" role="list" aria-label="Étapes du parcours">
        {path.steps.map((step, stepIndex) => {
          const isCompleted = completedSteps.includes(step.order);
          const isExpanded = expandedStep === step.order;
          const isPremiumLocked =
            status !== "authenticated" && step.order > 1;
          const stepXp = step.moduleXp ?? 20;
          const hasQuiz = step.quiz && step.quiz.length > 0;
          const isQuizDone = quizDone.has(step.order);

          // Sequential locking: step N requires steps 1..N-1 completed
          const previousStepsCompleted = stepIndex === 0
            || path.steps.slice(0, stepIndex).every((s) => completedSteps.includes(s.order));
          const isSequentiallyLocked = !previousStepsCompleted && !isCompleted;
          // Can this step be expanded?
          const canExpand = !isSequentiallyLocked;

          return (
            <Card
              key={step.id}
              role="listitem"
              className={
                isCompleted
                  ? "border-accent-primary/30 bg-accent-primary/5"
                  : isSequentiallyLocked
                    ? "opacity-60"
                    : ""
              }
            >
              <CardHeader
                role={canExpand ? "button" : undefined}
                tabIndex={canExpand ? 0 : undefined}
                aria-expanded={canExpand ? isExpanded : undefined}
                aria-label={`Étape ${step.order} : ${step.moduleTitle ?? step.tip.title}${isCompleted ? " — complétée" : isSequentiallyLocked ? " — verrouillée" : ""}`}
                className={canExpand ? "cursor-pointer" : "cursor-default"}
                onClick={() => {
                  if (!canExpand) return;
                  setExpandedStep(isExpanded ? null : step.order);
                }}
                onKeyDown={(e) => {
                  if (!canExpand) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedStep(isExpanded ? null : step.order);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isCompleted
                          ? "bg-accent-primary text-white"
                          : isSequentiallyLocked
                            ? "bg-background-elevated text-text-muted/50"
                            : "bg-background-elevated text-text-muted"
                      }`}
                      aria-hidden="true"
                    >
                      {isCompleted ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isSequentiallyLocked ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : (
                        step.order
                      )}
                    </div>
                    <div>
                      <CardTitle className={`text-base ${isSequentiallyLocked ? "text-text-muted" : ""}`}>
                        {step.moduleTitle ?? step.tip.title}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`text-xs ${isSequentiallyLocked ? "text-text-muted" : "text-accent-primary"}`}>
                          +{stepXp} XP
                        </span>
                        {(step.free || step.order === 1) && (
                          <Badge variant="primary">Essai gratuit</Badge>
                        )}
                        {isSequentiallyLocked && (
                          <span className="text-xs text-text-muted">
                            Termine l&apos;étape {step.order - 1} pour débloquer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {canExpand ? (
                    <svg
                      className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 shrink-0 text-text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
              </CardHeader>

              {isExpanded && canExpand && (
                <CardContent className="pt-0">
                  {isPremiumLocked ? (
                    <div className="rounded-lg bg-background-elevated p-4 text-center">
                      <p className="text-sm text-text-secondary">
                        Abonne-toi pour accéder à cette étape.
                      </p>
                      <Link href="/abonnement">
                        <Button variant="primary" size="sm" className="mt-3">
                          S&apos;abonner — 0,99 &euro;/mois
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Why this step */}
                      {step.why && (
                        <div className="rounded-lg bg-background-elevated p-3">
                          <p className="text-sm font-medium text-accent-primary">
                            Pourquoi ce module ?
                          </p>
                          <p className="mt-1 text-sm text-text-secondary">
                            {step.why}
                          </p>
                        </div>
                      )}

                      {/* Module detail */}
                      {step.moduleDetail && (
                        <div>
                          <h4 className="mb-1 text-sm font-semibold text-text-primary">
                            Ce que tu vas apprendre
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {step.moduleDetail}
                          </p>
                          {step.moduleFormat && (
                            <p className="mt-2 text-xs text-text-muted">
                              Format : {step.moduleFormat}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Tip content (from DB) */}
                      {step.tip.content && (
                        <div>
                          <h4 className="mb-1 text-sm font-semibold text-text-primary">
                            Le conseil
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {step.tip.content}
                          </p>
                        </div>
                      )}

                      {step.tip.example && (
                        <div>
                          <h4 className="mb-1 text-sm font-semibold text-text-primary">
                            Exemple concret
                          </h4>
                          <p className="rounded-lg bg-background-elevated p-3 text-sm italic text-text-secondary">
                            {step.tip.example}
                          </p>
                        </div>
                      )}

                      {step.tip.exercise && (
                        <div>
                          <h4 className="mb-1 text-sm font-semibold text-text-primary">
                            Exercice pratique
                          </h4>
                          <p className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-3 text-sm text-text-secondary">
                            {step.tip.exercise}
                          </p>
                        </div>
                      )}

                      {/* Jokes teaser */}
                      {step.jokeIds && step.jokeIds.length > 0 && (
                        <JokeTeaser jokeIds={step.jokeIds} />
                      )}

                      {/* Videos */}
                      {step.videos && step.videos.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-text-primary">
                            Vidéos à regarder
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {step.videos.map((v) => (
                              <VideoCard key={v.youtubeId} video={v} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quiz */}
                      {hasQuiz && !isQuizDone && !isCompleted && (
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-text-primary">
                            Teste tes connaissances
                          </h4>
                          <StepQuiz
                            quiz={step.quiz!}
                            onComplete={() =>
                              setQuizDone((prev) => new Set(prev).add(step.order))
                            }
                          />
                        </div>
                      )}

                      {hasQuiz && isQuizDone && !isCompleted && (
                        <p className="text-center text-sm font-medium text-accent-primary">
                          Quiz terminé — tu peux valider l&apos;étape
                        </p>
                      )}

                      {/* XP notification — accessible via aria-live */}
                      <div aria-live="polite" aria-atomic="true">
                        {xpGained?.step === step.order && (
                          <p className="text-center text-sm font-bold text-accent-primary animate-scale-in">
                            +{xpGained.xp} XP gagné{xpGained.xp >= 100 ? "s ! Parcours terminé !" : "s !"}
                          </p>
                        )}
                      </div>

                      {/* Quiz required: show disabled button if quiz not done */}
                      {!isCompleted && status === "authenticated" && !isSeedFallback && hasQuiz && !isQuizDone && (
                        <Button
                          variant="primary"
                          className="w-full opacity-50 cursor-not-allowed"
                          disabled
                        >
                          Termine le quiz pour valider cette étape
                        </Button>
                      )}

                      {!isCompleted && status === "authenticated" && !isSeedFallback && (!hasQuiz || isQuizDone) && (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => handleCompleteStep(step.order)}
                          disabled={completing === step.order}
                        >
                          {completing === step.order
                            ? "Validation..."
                            : "Marquer comme terminé"}
                        </Button>
                      )}

                      {!isCompleted && status === "authenticated" && isSeedFallback && (
                        <p className="text-center text-sm text-text-muted">
                          La progression sera disponible prochainement.
                        </p>
                      )}

                      {isCompleted && (
                        <p className="text-center text-sm font-medium text-accent-primary">
                          Étape complétée
                        </p>
                      )}

                      {status !== "authenticated" && step.order === 1 && (
                        <Button
                          variant="primary"
                          className="w-full"
                          onClick={() => setAuthModalOpen(true)}
                        >
                          Connecte-toi pour valider cette étape
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* End of parcours CTA */}
      {isPathCompleted && (
        <Card className="mt-8 border-accent-primary/30 bg-accent-primary/5">
          <CardContent className="py-8 text-center">
            <p className="font-display text-2xl font-bold">
              Bravo, tu as terminé le {path.title} !
            </p>
            <p className="mx-auto mt-2 max-w-md text-text-secondary">
              {totalXp} XP gagnés. Tu as développé de nouvelles compétences. Continue sur ta lancée !
            </p>
            {path.nextParcours && (
              <div className="mt-6">
                <p className="text-sm text-text-secondary">
                  {path.nextParcoursReason}
                </p>
                <Link href={`/parcours/${path.nextParcours}`}>
                  <Button variant="primary" size="lg" className="mt-3">
                    Passer au parcours suivant
                  </Button>
                </Link>
              </div>
            )}
            {!path.nextParcours && (
              <Link href="/parcours">
                <Button variant="primary" size="lg" className="mt-4">
                  Voir tous les parcours
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cross-recommendation for non-completed */}
      {!isPathCompleted && path.nextParcours && (
        <div className="mt-8 rounded-lg border border-border p-4 text-center">
          <p className="text-sm text-text-muted">
            Envie d&apos;aller plus loin ?{" "}
            <Link
              href={`/parcours/${path.nextParcours}`}
              className="text-accent-primary hover:underline"
            >
              Découvre le parcours suivant
            </Link>
          </p>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="register"
        callbackUrl={`/parcours/${slug}`}
      />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AuthModal } from "@/components/auth/auth-modal";
import Link from "next/link";

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

export function ParcoursDetail({ slug }: { slug: string }) {
  const [path, setPath] = useState<PathData | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completing, setCompleting] = useState<number | null>(null);
  const [xpGained, setXpGained] = useState<{ step: number; xp: number } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    fetch(`/api/parcours/by-slug/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setPath(data.path);
          setProgress(data.userProgress);
        }
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleCompleteStep = async (stepOrder: number) => {
    if (!path || status !== "authenticated") {
      setAuthModalOpen(true);
      return;
    }

    setCompleting(stepOrder);
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
      }
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

  if (!path) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-text-secondary">
            Parcours introuvable.{" "}
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
              +{totalSteps * 20 + 100} XP au total
            </span>
          </div>
          <ProgressBar
            value={completedSteps.length}
            max={totalSteps}
            variant="gradient"
          />
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {path.steps.map((step) => {
          const isCompleted = completedSteps.includes(step.order);
          const isExpanded = expandedStep === step.order;
          const isPremiumLocked =
            status !== "authenticated" && step.order > 1;

          return (
            <Card
              key={step.id}
              className={
                isCompleted
                  ? "border-accent-primary/30 bg-accent-primary/5"
                  : ""
              }
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() =>
                  setExpandedStep(isExpanded ? null : step.order)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isCompleted
                          ? "bg-accent-primary text-white"
                          : "bg-background-elevated text-text-muted"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.order
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {step.tip.title}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-accent-primary">
                          +20 XP
                        </span>
                        {step.order === 1 && (
                          <Badge variant="secondary">Essai gratuit</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </CardHeader>

              {isExpanded && (
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
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-1 text-sm font-semibold text-text-primary">
                          Le conseil
                        </h4>
                        <p className="text-sm text-text-secondary">
                          {step.tip.content}
                        </p>
                      </div>

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

                      {xpGained?.step === step.order && (
                        <p className="text-center text-sm font-bold text-accent-primary animate-scale-in">
                          +{xpGained.xp} XP gagné{xpGained.xp >= 100 ? "s ! Parcours terminé !" : "s !"}
                        </p>
                      )}

                      {!isCompleted && status === "authenticated" && (
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

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="register"
        callbackUrl={`/parcours/${slug}`}
      />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { recommendParcoursFromOnboarding, type ParcoursRecommendation } from "@/lib/parcours-orientation";

interface QuizQuestion {
  question: string;
  options: { label: string; value: string; emoji: string }[];
}

export interface HumorProfile {
  objective: string;
  context: string;
  level: string;
  result: string;
  /** Slug du parcours recommandé (Q1 + Q2). Absent sur les profils antérieurs à s12. */
  parcours?: string;
  completedAt: string;
}

const HUMOR_PROFILE_KEY = "humor-profile";

const QUESTIONS: QuizQuestion[] = [
  {
    question: "C'est quoi ton objectif principal ?",
    options: [
      { label: "Avoir de la répartie", value: "REPARTIE", emoji: "⚡" },
      { label: "Faire rire les gens", value: "VANNES", emoji: "😂" },
      { label: "Être plus à l'aise socialement", value: "CONFIANCE", emoji: "💪" },
      { label: "Tout ça à la fois", value: "GLOBAL", emoji: "🎯" },
    ],
  },
  {
    question: "Où tu veux être drôle ?",
    options: [
      { label: "Entre potes / en soirée étudiante", value: "social", emoji: "👯" },
      { label: "Au boulot / machine à café", value: "work", emoji: "☕" },
      { label: "En soirée / rendez-vous", value: "party", emoji: "🎉" },
      { label: "Partout", value: "everywhere", emoji: "🌍" },
    ],
  },
  {
    question: "Ton niveau actuel en humour ?",
    options: [
      { label: "Mes vannes tombent à plat", value: "DEBUTANT", emoji: "😬" },
      { label: "Parfois ça marche", value: "INTERMEDIAIRE", emoji: "😏" },
      { label: "Je fais rire souvent", value: "AVANCE", emoji: "😂" },
      { label: "Je veux aller encore plus loin", value: "EXPERT", emoji: "🎤" },
    ],
  },
];

const RESULTS: Record<string, { title: string; description: string; emoji: string }> = {
  DEBUTANT: {
    title: "En route vers la répartie",
    description: "T'as le potentiel, il te manque juste les techniques ! On va t'apprendre à rebondir, à placer tes vannes et à gagner en confiance, étape par étape.",
    emoji: "🌱",
  },
  INTERMEDIAIRE: {
    title: "Le blagueur affûté",
    description: "T'as déjà le sens de l'humour, il lui manque juste du réglage. Répartie, timing, anecdotes : de quoi devenir celui qu'on écoute quand il prend la parole.",
    emoji: "🌿",
  },
  AVANCE: {
    title: "Le comique naturel",
    description: "T'es déjà bon, alors on passe aux réglages fins : les techniques qui font la différence entre une salle qui sourit et une salle qui rit.",
    emoji: "🔥",
  },
  EXPERT: {
    title: "La future star",
    description: "Tu vises haut, et on aime ça. On te met les meilleurs humoristes sous les yeux, démontés pièce par pièce : à toi de leur piquer leur mécanique.",
    emoji: "⭐",
  },
};

function getStoredProfile(): HumorProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(HUMOR_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HumorProfile;
  } catch {
    return null;
  }
}

function saveProfile(profile: HumorProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HUMOR_PROFILE_KEY, JSON.stringify(profile));
}

/** Encart « Ton point de départ » : le parcours recommandé à partir de Q1 + Q2. */
function RecommendedParcours({
  recommendation,
  onStart,
}: {
  recommendation: ParcoursRecommendation;
  onStart: () => void;
}) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-background-elevated p-4 text-left">
      <p className="text-sm font-medium text-accent-link">Ton point de départ :</p>
      <h3 className="mt-1 font-display text-lg font-bold text-text-primary">{recommendation.title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{recommendation.reason}</p>
      <Button variant="primary" size="lg" className="mt-4 w-full" onClick={onStart}>
        Voir par où commencer
      </Button>
    </div>
  );
}

interface HumorQuizProps {
  /** Lien de sortie (callback sûr ou page par défaut), affiché sous le quiz. */
  exitHref?: string;
}

export function HumorQuiz({ exitHref }: HumorQuizProps = {}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [existingProfile, setExistingProfile] = useState<HumorProfile | null>(null);
  const [showExistingProfile, setShowExistingProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredProfile();
    if (stored) {
      setExistingProfile(stored);
      setShowExistingProfile(true);
    }
  }, []);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      // Quiz terminé : sauvegarder le profil (niveau = Q3, parcours = Q1 + Q2)
      const levelKey = newAnswers[2] || "DEBUTANT";
      const resultData = RESULTS[levelKey] || RESULTS.DEBUTANT;
      const recommendation = recommendParcoursFromOnboarding(newAnswers[0], newAnswers[1]);

      const profile: HumorProfile = {
        objective: newAnswers[0],
        context: newAnswers[1],
        level: newAnswers[2],
        result: resultData.title,
        parcours: recommendation.slug,
        completedAt: new Date().toISOString(),
      };
      saveProfile(profile);
      setExistingProfile(profile);
      setShowResult(true);
    }
  };

  const handleRetakeQuiz = () => {
    setShowExistingProfile(false);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const goToParcours = (recommendation: ParcoursRecommendation) => {
    router.push(`/parcours/${recommendation.slug}`);
  };

  const exitLink = exitHref ? (
    <Link
      href={exitHref}
      className="mt-6 inline-flex min-h-[44px] items-center justify-center text-sm text-text-muted underline hover:text-text-secondary"
    >
      Plus tard, laisse-moi explorer
    </Link>
  ) : null;

  const renderResult = (profile: { level: string; objective: string; context: string; title: string }, isExisting: boolean) => {
    const levelResult = RESULTS[profile.level] || RESULTS.DEBUTANT;
    const recommendation = recommendParcoursFromOnboarding(profile.objective, profile.context);
    return (
      <div className="mx-auto max-w-lg text-center">
        <Card className="animate-scale-in">
          <CardContent className="py-8 text-center">
            <span className="text-6xl" aria-hidden="true">{levelResult.emoji}</span>
            <h2 className="mt-4 font-display text-2xl font-bold text-text-primary">{profile.title}</h2>
            <p className="mt-2 text-text-secondary">{levelResult.description}</p>
            {isExisting && existingProfile && (
              <p className="mt-2 text-sm text-text-muted">
                Quiz complété le {new Date(existingProfile.completedAt).toLocaleDateString("fr-FR")}
              </p>
            )}
            <RecommendedParcours recommendation={recommendation} onStart={() => goToParcours(recommendation)} />
            <div className="mt-4 flex flex-col items-center gap-2">
              {isExisting && (
                <Button variant="ghost" size="sm" onClick={handleRetakeQuiz}>
                  Refaire le quiz
                </Button>
              )}
              <button
                type="button"
                onClick={() => router.push("/abonnement")}
                className="min-h-[44px] text-xs text-text-muted underline hover:text-text-secondary"
              >
                Tout débloquer à 2,99 €/mois
              </button>
            </div>
          </CardContent>
        </Card>
        {exitLink}
      </div>
    );
  };

  // Écran « profil existant » : proposer de refaire ou de reprendre le parcours recommandé
  if (showExistingProfile && existingProfile) {
    return renderResult(
      {
        level: existingProfile.level,
        objective: existingProfile.objective,
        context: existingProfile.context,
        title: (RESULTS[existingProfile.level] || RESULTS.DEBUTANT).title,
      },
      true,
    );
  }

  if (showResult) {
    const level = answers[2] || "DEBUTANT";
    return renderResult(
      {
        level,
        objective: answers[0],
        context: answers[1],
        title: (RESULTS[level] || RESULTS.DEBUTANT).title,
      },
      false,
    );
  }

  const question = QUESTIONS[currentQ];

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="primary">Question {currentQ + 1}/{QUESTIONS.length}</Badge>
        <div className="flex gap-1" aria-hidden="true">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-8 rounded-full transition-colors",
                i <= currentQ ? "bg-accent-primary" : "bg-background-elevated"
              )}
            />
          ))}
        </div>
      </div>

      <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">
        {question.question}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleAnswer(option.value)}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background-card p-4 text-center transition-all hover:border-accent-primary hover:bg-background-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary active:scale-95"
          >
            <span className="text-3xl" aria-hidden="true">{option.emoji}</span>
            <span className="text-sm font-medium text-text-primary">{option.label}</span>
          </button>
        ))}
      </div>

      {exitLink && <div className="text-center">{exitLink}</div>}
    </div>
  );
}

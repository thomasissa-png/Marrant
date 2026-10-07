"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { cn } from "@/lib/utils";
import { trackUmami } from "@/lib/umami";
import Link from "next/link";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { parcoursEtape1Href } from "@/lib/entrees-parcours";
import { QUIZ_HUMOUR_PARCOURS } from "@/config/textes/entrees-parcours";
import {
  QUIZ_QUESTIONS,
  QUIZ_PROFILES,
  computeQuizResult,
  type HumorProfileType,
  type HumorProfileResult,
} from "./quiz-data";

const QUIZ_STORAGE_KEY = "humor-quiz-viral";

interface StoredQuizResult {
  profile: HumorProfileType;
  completedAt: string;
}

function getStoredResult(): StoredQuizResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredQuizResult;
  } catch {
    return null;
  }
}

function saveResult(profile: HumorProfileType): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    QUIZ_STORAGE_KEY,
    JSON.stringify({ profile, completedAt: new Date().toISOString() }),
  );
}

function ResultCard({ profile }: { profile: HumorProfileResult }) {
  const shareText = `Mon profil humour : ${profile.title}, style ${profile.humoriste}. Et toi, t'es drôle comment ? Fais le quiz sur deviens-marrant.fr/quiz-humour`;

  return (
    <Card className="mx-auto max-w-lg animate-scale-in">
      <CardContent className="py-8">
        <div className="text-center">
          <span className="text-6xl">{profile.emoji}</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-text-primary">
            {profile.title}
          </h2>
          <p className="mt-1 text-sm text-accent-link">
            Style {profile.humoriste}
          </p>
          <p className="mt-4 text-text-secondary">{profile.description}</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-background-elevated p-4">
            <p className="text-sm font-semibold text-text-primary">
              Ta force
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {profile.strength}
            </p>
          </div>
          <div className="rounded-lg bg-background-elevated p-4">
            <p className="text-sm font-semibold text-text-primary">
              Le conseil pour progresser
            </p>
            <p className="mt-1 text-sm text-text-secondary">{profile.tip}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <ShareButton
              title="Mon profil humour"
              text={shareText}
            />
            <span className="text-sm text-text-muted">Partage ton résultat</span>
          </div>

          {/* s17 (QA-13) : un des 3 parcours selon le profil, ouvert sur son étape 1. */}
          <div className="w-full rounded-lg border border-border bg-background-elevated p-4 text-left" data-testid="quiz-parcours-conseille">
            <p className="text-sm font-medium text-accent-link">{QUIZ_HUMOUR_PARCOURS.intro}</p>
            <h3 className="mt-1 font-display text-lg font-bold text-text-primary">
              {QUIZ_HUMOUR_PARCOURS.titre(profile.recommendedParcours)}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">{QUIZ_HUMOUR_PARCOURS.raison[profile.type]}</p>
          </div>

          {/* Lien stylé en bouton : plus de <button> imbriqué dans un <a> (T44). */}
          <Link
            href={parcoursEtape1Href(profile.recommendedParcours, "quiz")}
            className={buttonVariants({ variant: "primary", size: "lg", className: "w-full" })}
          >
            {QUIZ_HUMOUR_PARCOURS.bouton}
          </Link>

          {/* Plus de compte gratuit (s15) : vers Premium, retour au parcours conseillé. */}
          <Link
            href={buildAbonnementUrl(`/parcours/${profile.recommendedParcours}`, "monthly", "quiz")}
            className={buttonVariants({ variant: "secondary", size: "lg", className: "w-full" })}
          >
            Accéder aux parcours complets
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function ViralQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<
    Partial<Record<HumorProfileType, number>>[]
  >([]);
  const [result, setResult] = useState<HumorProfileResult | null>(null);
  const [showRetake, setShowRetake] = useState(false);

  useEffect(() => {
    const stored = getStoredResult();
    if (stored) {
      setResult(QUIZ_PROFILES[stored.profile]);
      setShowRetake(true);
    }
  }, []);

  const handleAnswer = (scores: Partial<Record<HumorProfileType, number>>) => {
    const newAnswers = [...answers, scores];
    setAnswers(newAnswers);

    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      const profileType = computeQuizResult(newAnswers);
      const profile = QUIZ_PROFILES[profileType];
      saveResult(profileType);
      setResult(profile);
      trackUmami("quiz-termine", { profil: profileType });
      setShowRetake(false);
    }
  };

  const handleRetake = () => {
    setShowRetake(false);
    setResult(null);
    setCurrentQ(0);
    setAnswers([]);
  };

  if (showRetake && result) {
    return (
      <div className="space-y-4">
        <ResultCard profile={result} />
        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={handleRetake}>
            Refaire le quiz
          </Button>
        </div>
      </div>
    );
  }

  if (result) {
    return <ResultCard profile={result} />;
  }

  const question = QUIZ_QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="primary">
          {currentQ + 1}/{QUIZ_QUESTIONS.length}
        </Badge>
        <div className="h-2 flex-1 mx-4 rounded-full bg-background-elevated overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">
        {question.question}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option.scores)}
            className="flex items-center gap-3 rounded-lg border border-border bg-background-card p-4 text-left transition-all hover:border-accent-primary hover:bg-background-elevated active:scale-[0.98]"
          >
            <span className="inline-flex w-8 shrink-0 justify-center text-xl" aria-hidden="true">{option.emoji}</span>
            <span className="text-sm font-medium text-text-primary">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

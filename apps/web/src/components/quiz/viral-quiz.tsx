"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
  const shareText = `Je suis "${profile.title}" (style ${profile.humoriste}) ! Et toi, quel type d'humour es-tu ? Fais le quiz sur deviens-marrant.fr/quiz-humour`;

  return (
    <Card className="mx-auto max-w-lg animate-scale-in">
      <CardContent className="py-8">
        <div className="text-center">
          <span className="text-6xl">{profile.emoji}</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-text-primary">
            {profile.title}
          </h2>
          <p className="mt-1 text-sm text-accent-primary">
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
              Le conseil du coach
            </p>
            <p className="mt-1 text-sm text-text-secondary">{profile.tip}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <ShareButton
              title="Mon profil humour"
              text={shareText}
              className="h-10 w-10"
            />
            <span className="text-sm text-text-muted">Partage ton résultat</span>
          </div>

          <Link href={profile.recommendedPath} className="w-full">
            <Button variant="primary" size="lg" className="w-full">
              Progresse avec ton profil
            </Button>
          </Link>

          <Link href="/register" className="w-full">
            <Button variant="secondary" size="lg" className="w-full">
              Crée ton compte gratuit
            </Button>
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
            <span className="text-2xl">{option.emoji}</span>
            <span className="text-sm font-medium text-text-primary">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

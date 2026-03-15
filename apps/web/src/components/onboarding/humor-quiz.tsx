"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: { label: string; value: string; emoji: string }[];
}

export interface HumorProfile {
  objective: string;
  context: string;
  level: string;
  result: string;
  completedAt: string;
}

const HUMOR_PROFILE_KEY = "humor-profile";

const QUESTIONS: QuizQuestion[] = [
  {
    question: "C'est quoi ton objectif principal ?",
    options: [
      { label: "Avoir de la répartie", value: "REPARTIE", emoji: "\u26A1" },
      { label: "Faire rire les gens", value: "VANNES", emoji: "\uD83D\uDE02" },
      { label: "Être plus à l'aise socialement", value: "CONFIANCE", emoji: "\uD83D\uDCAA" },
      { label: "Tout ça à la fois", value: "GLOBAL", emoji: "\uD83C\uDFAF" },
    ],
  },
  {
    question: "Où tu veux être drôle ?",
    options: [
      { label: "Entre potes / en soirée étudiante", value: "social", emoji: "\uD83D\uDC6F" },
      { label: "Au boulot / machine à café", value: "work", emoji: "\u2615" },
      { label: "En soirée / rendez-vous", value: "party", emoji: "\uD83C\uDF89" },
      { label: "Partout", value: "everywhere", emoji: "\uD83C\uDF0D" },
    ],
  },
  {
    question: "Ton niveau actuel en humour ?",
    options: [
      { label: "Mes vannes tombent à plat", value: "DEBUTANT", emoji: "\uD83D\uDE2C" },
      { label: "Parfois ça marche", value: "INTERMEDIAIRE", emoji: "\uD83D\uDE0F" },
      { label: "Je fais rire souvent", value: "AVANCE", emoji: "\uD83D\uDE02" },
      { label: "Je veux aller encore plus loin", value: "EXPERT", emoji: "\uD83C\uDFA4" },
    ],
  },
];

const RESULTS: Record<string, { title: string; description: string; emoji: string; path: string }> = {
  DEBUTANT: {
    title: "En Route Vers la Répartie",
    description: "T'as le potentiel, il te manque juste les techniques ! On va t'apprendre à rebondir, à placer tes vannes et à gagner en confiance, étape par étape.",
    emoji: "\uD83C\uDF31",
    path: "/conseils",
  },
  INTERMEDIAIRE: {
    title: "Le Blagueur Affûté",
    description: "T'as déjà le sens de l'humour, on va l'affûter. Répartie, timing, anecdotes : tu vas devenir celui qu'on écoute.",
    emoji: "\uD83C\uDF3F",
    path: "/conseils",
  },
  AVANCE: {
    title: "Le Comique Naturel",
    description: "T'es déjà bon ! On va te donner les techniques avancées pour être inoubliable, en soirée, au boulot, partout.",
    emoji: "\uD83D\uDD25",
    path: "/videos",
  },
  EXPERT: {
    title: "La Future Star",
    description: "Tu vises haut et c'est ce qu'on aime. Analyse les meilleurs, peaufine tes techniques et prépare-toi à briller.",
    emoji: "\u2B50",
    path: "/videos",
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

export function HumorQuiz() {
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
      // Quiz terminé : sauvegarder le profil
      const levelKey = newAnswers[2] || "DEBUTANT";
      const resultData = RESULTS[levelKey] || RESULTS.DEBUTANT;

      const profile: HumorProfile = {
        objective: newAnswers[0],
        context: newAnswers[1],
        level: newAnswers[2],
        result: resultData.title,
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

  const resultKey = answers[2] || "DEBUTANT";
  const result = RESULTS[resultKey] || RESULTS.DEBUTANT;

  // Ecran "profil existant" : proposer de refaire ou voir le profil
  if (showExistingProfile && existingProfile) {
    const existingResult = RESULTS[existingProfile.level] || RESULTS.DEBUTANT;

    return (
      <Card className="mx-auto max-w-lg animate-scale-in">
        <CardContent className="py-8 text-center">
          <span className="text-6xl">{existingResult.emoji}</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-text-primary">
            {existingProfile.result}
          </h2>
          <p className="mt-2 text-text-secondary">{existingResult.description}</p>
          <p className="mt-2 text-sm text-text-muted">
            Quiz complet&eacute; le {new Date(existingProfile.completedAt).toLocaleDateString("fr-FR")}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="primary" size="lg" onClick={() => router.push(existingResult.path)}>
              Voir mon profil
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRetakeQuiz}>
              Refaire le quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResult) {
    return (
      <Card className="mx-auto max-w-lg animate-scale-in">
        <CardContent className="py-8 text-center">
          <span className="text-6xl">{result.emoji}</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-text-primary">
            {result.title}
          </h2>
          <p className="mt-2 text-text-secondary">{result.description}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="primary" size="lg" onClick={() => router.push(result.path)}>
              C&apos;est parti !
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              Explorer librement
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = QUESTIONS[currentQ];

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="primary">Question {currentQ + 1}/{QUESTIONS.length}</Badge>
        <div className="flex gap-1">
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
            onClick={() => handleAnswer(option.value)}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background-card p-4 text-center transition-all hover:border-accent-primary hover:bg-background-elevated active:scale-95"
          >
            <span className="text-3xl">{option.emoji}</span>
            <span className="text-sm font-medium text-text-primary">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

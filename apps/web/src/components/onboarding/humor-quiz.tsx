"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: { label: string; value: string; emoji: string }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: "C'est quoi ton objectif principal ?",
    options: [
      { label: "Avoir de la répartie", value: "REPARTIE", emoji: "⚡" },
      { label: "Faire rire les gens", value: "BLAGUES", emoji: "😂" },
      { label: "Être plus à l'aise socialement", value: "CONFIANCE", emoji: "💪" },
      { label: "Tout ça à la fois", value: "GLOBAL", emoji: "🎯" },
    ],
  },
  {
    question: "Où tu veux être drôle ?",
    options: [
      { label: "Entre potes / au lycée", value: "social", emoji: "👯" },
      { label: "Au boulot / machine à café", value: "work", emoji: "☕" },
      { label: "En soirée / rendez-vous", value: "party", emoji: "🎉" },
      { label: "Partout", value: "everywhere", emoji: "🌍" },
    ],
  },
  {
    question: "Ton niveau actuel en humour ?",
    options: [
      { label: "Mes blagues tombent à plat", value: "DEBUTANT", emoji: "😬" },
      { label: "Parfois ça marche", value: "INTERMEDIAIRE", emoji: "😏" },
      { label: "Je fais rire souvent", value: "AVANCE", emoji: "😂" },
      { label: "Je veux aller encore plus loin", value: "EXPERT", emoji: "🎤" },
    ],
  },
];

const RESULTS: Record<string, { title: string; description: string; emoji: string; path: string }> = {
  DEBUTANT: {
    title: "Le Novice Prometteur",
    description: "T'as le potentiel, il te manque juste les techniques ! On va t'apprendre à rebondir, à placer tes blagues et à gagner en confiance — étape par étape.",
    emoji: "🌱",
    path: "/conseils",
  },
  INTERMEDIAIRE: {
    title: "Le Blagueur en Herbe",
    description: "T'as déjà le sens de l'humour, on va l'affûter. Répartie, timing, anecdotes — tu vas devenir celui qu'on écoute.",
    emoji: "🌿",
    path: "/conseils",
  },
  AVANCE: {
    title: "Le Comique Naturel",
    description: "T'es déjà bon ! On va te donner les techniques avancées pour être inoubliable — en soirée, au boulot, partout.",
    emoji: "🔥",
    path: "/videos",
  },
  EXPERT: {
    title: "La Future Star",
    description: "Tu vises haut et c'est ce qu'on aime. Analyse les meilleurs, peaufine tes techniques et prépare-toi à briller.",
    emoji: "⭐",
    path: "/videos",
  },
};

export function HumorQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setShowResult(true);
    }
  };

  const resultKey = answers[2] || "DEBUTANT";
  const result = RESULTS[resultKey] || RESULTS.DEBUTANT;

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

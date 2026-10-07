"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";
import { progressionParcoursLabel } from "@/config/textes/accessibilite";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration: string;
  difficulty: string;
  icon: string;
  steps: { id: string; order: number; tip: { id: string; title: string } }[];
}

/** Niveau = étiquette `secondary` quel que soit le niveau (jamais `error` : le rouge dit « erreur »), audit forme s14 P0-2. */
const DIFFICULTY_VARIANT: Record<string, "secondary"> = {
  DEBUTANT: "secondary",
  INTERMEDIAIRE: "secondary",
  EXPERT: "secondary",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  EXPERT: "Expert",
};

export function ParcoursList() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const { status } = useSession();

  useEffect(() => {
    fetch("/api/parcours")
      .then((res) => (res.ok ? res.json() : { paths: [] }))
      .then((data) => setPaths(data.paths))
      .finally(() => setIsLoading(false));
  }, []);

  // Récupérer la progression de l'utilisateur connecté
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/progress")
      .then((res) => (res.ok ? res.json() : { progress: {} }))
      .then((data) => setProgress(data.progress ?? {}))
      .catch(() => {});
  }, [status]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="py-8">
              <div className="h-8 w-8 rounded bg-background-elevated" />
              <div className="mt-4 h-5 w-2/3 rounded bg-background-elevated" />
              <div className="mt-2 h-4 w-full rounded bg-background-elevated" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (paths.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-text-secondary">Les parcours s&apos;échauffent encore en coulisses. <a href="/parcours" className="text-accent-link hover:underline">Recharge la page</a> dans un instant.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {paths.map((path) => {
        const completedSteps = progress[path.id] ?? 0;
        const isStarted = completedSteps > 0;
        const isCompleted = completedSteps >= path.steps.length;

        return (
          <Card key={path.id} className="transition-colors hover:bg-background-light">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{path.icon}</span>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={DIFFICULTY_VARIANT[path.difficulty] ?? "default"}>
                      {DIFFICULTY_LABELS[path.difficulty] ?? path.difficulty}
                    </Badge>
                    <span className="text-xs text-text-muted">{path.duration}</span>
                  </div>
                  <CardTitle>{path.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="mt-2">{path.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between text-sm text-text-muted">
                <span>{completedSteps}/{path.steps.length} étapes</span>
                <span>+{path.steps.length * 20 + 100} XP</span>
              </div>
              <ProgressBar
                value={completedSteps}
                max={path.steps.length}
                variant="gradient"
                ariaLabel={progressionParcoursLabel(path.title, completedSteps, path.steps.length)}
              />
              <Link
                href={`/parcours/${path.slug}`}
                className={cn(buttonVariants({ variant: "primary", size: "sm" }), "mt-4 w-full")}
              >
                {isCompleted ? "Parcours terminé ✓" : isStarted ? "Continuer le parcours" : "Commencer le parcours"}
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

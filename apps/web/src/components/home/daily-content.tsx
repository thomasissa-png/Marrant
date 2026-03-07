"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Joke {
  id: string;
  content: string;
  punchline: string;
  category: string;
}

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
}

interface DailyData {
  joke: Joke | null;
  tip: Tip | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  AUTODERISION: "Auto-dérision",
  SITUATION: "Situation",
  ABSURDE: "Absurde",
  OBSERVATIONNEL: "Observationnel",
  JEUX_DE_MOTS: "Jeux de mots",
  CULTUREL: "Culturel",
  COUPLE: "Couple",
  BOULOT: "Boulot",
  TIMING: "Timing",
  OBSERVATION: "Observation",
  REPARTIE: "Répartie",
  STORYTELLING: "Storytelling",
};

export function DailyContent() {
  const [data, setData] = useState<DailyData>({ joke: null, tip: null });
  const [showPunchline, setShowPunchline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/daily")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData({ joke: json.joke, tip: json.tip });
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <>
        <section className="py-8">
          <h2 className="font-display mb-6 text-2xl font-bold">Blague du jour</h2>
          <Card className="mx-auto max-w-2xl animate-pulse">
            <CardContent className="py-8">
              <div className="h-4 w-3/4 rounded bg-background-elevated" />
              <div className="mt-2 h-4 w-1/2 rounded bg-background-elevated" />
            </CardContent>
          </Card>
        </section>
        <section className="py-8">
          <h2 className="font-display mb-6 text-2xl font-bold">Conseil du jour</h2>
          <Card className="mx-auto max-w-2xl animate-pulse">
            <CardContent className="py-8">
              <div className="h-4 w-3/4 rounded bg-background-elevated" />
              <div className="mt-2 h-4 w-1/2 rounded bg-background-elevated" />
            </CardContent>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Blague du jour */}
      <section className="py-8">
        <h2 className="font-display mb-6 text-2xl font-bold">Blague du jour</h2>
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="yellow" className="w-fit">
                Blague du jour
              </Badge>
              {data.joke && (
                <Badge variant="default">
                  {CATEGORY_LABELS[data.joke.category] ?? data.joke.category}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {data.joke ? (
              <>
                <p className="text-lg text-text-primary">{data.joke.content}</p>
                {showPunchline ? (
                  <p className="mt-4 text-lg font-semibold text-accent-yellow animate-fade-in">
                    {data.joke.punchline}
                  </p>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4"
                    onClick={() => setShowPunchline(true)}
                  >
                    Révéler la chute
                  </Button>
                )}
              </>
            ) : (
              <p className="text-text-secondary">Aucune blague disponible aujourd&apos;hui.</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Conseil du jour */}
      <section className="py-8">
        <h2 className="font-display mb-6 text-2xl font-bold">Conseil du jour</h2>
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="orange" className="w-fit">
                Conseil du jour
              </Badge>
              {data.tip && (
                <Badge variant="default">
                  {CATEGORY_LABELS[data.tip.category] ?? data.tip.category}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {data.tip ? (
              <>
                <h3 className="mb-2 text-lg font-bold text-text-primary">
                  {data.tip.title}
                </h3>
                <p className="text-text-secondary">{data.tip.content}</p>
              </>
            ) : (
              <p className="text-text-secondary">Aucun conseil disponible aujourd&apos;hui.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

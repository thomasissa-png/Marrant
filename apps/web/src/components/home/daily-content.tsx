"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { YouTubePlayer } from "@/components/ui/youtube-player";

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
  example?: string;
  exercise?: string;
}

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  category: string;
  technique: string;
  learnings: string[];
  exercise: string | null;
}

interface DailyData {
  joke: Joke | null;
  tip: Tip | null;
  video: Video | null;
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
  ECOLE: "École",
  GAMING: "Gaming",
  RESEAUX_SOCIAUX: "Réseaux sociaux",
  DATING: "Dating",
  SOIREES: "Soirées",
  PARENTS: "Parents",
  TIMING: "Timing",
  OBSERVATION: "Observation",
  REPARTIE: "Répartie",
  STORYTELLING: "Storytelling",
};

export function DailyContent() {
  const [data, setData] = useState<DailyData>({ joke: null, tip: null, video: null });
  const [showPunchline, setShowPunchline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/daily")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData({ joke: json.joke, tip: json.tip, video: json.video ?? null });
      })
      .catch(() => {
        // Network error — keep default null state
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="py-10">
        <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
          Ton contenu du jour
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-background-card p-6">
              <div className="mb-3 h-5 w-24 rounded bg-background-elevated" />
              <div className="h-4 w-3/4 rounded bg-background-elevated" />
              <div className="mt-2 h-4 w-1/2 rounded bg-background-elevated" />
              <div className="mt-4 h-10 w-full rounded bg-background-elevated" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
        Ton contenu du jour
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Blague du jour */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-primary/40">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-accent-primary to-accent-secondary" />
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">😂</span>
              <Badge variant="primary">Blague du jour</Badge>
              {data.joke && (
                <Badge variant="default">
                  {CATEGORY_LABELS[data.joke.category] ?? data.joke.category}
                </Badge>
              )}
            </div>
            {data.joke ? (
              <div className="min-h-[120px]">
                <p className="text-base leading-relaxed text-text-primary">{data.joke.content}</p>
                {showPunchline ? (
                  <p className="mt-4 rounded-lg bg-accent-primary/10 p-3 text-base font-semibold text-accent-primary animate-fade-in">
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
              </div>
            ) : (
              <p className="text-text-secondary">Même l&apos;humour prend un jour off. Reviens demain pour ta dose !</p>
            )}
          </div>
        </div>

        {/* Conseil du jour */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-secondary/40">
          <div className="h-1 bg-gradient-to-r from-accent-secondary to-accent-primary" />
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">💡</span>
              <Badge variant="secondary">Conseil du jour</Badge>
              {data.tip && (
                <Badge variant="default">
                  {CATEGORY_LABELS[data.tip.category] ?? data.tip.category}
                </Badge>
              )}
            </div>
            {data.tip ? (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-text-primary">
                  {data.tip.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">{data.tip.content}</p>
                {data.tip.example && (
                  <div className="rounded-lg bg-background-elevated p-3">
                    <p className="text-xs font-semibold text-text-primary">Exemple concret</p>
                    <p className="mt-1 text-xs text-text-secondary">{data.tip.example}</p>
                  </div>
                )}
                {data.tip.exercise && (
                  <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-3">
                    <p className="text-xs font-semibold text-accent-primary">Exercice du jour</p>
                    <p className="mt-1 text-xs text-text-secondary">{data.tip.exercise}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-text-secondary">Le prof d&apos;humour est en pause café. Ça revient demain.</p>
            )}
          </div>
        </div>

        {/* Vidéo du jour */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-primary/40">
          <div className="h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🎬</span>
              <Badge variant="default">Vidéo du jour</Badge>
              {data.video && (
                <>
                  <Badge variant="secondary">
                    {CATEGORY_LABELS[data.video.category] ?? data.video.category}
                  </Badge>
                  <Badge variant="primary">{data.video.technique}</Badge>
                </>
              )}
            </div>
            {data.video ? (
              <div className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-background-elevated">
                  <YouTubePlayer youtubeId={data.video.youtubeId} title={data.video.title} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary line-clamp-2">{data.video.title}</h3>
                  <p className="text-xs text-text-secondary">{data.video.channelName}</p>
                </div>
                {data.video.learnings && data.video.learnings.length > 0 && (
                  <div className="rounded-lg bg-background-elevated p-3">
                    <p className="text-xs font-semibold text-text-primary">Ce que tu vas apprendre</p>
                    <ul className="mt-1.5 space-y-1">
                      {data.video.learnings.map((learning, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                          <span className="mt-0.5 shrink-0 text-accent-primary" aria-hidden="true">•</span>
                          {learning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.video.exercise && (
                  <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-3">
                    <p className="text-xs font-semibold text-accent-primary">Exercice pratique</p>
                    <p className="mt-1 text-xs text-text-secondary">{data.video.exercise}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-text-secondary">L&apos;humoriste du jour est en coulisses. À demain !</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

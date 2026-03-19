"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { ReactionButtons } from "@/components/ui/reaction-buttons";

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

// Labels alignés avec le regroupement des filtres vannes + conseils/vidéos
const JOKE_CATEGORY_LABELS: Record<string, string> = {
  AUTODERISION: "Auto-dérision",
  SITUATION: "Vie quotidienne",
  ABSURDE: "Absurde",
  OBSERVATIONNEL: "Vie quotidienne",
  JEUX_DE_MOTS: "Jeux de mots",
  CULTUREL: "Vie quotidienne",
  COUPLE: "Couple & Dating",
  BOULOT: "Boulot & Collègues",
  ECOLE: "École & Études",
  GAMING: "Digital & Gaming",
  RESEAUX_SOCIAUX: "Digital & Gaming",
  DATING: "Couple & Dating",
  SOIREES: "Soirées & Apéro",
  PARENTS: "Famille",
};

const TIP_VIDEO_CATEGORY_LABELS: Record<string, string> = {
  TIMING: "Timing",
  AUTODERISION: "Auto-dérision",
  OBSERVATION: "Observation",
  REPARTIE: "Répartie",
  STORYTELLING: "Storytelling",
  ABSURDE: "Absurde",
  JEUX_DE_MOTS: "Jeux de mots",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  EXPERT: "Expert",
};

const DIFFICULTY_VARIANT: Record<string, "secondary" | "primary" | "error"> = {
  DEBUTANT: "secondary",
  INTERMEDIAIRE: "primary",
  EXPERT: "error",
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
        {/* Vanne du jour */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-primary/40">
          <div className="h-1 bg-gradient-to-r from-accent-primary to-accent-secondary" />
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">😂</span>
              <Badge variant="primary">Vanne du jour</Badge>
              {data.joke && (
                <Badge variant="default">
                  {JOKE_CATEGORY_LABELS[data.joke.category] ?? data.joke.category}
                </Badge>
              )}
            </div>
            {data.joke ? (
              <>
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
                <div className="mt-4 flex items-center gap-2">
                  <ReactionButtons jokeId={data.joke.id} />
                  <ShareButton
                    title="Vanne du jour — deviens-marrant.fr"
                    text={`${data.joke.content}\n${data.joke.punchline}`}
                  />
                  <FavoriteButton contentType="JOKE" contentId={data.joke.id} />
                </div>
              </>
            ) : (
              <p className="text-text-secondary">Même l&apos;humour prend un jour off. Reviens demain pour ta dose !</p>
            )}
          </div>
        </div>

        {/* Conseil du jour */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-secondary/40">
          <div className="h-1 bg-gradient-to-r from-accent-secondary to-accent-primary" />
          <div className="p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-2xl" aria-hidden="true">💡</span>
              <Badge variant="secondary">Conseil du jour</Badge>
              {data.tip && (
                <>
                  <Badge variant={DIFFICULTY_VARIANT[data.tip.difficulty] ?? "default"}>
                    {DIFFICULTY_LABELS[data.tip.difficulty] ?? data.tip.difficulty}
                  </Badge>
                  <Badge variant="default">
                    {TIP_VIDEO_CATEGORY_LABELS[data.tip.category] ?? data.tip.category}
                  </Badge>
                </>
              )}
            </div>
            {data.tip ? (
              <>
                <div className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-text-primary">
                    {data.tip.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-primary">{data.tip.content}</p>
                  {data.tip.example && (
                    <div className="rounded-lg bg-background-elevated p-4">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-primary">Exemple concret</p>
                      <p className="text-sm leading-relaxed text-text-secondary">{data.tip.example}</p>
                    </div>
                  )}
                  {data.tip.exercise && (
                    <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-primary">Exercice du jour</p>
                      <p className="text-sm leading-relaxed text-text-secondary">{data.tip.exercise}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <ShareButton
                    title="Conseil du jour — deviens-marrant.fr"
                    text={`${data.tip.title}\n${data.tip.content}`}
                  />
                  <FavoriteButton contentType="TIP" contentId={data.tip.id} />
                </div>
              </>
            ) : (
              <p className="text-text-secondary">Le prof d&apos;humour est en pause café. Ça revient demain.</p>
            )}
          </div>
        </div>

        {/* Vidéo du jour */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-accent-primary/40">
          <div className="h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
          <div className="p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🎬</span>
              <Badge variant="default">Vidéo du jour</Badge>
              {data.video && (
                <>
                  <Badge variant="secondary">
                    {TIP_VIDEO_CATEGORY_LABELS[data.video.category] ?? data.video.category}
                  </Badge>
                  {data.video.technique &&
                    data.video.technique.toLowerCase() !== (TIP_VIDEO_CATEGORY_LABELS[data.video.category] ?? data.video.category).toLowerCase() && (
                    <Badge variant="primary">{data.video.technique}</Badge>
                  )}
                </>
              )}
            </div>
            {data.video ? (
              <>
                <div className="space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-background-elevated">
                    <YouTubePlayer youtubeId={data.video.youtubeId} title={data.video.title} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-text-primary line-clamp-2">{data.video.title}</h3>
                    <p className="mt-0.5 text-sm text-text-secondary">{data.video.channelName}</p>
                  </div>
                  {data.video.learnings && data.video.learnings.length > 0 && (
                    <div className="rounded-lg bg-background-elevated p-4">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-primary">Ce que tu vas apprendre</p>
                      <ul className="mt-1.5 space-y-1.5">
                        {data.video.learnings.map((learning, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm text-text-secondary">
                            <span className="mt-0.5 shrink-0 text-accent-primary" aria-hidden="true">•</span>
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.video.exercise && (
                    <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-primary">Exercice pratique</p>
                      <p className="text-sm leading-relaxed text-text-secondary">{data.video.exercise}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <ShareButton
                    title="Vidéo du jour — deviens-marrant.fr"
                    text={`${data.video.title} — ${data.video.channelName}`}
                  />
                  <FavoriteButton contentType="VIDEO" contentId={data.video.id} />
                </div>
              </>
            ) : (
              <p className="text-text-secondary">L&apos;humoriste du jour est en coulisses. À demain !</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

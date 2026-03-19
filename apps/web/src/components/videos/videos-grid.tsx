"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { PremiumModal } from "@/components/premium/premium-modal";
import Link from "next/link";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  category: string;
  difficulty: string;
  description: string;
  technique: string;
  learnings: string[];
  exercise: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DIFFICULTIES = [
  { value: "", label: "Tous" },
  { value: "DEBUTANT", label: "Débutant" },
  { value: "INTERMEDIAIRE", label: "Intermédiaire" },
  { value: "EXPERT", label: "Expert" },
];

const CATEGORY_LABELS: Record<string, string> = {
  TIMING: "Timing",
  AUTODERISION: "Auto-dérision",
  OBSERVATION: "Observation",
  REPARTIE: "Répartie",
  STORYTELLING: "Storytelling",
  ABSURDE: "Absurde",
  JEUX_DE_MOTS: "Jeux de mots",
};

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const h = match[1] ? `${match[1]}:` : "";
  const m = match[2] ?? "0";
  const s = (match[3] ?? "0").padStart(2, "0");
  return `${h}${m}:${s}`;
}

const CATEGORIES = [
  { value: "", label: "Toutes" },
  { value: "TIMING", label: "Timing" },
  { value: "AUTODERISION", label: "Auto-dérision" },
  { value: "OBSERVATION", label: "Observation" },
  { value: "REPARTIE", label: "Répartie" },
  { value: "STORYTELLING", label: "Storytelling" },
  { value: "ABSURDE", label: "Absurde" },
  { value: "JEUX_DE_MOTS", label: "Jeux de mots" },
];

export function VideosGrid() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const [videos, setVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState(false);
  const [limited, setLimited] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [totalReal, setTotalReal] = useState(0);

  // Éviter le flash du skeleton si le fetch est rapide
  useEffect(() => {
    if (isLoading && videos.length === 0) {
      const timer = setTimeout(() => setShowSkeleton(true), 300);
      return () => clearTimeout(timer);
    }
    setShowSkeleton(false);
  }, [isLoading, videos.length]);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (difficulty) params.set("difficulty", difficulty);
    if (category) params.set("category", category);
    if (searchQuery) params.set("q", searchQuery);

    try {
      const res = await fetch(`/api/videos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos);
        setPagination(data.pagination);
        setLimited(data.limited ?? false);
        setUpgradeMessage(data.upgradeMessage ?? "");
        setTotalReal(data.totalReal ?? 0);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, category, page, searchQuery]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <>
      {/* Filtres niveau + catégorie — PREMIUM uniquement */}
      {limited ? (
        <div className="mb-6 rounded-lg border border-border bg-background-elevated/50 p-3">
          <div className="flex flex-wrap items-center gap-2 opacity-50" aria-hidden="true">
            {DIFFICULTIES.slice(1).map((d) => (
              <span key={d.value} className="rounded-md bg-background-card px-3 py-1.5 text-sm text-text-muted">
                {d.label}
              </span>
            ))}
            <span className="mx-1 text-text-muted">·</span>
            {CATEGORIES.slice(1, 4).map((cat) => (
              <span key={cat.value} className="rounded-md bg-background-card px-3 py-1.5 text-sm text-text-muted">
                {cat.label}
              </span>
            ))}
            <span className="text-sm text-text-muted">...</span>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Filtres par niveau et catégorie disponibles avec l&apos;abonnement&nbsp;
            <Link href="/abonnement" className="font-medium text-accent-primary hover:underline">Premium</Link>
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Niveaux de difficulté">
            {DIFFICULTIES.map((d) => (
              <Button
                key={d.value}
                variant={difficulty === d.value ? "secondary" : "ghost"}
                size="sm"
                role="tab"
                aria-selected={difficulty === d.value}
                onClick={() => { setDifficulty(d.value); setPage(1); }}
              >
                {d.label}
              </Button>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Catégories de vidéos">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? "primary" : "ghost"}
                size="sm"
                role="tab"
                aria-selected={category === cat.value}
                onClick={() => { setCategory(cat.value); setPage(1); }}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </>
      )}

      {error ? (
        <ErrorState message="Les vidéos ont pris un jour de congé." onRetry={fetchVideos} />
      ) : showSkeleton ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-4">
                <div className="mb-3 aspect-video rounded-lg bg-background-elevated" />
                <div className="h-4 w-3/4 rounded bg-background-elevated" />
                <div className="mt-2 h-3 w-1/2 rounded bg-background-elevated" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <EmptyState
          emoji="🎬"
          emojiLabel="pas de vidéos"
          title="Pas de vidéo ici... même les humoristes font des pauses"
          description="Essaie un autre niveau, y'a du lourd qui t'attend."
          ctaLabel="Voir toutes les vidéos"
          ctaHref="/videos"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="tabpanel">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className="overflow-hidden transition-colors hover:bg-background-light animate-stagger-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="pt-4">
                <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-background-elevated">
                  <YouTubePlayer youtubeId={video.youtubeId} title={video.title} />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-text-primary line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex shrink-0 items-center gap-1">
                    <FavoriteButton contentType="VIDEO" contentId={video.id} />
                    <ShareButton title={`${video.title} - deviens-marrant.fr`} text={`${video.title} par ${video.channelName}`} />
                  </div>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{video.channelName}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="default">{CATEGORY_LABELS[video.category] ?? video.category}</Badge>
                  {video.technique && video.technique.toLowerCase() !== (CATEGORY_LABELS[video.category] ?? video.category).toLowerCase() && (
                    <Badge variant="default">{video.technique}</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">{video.description}</p>
                {video.learnings && video.learnings.length > 0 && (
                  <div className="mt-3 rounded-lg bg-background-elevated p-4">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-primary">Ce que tu vas apprendre</p>
                    <ul className="mt-1.5 space-y-1.5">
                      {video.learnings.map((learning, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-sm text-text-secondary">
                          <span className="mt-0.5 shrink-0 text-accent-primary" aria-hidden="true">•</span>
                          {learning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {video.exercise && (
                  <div className="mt-2 rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-primary">Exercice pratique</p>
                    <p className="text-sm leading-relaxed text-text-secondary">{video.exercise}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cartes verrouillées pour FREE users */}
      {limited && videos.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: Math.min(3, Math.max(0, totalReal - videos.length)) }).map((_, i) => (
            <Card
              key={`locked-${i}`}
              className="group relative cursor-pointer overflow-hidden border-dashed border-accent-primary/30 transition-all hover:border-accent-primary/60 hover:shadow-md"
              onClick={() => setPremiumOpen(true)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPremiumOpen(true); } }}
              aria-label="Contenu premium — cliquer pour débloquer"
            >
              <CardContent className="pt-4">
                <div className="mb-3 aspect-video rounded-lg bg-text-muted/10" />
                <div className="h-4 w-3/4 rounded bg-text-muted/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-text-muted/10" />
                <div className="absolute inset-0 flex items-center justify-center bg-background-card/60 backdrop-blur-[2px] transition-colors group-hover:bg-background-card/40">
                  <div className="flex flex-col items-center gap-1.5">
                    <svg className="h-6 w-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-medium text-accent-primary">Débloquer</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bannière upgrade FREE */}
      {limited && upgradeMessage && (
        <div className="mt-8 rounded-xl border-2 border-accent-primary/30 bg-accent-primary/5 p-6 text-center">
          <p className="font-semibold text-text-primary">{upgradeMessage}</p>
          <p className="mt-1 text-sm text-text-secondary">
            Accède à tout le catalogue dès 0,99 &euro;/mois
          </p>
          <Link href="/abonnement">
            <Button variant="primary" size="sm" className="mt-3">
              Voir l&apos;offre
            </Button>
          </Link>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Précédent
          </Button>
          <span className="text-sm text-text-secondary">
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <Button variant="ghost" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
            Suivant
          </Button>
        </div>
      )}
    </>
  );
}

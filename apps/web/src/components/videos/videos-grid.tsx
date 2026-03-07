"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function VideosGrid() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (difficulty) params.set("difficulty", difficulty);

    try {
      const res = await fetch(`/api/videos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos);
        setPagination(data.pagination);
      }
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, page]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <>
      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => (
          <Button
            key={d.value}
            variant={difficulty === d.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => { setDifficulty(d.value); setPage(1); }}
          >
            {d.label}
          </Button>
        ))}
      </div>

      {/* Grille vidéos */}
      {isLoading ? (
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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">Aucune vidéo trouvée avec ces filtres.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden transition-colors hover:bg-background-light">
              <CardContent className="pt-4">
                {/* Thumbnail YouTube */}
                <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-background-elevated">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                    {formatDuration(video.duration)}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-text-primary line-clamp-2">
                  {video.title}
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {video.channelName}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="default">
                    {CATEGORY_LABELS[video.category] ?? video.category}
                  </Badge>
                  <Badge variant="default">{video.technique}</Badge>
                </div>
                <p className="mt-2 text-xs text-text-muted line-clamp-2">
                  {video.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-text-secondary">
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </>
  );
}

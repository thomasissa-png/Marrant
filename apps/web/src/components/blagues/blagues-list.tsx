"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

interface Joke {
  id: string;
  content: string;
  punchline: string;
  category: string;
  type: string;
  maturityLevel: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CATEGORIES = [
  { value: "", label: "Toutes" },
  { value: "AUTODERISION", label: "Auto-dérision" },
  { value: "SITUATION", label: "Situation" },
  { value: "ABSURDE", label: "Absurde" },
  { value: "OBSERVATIONNEL", label: "Observationnel" },
  { value: "JEUX_DE_MOTS", label: "Jeux de mots" },
  { value: "CULTUREL", label: "Culturel" },
  { value: "COUPLE", label: "Couple" },
  { value: "BOULOT", label: "Boulot" },
  { value: "ECOLE", label: "École" },
  { value: "GAMING", label: "Gaming" },
  { value: "RESEAUX_SOCIAUX", label: "Réseaux sociaux" },
  { value: "DATING", label: "Dating" },
  { value: "SOIREES", label: "Soirées" },
  { value: "PARENTS", label: "Parents" },
];

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.filter((c) => c.value).map((c) => [c.value, c.label])
);

export function BlaguesList() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [limited, setLimited] = useState(false);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const fetchJokes = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (category) params.set("category", category);

    try {
      const res = await fetch(`/api/jokes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJokes(data.jokes);
        setPagination(data.pagination);
        setLimited(data.limited ?? false);
        if (data.totalAvailable) setTotalAvailable(data.totalAvailable);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    fetchJokes();
  }, [fetchJokes]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
    setRevealedIds(new Set());
  };

  const togglePunchline = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Filtres catégories avec ARIA */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Catégories de blagues">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            variant={category === cat.value ? "primary" : "ghost"}
            size="sm"
            role="tab"
            aria-selected={category === cat.value}
            onClick={() => handleCategoryChange(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Error state */}
      {error ? (
        <ErrorState
          message="Les blagues se sont perdues en chemin."
          onRetry={fetchJokes}
        />
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-6">
                <div className="h-4 w-1/4 rounded bg-background-elevated" />
                <div className="mt-3 h-4 w-3/4 rounded bg-background-elevated" />
                <div className="mt-2 h-4 w-1/2 rounded bg-background-elevated" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : jokes.length === 0 ? (
        <EmptyState
          emoji="😅"
          emojiLabel="pas de blagues"
          title="Rien ici... c'est aussi vide que mon frigo un dimanche soir"
          description="Essaie une autre catégorie, on a forcément un truc pour toi."
          ctaLabel="Voir toutes les blagues"
          ctaHref="/blagues"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2" role="tabpanel">
          {jokes.map((joke, index) => (
            <Card
              key={joke.id}
              className="cursor-pointer transition-colors hover:bg-background-light animate-stagger-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              style={{ animationDelay: `${index * 50}ms` }}
              tabIndex={0}
              onClick={() => togglePunchline(joke.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); togglePunchline(joke.id); } }}
            >
              <CardContent className="pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">
                      {CATEGORY_LABELS[joke.category] ?? joke.category}
                    </Badge>
                    <Badge variant="default">{joke.type}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <FavoriteButton contentType="JOKE" contentId={joke.id} />
                    <ShareButton title="Blague - deviensmarrant.fr" text={`${joke.content}\n\n${joke.punchline}`} />
                  </div>
                </div>
                <p className="text-text-primary">{joke.content}</p>
                {revealedIds.has(joke.id) && (
                  <p className="mt-3 font-semibold text-accent-primary animate-fade-in">
                    {joke.punchline}
                  </p>
                )}
                {revealedIds.has(joke.id) && (
                  <ReactionButtons jokeId={joke.id} className="mt-3" />
                )}
                {!revealedIds.has(joke.id) && (
                  <p className="mt-3 text-sm text-text-muted">
                    Tape pour la chute (promis, ça vaut le coup)
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upsell Premium */}
      {limited && (
        <div className="mt-8 rounded-2xl border-2 border-accent-primary/30 bg-accent-primary/5 p-6 text-center">
          <p className="text-lg font-semibold text-text-primary">
            Tu as acc&egrave;s &agrave; 20 blagues + la blague du jour{totalAvailable > 0 ? ` — il y en a ${totalAvailable}+ !` : " !"}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Débloque toutes les blagues, classées par catégorie, pour seulement 0,99 €/mois — prix de lancement.
          </p>
          <Link href="/register">
            <Button variant="primary" size="lg" className="mt-4">
              Débloquer tout — 0,99 €/mois
            </Button>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {!limited && pagination && pagination.totalPages > 1 && (
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

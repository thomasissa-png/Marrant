"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { showXpGain } from "@/components/ui/xp-notification";
import { useSession } from "next-auth/react";

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example: string;
  exercise: string;
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

const DIFFICULTY_VARIANT: Record<string, "secondary" | "primary" | "error"> = {
  DEBUTANT: "secondary",
  INTERMEDIAIRE: "primary",
  EXPERT: "error",
};

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.filter((c) => c.value).map((c) => [c.value, c.label])
);

export function ConseilsList() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [limited, setLimited] = useState(false);
  const { status } = useSession();
  const addXp = useUserStore((s) => s.addXp);
  const [completedTipIds, setCompletedTipIds] = useState<Set<string>>(new Set());

  const fetchTips = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (difficulty) params.set("difficulty", difficulty);
    if (category) params.set("category", category);

    try {
      const res = await fetch(`/api/tips?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTips(data.tips);
        setPagination(data.pagination);
        setLimited(data.limited ?? false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, category, page]);

  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (status === "authenticated" && !completedTipIds.has(id)) {
          setCompletedTipIds((prev) => new Set(prev).add(id));
          addXp(10, "tip_read");
          showXpGain(10);
        }
      }
      return next;
    });
  };

  return (
    <>
      {/* Filtres niveaux */}
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

      {/* Filtres catégories */}
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Catégories de conseils">
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

      {/* Error state */}
      {error ? (
        <ErrorState
          message="Impossible de charger les conseils."
          onRetry={fetchTips}
        />
      ) : isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-6">
                <div className="h-4 w-1/3 rounded bg-background-elevated" />
                <div className="mt-3 h-4 w-3/4 rounded bg-background-elevated" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tips.length === 0 ? (
        <EmptyState
          emoji="🎓"
          emojiLabel="pas de conseils"
          title="Aucun conseil avec ces filtres"
          description="Affine tes filtres pour découvrir d'autres techniques."
          ctaLabel="Voir tous les conseils"
          ctaHref="/conseils"
        />
      ) : (
        <div className="grid gap-4" role="tabpanel">
          {tips.map((tip, index) => (
            <Card
              key={tip.id}
              className="cursor-pointer transition-colors hover:bg-background-light animate-stagger-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              style={{ animationDelay: `${index * 60}ms` }}
              tabIndex={0}
              onClick={() => toggleExpanded(tip.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpanded(tip.id); } }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={DIFFICULTY_VARIANT[tip.difficulty] ?? "default"}>
                      {DIFFICULTIES.find((d) => d.value === tip.difficulty)?.label ?? tip.difficulty}
                    </Badge>
                    <Badge variant="default">
                      {CATEGORY_LABELS[tip.category] ?? tip.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <FavoriteButton contentType="TIP" contentId={tip.id} />
                    <ShareButton title={`${tip.title} - deviensmarrant.fr`} text={tip.content} />
                  </div>
                </div>
                <CardTitle>{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">{tip.content}</p>

                {expandedIds.has(tip.id) && (
                  <div className="mt-4 space-y-4 animate-fade-in">
                    <div className="rounded-lg bg-background-elevated p-4">
                      <p className="mb-1 text-xs font-semibold uppercase text-accent-primary">Exemple</p>
                      <p className="text-sm text-text-primary">{tip.example}</p>
                    </div>
                    <div className="rounded-lg bg-background-elevated p-4">
                      <p className="mb-1 text-xs font-semibold uppercase text-accent-secondary">Exercice</p>
                      <p className="text-sm text-text-primary">{tip.exercise}</p>
                    </div>
                  </div>
                )}

                {!expandedIds.has(tip.id) && (
                  <p className="mt-2 text-xs text-text-muted">
                    Clique pour voir l&apos;exemple et l&apos;exercice
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
            Tu as accès à 5 conseils + le conseil du jour — 50+ t&apos;attendent !
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Débloque tous les conseils, exemples et exercices pour seulement 0,99 €/mois.
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

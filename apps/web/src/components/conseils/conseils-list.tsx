"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { useUserStore } from "@/stores/user-store";
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

const DIFFICULTY_VARIANT: Record<string, "orange" | "yellow" | "error"> = {
  DEBUTANT: "orange",
  INTERMEDIAIRE: "yellow",
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { status } = useSession();
  const addXp = useUserStore((s) => s.addXp);
  const [completedTipIds, setCompletedTipIds] = useState<Set<string>>(new Set());

  const fetchTips = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (difficulty) params.set("difficulty", difficulty);
    if (category) params.set("category", category);

    try {
      const res = await fetch(`/api/tips?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTips(data.tips);
        setPagination(data.pagination);
      }
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
        // Award XP for reading a new tip
        if (status === "authenticated" && !completedTipIds.has(id)) {
          setCompletedTipIds((prev) => new Set(prev).add(id));
          addXp(10, "tip_read");
        }
      }
      return next;
    });
  };

  return (
    <>
      {/* Niveaux */}
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

      {/* Catégories */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat.value}
            variant={category === cat.value ? "yellow" : "default"}
            className="cursor-pointer"
            onClick={() => { setCategory(cat.value); setPage(1); }}
          >
            {cat.label}
          </Badge>
        ))}
      </div>

      {/* Liste */}
      {isLoading ? (
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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">Aucun conseil trouvé avec ces filtres.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tips.map((tip) => (
            <Card
              key={tip.id}
              className="cursor-pointer transition-colors hover:bg-background-light"
              onClick={() => toggleExpanded(tip.id)}
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
                      <p className="mb-1 text-xs font-semibold uppercase text-accent-yellow">
                        Exemple
                      </p>
                      <p className="text-sm text-text-primary">{tip.example}</p>
                    </div>
                    <div className="rounded-lg bg-background-elevated p-4">
                      <p className="mb-1 text-xs font-semibold uppercase text-accent-orange">
                        Exercice
                      </p>
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

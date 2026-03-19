"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { PremiumModal } from "@/components/premium/premium-modal";
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

// Filtres regroupés par contexte d'usage (où tu sors la vanne)
// Les groupes fusionnent les catégories DB proches pour simplifier le choix
const CATEGORIES = [
  { value: "", label: "Toutes" },
  // Par contexte — où tu la sors
  { value: "SITUATION,OBSERVATIONNEL,CULTUREL", label: "Vie quotidienne" },
  { value: "BOULOT", label: "Boulot & Collègues" },
  { value: "COUPLE,DATING", label: "Couple & Dating" },
  { value: "SOIREES", label: "Soirées & Apéro" },
  { value: "ECOLE", label: "École & Études" },
  { value: "PARENTS", label: "Famille" },
  { value: "RESEAUX_SOCIAUX,GAMING", label: "Digital & Gaming" },
  // Par style — comment elle marche
  { value: "AUTODERISION", label: "Auto-dérision" },
  { value: "ABSURDE", label: "Absurde" },
  { value: "JEUX_DE_MOTS", label: "Jeux de mots" },
];

// Labels pour les badges individuels sur chaque carte (DB enum → label lisible)
const CATEGORY_LABELS: Record<string, string> = {
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

const PUNCHLINE_TEASERS = [
  "Clique pour la chute",
  "La chute va te surprendre",
  "Celle-là, tu vas la ressortir",
  "Attention, chute en approche",
  "Tu la sens venir ?",
  "Le meilleur arrive...",
  "À toi de jouer",
  "Ça pique, prépare-toi",
];

export function VannesList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [limited, setLimited] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [totalReal, setTotalReal] = useState(0);

  // Éviter le flash du skeleton si le fetch est rapide
  useEffect(() => {
    if (isLoading && jokes.length === 0) {
      const timer = setTimeout(() => setShowSkeleton(true), 300);
      return () => clearTimeout(timer);
    }
    setShowSkeleton(false);
  }, [isLoading, jokes.length]);

  const fetchJokes = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (category) params.set("category", category);
    if (searchQuery) params.set("q", searchQuery);

    try {
      const res = await fetch(`/api/jokes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJokes(data.jokes);
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
  }, [category, page, searchQuery]);

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
      {/* Filtres catégories avec ARIA — PREMIUM uniquement */}
      {limited ? (
        <div className="mb-6 rounded-lg border border-border bg-background-elevated/50 p-3">
          <div className="flex flex-wrap items-center gap-2 opacity-50" aria-hidden="true">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <span key={cat.value} className="rounded-md bg-background-card px-3 py-1.5 text-sm text-text-muted">
                {cat.label}
              </span>
            ))}
            <span className="text-sm text-text-muted">...</span>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Filtres par catégorie disponibles avec l&apos;abonnement&nbsp;
            <Link href="/abonnement" className="font-medium text-accent-primary hover:underline">Premium</Link>
          </p>
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Catégories de vannes">
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
      )}

      {error ? (
        <ErrorState
          message="Les vannes se sont perdues en chemin."
          onRetry={fetchJokes}
        />
      ) : showSkeleton ? (
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
          emojiLabel="pas de vannes"
          title="Rien ici... c'est aussi vide que mon frigo un dimanche soir"
          description="Essaie une autre catégorie, on a forcément un truc pour toi."
          ctaLabel="Voir toutes les vannes"
          ctaHref="/vannes"
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
                    <ShareButton title="Vanne - deviens-marrant.fr" text={`${joke.content}\n\n${joke.punchline}`} />
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
                    {PUNCHLINE_TEASERS[index % PUNCHLINE_TEASERS.length]}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cartes verrouillées pour FREE users */}
      {limited && jokes.length > 0 && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Array.from({ length: Math.min(4, Math.max(0, totalReal - jokes.length)) }).map((_, i) => (
            <Card
              key={`locked-${i}`}
              className="group relative cursor-pointer overflow-hidden border-dashed border-accent-primary/30 transition-all hover:border-accent-primary/60 hover:shadow-md"
              onClick={() => setPremiumOpen(true)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPremiumOpen(true); } }}
              aria-label="Contenu premium — cliquer pour débloquer"
            >
              <CardContent className="pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="default" className="opacity-50">Catégorie</Badge>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-4/5 rounded bg-text-muted/10" />
                  <div className="h-4 w-3/5 rounded bg-text-muted/10" />
                </div>
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

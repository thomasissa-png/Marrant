"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { PremiumModal } from "@/components/premium/premium-modal";
import { useUserStore } from "@/stores/user-store";
import { showXpGain } from "@/components/ui/xp-notification";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ListPagination } from "@/components/ui/list-pagination";
import { buildTipSlug } from "@/lib/catalogue-slug";
import { useListPage } from "@/hooks/use-list-page";
import type { CataloguePage } from "@/lib/list-pagination";
import { tipProse } from "@/lib/tip-prose";

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

const TIP_TEASERS = [
  "Clique pour l’exemple et le défi",
  "Un exercice t’attend là-dessous",
  "Le défi est juste en dessous",
  "Ouvre, y’a un défi pour toi",
  "L’exemple concret est caché ici",
  "Teste-toi avec le défi",
  "Vas-y, le défi t’attend",
  "Un truc à tester aujourd’hui",
];

interface ConseilsListProps {
  /** Page rendue par le serveur (HTML crawlable, lot S1 s14). Null : chargement client seul. */
  initialData?: CataloguePage<Tip> | null;
  initialPage?: number;
}

export function ConseilsList({ initialData = null, initialPage = 1 }: ConseilsListProps = {}) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const { page, goToPage, resetPage } = useListPage(initialPage);
  const [tips, setTips] = useState<Tip[]>(initialData?.items ?? []);
  const [pagination, setPagination] = useState<Pagination | null>(initialData ? toPagination(initialData) : null);
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(!initialData);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { status } = useSession();
  const addXp = useUserStore((s) => s.addXp);
  const [completedTipIds, setCompletedTipIds] = useState<Set<string>>(new Set());
  const [limited, setLimited] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [totalReal, setTotalReal] = useState(0);

  // Éviter le flash du skeleton si le fetch est rapide
  useEffect(() => {
    if (isLoading && tips.length === 0) {
      const timer = setTimeout(() => setShowSkeleton(true), 300);
      return () => clearTimeout(timer);
    }
    setShowSkeleton(false);
  }, [isLoading, tips.length]);

  const fetchTips = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (difficulty) params.set("difficulty", difficulty);
    if (category) params.set("category", category);
    if (searchQuery) params.set("q", searchQuery);

    // Échec du rechargement de la vue rendue par le serveur (ex. robot sans accès
    // à /api/) : on garde la liste du serveur plutôt qu'un message d'erreur.
    const fallBackToServer = () => {
      if (initialData && page === initialData.page && !difficulty && !category && !searchQuery) {
        setTips(initialData.items);
        setPagination(toPagination(initialData));
      } else {
        setError(true);
      }
    };

    try {
      const res = await fetch(`/api/tips?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTips(data.tips);
        setPagination(data.pagination);
        setLimited(data.limited ?? false);
        setUpgradeMessage(data.upgradeMessage ?? "");
        setTotalReal(data.totalReal ?? 0);
      } else {
        fallBackToServer();
      }
    } catch {
      fallBackToServer();
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, category, page, searchQuery, initialData]);

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
      {/* Filtres niveaux + catégories — PREMIUM uniquement */}
      {limited ? (
        // Même traitement que /vannes (T14) : une ligne cadenas + texte existant, sans chips fantômes.
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-background-elevated/50 px-3 py-2">
          <svg className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm text-text-secondary">
            Filtres par niveau et catégorie disponibles avec l&apos;abonnement&nbsp;
            <Link href="/abonnement" className="inline-flex min-h-[44px] items-center font-medium text-accent-link hover:underline">Premium</Link>
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
                onClick={() => { setDifficulty(d.value); resetPage(); }}
              >
                {d.label}
              </Button>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Catégories de conseils">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? "primary" : "ghost"}
                size="sm"
                role="tab"
                aria-selected={category === cat.value}
                onClick={() => { setCategory(cat.value); resetPage(); }}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </>
      )}

      {error ? (
        <ErrorState
          message="Les conseils se font désirer... comme une bonne chute."
          onRetry={fetchTips}
        />
      ) : showSkeleton ? (
        <div className="grid max-w-4xl gap-4">
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
        // Page au-delà de l'aperçu gratuit : cartes verrouillées + offre (plus bas).
        limited && page > 1 ? null : <EmptyState
          emoji="🎓"
          emojiLabel="pas de conseils"
          title="Aucun conseil ne colle à ces filtres, et pourtant on a cherché sous le canapé"
          description="Change tes filtres, y'a plein de techniques qui t'attendent."
          ctaLabel="Voir tous les conseils"
          ctaHref="/conseils"
        />
      ) : (
        <div className="grid max-w-4xl gap-4" role="tabpanel">
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
                  <div className="flex items-center">
                    <FavoriteButton contentType="TIP" contentId={tip.id} />
                    <ShareButton title={`${tip.title} - deviens-marrant.fr`} text={tip.content} />
                  </div>
                </div>
                <CardTitle>{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* T20 : conseil replié à 4 lignes, affiché en entier au dépliage (clic sur la carte). */}
                <p
                  className={`max-w-[72ch] text-sm leading-relaxed text-text-primary${expandedIds.has(tip.id) ? "" : " line-clamp-4"}`}
                >
                  {tipProse(tip.content)}
                </p>

                {expandedIds.has(tip.id) && (
                  <div className="mt-4 space-y-4 animate-fade-in">
                    <div className="rounded-lg bg-background-elevated p-4">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-link">Exemple</p>
                      <p className="max-w-[72ch] text-sm leading-relaxed text-text-secondary">{tipProse(tip.example)}</p>
                    </div>
                    {tip.exercise && (
                      <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-link">Exercice</p>
                        <p className="max-w-[72ch] text-sm leading-relaxed text-text-secondary">{tipProse(tip.exercise)}</p>
                      </div>
                    )}
                  </div>
                )}

                {!expandedIds.has(tip.id) && (
                  <p className="mt-2 text-xs text-text-muted">
                    {TIP_TEASERS[index % TIP_TEASERS.length]}
                  </p>
                )}
                <div className="mt-3 border-t border-border pt-2">
                  <Link
                    href={`/conseils/${buildTipSlug(tip)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex min-h-[44px] items-center py-3 text-sm text-text-muted hover:text-accent-link hover:underline"
                    aria-label="Ouvrir la page dédiée de ce conseil"
                  >
                    Page dédiée &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cartes verrouillées pour FREE users */}
      {limited && (tips.length > 0 || page > 1) && (
        <div className="mt-4 grid max-w-4xl gap-4">
          {Array.from({ length: Math.min(3, Math.max(0, totalReal - tips.length)) }).map((_, i) => (
            <Card
              key={`locked-${i}`}
              className="group relative cursor-pointer overflow-hidden border-dashed border-accent-primary/30 transition-all hover:border-accent-primary/60 hover:shadow-md"
              onClick={() => setPremiumOpen(true)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPremiumOpen(true); } }}
              aria-label="Contenu premium : cliquer pour débloquer"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="opacity-50">Niveau</Badge>
                  <Badge variant="default" className="opacity-50">Catégorie</Badge>
                </div>
                <div className="mt-2 h-5 w-3/5 rounded bg-text-muted/10" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-text-muted/10" />
                  <div className="h-4 w-4/5 rounded bg-text-muted/10" />
                  <div className="h-4 w-2/3 rounded bg-text-muted/10" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background-card/60 backdrop-blur-[2px] transition-colors group-hover:bg-background-card/40">
                  <div className="flex flex-col items-center gap-1.5">
                    <svg className="h-6 w-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-medium text-accent-link">Débloquer</span>
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
          {/* T18 : même comportement que les cartes verrouillées (modale, qui mène à l'offre). */}
          <Button variant="primary" size="sm" className="mt-3" onClick={() => setPremiumOpen(true)}>
            Voir l&apos;offre
          </Button>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} />

      {/* Pagination : vrais liens ?page=N (crawlables), navigation sans rechargement avec JS */}
      <ListPagination
        basePath="/conseils"
        page={page}
        totalPages={Math.max(
          pagination?.totalPages ?? 0,
          // Catalogue public complet (pages rendues par le serveur), hors filtres et recherche.
          !difficulty && !category && !searchQuery ? initialData?.totalPages ?? 0 : 0,
        )}
        onNavigate={goToPage}
      />
    </>
  );
}

function toPagination(data: CataloguePage<unknown>): Pagination {
  return { page: data.page, limit: data.limit, total: data.total, totalPages: data.totalPages };
}

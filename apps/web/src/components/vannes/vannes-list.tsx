"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { chipClass } from "@/components/ui/chip";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { PremiumModal } from "@/components/premium/premium-modal";
import { AuthCta } from "@/components/auth/auth-cta";
import { ListPagination } from "@/components/ui/list-pagination";
import Link from "next/link";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { useListPage } from "@/hooks/use-list-page";
// Limite gratuite : même constante que celle appliquée par /api/jokes.
import { FREE_JOKE_LIMIT } from "@/config/premium";
import type { CataloguePage } from "@/lib/list-pagination";

interface Joke {
  id: string;
  content: string;
  punchline: string;
  category: string;
  type: string;
  maturityLevel: number;
  // Décryptage pédagogique (Phase 1b) — nullable tant que la vanne n'est pas back-fillée
  comedyTechnique: string | null;
  techniqueExplanation: string | null;
  howToApply: string | null;
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

// Libellés du type de vanne (enum JokeType) : arbitrage Thomas s12 pour STORY et QA,
// les autres reprennent le mot de l'enum en casse normale (aucune valeur brute affichée).
const JOKE_TYPE_LABELS: Record<string, string> = {
  SUBTIL: "Subtil",
  CLASSIQUE: "Classique",
  ABSURDE: "Absurde",
  ONE_LINER: "One-liner",
  STORY: "Histoire",
  DIALOGUE: "Dialogue",
  QA: "Question / réponse",
};

const PUNCHLINE_TEASERS = [
  "Clique pour la chute",
  "Parie sur la chute, puis vérifie",
  "Celle-là, tu vas la ressortir",
  "Attention, chute en approche",
  "Tu la sens venir ?",
  "La chute est juste derrière",
  "À toi de jouer",
  "Devine d'abord, clique ensuite",
];


interface VannesListProps {
  /** Page rendue par le serveur (HTML crawlable, lot S1 s14). Null : chargement client seul. */
  initialData?: CataloguePage<Joke> | null;
  initialPage?: number;
}

export function VannesList({ initialData = null, initialPage = 1 }: VannesListProps = {}) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const { status: sessionStatus } = useSession();
  const isAnonymous = sessionStatus === "unauthenticated";
  const { page, goToPage, resetPage } = useListPage(initialPage);
  const [jokes, setJokes] = useState<Joke[]>(initialData?.items ?? []);
  const [pagination, setPagination] = useState<Pagination | null>(initialData ? toPagination(initialData) : null);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(!initialData);
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

    // Échec du rechargement de la vue rendue par le serveur (ex. robot sans accès
    // à /api/) : on garde la liste du serveur plutôt qu'un message d'erreur.
    const fallBackToServer = () => {
      if (initialData && page === initialData.page && !category && !searchQuery) {
        setJokes(initialData.items);
        setPagination(toPagination(initialData));
      } else {
        setError(true);
      }
    };

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
        fallBackToServer();
      }
    } catch {
      fallBackToServer();
    } finally {
      setIsLoading(false);
    }
  }, [category, page, searchQuery, initialData]);

  useEffect(() => {
    fetchJokes();
  }, [fetchJokes]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    resetPage();
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
      {/* Bandeau limite gratuite pour anonymes — clair et posé avant l'inscription */}
      {isAnonymous && (
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-accent-primary/30 bg-accent-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Aperçu gratuit : {FREE_JOKE_LIMIT} vannes accessibles sans compte.
            </p>
            <p className="text-xs text-text-secondary">
              Crée ton compte gratuit pour garder tes XP et commencer un parcours, ou passe à l&apos;accès complet à 2,99 €/mois : tout le catalogue, les filtres et les favoris.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col items-center gap-1 sm:flex-row sm:gap-4">
            <AuthCta label="Créer mon compte" size="sm" callbackUrl="/vannes" src="vannes" className="w-full sm:w-auto" />
            <Link
              href="/abonnement"
              className="inline-flex min-h-[44px] items-center text-sm font-medium text-accent-link hover:underline"
            >
              Tout débloquer
            </Link>
          </div>
        </div>
      )}

      {/* Filtres catégories avec ARIA — PREMIUM uniquement */}
      {limited ? (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-background-elevated/50 px-3 py-2">
          <svg className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm text-text-secondary">
            Filtres par catégorie disponibles avec l&apos;abonnement&nbsp;
            <Link href="/abonnement" className="inline-flex min-h-[44px] items-center font-medium text-accent-link hover:underline">Premium</Link>
          </p>
        </div>
      ) : (
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Catégories de vannes">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              role="tab"
              aria-selected={category === cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={chipClass(category === cat.value ? "active" : "idle")}
            >
              {cat.label}
            </button>
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
        // Page au-delà de l'aperçu gratuit : cartes verrouillées + offre (plus bas).
        limited && page > 1 ? null : <EmptyState
          emoji="😅"
          emojiLabel="pas de vannes"
          title="Rien dans cette catégorie pour l'instant, même pas un jeu de mots"
          description="Essaie une autre catégorie, on a forcément un truc pour toi."
          ctaLabel="Voir toutes les vannes"
          ctaHref="/vannes"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2" role="tabpanel">
          {jokes.map((joke, index) => (
            <Card
              key={joke.id}
              className="cursor-pointer transition-colors hover:bg-background-light animate-stagger-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => togglePunchline(joke.id)}
            >
              <CardContent className="pt-0">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">
                      {CATEGORY_LABELS[joke.category] ?? joke.category}
                    </Badge>
                    {/* Type masqué s'il est inconnu ou s'il répète la catégorie (ex. Absurde / Absurde) */}
                    {JOKE_TYPE_LABELS[joke.type] &&
                      JOKE_TYPE_LABELS[joke.type] !== (CATEGORY_LABELS[joke.category] ?? joke.category) && (
                        <Badge variant="default">{JOKE_TYPE_LABELS[joke.type]}</Badge>
                      )}
                  </div>
                  <div className="flex items-center">
                    <FavoriteButton contentType="JOKE" contentId={joke.id} />
                    <ShareButton title="Vanne - deviens-marrant.fr" text={`${joke.content}\n\n${joke.punchline}`} />
                  </div>
                </div>
                <p className="text-text-primary">{joke.content}</p>
                {revealedIds.has(joke.id) && (
                  <p
                    id={`punchline-${joke.id}`}
                    tabIndex={-1}
                    className="mt-3 font-semibold text-accent-link animate-fade-in focus:outline-none"
                  >
                    {joke.punchline}
                  </p>
                )}
                {revealedIds.has(joke.id) && (
                  <ReactionButtons jokeId={joke.id} className="mt-3" />
                )}
                {revealedIds.has(joke.id) && joke.comedyTechnique && (
                  <div
                    className="mt-4 rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4 animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
                      Pourquoi ça marche&nbsp;: {joke.comedyTechnique}
                    </p>
                    {joke.techniqueExplanation && (
                      <p className="mt-2 text-sm text-text-secondary">
                        {joke.techniqueExplanation}
                      </p>
                    )}
                    {joke.howToApply && (
                      <div className="mt-3 rounded-md border border-border bg-background-card p-3">
                        <p className="text-xs font-semibold text-text-primary">À toi de jouer</p>
                        <p className="mt-1 text-sm text-text-secondary">{joke.howToApply}</p>
                      </div>
                    )}
                    <p className="mt-3 text-xs text-text-muted">
                      Tu veux voir comment une vanne se construit, pièce par pièce ?{" "}
                      <Link
                        href="/anatomie-vanne"
                        className="font-medium text-accent-link hover:underline"
                      >
                        L&apos;anatomie d&apos;une vanne
                      </Link>
                    </p>
                  </div>
                )}
                {!revealedIds.has(joke.id) && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-[44px]"
                      aria-expanded={false}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePunchline(joke.id);
                        // Le bouton disparaît : le focus passe à la chute révélée.
                        requestAnimationFrame(() => document.getElementById(`punchline-${joke.id}`)?.focus());
                      }}
                    >
                      Révéler la chute
                    </Button>
                    <p className="text-sm text-text-muted">
                      {PUNCHLINE_TEASERS[index % PUNCHLINE_TEASERS.length]}
                    </p>
                  </div>
                )}
                <div className="mt-3 border-t border-border pt-2">
                  <Link
                    href={`/vannes/${buildJokeSlug(joke)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex min-h-[44px] items-center py-3 text-sm text-text-muted hover:text-accent-link hover:underline"
                    aria-label="Ouvrir la page dédiée de cette vanne"
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
      {limited && (jokes.length > 0 || page > 1) && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Array.from({ length: Math.min(4, Math.max(0, totalReal - jokes.length)) }).map((_, i) => (
            <Card
              key={`locked-${i}`}
              className="group relative cursor-pointer overflow-hidden border-dashed border-accent-primary/30 transition-all hover:border-accent-primary/60 hover:shadow-md"
              onClick={() => setPremiumOpen(true)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPremiumOpen(true); } }}
              aria-label="Contenu premium : cliquer pour débloquer"
            >
              <CardContent className="pt-0">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="default" className="opacity-50">Catégorie</Badge>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-4/5 rounded bg-text-muted/10" />
                  <div className="h-4 w-3/5 rounded bg-text-muted/10" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background-card/60 backdrop-blur-[2px] transition-colors group-hover:bg-background-card/40">
                  <div className="flex flex-col items-center gap-1.5">
                    <svg className="h-6 w-6 text-accent-link" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
            Accède à tout le catalogue dès 2,99 &euro;/mois
          </p>
          <Button variant="primary" size="sm" className="mt-3" onClick={() => setPremiumOpen(true)}>
            Voir l&apos;offre
          </Button>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} />

      {/* Pagination : vrais liens ?page=N (crawlables), navigation sans rechargement avec JS */}
      <ListPagination
        basePath="/vannes"
        page={page}
        totalPages={Math.max(
          pagination?.totalPages ?? 0,
          // Catalogue public complet (pages rendues par le serveur), hors filtre et recherche.
          !category && !searchQuery ? initialData?.totalPages ?? 0 : 0,
        )}
        onNavigate={goToPage}
      />
    </>
  );
}

function toPagination(data: CataloguePage<unknown>): Pagination {
  return { page: data.page, limit: data.limit, total: data.total, totalPages: data.totalPages };
}

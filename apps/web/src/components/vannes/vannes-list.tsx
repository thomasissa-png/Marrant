"use client";

import { frTypo } from "@/lib/fr-typo";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { chipClass } from "@/components/ui/chip";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { PremiumModalDiffere as PremiumModal } from "@/components/premium/premium-modal-differe";
import { ListPagination } from "@/components/ui/list-pagination";
import { ListResults } from "@/components/ui/list-results";
import Link from "next/link";
import { FLECHE_CARTE_LIEN, FLECHE_CARTE_PASTILLE } from "@/components/ui/liens";
import { buildJokeSlug } from "@/lib/catalogue-slug";
import { useListPage } from "@/hooks/use-list-page";
// Limite gratuite : même constante que celle appliquée par /api/jokes.
import { CARTE_VERROUILLEE_LABEL } from "@/config/textes/offre";
import { MurListe } from "@/components/premium/mur-liste";
import { useMurVu } from "@/components/premium/use-mur-vu";
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
  { value: "AUTODERISION", label: "Autodérision" },
  { value: "ABSURDE", label: "Absurde" },
  { value: "JEUX_DE_MOTS", label: "Jeux de mots" },
];

// Labels pour les badges individuels sur chaque carte (DB enum → label lisible)
const CATEGORY_LABELS: Record<string, string> = {
  AUTODERISION: "Autodérision",
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
  const { page, goToPage, resetPage, listRef, announce } = useListPage(initialPage);
  const [jokes, setJokes] = useState<Joke[]>(initialData?.items ?? []);
  const [pagination, setPagination] = useState<Pagination | null>(initialData ? toPagination(initialData) : null);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(!initialData);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [limited, setLimited] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [totalReal, setTotalReal] = useState(0);
  // Mur Premium visible (cartes verrouillées + offre) : mesuré une fois (audit s16).
  useMurVu(limited && (jokes.length > 0 || page > 1), "vannes");

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

  // Pages de la pagination (aussi annoncées après changement de page, ListResults).
  const totalPages = Math.max(
    pagination?.totalPages ?? 0,
    // Catalogue public complet (pages rendues par le serveur), hors filtre et recherche.
    !category && !searchQuery ? initialData?.totalPages ?? 0 : 0,
  );

  return (
    <>
      {/* Filtres catégories avec ARIA — PREMIUM uniquement */}
      {/* s21 B7 : plus de bandeau en haut ; la limite et les filtres Premium s'annoncent sous la liste (MurListeLimite). */}
      {limited ? null : (
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

      <ListResults ref={listRef} isLoading={isLoading || pagination?.page !== page} pending={isLoading && jokes.length > 0 && pagination?.page !== page} page={page} totalPages={totalPages} announce={announce}>
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
                {/* QA s21 tour 2 n2 : les pastilles passent à la ligne, les boutons ne rétrécissent pas ; plus de débordement à 320 px. */}
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <Badge variant="primary">
                      {CATEGORY_LABELS[joke.category] ?? joke.category}
                    </Badge>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <FavoriteButton contentType="JOKE" contentId={joke.id} />
                    <ShareButton title="Vanne - deviens-marrant.fr" text={`${joke.content}\n\n${joke.punchline}`} />
                  </div>
                </div>
                {/* Toucher l'amorce (ou la carte) révèle la chute : c'est le geste de la page. */}
                <p className="text-text-primary">{frTypo(joke.content)}</p>
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
                        className="font-medium text-accent-link underline underline-offset-2"
                      >
                        L&apos;anatomie d&apos;une vanne
                      </Link>
                    </p>
                  </div>
                )}
                {/* s21 : pied de carte. Le seul lien vers la fiche (explorable, même URL) est une flèche
                    discrète au coin inférieur droit, pour ne pas voler le geste de révélation ; elle ne
                    révèle pas la chute. Présente avant comme après la révélation. */}
                <div className="mt-3 flex items-end gap-2">
                  {!revealedIds.has(joke.id) && (
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
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
                  <Link
                    href={`/vannes/${buildJokeSlug(joke)}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`ml-auto shrink-0 ${FLECHE_CARTE_LIEN}`}
                    aria-label="Voir la fiche de cette vanne"
                  >
                    <span aria-hidden="true" className={FLECHE_CARTE_PASTILLE}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </ListResults>

      {/* s21 B7 : bloc de bas de liste (la limite en tête, revue visuelle s21), puis cartes floutées. */}
      {limited && (jokes.length > 0 || page > 1) && <MurListe liste="vannes" />}

      {/* Cartes verrouillées pour FREE users */}
      {/* Revue visuelle s21 : la carte floutée (une seule, concision v5) prend la colonne de la liste, comme le mur. */}
      {limited && (jokes.length > 0 || page > 1) && (
        <div className="mt-4 grid gap-4">
          {Array.from({ length: Math.min(1, Math.max(0, totalReal - jokes.length)) }).map((_, i) => (
            <Card
              key={`locked-${i}`}
              className="group relative cursor-pointer overflow-hidden border-dashed border-accent-primary/30 transition-all hover:border-accent-primary/60 hover:shadow-md"
              onClick={() => setPremiumOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPremiumOpen(true); } }}
              aria-label={CARTE_VERROUILLEE_LABEL}
            >
              <CardContent className="pt-0">
                <div className="mb-3 flex items-center gap-2">
                  {/* Gabarit décoratif sans texte : plus de texte à 50 % d'opacité (contraste axe, s16). */}
                  <div className="h-5 w-20 rounded-full bg-text-muted/10" aria-hidden="true" />
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} reason="carte" contenu="vanne" />

      {/* Pagination : vrais liens ?page=N (crawlables, présents dans le HTML du serveur), navigation
          sans rechargement avec JS. QA v4 m-5 : visiteur ou compte sans abonnement (liste limitée),
          plus de pagination, les pages suivantes sont vides : le mur fait office de fin. L'abonné la garde. */}
      {!limited && (
        <ListPagination
          basePath="/vannes"
          page={page}
          totalPages={totalPages}
          onNavigate={goToPage}
        />
      )}
    </>
  );
}

function toPagination(data: CataloguePage<unknown>): Pagination {
  return { page: data.page, limit: data.limit, total: data.total, totalPages: data.totalPages };
}

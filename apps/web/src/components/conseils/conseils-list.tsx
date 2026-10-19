"use client";

import { frTypo } from "@/lib/fr-typo";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { chipClass, RANGEE_CHIPS } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { isPremiumPlan } from "@/lib/parcours-access";
import { PremiumModalDiffere as PremiumModal } from "@/components/premium/premium-modal-differe";
import { useUserStore } from "@/stores/user-store";
import { showXpGain } from "@/components/ui/xp-notification";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { TITRE_CARTE_LIEN } from "@/components/ui/liens";
import { ListPagination } from "@/components/ui/list-pagination";
import { ListResults } from "@/components/ui/list-results";
import { buildTipSlug } from "@/lib/catalogue-slug";
import { useListPage } from "@/hooks/use-list-page";
import { MurListe } from "@/components/premium/mur-liste";
import { CarteFloutee } from "@/components/premium/carte-floutee";
import { useMurVu } from "@/components/premium/use-mur-vu";
import type { CataloguePage } from "@/lib/list-pagination";
import { contenuAffiche } from "@/lib/tip-prose";

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
  { value: "AUTODERISION", label: "Autodérision" },
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
  const { page, goToPage, resetPage, listRef, announce } = useListPage(initialPage);
  const [tips, setTips] = useState<Tip[]>(initialData?.items ?? []);
  const [pagination, setPagination] = useState<Pagination | null>(initialData ? toPagination(initialData) : null);
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(!initialData);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { data: session, status } = useSession();
  // XP = suivi de progression, Premium uniquement (s15 §1.1).
  const earnsXp =
    status === "authenticated" && isPremiumPlan((session?.user as { plan?: string } | undefined)?.plan);
  const addXp = useUserStore((s) => s.addXp);
  const [completedTipIds, setCompletedTipIds] = useState<Set<string>>(new Set());
  const [limited, setLimited] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [totalReal, setTotalReal] = useState(0);
  // Mur Premium visible (cartes verrouillées + offre) : mesuré une fois (audit s16).
  useMurVu(limited && (tips.length > 0 || page > 1), "conseils");

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
        if (earnsXp && !completedTipIds.has(id)) {
          setCompletedTipIds((prev) => new Set(prev).add(id));
          addXp(10, "tip_read");
          showXpGain(10);
        }
      }
      return next;
    });
  };

  // Pages de la pagination (aussi annoncées après changement de page, ListResults).
  const totalPages = Math.max(
    pagination?.totalPages ?? 0,
    // Catalogue public complet (pages rendues par le serveur), hors filtres et recherche.
    !difficulty && !category && !searchQuery ? initialData?.totalPages ?? 0 : 0,
  );

  return (
    <>
      {/* Filtres niveaux + catégories — PREMIUM uniquement */}
      {/* s21 B7 : plus de bandeau en haut ; la limite et les filtres Premium s'annoncent sous la liste (MurListeLimite). */}
      {limited ? null : (
        <>
          {/* Revue visuelle s21 (R03) : mêmes pastilles que /vannes, une ligne qui défile sous 768 px. */}
          <div className={cn("mb-3", RANGEE_CHIPS)} role="tablist" aria-label="Niveaux de difficulté">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                role="tab"
                aria-selected={difficulty === d.value}
                onClick={() => { setDifficulty(d.value); resetPage(); }}
                className={chipClass(difficulty === d.value ? "active" : "idle")}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className={cn("mb-6", RANGEE_CHIPS)} role="tablist" aria-label="Catégories de conseils">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={category === cat.value}
                onClick={() => { setCategory(cat.value); resetPage(); }}
                className={chipClass(category === cat.value ? "active" : "idle")}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </>
      )}

      <ListResults ref={listRef} isLoading={isLoading || pagination?.page !== page} pending={isLoading && tips.length > 0 && pagination?.page !== page} page={page} totalPages={totalPages} announce={announce}>
      {error ? (
        <ErrorState
          message="Les conseils se font désirer… comme une bonne chute."
          onRetry={fetchTips}
        />
      ) : showSkeleton ? (
        <div className="grid gap-4 lg:grid-cols-2">
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
          description="Change tes filtres, y’a plein de techniques qui t’attendent."
          ctaLabel="Voir tous les conseils"
          ctaHref="/conseils"
        />
      ) : (
        // Revue visuelle s21 (R01, T2-01, T3-04) : 2 colonnes dès 1 024 px, cartes de même hauteur par rangée.
        // Règle commune aux trois murs : un mur de 3 cartes passe en 3 colonnes dès que la largeur le permet
        // (conseils dès 1 280 px, vidéos dès 1 024 px), même anatomie pour les trois ; en deçà, une dernière
        // carte seule prend la rangée EN DISPOSITION HORIZONTALE, jamais une carte étirée à moitié vide.
        <div className={cn("grid gap-4 lg:grid-cols-2", tips.length === 3 && "xl:grid-cols-3")} role="tabpanel">
          {tips.map((tip, index) => (
            <Card
              key={tip.id}
              className={`flex h-full cursor-pointer flex-col p-5 transition-colors hover:bg-background-light animate-stagger-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary${
                tips.length % 2 === 1 && index === tips.length - 1
                  ? tips.length === 3
                    ? " lg:max-xl:col-span-2 lg:max-xl:grid lg:max-xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:max-xl:items-start lg:max-xl:gap-x-8"
                    : " lg:col-span-2 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-x-8"
                  : ""
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
              tabIndex={0}
              onClick={() => toggleExpanded(tip.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpanded(tip.id); } }}
            >
              <CardHeader>
                {/* QA s21 tour 2 n2 : les pastilles passent à la ligne, les boutons ne rétrécissent pas ; plus de débordement à 320 px. */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <Badge variant={DIFFICULTY_VARIANT[tip.difficulty] ?? "default"}>
                      {DIFFICULTIES.find((d) => d.value === tip.difficulty)?.label ?? tip.difficulty}
                    </Badge>
                    <Badge variant="default">
                      {CATEGORY_LABELS[tip.category] ?? tip.category}
                    </Badge>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <FavoriteButton contentType="TIP" contentId={tip.id} />
                    <ShareButton title={`${tip.title} - deviens-marrant.fr`} text={tip.content} />
                  </div>
                </div>
                {/* s21 : titre cliquable vers la fiche, seul lien de la carte (plus de « Page dédiée »). */}
                <CardTitle>
                  <Link
                    href={`/conseils/${buildTipSlug(tip)}`}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    // Revue visuelle s21 (décision 2) : cible de 44 px, marges négatives pour ne pas déplacer le
                    // titre ; le reste de la carte garde son geste (déplier le conseil, XP de lecture).
                    className={cn(TITRE_CARTE_LIEN, "-my-2.5 inline-flex min-h-11 items-center py-2.5")}
                  >
                    {frTypo(tip.title)}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                {/* T20 : conseil replié à 4 lignes, affiché en entier au dépliage (clic sur la carte). */}
                <p
                  className={`text-sm leading-relaxed text-text-primary${expandedIds.has(tip.id) ? "" : " line-clamp-4"}`}
                >
                  {contenuAffiche(tip.content)}
                </p>

                {expandedIds.has(tip.id) && (
                  <div className="mt-4 space-y-4 animate-fade-in">
                    <div className="rounded-lg bg-background-elevated p-4">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-link">Exemple</p>
                      <p className="text-sm leading-relaxed text-text-secondary">{contenuAffiche(tip.example)}</p>
                    </div>
                    {tip.exercise && (
                      <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-link">Exercice</p>
                        <p className="text-sm leading-relaxed text-text-secondary">{contenuAffiche(tip.exercise)}</p>
                      </div>
                    )}
                  </div>
                )}

                {!expandedIds.has(tip.id) && (
                  <p className="mt-auto pt-2 text-xs text-text-muted">
                    {frTypo(TIP_TEASERS[index % TIP_TEASERS.length])}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </ListResults>

      {/* s21 B7 : bloc de bas de liste (la limite en tête, revue visuelle s21), puis cartes floutées. */}
      {limited && (tips.length > 0 || page > 1) && <MurListe liste="conseils" />}

      {/* Carte floutée (une seule, concision v5) : même cadre sur les trois murs (revue visuelle s21, R10),
          sur toute la colonne de la liste, comme le mur au-dessus. */}
      {limited && (tips.length > 0 || page > 1) && (
        <div className="mt-4 grid">
          {Array.from({ length: Math.min(1, Math.max(0, totalReal - tips.length)) }).map((_, i) => (
            <CarteFloutee key={`locked-${i}`} onOuvrir={() => setPremiumOpen(true)} />
          ))}
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} reason="carte" contenu="conseil" />

      {/* Pagination : vrais liens ?page=N (crawlables, présents dans le HTML du serveur), navigation
          sans rechargement avec JS. QA v4 m-5 : visiteur ou compte sans abonnement (liste limitée),
          plus de pagination, les pages suivantes sont vides : le mur fait office de fin. L'abonné la garde. */}
      {!limited && (
        <ListPagination
          basePath="/conseils"
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

"use client";

import { contenuAffiche } from "@/lib/tip-prose";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { chipClass, RANGEE_CHIPS } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ShareButton } from "@/components/ui/share-button";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { PremiumModalDiffere as PremiumModal } from "@/components/premium/premium-modal-differe";
import Link from "next/link";
import { TITRE_CARTE_LIEN } from "@/components/ui/liens";
import { ListPagination } from "@/components/ui/list-pagination";
import { ListResults } from "@/components/ui/list-results";
import { buildVideoSlug } from "@/lib/catalogue-slug";
import { useListPage } from "@/hooks/use-list-page";
import { MurListe } from "@/components/premium/mur-liste";
import { CarteFloutee } from "@/components/premium/carte-floutee";
import { useMurVu } from "@/components/premium/use-mur-vu";
import type { CataloguePage } from "@/lib/list-pagination";
import { fixInvertedCase, splitLearning } from "@/lib/learning-format";

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
  AUTODERISION: "Autodérision",
  OBSERVATION: "Observation",
  REPARTIE: "Répartie",
  STORYTELLING: "Storytelling",
  ABSURDE: "Absurde",
  JEUX_DE_MOTS: "Jeux de mots",
};

/** « TITRE : explication » : titre en gras, explication à la suite. */
function renderLearning(raw: string) {
  const learning = fixInvertedCase(raw);
  const parts = splitLearning(learning);
  // Revue visuelle s21 (décision 4) : décryptages au rendu typographique (donnée intacte).
  if (!parts) return contenuAffiche(learning);
  return (
    <>
      <strong className="font-semibold text-text-primary">{contenuAffiche(parts.title)}</strong>
      {contenuAffiche(parts.rest)}
    </>
  );
}

// Blocs repliables des cartes (T21), même rendu que la vidéo du jour (daily-content.tsx).
const DETAILS_SUMMARY =
  "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider [&::-webkit-details-marker]:hidden";

function Chevron() {
  return (
    <svg className="h-4 w-4 shrink-0 transition-transform group-open/d:rotate-180" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

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

interface VideosGridProps {
  /** Page rendue par le serveur (HTML crawlable, lot S1 s14). Null : chargement client seul. */
  initialData?: CataloguePage<Video> | null;
  initialPage?: number;
}

export function VideosGrid({ initialData = null, initialPage = 1 }: VideosGridProps = {}) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const { page, goToPage, resetPage, listRef, announce } = useListPage(initialPage);
  const [videos, setVideos] = useState<Video[]>(initialData?.items ?? []);
  const [pagination, setPagination] = useState<Pagination | null>(initialData ? toPagination(initialData) : null);
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(!initialData);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState(false);
  const [limited, setLimited] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [totalReal, setTotalReal] = useState(0);
  // Mur Premium visible (cartes verrouillées + offre) : mesuré une fois (audit s16).
  useMurVu(limited && (videos.length > 0 || page > 1), "videos");
  // T21 : « Ce que tu vas apprendre » et « Exercice pratique » repliés sur mobile, ouverts dès md.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

    // Échec du rechargement de la vue rendue par le serveur (ex. robot sans accès
    // à /api/) : on garde la liste du serveur plutôt qu'un message d'erreur.
    const fallBackToServer = () => {
      if (initialData && page === initialData.page && !difficulty && !category && !searchQuery) {
        setVideos(initialData.items);
        setPagination(toPagination(initialData));
      } else {
        setError(true);
      }
    };

    try {
      const res = await fetch(`/api/videos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos);
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
    fetchVideos();
  }, [fetchVideos]);

  // Pages de la pagination (aussi annoncées après changement de page, ListResults).
  const totalPages = Math.max(
    pagination?.totalPages ?? 0,
    // Catalogue public complet (pages rendues par le serveur), hors filtres et recherche.
    !difficulty && !category && !searchQuery ? initialData?.totalPages ?? 0 : 0,
  );

  return (
    <>
      {/* Filtres niveau + catégorie — PREMIUM uniquement */}
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

          <div className={cn("mb-6", RANGEE_CHIPS)} role="tablist" aria-label="Catégories de vidéos">
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

      <ListResults ref={listRef} isLoading={isLoading || pagination?.page !== page} pending={isLoading && videos.length > 0 && pagination?.page !== page} page={page} totalPages={totalPages} announce={announce}>
      {error ? (
        <ErrorState message="Les vidéos ont pris un jour de congé." onRetry={fetchVideos} />
      ) : showSkeleton ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-0">
                <div className="mb-3 aspect-video rounded-lg bg-background-elevated" />
                <div className="h-4 w-3/4 rounded bg-background-elevated" />
                <div className="mt-2 h-3 w-1/2 rounded bg-background-elevated" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : videos.length === 0 ? (
        // Page au-delà de l'aperçu gratuit : cartes verrouillées + offre (plus bas).
        limited && page > 1 ? null : <EmptyState
          emoji="🎬"
          emojiLabel="pas de vidéos"
          title="Pas de vidéo ici… même les humoristes font des pauses"
          description="Essaie un autre niveau, y'a du lourd qui t'attend."
          ctaLabel="Voir toutes les vidéos"
          ctaHref="/videos"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="tabpanel">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className="flex flex-col overflow-hidden transition-colors hover:bg-background-light animate-stagger-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="flex flex-1 flex-col pt-0">
                <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-background-elevated">
                  <YouTubePlayer youtubeId={video.youtubeId} title={video.title} priority={index === 0} />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {/* s21 : titre cliquable vers la fiche, seul lien de la carte (plus de « Page dédiée »).
                        Revue visuelle s21 (décision 2) : le lien occupe les 48 px du titre (cible de 44 px). */}
                    <Link href={`/videos/${buildVideoSlug(video)}`} className={cn(TITRE_CARTE_LIEN, "line-clamp-2 min-h-12")}>
                      {video.title}
                    </Link>
                  </h3>
                  <div className="flex shrink-0 items-center">
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
                <p className="mt-2 text-sm text-text-muted line-clamp-2">{contenuAffiche(fixInvertedCase(video.description))}</p>
                {video.learnings && video.learnings.length > 0 && (
                  <details key={`l-${isDesktop}`} open={isDesktop} className="group/d mt-3 rounded-lg bg-background-elevated">
                    <summary className={`${DETAILS_SUMMARY} text-text-primary`}>
                      Ce que tu vas apprendre
                      <Chevron />
                    </summary>
                    <ul className="space-y-1.5 px-4 pb-4">
                      {video.learnings.map((learning, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-sm text-text-secondary">
                          <span className="mt-0.5 shrink-0 text-accent-link" aria-hidden="true">•</span>
                          <span>{renderLearning(learning)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                {video.exercise && (
                  // Revue visuelle s21 (R05) : le dernier encadré s'étire, bas des encadrés alignés d'une carte à l'autre.
                  <details key={`e-${isDesktop}`} open={isDesktop} className="group/d mt-2 flex-1 rounded-lg border border-accent-primary/20 bg-accent-primary/5">
                    <summary className={`${DETAILS_SUMMARY} text-accent-link`}>
                      Exercice pratique
                      <Chevron />
                    </summary>
                    <p className="px-4 pb-4 text-sm leading-relaxed text-text-secondary">{contenuAffiche(fixInvertedCase(video.exercise))}</p>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </ListResults>

      {/* s21 B7 : bloc de bas de liste (la limite en tête, revue visuelle s21), puis cartes floutées. */}
      {limited && (videos.length > 0 || page > 1) && <MurListe liste="videos" />}

      {/* Carte floutée (une seule, concision v5) : même cadre sur les trois murs (revue visuelle s21, R10),
          sur toute la colonne de la liste, comme le mur au-dessus. */}
      {limited && (videos.length > 0 || page > 1) && (
        <div className="mt-4 grid">
          {Array.from({ length: Math.min(1, Math.max(0, totalReal - videos.length)) }).map((_, i) => (
            <CarteFloutee key={`locked-${i}`} onOuvrir={() => setPremiumOpen(true)} />
          ))}
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal isOpen={premiumOpen} onClose={() => setPremiumOpen(false)} reason="carte" contenu="video" />

      {/* Pagination : vrais liens ?page=N (crawlables, présents dans le HTML du serveur), navigation
          sans rechargement avec JS. QA v4 m-5 : visiteur ou compte sans abonnement (liste limitée),
          plus de pagination, les pages suivantes sont vides : le mur fait office de fin. L'abonné la garde. */}
      {!limited && (
        <ListPagination
          basePath="/videos"
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

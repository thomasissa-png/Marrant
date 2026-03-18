"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useUserStore } from "@/stores/user-store";
import Link from "next/link";

type TabFilter = "ALL" | "JOKE" | "TIP" | "VIDEO";

const TABS: { value: TabFilter; label: string; emptyEmoji: string; emptyTitle: string; emptyDesc: string; ctaLabel: string; ctaHref: string }[] = [
  {
    value: "ALL",
    label: "Tout",
    emptyEmoji: "⭐",
    emptyTitle: "Aucun favori pour l'instant",
    emptyDesc: "Mets des vannes, conseils ou vidéos de côté — tu nous remercieras en soirée.",
    ctaLabel: "Explorer les vannes",
    ctaHref: "/vannes",
  },
  {
    value: "JOKE",
    label: "Vannes",
    emptyEmoji: "😅",
    emptyTitle: "Pas encore de vanne en favoris",
    emptyDesc: "Trouve ta prochaine punchline et garde-la ici pour la ressortir au bon moment.",
    ctaLabel: "Parcourir les vannes",
    ctaHref: "/vannes",
  },
  {
    value: "TIP",
    label: "Conseils",
    emptyEmoji: "🎓",
    emptyTitle: "Pas encore de conseil en favoris",
    emptyDesc: "Sauvegarde les techniques qui te parlent pour les travailler à ton rythme.",
    ctaLabel: "Découvrir les conseils",
    ctaHref: "/conseils",
  },
  {
    value: "VIDEO",
    label: "Vidéos",
    emptyEmoji: "🎬",
    emptyTitle: "Pas encore de vidéo en favoris",
    emptyDesc: "Garde tes vidéos préférées ici pour les revoir et t'en inspirer.",
    ctaLabel: "Explorer les vidéos",
    ctaHref: "/videos",
  },
];

const JOKE_CATEGORY_LABELS: Record<string, string> = {
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

const TIP_CATEGORY_LABELS: Record<string, string> = {
  TIMING: "Timing",
  AUTODERISION: "Auto-dérision",
  OBSERVATION: "Observation",
  REPARTIE: "Répartie",
  STORYTELLING: "Storytelling",
  ABSURDE: "Absurde",
  JEUX_DE_MOTS: "Jeux de mots",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  DEBUTANT: "Débutant",
  INTERMEDIAIRE: "Intermédiaire",
  EXPERT: "Expert",
};

const DIFFICULTY_VARIANT: Record<string, "secondary" | "primary" | "error"> = {
  DEBUTANT: "secondary",
  INTERMEDIAIRE: "primary",
  EXPERT: "error",
};

interface JokeData {
  content: string;
  punchline: string;
  category: string;
  type: string;
}

interface TipData {
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example: string;
  exercise: string;
}

interface VideoData {
  youtubeId: string;
  title: string;
  channelName: string;
  category: string;
  difficulty: string;
  description: string;
  technique: string;
  learnings: string[];
  exercise: string | null;
}

export function FavorisList() {
  const { status } = useSession();
  const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavoritesStore();
  const user = useUserStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");
  const [revealedJokes, setRevealedJokes] = useState<Set<string>>(new Set());
  const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === "authenticated") {
      fetchFavorites();
    }
  }, [status, fetchFavorites]);

  const toggleJokePunchline = (id: string) => {
    setRevealedJokes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTipExpanded = (id: string) => {
    setExpandedTips((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (status === "unauthenticated") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl" role="img" aria-label="cadenas">
            🔒
          </span>
          <p className="mt-4 text-lg font-medium text-text-primary">
            Connecte-toi pour retrouver tes p&#233;pites
          </p>
          <Link href="/login" className="mt-4">
            <Button variant="primary" size="sm">
              Se connecter
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (user?.plan !== "PREMIUM") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl" role="img" aria-label="étoile">
            ⭐
          </span>
          <p className="mt-4 text-lg font-medium text-text-primary">
            Les favoris sont r&#233;serv&#233;s aux membres Premium
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Passe &#224; l&apos;offre compl&#232;te pour sauvegarder tes vannes, conseils et vid&#233;os pr&#233;f&#233;r&#233;s.
          </p>
          <Link href="/#offres" className="mt-4">
            <Button variant="primary" size="sm">
              D&#233;couvrir l&apos;offre Premium
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const filtered =
    activeTab === "ALL"
      ? favorites
      : favorites.filter((f) => f.contentType === activeTab);

  // Count per type for tab badges
  const counts = {
    ALL: favorites.length,
    JOKE: favorites.filter((f) => f.contentType === "JOKE").length,
    TIP: favorites.filter((f) => f.contentType === "TIP").length,
    VIDEO: favorites.filter((f) => f.contentType === "VIDEO").length,
  };

  const currentTab = TABS.find((t) => t.value === activeTab) ?? TABS[0];

  return (
    <>
      {/* Tabs with counts */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Type de favoris">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "primary" : "ghost"}
            size="sm"
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
            {counts[tab.value] > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 text-xs ${activeTab === tab.value ? "bg-white/20" : "bg-accent-primary/20 text-accent-primary"}`}>
                {counts[tab.value]}
              </span>
            )}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-6">
                <div className="h-4 w-1/3 rounded bg-background-elevated" />
                <div className="mt-3 h-4 w-2/3 rounded bg-background-elevated" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <span className="text-4xl" role="img" aria-label="favoris vides">
              {currentTab.emptyEmoji}
            </span>
            <p className="mt-4 text-lg font-medium text-text-primary">
              {currentTab.emptyTitle}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {currentTab.emptyDesc}
            </p>
            <Link href={currentTab.ctaHref} className="mt-4">
              <Button variant="primary" size="sm">
                {currentTab.ctaLabel}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((fav) => {
            if (fav.contentType === "JOKE" && fav.joke) {
              const joke = fav.joke as unknown as JokeData;
              const isRevealed = revealedJokes.has(fav.id);
              return (
                <Card
                  key={fav.id}
                  className="cursor-pointer transition-colors hover:bg-background-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                  tabIndex={0}
                  onClick={() => toggleJokePunchline(fav.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleJokePunchline(fav.id); } }}
                >
                  <CardContent className="pt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="primary">Vanne</Badge>
                        <Badge variant="default">
                          {JOKE_CATEGORY_LABELS[joke.category] ?? joke.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShareButton
                          title="Vanne - deviens-marrant.fr"
                          text={`${joke.content}\n\n${joke.punchline}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id); }}
                          aria-label="Retirer des favoris"
                          className="text-text-muted hover:text-error"
                        >
                          Retirer
                        </Button>
                      </div>
                    </div>
                    <p className="text-text-primary">{joke.content}</p>
                    {isRevealed ? (
                      <>
                        <p className="mt-3 font-semibold text-accent-primary animate-fade-in">
                          {joke.punchline}
                        </p>
                        <ReactionButtons jokeId={fav.jokeId ?? ""} className="mt-3" />
                      </>
                    ) : (
                      <p className="mt-3 text-sm text-text-muted">
                        Clique pour la chute
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            }

            if (fav.contentType === "TIP" && fav.tip) {
              const tip = fav.tip as unknown as TipData;
              const isExpanded = expandedTips.has(fav.id);
              return (
                <Card
                  key={fav.id}
                  className="cursor-pointer transition-colors hover:bg-background-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                  tabIndex={0}
                  onClick={() => toggleTipExpanded(fav.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTipExpanded(fav.id); } }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Conseil</Badge>
                        <Badge variant={DIFFICULTY_VARIANT[tip.difficulty] ?? "default"}>
                          {DIFFICULTY_LABELS[tip.difficulty] ?? tip.difficulty}
                        </Badge>
                        <Badge variant="default">
                          {TIP_CATEGORY_LABELS[tip.category] ?? tip.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShareButton
                          title={`${tip.title} - deviens-marrant.fr`}
                          text={tip.content}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id); }}
                          aria-label="Retirer des favoris"
                          className="text-text-muted hover:text-error"
                        >
                          Retirer
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-text-primary">{tip.content}</p>

                    {isExpanded ? (
                      <div className="mt-4 space-y-4 animate-fade-in">
                        <div className="rounded-lg bg-background-elevated p-4">
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-primary">Exemple</p>
                          <p className="text-sm leading-relaxed text-text-secondary">{tip.example}</p>
                        </div>
                        <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-primary">Exercice</p>
                          <p className="text-sm leading-relaxed text-text-secondary">{tip.exercise}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-text-muted">
                        Ouvre pour l&apos;exemple et le d&#233;fi
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            }

            if (fav.contentType === "VIDEO" && fav.video) {
              const video = fav.video as unknown as VideoData;
              return (
                <Card key={fav.id} className="overflow-hidden">
                  <CardContent className="pt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Vidéo</Badge>
                        <Badge variant="default">
                          {TIP_CATEGORY_LABELS[video.category] ?? video.category}
                        </Badge>
                        {video.technique && video.technique.toLowerCase() !== (TIP_CATEGORY_LABELS[video.category] ?? video.category).toLowerCase() && (
                          <Badge variant="default">{video.technique}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <ShareButton
                          title={`${video.title} - deviens-marrant.fr`}
                          text={`${video.title} par ${video.channelName}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavorite(fav.id)}
                          aria-label="Retirer des favoris"
                          className="text-text-muted hover:text-error"
                        >
                          Retirer
                        </Button>
                      </div>
                    </div>
                    <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-background-elevated">
                      <YouTubePlayer youtubeId={video.youtubeId} title={video.title} />
                    </div>
                    <h3 className="font-display text-base font-bold text-text-primary">
                      {video.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">{video.channelName}</p>
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">{video.description}</p>
                    {video.learnings && video.learnings.length > 0 && (
                      <div className="mt-3 rounded-lg bg-background-elevated p-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-primary">Ce que tu vas apprendre</p>
                        <ul className="mt-1.5 space-y-1.5">
                          {video.learnings.map((learning, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-sm text-text-secondary">
                              <span className="mt-0.5 shrink-0 text-accent-primary" aria-hidden="true">•</span>
                              {learning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {video.exercise && (
                      <div className="mt-2 rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-primary">Exercice pratique</p>
                        <p className="text-sm leading-relaxed text-text-secondary">{video.exercise}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            }

            // Fallback for unknown content type
            return (
              <Card key={fav.id}>
                <CardContent className="flex items-center justify-between pt-4">
                  <Badge variant="default">Favori</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(fav.id)}
                    aria-label="Retirer des favoris"
                  >
                    Retirer
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

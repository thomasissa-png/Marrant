"use client";

import { frTypo } from "@/lib/fr-typo";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RANGEE_CHIPS } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ui/share-button";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { useFavoritesStore } from "@/stores/favorites-store";
import { contenuAffiche } from "@/lib/tip-prose";
import { useEstPremium } from "@/hooks/use-est-premium";
import Link from "next/link";
import { buildLoginUrl } from "@/lib/auth-links";
import { buildAbonnementUrl } from "@/lib/premium-return";
import { libelleToutOuvrir } from "@/config/textes/cta-articles-accueil";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";

type TabFilter = "ALL" | "JOKE" | "TIP" | "VIDEO";

const TABS: { value: TabFilter; label: string; emptyEmoji: string; emptyTitle: string; emptyDesc: string; ctaLabel: string; ctaHref: string }[] = [
  {
    value: "ALL",
    label: "Tout",
    emptyEmoji: "⭐",
    emptyTitle: "Aucun favori pour l’instant",
    emptyDesc: "Mets des vannes, conseils ou vidéos de côté : tu nous remercieras en soirée.",
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
    emptyDesc: "Garde tes vidéos préférées ici pour les revoir et t’en inspirer.",
    ctaLabel: "Explorer les vidéos",
    ctaHref: "/videos",
  },
];

const JOKE_CATEGORY_LABELS: Record<string, string> = {
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

const TIP_CATEGORY_LABELS: Record<string, string> = {
  TIMING: "Timing",
  AUTODERISION: "Autodérision",
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
  // Décryptage pédagogique (Phase 1b) — nullable tant que la vanne n'est pas back-fillée
  comedyTechnique?: string | null;
  techniqueExplanation?: string | null;
  howToApply?: string | null;
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
  const estPremium = useEstPremium();
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
          <Link href={buildLoginUrl({ callbackUrl: "/favoris" })} className="mt-4">
            <Button variant="primary" size="sm">
              Se connecter
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // s21 (QA M2) : plan lu dans la session, pas seulement dans le store (vide hors /profil).
  if (!estPremium) {
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
            Passe &#224; l’offre compl&#232;te pour sauvegarder tes vannes, conseils et vid&#233;os pr&#233;f&#233;r&#233;s.
          </p>
          {/* s21 (revue v2 m-1) : source `favoris`, suivie jusqu'à `checkout-ouvert` ; retour ici après paiement. */}
          <Link href={buildAbonnementUrl("/favoris", "monthly", "favoris")} className="mt-4">
            <Button variant="primary" size="sm" className="h-auto min-h-11 whitespace-normal py-2">
              {libelleToutOuvrir()}
            </Button>
          </Link>
          <p className="mt-2 text-xs text-text-muted">{REASSURANCE_UNIQUE}</p>
        </CardContent>
      </Card>
    );
  }

  const filtered =
    activeTab === "ALL"
      ? favorites
      : favorites.filter((f) => f.contentType === activeTab);
  const courts = filtered.filter((f) => f.contentType !== "VIDEO");
  const dernierCourtSeul = courts.length % 2 === 1 ? courts[courts.length - 1].id : null;

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
      {/* Revue visuelle s21 (T2-07) : une ligne qui défile sous 1 024 px (plus d'onglet seul sur la 2e ligne). */}
      <div className={cn("mb-6", RANGEE_CHIPS)} role="tablist" aria-label="Type de favoris">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "primary" : "ghost"}
            size="sm"
            className="shrink-0 snap-start whitespace-nowrap"
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
            {counts[tab.value] > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 text-xs ${activeTab === tab.value ? "bg-white/20" : "bg-accent-primary/20 text-accent-link"}`}>
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
        // Revue visuelle s21 (R02, T3-06) : dès 768 px, vannes et conseils sur 2 colonnes (rangées remplies
        // dans l'ordre, trous comblés), la vidéo sur toute la rangée avec sa vignette bornée à gauche.
        <div className="grid gap-4 md:grid-flow-row-dense md:grid-cols-2">
          {filtered.map((fav) => {
            // Nombre impair de vannes et conseils : le dernier prend la rangée (plus de demi-rangée vide).
            const seulSurSaRangee = fav.id === dernierCourtSeul ? " md:col-span-2" : "";
            if (fav.contentType === "JOKE" && fav.joke) {
              const joke = fav.joke as unknown as JokeData;
              const isRevealed = revealedJokes.has(fav.id);
              return (
                <Card
                  key={fav.id}
                  className={`cursor-pointer transition-colors hover:bg-background-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary${seulSurSaRangee}`}
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
                    <p className="text-text-primary">{frTypo(joke.content)}</p>
                    {isRevealed ? (
                      <>
                        <p className="mt-3 font-semibold text-accent-link animate-fade-in">
                          {joke.punchline}
                        </p>
                        <ReactionButtons jokeId={fav.jokeId ?? ""} className="mt-3" />
                        {joke.comedyTechnique && (
                          <div
                            className="mt-4 rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4 animate-fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-accent-link">
                              Pourquoi ça marche&nbsp;: {contenuAffiche(joke.comedyTechnique)}
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
                              Envie de comprendre la mécanique en profondeur ?{" "}
                              <Link
                                href="/anatomie-vanne"
                                className="font-medium text-accent-link underline underline-offset-2"
                              >
                                L’anatomie d’une vanne
                              </Link>
                            </p>
                          </div>
                        )}
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
                  className={`cursor-pointer transition-colors hover:bg-background-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary${seulSurSaRangee}`}
                  tabIndex={0}
                  onClick={() => toggleTipExpanded(fav.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleTipExpanded(fav.id); } }}
                >
                  <CardHeader>
                    {/* QA s21 tour 2 n2 : les pastilles passent à la ligne, les boutons ne rétrécissent pas ; plus de débordement à 320 px. */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <Badge variant="secondary">Conseil</Badge>
                        <Badge variant={DIFFICULTY_VARIANT[tip.difficulty] ?? "default"}>
                          {DIFFICULTY_LABELS[tip.difficulty] ?? tip.difficulty}
                        </Badge>
                        <Badge variant="default">
                          {TIP_CATEGORY_LABELS[tip.category] ?? tip.category}
                        </Badge>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
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
                    <CardTitle>{frTypo(tip.title)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-text-primary">{contenuAffiche(tip.content)}</p>

                    {isExpanded ? (
                      <div className="mt-4 space-y-4 animate-fade-in">
                        <div className="rounded-lg bg-background-elevated p-4">
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-link">Exemple</p>
                          <p className="text-sm leading-relaxed text-text-secondary">{contenuAffiche(tip.example)}</p>
                        </div>
                        <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-link">Exercice</p>
                          <p className="text-sm leading-relaxed text-text-secondary">{contenuAffiche(tip.exercise)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-text-muted">
                        Ouvre pour l’exemple et le d&#233;fi
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            }

            if (fav.contentType === "VIDEO" && fav.video) {
              const video = fav.video as unknown as VideoData;
              return (
                <Card key={fav.id} className="overflow-hidden md:col-span-2">
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
                    <div className="md:grid md:grid-cols-[minmax(0,300px)_1fr] md:items-start md:gap-5 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-6">
                    <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-background-elevated md:mb-0">
                      <YouTubePlayer youtubeId={video.youtubeId} title={video.title} />
                    </div>
                    <div className="max-w-prose">
                    <h3 className="font-display text-base font-bold text-text-primary">
                      {contenuAffiche(video.title)}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">{video.channelName}</p>
                    <p className="mt-2 text-sm text-text-muted line-clamp-2">{contenuAffiche(video.description)}</p>
                    </div>
                    {/* Revue visuelle s21 (T2-12) : encadrés sous la rangée vignette + texte, sur toute la carte
                        (plus de vide sous la vignette). */}
                    <div className="md:col-span-2">
                    {video.learnings && video.learnings.length > 0 && (
                      <div className="mt-3 rounded-lg bg-background-elevated p-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-text-primary">Ce que tu vas apprendre</p>
                        <ul className="mt-1.5 space-y-1.5">
                          {video.learnings.map((learning, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-sm text-text-secondary">
                              <span className="mt-0.5 shrink-0 text-accent-link" aria-hidden="true">•</span>
                              {contenuAffiche(learning)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {video.exercise && (
                      <div className="mt-2 rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4">
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-link">Exercice pratique</p>
                        <p className="text-sm leading-relaxed text-text-secondary">{contenuAffiche(video.exercise)}</p>
                      </div>
                    )}
                    </div>
                    </div>
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

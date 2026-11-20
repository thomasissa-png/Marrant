"use client";

import { ESPACE_CLIENT_PUBLIE } from "@/config/espace-client";
import { contenuAffiche } from "@/lib/tip-prose";
import { frTypo } from "@/lib/fr-typo";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { fixInvertedCase, splitLearning } from "@/lib/learning-format";
// s26 DA du site (décision de Thomas du 20/11) : classes et chevron partagés avec l'espace ouvert, rendu inchangé.
import { BANDEAU_ACCUEIL, BANDEAU_ACCUEIL_CENTRE, BANDEAU_ACCUEIL_INVERSE, BLOC_EXEMPLE, BLOC_EXERCICE, Chevron, DETAILS_SUMMARY } from "@/components/home/da-site";

interface Joke {
  id: string;
  content: string;
  punchline: string;
  category: string;
  // Décryptage pédagogique (Phase 1b) — nullable tant que la vanne n'est pas back-fillée
  comedyTechnique?: string | null;
  techniqueExplanation?: string | null;
  howToApply?: string | null;
}

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example?: string;
  exercise?: string;
}

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  category: string;
  technique: string;
  learnings: string[];
  exercise: string | null;
}

interface DailyData {
  joke: Joke | null;
  tip: Tip | null;
  video: Video | null;
}

// Labels alignés avec le regroupement des filtres vannes + conseils/vidéos
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

const TIP_VIDEO_CATEGORY_LABELS: Record<string, string> = {
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

/** Puce « TITRE : explication » : titre en gras (casse phrase), donnée non modifiée (design T12). */
function formatLearning(raw: string) {
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

export function DailyContent() {
  const [data, setData] = useState<DailyData>({ joke: null, tip: null, video: null });
  const [showPunchline, setShowPunchline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/daily")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData({ joke: json.joke, tip: json.tip, video: json.video ?? null });
      })
      .catch(() => {
        // Network error — keep default null state
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
          Ton contenu du jour
        </h2>
        <div className="-mx-4 flex snap-x snap-mandatory items-start gap-3 md:items-stretch overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[86%] shrink-0 snap-center animate-pulse rounded-xl border border-border bg-background-card p-6 md:w-auto md:p-4 lg:p-6"
            >
              <div className="mb-3 h-5 w-24 rounded bg-background-elevated" />
              <div className="h-4 w-3/4 rounded bg-background-elevated" />
              <div className="mt-2 h-4 w-1/2 rounded bg-background-elevated" />
              <div className="mt-4 h-10 w-full rounded bg-background-elevated" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <h2 id="contenu-du-jour-titre" className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
        Ton contenu du jour
      </h2>
      {/* Mobile (< 768 px) : carrousel horizontal (spec UX §2.8, T04) ; dès 768 px : grille de 3 (T2-06). Revue visuelle s21
          (verdict @design, décision 1) : cartes étirées, même haut et même bas, pied d'actions commun aligné.
          Zone défilante focusable et nommée (axe scrollable-region-focusable) : sans contenu
          du jour (/api/daily en échec), aucune carte n'a d'élément focusable. */}
      <div
        role="region"
        aria-labelledby="contenu-du-jour-titre"
        tabIndex={0}
        className={
          // Relecture des captures nav s24, tour 2 (design F5) : interrupteur de l'espace ouvert, cartes à la hauteur
          // de leur contenu (la « Vanne du jour » gardait 180 px vides au-dessus de son pied). Fermé : d'aujourd'hui.
          ESPACE_CLIENT_PUBLIE
            ? "-mx-4 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            : "-mx-4 flex snap-x snap-mandatory items-start gap-3 md:items-stretch overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        }
      >
        {/* Vanne du jour */}
        <div className="relative w-[86%] shrink-0 snap-center flex flex-col overflow-hidden rounded-xl border border-border bg-background-card md:w-auto">
          <div className={BANDEAU_ACCUEIL} />
          <div className="flex flex-1 flex-col gap-4 p-6 md:p-4 lg:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl" aria-hidden="true">😂</span>
              <Badge variant="primary">Vanne du jour</Badge>
              {data.joke && (
                <Badge variant="default">
                  {JOKE_CATEGORY_LABELS[data.joke.category] ?? data.joke.category}
                </Badge>
              )}
            </div>
            {data.joke ? (
              <>
                <div className="flex flex-1 flex-col gap-4">
                  <p className="text-xl font-medium leading-7 text-text-primary">{contenuAffiche(data.joke.content)}</p>
                  {showPunchline ? (
                    <p className="rounded-lg bg-accent-primary/10 p-3 text-lg font-semibold text-accent-link animate-fade-in">
                      {contenuAffiche(data.joke.punchline)}
                    </p>
                  ) : (
                    <Button
                      variant="outline-accent"
                      size="lg"
                      className="min-h-12 w-full"
                      onClick={() => setShowPunchline(true)}
                    >
                      Révéler la chute
                    </Button>
                  )}
                </div>
                {showPunchline && data.joke.comedyTechnique && (
                  <div className="rounded-lg border border-accent-primary/20 bg-accent-primary/5 p-4 animate-fade-in">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
                      Pourquoi ça marche&nbsp;: {contenuAffiche(data.joke.comedyTechnique)}
                    </p>
                    {data.joke.techniqueExplanation && (
                      <p className="mt-2 text-sm text-text-secondary">
                        {contenuAffiche(data.joke.techniqueExplanation)}
                      </p>
                    )}
                    {data.joke.howToApply && (
                      <div className="mt-3 rounded-md border border-border bg-background-card p-3">
                        <p className="text-xs font-semibold text-text-primary">À toi de jouer</p>
                        <p className="mt-1 text-sm text-text-secondary">{contenuAffiche(data.joke.howToApply)}</p>
                      </div>
                    )}
                    <p className="mt-3 text-xs text-text-muted">
                      Tu veux voir comment une vanne se construit, pièce par pièce ?{" "}
                      <Link
                        href="/anatomie-vanne"
                        className="font-medium text-accent-link underline underline-offset-2"
                      >
                        L’anatomie d’une vanne
                      </Link>
                    </p>
                  </div>
                )}
                <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
                  <ReactionButtons jokeId={data.joke.id} />
                  <span className="flex-1" aria-hidden="true" />
                  <ShareButton
                    title="Vanne du jour · deviens-marrant.fr"
                    text={`${data.joke.content}\n${data.joke.punchline}`}
                  />
                  <FavoriteButton contentType="JOKE" contentId={data.joke.id} apercu={data.joke.content} />
                </div>
              </>
            ) : (
              <p className="text-text-secondary">Même l’humour prend un jour off. Reviens demain pour ta dose !</p>
            )}
          </div>
        </div>

        {/* Conseil du jour */}
        <div className="relative w-[86%] shrink-0 snap-center flex flex-col overflow-hidden rounded-xl border border-border bg-background-card md:w-auto">
          <div className={BANDEAU_ACCUEIL_INVERSE} />
          <div className="flex flex-1 flex-col gap-4 p-6 md:p-4 lg:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl" aria-hidden="true">💡</span>
              <Badge variant="primary">Conseil du jour</Badge>
              {data.tip && (
                <>
                  <Badge variant="secondary">
                    {DIFFICULTY_LABELS[data.tip.difficulty] ?? data.tip.difficulty}
                  </Badge>
                  <Badge variant="default">
                    {TIP_VIDEO_CATEGORY_LABELS[data.tip.category] ?? data.tip.category}
                  </Badge>
                </>
              )}
            </div>
            {data.tip ? (
              <>
                <div className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-text-primary">
                    {frTypo(data.tip.title)}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-primary">{contenuAffiche(data.tip.content)}</p>
                  {data.tip.example && (
                    <details className={`group/d ${BLOC_EXEMPLE}`}>
                      <summary className={DETAILS_SUMMARY}>
                        Exemple concret
                        <Chevron />
                      </summary>
                      <p className="px-4 pb-4 text-sm leading-relaxed text-text-secondary">{contenuAffiche(data.tip.example)}</p>
                    </details>
                  )}
                  {data.tip.exercise && (
                    <details className={`group/d ${BLOC_EXERCICE}`}>
                      <summary className={DETAILS_SUMMARY}>
                        Exercice du jour
                        <Chevron />
                      </summary>
                      <p className="px-4 pb-4 text-sm leading-relaxed text-text-secondary">{contenuAffiche(data.tip.exercise)}</p>
                    </details>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-4">
                  <ShareButton
                    title="Conseil du jour · deviens-marrant.fr"
                    text={`${data.tip.title}\n${data.tip.content}`}
                  />
                  <FavoriteButton contentType="TIP" contentId={data.tip.id} apercu={data.tip.title} />
                </div>
              </>
            ) : (
              <p className="text-text-secondary">Le conseil du jour s’est attardé à la machine à café. Il revient demain, avec des anecdotes.</p>
            )}
          </div>
        </div>

        {/* Vidéo du jour */}
        <div className="relative w-[86%] shrink-0 snap-center flex flex-col overflow-hidden rounded-xl border border-border bg-background-card md:w-auto">
          <div className={BANDEAU_ACCUEIL_CENTRE} />
          <div className="flex flex-1 flex-col gap-4 p-6 md:p-4 lg:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🎬</span>
              <Badge variant="primary">Vidéo du jour</Badge>
              {data.video && (
                <>
                  <Badge variant="default">
                    {TIP_VIDEO_CATEGORY_LABELS[data.video.category] ?? data.video.category}
                  </Badge>
                  {data.video.technique &&
                    data.video.technique.toLowerCase() !== (TIP_VIDEO_CATEGORY_LABELS[data.video.category] ?? data.video.category).toLowerCase() && (
                    <Badge variant="default">{data.video.technique}</Badge>
                  )}
                </>
              )}
            </div>
            {data.video ? (
              <>
                <div className="space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-background-elevated">
                    <YouTubePlayer youtubeId={data.video.youtubeId} title={data.video.title} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-text-primary line-clamp-2">{contenuAffiche(data.video.title)}</h3>
                    <p className="mt-0.5 text-sm text-text-secondary">{data.video.channelName}</p>
                  </div>
                  {data.video.learnings && data.video.learnings.length > 0 && (
                    <details className={`group/d ${BLOC_EXEMPLE}`}>
                      <summary className={DETAILS_SUMMARY}>
                        Ce que tu vas apprendre
                        <Chevron />
                      </summary>
                      <ul className="space-y-1.5 px-4 pb-4">
                        {data.video.learnings.slice(0, 2).map((learning, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm text-text-secondary">
                            <span className="mt-0.5 shrink-0 text-accent-link" aria-hidden="true">•</span>
                            <span>{formatLearning(learning)}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                  {data.video.exercise && (
                    <details className={`group/d ${BLOC_EXERCICE}`}>
                      <summary className={DETAILS_SUMMARY}>
                        Exercice pratique
                        <Chevron />
                      </summary>
                      <p className="px-4 pb-4 text-sm leading-relaxed text-text-secondary">{contenuAffiche(fixInvertedCase(data.video.exercise))}</p>
                    </details>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-4">
                  <ShareButton
                    title="Vidéo du jour · deviens-marrant.fr"
                    text={`${data.video.title} · ${data.video.channelName}`}
                  />
                  <FavoriteButton contentType="VIDEO" contentId={data.video.id} apercu={data.video.title} />
                </div>
              </>
            ) : (
              <p className="text-text-secondary">L’humoriste du jour est en coulisses. À demain !</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { contenuAffiche } from "@/lib/tip-prose";
import { frTypo } from "@/lib/fr-typo";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { MARGE_ENCADRE } from "@/components/layout/gabarit";
import { fixInvertedCase, splitLearning } from "@/lib/learning-format";

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

/*
 * Cartes du jour (docs/design/cartes-du-jour/diagnostic-et-spec.md) : même squelette sur les 3 cartes
 * (barre dégradée, en-tête, corps, pied), hauteur naturelle, aucune carte étirée par ses voisines (§2.8).
 */

/** Grille : pile d'une colonne sous 1024 px (576 px centrée dès 768 px), 3 colonnes alignées en haut ensuite (§2.2). */
const GRILLE = "grid gap-4 md:mx-auto md:max-w-xl md:gap-6 lg:max-w-none lg:grid-cols-3 lg:items-start";

const CARTE = "relative flex flex-col overflow-hidden rounded-xl border border-border bg-background-card";

const CORPS_CARTE = `flex flex-col gap-4 ${MARGE_ENCADRE}`;

/**
 * Emplacement pointillé de la chute (§2.4) : exception assumée à la règle « outline-accent unique » de
 * `button.tsx`, c'est un contrôle de révélation, pas une action d'entrée dans le produit.
 */
const CHUTE_EMPLACEMENT =
  "flex min-h-[72px] w-full items-center justify-center gap-3 rounded-lg border border-dashed border-accent-primary/80 bg-accent-primary/5 px-4 text-base font-semibold text-text-primary transition-colors duration-150 hover:border-accent-primary hover:bg-accent-primary/10 active:bg-accent-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background-card";

const CHUTE_REVELEE =
  "min-h-[72px] rounded-lg border border-accent-primary/40 bg-accent-primary/10 p-4 animate-slide-up motion-reduce:animate-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link";

/** Accordéons : un seul style pour les 6 (§2.7), cible 44 px (T04). */
const ACCORDEON = "group/d rounded-lg border border-border bg-background-elevated open:border-border-hover";

const ACCORDEON_TITRE =
  "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-semibold text-text-primary [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link";

const ACCORDEON_CORPS = "px-4 pb-4 text-sm leading-6 text-text-secondary";

const TITRE_CARTE = "font-display text-lg font-bold leading-7 text-text-primary [text-wrap:pretty]";

function Chevron() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-accent-link transition-transform duration-150 motion-reduce:transition-none group-open/d:rotate-180"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function Oeil() {
  return (
    <svg className="h-5 w-5 shrink-0 text-accent-link" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function Accordeon({ titre, children }: { titre: ReactNode; children: ReactNode }) {
  return (
    <details className={ACCORDEON}>
      <summary className={ACCORDEON_TITRE}>
        {titre}
        <Chevron />
      </summary>
      {children}
    </details>
  );
}

/** En-tête identique sur les 3 cartes (§2.3) : emoji + type, puis pastilles neutres s'il y en a. */
function EnTete({ emoji, type, children }: { emoji: string; type: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xl leading-7" aria-hidden="true">{emoji}</span>
        <p className="text-sm font-semibold leading-5 text-text-primary">{type}</p>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

/** Pied identique sur les 3 cartes (§2.6) : réactions à gauche (Vanne seulement), partage puis favori à droite. */
function Pied({ gauche, children }: { gauche?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-[44px] items-center justify-between gap-2 border-t border-border pt-3">
      {gauche}
      <div className="ml-auto flex items-center gap-1">{children}</div>
    </div>
  );
}

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

/** Nom de chaîne masqué (affichage seul) quand le titre commence déjà par lui (§2.5, m11). */
function chaineRedondante(title: string, channelName: string) {
  return title.trim().toLowerCase().startsWith(channelName.trim().toLowerCase());
}

export function DailyContent() {
  const [data, setData] = useState<DailyData>({ joke: null, tip: null, video: null });
  const [showPunchline, setShowPunchline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const chuteRef = useRef<HTMLDivElement>(null);

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

  // La chute remplace le bouton au même endroit : le focus clavier la suit (§2.4, M17).
  useEffect(() => {
    if (showPunchline) chuteRef.current?.focus();
  }, [showPunchline]);

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <h2 className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
          Ton contenu du jour
        </h2>
        <div className={GRILLE}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`min-h-[360px] animate-pulse rounded-xl border border-border bg-background-card ${MARGE_ENCADRE}`}
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

  const videoCategory = data.video ? (TIP_VIDEO_CATEGORY_LABELS[data.video.category] ?? data.video.category) : "";

  return (
    <section aria-labelledby="contenu-du-jour-titre" className="py-12 md:py-16">
      <h2 id="contenu-du-jour-titre" className="font-display mb-8 text-center text-3xl font-bold md:text-4xl">
        Ton contenu du jour
      </h2>
      <div className={GRILLE}>
        {/* Vanne du jour */}
        <div className={CARTE}>
          <div className="h-1 bg-gradient-to-r from-accent-primary to-accent-secondary" />
          <div className={CORPS_CARTE}>
            <EnTete emoji="😂" type="Vanne du jour">
              {data.joke && (
                <Badge variant="default">
                  {JOKE_CATEGORY_LABELS[data.joke.category] ?? data.joke.category}
                </Badge>
              )}
            </EnTete>
            {data.joke ? (
              <>
                <div className="flex flex-col gap-3">
                  <p className="text-xl font-medium leading-7 text-text-primary [text-wrap:pretty] xl:text-2xl xl:leading-8">
                    {contenuAffiche(data.joke.content)}
                  </p>
                  <div id="chute-du-jour" aria-live="polite">
                    {showPunchline ? (
                      <div ref={chuteRef} tabIndex={-1} className={CHUTE_REVELEE}>
                        <p className="text-xl font-semibold leading-7 text-text-primary xl:text-2xl xl:leading-8">
                          {contenuAffiche(data.joke.punchline)}
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-expanded="false"
                        aria-controls="chute-du-jour"
                        className={CHUTE_EMPLACEMENT}
                        onClick={() => setShowPunchline(true)}
                      >
                        <Oeil />
                        Révéler la chute
                      </button>
                    )}
                  </div>
                </div>
                {/* Décision D1 : décryptage fermé par défaut, à un tap sous la chute. */}
                {showPunchline && data.joke.comedyTechnique && (
                  <Accordeon
                    titre={
                      <span className="flex flex-col">
                        <span>Pourquoi ça marche</span>
                        <span className="text-sm font-normal text-text-secondary">
                          {contenuAffiche(data.joke.comedyTechnique)}
                        </span>
                      </span>
                    }
                  >
                    <div className={ACCORDEON_CORPS}>
                      {data.joke.techniqueExplanation && <p>{contenuAffiche(data.joke.techniqueExplanation)}</p>}
                      <div className="mt-3 border-t border-border pt-3">
                        {data.joke.howToApply && (
                          <>
                            <p className="text-sm font-semibold text-text-primary">À toi de jouer</p>
                            <p>{contenuAffiche(data.joke.howToApply)}</p>
                          </>
                        )}
                        <p className={data.joke.howToApply ? "mt-3" : undefined}>
                          Tu veux voir comment une vanne se construit, pièce par pièce ?{" "}
                          <Link
                            href="/anatomie-vanne"
                            className="font-medium text-accent-link underline underline-offset-2"
                          >
                            L’anatomie d’une vanne
                          </Link>
                        </p>
                      </div>
                    </div>
                  </Accordeon>
                )}
                <Pied gauche={<ReactionButtons jokeId={data.joke.id} />}>
                  <ShareButton
                    title="Vanne du jour · deviens-marrant.fr"
                    text={`${data.joke.content}\n${data.joke.punchline}`}
                  />
                  <FavoriteButton contentType="JOKE" contentId={data.joke.id} apercu={data.joke.content} />
                </Pied>
              </>
            ) : (
              <p className="text-text-secondary">Même l’humour prend un jour off. Reviens demain pour ta dose !</p>
            )}
          </div>
        </div>

        {/* Conseil du jour */}
        <div className={CARTE}>
          <div className="h-1 bg-gradient-to-r from-accent-secondary to-accent-primary" />
          <div className={CORPS_CARTE}>
            <EnTete emoji="💡" type="Conseil du jour">
              {data.tip && (
                <>
                  <Badge variant="default">
                    {DIFFICULTY_LABELS[data.tip.difficulty] ?? data.tip.difficulty}
                  </Badge>
                  <Badge variant="default">
                    {TIP_VIDEO_CATEGORY_LABELS[data.tip.category] ?? data.tip.category}
                  </Badge>
                </>
              )}
            </EnTete>
            {data.tip ? (
              <>
                <h3 className={TITRE_CARTE}>{frTypo(data.tip.title)}</h3>
                <p className="text-sm leading-6 text-text-primary">{contenuAffiche(data.tip.content)}</p>
                {(data.tip.example || data.tip.exercise) && (
                  <div className="flex flex-col gap-2">
                    {data.tip.example && (
                      <Accordeon titre="Exemple concret">
                        <p className={ACCORDEON_CORPS}>{contenuAffiche(data.tip.example)}</p>
                      </Accordeon>
                    )}
                    {data.tip.exercise && (
                      <Accordeon titre="Exercice du jour">
                        <p className={ACCORDEON_CORPS}>{contenuAffiche(data.tip.exercise)}</p>
                      </Accordeon>
                    )}
                  </div>
                )}
                <Pied>
                  <ShareButton
                    title="Conseil du jour · deviens-marrant.fr"
                    text={`${data.tip.title}\n${data.tip.content}`}
                  />
                  <FavoriteButton contentType="TIP" contentId={data.tip.id} apercu={data.tip.title} />
                </Pied>
              </>
            ) : (
              <p className="text-text-secondary">Le conseil du jour s’est attardé à la machine à café. Il revient demain, avec des anecdotes.</p>
            )}
          </div>
        </div>

        {/* Vidéo du jour */}
        <div className={CARTE}>
          <div className="h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
          <div className={CORPS_CARTE}>
            <EnTete emoji="🎬" type="Vidéo du jour">
              {data.video && (
                <>
                  <Badge variant="default">{videoCategory}</Badge>
                  {data.video.technique && data.video.technique.toLowerCase() !== videoCategory.toLowerCase() && (
                    <Badge variant="default">{data.video.technique}</Badge>
                  )}
                </>
              )}
            </EnTete>
            {data.video ? (
              <>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-background-elevated">
                  <YouTubePlayer youtubeId={data.video.youtubeId} title={data.video.title} />
                </div>
                <div>
                  <h3 className={`${TITRE_CARTE} line-clamp-3`}>{contenuAffiche(data.video.title)}</h3>
                  {!chaineRedondante(data.video.title, data.video.channelName) && (
                    <p className="mt-1 text-sm text-text-secondary">{data.video.channelName}</p>
                  )}
                </div>
                {((data.video.learnings && data.video.learnings.length > 0) || data.video.exercise) && (
                  <div className="flex flex-col gap-2">
                    {data.video.learnings && data.video.learnings.length > 0 && (
                      <Accordeon titre="Ce que tu vas apprendre">
                        <ul className={`space-y-1.5 ${ACCORDEON_CORPS}`}>
                          {data.video.learnings.slice(0, 2).map((learning, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="shrink-0 text-accent-link" aria-hidden="true">•</span>
                              <span>{formatLearning(learning)}</span>
                            </li>
                          ))}
                        </ul>
                      </Accordeon>
                    )}
                    {data.video.exercise && (
                      <Accordeon titre="Exercice pratique">
                        <p className={ACCORDEON_CORPS}>{contenuAffiche(fixInvertedCase(data.video.exercise))}</p>
                      </Accordeon>
                    )}
                  </div>
                )}
                <Pied>
                  <ShareButton
                    title="Vidéo du jour · deviens-marrant.fr"
                    text={`${data.video.title} · ${data.video.channelName}`}
                  />
                  <FavoriteButton contentType="VIDEO" contentId={data.video.id} apercu={data.video.title} />
                </Pied>
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

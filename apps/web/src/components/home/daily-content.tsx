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
import { Clapperboard, Eye, Laugh, Lightbulb } from "lucide-react";
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
 * Cartes du jour (docs/design/cartes-du-jour/diagnostic-et-spec.md, spec v2) : même squelette sur les
 * 3 cartes (barre dégradée, en-tête, corps, pied). Pile d'une colonne sous 1280 px ; dès 1280 px, 3 cartes
 * de même hauteur, pieds alignés, groupe de la Vanne centré verticalement et immobile au clic (V2.2).
 */

/** Grille : pile de 576 px centrée sous 1280 px, 3 colonnes de même hauteur ensuite (V2.1). */
const GRILLE = "mx-auto grid max-w-xl gap-4 md:gap-6 xl:max-w-none xl:grid-cols-3 xl:items-stretch";

const CARTE = "relative flex flex-col overflow-hidden rounded-xl border border-border-hover bg-background-card xl:h-full";

const CORPS_CARTE = `flex flex-1 flex-col gap-4 ${MARGE_ENCADRE}`;

/** H2 et h3 de la section : espace entre les mots de la police display élargi (« dujour », V2.4). */
const ESPACE_MOTS = "[word-spacing:0.08em]";

/**
 * Emplacement pointillé de la chute (§2.4, V2.6) : exception assumée à la règle « outline-accent unique »
 * de `button.tsx`, c'est un contrôle de révélation, pas une action d'entrée dans le produit.
 */
const CHUTE_EMPLACEMENT =
  "col-start-1 row-start-1 flex min-h-[72px] w-full items-center justify-center gap-3 rounded-lg border-[1.5px] border-dashed border-accent-primary/90 bg-accent-primary/10 px-4 text-base font-semibold text-text-primary transition-colors duration-150 hover:border-accent-primary hover:bg-accent-primary/15 active:bg-accent-primary/20 focus-visible:border-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background-card";

/** Boîte de la chute, partagée par la chute révélée et son clone invisible (même hauteur, V2.2 a). */
const CHUTE_BOITE = "col-start-1 row-start-1 min-h-[72px] rounded-lg border-[1.5px] border-solid border-accent-primary/60 bg-accent-primary/10 p-4";

const CHUTE_REVELEE = `${CHUTE_BOITE} animate-slide-up motion-reduce:animate-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link`;

const CHUTE_TEXTE = "text-xl font-semibold leading-7 text-text-primary [text-wrap:balance] md:text-2xl md:leading-8";

/** Accordéons : un seul style et un seul format d'en-tête pour les 6 (§2.7, V2.6), cible 44 px (T04). */
const ACCORDEON = "group/d rounded-lg border border-transparent bg-background-elevated open:border-border-hover";

const ACCORDEON_TITRE =
  "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-semibold text-text-primary [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link";

const ACCORDEON_CORPS = "px-4 pb-4 text-sm leading-6 text-text-primary";

const TITRE_CARTE = `font-display text-lg font-bold leading-6 text-text-primary [text-wrap:balance] ${ESPACE_MOTS}`;

/** Icônes d'en-tête et de l'emplacement de la chute (Lucide, V2.6). */
const ICONE = { size: 20, strokeWidth: 1.75, "aria-hidden": true, className: "shrink-0 text-accent-link" } as const;

const ESPACES_INTERIEURS = new Set([" ", String.fromCharCode(0xa0), String.fromCharCode(0x202f)]);

/**
 * Guillemets imbriqués au rendu (V2.5) : un « … » dans un « … » s'affiche en “…”, sans les espaces
 * insécables que `frTypo` pose à l'intérieur. Compteur de profondeur borné à 0 ; donnée intacte.
 */
export function guillemetsImbriques(texte: string): string {
  if (!texte.includes("«")) return texte;
  let profondeur = 0;
  let sortie = "";
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (c === "«") {
      profondeur++;
      if (profondeur >= 2) {
        sortie += "“";
        while (i + 1 < texte.length && ESPACES_INTERIEURS.has(texte[i + 1])) i++;
        continue;
      }
    } else if (c === "»") {
      if (profondeur >= 2) {
        while (sortie.length > 0 && ESPACES_INTERIEURS.has(sortie[sortie.length - 1])) sortie = sortie.slice(0, -1);
        sortie += "”";
        profondeur--;
        continue;
      }
      profondeur = Math.max(0, profondeur - 1);
    }
    sortie += c;
  }
  return sortie;
}

/** Texte d'une donnée de la section : rendu typographique commun, puis guillemets imbriqués. */
function affiche(texte: string): string {
  return guillemetsImbriques(contenuAffiche(texte));
}

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

function Accordeon({ titre, children, className = "", masque = false }: { titre: string; children: ReactNode; className?: string; masque?: boolean }) {
  return (
    <details className={`${ACCORDEON} ${className}`} aria-hidden={masque || undefined}>
      <summary className={ACCORDEON_TITRE}>
        {titre}
        <Chevron />
      </summary>
      {children}
    </details>
  );
}

/** En-tête identique sur les 3 cartes (§2.3) : icône + type, puis pastilles neutres s'il y en a. */
function EnTete({ icone, type, children }: { icone: ReactNode; type: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icone}
        <p className="text-sm font-semibold leading-5 text-text-primary">{type}</p>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

/** Pied identique sur les 3 cartes (§2.6) : réactions à gauche (Vanne seulement), partage puis favori à droite. */
function Pied({ gauche, children }: { gauche?: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-auto flex min-h-[44px] items-center justify-between gap-2 border-t border-border-hover pt-3">
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
  if (!parts) return affiche(learning);
  return (
    <>
      <strong className="font-semibold text-text-primary">{affiche(parts.title)}</strong>
      {affiche(parts.rest)}
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
  const [conseilTronque, setConseilTronque] = useState(false);
  const [conseilDeplie, setConseilDeplie] = useState(false);
  const chuteRef = useRef<HTMLDivElement>(null);
  const conseilRef = useRef<HTMLParagraphElement>(null);

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

  // « Lire la suite » seulement si le texte du conseil est réellement tronqué (V2.3).
  useEffect(() => {
    const el = conseilRef.current;
    if (!el || conseilDeplie) return;
    const mesurer = () => setConseilTronque(el.scrollHeight > el.clientHeight + 1);
    mesurer();
    document.fonts?.ready.then(mesurer).catch(() => {});
    if (typeof ResizeObserver === "undefined") return;
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(el);
    return () => observateur.disconnect();
  }, [data.tip, isLoading, conseilDeplie]);

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <h2 className={`font-display mb-8 text-center text-3xl font-bold max-[359px]:text-2xl md:text-4xl ${ESPACE_MOTS}`}>
          Ton contenu du jour
        </h2>
        <div className={GRILLE}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`min-h-[360px] animate-pulse rounded-xl border border-border-hover bg-background-card ${MARGE_ENCADRE}`}
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
      <h2
        id="contenu-du-jour-titre"
        className={`font-display mb-8 text-center text-3xl font-bold max-[359px]:text-2xl md:text-4xl ${ESPACE_MOTS}`}
      >
        Ton contenu du jour
      </h2>
      <div className={GRILLE}>
        {/* Vanne du jour */}
        <div className={CARTE}>
          <div className="h-1 bg-gradient-to-r from-accent-primary to-accent-secondary" />
          <div className={CORPS_CARTE}>
            <EnTete icone={<Laugh {...ICONE} />} type="Vanne du jour">
              {data.joke && (
                <Badge variant="default" className="py-1">
                  {JOKE_CATEGORY_LABELS[data.joke.category] ?? data.joke.category}
                </Badge>
              )}
            </EnTete>
            {data.joke ? (
              <>
                {/* Groupe centré verticalement dès 1280 px ; sa hauteur ne change pas au clic (V2.2). */}
                <div className="flex flex-col gap-4 xl:flex-1 xl:justify-center">
                  <p className="text-xl font-medium leading-7 text-text-primary [text-wrap:balance] md:text-2xl md:leading-8">
                    {affiche(data.joke.content)}
                  </p>
                  <div id="chute-du-jour" aria-live="polite" className="grid">
                    {showPunchline ? (
                      <div ref={chuteRef} tabIndex={-1} className={CHUTE_REVELEE}>
                        <p className={CHUTE_TEXTE}>{affiche(data.joke.punchline)}</p>
                      </div>
                    ) : (
                      <>
                        {/* Clone invisible : l'emplacement a dès le départ la hauteur de la chute. */}
                        <div aria-hidden="true" className={`${CHUTE_BOITE} pointer-events-none invisible select-none`}>
                          <p className={CHUTE_TEXTE}>{affiche(data.joke.punchline)}</p>
                        </div>
                        <button
                          type="button"
                          aria-expanded="false"
                          aria-controls="chute-du-jour"
                          className={CHUTE_EMPLACEMENT}
                          onClick={() => setShowPunchline(true)}
                        >
                          <Eye {...ICONE} />
                          Révéler la chute
                        </button>
                      </>
                    )}
                  </div>
                  {/* Décision D1 : décryptage fermé par défaut. Réservé (invisible) dès 1280 px avant la chute. */}
                  {data.joke.comedyTechnique && (
                    <Accordeon
                      titre="Pourquoi ça marche"
                      masque={!showPunchline}
                      className={showPunchline ? "" : "invisible max-xl:hidden"}
                    >
                      <div className={ACCORDEON_CORPS}>
                        <p className="text-sm font-semibold text-accent-link">{affiche(data.joke.comedyTechnique)}</p>
                        {data.joke.techniqueExplanation && <p>{affiche(data.joke.techniqueExplanation)}</p>}
                        <div className="mt-4 border-t border-border-hover pt-4">
                          {data.joke.howToApply && (
                            <>
                              <p className="text-sm font-semibold text-accent-link">À toi de jouer</p>
                              <p className="mt-1">{affiche(data.joke.howToApply)}</p>
                            </>
                          )}
                          <p className={data.joke.howToApply ? "mt-3 text-text-secondary" : "text-text-secondary"}>
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
                </div>
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
            <EnTete icone={<Lightbulb {...ICONE} />} type="Conseil du jour">
              {data.tip && (
                <>
                  <Badge variant="default" className="py-1">
                    {DIFFICULTY_LABELS[data.tip.difficulty] ?? data.tip.difficulty}
                  </Badge>
                  <Badge variant="default" className="py-1">
                    {TIP_VIDEO_CATEGORY_LABELS[data.tip.category] ?? data.tip.category}
                  </Badge>
                </>
              )}
            </EnTete>
            {data.tip ? (
              <>
                <h3 className={TITRE_CARTE}>{frTypo(data.tip.title)}</h3>
                {/* Texte complet, replié en CSS : 4 lignes sous 768 px, 6 ensuite (V2.3). */}
                <div className="flex flex-col items-start">
                  <p
                    id="conseil-du-jour-texte"
                    ref={conseilRef}
                    className={`text-sm leading-6 text-text-primary ${conseilDeplie ? "" : "line-clamp-4 md:line-clamp-6"}`}
                  >
                    {affiche(data.tip.content)}
                  </p>
                  {(conseilTronque || conseilDeplie) && (
                    <button
                      type="button"
                      aria-expanded={conseilDeplie}
                      aria-controls="conseil-du-jour-texte"
                      onClick={() => setConseilDeplie((d) => !d)}
                      className="mt-2 inline-flex min-h-[44px] items-center rounded-md text-sm font-semibold text-accent-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
                    >
                      {conseilDeplie ? "Réduire" : "Lire la suite"}
                    </button>
                  )}
                </div>
                {(data.tip.example || data.tip.exercise) && (
                  <div className="flex flex-col gap-2">
                    {data.tip.example && (
                      <Accordeon titre="Exemple concret">
                        <p className={ACCORDEON_CORPS}>{affiche(data.tip.example)}</p>
                      </Accordeon>
                    )}
                    {data.tip.exercise && (
                      <Accordeon titre="Exercice du jour">
                        <p className={ACCORDEON_CORPS}>{affiche(data.tip.exercise)}</p>
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
            <EnTete icone={<Clapperboard {...ICONE} />} type="Vidéo du jour">
              {data.video && (
                <>
                  <Badge variant="default" className="py-1">{videoCategory}</Badge>
                  {data.video.technique && data.video.technique.toLowerCase() !== videoCategory.toLowerCase() && (
                    <Badge variant="default" className="py-1">{data.video.technique}</Badge>
                  )}
                </>
              )}
            </EnTete>
            {data.video ? (
              <>
                {/* De 768 à 1279 px : lecteur et titre côte à côte (V2.1). */}
                <div className="grid gap-4 md:max-xl:grid-cols-2 md:max-xl:items-start">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-background-elevated">
                    <YouTubePlayer youtubeId={data.video.youtubeId} title={data.video.title} recadrage="serre" />
                  </div>
                  <div>
                    <h3 className={`${TITRE_CARTE} line-clamp-3`}>{affiche(data.video.title)}</h3>
                    {!chaineRedondante(data.video.title, data.video.channelName) && (
                      <p className="mt-1 text-sm text-text-secondary">{data.video.channelName}</p>
                    )}
                  </div>
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
                        <p className={ACCORDEON_CORPS}>{affiche(fixInvertedCase(data.video.exercise))}</p>
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

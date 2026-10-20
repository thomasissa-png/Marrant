"use client";

import { frTypo } from "@/lib/fr-typo";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { fixInvertedCase } from "@/lib/learning-format";
import { MARGE_ENCADRE } from "@/components/layout/gabarit";
import {
  affiche,
  Apprentissages,
  chaineRedondante,
  citationsEnBloc,
  dureeAffichee,
  Exemple,
  Exercice,
  Section,
  tailleChute,
  tailleEnonce,
} from "@/components/home/daily-content-format";
import { Clapperboard, Eye, Laugh, Lightbulb } from "lucide-react";

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
 * Cartes du jour (docs/design/cartes-du-jour/diagnostic-et-spec.md, spec v3) : même squelette sur les
 * 3 cartes (barre dégradée, en-tête, corps, pied). Cartes alignées en haut, chacune à sa hauteur naturelle :
 * ouvrir quelque chose n'agrandit que sa carte, les voisines ne bougent pas (V3.1). Pile sous 1024 px,
 * 2 + 1 de 1024 à 1279 px, 3 colonnes ensuite (V3.3).
 */

const GRILLE = "mx-auto grid max-w-xl items-start gap-4 md:gap-6 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3";

const CARTE = "relative flex flex-col overflow-hidden rounded-xl border border-border-hover bg-background-card";

const CORPS_CARTE = `flex flex-col gap-4 ${MARGE_ENCADRE}`;

/** H2 et h3 de la section : espace entre les mots de la police display élargi (« dujour », V2.4). */
const ESPACE_MOTS = "[word-spacing:0.08em]";

/**
 * Emplacement pointillé de la chute (§2.4, V3.1) : exception assumée à la règle « outline-accent unique »
 * de `button.tsx`, c'est un contrôle de révélation, pas une action d'entrée dans le produit.
 */
const CHUTE_EMPLACEMENT =
  "flex min-h-14 w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed border-accent-primary bg-accent-primary/[0.12] px-4 py-3 text-base font-semibold text-text-primary transition-colors duration-150 hover:border-accent-primary-hover hover:bg-accent-primary/20 active:bg-accent-primary/25 focus-visible:border-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link focus-visible:ring-offset-2 focus-visible:ring-offset-background-card";

/** Chute révélée : même gabarit et même épaisseur de bordure que l'emplacement, à sa place (V3.1). */
const CHUTE_REVELEE =
  "min-h-14 rounded-lg border-2 border-solid border-accent-primary/60 bg-accent-primary/10 p-4 animate-slide-up motion-reduce:animate-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link";

/** Accordéons : un seul style et un seul format d'en-tête pour les 6 (§2.7, V2.6), cible 44 px (T04). */
const ACCORDEON = "group/d rounded-lg border border-transparent bg-background-elevated open:border-border-hover";

const ACCORDEON_TITRE =
  "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-semibold text-text-primary [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-link";

const ACCORDEON_CORPS = "px-4 pb-4 text-sm leading-6 text-text-primary";

const TITRE_CARTE = `font-display text-lg font-bold leading-6 text-text-primary [text-wrap:balance] ${ESPACE_MOTS}`;

/** Extrait du conseil : 4 lignes entières, la dernière en fondu (V3.4). */
const EXTRAIT = "max-h-24 overflow-hidden";
const FONDU =
  "[mask-image:linear-gradient(to_bottom,#000_55%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_55%,transparent)]";

/** Pastilles d'en-tête (V3.6) : 12/16, blanc sur fond élevé. */
const PASTILLE = "py-1 text-text-primary";

/** Icônes d'en-tête et de l'emplacement de la chute (Lucide, V2.6 ; ampoule en 22 px, V3.6). */
const ICONE = { size: 20, strokeWidth: 1.75, "aria-hidden": true, className: "shrink-0 text-accent-link" } as const;

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

function Accordeon({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <details className={ACCORDEON}>
      <summary className={ACCORDEON_TITRE}>
        {titre}
        <Chevron />
      </summary>
      <div className={ACCORDEON_CORPS}>{children}</div>
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

/** Pied identique sur les 3 cartes (§2.6) : suit le contenu à 16 px (V3.1) ; réactions à gauche (Vanne seulement). */
function Pied({ gauche, children }: { gauche?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-[44px] items-center justify-between gap-2 border-t border-border-hover pt-3">
      {gauche}
      <div className="ml-auto flex items-center gap-1">{children}</div>
    </div>
  );
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
      <section className="pb-12 pt-8 md:py-16">
        <h2 className={`font-display mb-6 text-center text-3xl font-bold max-[359px]:text-2xl md:mb-8 md:text-4xl ${ESPACE_MOTS}`}>
          Ton contenu du jour
        </h2>
        <div className={GRILLE}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`min-h-[360px] animate-pulse rounded-xl border border-border-hover bg-background-card ${MARGE_ENCADRE} ${i === 2 ? "lg:col-span-2 xl:col-span-1" : ""}`}
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
  const enonce = data.joke ? affiche(data.joke.content) : "";
  const chute = data.joke ? affiche(data.joke.punchline) : "";
  const duree = data.video ? dureeAffichee(data.video.duration) : null;
  const chaine = data.video && !chaineRedondante(data.video.title, data.video.channelName) ? data.video.channelName : "";
  const aDesAccordeonsVideo = !!data.video && ((data.video.learnings?.length ?? 0) > 0 || !!data.video.exercise);

  return (
    <section aria-labelledby="contenu-du-jour-titre" className="pb-12 pt-8 md:py-16">
      <h2
        id="contenu-du-jour-titre"
        className={`font-display mb-6 text-center text-3xl font-bold max-[359px]:text-2xl md:mb-8 md:text-4xl ${ESPACE_MOTS}`}
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
                <Badge variant="default" className={PASTILLE}>
                  {JOKE_CATEGORY_LABELS[data.joke.category] ?? data.joke.category}
                </Badge>
              )}
            </EnTete>
            {data.joke ? (
              <>
                {/* Énoncé, puis la chute à la place du bouton, 12 px dessous : l'énoncé ne bouge pas au clic. */}
                <div className="flex flex-col gap-3">
                  <p className={`font-medium text-text-primary [text-wrap:balance] ${tailleEnonce(enonce)}`}>
                    {citationsEnBloc(enonce)}
                  </p>
                  <div id="chute-du-jour" aria-live="polite">
                    {showPunchline ? (
                      <div ref={chuteRef} tabIndex={-1} className={CHUTE_REVELEE}>
                        <p className={`font-semibold text-text-primary [text-wrap:balance] ${tailleChute(chute)}`}>
                          {citationsEnBloc(chute)}
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
                        <Eye {...ICONE} />
                        Révéler la chute
                      </button>
                    )}
                  </div>
                </div>
                {/* Décision D1 : décryptage fermé par défaut, sous la chute une fois révélée. */}
                {showPunchline && data.joke.comedyTechnique && (
                  <Accordeon titre="Pourquoi ça marche">
                    <Section titre={affiche(data.joke.comedyTechnique)}>
                      {data.joke.techniqueExplanation && <p>{affiche(data.joke.techniqueExplanation)}</p>}
                    </Section>
                    {data.joke.howToApply && (
                      <Section separee titre="À toi de jouer">
                        <p>{affiche(data.joke.howToApply)}</p>
                      </Section>
                    )}
                    <p className="mt-4 border-t border-border-hover pt-4 text-text-secondary">
                      Tu veux voir comment une vanne se construit, pièce par pièce ?{" "}
                      <Link href="/anatomie-vanne" className="font-medium text-accent-link underline underline-offset-2">
                        L’anatomie d’une vanne
                      </Link>
                    </p>
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
            <EnTete icone={<Lightbulb {...ICONE} size={22} />} type="Conseil du jour">
              {data.tip && (
                <>
                  <Badge variant="default" className={PASTILLE}>
                    {DIFFICULTY_LABELS[data.tip.difficulty] ?? data.tip.difficulty}
                  </Badge>
                  <Badge variant="default" className={PASTILLE}>
                    {TIP_VIDEO_CATEGORY_LABELS[data.tip.category] ?? data.tip.category}
                  </Badge>
                </>
              )}
            </EnTete>
            {data.tip ? (
              <>
                <h3 className={TITRE_CARTE}>{frTypo(data.tip.title)}</h3>
                {/* Extrait de 4 lignes entières en fondu, texte complet dans le DOM (V3.4). */}
                <div className="flex flex-col items-start gap-2">
                  <p
                    id="conseil-du-jour-texte"
                    ref={conseilRef}
                    className={`text-sm leading-6 text-text-primary ${conseilDeplie ? "" : EXTRAIT} ${!conseilDeplie && conseilTronque ? FONDU : ""}`}
                  >
                    {affiche(data.tip.content)}
                  </p>
                  {(conseilTronque || conseilDeplie) && (
                    <button
                      type="button"
                      aria-expanded={conseilDeplie}
                      aria-controls="conseil-du-jour-texte"
                      onClick={() => setConseilDeplie((d) => !d)}
                      className="-my-3 inline-flex min-h-[44px] items-center rounded-md py-3 text-sm font-semibold text-accent-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
                    >
                      {conseilDeplie ? "Réduire" : "Lire la suite"}
                    </button>
                  )}
                </div>
                {(data.tip.example || data.tip.exercise) && (
                  <div className="flex flex-col gap-2">
                    {data.tip.example && (
                      <Accordeon titre="Exemple concret">
                        <Exemple texte={data.tip.example} />
                      </Accordeon>
                    )}
                    {data.tip.exercise && (
                      <Accordeon titre="Exercice du jour">
                        <Exercice texte={data.tip.exercise} />
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

        {/* Vidéo du jour : pleine largeur sous les deux autres de 1024 à 1279 px (V3.3). */}
        <div className={`${CARTE} lg:col-span-2 xl:col-span-1`}>
          <div className="h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
          <div className={CORPS_CARTE}>
            <EnTete icone={<Clapperboard {...ICONE} />} type="Vidéo du jour">
              {data.video && (
                <>
                  <Badge variant="default" className={PASTILLE}>{videoCategory}</Badge>
                  {data.video.technique && data.video.technique.toLowerCase() !== videoCategory.toLowerCase() && (
                    <Badge variant="default" className={PASTILLE}>{data.video.technique}</Badge>
                  )}
                </>
              )}
            </EnTete>
            {data.video ? (
              <>
                {/* De 768 à 1279 px : lecteur à gauche ; à droite, titre, chaîne et durée, puis accordéons 16 px
                    dessous, empilés en haut (tour 3.1 : plus de justify-between, aucun vide intérieur). */}
                <div className="grid gap-4 md:max-xl:grid-cols-2 md:max-xl:gap-6">
                  <div className="relative aspect-video self-start overflow-hidden rounded-lg bg-background-elevated">
                    <YouTubePlayer youtubeId={data.video.youtubeId} title={data.video.title} recadrage="serre" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className={`${TITRE_CARTE} line-clamp-3`}>{affiche(data.video.title)}</h3>
                      {(chaine || duree) && (
                        <p className="mt-1 text-sm text-text-secondary">
                          {chaine && <span>{chaine}</span>}
                          {chaine && duree && " · "}
                          {duree && <span className="whitespace-nowrap">{duree}</span>}
                        </p>
                      )}
                    </div>
                    {aDesAccordeonsVideo && (
                      <div className="flex flex-col gap-2">
                        {data.video.learnings && data.video.learnings.length > 0 && (
                          <Accordeon titre="Ce que tu vas apprendre">
                            <Apprentissages items={data.video.learnings.slice(0, 2)} />
                          </Accordeon>
                        )}
                        {data.video.exercise && (
                          <Accordeon titre="Exercice pratique">
                            <Exercice texte={fixInvertedCase(data.video.exercise)} />
                          </Accordeon>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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

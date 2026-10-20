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
 * Cartes du jour (docs/design/cartes-du-jour/diagnostic-et-spec.md, spec v4) : même squelette sur les
 * 3 cartes (barre dégradée, en-tête, corps, pied). Dès 1024 px, la Vanne est un bandeau pleine largeur
 * centré, Conseil et Vidéo forment dessous une rangée de deux cartes égales (V4.1) ; pile de 576 px avant.
 */

const GRILLE = "mx-auto grid max-w-xl gap-4 md:gap-6 lg:max-w-none";

/**
 * Rangée Conseil + Vidéo (V4.1, V4.3) : fondue dans la pile sous 1024 px ; ensuite 2 colonnes de même
 * hauteur, qui reprennent leur hauteur naturelle tant qu'un accordéon est ouvert ou le conseil déplié.
 */
const RANGEE =
  "contents lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6 lg:[&:has(details[open],[data-deplie=true])]:items-start";

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

function Accordeon({ titre, children, className = "" }: { titre: string; children: ReactNode; className?: string }) {
  return (
    <details className={`${ACCORDEON} ${className}`}>
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

/**
 * Pied identique sur les 3 cartes (§2.6) : réactions à gauche (Vanne seulement), partage puis favori à droite.
 * `bas` : calé en bas de la carte étirée de la rangée, filets alignés (V4.3).
 */
function Pied({ gauche, children, bas = false }: { gauche?: ReactNode; children: ReactNode; bas?: boolean }) {
  return (
    <div className={`flex min-h-[44px] items-center justify-between gap-2 border-t border-border-hover pt-3 ${bas ? "lg:mt-auto" : ""}`}>
      {gauche}
      <div className="ml-auto flex items-center gap-1">{children}</div>
    </div>
  );
}

/**
 * Extrait du Conseil dès 1024 px (V4.3) : lignes affichées (`null` = texte entier) et conseil court (reste
 * supérieur à une ligne). Le reste est réparti en parts égales entre les blocs de la carte (justify-between) :
 * moins de 6 px de plus par écart pour un extrait tronqué, au lieu d'un vide sous « Lire la suite ».
 */
interface ExtraitLarge {
  lignes: number | null;
  court: boolean;
  /** Hauteur donnée au bloc de l'extrait : lignes retenues + « Lire la suite », ou texte entier. */
  hauteur: number;
}

const LIGNE = 24;
/** Encombrement de « Lire la suite » sous l'extrait : 8 px d'écart + 20 px (V3.4). */
const LIEN_SUITE = 28;

export function DailyContent() {
  const [data, setData] = useState<DailyData>({ joke: null, tip: null, video: null });
  const [showPunchline, setShowPunchline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [conseilTronque, setConseilTronque] = useState(false);
  const [conseilDeplie, setConseilDeplie] = useState(false);
  const [extraitLarge, setExtraitLarge] = useState<ExtraitLarge | null>(null);
  const [rangeeOuverte, setRangeeOuverte] = useState(false);
  const chuteRef = useRef<HTMLDivElement>(null);
  const conseilRef = useRef<HTMLParagraphElement>(null);
  const extraitRef = useRef<HTMLDivElement>(null);
  const corpsConseilRef = useRef<HTMLDivElement>(null);
  const rangeeRef = useRef<HTMLDivElement>(null);

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

  // Un accordéon ouvert dans la rangée : hauteurs naturelles, extrait du Conseil figé (V4.3).
  useEffect(() => {
    const rangee = rangeeRef.current;
    if (!rangee) return;
    const suivre = () => setRangeeOuverte(!!rangee.querySelector("details[open]"));
    rangee.addEventListener("toggle", suivre, true);
    return () => rangee.removeEventListener("toggle", suivre, true);
  }, [isLoading]);

  // Extrait du Conseil : 4 lignes sous 1024 px (V3.4) ; dès 1024 px, la place laissée par la Vidéo (V4.3).
  useEffect(() => {
    const texte = conseilRef.current;
    const extrait = extraitRef.current;
    const corps = corpsConseilRef.current;
    if (!texte || !extrait || !corps || conseilDeplie) return;
    const mesurer = () => {
      const large = typeof window.matchMedia === "function" && window.matchMedia("(min-width: 1024px)").matches;
      if (!large) {
        setExtraitLarge(null);
        setConseilTronque(texte.scrollHeight > texte.clientHeight + 1);
        return;
      }
      if (rangeeOuverte) return; // lignes figées tant qu'un accordéon de la rangée est ouvert
      const style = getComputedStyle(corps);
      const autres = Array.from(corps.children).filter((e) => e !== extrait && (e as HTMLElement).offsetHeight > 0);
      const dispo =
        corps.clientHeight -
        parseFloat(style.paddingTop) -
        parseFloat(style.paddingBottom) -
        autres.reduce((somme, e) => somme + (e as HTMLElement).offsetHeight, 0) -
        (parseFloat(style.rowGap) || 0) * autres.length;
      const entier = texte.scrollHeight;
      const suivant: ExtraitLarge =
        entier <= dispo + 1
          ? { lignes: null, court: dispo - entier > LIGNE, hauteur: entier }
          : (() => {
              const lignes = Math.max(2, Math.floor((dispo - LIEN_SUITE) / LIGNE));
              return { lignes, court: false, hauteur: lignes * LIGNE + LIEN_SUITE };
            })();
      setExtraitLarge((avant) =>
        avant && avant.lignes === suivant.lignes && avant.court === suivant.court && Math.abs(avant.hauteur - suivant.hauteur) < 1
          ? avant
          : suivant,
      );
    };
    mesurer();
    document.fonts?.ready.then(mesurer).catch(() => {});
    if (typeof ResizeObserver === "undefined") return;
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(corps);
    observateur.observe(texte);
    return () => observateur.disconnect();
  }, [data.tip, isLoading, conseilDeplie, rangeeOuverte]);

  if (isLoading) {
    return (
      <section className="pb-12 pt-8 md:py-16">
        <h2 className={`font-display mb-6 text-center text-3xl font-bold max-[359px]:text-2xl md:mb-8 md:text-4xl ${ESPACE_MOTS}`}>
          Ton contenu du jour
        </h2>
        <div className={GRILLE}>
          <div className={`min-h-[360px] animate-pulse rounded-xl border border-border-hover bg-background-card ${MARGE_ENCADRE}`} />
          <div className={RANGEE}>
            {[0, 1].map((i) => (
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
  // Extrait du Conseil : sous 1024 px, 4 lignes (V3.4) ; dès 1024 px, n lignes mesurées ou texte entier (V4.3).
  const lienSuite = conseilDeplie || (extraitLarge ? extraitLarge.lignes !== null : conseilTronque);
  const extraitClasses = conseilDeplie
    ? ""
    : extraitLarge
      ? `overflow-hidden ${extraitLarge.lignes !== null ? FONDU : ""}`
      : `${EXTRAIT} ${conseilTronque ? FONDU : ""}`;
  const extraitStyle =
    !conseilDeplie && extraitLarge?.lignes ? { maxHeight: extraitLarge.lignes * LIGNE } : undefined;
  // Dès 1024 px, le bloc de l'extrait ne compte pour rien dans la hauteur de la rangée tant qu'il n'est pas
  // mesuré (flex-1, base 0), puis reçoit exactement la hauteur retenue : jamais plus haut que la place laissée.
  const conteneurExtrait = conseilDeplie ? "" : "lg:min-h-12 lg:flex-1 lg:basis-0 lg:overflow-hidden";
  // Débordement visible une fois la hauteur fixée : la zone de 44 px de « Lire la suite » dépasse de 12 px, et
  // un conteneur `overflow-hidden` défilerait au focus clavier en coupant la 1re ligne du conseil.
  const conteneurStyle =
    !conseilDeplie && extraitLarge ? { height: extraitLarge.hauteur, flex: "none", overflow: "visible" } : undefined;
  const etatExtrait = conseilDeplie ? "deplie" : !extraitLarge ? "pile" : extraitLarge.court ? "court" : extraitLarge.lignes ? "tronque" : "entier";

  return (
    <section aria-labelledby="contenu-du-jour-titre" className="pb-12 pt-8 md:py-16">
      <h2
        id="contenu-du-jour-titre"
        className={`font-display mb-6 text-center text-3xl font-bold max-[359px]:text-2xl md:mb-8 md:text-4xl ${ESPACE_MOTS}`}
      >
        Ton contenu du jour
      </h2>
      <div className={GRILLE}>
        {/* Vanne du jour : bandeau pleine largeur, corps centré dès 1024 px (V4.2). */}
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
                <div className="flex flex-col gap-3 lg:mx-auto lg:w-full lg:max-w-3xl lg:items-center lg:py-4 lg:text-center">
                  <p className={`font-medium text-text-primary [text-wrap:balance] ${tailleEnonce(enonce)}`}>
                    {citationsEnBloc(enonce)}
                  </p>
                  <div id="chute-du-jour" aria-live="polite" className="w-full lg:max-w-xl">
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
                  {/* Décision D1 : décryptage fermé par défaut, sous la chute une fois révélée. */}
                  {showPunchline && data.joke.comedyTechnique && (
                    <Accordeon titre="Pourquoi ça marche" className="mt-1 w-full text-left lg:max-w-xl">
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

        <div ref={rangeeRef} className={RANGEE}>
          {/* Conseil du jour : l'extrait prend la place laissée par la Vidéo dès 1024 px (V4.3). */}
          <div className={CARTE}>
            <div className="h-1 bg-gradient-to-r from-accent-secondary to-accent-primary" />
            <div ref={corpsConseilRef} className={`${CORPS_CARTE} lg:flex-1 lg:justify-between`}>
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
                  {/* Lignes entières, dernière en fondu, texte complet dans le DOM (V3.4, V4.3). */}
                  <div
                    ref={extraitRef}
                    data-extrait={etatExtrait}
                    className={`flex flex-col items-start gap-2 ${conteneurExtrait}`}
                    style={conteneurStyle}
                  >
                    <p
                      id="conseil-du-jour-texte"
                      ref={conseilRef}
                      data-deplie={conseilDeplie}
                      className={`text-sm leading-6 text-text-primary ${extraitClasses}`}
                      style={extraitStyle}
                    >
                      {affiche(data.tip.content)}
                    </p>
                    {lienSuite && (
                      <button
                        type="button"
                        aria-expanded={conseilDeplie}
                        aria-controls="conseil-du-jour-texte"
                        onClick={() => setConseilDeplie((d) => !d)}
                        className="-my-3 inline-flex min-h-[44px] shrink-0 items-center rounded-md py-3 text-sm font-semibold text-accent-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link"
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

          {/* Vidéo du jour : fixe la hauteur de la rangée dès 1024 px (V4.3). */}
          <div className={CARTE}>
            <div className="h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
            <div className={`${CORPS_CARTE} lg:flex-1`}>
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
                  {/* Empilé sous 768 px et de 1024 à 1279 px ; 768 à 1023 : lecteur à gauche, titre puis accordéons
                      à droite, empilés en haut (tour 3.1) ; dès 1280 : lecteur et titre côte à côte, accordéons
                      pleine largeur dessous (V4.3). */}
                  <div className="grid gap-4 md:max-lg:grid-cols-2 md:max-lg:grid-rows-[auto_1fr] md:max-lg:gap-x-6 xl:grid-cols-[1.25fr_1fr] xl:items-center xl:gap-x-6">
                    <div className="relative aspect-video self-start overflow-hidden rounded-lg bg-background-elevated md:max-lg:row-span-2 xl:self-center">
                      <YouTubePlayer youtubeId={data.video.youtubeId} title={data.video.title} recadrage="serre" />
                    </div>
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
                      <div className="flex flex-col gap-2 self-start xl:col-span-2">
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
                  <Pied bas>
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
      </div>
    </section>
  );
}

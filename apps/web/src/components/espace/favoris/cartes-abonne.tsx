"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { contenuAffiche } from "@/lib/tip-prose";
import { ShareButton } from "@/components/ui/share-button";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { CARTE_ACTION } from "@/components/espace/aujourdhui/tableau";
import { ETIQUETTE, META, TEXTE, TITRE_CARTE } from "@/components/espace/typo";
import { BlocDeplie, CARTE_FAVORI, CorpsConseil, CorpsVanne } from "@/components/espace/favoris/cartes-favori";
import { DIFFICULTY_LABELS, JOKE_CATEGORY_LABELS, TIP_CATEGORY_LABELS, TYPE_FAVORI } from "@/components/favoris/libelles";

export interface JokeData {
  content: string;
  punchline: string;
  category: string;
  comedyTechnique?: string | null;
  techniqueExplanation?: string | null;
  howToApply?: string | null;
}
export interface TipData {
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example: string;
  exercise: string;
}
export interface VideoData {
  youtubeId: string;
  title: string;
  channelName: string;
  category: string;
  description: string;
  technique: string;
  learnings: string[];
  exercise: string | null;
}

/** « Retirer » : lien gris souligné de 44 px (design s26 §2.3), jamais un bouton plein. */
const RETIRER = cn(LIEN_NEUTRE, "hover:text-error-text");
const CLIQUABLE = "cursor-pointer transition-colors hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary";

/** Cadre : la carte de tête (la plus récente, prochaine action) prend `CARTE_ACTION`, les autres le cadre neutre. */
// s26 tour 2 (F1) : dès 1024, chaque carte à sa hauteur propre (`lg:h-auto` sur `h-full`, grille en `lg:items-start`) :
// la vanne n'est plus étirée à la hauteur du conseil voisin (73 à 86 px vides au-dessus du filet des actions).
// s26 tour 3 : dès 768 (`md:h-auto`, grille en `md:items-start`), toutes les largeurs à deux colonnes (104 px à 768).
const cadre = (enTete: boolean) => cn(enTete ? CARTE_ACTION : CARTE_FAVORI, "md:h-auto");

/** Pied d'une carte : « Partager » (bouton existant, 44 px) et « Retirer », sous un filet, en bas de carte. */
function Actions({ titre, texte, retirer }: { titre: string; texte: string; retirer: () => void }) {
  return (
    <div className="mt-auto pt-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-6 border-t border-border pt-4">
        <ShareButton title={titre} text={texte} className="-ml-1.5" />
        <button type="button" onClick={retirer} aria-label="Retirer des favoris" className={RETIRER}>
          Retirer
        </button>
      </div>
    </div>
  );
}

/** Rend une carte repliable au clavier (Entrée, Espace) comme au clic, sans gêner les liens et boutons qu'elle contient. */
const repliable = (basculer: () => void) => ({
  tabIndex: 0,
  onClick: basculer,
  onKeyDown: (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    basculer();
  },
});

export function CarteVanneAbonne(p: { joke: JokeData; jokeId: string; ouverte: boolean; enTete: boolean; basculer: () => void; retirer: () => void; className?: string }) {
  const { joke } = p;
  return (
    <div className={cn(cadre(p.enTete), CLIQUABLE, p.className)} {...repliable(p.basculer)} data-favori="vanne">
      <CorpsVanne
        texte={joke.content}
        chute={joke.punchline}
        categorie={JOKE_CATEGORY_LABELS[joke.category] ?? joke.category}
        chuteVisible={p.ouverte}
        suite={<p className={cn("mt-4", META)}>Clique pour la chute</p>}
      />
      {p.ouverte && (
        <div onClick={(e) => e.stopPropagation()}>
          <ReactionButtons jokeId={p.jokeId} className="mt-4" echelle="espace" />
          {joke.comedyTechnique && (
            <BlocDeplie titre={`Pourquoi ça marche : ${contenuAffiche(joke.comedyTechnique)}`}>
              {joke.techniqueExplanation && <p>{joke.techniqueExplanation}</p>}
              {joke.howToApply && (
                <BlocDeplie titre="À toi de jouer">
                  <p>{joke.howToApply}</p>
                </BlocDeplie>
              )}
              <p className={cn("mt-4", META)}>
                Envie de comprendre la mécanique en profondeur ?{" "}
                <Link href="/anatomie-vanne" className={LIEN_NEUTRE}>
                  L’anatomie d’une vanne
                </Link>
              </p>
            </BlocDeplie>
          )}
        </div>
      )}
      <Actions titre="Vanne - deviens-marrant.fr" texte={`${joke.content}\n\n${joke.punchline}`} retirer={p.retirer} />
    </div>
  );
}

export function CarteConseilAbonne(p: { tip: TipData; ouverte: boolean; enTete: boolean; basculer: () => void; retirer: () => void; className?: string }) {
  const { tip } = p;
  const categorie = [DIFFICULTY_LABELS[tip.difficulty] ?? tip.difficulty, TIP_CATEGORY_LABELS[tip.category] ?? tip.category].join(" · ");
  return (
    <div className={cn(cadre(p.enTete), CLIQUABLE, p.className)} {...repliable(p.basculer)} data-favori="conseil">
      <CorpsConseil titre={tip.title} contenu={tip.content} categorie={categorie} deplie={p.ouverte} />
      {p.ouverte ? (
        <>
          <BlocDeplie titre="Exemple">{contenuAffiche(tip.example)}</BlocDeplie>
          {/* 08/11 : exercice vidé par l'API si le plan en base n'est pas Premium : pas de bloc vide. */}
          {tip.exercise && <BlocDeplie titre="Exercice">{contenuAffiche(tip.exercise)}</BlocDeplie>}
        </>
      ) : (
        <p className={cn("mt-2", META)}>Ouvre pour l’exemple et le défi</p>
      )}
      <Actions titre={`${tip.title} - deviens-marrant.fr`} texte={tip.content} retirer={p.retirer} />
    </div>
  );
}

/** Vidéo : sur toute la liste, vignette 5 col et texte 7 col dès 768 px (vignette bornée, `grilles-s21`) ; lecture à la demande. */
export function CarteVideoAbonne(p: { video: VideoData; enTete: boolean; retirer: () => void }) {
  const { video } = p;
  const categorie = TIP_CATEGORY_LABELS[video.category] ?? video.category;
  const meta = [video.channelName, categorie];
  if (video.technique && video.technique.toLowerCase() !== categorie.toLowerCase()) meta.push(video.technique);
  return (
    <div className={cn(cadre(p.enTete), "md:col-span-2 lg:col-span-12")} data-favori="video">
      <div className="md:grid md:grid-cols-12 md:gap-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-background-elevated md:col-span-5">
          <YouTubePlayer youtubeId={video.youtubeId} title={video.title} />
        </div>
        <div className="mt-6 min-w-0 md:col-span-7 md:mt-0">
          <p className={ETIQUETTE}>{TYPE_FAVORI.VIDEO}</p>
          <h2 className={cn("mt-2", TITRE_CARTE)}>{contenuAffiche(video.title)}</h2>
          <p className={cn("mt-2", META)}>{meta.join(" · ")}</p>
          <p className={cn("mt-2 line-clamp-2", TEXTE)}>{contenuAffiche(video.description)}</p>
          {video.learnings?.length > 0 && (
            <BlocDeplie titre="Ce que tu vas apprendre">
              <ul className="list-disc space-y-2 pl-5">
                {video.learnings.map((l, i) => (
                  <li key={i}>{contenuAffiche(l)}</li>
                ))}
              </ul>
            </BlocDeplie>
          )}
          {video.exercise && <BlocDeplie titre="Exercice pratique">{contenuAffiche(video.exercise)}</BlocDeplie>}
        </div>
      </div>
      <Actions titre={`${video.title} - deviens-marrant.fr`} texte={`${video.title} par ${video.channelName}`} retirer={p.retirer} />
    </div>
  );
}

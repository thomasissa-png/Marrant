"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { frTypo } from "@/lib/fr-typo";
import { contenuAffiche } from "@/lib/tip-prose";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { ReactionButtons } from "@/components/ui/reaction-buttons";
import { YouTubePlayer } from "@/components/ui/youtube-player";
import { BANDEAU_ACCUEIL, BANDEAU_ACCUEIL_CENTRE, BANDEAU_ACCUEIL_INVERSE, BLOC_EXEMPLE, BLOC_EXERCICE, CARTE_ACCUEIL, EMOJI_CONTENU, LIBELLE_BLOC, PIED_CARTE_ACCUEIL, RANGEE_PASTILLES } from "@/components/home/da-site";
import { LIEN_NEUTRE } from "@/components/espace/carte/styles";
import { META, TEXTE, TITRE_PAGE } from "@/components/espace/typo";
import { DIFFICULTY_LABELS, JOKE_CATEGORY_LABELS, TIP_CATEGORY_LABELS, TYPE_FAVORI } from "@/components/favoris/libelles";
import type { Favori } from "@/components/espace/favoris/liste-favoris";

/** Données d'un favori telles que l'API les rend (types des cartes de favoris d'avant, `cartes-abonne.tsx` retiré). */
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
/** Titre du détail : H2 focalisable (le focus lui est rendu à l'ouverture depuis la liste), à la taille du H1 de fiche. */
const TITRE = cn(TITRE_PAGE, "[overflow-wrap:anywhere] focus:outline-none");
const BLOC = "space-y-2 p-4";

/** Émoji et bandeau de la carte de l'accueil du même type (« Vanne du jour », « Conseil du jour », « Vidéo du jour »). */
const DA_TYPE = {
  JOKE: { emoji: "😂", bandeau: BANDEAU_ACCUEIL },
  TIP: { emoji: "💡", bandeau: BANDEAU_ACCUEIL_INVERSE },
  VIDEO: { emoji: "🎬", bandeau: BANDEAU_ACCUEIL_CENTRE },
} as const;

/** Bloc de l'accueil, ouvert (libellé violet, jamais replié dans le détail). */
function Bloc({ cadre, titre, children }: { cadre: string; titre: string; children: React.ReactNode }) {
  return (
    <div className={cn(cadre, BLOC)}>
      <p className={LIBELLE_BLOC}>{titre}</p>
      <div className={TEXTE}>{children}</div>
    </div>
  );
}

/**
 * s26 DA, s'entraîner et favoris : le favori ouvert, à droite de la liste dès 1024 (plein écran dessous). Une carte de
 * la famille « Ton contenu du jour » de l'accueil, comme la fiche de Quoi répondre : bandeau violet, émoji, pastille
 * violette du type et pastille neutre de la catégorie, blocs « Exemple concret » et « Exercice du jour » (styles),
 * pied d'actions sous un filet. Libellés : ceux des cartes de favoris d'avant (`cartes-abonne.tsx`), aucun texte neuf.
 * Aucun bouton plein (« Retirer » et « Partager » neutres).
 */
export const DetailFavori = forwardRef<HTMLHeadingElement, { fav: Favori; retirer: () => void }>(function DetailFavori({ fav, retirer }, titre) {
  const type = fav.contentType;
  const da = DA_TYPE[type];
  let pastilles: string[] = [];
  let corps: React.ReactNode = null;
  let partage = { titre: "", texte: "" };

  if (type === "JOKE" && fav.joke) {
    const joke = fav.joke as unknown as JokeData;
    pastilles = [JOKE_CATEGORY_LABELS[joke.category] ?? joke.category];
    partage = { titre: "Vanne - deviens-marrant.fr", texte: `${joke.content}\n\n${joke.punchline}` };
    corps = (
      <>
        <h2 ref={titre} tabIndex={-1} className={cn("text-xl font-medium leading-7 text-text-primary [overflow-wrap:anywhere] focus:outline-none")}>
          {frTypo(joke.content)}
        </h2>
        {/* La chute dans l'encadré violet de la « Vanne du jour » une fois révélée. */}
        <p className="rounded-lg bg-accent-primary/10 p-3 text-lg font-semibold text-accent-link">{contenuAffiche(joke.punchline)}</p>
        {fav.jokeId && <ReactionButtons jokeId={fav.jokeId} echelle="espace" />}
        {joke.comedyTechnique && (
          <Bloc cadre={BLOC_EXERCICE} titre={`Pourquoi ça marche : ${contenuAffiche(joke.comedyTechnique)}`}>
            {joke.techniqueExplanation && <p>{contenuAffiche(joke.techniqueExplanation)}</p>}
            {joke.howToApply && (
              <div className="mt-4">
                <p className="font-semibold text-text-primary">À toi de jouer</p>
                <p className="mt-2">{contenuAffiche(joke.howToApply)}</p>
              </div>
            )}
            <p className={cn("mt-4", META)}>
              Envie de comprendre la mécanique en profondeur ?{" "}
              <Link href="/anatomie-vanne" className="font-medium text-accent-link underline underline-offset-2">
                L’anatomie d’une vanne
              </Link>
            </p>
          </Bloc>
        )}
      </>
    );
  } else if (type === "TIP" && fav.tip) {
    const tip = fav.tip as unknown as TipData;
    pastilles = [DIFFICULTY_LABELS[tip.difficulty] ?? tip.difficulty, TIP_CATEGORY_LABELS[tip.category] ?? tip.category];
    partage = { titre: `${tip.title} - deviens-marrant.fr`, texte: tip.content };
    corps = (
      <>
        <h2 ref={titre} tabIndex={-1} className={TITRE}>
          {frTypo(tip.title)}
        </h2>
        <p className={cn(TEXTE, "text-text-primary")}>{contenuAffiche(tip.content)}</p>
        {tip.example && <Bloc cadre={BLOC_EXEMPLE} titre="Exemple">{contenuAffiche(tip.example)}</Bloc>}
        {/* 08/11 : exercice vidé par l'API si le plan en base n'est pas Premium : pas de bloc vide. */}
        {tip.exercise && <Bloc cadre={BLOC_EXERCICE} titre="Exercice">{contenuAffiche(tip.exercise)}</Bloc>}
      </>
    );
  } else if (type === "VIDEO" && fav.video) {
    const video = fav.video as unknown as VideoData;
    const categorie = TIP_CATEGORY_LABELS[video.category] ?? video.category;
    pastilles = [categorie];
    if (video.technique && video.technique.toLowerCase() !== categorie.toLowerCase()) pastilles.push(video.technique);
    partage = { titre: `${video.title} - deviens-marrant.fr`, texte: `${video.title} par ${video.channelName}` };
    corps = (
      <>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-background-elevated">
          <YouTubePlayer youtubeId={video.youtubeId} title={video.title} />
        </div>
        <div>
          <h2 ref={titre} tabIndex={-1} className={TITRE}>
            {contenuAffiche(video.title)}
          </h2>
          <p className={cn("mt-2", META)}>{video.channelName}</p>
        </div>
        {video.description && <p className={TEXTE}>{contenuAffiche(video.description)}</p>}
        {video.learnings?.length > 0 && (
          <Bloc cadre={BLOC_EXEMPLE} titre="Ce que tu vas apprendre">
            <ul className="space-y-2">
              {video.learnings.map((l, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0 text-accent-link" aria-hidden="true">
                    •
                  </span>
                  <span>{contenuAffiche(l)}</span>
                </li>
              ))}
            </ul>
          </Bloc>
        )}
        {video.exercise && <Bloc cadre={BLOC_EXERCICE} titre="Exercice pratique">{contenuAffiche(video.exercise)}</Bloc>}
      </>
    );
  }

  return (
    <article className={cn(CARTE_ACCUEIL, "min-w-0 [overflow-wrap:anywhere]")} data-favori-detail={fav.id} data-favori={type === "JOKE" ? "vanne" : type === "TIP" ? "conseil" : "video"}>
      <div className={da.bandeau} />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className={RANGEE_PASTILLES}>
          <span className={EMOJI_CONTENU} aria-hidden="true">
            {da.emoji}
          </span>
          <Badge variant="primary">{TYPE_FAVORI[type]}</Badge>
          {pastilles.map((p, i) => (
            <Badge key={p} variant={type === "TIP" && i === 0 ? "secondary" : "default"}>
              {p}
            </Badge>
          ))}
        </div>
        {corps}
        <div className={cn(PIED_CARTE_ACCUEIL, "gap-6")}>
          <ShareButton title={partage.titre} text={partage.texte} className="-ml-1.5" />
          <button type="button" onClick={retirer} aria-label="Retirer des favoris" className={RETIRER}>
            Retirer
          </button>
        </div>
      </div>
    </article>
  );
});

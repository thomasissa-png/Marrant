"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { frTypo } from "@/lib/fr-typo";

interface YouTubePlayerProps {
  youtubeId: string;
  title: string;
  /** Première vignette visible : chargée en priorité (T22). */
  priority?: boolean;
  /**
   * s26 parcours, tour 7 (MESURES v4 §6.3 : titre incrusté à 1280, absent de la vignette à 375) : sous-étapes vidéo d'un
   * parcours (espace ouvert), titre dans la vignette à toutes les largeurs : une ligne sous 360 px, deux au-delà ; sur
   * la miniature chargée, posé sur un dégradé sombre. Absent : inchangé.
   */
  titreIncruste?: boolean;
}

/**
 * Lite YouTube embed — affiche une thumbnail cliquable,
 * charge l'iframe uniquement quand l'utilisateur appuie sur play.
 * Beaucoup plus léger et fiable sur mobile.
 */
export function YouTubePlayer({ youtubeId, title, priority = false, titreIncruste = false }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  if (isPlaying) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      className="group/play absolute inset-0 flex items-center justify-center bg-background-elevated [container-type:inline-size]"
      onClick={handlePlay}
      aria-label={`Lire la vidéo : ${title}`}
    >
      {/* Thumbnail YouTube ; si elle échoue (T22) : fond dégradé + titre de la vidéo.
          Revue visuelle s21, tour 5 (T4-02) : titre incrusté seulement si la vignette fait 360 px de large ou plus
          (16 px au moins entre le bouton de lecture et 2 lignes de titre) ; plus étroite (carte de 230 px de
          l'accueil à 768 px, grilles), le titre est déjà affiché dans la carte, sous la vignette. */}
      {thumbFailed ? (
        <span className="absolute inset-0 flex items-end bg-gradient-to-br from-accent-primary/30 to-background-elevated p-4 text-left">
          <span
            className={
              titreIncruste
                ? "line-clamp-1 text-sm font-semibold text-text-primary [@container(min-width:360px)]:line-clamp-2"
                : "hidden text-sm font-semibold text-text-primary [@container(min-width:360px)]:line-clamp-2"
            }
          >
            {frTypo(title)}
          </span>
        </span>
      ) : (
        <Image
          src={`https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`}
          alt={title}
          width={480}
          height={360}
          className="absolute inset-0 h-full w-full object-cover"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          onError={() => setThumbFailed(true)}
        />
      )}
      {titreIncruste && !thumbFailed && (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8 text-left">
          <span className="line-clamp-1 text-sm font-semibold text-white [@container(min-width:360px)]:line-clamp-2">{frTypo(title)}</span>
        </span>
      )}
      {/* Bouton play */}
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover/play:scale-110">
        <svg viewBox="0 0 24 24" fill="white" className="ml-1 h-6 w-6" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </button>
  );
}

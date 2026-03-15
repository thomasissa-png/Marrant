"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface YouTubePlayerProps {
  youtubeId: string;
  title: string;
}

/**
 * Lite YouTube embed — affiche une thumbnail cliquable,
 * charge l'iframe uniquement quand l'utilisateur appuie sur play.
 * Beaucoup plus léger et fiable sur mobile.
 */
export function YouTubePlayer({ youtubeId, title }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  if (isPlaying) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1`}
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
      className="group/play absolute inset-0 flex items-center justify-center bg-background-elevated"
      onClick={handlePlay}
      aria-label={`Lire la vidéo : ${title}`}
    >
      {/* Thumbnail YouTube */}
      <Image
        src={`https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`}
        alt={title}
        width={480}
        height={360}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      {/* Bouton play */}
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover/play:scale-110">
        <svg viewBox="0 0 24 24" fill="white" className="ml-1 h-6 w-6" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </button>
  );
}

"use client";

import { useState, useEffect } from "react";

interface ContentStats {
  jokes: number;
  tips: number;
  videos: number;
}

const DEFAULT_STATS: ContentStats = { jokes: 0, tips: 0, videos: 0 };

/** Arrondi à la dizaine inférieure (294 → 290, 71 → 70, 89 → 80). */
export function roundToTen(n: number): number {
  return Math.floor(n / 10) * 10;
}

/**
 * Hook pour récupérer le nombre total de contenus actifs.
 * Utilisé pour afficher des compteurs dynamiques dans les CTA et upsells.
 * Les compteurs sont arrondis à la dizaine inférieure pour un affichage propre.
 */
export function useContentStats() {
  const [stats, setStats] = useState<ContentStats>(DEFAULT_STATS);

  useEffect(() => {
    fetch("/api/content-stats")
      .then((res) => (res.ok ? res.json() : DEFAULT_STATS))
      .then((data) =>
        setStats({
          jokes: roundToTen(data.jokes || 0),
          tips: roundToTen(data.tips || 0),
          videos: roundToTen(data.videos || 0),
        }),
      )
      .catch(() => {});
  }, []);

  return stats;
}

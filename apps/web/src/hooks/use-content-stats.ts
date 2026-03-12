"use client";

import { useState, useEffect } from "react";

interface ContentStats {
  jokes: number;
  tips: number;
  videos: number;
}

const DEFAULT_STATS: ContentStats = { jokes: 0, tips: 0, videos: 0 };

/**
 * Hook pour récupérer le nombre total de contenus actifs.
 * Utilisé pour afficher des compteurs dynamiques dans les CTA et upsells.
 */
export function useContentStats() {
  const [stats, setStats] = useState<ContentStats>(DEFAULT_STATS);

  useEffect(() => {
    fetch("/api/content-stats")
      .then((res) => (res.ok ? res.json() : DEFAULT_STATS))
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return stats;
}

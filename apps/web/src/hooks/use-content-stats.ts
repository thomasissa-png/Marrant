"use client";

import { useState, useEffect } from "react";

interface ContentStats {
  jokes: number;
  tips: number;
  videos: number;
  /** Nombre réel d'inscrits (arrondi) — jamais un chiffre marketing en dur. */
  members: number;
}

const DEFAULT_STATS: ContentStats = { jokes: 0, tips: 0, videos: 0, members: 0 };

/**
 * Seuil sous lequel on n'affiche pas de compteur d'inscrits (preuve sociale
 * faible ou chiffre non significatif) : l'UI bascule sur une formulation neutre.
 */
export const MEMBERS_SOCIAL_PROOF_MIN = 100;

/**
 * Arrondi marketing (aligné sur `content-stats-server.ts`) :
 * - >= 100 → centaine inférieure (602 → 600, 400 → 400)
 * - <  100 → dizaine inférieure (89 → 80, 66 → 60)
 */
export function roundToTen(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n >= 100) return Math.floor(n / 100) * 100;
  return Math.floor(n / 10) * 10;
}

/**
 * Hook pour récupérer le nombre total de contenus actifs.
 * Utilisé pour afficher des compteurs dynamiques dans les CTA et upsells.
 * Les compteurs sont arrondis (dizaine si < 100, centaine sinon) pour rester marketing.
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
          members: roundToTen(data.members || 0),
        }),
      )
      .catch(() => {});
  }, []);

  return stats;
}

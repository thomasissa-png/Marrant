"use client";

import { useState, useEffect } from "react";
import { roundDownMarketing } from "@/lib/marketing-round";

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
 * Hook pour récupérer le nombre total de contenus actifs.
 * Utilisé pour afficher des compteurs dynamiques dans les CTA et upsells.
 * Les compteurs sont arrondis avec la même fonction que le serveur (marketing-round.ts).
 */
export function useContentStats() {
  const [stats, setStats] = useState<ContentStats>(DEFAULT_STATS);

  useEffect(() => {
    fetch("/api/content-stats")
      .then((res) => (res.ok ? res.json() : DEFAULT_STATS))
      .then((data) =>
        setStats({
          jokes: roundDownMarketing(data.jokes || 0),
          tips: roundDownMarketing(data.tips || 0),
          videos: roundDownMarketing(data.videos || 0),
          members: roundDownMarketing(data.members || 0),
        }),
      )
      .catch(() => {});
  }, []);

  return stats;
}

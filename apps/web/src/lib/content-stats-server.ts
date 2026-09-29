import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

import * as React from "react";

// `React.cache` n'est pas disponible dans l'environnement de test (jsdom).
// On l'utilise s'il existe, sinon fallback identité (dedup manquant en dev/test).
type CacheFn = <T extends (...a: unknown[]) => unknown>(fn: T) => T;
const reactCache: CacheFn =
  typeof (React as { cache?: CacheFn }).cache === "function"
    ? ((React as { cache: CacheFn }).cache)
    : ((fn) => fn);

/**
 * Statistiques de catalogue affichées côté UI marketing (metadata SEO, titres).
 *
 * Source de vérité unique — évite les chiffres hardcodés (290+, 60+, 80+).
 * Aligné sur `GET /api/content-stats` : compte uniquement `isActive: true`.
 * Fallback silencieux si DB indisponible (utile pour build/SSG).
 */
export interface ContentStats {
  jokes: number;
  tips: number;
  videos: number;
}

const FALLBACK: ContentStats = { jokes: 0, tips: 0, videos: 0 };

/**
 * Arrondi marketing :
 * - >= 100 → arrondi à la centaine inférieure (602 → 600, 400 → 400)
 * - <  100 → arrondi à la dizaine inférieure (89 → 80, 66 → 60)
 * - 0        → 0 (permet un fallback texte "des centaines")
 */
export function roundDownMarketing(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n >= 100) return Math.floor(n / 100) * 100;
  return Math.floor(n / 10) * 10;
}

/** Formatage `"600+"`, avec fallback texte si 0. */
export function formatCount(n: number, fallbackText: string): string {
  const rounded = roundDownMarketing(n);
  return rounded > 0 ? `${rounded}+` : fallbackText;
}

async function fetchContentStats(): Promise<ContentStats> {
  try {
    const [jokes, tips, videos] = await Promise.all([
      prisma.joke.count({ where: { isActive: true } }),
      prisma.tip.count({ where: { isActive: true } }),
      prisma.video.count({ where: { isActive: true } }),
    ]);
    return { jokes, tips, videos };
  } catch {
    return FALLBACK;
  }
}

// unstable_cache nécessite l'incrementalCache Next.js — indisponible en tests.
// On l'active seulement en runtime réel ; fallback direct sinon.
const isCacheAvailable = process.env.NODE_ENV === "production" || process.env.NEXT_RUNTIME !== undefined;

const cachedFetch = isCacheAvailable
  ? unstable_cache(fetchContentStats, ["content-stats-v1"], {
      revalidate: 300,
      tags: ["content-stats"],
    })
  : fetchContentStats;

/**
 * Cache serveur cross-requêtes (5 min) + déduplication intra-render (React.cache).
 * Utilisable dans generateMetadata et Server Components.
 */
export const getContentStatsCached = reactCache(async (): Promise<ContentStats> => {
  try {
    return await cachedFetch();
  } catch {
    // Fallback si unstable_cache crash (context manquant, tests, etc.)
    return fetchContentStats();
  }
});

/**
 * Version arrondie prête à afficher — même contrat que le hook client.
 */
export async function getContentStatsRounded(): Promise<ContentStats> {
  const raw = await getContentStatsCached();
  return {
    jokes: roundDownMarketing(raw.jokes),
    tips: roundDownMarketing(raw.tips),
    videos: roundDownMarketing(raw.videos),
  };
}

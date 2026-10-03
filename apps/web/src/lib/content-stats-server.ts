import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { jokeContentKey } from "@/lib/jokes-dedupe";
import { tipTitleKey } from "@/lib/tips-dedupe";
import { roundDownMarketing } from "@/lib/marketing-round";

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

// Arrondi : implémentation unique dans marketing-round.ts (aussi utilisée côté client).
export { roundDownMarketing, formatCount } from "@/lib/marketing-round";

/**
 * Compte les contenus actifs DISTINCTS (sans doublons), avec la même normalisation
 * que les listes affichées (/api/jokes, /api/tips) : le compteur annonce ce que
 * le visiteur peut réellement voir.
 */
export async function countDistinctContent(): Promise<ContentStats> {
  const [jokes, tips, videos] = await Promise.all([
    prisma.joke.findMany({ where: { isActive: true }, select: { content: true } }),
    prisma.tip.findMany({ where: { isActive: true }, select: { title: true } }),
    prisma.video.count({ where: { isActive: true } }),
  ]);
  return {
    jokes: new Set(jokes.map((j) => jokeContentKey(j.content))).size,
    tips: new Set(tips.map((t) => tipTitleKey(t.title))).size,
    videos,
  };
}

async function fetchContentStats(): Promise<ContentStats> {
  try {
    return await countDistinctContent();
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

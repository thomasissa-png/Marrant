import { unstable_cache } from "next/cache";
import type { JokeCategory, TipCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { dedupeJokesByContent, jokeContentKey } from "@/lib/jokes-dedupe";
import { dedupeTipsByTitle, tipTitleKey } from "@/lib/tips-dedupe";
import { ringNeighbors } from "@/lib/related-ring";

/**
 * Données du bloc « Dans la même catégorie » (s20, spec maillage S2).
 *
 * Coût base : UNE requête par catégorie et par heure, partagée par toutes les fiches
 * de la catégorie (~20 vannes, ~15 conseils, ~10 vidéos), au lieu d'une requête par
 * fiche rendue. Même mécanisme et même fraîcheur que les listes
 * (`catalogue-pages.ts` : unstable_cache, 1 h) ; sous OpenNext, unstable_cache est
 * stocké dans R2 (le contournement de l'incident s14 ne vise que les réponses HTTP
 * `fetch`, pas unstable_cache). Les listes paginées ne sont pas réutilisables telles
 * quelles : elles sont découpées par page et non par catégorie.
 *
 * Erreur base : l'exception traverse unstable_cache (jamais mise en cache) ; la fiche
 * l'attrape (`try/catch`) et s'affiche sans le bloc, comme avant.
 */

const RELATED_REVALIDATE_SECONDS = 3600; // = LIST_REVALIDATE_SECONDS (catalogue-pages)
const ORDER_BY = [{ createdAt: "desc" as const }, { id: "asc" as const }];

export interface RelatedJoke {
  id: string;
  content: string;
  category: string;
}
export interface RelatedTip {
  id: string;
  title: string;
  category: string;
}
export interface RelatedVideo {
  id: string;
  title: string;
  channelName: string;
  youtubeId: string;
}

async function loadJokesOfCategory(category: string): Promise<RelatedJoke[]> {
  const rows = await withDbRetry(
    () =>
      prisma.joke.findMany({
        where: { isActive: true, category: category as JokeCategory },
        select: { id: true, content: true, category: true },
        orderBy: ORDER_BY,
      }),
    { label: `related:jokes:${category}` },
  );
  return dedupeJokesByContent(rows).map((j) => ({ ...j, category: String(j.category) }));
}

async function loadTipsOfCategory(category: string): Promise<RelatedTip[]> {
  const rows = await withDbRetry(
    () =>
      prisma.tip.findMany({
        where: { isActive: true, category: category as TipCategory },
        select: { id: true, title: true, category: true },
        orderBy: ORDER_BY,
      }),
    { label: `related:tips:${category}` },
  );
  return dedupeTipsByTitle(rows).map((t) => ({ ...t, category: String(t.category) }));
}

async function loadVideosOfCategory(category: string): Promise<RelatedVideo[]> {
  const rows = await withDbRetry(
    () =>
      prisma.video.findMany({
        where: { isActive: true, category: category as TipCategory },
        select: { id: true, title: true, channelName: true, youtubeId: true },
        orderBy: ORDER_BY,
      }),
    { label: `related:videos:${category}` },
  );
  // youtubeId est unique en base : filet de sécurité seulement.
  const seen = new Set<string>();
  return rows.filter((v) => (seen.has(v.youtubeId) ? false : (seen.add(v.youtubeId), true)));
}

// Même garde que `catalogue-pages.ts` : pas d'incrementalCache Next en tests.
const isCacheAvailable = process.env.NODE_ENV === "production" || process.env.NEXT_RUNTIME !== undefined;

function cached<T>(fn: (category: string) => Promise<T>, key: string): (category: string) => Promise<T> {
  // La catégorie (argument) fait partie de la clé de cache unstable_cache.
  return isCacheAvailable ? unstable_cache(fn, [key], { revalidate: RELATED_REVALIDATE_SECONDS }) : fn;
}

const cachedJokes = cached(loadJokesOfCategory, "related-jokes-category-v1");
const cachedTips = cached(loadTipsOfCategory, "related-tips-category-v1");
const cachedVideos = cached(loadVideosOfCategory, "related-videos-category-v1");

/** 4 vannes voisines (anneau), jamais la vanne courante ni une copie de son contenu. */
export async function getRelatedJokes(current: { id: string; content: string; category: string }): Promise<RelatedJoke[]> {
  const key = jokeContentKey(current.content);
  const items = await cachedJokes(String(current.category));
  return ringNeighbors(items, (j) => j.id === current.id || jokeContentKey(j.content) === key);
}

/** 4 conseils voisins (anneau), jamais le conseil courant ni un conseil de même titre. */
export async function getRelatedTips(current: { id: string; title: string; category: string }): Promise<RelatedTip[]> {
  const key = tipTitleKey(current.title);
  const items = await cachedTips(String(current.category));
  return ringNeighbors(items, (t) => t.id === current.id || tipTitleKey(t.title) === key);
}

/** 4 vidéos voisines (anneau), jamais la vidéo courante. */
export async function getRelatedVideos(current: { id: string; youtubeId: string; category: string }): Promise<RelatedVideo[]> {
  const items = await cachedVideos(String(current.category));
  return ringNeighbors(items, (v) => v.id === current.id || v.youtubeId === current.youtubeId);
}

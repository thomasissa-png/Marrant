import { unstable_cache } from "next/cache";
import type { JokeCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { dedupeJokesByContent } from "@/lib/jokes-dedupe";
import { dedupeTipsByTitle } from "@/lib/tips-dedupe";
import type { CataloguePage } from "@/lib/list-pagination";
import { buildJokeSlug, buildTipSlug, buildVideoSlug } from "@/lib/catalogue-slug";
import { stripEmDashes } from "@/lib/em-dash";
import { truncateAtWord } from "@/lib/seo-meta";

/**
 * Pages serveur des listes catalogue (/vannes, /conseils, /videos), lot S1 s14 (P0-1).
 *
 * Le HTML initial de chaque liste contient les vrais liens vers les fiches, avec une
 * pagination `?page=N` crawlable. Même ordre, même dédoublonnage et même filtre
 * `isActive: true` que `/api/jokes`, `/api/tips`, `/api/videos` : la page N du HTML
 * correspond à la page N que le client affiche ensuite.
 *
 * Données PUBLIQUES uniquement (celles des fiches détail, lisibles sans compte) :
 * les champs réservés aux membres (howToApply des vannes, exercise des conseils,
 * learnings et exercise des vidéos) sont vidés. Le client recharge ensuite la page
 * via l'API, qui applique les règles freemium selon la session.
 */

export const JOKES_PAGE_SIZE = 12; // = limit de VannesList
export const TIPS_PAGE_SIZE = 10; // = limit de ConseilsList
export const VIDEOS_PAGE_SIZE = 12; // = limit de VideosGrid

// Même fraîcheur que le blog et les parcours (revalidate 3600).
const LIST_REVALIDATE_SECONDS = 3600;

export type { CataloguePage };

export interface PublicJoke {
  id: string;
  content: string;
  punchline: string;
  category: string;
  type: string;
  maturityLevel: number;
  comedyTechnique: string | null;
  techniqueExplanation: string | null;
  howToApply: string | null;
}

export interface PublicTip {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: string;
  example: string;
  exercise: string;
}

export interface PublicVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  category: string;
  difficulty: string;
  description: string;
  technique: string;
  learnings: string[];
  exercise: string | null;
}

function paginate<T>(ids: string[], page: number, limit: number) {
  const total = ids.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  return { pageIds: ids.slice(start, start + limit), total, totalPages };
}

const ORDER_BY = [{ createdAt: "desc" as const }, { id: "asc" as const }];

function loadJokesPage(page: number): Promise<CataloguePage<PublicJoke>> {
  return loadJokesPageWhere({ isActive: true }, page, "catalogue-pages:jokes");
}

/** Pages thème (lot S3b) : mêmes règles que /vannes, limitées à une catégorie. */
function loadThemeJokesPage(category: string, page: number): Promise<CataloguePage<PublicJoke>> {
  return loadJokesPageWhere(
    { isActive: true, category: category as JokeCategory },
    page,
    `catalogue-pages:jokes:${category}`,
  );
}

async function loadJokesPageWhere(
  where: Prisma.JokeWhereInput,
  page: number,
  label: string,
): Promise<CataloguePage<PublicJoke>> {
  const candidates = await withDbRetry(
    () =>
      prisma.joke.findMany({
        where,
        select: { id: true, content: true },
        orderBy: ORDER_BY,
      }),
    { label },
  );
  const uniqueIds = dedupeJokesByContent(candidates).map((c) => c.id);
  const { pageIds, total, totalPages } = paginate(uniqueIds, page, JOKES_PAGE_SIZE);
  const rows = pageIds.length
    ? await prisma.joke.findMany({
        where: { id: { in: pageIds } },
        orderBy: ORDER_BY,
        select: {
          id: true,
          content: true,
          punchline: true,
          category: true,
          type: true,
          maturityLevel: true,
          comedyTechnique: true,
          techniqueExplanation: true,
        },
      })
    : [];
  const items = rows.map((j) => ({ ...j, category: String(j.category), type: String(j.type), howToApply: null }));
  return { items, page, limit: JOKES_PAGE_SIZE, total, totalPages };
}

async function loadTipsPage(page: number): Promise<CataloguePage<PublicTip>> {
  const candidates = await withDbRetry(
    () =>
      prisma.tip.findMany({
        where: { isActive: true },
        select: { id: true, title: true },
        orderBy: ORDER_BY,
      }),
    { label: "catalogue-pages:tips" },
  );
  const uniqueIds = dedupeTipsByTitle(candidates).map((c) => c.id);
  const { pageIds, total, totalPages } = paginate(uniqueIds, page, TIPS_PAGE_SIZE);
  const rows = pageIds.length
    ? await prisma.tip.findMany({
        where: { id: { in: pageIds } },
        orderBy: ORDER_BY,
        select: { id: true, title: true, content: true, category: true, difficulty: true, example: true },
      })
    : [];
  const items = rows.map((t) => ({
    ...t,
    category: String(t.category),
    difficulty: String(t.difficulty),
    exercise: "", // Premium (fiche conseil) : fourni par l'API selon la session
  }));
  return { items, page, limit: TIPS_PAGE_SIZE, total, totalPages };
}

async function loadVideosPage(page: number): Promise<CataloguePage<PublicVideo>> {
  // Pas de dédoublonnage côté vidéos (youtubeId unique) : même logique que /api/videos.
  const total = await withDbRetry(() => prisma.video.count({ where: { isActive: true } }), {
    label: "catalogue-pages:videos",
  });
  const totalPages = Math.ceil(total / VIDEOS_PAGE_SIZE);
  const rows =
    page <= totalPages
      ? await prisma.video.findMany({
          where: { isActive: true },
          orderBy: ORDER_BY,
          skip: (page - 1) * VIDEOS_PAGE_SIZE,
          take: VIDEOS_PAGE_SIZE,
          select: {
            id: true,
            youtubeId: true,
            title: true,
            channelName: true,
            duration: true,
            category: true,
            difficulty: true,
            description: true,
            technique: true,
          },
        })
      : [];
  const items = rows.map((v) => ({
    ...v,
    category: String(v.category),
    difficulty: String(v.difficulty),
    // Réservés aux membres (fiche vidéo) : fournis par l'API selon la session.
    learnings: [],
    exercise: null,
  }));
  return { items, page, limit: VIDEOS_PAGE_SIZE, total, totalPages };
}

// unstable_cache nécessite l'incrementalCache Next.js (R2 sous OpenNext), indisponible
// en tests : même garde que `content-stats-server.ts`.
const isCacheAvailable = process.env.NODE_ENV === "production" || process.env.NEXT_RUNTIME !== undefined;

function cached<T>(fn: (page: number) => Promise<T>, key: string): (page: number) => Promise<T> {
  return isCacheAvailable ? unstable_cache(fn, [key], { revalidate: LIST_REVALIDATE_SECONDS }) : fn;
}

const cachedJokesPage = cached(loadJokesPage, "catalogue-jokes-page-v1");
const cachedTipsPage = cached(loadTipsPage, "catalogue-tips-page-v1");
const cachedVideosPage = cached(loadVideosPage, "catalogue-videos-page-v1");
// Les arguments (catégorie, page) font partie de la clé de cache unstable_cache.
const cachedThemeJokesPage = isCacheAvailable
  ? unstable_cache(loadThemeJokesPage, ["catalogue-theme-jokes-page-v1"], { revalidate: LIST_REVALIDATE_SECONDS })
  : loadThemeJokesPage;

/**
 * Erreur DB → `null` (jamais mis en cache : l'exception traverse unstable_cache).
 * La page affiche alors la liste chargée par le client, comme avant le lot S1.
 */
async function safe<T>(load: (page: number) => Promise<T>, page: number, label: string): Promise<T | null> {
  try {
    return await load(page);
  } catch (error) {
    console.error(`[catalogue-pages] ${label} page ${page} indisponible`, error);
    return null;
  }
}

export function getJokesPage(page: number): Promise<CataloguePage<PublicJoke> | null> {
  return safe(cachedJokesPage, page, "vannes");
}

/** Vannes actives d'une catégorie (pages /vannes/theme/<slug>, lot S3b). */
export function getThemeJokesPage(category: string, page: number): Promise<CataloguePage<PublicJoke> | null> {
  return safe((p) => cachedThemeJokesPage(category, p), page, `vannes-theme:${category}`);
}

export function getTipsPage(page: number): Promise<CataloguePage<PublicTip> | null> {
  return safe(cachedTipsPage, page, "conseils");
}

export function getVideosPage(page: number): Promise<CataloguePage<PublicVideo> | null> {
  return safe(cachedVideosPage, page, "videos");
}

const HOME_EXAMPLES_PER_CARD = 2;
const HOME_EXAMPLE_LABEL_MAX = 90;

function exampleLabel(text: string): string {
  return truncateAtWord(stripEmDashes(text), HOME_EXAMPLE_LABEL_MAX);
}

/**
 * Liens de l'accueil vers des fiches réelles (vannes, conseils, vidéos les plus
 * récentes, mêmes données que la page 1 des listes). Base indisponible : listes vides.
 */
export async function getHomeFeatureExamples(): Promise<{ href: string; label: string }[][]> {
  const [jokes, tips, videos] = await Promise.all([getJokesPage(1), getTipsPage(1), getVideosPage(1)]);
  return [
    (jokes?.items ?? []).slice(0, HOME_EXAMPLES_PER_CARD).map((j) => ({
      href: `/vannes/${buildJokeSlug(j)}`,
      label: exampleLabel(j.content),
    })),
    (tips?.items ?? []).slice(0, HOME_EXAMPLES_PER_CARD).map((t) => ({
      href: `/conseils/${buildTipSlug(t)}`,
      label: exampleLabel(t.title),
    })),
    (videos?.items ?? []).slice(0, HOME_EXAMPLES_PER_CARD).map((v) => ({
      href: `/videos/${buildVideoSlug(v)}`,
      label: exampleLabel(v.title),
    })),
  ];
}

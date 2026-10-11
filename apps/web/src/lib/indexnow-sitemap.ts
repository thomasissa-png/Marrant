/**
 * IndexNow pour tout le site (s15) : le cron hebdo `weekly-seo` notifie les
 * URL du sitemap dont le `lastmod` a moins de 8 jours (vannes, conseils,
 * vidéos, parcours, pages thème, articles…), en un seul POST.
 *
 * Source unique : la fonction sitemap() elle-même (mêmes URL, mêmes dates que
 * ce que lisent les moteurs), jamais de self-fetch vers /sitemap.xml.
 */
import sitemap from "@/app/sitemap";
import { submitToIndexNow, type IndexNowResult } from "@/lib/indexnow";

/** Fenêtre : 8 jours (cron hebdo + 1 jour de marge si un lundi saute). */
export const INDEXNOW_RECENT_DAYS = 8;
/** Limite de la spécification IndexNow : 10 000 URL par POST. */
export const INDEXNOW_MAX_URLS_PER_POST = 10_000;

const DAY_MS = 24 * 60 * 60 * 1000;

function toTime(value: string | Date | undefined): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

/** URL du sitemap modifiées dans les `days` derniers jours, les plus récentes d'abord. */
export async function getRecentSitemapUrls(
  now: Date = new Date(),
  days: number = INDEXNOW_RECENT_DAYS,
): Promise<string[]> {
  const since = now.getTime() - days * DAY_MS;
  const entries = await sitemap();
  return entries
    .map((entry) => ({ url: entry.url, time: toTime(entry.lastModified) }))
    .filter((entry): entry is { url: string; time: number } => entry.time !== null && entry.time >= since)
    .sort((a, b) => b.time - a.time)
    .slice(0, INDEXNOW_MAX_URLS_PER_POST)
    .map((entry) => entry.url);
}

export type RecentSitemapNotification =
  | { submitted: 0; reason: "none-recent" }
  | { submitted: number; result: IndexNowResult };

/** Soumet les URL récentes (non bloquant : erreurs journalisées, jamais levées). */
export async function notifyRecentSitemapUrls(now: Date = new Date()): Promise<RecentSitemapNotification> {
  const urls = await getRecentSitemapUrls(now);
  if (urls.length === 0) return { submitted: 0, reason: "none-recent" };
  const result = await submitToIndexNow(urls);
  return { submitted: result.ok ? result.submitted : 0, result };
}

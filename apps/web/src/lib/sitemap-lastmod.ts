/**
 * Dates `lastmod` du sitemap (s20, spec maillage S5, `docs/seo/maillage-decouverte-s20.md` §4).
 * Module pur : testable sans base.
 */

const DAY_MS = 86_400_000;

/** Début du jour UTC suivant : borne haute exclusive de « aujourd'hui (UTC) ». */
export function startOfTomorrowUtc(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
}

/**
 * Un `lastmod` futur est invalide (Google l'ignore, Bing le pénalise). Date
 * postérieure à aujourd'hui (UTC) → début du jour UTC (stable sur la journée, pas
 * d'horodatage qui bouge à chaque lecture). Dates passées renvoyées telles quelles.
 */
export function capLastModToToday(value: Date | string | undefined, now: Date): Date | string | undefined {
  if (value === undefined) return value;
  const date = value instanceof Date ? value : new Date(value);
  const tomorrow = startOfTomorrowUtc(now);
  if (Number.isNaN(date.getTime()) || date.getTime() < tomorrow.getTime()) return value;
  return new Date(tomorrow.getTime() - DAY_MS);
}

export interface BlogDateCandidate {
  /** Date de publication (article statique : minuit UTC du jour indiqué). */
  publishedAt: Date;
  /** Publication ou modification réelle (celle déjà utilisée pour la fiche article). */
  lastModified: Date;
}

/**
 * `lastmod` de `/blog` : celui de l'article visible le plus récemment publié
 * (sa modification réelle si elle existe, sinon sa publication). Articles datés
 * du futur ignorés. Aucun article : `fallback`.
 */
export function blogIndexLastMod(candidates: readonly BlogDateCandidate[], now: Date, fallback: Date): Date {
  const limit = startOfTomorrowUtc(now).getTime();
  let latest: BlogDateCandidate | null = null;
  for (const c of candidates) {
    if (Number.isNaN(c.publishedAt.getTime()) || c.publishedAt.getTime() >= limit) continue;
    if (!latest || c.publishedAt.getTime() > latest.publishedAt.getTime()) latest = c;
  }
  if (!latest) return fallback;
  return capLastModToToday(latest.lastModified, now) as Date;
}

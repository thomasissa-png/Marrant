/**
 * Limitation de débit.
 *
 * - `rateLimit` (synchrone, en mémoire) : propre à chaque isolat Workers, donc
 *   NON fiable en prod. Gardé pour les appelants historiques (checkout, xp,
 *   parcours, admin, cron) et comme repli de `sharedRateLimit`.
 * - `sharedRateLimit` (s16, reco 14) : compteur partagé entre tous les isolats
 *   et toutes les régions, stocké dans Postgres (table `JobLock`, même principe
 *   que `persistent-quota.ts`, aucune migration). Fenêtre glissante exacte (les
 *   bindings Workers Rate Limiting ne connaissent que des périodes de 10 ou
 *   60 s, et comptent par point de présence).
 *   Lot H (P2-1) : comptage ATOMIQUE. Chaque clé dispose de `maxRequests`
 *   créneaux (`rl:<scope>:<hash>:<n>`) ; une tentative prend un créneau libre
 *   ou expiré en UNE requête `INSERT … ON CONFLICT DO UPDATE … WHERE expiré`
 *   (verrou de ligne Postgres) : deux requêtes simultanées ne peuvent jamais
 *   prendre le même créneau, donc jamais plus de `maxRequests` acceptées.
 *   Créneau disputé et perdu : nouvel essai (3 au plus), sinon refus.
 *   La clé (e-mail, IP) est hachée : aucune donnée personnelle en base.
 *   Base indisponible → repli sur le compteur en mémoire (jamais de blocage
 *   global d'un formulaire à cause d'une panne du limiteur).
 */
import { createHash, randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Nettoyage périodique (toutes les 5 minutes). `unref` : ne retient pas Node/jest.
const cleanupTimer: unknown = setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  });
}, 5 * 60 * 1000);
(cleanupTimer as { unref?: () => void }).unref?.();

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.maxRequests - 1, resetAt: now + options.windowMs };
  }

  if (entry.count >= options.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: options.maxRequests - entry.count, resetAt: entry.resetAt };
}

const SHARED_PREFIX = "rl:";

/** Empreinte courte et non réversible de la clé (e-mail, IP). */
export function hashRateLimitKey(key: string): string {
  return createHash("sha256").update(key).digest("hex").slice(0, 32);
}

/**
 * IP du client. Sous Cloudflare, `cf-connecting-ip` est posé par Cloudflare et
 * écrase toute valeur envoyée par le client ; `x-forwarded-for` est ignoré car
 * le client peut le choisir. Hors Cloudflare (dev local, jest) : clé "local".
 */
export function getClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const raw =
    headers instanceof Headers
      ? headers.get("cf-connecting-ip")
      : headers["cf-connecting-ip"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const ip = value?.trim();
  return ip ? ip : "local";
}

/**
 * Prend un créneau libre (absent ou expiré) en une seule requête atomique.
 * `libres` = créneaux libres vus au début de la requête ; `pris` = 1 si un
 * créneau a été obtenu. libres > 0 et pris = 0 : créneau disputé, à rejouer.
 */
async function prendreCreneau(
  prefix: string,
  max: number,
  now: Date,
  expiresAt: Date,
): Promise<{ libres: number; pris: number }> {
  const rows = await prisma.$queryRaw<Array<{ libres: number; pris: number }>>(Prisma.sql`
    WITH libres AS (
      SELECT s.n FROM generate_series(0, ${max - 1}::int) AS s(n)
      LEFT JOIN "JobLock" j
        ON j."jobKey" = ${prefix}::text || s.n::text
       AND j."expiresAt" > (${now.toISOString()}::timestamptz AT TIME ZONE 'UTC')
      WHERE j."id" IS NULL
    ), ins AS (
      INSERT INTO "JobLock" ("id", "jobKey", "acquiredAt", "expiresAt")
      SELECT ${randomUUID()}::text, ${prefix}::text || l.n::text,
             (${now.toISOString()}::timestamptz AT TIME ZONE 'UTC'),
             (${expiresAt.toISOString()}::timestamptz AT TIME ZONE 'UTC')
      FROM (SELECT n FROM libres ORDER BY n LIMIT 1) AS l
      ON CONFLICT ("jobKey") DO UPDATE
        SET "acquiredAt" = EXCLUDED."acquiredAt", "expiresAt" = EXCLUDED."expiresAt"
        WHERE "JobLock"."expiresAt" <= EXCLUDED."acquiredAt"
      RETURNING 1
    )
    SELECT (SELECT count(*) FROM libres)::int AS libres, (SELECT count(*) FROM ins)::int AS pris
  `);
  return { libres: Number(rows[0]?.libres ?? 0), pris: Number(rows[0]?.pris ?? 0) };
}

/** Limiteur partagé (voir en-tête). `scope` = usage (login-email, register-ip…). */
export async function sharedRateLimit(
  scope: string,
  key: string,
  options: RateLimitOptions,
  nowMs: number = Date.now()
): Promise<RateLimitResult> {
  const prefix = `${SHARED_PREFIX}${scope}:${hashRateLimitKey(key)}:`;
  const now = new Date(nowMs);
  const resetAt = nowMs + options.windowMs;
  try {
    // Ménage opportuniste des tentatives expirées (tous scopes confondus).
    await prisma.jobLock.deleteMany({
      where: { jobKey: { startsWith: SHARED_PREFIX }, expiresAt: { lt: now } },
    });
    for (let essai = 0; essai < 3; essai++) {
      const { libres, pris } = await prendreCreneau(prefix, options.maxRequests, now, new Date(resetAt));
      if (pris > 0) return { allowed: true, remaining: Math.max(0, libres - 1), resetAt };
      if (libres === 0) break;
    }
    const oldest = await prisma.jobLock.findFirst({
      where: { jobKey: { startsWith: prefix }, expiresAt: { gt: now } },
      orderBy: { expiresAt: "asc" },
      select: { expiresAt: true },
    });
    return { allowed: false, remaining: 0, resetAt: oldest?.expiresAt.getTime() ?? resetAt };
  } catch (err) {
    console.error(`[rate-limit] Stockage partagé indisponible (${scope}), repli mémoire :`, err);
    return rateLimit(`${scope}:${key}`, options);
  }
}

/** Secondes à attendre avant de réessayer (en-tête Retry-After), minimum 1. */
export function retryAfterSeconds(result: RateLimitResult, nowMs: number = Date.now()): number {
  return Math.max(1, Math.ceil((result.resetAt - nowMs) / 1000));
}

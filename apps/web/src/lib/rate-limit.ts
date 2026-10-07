/**
 * Limitation de débit.
 *
 * - `rateLimit` (synchrone, en mémoire) : propre à chaque isolat Workers, donc
 *   NON fiable en prod. Gardé pour les appelants historiques (checkout, xp,
 *   parcours, admin, cron) et comme repli de `sharedRateLimit`.
 * - `sharedRateLimit` (s16, reco 14) : compteur partagé entre tous les isolats
 *   et toutes les régions, stocké dans Postgres (table `JobLock`, même principe
 *   que `persistent-quota.ts`, aucune migration). Une ligne par tentative,
 *   clé `rl:<scope>:<hash de la clé>:<uuid>`, expirée à la fin de la fenêtre :
 *   fenêtre glissante exacte (les bindings Workers Rate Limiting ne connaissent
 *   que des périodes de 10 ou 60 s, et comptent par point de présence).
 *   La clé (e-mail, IP) est hachée : aucune donnée personnelle en base.
 *   Base indisponible → repli sur le compteur en mémoire (jamais de blocage
 *   global d'un formulaire à cause d'une panne du limiteur).
 */
import { createHash, randomUUID } from "crypto";
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

/** Limiteur partagé (voir en-tête). `scope` = usage (login-email, register-ip…). */
export async function sharedRateLimit(
  scope: string,
  key: string,
  options: RateLimitOptions,
  nowMs: number = Date.now()
): Promise<RateLimitResult> {
  const prefix = `${SHARED_PREFIX}${scope}:${hashRateLimitKey(key)}:`;
  const now = new Date(nowMs);
  try {
    // Ménage opportuniste des tentatives expirées (tous scopes confondus).
    await prisma.jobLock.deleteMany({
      where: { jobKey: { startsWith: SHARED_PREFIX }, expiresAt: { lt: now } },
    });
    const live = { jobKey: { startsWith: prefix }, expiresAt: { gt: now } };
    const used = await prisma.jobLock.count({ where: live });
    if (used >= options.maxRequests) {
      const oldest = await prisma.jobLock.findFirst({
        where: live,
        orderBy: { expiresAt: "asc" },
        select: { expiresAt: true },
      });
      return {
        allowed: false,
        remaining: 0,
        resetAt: oldest?.expiresAt.getTime() ?? nowMs + options.windowMs,
      };
    }
    const resetAt = nowMs + options.windowMs;
    await prisma.jobLock.create({
      data: { jobKey: `${prefix}${randomUUID()}`, acquiredAt: now, expiresAt: new Date(resetAt) },
    });
    return { allowed: true, remaining: options.maxRequests - used - 1, resetAt };
  } catch (err) {
    console.error(`[rate-limit] Stockage partagé indisponible (${scope}), repli mémoire :`, err);
    return rateLimit(`${scope}:${key}`, options);
  }
}

/** Secondes à attendre avant de réessayer (en-tête Retry-After), minimum 1. */
export function retryAfterSeconds(result: RateLimitResult, nowMs: number = Date.now()): number {
  return Math.max(1, Math.ceil((result.resetAt - nowMs) / 1000));
}

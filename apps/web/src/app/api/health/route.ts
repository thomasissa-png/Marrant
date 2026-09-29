/**
 * GET /api/health — sonde de disponibilité et de fraîcheur des contenus.
 *
 * Trois blocs d'observation :
 *   1. **Base de données** : requête `SELECT 1` avec timeout court (2s). Si
 *      elle échoue, l'endpoint répond 503 (statut "down") — le reste des
 *      checks n'est pas exécuté car dépendant de la DB.
 *   2. **Fraîcheur des contenus** : date du dernier item pour chaque type
 *      (vanne, conseil, vidéo, article blog, log LLM succès). Seuils
 *      configurables — un contenu vieux de plus de 3 jours passe en
 *      `degraded`. C'est LE signal qui aurait détecté l'incident sonnet-4.
 *   3. **Configuration IA** : modèles Sonnet/Haiku résolus (env override
 *      compris). Aucun secret n'est retourné.
 *
 * Réponse volontairement JSON stable pour un monitoring externe
 * (UptimeRobot, BetterStack) — champ `status` = "ok" | "degraded" | "down".
 * Codes HTTP : 200 (ok/degraded) — 503 (down). Un monitoring peut se caler
 * sur le code HTTP OU sur le champ `status` selon sa granularité.
 *
 * `dynamic = "force-dynamic"` : jamais mis en cache par Next, chaque appel
 * exécute réellement les requêtes DB.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SONNET_MODEL, OPUS_MODEL, DEFAULT_EFFORT } from "@/lib/ai/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Un contenu plus ancien que ce seuil dégrade le statut. On tolère 3 jours
// pour absorber un weekend de cron cassé, mais pas plus.
const CONTENT_FRESHNESS_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000;

// Un dernier log LLM succès trop ancien = les pipelines ne tournent plus.
// Seuil plus court car le pipeline daily-content tourne tous les jours.
const LLM_FRESHNESS_THRESHOLD_MS = 2 * 24 * 60 * 60 * 1000;

// Timeout du check DB. Si la requête met > 2s, on considère que la DB est
// dégradée (Neon cold start pathologique).
const DB_TIMEOUT_MS = 2_000;

interface FreshnessCheck {
  lastSeenAt: string | null;
  ageMs: number | null;
  status: "ok" | "stale" | "empty";
}

interface HealthPayload {
  status: "ok" | "degraded" | "down";
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: "up" | "down";
      latencyMs: number | null;
      error?: string;
    };
    content: {
      joke: FreshnessCheck;
      tip: FreshnessCheck;
      video: FreshnessCheck;
      blogArticle: FreshnessCheck;
      llmSuccess: FreshnessCheck;
    } | null;
    ai: {
      sonnetModel: string;
      opusModel: string;
      defaultEffort: string;
      sonnetOverridden: boolean;
      opusOverridden: boolean;
      effortOverridden: boolean;
    };
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout après ${ms}ms`)), ms),
    ),
  ]);
}

function buildFreshness(
  lastSeenAt: Date | null | undefined,
  thresholdMs: number,
  now: number,
): FreshnessCheck {
  if (!lastSeenAt) {
    return { lastSeenAt: null, ageMs: null, status: "empty" };
  }
  const ageMs = now - lastSeenAt.getTime();
  return {
    lastSeenAt: lastSeenAt.toISOString(),
    ageMs,
    status: ageMs > thresholdMs ? "stale" : "ok",
  };
}

export async function GET() {
  const startedAt = Date.now();
  const now = Date.now();

  // 1. Check DB — priorité absolue, coupe tout le reste si down.
  let dbStatus: HealthPayload["checks"]["database"] = {
    status: "up",
    latencyMs: null,
  };
  try {
    const dbStart = Date.now();
    await withTimeout(prisma.$queryRaw`SELECT 1`, DB_TIMEOUT_MS);
    dbStatus = { status: "up", latencyMs: Date.now() - dbStart };
  } catch (err) {
    dbStatus = {
      status: "down",
      latencyMs: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // Config IA — toujours retournée, ne dépend pas de la DB.
  const aiConfig = {
    sonnetModel: SONNET_MODEL,
    opusModel: OPUS_MODEL,
    defaultEffort: DEFAULT_EFFORT,
    sonnetOverridden: !!process.env.ANTHROPIC_SONNET_MODEL,
    opusOverridden: !!process.env.ANTHROPIC_OPUS_MODEL,
    effortOverridden: !!process.env.ANTHROPIC_EFFORT,
  };

  // Si la DB est down, on répond 503 immédiatement sans les autres checks.
  if (dbStatus.status === "down") {
    const payload: HealthPayload = {
      status: "down",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbStatus,
        content: null,
        ai: aiConfig,
      },
    };
    return NextResponse.json(payload, { status: 503 });
  }

  // 2. Fraîcheur des contenus — en parallèle pour minimiser la latence.
  const [
    lastJoke,
    lastTip,
    lastVideo,
    lastArticle,
    lastLlmSuccess,
  ] = await Promise.all([
    prisma.joke.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }).catch(() => null),
    prisma.tip.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }).catch(() => null),
    prisma.video.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }).catch(() => null),
    prisma.blogArticle.findFirst({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      select: { publishedAt: true },
    }).catch(() => null),
    prisma.llmUsageLog.findFirst({
      where: { success: true },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }).catch(() => null),
  ]);

  const content = {
    joke: buildFreshness(lastJoke?.createdAt, CONTENT_FRESHNESS_THRESHOLD_MS, now),
    tip: buildFreshness(lastTip?.createdAt, CONTENT_FRESHNESS_THRESHOLD_MS, now),
    video: buildFreshness(lastVideo?.createdAt, CONTENT_FRESHNESS_THRESHOLD_MS, now),
    blogArticle: buildFreshness(
      lastArticle?.publishedAt,
      // Blog = 1 article/semaine, seuil plus large
      7 * 24 * 60 * 60 * 1000,
      now,
    ),
    llmSuccess: buildFreshness(
      lastLlmSuccess?.createdAt,
      LLM_FRESHNESS_THRESHOLD_MS,
      now,
    ),
  };

  // Statut global : degraded si au moins un check content stale / empty
  const anyStale = Object.values(content).some(
    (c) => c.status === "stale" || c.status === "empty",
  );
  const globalStatus: HealthPayload["status"] = anyStale ? "degraded" : "ok";

  const payload: HealthPayload = {
    status: globalStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: dbStatus,
      content,
      ai: aiConfig,
    },
  };

  // Log léger côté serveur pour un run manuel — utile en debug Replit.
  if (globalStatus !== "ok") {
    console.warn(
      `[health] status=${globalStatus} — DB ${dbStatus.status} en ${Date.now() - startedAt}ms`,
    );
  }

  return NextResponse.json(payload, { status: 200 });
}

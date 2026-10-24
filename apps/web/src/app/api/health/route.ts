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
 *      s21 (18/10/2026) : depuis le 01/10 ([CHOIX UTILISATEUR], génération
 *      coupée, `CONTENT_GENERATION_ENABLED` ≠ "true"), le contenu du jour vient
 *      d'un stock préparé ; dater la dernière création n'a plus de sens. En
 *      mode stock, le statut repose sur : DailyContent du jour présent
 *      (`dailyToday`), stock jamais servi ≥ 14 jours (`stock`) et dernier
 *      article (`blogArticle`). Les fraîcheurs joke/tip/video/llmSuccess
 *      restent affichées, à titre d'information (`countedInStatus` liste ce
 *      qui compte). Génération activée : comportement d'avant, inchangé.
 *   3. **Configuration IA** : modèles Sonnet/Haiku résolus (env override
 *      compris). Aucun secret n'est retourné.
 *
 * s16 (07/10/2026) : bloc `critical` séparé du contenu. Critique = base +
 * Stripe (clé, secret webhook, prix mensuel) + Resend configurés (formats
 * attendus, jamais la valeur). Une panne critique donne `status: "down"` et
 * HTTP 503 ; un contenu périmé ne donne plus que `contentStatus: "degraded"`
 * (et `status: "degraded"` en 200), il ne peut donc plus masquer une panne
 * critique. Une sonde externe se cale sur le code HTTP.
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
import { todayUTC } from "@/lib/ai/date-utils";
import {
  getStockCoverage,
  isContentGenerationEnabled,
  type StockCoverage,
} from "@/lib/scheduler/prepared-content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Un contenu plus ancien que ce seuil dégrade le statut. On tolère 3 jours
// pour absorber un weekend de cron cassé, mais pas plus.
const CONTENT_FRESHNESS_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000;

// Un dernier log LLM succès trop ancien = les pipelines ne tournent plus.
// Seuil plus court car le pipeline daily-content tourne tous les jours.
const LLM_FRESHNESS_THRESHOLD_MS = 2 * 24 * 60 * 60 * 1000;

// Vidéos : ajoutées au plus 1×/mois (cron monthly-videos), pas chaque jour —
// le seuil de 3 j marquait la santé "degraded" en permanence (relecture s11).
const VIDEO_FRESHNESS_THRESHOLD_MS = 35 * 24 * 60 * 60 * 1000;

// Mode stock : le cron daily-content tourne à 5 h UTC (et le scheduler comble
// un trou à chaque quart d'heure) ; passé 7 h UTC (marge), le DailyContent du
// jour doit exister. Avant 7 h UTC, celui de la veille suffit.
const DAILY_CONTENT_DEADLINE_HOUR_UTC = 7;

// Mode stock : seuil du stock neuf (STOCK_MIN_DAYS = 14 j) et calcul dans
// getStockCoverage (prepared-content), partagés avec le rapport du lundi.

const DAY_MS = 24 * 60 * 60 * 1000;

// Timeout du check DB. Si la requête met > 2s, on considère que la DB est
// dégradée (Neon cold start pathologique).
const DB_TIMEOUT_MS = 2_000;

interface FreshnessCheck {
  lastSeenAt: string | null;
  ageMs: number | null;
  status: "ok" | "stale" | "empty";
}

interface DailyTodayCheck {
  /** Date UTC du jour (todayUTC). */
  date: string;
  /** Date effectivement trouvée (jour, ou veille avant 7 h UTC), null si aucune. */
  foundDate: string | null;
  status: "ok" | "stale";
}

interface StockCheck extends StockCoverage {
  /** Comportement à 0 : le site se répète, il ne casse pas. */
  note: string;
}

interface ContentChecks {
  /** "stock" = génération coupée (contenu préparé), "generation" = IA au fil de l'eau. */
  mode: "stock" | "generation";
  /** Clés qui comptent dans contentStatus ; les autres sont informatives. */
  countedInStatus: string[];
  joke: FreshnessCheck;
  tip: FreshnessCheck;
  video: FreshnessCheck;
  blogArticle: FreshnessCheck;
  llmSuccess: FreshnessCheck;
  dailyToday?: DailyTodayCheck;
  stock?: StockCheck;
}

interface CriticalChecks {
  status: "ok" | "down";
  database: "up" | "down";
  stripe: {
    secretKey: boolean;
    mode: "live" | "test" | null;
    webhookSecret: boolean;
    monthlyPrice: boolean;
    annualPrice: boolean;
  };
  resend: { apiKey: boolean };
  /** Libellés des éléments critiques en échec (vide si ok). */
  failures: string[];
}

interface HealthPayload {
  status: "ok" | "degraded" | "down";
  contentStatus: "ok" | "degraded" | "unknown";
  timestamp: string;
  uptime: number;
  critical: CriticalChecks;
  checks: {
    database: {
      status: "up" | "down";
      latencyMs: number | null;
      error?: string;
    };
    content: ContentChecks | null;
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

/** Valeur présente, au bon format, et pas un placeholder (jamais retournée). */
function looksSet(value: string | undefined, prefixes: string[]): boolean {
  if (!value) return false;
  const v = value.trim();
  if (v.length < 12 || /x{4,}|\.\.\.|placeholder|changeme|your_/i.test(v)) return false;
  return prefixes.some((p) => v.startsWith(p));
}

function criticalChecks(database: "up" | "down"): CriticalChecks {
  const key = process.env.STRIPE_SECRET_KEY;
  const stripe = {
    secretKey: looksSet(key, ["sk_live_", "sk_test_", "rk_live_", "rk_test_"]),
    mode: key?.includes("_live_") ? ("live" as const) : key?.includes("_test_") ? ("test" as const) : null,
    webhookSecret: looksSet(process.env.STRIPE_WEBHOOK_SECRET, ["whsec_"]),
    monthlyPrice: looksSet(process.env.STRIPE_PREMIUM_PRICE_ID, ["price_"]),
    // L'annuel peut être volontairement absent (503 propre au checkout) : non bloquant.
    annualPrice: looksSet(process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID, ["price_"]),
  };
  const resend = { apiKey: looksSet(process.env.RESEND_API_KEY, ["re_"]) };
  const failures = [
    database === "down" ? "base de données" : null,
    stripe.secretKey ? null : "STRIPE_SECRET_KEY",
    stripe.webhookSecret ? null : "STRIPE_WEBHOOK_SECRET",
    stripe.monthlyPrice ? null : "STRIPE_PREMIUM_PRICE_ID",
    resend.apiKey ? null : "RESEND_API_KEY",
  ].filter((f): f is string => f !== null);
  return { status: failures.length ? "down" : "ok", database, stripe, resend, failures };
}

/** Mode stock : DailyContent du jour (ou de la veille avant 7 h UTC). */
async function checkDailyToday(now: number): Promise<DailyTodayCheck> {
  const today = todayUTC();
  const yesterday = new Date(today.getTime() - DAY_MS);
  const beforeDeadline = new Date(now).getUTCHours() < DAILY_CONTENT_DEADLINE_HOUR_UTC;
  const rows = await prisma.dailyContent
    .findMany({ where: { date: { in: [today, yesterday] } }, select: { date: true } })
    .catch(() => null);
  const has = (d: Date) => rows?.some((r) => r.date.getTime() === d.getTime()) ?? false;
  const found = has(today) ? today : beforeDeadline && has(yesterday) ? yesterday : null;
  return {
    date: today.toISOString().slice(0, 10),
    foundDate: found ? found.toISOString().slice(0, 10) : null,
    status: found ? "ok" : "stale",
  };
}

/** Mode stock : calcul partagé avec le rapport du lundi (prepared-content). */
async function checkStock(): Promise<StockCheck> {
  return {
    ...(await getStockCoverage(todayUTC())),
    note: "À 0, le cron recycle d'anciennes vannes et d'anciens conseils : le site se répète, il ne casse pas. Vidéos recyclées par conception (sans seuil).",
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
      contentStatus: "unknown",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      critical: criticalChecks("down"),
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
      // publishedAt <= now : un article programmé (même publié trop tôt par
      // erreur) ne masque pas une semaine sans article ; nulls exclus (Postgres
      // les trie en tête d'un ORDER BY DESC).
      where: { isPublished: true, publishedAt: { lte: new Date(now) } },
      orderBy: { publishedAt: "desc" },
      select: { publishedAt: true },
    }).catch(() => null),
    prisma.llmUsageLog.findFirst({
      where: { success: true },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }).catch(() => null),
  ]);

  const generationEnabled = isContentGenerationEnabled();
  const content: ContentChecks = {
    mode: generationEnabled ? "generation" : "stock",
    countedInStatus: generationEnabled
      ? ["joke", "tip", "video", "blogArticle", "llmSuccess"]
      : ["dailyToday", "stock", "blogArticle"],
    joke: buildFreshness(lastJoke?.createdAt, CONTENT_FRESHNESS_THRESHOLD_MS, now),
    tip: buildFreshness(lastTip?.createdAt, CONTENT_FRESHNESS_THRESHOLD_MS, now),
    video: buildFreshness(lastVideo?.createdAt, VIDEO_FRESHNESS_THRESHOLD_MS, now),
    blogArticle: buildFreshness(
      lastArticle?.publishedAt,
      // Blog = 1 article/semaine, seuil plus large
      7 * DAY_MS,
      now,
    ),
    llmSuccess: buildFreshness(
      lastLlmSuccess?.createdAt,
      LLM_FRESHNESS_THRESHOLD_MS,
      now,
    ),
  };
  const stockChecks = generationEnabled
    ? null
    : await Promise.all([checkDailyToday(now), checkStock()]);
  if (stockChecks) [content.dailyToday, content.stock] = stockChecks;

  // Statut contenu : degraded si au moins un check COMPTÉ est stale / empty.
  const countedChecks: { status: string }[] = stockChecks
    ? [...stockChecks, content.blogArticle]
    : [content.joke, content.tip, content.video, content.blogArticle, content.llmSuccess];
  const anyStale = countedChecks.some((c) => c.status === "stale" || c.status === "empty");
  const contentStatus: HealthPayload["contentStatus"] = anyStale ? "degraded" : "ok";
  const critical = criticalChecks("up");
  const globalStatus: HealthPayload["status"] =
    critical.status === "down" ? "down" : contentStatus === "degraded" ? "degraded" : "ok";

  const payload: HealthPayload = {
    status: globalStatus,
    contentStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    critical,
    checks: {
      database: dbStatus,
      content,
      ai: aiConfig,
    },
  };

  // Log léger côté serveur pour un run manuel — utile en debug Replit.
  if (globalStatus !== "ok") {
    console.warn(
      `[health] status=${globalStatus} (critique ${critical.status}${critical.failures.length ? ` : ${critical.failures.join(", ")}` : ""}, contenu ${contentStatus}) en ${Date.now() - startedAt}ms`,
    );
  }

  return NextResponse.json(payload, { status: critical.status === "down" ? 503 : 200 });
}

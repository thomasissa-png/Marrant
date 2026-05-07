import { NextResponse } from "next/server";
import type { SocialPlatform } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  isBufferConfigured,
  getBufferScheduledPosts,
} from "@/lib/social/buffer-client";

/**
 * CRON — Suivi des posts sociaux et nettoyage.
 * Tourne via Replit Scheduled Deployments.
 *
 * Avec Buffer, les analytics détaillées (impressions, likes, etc.)
 * sont consultables directement dans le dashboard Buffer.
 *
 * Ce cron fait :
 * 1. Vérifie l'état de la queue Buffer (posts schedulés)
 * 2. Marque les posts APPROVED vieux de +48h comme FAILED (stuck)
 * 3. Calcule les performances par plateforme, format et persona (7j)
 * 4. Identifie les top 3 posts par directorScore (7j)
 * 5. Retourne un résumé complet pour monitoring
 *
 * Hotfix s10 (06/05/2026) — bug Buffer rate limit 24h en boucle :
 * (a) Time gate utcHour : exécution effective 1× par 2h max (utcHour pair)
 * (b) Cache module-level 60 min sur getBufferScheduledPosts() pour amortir les appels
 * (c) Circuit breaker : skip lecture queue Buffer si plateformes en rate limit 24h
 *     (réutilise le pattern recentRateLimits de publish-social/route.ts)
 *
 * Voir REPLIT_ACTIONS.md (s10) — réduire la fréquence Replit Scheduled de 15 min vers 1-2h.
 */

// ─── Cache module-level pour la queue Buffer (TTL 60 min) ─────────────
// Amortit la pression sur l'API Buffer même si le cron est appelé toutes
// les 15 min par Replit Scheduled Deployments.
type BufferQueueCache = {
  count: number;
  cachedAt: number;
};
const BUFFER_QUEUE_CACHE_TTL_MS = 60 * 60 * 1000; // 60 min
let bufferQueueCache: BufferQueueCache | null = null;

/**
 * Reset du cache — exposé pour les tests uniquement.
 * Ne JAMAIS appeler en production.
 */
export function __resetBufferQueueCacheForTests() {
  bufferQueueCache = null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── (a) Time gate horaire interne ────────────────────────────────
  // Replit Scheduled Deployments peut déclencher toutes les 15 min, mais
  // la lecture queue Buffer ne change pas significativement à cette fréquence.
  // On n'exécute le travail lourd que toutes les 2h (utcHour pair) — le reste
  // du temps on retourne immédiatement (skipped:true).
  // Bypass possible avec ?force=1 pour debug manuel.
  const now = new Date();
  const utcHour = now.getUTCHours();
  const force = searchParams.get("force") === "1";
  if (!force && utcHour % 2 !== 0) {
    return NextResponse.json({
      skipped: true,
      reason: `time-gate utcHour=${utcHour} (exécution toutes les 2h, heures paires)`,
    });
  }

  try {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const cooldownWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // ─── (c) Circuit breaker — détecter les plateformes en rate limit 24h ─
    // Réutilise le pattern de publish-social/route.ts. Si une plateforme a
    // pris un 429 dans les 24h, on ne ré-interroge PAS Buffer pour elle —
    // c'est ce qui relançait la fenêtre 24h en boucle.
    const recentRateLimits = await prisma.socialPost.findMany({
      where: {
        status: "FAILED",
        updatedAt: { gte: cooldownWindow },
        directorNote: { contains: "429" },
      },
      select: { platform: true },
      distinct: ["platform"],
    });
    const blockedPlatforms = new Set<SocialPlatform>(
      recentRateLimits.map((p) => p.platform),
    );
    const allPlatforms: SocialPlatform[] = ["TWITTER", "LINKEDIN", "INSTAGRAM"];
    const allBlocked = allPlatforms.every((p) => blockedPlatforms.has(p));

    if (blockedPlatforms.size > 0) {
      console.log(
        `[SocialAnalytics] Circuit breaker actif — plateformes bloquées 24h : ${[...blockedPlatforms].join(", ")}`,
      );
    }

    // Stats des posts récents
    const [published, failed, pending, stuck] = await Promise.all([
      prisma.socialPost.count({
        where: { status: "PUBLISHED", publishedAt: { gte: sevenDaysAgo } },
      }),
      prisma.socialPost.count({
        where: { status: "FAILED", createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.socialPost.count({
        where: { status: "APPROVED" },
      }),
      // Posts APPROVED dont le scheduledAt est passé depuis +48h ET créés il y a +48h = stuck
      prisma.socialPost.count({
        where: {
          status: "APPROVED",
          scheduledAt: { lte: fortyEightHoursAgo },
          createdAt: { lte: fortyEightHoursAgo },
        },
      }),
    ]);

    // Marquer les posts stuck comme FAILED
    let cleaned = 0;
    if (stuck > 0) {
      const result = await prisma.socialPost.updateMany({
        where: {
          status: "APPROVED",
          scheduledAt: { lte: fortyEightHoursAgo },
          createdAt: { lte: fortyEightHoursAgo },
        },
        data: { status: "FAILED" },
      });
      cleaned = result.count;
      console.log(`[SocialAnalytics] ${cleaned} posts stuck marqués FAILED`);
    }

    // TTL 48h sur les posts PENDING (review manuelle jamais faite)
    // Un post PENDING de +48h n'a plus de valeur — son scheduledAt est dans le passé
    // et il pollue le dashboard admin.
    const expiredPending = await prisma.socialPost.updateMany({
      where: {
        status: "PENDING",
        createdAt: { lte: fortyEightHoursAgo },
      },
      data: {
        status: "FAILED",
        directorNote: "Expiré — PENDING depuis +48h sans review manuelle",
      },
    });
    if (expiredPending.count > 0) {
      console.log(`[SocialAnalytics] ${expiredPending.count} posts PENDING expirés (TTL 48h)`);
    }

    // ─── (b) + (c) Lecture queue Buffer avec cache 60 min + circuit breaker ─
    let bufferQueue = 0;
    let bufferQueueSource: "cache" | "fresh" | "skipped-circuit-breaker" | "skipped-not-configured" = "skipped-not-configured";

    if (isBufferConfigured()) {
      if (allBlocked) {
        // Toutes les plateformes en rate limit 24h → on ne ré-interroge pas Buffer.
        // C'est le fix critique qui empêche la fenêtre 24h de se relancer en boucle.
        bufferQueueSource = "skipped-circuit-breaker";
        console.log(
          "[SocialAnalytics] Toutes plateformes en circuit breaker 24h — skip lecture queue Buffer",
        );
      } else if (
        bufferQueueCache &&
        now.getTime() - bufferQueueCache.cachedAt < BUFFER_QUEUE_CACHE_TTL_MS
      ) {
        // Cache valide → utiliser la valeur cachée
        bufferQueue = bufferQueueCache.count;
        bufferQueueSource = "cache";
      } else {
        // Cache absent ou expiré → fetch frais et mettre en cache
        try {
          const scheduled = await getBufferScheduledPosts();
          bufferQueue = scheduled.length;
          bufferQueueCache = { count: bufferQueue, cachedAt: now.getTime() };
          bufferQueueSource = "fresh";
        } catch (err) {
          console.error("[SocialAnalytics] Erreur lecture queue Buffer:", err);
          // Si on a un cache même expiré, on l'utilise en fallback
          if (bufferQueueCache) {
            bufferQueue = bufferQueueCache.count;
            bufferQueueSource = "cache";
          }
        }
      }
    }

    // ─── Performance par plateforme (7 derniers jours, posts publiés) ───
    const recentPublished = { status: "PUBLISHED" as const, publishedAt: { gte: sevenDaysAgo } };

    const byPlatformRaw = await prisma.socialPost.groupBy({
      by: ["platform"],
      where: recentPublished,
      _count: { id: true },
      _avg: { directorScore: true },
    });

    const byPlatform = byPlatformRaw.map((row) => ({
      platform: row.platform,
      count: row._count.id,
      avgDirectorScore: row._avg.directorScore
        ? Math.round(row._avg.directorScore * 10) / 10
        : null,
    }));

    // ─── Performance par format (7 derniers jours) ───
    const byFormatRaw = await prisma.socialPost.groupBy({
      by: ["format"],
      where: recentPublished,
      _count: { id: true },
      _avg: { directorScore: true },
    });

    const byFormat = byFormatRaw.map((row) => ({
      format: row.format,
      count: row._count.id,
      avgDirectorScore: row._avg.directorScore
        ? Math.round(row._avg.directorScore * 10) / 10
        : null,
    }));

    // ─── Performance par persona (7 derniers jours) ───
    const byPersonaRaw = await prisma.socialPost.groupBy({
      by: ["targetPersona"],
      where: recentPublished,
      _count: { id: true },
      _avg: { directorScore: true },
    });

    const byPersona = byPersonaRaw.map((row) => ({
      persona: row.targetPersona,
      count: row._count.id,
      avgDirectorScore: row._avg.directorScore
        ? Math.round(row._avg.directorScore * 10) / 10
        : null,
    }));

    // ─── Top 3 posts par directorScore (7 derniers jours) ───
    const topPosts = await prisma.socialPost.findMany({
      where: {
        ...recentPublished,
        directorScore: { not: null },
      },
      orderBy: { directorScore: "desc" },
      take: 3,
      select: {
        id: true,
        platform: true,
        format: true,
        hook: true,
        directorScore: true,
      },
    });

    // ─── Distribution des formats (7 derniers jours, tous statuts) ───
    const formatDistributionRaw = await prisma.socialPost.groupBy({
      by: ["format"],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { id: true },
    });

    const formatDistribution = formatDistributionRaw.reduce(
      (acc, row) => {
        acc[row.format] = row._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    const summary = {
      period: "7 derniers jours",
      published,
      failed,
      pendingApproval: pending,
      stuckCleaned: cleaned,
      bufferQueue,
      bufferQueueSource,
      bufferConfigured: isBufferConfigured(),
      blockedPlatforms: [...blockedPlatforms],
      byPlatform,
      byFormat,
      byPersona,
      topPosts,
      formatDistribution,
      note: "Analytics détaillées (impressions, likes, etc.) disponibles dans le dashboard Buffer : https://publish.buffer.com",
    };

    console.log("[SocialAnalytics]", JSON.stringify(summary));

    return NextResponse.json(summary);
  } catch (error) {
    console.error("[SocialAnalytics] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors du suivi analytics" },
      { status: 500 },
    );
  }
}

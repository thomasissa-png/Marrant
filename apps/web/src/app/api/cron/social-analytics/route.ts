import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isBufferConfigured,
  getBufferScheduledPosts,
} from "@/lib/social/buffer-client";

/**
 * CRON — Suivi des posts sociaux et nettoyage.
 * Tourne 1x/jour via Replit Cron.
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
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

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

    // Vérifier la queue Buffer
    let bufferQueue = 0;
    if (isBufferConfigured()) {
      try {
        const scheduled = await getBufferScheduledPosts();
        bufferQueue = scheduled.length;
      } catch (err) {
        console.error("[SocialAnalytics] Erreur lecture queue Buffer:", err);
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
      bufferConfigured: isBufferConfigured(),
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

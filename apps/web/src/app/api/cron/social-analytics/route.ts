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
 * 3. Retourne un résumé pour monitoring
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
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
      // Posts APPROVED depuis +48h = probablement stuck
      prisma.socialPost.count({
        where: {
          status: "APPROVED",
          scheduledAt: { lte: fortyEightHoursAgo },
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

    const summary = {
      period: "7 derniers jours",
      published,
      failed,
      pendingApproval: pending,
      stuckCleaned: cleaned,
      bufferQueue,
      bufferConfigured: isBufferConfigured(),
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

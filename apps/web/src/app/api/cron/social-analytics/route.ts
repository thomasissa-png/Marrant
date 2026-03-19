import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getTweetMetrics,
  isTwitterConfigured,
} from "@/lib/social/twitter-client";
import {
  getLinkedInMetrics,
  isLinkedInConfigured,
} from "@/lib/social/linkedin-client";

/**
 * CRON — Récupération des métriques des posts sociaux.
 * Tourne 1x/jour via Replit Cron.
 *
 * Met à jour impressions, likes, retweets, replies, clicks
 * pour tous les posts publiés dans les 7 derniers jours.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Récupérer les posts publiés récemment avec un externalId
    const posts = await prisma.socialPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: sevenDaysAgo },
        externalId: { not: null },
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });

    if (posts.length === 0) {
      return NextResponse.json({
        message: "Aucun post publié récent à analyser",
        updated: 0,
      });
    }

    const twitterReady = isTwitterConfigured();
    const linkedInReady = isLinkedInConfigured();

    let updated = 0;
    let errors = 0;

    for (const post of posts) {
      if (!post.externalId || post.externalId === "unknown") continue;

      try {
        if (post.platform === "TWITTER" && twitterReady) {
          const metrics = await getTweetMetrics(post.externalId);
          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              impressions: metrics.impressions,
              likes: metrics.likes,
              retweets: metrics.retweets,
              replies: metrics.replies,
              clicks: metrics.urlClicks,
            },
          });
          updated++;
        } else if (post.platform === "LINKEDIN" && linkedInReady) {
          const metrics = await getLinkedInMetrics(post.externalId);
          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              impressions: metrics.impressions,
              likes: metrics.likes,
              replies: metrics.comments,
              retweets: metrics.shares,
              clicks: metrics.clicks,
            },
          });
          updated++;
        }

        // Pause entre les appels API pour éviter le rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Erreur inconnue";
        console.error(`[SocialAnalytics] Erreur metrics ${post.id}:`, errMsg);
        errors++;
      }
    }

    console.log(
      `[SocialAnalytics] ${updated}/${posts.length} posts mis à jour, ${errors} erreurs`,
    );

    return NextResponse.json({
      message: `${updated} posts mis à jour`,
      total: posts.length,
      updated,
      errors,
    });
  } catch (error) {
    console.error("[SocialAnalytics] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des métriques" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  postTweet,
  postThread,
  isTwitterConfigured,
} from "@/lib/social/twitter-client";

/**
 * CRON — Publication des posts sociaux approuvés.
 * Tourne toutes les 30 minutes via Replit Cron.
 *
 * Publie les posts dont :
 * - status = APPROVED
 * - scheduledAt <= now
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Fetch approved posts ready to publish
    const posts = await prisma.socialPost.findMany({
      where: {
        status: "APPROVED",
        scheduledAt: { lte: now },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10, // Max 10 per run to avoid rate limits
    });

    if (posts.length === 0) {
      return NextResponse.json({
        message: "Aucun post à publier",
        published: 0,
      });
    }

    const results: Array<{
      id: string;
      platform: string;
      status: "published" | "failed" | "skipped";
      externalId?: string;
      error?: string;
    }> = [];

    for (const post of posts) {
      try {
        if (post.platform === "TWITTER") {
          if (!isTwitterConfigured()) {
            results.push({
              id: post.id,
              platform: post.platform,
              status: "skipped",
              error: "Twitter API non configurée",
            });
            continue;
          }

          let externalId: string;

          if (
            post.format === "THREAD" &&
            post.threadParts.length > 0
          ) {
            // Publish as thread
            externalId = await postThread(post.threadParts);
          } else {
            // Publish as single tweet
            externalId = await postTweet(post.content);
          }

          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              status: "PUBLISHED",
              publishedAt: new Date(),
              externalId,
            },
          });

          results.push({
            id: post.id,
            platform: post.platform,
            status: "published",
            externalId,
          });
        } else {
          // Threads, LinkedIn, Instagram — à implémenter en phases 2-3
          results.push({
            id: post.id,
            platform: post.platform,
            status: "skipped",
            error: `Plateforme ${post.platform} pas encore supportée`,
          });
        }

        // Small delay between posts to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : "Erreur inconnue";
        console.error(
          `[PublishSocial] Erreur publication ${post.id}:`,
          errMsg,
        );

        await prisma.socialPost.update({
          where: { id: post.id },
          data: { status: "FAILED" },
        });

        results.push({
          id: post.id,
          platform: post.platform,
          status: "failed",
          error: errMsg,
        });
      }
    }

    const published = results.filter((r) => r.status === "published").length;
    console.log(
      `[PublishSocial] ${published}/${posts.length} posts publiés`,
    );

    return NextResponse.json({
      message: `${published} posts publiés`,
      results,
    });
  } catch (error) {
    console.error("[PublishSocial] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la publication" },
      { status: 500 },
    );
  }
}

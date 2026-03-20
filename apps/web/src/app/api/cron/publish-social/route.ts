import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  postTweet,
  postThread,
  isTwitterConfigured,
} from "@/lib/social/twitter-client";
import {
  postLinkedIn,
  isLinkedInConfigured,
} from "@/lib/social/linkedin-client";
import {
  postImage,
  postCarousel,
  isInstagramConfigured,
} from "@/lib/social/instagram-client";

/** Retourne l'URL publique du site (Meta doit pouvoir accéder aux images). */
function getBaseUrl(): string {
  // En prod sur Replit, NEXT_PUBLIC_SITE_URL ou REPLIT_DEV_DOMAIN
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  return `http://localhost:${process.env.PORT || "3000"}`;
}

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
        } else if (post.platform === "LINKEDIN") {
          if (!isLinkedInConfigured()) {
            results.push({
              id: post.id,
              platform: post.platform,
              status: "skipped",
              error: "LinkedIn API non configurée",
            });
            continue;
          }

          const externalId = await postLinkedIn(post.content);

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
        } else if (post.platform === "INSTAGRAM") {
          if (!isInstagramConfigured()) {
            results.push({
              id: post.id,
              platform: post.platform,
              status: "skipped",
              error: "Instagram API non configurée",
            });
            continue;
          }

          // Générer les images via l'API interne
          const baseUrl = getBaseUrl();
          let externalId: string;

          if (
            post.format === "CAROUSEL" &&
            post.threadParts.length >= 2
          ) {
            // Carousel : générer une image par slide
            const imageUrls = post.threadParts.map(
              (_, i) =>
                `${baseUrl}/api/social/image?postId=${post.id}&slide=${i}`,
            );
            externalId = await postCarousel(imageUrls, post.content);
          } else {
            // Image unique
            const imageUrl = `${baseUrl}/api/social/image?postId=${post.id}`;
            externalId = await postImage(imageUrl, post.content);
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
          // Threads — à implémenter
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

        // Erreur permanente (auth, validation, permissions) → FAILED direct
        const isPermanent = errMsg.includes("401") || errMsg.includes("403") || errMsg.includes("400") || errMsg.includes("trop long") || errMsg.includes("expiré");

        if (isPermanent) {
          await prisma.socialPost.update({
            where: { id: post.id },
            data: { status: "FAILED" },
          });
        } else {
          // Erreur temporaire (réseau, rate limit) → repousser de 30 min pour retry au prochain cron
          const retryAt = new Date(Date.now() + 30 * 60 * 1000);
          const retryCount = (post.directorNote?.match(/\[retry:(\d+)\]/)?.[1] ?? "0");
          const count = parseInt(retryCount, 10) + 1;

          if (count >= 3) {
            // 3 tentatives échouées → FAILED définitif
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "FAILED" },
            });
          } else {
            await prisma.socialPost.update({
              where: { id: post.id },
              data: {
                scheduledAt: retryAt,
                directorNote: `${post.directorNote || ""}[retry:${count}] ${errMsg}`.trim(),
              },
            });
          }
        }

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

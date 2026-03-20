import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createBufferPost,
  createBufferThread,
  createBufferImagePost,
  isBufferConfigured,
  isChannelConfigured,
  type BufferPlatform,
} from "@/lib/social/buffer-client";

/** Retourne l'URL publique du site (pour les images Instagram). */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  return `http://localhost:${process.env.PORT || "3000"}`;
}

/**
 * CRON — Publication des posts sociaux approuvés via Buffer.
 * Tourne toutes les 30 minutes via Replit Cron.
 *
 * Publie les posts dont :
 * - status = APPROVED
 * - scheduledAt <= now
 *
 * Buffer gère le scheduling et la publication effective sur chaque plateforme.
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
    // Vérification Buffer configuré
    if (!isBufferConfigured()) {
      return NextResponse.json({
        error: "Buffer non configuré. Ajoute BUFFER_ACCESS_TOKEN et BUFFER_ORGANIZATION_ID dans les Secrets Replit.",
      }, { status: 500 });
    }

    const now = new Date();

    // Fetch approved posts ready to publish
    const posts = await prisma.socialPost.findMany({
      where: {
        status: "APPROVED",
        scheduledAt: { lte: now },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
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
        const platform = post.platform as BufferPlatform;

        // Vérifier que le channel est configuré pour cette plateforme
        if (!isChannelConfigured(platform)) {
          results.push({
            id: post.id,
            platform: post.platform,
            status: "skipped",
            error: `Channel Buffer non configuré pour ${platform}`,
          });
          continue;
        }

        let externalId: string;

        if (platform === "TWITTER" && post.format === "THREAD" && post.threadParts.length > 0) {
          // Thread Twitter : publie chaque partie avec 2 min d'écart
          externalId = await createBufferThread(post.threadParts, post.scheduledAt || undefined);
        } else if (platform === "INSTAGRAM") {
          // Instagram : post avec image générée + hashtags en premier commentaire
          const baseUrl = getBaseUrl();
          const imageUrl = `${baseUrl}/api/social/image?postId=${post.id}`;
          // Hashtags en premier commentaire (meilleur pour l'algo Instagram)
          const firstComment = post.hashtags.length > 0
            ? post.hashtags.join(" ")
            : undefined;
          externalId = await createBufferImagePost(platform, post.content, imageUrl, post.scheduledAt || undefined, firstComment);
        } else {
          // Tweet simple ou post LinkedIn : texte pur
          externalId = await createBufferPost(platform, post.content, post.scheduledAt || undefined);
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

        // Small delay between posts to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : "Erreur inconnue";
        console.error(
          `[PublishSocial] Erreur publication ${post.id}:`,
          errMsg,
        );

        // Erreur permanente (auth, validation, permissions) → FAILED direct
        const isPermanent = errMsg.includes("401") || errMsg.includes("403") || errMsg.includes("400") || errMsg.includes("trop long") || errMsg.includes("expiré") || errMsg.includes("invalide");

        if (isPermanent) {
          await prisma.socialPost.update({
            where: { id: post.id },
            data: { status: "FAILED" },
          });
        } else {
          // Erreur temporaire (réseau, rate limit) → repousser de 30 min pour retry au prochain cron
          const retryAt = new Date(Date.now() + 30 * 60 * 1000);
          // Track retries via sourceId field (not directorNote — that's for human-readable feedback)
          const currentRetries = parseInt(post.sourceId?.match(/^retry:(\d+)$/)?.[1] ?? "0", 10);
          const newRetryCount = currentRetries + 1;

          if (newRetryCount >= 3) {
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "FAILED" },
            });
          } else {
            await prisma.socialPost.update({
              where: { id: post.id },
              data: {
                scheduledAt: retryAt,
                sourceId: `retry:${newRetryCount}`,
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
      `[PublishSocial] ${published}/${posts.length} posts envoyés à Buffer`,
    );

    return NextResponse.json({
      message: `${published} posts envoyés à Buffer`,
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

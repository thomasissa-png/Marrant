import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createBufferPost,
  createBufferThread,
  createBufferImagePost,
  isBufferConfigured,
  isChannelConfigured,
  BufferQueueFullError,
  type BufferPlatform,
} from "@/lib/social/buffer-client";

/**
 * Découpe un texte trop long en tweets de ≤ 280 chars.
 * Coupe sur les sauts de ligne doubles, puis les phrases, puis les espaces.
 */
function splitIntoTweetThread(text: string): string[] {
  const MAX = 280;
  if (text.length <= MAX) return [text];

  const parts: string[] = [];
  // Essayer de couper sur les doubles sauts de ligne d'abord
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  let current = "";
  for (const para of paragraphs) {
    if (current && (current + "\n\n" + para).length > MAX) {
      parts.push(current.trim());
      current = para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  if (current.trim()) parts.push(current.trim());

  // Si un morceau dépasse encore 280, couper sur les phrases
  const result: string[] = [];
  for (const part of parts) {
    if (part.length <= MAX) {
      result.push(part);
      continue;
    }
    const sentences = part.split(/(?<=[.!?])\s+/);
    let chunk = "";
    for (const sentence of sentences) {
      if (chunk && (chunk + " " + sentence).length > MAX) {
        result.push(chunk.trim());
        chunk = sentence;
      } else {
        chunk = chunk ? chunk + " " + sentence : sentence;
      }
    }
    if (chunk.trim()) result.push(chunk.trim());
  }

  return result;
}

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

    // Fetch approved posts ready to publish — double-check directorScore >= 9
    // Belt and suspenders: even if a post got APPROVED via admin, don't publish below 9/10
    const posts = await prisma.socialPost.findMany({
      where: {
        status: "APPROVED",
        scheduledAt: { lte: now },
        directorScore: { gte: 9 },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    });

    // Demote any APPROVED posts with low/null scores back to PENDING
    await prisma.socialPost.updateMany({
      where: {
        status: "APPROVED",
        OR: [
          { directorScore: { lt: 9 } },
          { directorScore: null },
        ],
      },
      data: {
        status: "PENDING",
        directorNote: "⚠️ Rétrogradé APPROVED→PENDING — score directeur < 9/10",
      },
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

    // Track platforms with full queues to skip them
    const queueFullPlatforms = new Set<BufferPlatform>();

    for (const post of posts) {
      try {
        const platform = post.platform as BufferPlatform;

        // Skip platforms with full queues (detected earlier in this run)
        if (queueFullPlatforms.has(platform)) {
          results.push({
            id: post.id,
            platform: post.platform,
            status: "skipped",
            error: `Queue ${platform} pleine — skippé`,
          });
          continue;
        }

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
        } else if (platform === "TWITTER" && post.content.length > 280) {
          // Safety net : tweet trop long → auto-split en thread
          console.warn(`[PublishSocial] Tweet ${post.id} trop long (${post.content.length} chars) — auto-split en thread`);
          const parts = splitIntoTweetThread(post.content);
          externalId = await createBufferThread(parts, post.scheduledAt || undefined);
        } else if (platform === "INSTAGRAM") {
          // Instagram : post avec image générée + hashtags en fin de texte
          const baseUrl = getBaseUrl();
          const imageUrl = `${baseUrl}/api/social/image?postId=${post.id}`;
          const hashtags = post.hashtags.length > 0 ? post.hashtags.join(" ") : undefined;
          externalId = await createBufferImagePost(platform, post.content, imageUrl, post.scheduledAt || undefined, hashtags);
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

        // Queue Buffer pleine → repousser de 2h (les posts en queue auront le temps de partir)
        if (error instanceof BufferQueueFullError) {
          const retryAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
          await prisma.socialPost.update({
            where: { id: post.id },
            data: { scheduledAt: retryAt },
          });
          console.warn(`[PublishSocial] Queue pleine ${post.platform} — post ${post.id} reporté de 2h`);

          // Mark this platform as full — skip remaining posts for it
          queueFullPlatforms.add(post.platform as BufferPlatform);

          results.push({
            id: post.id,
            platform: post.platform,
            status: "failed",
            error: `Queue pleine (${error.currentCount}/10 slots) — reporté de 2h`,
          });
          continue;
        }

        // Erreur permanente (auth, validation, permissions) → FAILED direct
        // Match HTTP status codes at word boundaries to avoid false positives like "4010"
        const isPermanent = /\b(401|403|400)\b/.test(errMsg) || errMsg.includes("trop long") || errMsg.includes("expiré") || errMsg.includes("invalide");

        if (isPermanent) {
          await prisma.socialPost.update({
            where: { id: post.id },
            data: { status: "FAILED" },
          });
        } else {
          // Erreur temporaire (réseau, rate limit) → repousser de 30 min pour retry au prochain cron
          const retryAt = new Date(Date.now() + 30 * 60 * 1000);
          // Track retries via directorNote suffix (preserve sourceId for content tracking)
          const retryMatch = post.directorNote?.match(/\[retry:(\d+)\]$/);
          const currentRetries = retryMatch ? parseInt(retryMatch[1], 10) : 0;
          const newRetryCount = currentRetries + 1;

          if (newRetryCount >= 3) {
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "FAILED" },
            });
          } else {
            const retryNote = post.directorNote
              ? post.directorNote.replace(/\s*\[retry:\d+\]$/, "") + ` [retry:${newRetryCount}]`
              : `[retry:${newRetryCount}]`;
            await prisma.socialPost.update({
              where: { id: post.id },
              data: {
                scheduledAt: retryAt,
                directorNote: retryNote,
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

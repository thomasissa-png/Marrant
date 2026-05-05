import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createBufferPost,
  createBufferThread,
  createBufferImagePost,
  isBufferConfigured,
  isChannelConfigured,
  getBufferChannels,
  BufferQueueFullError,
  BufferContentTooLongError,
  type BufferPlatform,
} from "@/lib/social/buffer-client";
import { sendAdminAlert } from "@/lib/email";

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
  return process.env.NEXT_PUBLIC_SITE_URL || "https://deviens-marrant.fr";
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

    // Test de validité du token Buffer avant de publier
    try {
      await getBufferChannels();
    } catch (tokenError) {
      const errMsg = tokenError instanceof Error ? tokenError.message : "Erreur inconnue";
      const isAuthError = /\b(401|403|unauthorized|forbidden|expired|expiré)\b/i.test(errMsg);

      if (isAuthError) {
        console.error("[PublishSocial] Token Buffer invalide ou expiré:", errMsg);
        try {
          await sendAdminAlert(
            "Token Buffer expire — publication impossible",
            `<p>Le token Buffer est <strong>invalide ou expire</strong>. Aucun post ne peut etre publie.</p>
            <p><strong>Erreur :</strong> ${errMsg}</p>
            <p><strong>Action requise :</strong></p>
            <ol>
              <li>Va dans <a href="https://buffer.com/app/account">Buffer Settings > API</a></li>
              <li>Genere un nouveau token</li>
              <li>Mets a jour <code>BUFFER_ACCESS_TOKEN</code> dans les Secrets Replit</li>
            </ol>`,
          );
        } catch (_) {
          // Silencieux
        }
        return NextResponse.json({
          error: "Token Buffer invalide ou expiré. Renouvelle-le dans les Secrets Replit.",
        }, { status: 401 });
      }
      // Erreur non-auth (réseau, etc.) — on continue quand même, les posts individuels gèreront l'erreur
      console.warn("[PublishSocial] Échec test Buffer (non-auth), on continue:", errMsg);
    }

    const now = new Date();

    // ── Circuit breaker par plateforme ──────────────────────────────
    // Si un post a échoué avec 429 sur une plateforme dans les dernières 24h,
    // on bloque TOUTE la plateforme pour éviter de re-taper dans le rate limit.
    const cooldownWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentRateLimits = await prisma.socialPost.findMany({
      where: {
        status: "FAILED",
        updatedAt: { gte: cooldownWindow },
        directorNote: { contains: "429" },
      },
      select: { platform: true },
      distinct: ["platform"],
    });
    const blockedPlatforms = new Set(recentRateLimits.map((p) => p.platform));

    if (blockedPlatforms.size > 0) {
      console.log(`[PublishSocial] Circuit breaker actif — plateformes bloquées 24h : ${[...blockedPlatforms].join(", ")}`);
    }

    // Fetch approved posts ready to publish — exclure les plateformes en cooldown
    // Posts approuves par l'admin (approvedBy: "admin") sont publies quel que soit le score.
    // Posts approuves automatiquement (approvedBy null) doivent avoir directorScore >= 9.
    const posts = await prisma.socialPost.findMany({
      where: {
        status: "APPROVED",
        scheduledAt: { lte: now },
        // Circuit breaker : exclure les plateformes en cooldown 429
        ...(blockedPlatforms.size > 0 ? { platform: { notIn: [...blockedPlatforms] } } : {}),
        OR: [
          { approvedBy: { not: null } },
          { directorScore: { gte: 9 } },
        ],
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    });

    // Demote any APPROVED posts with low/null scores back to PENDING
    // SAUF les posts approuves manuellement par l'admin (approvedBy != null)
    await prisma.socialPost.updateMany({
      where: {
        status: "APPROVED",
        approvedBy: null,
        OR: [
          { directorScore: { lt: 9 } },
          { directorScore: null },
        ],
      },
      data: {
        status: "PENDING",
        directorNote: "Retrograde APPROVED->PENDING — score directeur < 9/10",
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

    // Limiter à 1 post par plateforme par run du cron (espacement minimum 30 min)
    // Les posts restants restent APPROVED et seront publiés au prochain run
    const seenPlatforms = new Set<string>();
    const postsToPublish = posts.filter(post => {
      if (seenPlatforms.has(post.platform)) return false;
      seenPlatforms.add(post.platform);
      return true;
    });

    // Track platforms with full queues to skip them
    const queueFullPlatforms = new Set<BufferPlatform>();

    for (const post of postsToPublish) {
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

        if (platform === "TWITTER" && post.format === "THREAD" && (post.threadParts?.length ?? 0) > 0) {
          // Thread Twitter : publie chaque partie avec 2 min d'écart
          externalId = await createBufferThread(post.threadParts, post.scheduledAt || undefined);
        } else if (platform === "TWITTER" && post.content.length > 270) {
          // Safety net : tweet trop long → auto-split en thread
          // Marge de sécurité à 270 (pas 280) car Twitter compte certains caractères
          // spéciaux (emojis, accents composés) différemment
          console.warn(`[PublishSocial] Tweet ${post.id} trop long (${post.content.length} chars) — auto-split en thread`);
          const parts = splitIntoTweetThread(post.content);
          externalId = await createBufferThread(parts, post.scheduledAt || undefined);
        } else if (platform === "INSTAGRAM") {
          // Instagram : utilise l'image pré-générée (Object Storage) si disponible,
          // sinon fallback sur la génération à la volée (URL dynamique)
          const imageUrl = post.imageUrl
            ? post.imageUrl
            : `${getBaseUrl()}/api/social/image?postId=${post.id}`;
          if (!post.imageUrl) {
            console.warn(`[PublishSocial] Post ${post.id} sans image Object Storage — fallback URL dynamique`);
          }
          const hashtags = (post.hashtags?.length ?? 0) > 0 ? post.hashtags.join(" ") : undefined;
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

        // Rate limit Buffer (429) → FAILED + circuit breaker bloque la plateforme 24h
        // Le post reste FAILED — le cron daily-social en générera un nouveau demain.
        // On ne reporte PAS car ça crée une boucle infinie (retry → 429 → retry → 429).
        const isRateLimit = /\b429\b/.test(errMsg) || errMsg.includes("RATE_LIMIT");
        if (isRateLimit) {
          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              status: "FAILED",
              directorNote: `429 rate limit ${post.platform} — circuit breaker 24h activé`,
            },
          });
          console.warn(`[PublishSocial] Rate limit 429 ${post.platform} — post ${post.id} FAILED, circuit breaker activé`);

          // Skip ALL remaining posts for this platform in this run
          queueFullPlatforms.add(post.platform as BufferPlatform);

          results.push({
            id: post.id,
            platform: post.platform,
            status: "failed",
            error: `Rate limit 429 — circuit breaker 24h activé`,
          });
          continue;
        }

        // Erreur permanente (auth, validation, permissions) → FAILED direct
        const isPermanent =
          /\b(401|403|400)\b/.test(errMsg) ||
          errMsg.includes("trop long") ||
          errMsg.includes("expiré") ||
          errMsg.includes("invalide") ||
          errMsg.includes("invalid") ||
          errMsg.includes("unauthorized") ||
          errMsg.includes("forbidden") ||
          errMsg.includes("not found") ||
          errMsg.includes("MutationError");

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
    const failed = results.filter((r) => r.status === "failed").length;
    const deferred = posts.length - postsToPublish.length;
    console.log(
      `[PublishSocial] ${published}/${postsToPublish.length} posts envoyés à Buffer (${deferred} différés au prochain run)`,
    );

    // Alerte si tous les posts ont echoue — SAUF si c'est uniquement du rate limit (bruit inutile)
    const rateLimitOnly = results
      .filter((r) => r.status === "failed")
      .every((r) => r.error?.includes("Rate limit") || r.error?.includes("429"));

    if (published === 0 && failed > 0 && !rateLimitOnly) {
      const failedErrors = results
        .filter((r) => r.status === "failed")
        .map((r) => `<li><strong>${r.platform}</strong> (${r.id}) : ${r.error || "erreur inconnue"}</li>`)
        .join("");

      try {
        await sendAdminAlert(
          "Publication social — echec Buffer",
          `<p><strong>${failed} posts</strong> ont echoue a la publication. Aucun post n'a ete publie.</p>
          <ul>${failedErrors}</ul>
          <p>Verifie la configuration Buffer et les logs du cron.</p>`,
        );
      } catch (_) {
        // Silencieux
      }
    }

    return NextResponse.json({
      message: `${published} posts envoyés à Buffer`,
      results,
    });
  } catch (error) {
    console.error("[PublishSocial] Erreur:", error);

    // Alerte sur erreur critique
    try {
      await sendAdminAlert(
        "Publication social — erreur critique",
        `<p>Le cron <code>publish-social</code> a plante.</p>
        <p><strong>Erreur :</strong> ${error instanceof Error ? error.message : "Erreur inconnue"}</p>`,
      );
    } catch (_) {
      // Silencieux
    }

    return NextResponse.json(
      { error: "Erreur lors de la publication" },
      { status: 500 },
    );
  }
}

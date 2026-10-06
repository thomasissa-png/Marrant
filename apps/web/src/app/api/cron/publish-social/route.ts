import { NextResponse } from "next/server";
import type { SocialPlatform, SocialFormat } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import {
  createBufferPost,
  createBufferImagePost,
  isBufferConfigured,
  isChannelConfigured,
  getBufferChannels,
  getConfiguredChannelIds,
  BufferQueueFullError,
  BufferContentTooLongError,
  type BufferChannel,
  type BufferPlatform,
} from "@/lib/social/buffer-client";
import { buildPublishErrorNote, sendDailyPublishFailureAlert, TOKEN_ALERT_JOB } from "@/lib/social/publish-failure";
import {
  alerterPausesAutomatiques,
  canauxEnPanne,
  estAutorisationPerdue,
  pauserAutomatiquement,
  reseauxEnPause,
  type SwitchDb,
} from "@/lib/social/platform-switch";
import { generatePostImage, nombreDeSlides, texteAlternatifDuPost } from "@/lib/social/generate-post-image";
import { estVarianteImage, noteRepliTexte, preparerCarteLinkedIn } from "@/lib/social/carte-linkedin";
import { longueurX } from "@/lib/social/longueur-x";
import { articleSlugDuPost, conserverMarqueurs, noteRelaisRejete, repliDuPost, repliValide } from "@/lib/social/garde-article";
import { findBlogArticle } from "@/lib/blog-article-page";

// Incident s14 : aucun fetch sortant (LLM, Buffer…) mis en cache par Next.
export const fetchCache = "force-no-store";

/** X = posts simples (s15) : au-delà (longueur comptée par X, lien = 23), le post est refusé, jamais découpé en fil. */
const X_MAX_CARACTERES = 270;

/** Rendu de la carte LinkedIn dans le Worker (vérifie qu'elle se rend avant de la confier à Buffer). */
async function rendreCarte(post: Parameters<typeof generatePostImage>[0]): Promise<{ png: Uint8Array; alt: string }> {
  return { png: await generatePostImage(post, 0), alt: texteAlternatifDuPost(post) };
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

    // Test de validité du token Buffer avant de publier + santé des canaux
    let channels: BufferChannel[] | null = null;
    try {
      channels = await getBufferChannels();
    } catch (tokenError) {
      const errMsg = tokenError instanceof Error ? tokenError.message : "Erreur inconnue";
      const isAuthError = /\b(401|403|unauthorized|forbidden|expired|expiré)\b/i.test(errMsg);

      if (isAuthError) {
        console.error("[PublishSocial] Token Buffer invalide ou expiré:", errMsg);
        // s15 (06/10) : alerte A (Thomas régénère le token), partie dans le digest du matin.
        await sendDailyPublishFailureAlert(
            "Token Buffer expire — publication impossible",
            `<p>Le token Buffer est <strong>invalide ou expire</strong>. Aucun post ne peut etre publie.</p>
            <p><strong>Erreur :</strong> ${errMsg}</p>
            <p><strong>Action requise :</strong></p>
            <ol>
              <li>Va dans <a href="https://buffer.com/app/account">Buffer Settings > API</a></li>
              <li>Genere un nouveau token</li>
              <li>Mets a jour <code>BUFFER_ACCESS_TOKEN</code> dans les secrets du Worker</li>
            </ol>`,
            new Date(),
            TOKEN_ALERT_JOB,
        );
        return NextResponse.json({
          error: "Token Buffer invalide ou expiré. Renouvelle-le dans les Secrets Replit.",
        }, { status: 401 });
      }
      // Erreur non-auth (réseau, etc.) — on continue quand même, les posts individuels gèreront l'erreur
      console.warn("[PublishSocial] Échec test Buffer (non-auth), on continue:", errMsg);
    }

    const now = new Date();
    const switchDb = prisma as unknown as SwitchDb;

    // ── Santé des canaux (s15 cycle 3) : un canal déconnecté chez Buffer
    // (autorisation perdue) met son réseau en pause automatiquement + alerte.
    if (channels) {
      for (const panne of canauxEnPanne(channels, getConfiguredChannelIds())) {
        if (await pauserAutomatiquement(switchDb, panne.platform, panne.motif, now)) {
          console.warn(`[PublishSocial] ${panne.platform} mis en pause automatiquement : ${panne.motif}`);
        }
      }
    }
    await alerterPausesAutomatiques(switchDb, sendDailyPublishFailureAlert, now);

    // ── Interrupteur Pause / Reprise par réseau (en base, admin social).
    // Ligne absente ou base illisible = réseau en pause.
    const pausedPlatforms = await reseauxEnPause(switchDb);

    // ── Circuit breaker par plateforme ──────────────────────────────
    // Si un post a échoué avec 429 sur une plateforme dans les dernières 24h,
    // on bloque TOUTE la plateforme pour éviter de re-taper dans le rate limit.
    const cooldownWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    // 1er appel Prisma du cron → retry sur cold start Neon (P1 s8).
    const recentRateLimits = await withDbRetry(
      () =>
        prisma.socialPost.findMany({
          where: {
            status: "FAILED",
            updatedAt: { gte: cooldownWindow },
            // s14 : `startsWith` (et non `contains`) — les notes portent désormais
            // le message d'erreur exact, qui peut contenir « 429 » ailleurs.
            directorNote: { startsWith: "429" },
          },
          select: { platform: true },
          distinct: ["platform"],
        }),
      { label: "publish-social:recentRateLimits" },
    );
    const blockedPlatforms = new Set(recentRateLimits.map((p) => p.platform));

    if (blockedPlatforms.size > 0) {
      console.log(`[PublishSocial] Circuit breaker actif — plateformes bloquées 24h : ${[...blockedPlatforms].join(", ")}`);
    }

    // Refonte s7 : skip les formats deprecated (THREAD, QUOTE_ANALYSIS, TECHNIQUE_DU_JOUR)
    // Ces formats ne doivent plus être publiés — seulement MINI_STANDUP / POTE_AU_TAF / IMAGE_QUI_CLAQUE
    // (TWEET et POST sont conservés en alias legacy pour les posts admin manuels)
    const DEPRECATED_FORMATS: SocialFormat[] = ["THREAD", "QUOTE_ANALYSIS", "TECHNIQUE_DU_JOUR"] as SocialFormat[];

    // Fetch approved posts ready to publish — exclure les plateformes en cooldown
    // Posts approuves par l'admin (approvedBy: "admin") sont publies quel que soit le score.
    // Posts approuves automatiquement (approvedBy null) doivent avoir directorScore >= 9.
    // s15 cycle 3 : réseaux en pause = interrupteur en base (plus de constante).
    const excludedPlatforms = new Set<SocialPlatform>([...blockedPlatforms, ...pausedPlatforms]);
    const posts = await prisma.socialPost.findMany({
      where: {
        status: "APPROVED",
        scheduledAt: { lte: now },
        // Refonte s7 : skip formats deprecated (legacy queue avant refonte)
        format: { notIn: DEPRECATED_FORMATS },
        // Circuit breaker 429 + plateformes en pause
        platform: { notIn: [...excludedPlatforms] },
        OR: [
          { approvedBy: { not: null } },
          { directorScore: { gte: 9 } },
        ],
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    });

    // Si des posts deprecated étaient APPROVED, les rejeter une fois pour cleaner la queue
    const deprecatedRejected = await prisma.socialPost.updateMany({
      where: {
        status: { in: ["APPROVED", "PENDING"] },
        format: { in: DEPRECATED_FORMATS },
      },
      data: {
        status: "REJECTED",
        directorNote: "Refonte s7 — format deprecated (THREAD/QUOTE_ANALYSIS/TECHNIQUE_DU_JOUR ne sont plus publiés)",
      },
    });
    if (deprecatedRejected.count > 0) {
      console.log(`[PublishSocial] ${deprecatedRejected.count} posts deprecated (refonte s7) rejetés en queue`);
    }

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

    for (const candidat of postsToPublish) {
      // `post` peut devenir le repli d'un relais d'article (garde articleSlug).
      let post = candidat;
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

        // s15 (plan v2 §6, §7, R3) : un relais d'article ne part que si l'article est
        // visible à l'envoi ; sinon REJECTED et son repli (vanne du même thème, sans
        // lien, en réserve) part à sa place sur le même créneau. Alerte par réseau.
        const articleSlug = articleSlugDuPost(post);
        if (articleSlug) {
          let visible: boolean;
          try {
            visible = (await findBlogArticle(articleSlug)) !== null;
          } catch (err) {
            console.warn(`[PublishSocial] Visibilité de l'article ${articleSlug} illisible, post ${post.id} retenu :`, err);
            results.push({ id: post.id, platform: post.platform, status: "skipped", error: `Article ${articleSlug} illisible, nouvel essai au prochain passage` });
            continue;
          }
          if (!visible) {
            const repliId = repliDuPost(post.directorNote);
            const repli = repliId ? await prisma.socialPost.findUnique({ where: { id: repliId } }) : null;
            const ok = repliValide(repli, post);
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "REJECTED", directorNote: noteRelaisRejete(articleSlug, ok ? repliId : null, post.directorNote) },
            });
            await sendDailyPublishFailureAlert(
              `Relais ${post.platform} : article « ${articleSlug} » non publié, ${ok ? "repli envoyé" : "créneau vide"}`,
              `<p>Le relais <strong>${post.platform}</strong> (${post.id}) de l'article <code>${articleSlug}</code> est passé en
              <strong>REJECTED</strong> : l'article n'est pas visible à l'heure de l'envoi.</p>
              <p>${ok ? `Son repli <code>${repliId}</code> (vanne du même thème, sans lien) part sur le même créneau.` : "Aucun repli en réserve : le créneau reste vide."}</p>
              <p><strong>Action :</strong> publier l'article ou vérifier sa date dans l'admin du blog.</p>`,
              now,
              `social-relais-${post.platform.toLowerCase()}`,
            );
            if (!ok || !repli) {
              results.push({ id: post.id, platform: post.platform, status: "skipped", error: `Article ${articleSlug} non publié : relais rejeté, aucun repli` });
              continue;
            }
            post = await prisma.socialPost.update({
              where: { id: repli.id },
              data: { status: "APPROVED", scheduledAt: post.scheduledAt },
            });
          }
        }

        let externalId: string;

        if (platform === "TWITTER" && (longueurX(post.content) > X_MAX_CARACTERES || post.format === "THREAD")) {
          // s15 : X = posts simples, fils interdits. Jamais de découpage
          // automatique : le post est refusé avec un message clair.
          await prisma.socialPost.update({
            where: { id: post.id },
            data: {
              status: "FAILED",
              directorNote: conserverMarqueurs(post.directorNote, buildPublishErrorNote(
                `fil X interdit : ${longueurX(post.content)} caractères comptés par X (max ${X_MAX_CARACTERES}), raccourcir le post`,
              )),
            },
          });
          results.push({ id: post.id, platform: post.platform, status: "failed", error: "Fil X interdit (post trop long)" });
          continue;
        } else if (platform === "INSTAGRAM") {
          // Instagram : carrousel v3 (une URL par slide, rendue par le Worker),
          // ou URL explicites en base, ou ancienne image unique.
          const n = nombreDeSlides(post);
          const imageUrls = post.imageUrls.length > 0
            ? post.imageUrls
            : n > 1 || !post.imageUrl
              ? Array.from({ length: n }, (_, i) => `${getBaseUrl()}/api/social/image?postId=${post.id}&slide=${i}`)
              : [post.imageUrl];
          const hashtags = (post.hashtags?.length ?? 0) > 0 ? post.hashtags.join(" ") : undefined;
          externalId = await createBufferImagePost(
            platform, post.content, imageUrls, post.scheduledAt || undefined, hashtags, texteAlternatifDuPost(post),
          );
        } else {
          // Tweet simple ou post LinkedIn : texte pur. LinkedIn : lien en 1er commentaire (champ cta).
          const firstComment = platform === "LINKEDIN" && post.cta?.startsWith("http") ? post.cta : undefined;
          // s15 (v5 §4, §8) : LinkedIn `[variante:image]` = amorce + carte 4:5 de la chute ;
          // carte non rendue = texte seul (créneau jamais perdu), cause dans directorNote.
          const envoi = estVarianteImage(post) ? await preparerCarteLinkedIn(post, getBaseUrl(), () => rendreCarte(post)) : null;
          if (envoi?.ok) {
            externalId = await createBufferImagePost(platform, envoi.texte, envoi.url, post.scheduledAt || undefined, undefined, envoi.alt);
          } else {
            if (envoi) {
              console.warn(`[PublishSocial] Carte LinkedIn ${post.id} : ${envoi.raison}, envoi en texte seul`);
              const noteRepli = noteRepliTexte(post.directorNote, envoi.raison);
              await prisma.socialPost.update({ where: { id: post.id }, data: { directorNote: noteRepli } });
              post = { ...post, directorNote: noteRepli };
              // s15 cycle 7 (QA L1, L2) : un repli silencieux fausse le test texte / image.
              // 1 alerte par jour (clé social-repli-image-linkedin) ; e-mail en échec sans effet sur l'envoi.
              try {
                await sendDailyPublishFailureAlert(
                  "LinkedIn : carte non envoyée, post parti en texte seul (test image faussé)",
                  `<p>Le post LinkedIn <code>${post.id}</code>, prévu avec une carte (bras image du test texte / image), part en <strong>texte seul</strong>.</p>
                  <p>Cause : ${envoi.raison.slice(0, 300)}</p>
                  <p>Le post est compté dans le bras texte (marqueur <code>[variante:texte]</code>). Si la cause est le rendu, tous les posts image suivants partiront aussi en texte : vérifier <code>/api/social/image?postId=${post.id}&amp;slide=0</code>.</p>`,
                  now,
                  "social-repli-image-linkedin",
                );
              } catch (alertErr) {
                console.error(`[PublishSocial] Alerte de repli image ${post.id} non envoyée :`, alertErr);
              }
            }
            externalId = await createBufferPost(platform, post.content, post.scheduledAt || undefined, false, { firstComment });
          }
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

          // s15 cycle 6 (R4) : le blocage 24 h n'était signalé par aucun e-mail.
          // 1 alerte par jour et par réseau (clé social-429-<réseau>).
          try {
            await sendDailyPublishFailureAlert(
              `Publication ${post.platform} : Buffer limite les envois (429), réseau bloqué 24 h`,
              `<p>Buffer a refusé un envoi sur <strong>${post.platform}</strong> (limite de débit, 429).</p>
              <p>Post ${post.id} passé en FAILED ; les autres posts de ce réseau ne partent plus pendant 24 h, puis reprennent seuls.</p>
              <p>Message exact : ${errMsg.slice(0, 300)}</p>`,
              now,
              `social-429-${post.platform.toLowerCase()}`,
            );
          } catch (alertErr) {
            console.error(`[PublishSocial] Alerte 429 ${post.platform} non envoyée :`, alertErr);
          }

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
          // s14 (C1) : le message exact est enregistré sur le post.
          await prisma.socialPost.update({
            where: { id: post.id },
            // s15 cycle 7 (QA L3) : les marqueurs ([variante:…], [article:…]…) survivent à l'échec.
            data: { status: "FAILED", directorNote: conserverMarqueurs(post.directorNote, buildPublishErrorNote(errMsg)) },
          });
          // s15 cycle 3 : autorisation perdue → réseau en pause (les posts
          // suivants restent APPROVED au lieu d'échouer un par un) + alerte.
          if (estAutorisationPerdue(errMsg) && post.platform !== "THREADS") {
            await pauserAutomatiquement(switchDb, post.platform as BufferPlatform, `Remise refusée par Buffer : ${errMsg.slice(0, 300)}`, new Date());
            await alerterPausesAutomatiques(switchDb, sendDailyPublishFailureAlert, new Date());
            queueFullPlatforms.add(post.platform as BufferPlatform);
          }
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
              data: { status: "FAILED", directorNote: conserverMarqueurs(post.directorNote, buildPublishErrorNote(errMsg, newRetryCount)) },
            });
          } else {
            // s14 (C1) : dernier message d'erreur + compteur de relances (suffixe lu ci-dessus).
            // s15 : les marqueurs [article:…] et [report-article:N] survivent à la relance.
            const retryNote = conserverMarqueurs(post.directorNote, buildPublishErrorNote(errMsg, newRetryCount));
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

      // s15 (plan v2 §8, QA C8) : 1 e-mail par jour ET par réseau (clé social-echec-<réseau>),
      // un 2e incident sur un autre réseau n'est plus masqué. Détail de chaque échec en base.
      for (const pf of [...new Set(results.filter((r) => r.status === "failed").map((r) => r.platform))]) {
        await sendDailyPublishFailureAlert(
          `Publication ${pf} : échec Buffer`,
          `<p>Échec de publication sur <strong>${pf}</strong> (${failed} échec(s) au total sur ce passage, aucun post publié).</p>
          <ul>${failedErrors}</ul>
          <p>Les messages exacts sont enregistrés sur chaque post (directorNote). Pas d'autre alerte pour ce réseau avant demain.</p>`,
          now,
          `social-echec-${pf.toLowerCase()}`,
        );
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
      await sendDailyPublishFailureAlert(
        "Publication social — erreur critique",
        `<p>Le cron <code>publish-social</code> a plante.</p>
        <p><strong>Erreur :</strong> ${error instanceof Error ? error.message : "Erreur inconnue"}</p>`,
      );
    } catch (_) {
      // Silencieux (base indisponible)
    }

    return NextResponse.json(
      { error: "Erreur lors de la publication" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateDailySocialPosts,
  getOptimalScheduleTime,
} from "@/lib/ai/agents/social-media-agent";
import { getPersonaForDay } from "@/lib/ai/personas";
import { sendAdminAlert } from "@/lib/email";
import { generatePostImage } from "@/lib/social/generate-post-image";
import { uploadPostImage } from "@/lib/social/image-storage";

/**
 * CRON — Génération quotidienne des posts sociaux.
 * Déclenché à 4h UTC par Replit Cron.
 *
 * Pipeline :
 * 1. Génère 2-3 posts Twitter + 1 LinkedIn + 1 Instagram via social-media-agent
 * 2. Chaque post passe par la validation du Stand-Up Director (3 tentatives max, réécriture si échec)
 * 3. Validation programmatique (hook ≤5 mots, char limits, guard persona, anti-engagement-bait)
 * 4. Sauvegarde en DB : APPROVED si validé par le directeur, PENDING sinon (validation crash → review manuelle)
 * 5. Le cron publish-social publie aux horaires schedulés via Buffer (APPROVED uniquement)
 */
export async function GET(req: Request) {
  // Vérification du cron secret (header Bearer OU query param pour compatibilité)
  const { searchParams } = new URL(req.url);
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    const dayOfMonth = today.getUTCDate();
    const persona = getPersonaForDay(dayOfMonth);

    console.log(
      `[DailySocial] Génération posts pour jour ${dayOfMonth} — persona ${persona}`,
    );

    // Check if posts already generated for each platform today
    // Vérification PAR PLATEFORME — on ne régénère QUE les plateformes manquantes
    const force = searchParams.get("force") === "true";
    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    let platformsAlreadyCovered = new Set<string>();

    if (!force) {
      // ── HARD LOCK anti-duplication ──────────────────────────────────
      // Seuils MAX par plateforme et par jour (tous statuts confondus).
      // Si UNE plateforme a atteint son max → skip TOUT (même les autres).
      // C'est une double protection contre les appels multiples.
      const MAX_POSTS_PER_PLATFORM_PER_DAY: Record<string, number> = {
        TWITTER: 4,
        LINKEDIN: 1,
        INSTAGRAM: 1,
      };

      const existingByPlatform = await prisma.socialPost.groupBy({
        by: ["platform"],
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
          status: { in: ["APPROVED", "PUBLISHED", "PENDING"] },
        },
        _count: true,
      });

      const countMap = new Map(existingByPlatform.map((g) => [g.platform, g._count]));

      // Hard lock : si une plateforme est au max, skip total
      const anyPlatformMaxed = Object.entries(MAX_POSTS_PER_PLATFORM_PER_DAY).some(
        ([platform, max]) => (countMap.get(platform) || 0) >= max,
      );

      if (anyPlatformMaxed) {
        const counts = [...countMap.entries()].map(([p, c]) => `${p}: ${c}`).join(", ") || "aucun";
        console.warn(`[DailySocial] HARD LOCK activé — max atteint : ${counts}`);
        return NextResponse.json({
          message: `HARD LOCK : limite quotidienne atteinte (${counts})`,
          skipped: true,
          hardLock: true,
        });
      }

      platformsAlreadyCovered = new Set(existingByPlatform.map((g) => g.platform));
      const allPlatformsCovered = ["TWITTER", "LINKEDIN", "INSTAGRAM"].every(
        (p) => platformsAlreadyCovered.has(p),
      );

      if (allPlatformsCovered) {
        const counts = existingByPlatform.map((g) => `${g.platform}: ${g._count}`).join(", ");
        return NextResponse.json({
          message: `Posts déjà générés pour toutes les plateformes aujourd'hui (${counts}). Ajouter &force=true pour régénérer.`,
          skipped: true,
        });
      }

      if (platformsAlreadyCovered.size > 0) {
        const missing = ["TWITTER", "LINKEDIN", "INSTAGRAM"].filter(
          (p) => !platformsAlreadyCovered.has(p),
        );
        console.log(
          `[DailySocial] Posts existants pour: ${[...platformsAlreadyCovered].join(", ")} — génération UNIQUEMENT pour: ${missing.join(", ")}`,
        );
      }
    }

    // Contexte d'actualité optionnel — injecté dans les WILD CARD
    // Usage : ?trending=Blanche+Gardin+nouveau+spectacle+annoncé
    const trendingContext = searchParams.get("trending") || undefined;
    if (trendingContext) {
      console.log(`[DailySocial] Contexte trending injecté : "${trendingContext}"`);
    }

    // Generate posts
    const allPosts = await generateDailySocialPosts(dayOfMonth, trendingContext);

    // Filter out platforms that already have posts today (anti-doublon)
    const posts = allPosts.filter((p) => !platformsAlreadyCovered.has(p.platform));

    if (posts.length === 0) {
      return NextResponse.json({
        message: `Aucun post à créer — toutes les plateformes manquantes ont été filtrées`,
        skipped: true,
      });
    }

    if (posts.length < allPosts.length) {
      console.log(
        `[DailySocial] ${allPosts.length - posts.length} posts filtrés (plateformes déjà couvertes) — ${posts.length} à créer`,
      );
    }

    // Save to DB as PENDING
    const saved = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      // Utiliser le persona-cible du post (pas le persona du batch) pour le scheduling
      // Instagram cible Yanis (21h-23h) même si le jour est MARC/SOPHIE
      const postPersona = (post.targetPersona as "YANIS" | "SOPHIE" | "MARC") || persona;
      const scheduledAt = getOptimalScheduleTime(postPersona, i, post.platform as "TWITTER" | "LINKEDIN" | "INSTAGRAM");

      const dbPost = await prisma.socialPost.create({
        data: {
          platform: post.platform,
          format: post.format,
          hook: post.hook,
          content: post.content,
          cta: post.cta || "",
          hashtags: post.hashtags || [],
          targetPersona: post.targetPersona,
          sourceType: post.sourceType || null,
          sourceId: post.sourceId || null,
          threadParts: post.threadParts || [],
          directorScore: post.directorScore ?? null,
          directorNote: post.directorValidated !== true
            ? "⚠️ Validation directeur échouée — review manuelle requise"
            : (post.directorScore ?? 0) < 9
              ? `⚠️ Score ${post.directorScore}/10 < 9 — review manuelle requise`
              : (post.directorNote ?? null),
          // APPROVED seulement si le directeur a validé ET score >= 9 — sinon PENDING
          status: post.directorValidated === true && (post.directorScore ?? 0) >= 9
            ? "APPROVED"
            : "PENDING",
          // Marquer l'origine de l'approbation pour proteger contre la retrogradation
          approvedBy: post.directorValidated === true && (post.directorScore ?? 0) >= 9
            ? "director"
            : null,
          scheduledAt,
        },
      });

      // Pré-générer et uploader l'image pour les posts Instagram
      if (post.platform === "INSTAGRAM") {
        try {
          const pngBuffer = await generatePostImage({
            format: post.format,
            hook: post.hook,
            content: post.content,
            targetPersona: post.targetPersona,
            threadParts: post.threadParts || [],
          });

          const imageUrl = await uploadPostImage(dbPost.id, pngBuffer);

          if (imageUrl) {
            await prisma.socialPost.update({
              where: { id: dbPost.id },
              data: { imageUrl },
            });
            console.log(`[DailySocial] Image Instagram pré-générée et uploadée: ${imageUrl}`);
          } else {
            console.warn(`[DailySocial] Image Instagram non uploadée pour ${dbPost.id} — fallback URL dynamique`);
          }
        } catch (imgError) {
          console.error(
            `[DailySocial] Erreur pré-génération image pour ${dbPost.id}:`,
            imgError instanceof Error ? imgError.message : imgError,
          );
          // Non-bloquant : le publish-social utilisera le fallback URL dynamique
        }
      }

      saved.push({
        id: dbPost.id,
        platform: dbPost.platform,
        format: dbPost.format,
        scheduledAt: dbPost.scheduledAt,
      });
    }

    const approvedCount = posts.filter((p) => p.directorValidated === true).length;
    const pendingCount = posts.filter((p) => p.directorValidated !== true).length;

    console.log(
      `[DailySocial] ${saved.length} posts générés — ${approvedCount} validés, ${pendingCount} en attente de review`,
    );

    // Alerte si une plateforme entière est absente après génération
    // (l'agent a crash silencieusement sur cette plateforme)
    const generatedPlatforms = new Set(saved.map((p) => p.platform));
    const allCoveredNow = new Set([...platformsAlreadyCovered, ...generatedPlatforms]);
    const missingPlatforms = ["TWITTER", "LINKEDIN", "INSTAGRAM"].filter(
      (p) => !allCoveredNow.has(p),
    );
    if (missingPlatforms.length > 0) {
      try {
        await sendAdminAlert(
          `Pipeline social — plateforme(s) absente(s) : ${missingPlatforms.join(", ")}`,
          `<p><strong>${missingPlatforms.length} plateforme(s) sans post aujourd'hui</strong> : ${missingPlatforms.join(", ")}</p>
          <p>L'agent IA a probablement crashé silencieusement sur ces plateformes (timeout, API error, etc.).</p>
          <p>Vérifier les logs Replit et relancer manuellement si nécessaire :</p>
          <p><code>GET /api/cron/daily-social?secret=CRON_SECRET&force=true</code></p>`,
        );
      } catch (_) {
        // Silencieux
      }
    }

    // Alerte si aucun post approuve automatiquement
    if (approvedCount === 0 && saved.length > 0) {
      try {
        await sendAdminAlert(
          "Pipeline social — 0 posts approuves",
          `<p><strong>${saved.length} posts generes</strong> mais <strong>aucun n'a ete approuve</strong> par le Stand-Up Director.</p>
          <p>Tous les posts sont en attente de review manuelle dans le dashboard admin.</p>
          <ul>
            <li>Persona du jour : <strong>${persona}</strong></li>
            <li>Posts en PENDING : <strong>${pendingCount}</strong></li>
          </ul>
          <p>Verifie les scores du directeur et approuve manuellement si necessaire.</p>`,
        );
      } catch (_) {
        // Silencieux — ne pas crasher le cron pour un email
      }
    }

    return NextResponse.json({
      message: `${saved.length} posts générés (${approvedCount} validés, ${pendingCount} en review manuelle)`,
      posts: saved,
    });
  } catch (error) {
    console.error("[DailySocial] Erreur:", error);

    // Alerte sur erreur critique du pipeline
    try {
      await sendAdminAlert(
        "Pipeline social — erreur critique generation",
        `<p>Le cron <code>daily-social</code> a plante.</p>
        <p><strong>Erreur :</strong> ${error instanceof Error ? error.message : "Erreur inconnue"}</p>
        <p>Aucun post n'a ete genere aujourd'hui. Verifie les logs et relance manuellement si necessaire.</p>`,
      );
    } catch (_) {
      // Silencieux
    }

    return NextResponse.json(
      { error: "Erreur lors de la génération des posts" },
      { status: 500 },
    );
  }
}

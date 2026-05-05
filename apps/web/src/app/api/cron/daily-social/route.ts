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

    // ── Quotas PAR PLATEFORME ET PAR JOUR (refonte s7) ─────
    // 1 format par plateforme, 1 post/jour/plateforme.
    // Yanis : pas de LinkedIn (slot supprimé).
    // Plus de THREAD ni QUOTE_ANALYSIS — un seul MINI_STANDUP/jour.
    //
    // Plan éditorial (social-editorial-plan.json v2.0-s7) :
    //   Tous jours : 1 Twitter + 1 LI + 1 IG  |  Yanis : 1 Twitter + 1 IG (pas de LI)
    const dayOfWeek = today.getUTCDay(); // 0=dim, 1=lun, ..., 6=sam
    const isYanis = persona === "YANIS";
    void dayOfWeek; // gardé pour future logique calendaire

    const quotas: Record<string, number> = {
      TWITTER: 1,
      LINKEDIN: isYanis ? 0 : 1,
      INSTAGRAM: 1,
    };

    const force = searchParams.get("force") === "true";
    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // missing[platform] = quota - nombre déjà en DB (incl. FAILED pour éviter les boucles)
    const missing: Record<string, number> = { TWITTER: 0, LINKEDIN: 0, INSTAGRAM: 0 };

    if (!force) {
      // Comptage PAR PLATEFORME — inclut TOUS les statuts (APPROVED, PUBLISHED, PENDING, FAILED, REJECTED)
      // pour ne pas regénérer à l'infini si un post a échoué.
      // Les posts PENDING rejetés par l'admin ou les FAILED comptent dans le total — si l'admin veut
      // relancer une génération, il utilise &force=true.
      const existingByPlatform = await prisma.socialPost.groupBy({
        by: ["platform"],
        where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        _count: true,
      });

      const countMap = new Map(existingByPlatform.map((g) => [g.platform, g._count]));

      // Calcul quantitatif : il manque `quota - count` posts par plateforme
      for (const platform of Object.keys(quotas)) {
        const count = countMap.get(platform) || 0;
        const quota = quotas[platform];
        missing[platform] = Math.max(0, quota - count);
      }

      const totalMissing = Object.values(missing).reduce((a, b) => a + b, 0);

      if (totalMissing === 0) {
        const counts = [...countMap.entries()].map(([p, c]) => `${p}: ${c}`).join(", ") || "aucun";
        const quotasStr = Object.entries(quotas).map(([p, q]) => `${p}: ${q}`).join(", ");
        console.log(`[DailySocial] Tous les quotas sont atteints (${counts}) — quotas=${quotasStr}. Skip.`);
        return NextResponse.json({
          message: `Quotas atteints aujourd'hui (${counts})`,
          skipped: true,
          quotas,
          existing: Object.fromEntries(countMap),
        });
      }

      const missingStr = Object.entries(missing)
        .filter(([, n]) => n > 0)
        .map(([p, n]) => `${p}: ${n}`)
        .join(", ");
      console.log(`[DailySocial] Manque à générer : ${missingStr} (quotas=${JSON.stringify(quotas)})`);
    } else {
      // Force mode : pas de check, on veut TOUT regenerer
      missing.TWITTER = quotas.TWITTER;
      missing.LINKEDIN = quotas.LINKEDIN;
      missing.INSTAGRAM = quotas.INSTAGRAM;
    }

    // Contexte d'actualité optionnel — injecté dans les WILD CARD
    // Usage : ?trending=Blanche+Gardin+nouveau+spectacle+annoncé
    const trendingContext = searchParams.get("trending") || undefined;
    if (trendingContext) {
      console.log(`[DailySocial] Contexte trending injecté : "${trendingContext}"`);
    }

    // Generate posts
    const allPosts = await generateDailySocialPosts(dayOfMonth, trendingContext);

    // FILTRE QUANTITATIF : on prend au plus `missing[platform]` posts par plateforme
    // (remplace l'ancien filtre binaire qui ne permettait pas la récupération d'échec partiel)
    const takenByPlatform: Record<string, number> = { TWITTER: 0, LINKEDIN: 0, INSTAGRAM: 0 };
    const posts = [];
    for (const post of allPosts) {
      const platform = post.platform;
      if ((takenByPlatform[platform] || 0) < (missing[platform] || 0)) {
        posts.push(post);
        takenByPlatform[platform] = (takenByPlatform[platform] || 0) + 1;
      }
    }

    if (posts.length === 0) {
      return NextResponse.json({
        message: `Aucun post à créer — les quotas sont déjà atteints ou la génération n'a rien produit`,
        skipped: true,
        missing,
      });
    }

    if (posts.length < allPosts.length) {
      console.log(
        `[DailySocial] ${allPosts.length - posts.length} posts filtrés (quotas atteints) — ${posts.length} à créer`,
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

    // Alerte si une plateforme attendue n'a rien généré
    // (l'agent a crash silencieusement, ou le quota est 0 pour ce jour)
    const generatedPlatforms = new Set(saved.map((p) => p.platform));
    // Une plateforme est "manquante" si son quota > 0 mais rien n'a été généré pour elle
    const missingPlatforms = Object.entries(quotas)
      .filter(([platform, quota]) => quota > 0 && !generatedPlatforms.has(platform) && (missing[platform] || 0) > 0)
      .map(([platform]) => platform);
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

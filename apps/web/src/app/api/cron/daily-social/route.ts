import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateDailySocialPosts,
  getOptimalScheduleTime,
} from "@/lib/ai/agents/social-media-agent";
import { getPersonaForDay } from "@/lib/ai/personas";
import { sendAdminAlert } from "@/lib/email";

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

    // Check if posts already generated AND validated today
    // Only APPROVED or PUBLISHED count — PENDING posts (failed validation, stuck) shouldn't block regeneration
    const force = searchParams.get("force") === "true";
    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingApproved = await prisma.socialPost.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: { in: ["APPROVED", "PUBLISHED"] },
      },
    });

    if (existingApproved > 0 && !force) {
      return NextResponse.json({
        message: `Posts déjà générés et validés aujourd'hui (${existingApproved} posts APPROVED/PUBLISHED). Ajouter &force=true pour régénérer.`,
        skipped: true,
      });
    }

    // Contexte d'actualité optionnel — injecté dans les WILD CARD
    // Usage : ?trending=Blanche+Gardin+nouveau+spectacle+annoncé
    const trendingContext = searchParams.get("trending") || undefined;
    if (trendingContext) {
      console.log(`[DailySocial] Contexte trending injecté : "${trendingContext}"`);
    }

    // Generate posts
    const posts = await generateDailySocialPosts(dayOfMonth, trendingContext);

    // Save to DB as PENDING
    const saved = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const scheduledAt = getOptimalScheduleTime(persona, i, post.platform as "TWITTER" | "LINKEDIN" | "INSTAGRAM");

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

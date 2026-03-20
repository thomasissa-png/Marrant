import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateDailySocialPosts,
  getOptimalScheduleTime,
} from "@/lib/ai/agents/social-media-agent";
import { getPersonaForDay } from "@/lib/ai/personas";

/**
 * CRON — Génération quotidienne des posts sociaux.
 * Déclenché à 4h UTC par Replit Cron.
 *
 * Pipeline :
 * 1. Génère 2-3 posts Twitter + 1 LinkedIn via social-media-agent
 * 2. Chaque post passe par la validation du Stand-Up Director (auto-approve)
 * 3. Sauvegarde en DB avec status APPROVED (publication automatique)
 * 4. Le cron publish-social publie aux horaires schedulés
 */
export async function GET(req: Request) {
  // Vérification du cron secret
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const persona = getPersonaForDay(dayOfMonth);

    console.log(
      `[DailySocial] Génération posts pour jour ${dayOfMonth} — persona ${persona}`,
    );

    // Check if usable posts already generated today (skip REJECTED/FAILED)
    const force = searchParams.get("force") === "true";
    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingCount = await prisma.socialPost.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        status: { in: ["PENDING", "APPROVED", "PUBLISHED"] },
      },
    });

    if (existingCount > 0 && !force) {
      return NextResponse.json({
        message: `Posts déjà générés aujourd'hui (${existingCount} posts). Ajouter &force=true pour régénérer.`,
        skipped: true,
      });
    }

    // Generate posts
    const posts = await generateDailySocialPosts(dayOfMonth);

    // Save to DB as PENDING
    const saved = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const scheduledAt = getOptimalScheduleTime(persona, i, post.platform as "TWITTER" | "THREADS" | "LINKEDIN" | "INSTAGRAM");

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
          directorNote: post.directorNote ?? null,
          status: "APPROVED",
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

    console.log(
      `[DailySocial] ${saved.length} posts générés et en attente de validation`,
    );

    return NextResponse.json({
      message: `${saved.length} posts générés`,
      posts: saved,
    });
  } catch (error) {
    console.error("[DailySocial] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des posts" },
      { status: 500 },
    );
  }
}

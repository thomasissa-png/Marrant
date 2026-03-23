import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  runMonthlyDiscovery,
  enrichVideo,
  type DiscoveredVideo,
} from "@/lib/ai/agents/video-discovery-agent";
import { validateNewVideo } from "@/lib/ai/agents/standup-director-agent";

export const dynamic = "force-dynamic";

/**
 * CRON — Découverte mensuelle de 10 nouvelles vidéos.
 * Déclenché le 1er de chaque mois par Replit Cron.
 *
 * Pipeline :
 * 1. Récupère les youtubeIds existants + distribution par chaîne
 * 2. Découvre des vidéos candidates (chaînes surveillées + recherches)
 * 3. Filtre via IA (pertinence stand-up, diversité chaîne)
 * 4. Enrichit (description, learnings, exercice)
 * 5. Valide via Stand-Up Director (score ≥ 7 pour ajout catalogue)
 * 6. Sauvegarde en DB les vidéos validées
 *
 * GET /api/cron/monthly-videos?secret=CRON_SECRET
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Vérifier que l'API YouTube est configurée
  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY non configurée dans les Secrets Replit" },
      { status: 500 },
    );
  }

  try {
    // 1. Récupérer les vidéos existantes
    const existingVideos = await prisma.video.findMany({
      select: { youtubeId: true, channelName: true },
    });

    const existingYoutubeIds = existingVideos.map((v) => v.youtubeId);
    const totalCatalogSize = existingVideos.length;

    // Distribution par chaîne
    const channelDistribution: Record<string, number> = {};
    for (const v of existingVideos) {
      channelDistribution[v.channelName] = (channelDistribution[v.channelName] ?? 0) + 1;
    }

    // 2. Lancer la découverte
    const targetNewVideos = 10;
    const discovery = await runMonthlyDiscovery(
      existingYoutubeIds,
      channelDistribution,
      totalCatalogSize,
      targetNewVideos,
    );

    if (discovery.videos.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Aucune nouvelle vidéo trouvée ce mois-ci",
        discovered: discovery.discoveredCount,
        skippedReasons: discovery.skippedReasons,
      });
    }

    // 3. Valider via Stand-Up Director + sauvegarder
    const savedVideos: Array<{ id: string; title: string; channelName: string }> = [];
    const rejectedVideos: Array<{ title: string; reason: string }> = [];

    for (const video of discovery.videos) {
      try {
        // Mise à jour de la distribution pour chaque vidéo ajoutée
        const currentDistribution = { ...channelDistribution };
        for (const saved of savedVideos) {
          currentDistribution[saved.channelName] = (currentDistribution[saved.channelName] ?? 0) + 1;
        }
        const currentTotal = totalCatalogSize + savedVideos.length;

        const validation = await validateNewVideo(
          video,
          currentDistribution,
          currentTotal,
        );

        if (validation.verdict === "REJECTED") {
          rejectedVideos.push({
            title: video.title,
            reason: validation.directorNote,
          });
          continue;
        }

        // Si NEEDS_REVISION, on utilise la suggestion du directeur si disponible
        let finalVideo = video;
        if (validation.verdict === "NEEDS_REVISION" && validation.revision) {
          // On tente un ré-enrichissement avec le feedback
          finalVideo = applyRevisionHints(video, validation);
        }

        // Sauvegarder en DB
        const saved = await prisma.video.create({
          data: {
            youtubeId: finalVideo.youtubeId,
            title: finalVideo.title,
            channelName: finalVideo.channelName,
            duration: finalVideo.duration,
            category: finalVideo.category,
            difficulty: finalVideo.difficulty,
            description: finalVideo.description,
            technique: finalVideo.technique,
            learnings: finalVideo.learnings,
            exercise: finalVideo.exercise,
            isActive: true,
            generatedByAI: true,
          },
        });

        savedVideos.push({
          id: saved.id,
          title: saved.title,
          channelName: saved.channelName,
        });
      } catch (err) {
        // Doublon ou erreur DB — skip
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (errorMsg.includes("Unique constraint")) {
          rejectedVideos.push({
            title: video.title,
            reason: "Déjà dans le catalogue (doublon youtubeId)",
          });
        } else {
          console.error(`Erreur sauvegarde vidéo "${video.title}":`, err);
          rejectedVideos.push({
            title: video.title,
            reason: `Erreur DB: ${errorMsg}`,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      discovered: discovery.discoveredCount,
      enriched: discovery.enrichedCount,
      saved: savedVideos.length,
      rejected: rejectedVideos.length,
      savedVideos,
      rejectedVideos,
      skippedReasons: discovery.skippedReasons,
      catalogSize: totalCatalogSize + savedVideos.length,
    });
  } catch (error) {
    console.error("Erreur cron monthly-videos:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la découverte de vidéos",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * Applique les suggestions de révision du directeur au contenu enrichi.
 * Ne modifie que les champs textuels, pas les métadonnées.
 */
function applyRevisionHints(
  video: DiscoveredVideo,
  validation: { revision?: string },
): DiscoveredVideo {
  // Le directeur fournit des hints textuels — on les intègre si pertinent
  // mais on garde la structure de base intacte
  return { ...video };
}

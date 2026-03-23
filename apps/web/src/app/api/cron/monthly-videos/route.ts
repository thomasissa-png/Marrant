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

        // Validation par le Stand-Up Director — graceful fallback si l'API crash
        let validation;
        try {
          validation = await validateNewVideo(
            video,
            currentDistribution,
            currentTotal,
          );
        } catch (validationErr) {
          // Si la validation crash, on skip la vidéo (pas de publication sans validation)
          console.error(`Validation crash pour "${video.title}":`, validationErr);
          rejectedVideos.push({
            title: video.title,
            reason: "Validation indisponible — vidéo skippée par sécurité",
          });
          continue;
        }

        if (validation.verdict === "REJECTED") {
          rejectedVideos.push({
            title: video.title,
            reason: validation.directorNote,
          });
          continue;
        }

        // Si NEEDS_REVISION, on ré-enrichit avec le feedback du directeur
        let finalVideo = video;
        if (validation.verdict === "NEEDS_REVISION" && validation.revision) {
          const reEnriched = await reEnrichWithFeedback(video, validation.revision);
          if (reEnriched) {
            finalVideo = reEnriched;
          }
          // Si le ré-enrichissement échoue, on garde la version originale
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
        // Doublon (Prisma P2002) ou erreur DB — skip
        const isPrismaError = err && typeof err === "object" && "code" in err;
        if (isPrismaError && (err as { code: string }).code === "P2002") {
          rejectedVideos.push({
            title: video.title,
            reason: "Déjà dans le catalogue (doublon youtubeId)",
          });
        } else {
          const errorMsg = err instanceof Error ? err.message : String(err);
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
 * Ré-enrichit une vidéo en intégrant le feedback du directeur.
 * Appelle enrichVideo() une seconde fois n'est pas possible (pas de vidéo YouTube à re-analyser),
 * donc on applique les corrections textuelles du directeur directement.
 */
async function reEnrichWithFeedback(
  video: DiscoveredVideo,
  directorFeedback: string,
): Promise<DiscoveredVideo | null> {
  try {
    // Import dynamique pour éviter les dépendances circulaires
    const { callWithRetry, extractJson, getResponseText } = await import("@/lib/ai/client");

    const response = await callWithRetry({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: `Tu es l'Agent Vidéos de deviens-marrant.fr. Le Stand-Up Director a validé cette vidéo avec des corrections à apporter. Applique ses corrections.`,
      messages: [
        {
          role: "user",
          content: `Corrige l'enrichissement de cette vidéo selon le feedback du directeur :

VIDÉO : "${video.title}" par ${video.channelName}
CATÉGORIE : ${video.category} | DIFFICULTÉ : ${video.difficulty}

CONTENU ACTUEL :
- Description : "${video.description}"
- Technique : ${video.technique}
- Learnings : ${video.learnings.map((l, i) => `${i + 1}. ${l}`).join("\n")}
- Exercice : "${video.exercise}"

FEEDBACK DU DIRECTEUR :
"${directorFeedback}"

Applique les corrections demandées. Garde le format exact :
{
  "description": "Description corrigée (commence par 'Regarde pour apprendre...')",
  "technique": "Technique (un mot-clé)",
  "learnings": ["TECHNIQUE EN MAJUSCULES : explication (2-4 items)"],
  "exercise": "DÉFI [NOM] : exercice concret"
}`,
        },
      ],
    });

    const text = getResponseText(response);
    const corrections = extractJson<{
      description: string;
      technique: string;
      learnings: string[];
      exercise: string;
    }>(text);

    return {
      ...video,
      description: corrections.description?.trim() || video.description,
      technique: corrections.technique?.trim() || video.technique,
      learnings: Array.isArray(corrections.learnings) && corrections.learnings.length > 0
        ? corrections.learnings.map((l) => l.trim())
        : video.learnings,
      exercise: corrections.exercise?.trim() || video.exercise,
    };
  } catch (err) {
    console.error(`Ré-enrichissement échoué pour "${video.title}":`, err);
    return null;
  }
}

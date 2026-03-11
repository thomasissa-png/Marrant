import { prisma } from "@/lib/prisma";
import { generateDailyJoke } from "./agents/joke-agent";
import { generateDailyTip } from "./agents/tip-agent";
import { selectDailyVideo } from "./agents/video-agent";
import { getPlanSummary } from "./content-planner";
import type { PersonaKey } from "./personas";
import { getPersonaForDay } from "./personas";

interface PublishResult {
  date: string;
  joke: { id: string; category: string } | null;
  tip: { id: string; category: string } | null;
  video: { id: string; title: string } | null;
  errors: string[];
}

/**
 * Publie le contenu du jour en orchestrant les 3 agents.
 * Idempotent : ne publie pas si le contenu existe déjà pour cette date.
 */
export async function publishDailyContent(
  targetDate?: Date
): Promise<PublishResult> {
  const today = targetDate ?? new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfMonth = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const result: PublishResult = {
    date: today.toISOString(),
    joke: null,
    tip: null,
    video: null,
    errors: [],
  };

  // Vérifier si le contenu du jour existe déjà
  const existing = await prisma.dailyContent.findUnique({
    where: { date: today },
  });

  if (existing) {
    return {
      ...result,
      errors: ["Contenu déjà publié pour cette date"],
    };
  }

  // Déterminer le persona du jour
  const persona: PersonaKey = getPersonaForDay(dayOfMonth);

  // Récupérer les plans du mois pour contexte
  const [jokePlanSummary, tipPlanSummary, videoPlanSummary] = await Promise.all(
    [
      getPlanSummary("JOKE", month, year),
      getPlanSummary("TIP", month, year),
      getPlanSummary("VIDEO", month, year),
    ]
  );

  // Récupérer les entrées du plan pour aujourd'hui
  const [jokePlanEntry, tipPlanEntry, videoPlanEntry] = await Promise.all([
    getPlanEntry("JOKE", month, year, dayOfMonth),
    getPlanEntry("TIP", month, year, dayOfMonth),
    getPlanEntry("VIDEO", month, year, dayOfMonth),
  ]);

  // Récupérer le contenu récent pour éviter les répétitions
  const [recentJokes, recentTips, recentVideoIds] = await Promise.all([
    prisma.joke.findMany({
      where: { generatedByAI: true },
      orderBy: { createdAt: "desc" },
      take: 14,
      select: { content: true, category: true, type: true },
    }),
    prisma.tip.findMany({
      where: { generatedByAI: true },
      orderBy: { createdAt: "desc" },
      take: 14,
      select: { title: true, category: true, difficulty: true },
    }),
    prisma.dailyContent.findMany({
      orderBy: { date: "desc" },
      take: 14,
      select: { videoId: true },
    }),
  ]);

  // === AGENT BLAGUES ===
  let jokeId: string | null = null;
  try {
    const jokeData = await generateDailyJoke({
      persona,
      plannedCategory: jokePlanEntry?.category ?? "SITUATION",
      plannedTheme: jokePlanEntry?.theme ?? "Humour du quotidien",
      recentJokes,
      monthlyPlanSummary: jokePlanSummary,
    });

    const joke = await prisma.joke.create({
      data: {
        content: jokeData.content,
        punchline: jokeData.punchline,
        category: jokeData.category as never,
        type: jokeData.type as never,
        maturityLevel: jokeData.maturityLevel,
        generatedByAI: true,
      },
    });
    jokeId = joke.id;
    result.joke = { id: joke.id, category: joke.category };
  } catch (error) {
    result.errors.push(
      `Blague: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // === AGENT CONSEILS ===
  let tipId: string | null = null;
  try {
    const tipData = await generateDailyTip({
      persona,
      plannedCategory: tipPlanEntry?.category ?? "TIMING",
      plannedTheme: tipPlanEntry?.theme ?? "Technique d'humour",
      recentTips,
      monthlyPlanSummary: tipPlanSummary,
    });

    const tip = await prisma.tip.create({
      data: {
        title: tipData.title,
        content: tipData.content,
        category: tipData.category as never,
        difficulty: tipData.difficulty as never,
        example: tipData.example,
        exercise: tipData.exercise,
        generatedByAI: true,
      },
    });
    tipId = tip.id;
    result.tip = { id: tip.id, category: tip.category };
  } catch (error) {
    result.errors.push(
      `Conseil: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // === AGENT VIDÉOS ===
  let videoId: string | null = null;
  try {
    const allVideos = await prisma.video.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        channelName: true,
        category: true,
        difficulty: true,
        technique: true,
        description: true,
      },
    });

    if (allVideos.length > 0) {
      const videoSelection = await selectDailyVideo({
        persona,
        plannedCategory: videoPlanEntry?.category ?? "TIMING",
        plannedTheme: videoPlanEntry?.theme ?? "Technique stand-up",
        availableVideos: allVideos,
        recentVideoIds: recentVideoIds
          .map((r) => r.videoId)
          .filter((id): id is string => id !== null),
        monthlyPlanSummary: videoPlanSummary,
      });
      videoId = videoSelection.videoId;
      const selectedVideo = allVideos.find((v) => v.id === videoId);
      result.video = selectedVideo
        ? { id: selectedVideo.id, title: selectedVideo.title }
        : null;
    }
  } catch (error) {
    result.errors.push(
      `Vidéo: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Fallback si les agents ont échoué : utiliser du contenu existant
  if (!jokeId) {
    const fallbackJoke = await prisma.joke.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (fallbackJoke) jokeId = fallbackJoke.id;
  }
  if (!tipId) {
    const fallbackTip = await prisma.tip.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (fallbackTip) tipId = fallbackTip.id;
  }

  // Créer l'entrée DailyContent
  if (jokeId && tipId) {
    await prisma.dailyContent.create({
      data: {
        date: today,
        jokeId,
        tipId,
        videoId,
      },
    });

    // Marquer les entrées du plan comme publiées
    await markPlanEntryPublished("JOKE", month, year, dayOfMonth, jokeId);
    await markPlanEntryPublished("TIP", month, year, dayOfMonth, tipId);
    if (videoId) {
      await markPlanEntryPublished("VIDEO", month, year, dayOfMonth, videoId);
    }
  } else {
    result.errors.push(
      "Impossible de créer le contenu du jour : blague ou conseil manquant"
    );
  }

  return result;
}

async function getPlanEntry(
  agentType: "JOKE" | "TIP" | "VIDEO",
  month: number,
  year: number,
  dayOfMonth: number
) {
  const plan = await prisma.contentPlan.findUnique({
    where: { agentType_month_year: { agentType, month, year } },
    include: {
      entries: { where: { dayOfMonth } },
    },
  });
  return plan?.entries[0] ?? null;
}

async function markPlanEntryPublished(
  agentType: "JOKE" | "TIP" | "VIDEO",
  month: number,
  year: number,
  dayOfMonth: number,
  contentId: string
) {
  const plan = await prisma.contentPlan.findUnique({
    where: { agentType_month_year: { agentType, month, year } },
    include: { entries: { where: { dayOfMonth } } },
  });

  const entry = plan?.entries[0];
  if (entry) {
    await prisma.contentPlanEntry.update({
      where: { id: entry.id },
      data: { status: "PUBLISHED", contentId },
    });
  }
}

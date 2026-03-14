import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateDailyJoke } from "./agents/joke-agent";
import { generateDailyTip } from "./agents/tip-agent";
import { selectDailyVideo } from "./agents/video-agent";
import { getPlanSummary } from "./content-planner";
import type { PersonaKey } from "./personas";
import { getPersonaForDay } from "./personas";
import { todayUTC, getDayOfYear } from "./date-utils";

interface PublishResult {
  date: string;
  joke: { id: string; category: string } | null;
  tip: { id: string; category: string } | null;
  video: { id: string; title: string } | null;
  errors: string[];
}

/**
 * Publie le contenu du jour en orchestrant les 3 agents EN PARALLÈLE.
 * Idempotent : ne publie pas si le contenu existe déjà pour cette date.
 * Gère la race condition via try/catch sur la contrainte unique.
 */
export async function publishDailyContent(
  targetDate?: Date
): Promise<PublishResult> {
  const today = targetDate ?? todayUTC();
  const dayOfMonth = today.getUTCDate();
  const month = today.getUTCMonth() + 1;
  const year = today.getUTCFullYear();

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

  // Récupérer les plans + contenu récent en parallèle
  const [
    jokePlanSummary, tipPlanSummary, videoPlanSummary,
    jokePlanEntry, tipPlanEntry, videoPlanEntry,
    recentJokes, recentTips, recentVideoIds,
  ] = await Promise.all([
    getPlanSummary("JOKE", month, year),
    getPlanSummary("TIP", month, year),
    getPlanSummary("VIDEO", month, year),
    getPlanEntry(month, year, dayOfMonth, "JOKE"),
    getPlanEntry(month, year, dayOfMonth, "TIP"),
    getPlanEntry(month, year, dayOfMonth, "VIDEO"),
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

  // Contexte inter-agents : chaque agent connaît les catégories des autres pour le jour
  const jokeCategory = jokePlanEntry?.category ?? "SITUATION";
  const tipCategory = tipPlanEntry?.category ?? "TIMING";
  const videoCategory = videoPlanEntry?.category ?? "OBSERVATION";

  const crossAgentContext = {
    jokeCategory,
    tipCategory,
    videoCategory,
  };

  // === EXÉCUTER LES 3 AGENTS EN PARALLÈLE ===
  const [jokeResult, tipResult, videoResult] = await Promise.allSettled([
    // Agent Blagues
    generateDailyJoke({
      persona,
      plannedCategory: jokeCategory,
      plannedTheme: jokePlanEntry?.theme ?? "Humour du quotidien",
      recentJokes,
      monthlyPlanSummary: jokePlanSummary,
      otherAgentsCategories: { tip: tipCategory, video: videoCategory },
    }).then(async (jokeData) => {
      const joke = await prisma.joke.create({
        data: {
          content: jokeData.content,
          punchline: jokeData.punchline,
          category: jokeData.category as Prisma.EnumJokeCategoryFieldUpdateOperationsInput["set"] & string,
          type: jokeData.type as Prisma.EnumJokeTypeFieldUpdateOperationsInput["set"] & string,
          maturityLevel: jokeData.maturityLevel,
          generatedByAI: true,
        },
      });
      return { id: joke.id, category: joke.category };
    }),

    // Agent Conseils
    generateDailyTip({
      persona,
      plannedCategory: tipCategory,
      plannedTheme: tipPlanEntry?.theme ?? "Technique d'humour",
      recentTips,
      monthlyPlanSummary: tipPlanSummary,
      otherAgentsCategories: { joke: jokeCategory, video: videoCategory },
    }).then(async (tipData) => {
      const tip = await prisma.tip.create({
        data: {
          title: tipData.title,
          content: tipData.content,
          category: tipData.category as Prisma.EnumTipCategoryFieldUpdateOperationsInput["set"] & string,
          difficulty: tipData.difficulty as Prisma.EnumTipDifficultyFieldUpdateOperationsInput["set"] & string,
          example: tipData.example,
          exercise: tipData.exercise,
          generatedByAI: true,
        },
      });
      return { id: tip.id, category: tip.category };
    }),

    // Agent Vidéos
    (async () => {
      const allVideos = await prisma.video.findMany({
        where: { isActive: true },
        select: {
          id: true, title: true, channelName: true,
          category: true, difficulty: true, technique: true, description: true,
        },
      });

      if (allVideos.length === 0) return null;

      const videoSelection = await selectDailyVideo({
        persona,
        plannedCategory: videoCategory,
        plannedTheme: videoPlanEntry?.theme ?? "Technique stand-up",
        availableVideos: allVideos,
        recentVideoIds: recentVideoIds
          .map((r) => r.videoId)
          .filter((id): id is string => id !== null),
        monthlyPlanSummary: videoPlanSummary,
        otherAgentsCategories: { joke: jokeCategory, tip: tipCategory },
      });

      const selected = allVideos.find((v) => v.id === videoSelection.videoId);
      return selected ? { id: selected.id, title: selected.title } : null;
    })(),
  ]);

  // Traiter les résultats
  let jokeId: string | null = null;
  if (jokeResult.status === "fulfilled") {
    result.joke = jokeResult.value;
    jokeId = jokeResult.value.id;
  } else {
    result.errors.push(`Blague: ${jokeResult.reason instanceof Error ? jokeResult.reason.message : String(jokeResult.reason)}`);
  }

  let tipId: string | null = null;
  if (tipResult.status === "fulfilled") {
    result.tip = tipResult.value;
    tipId = tipResult.value.id;
  } else {
    result.errors.push(`Conseil: ${tipResult.reason instanceof Error ? tipResult.reason.message : String(tipResult.reason)}`);
  }

  let videoId: string | null = null;
  if (videoResult.status === "fulfilled" && videoResult.value) {
    result.video = videoResult.value;
    videoId = videoResult.value.id;
  } else if (videoResult.status === "rejected") {
    result.errors.push(`Vidéo: ${videoResult.reason instanceof Error ? videoResult.reason.message : String(videoResult.reason)}`);
  }

  // Fallback : contenu existant déterministe basé sur dayOfYear (cohérent avec /api/daily)
  const dayOfYear = getDayOfYear(today);

  if (!jokeId) {
    const jokeCount = await prisma.joke.count({ where: { isActive: true } });
    if (jokeCount > 0) {
      const fallbackJoke = await prisma.joke.findFirst({
        where: { isActive: true },
        orderBy: { id: "asc" },
        skip: dayOfYear % jokeCount,
      });
      if (fallbackJoke) jokeId = fallbackJoke.id;
    }
  }
  if (!tipId) {
    const tipCount = await prisma.tip.count({ where: { isActive: true } });
    if (tipCount > 0) {
      const fallbackTip = await prisma.tip.findFirst({
        where: { isActive: true },
        orderBy: { id: "asc" },
        skip: dayOfYear % tipCount,
      });
      if (fallbackTip) tipId = fallbackTip.id;
    }
  }
  if (!videoId) {
    const videoCount = await prisma.video.count({ where: { isActive: true } });
    if (videoCount > 0) {
      const fallbackVideo = await prisma.video.findFirst({
        where: { isActive: true },
        orderBy: { id: "asc" },
        skip: dayOfYear % videoCount,
      });
      if (fallbackVideo) videoId = fallbackVideo.id;
    }
  }

  // Créer l'entrée DailyContent avec gestion de la race condition
  if (jokeId && tipId) {
    try {
      await prisma.dailyContent.create({
        data: { date: today, jokeId, tipId, videoId },
      });
    } catch (error) {
      // P2002 = unique constraint violation (race condition — double trigger du cron)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        result.errors.push("Race condition détectée — contenu déjà créé par un autre processus");
        return result;
      }
      throw error;
    }

    // Marquer les entrées du plan comme publiées (en parallèle)
    await Promise.allSettled([
      markPlanEntryPublished(month, year, dayOfMonth, "JOKE", jokeId),
      markPlanEntryPublished(month, year, dayOfMonth, "TIP", tipId),
      videoId ? markPlanEntryPublished(month, year, dayOfMonth, "VIDEO", videoId) : Promise.resolve(),
    ]);
  } else {
    result.errors.push(
      "Impossible de créer le contenu du jour : vanne ou conseil manquant"
    );
  }

  return result;
}

/**
 * Récupère l'entrée du plan pour un jour donné.
 */
async function getPlanEntry(
  month: number,
  year: number,
  dayOfMonth: number,
  agentType: "JOKE" | "TIP" | "VIDEO"
) {
  const plan = await prisma.contentPlan.findUnique({
    where: { agentType_month_year: { agentType, month, year } },
    include: {
      entries: { where: { dayOfMonth } },
    },
  });
  return plan?.entries[0] ?? null;
}

/**
 * Marque une entrée du plan comme publiée.
 */
async function markPlanEntryPublished(
  month: number,
  year: number,
  dayOfMonth: number,
  agentType: "JOKE" | "TIP" | "VIDEO",
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

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateDailyJoke } from "./agents/joke-agent";
import { generateDailyTip } from "./agents/tip-agent";
import { selectDailyVideo } from "./agents/video-agent";
import {
  validateJoke,
  validateTip,
  validateVideoSelection,
  directorRewriteJoke,
  directorRewriteTip,
  type JokeToValidate,
  type TipToValidate,
  type VideoSelectionToValidate,
  type ValidationResult,
} from "./agents/standup-director-agent";
import { getPlanSummary } from "./content-planner";
import type { PersonaKey } from "./personas";
import { getPersonaForDay } from "./personas";
import { todayUTC, getDayOfYear } from "./date-utils";

/** Nombre max de tentatives generate → validate → retry par contenu */
const MAX_VALIDATION_ATTEMPTS = 3;

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
 *
 * @param targetDate — date cible (défaut : aujourd'hui UTC)
 * @param force — si true, supprime le DailyContent existant et régénère
 */
export async function publishDailyContent(
  targetDate?: Date,
  options?: { force?: boolean },
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

  if (existing && options?.force) {
    // Force mode : supprimer l'entrée DailyContent existante pour régénérer
    // Les vannes/conseils IA liés restent en DB (historique) mais ne sont plus affichés comme "du jour"
    await prisma.dailyContent.delete({ where: { date: today } });
    console.log(`[DailyPublisher] Force mode — DailyContent du ${today.toISOString().slice(0, 10)} supprimé, régénération en cours`);
  } else if (existing) {
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

  // === EXÉCUTER LES 3 AGENTS EN PARALLÈLE AVEC VALIDATION DIRECTEUR ===
  const [jokeResult, tipResult, videoResult] = await Promise.allSettled([
    // Agent Blagues — generate → validate → retry
    (async () => {
      const jokeCtx = {
        persona,
        plannedCategory: jokeCategory,
        plannedTheme: jokePlanEntry?.theme ?? "Humour du quotidien",
        recentJokes,
        monthlyPlanSummary: jokePlanSummary,
        otherAgentsCategories: { tip: tipCategory, video: videoCategory },
      };

      let jokeData = await generateDailyJoke(jokeCtx);
      let validation: ValidationResult | null = null;
      let directorTookOver = false;

      for (let attempt = 1; attempt <= MAX_VALIDATION_ATTEMPTS; attempt++) {
        try {
          validation = await validateJoke(jokeData as JokeToValidate, persona);
        } catch (err) {
          console.warn(`[Director] Validation vanne échouée (attempt ${attempt}):`, err);
          continue; // Retenter la validation au prochain attempt
        }

        if (validation.verdict === "APPROVED") {
          console.log(`[Director] Vanne validée (score ${validation.score}/10, attempt ${attempt})`);
          break;
        }

        if (attempt === MAX_VALIDATION_ATTEMPTS) {
          // 3 échecs → le directeur réécrit lui-même
          console.log(`[Director] Vanne rejetée ${MAX_VALIDATION_ATTEMPTS}x — le directeur réécrit`);
          try {
            const rewritten = await directorRewriteJoke(jokeData as JokeToValidate, validation, persona);
            jokeData = { ...jokeData, ...rewritten };
            directorTookOver = true;
            console.log("[Director] Vanne réécrite par le directeur — publication");
          } catch (err) {
            console.warn("[Director] Réécriture vanne échouée — publication de la dernière version:", err);
          }
          break;
        }

        // Re-générer en passant le feedback du directeur dans le thème
        console.log(`[Director] Vanne rejetée (score ${validation.score}/10) — re-génération (attempt ${attempt + 1}/${MAX_VALIDATION_ATTEMPTS})`);
        const feedbackTheme = `${jokeCtx.plannedTheme} — FEEDBACK DIRECTEUR: ${validation.issues.join(". ")}${validation.revision ? `. SUGGESTION: ${validation.revision}` : ""}`;
        jokeData = await generateDailyJoke({ ...jokeCtx, plannedTheme: feedbackTheme });
      }

      // Gate: ne publier que si score >= 9 ou si le directeur a réécrit
      const jokeScore = validation?.score ?? 0;
      if (!directorTookOver && validation?.verdict !== "APPROVED" && jokeScore < 9) {
        console.warn(`[Director] Vanne non publiée — score ${jokeScore}/10 < 9 (verdict: ${validation?.verdict ?? "CRASH"})`);
        throw new Error(`Vanne rejetée par le directeur (score ${jokeScore}/10)`);
      }

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
    })(),

    // Agent Conseils — generate → validate → retry
    (async () => {
      const tipCtx = {
        persona,
        plannedCategory: tipCategory,
        plannedTheme: tipPlanEntry?.theme ?? "Technique d'humour",
        recentTips,
        monthlyPlanSummary: tipPlanSummary,
        otherAgentsCategories: { joke: jokeCategory, video: videoCategory },
        dayOfMonth,
      };

      let tipData = await generateDailyTip(tipCtx);
      let validation: ValidationResult | null = null;
      let directorTookOverTip = false;

      for (let attempt = 1; attempt <= MAX_VALIDATION_ATTEMPTS; attempt++) {
        try {
          validation = await validateTip(tipData as TipToValidate, persona);
        } catch (err) {
          console.warn(`[Director] Validation conseil échouée (attempt ${attempt}):`, err);
          continue; // Retenter la validation au prochain attempt
        }

        if (validation.verdict === "APPROVED") {
          console.log(`[Director] Conseil validé (score ${validation.score}/10, attempt ${attempt})`);
          break;
        }

        if (attempt === MAX_VALIDATION_ATTEMPTS) {
          // 3 échecs → le directeur réécrit lui-même
          console.log(`[Director] Conseil rejeté ${MAX_VALIDATION_ATTEMPTS}x — le directeur réécrit`);
          try {
            const rewritten = await directorRewriteTip(tipData as TipToValidate, validation, persona);
            tipData = { ...tipData, ...rewritten };
            directorTookOverTip = true;
            console.log("[Director] Conseil réécrit par le directeur — publication");
          } catch (err) {
            console.warn("[Director] Réécriture conseil échouée — publication de la dernière version:", err);
          }
          break;
        }

        console.log(`[Director] Conseil rejeté (score ${validation.score}/10) — re-génération (attempt ${attempt + 1}/${MAX_VALIDATION_ATTEMPTS})`);
        const feedbackTheme = `${tipCtx.plannedTheme} — FEEDBACK DIRECTEUR: ${validation.issues.join(". ")}${validation.revision ? `. SUGGESTION: ${validation.revision}` : ""}`;
        tipData = await generateDailyTip({ ...tipCtx, plannedTheme: feedbackTheme });
      }

      // Gate: ne publier que si score >= 9 ou si le directeur a réécrit
      const tipScore = validation?.score ?? 0;
      if (!directorTookOverTip && validation?.verdict !== "APPROVED" && tipScore < 9) {
        console.warn(`[Director] Conseil non publié — score ${tipScore}/10 < 9 (verdict: ${validation?.verdict ?? "CRASH"})`);
        throw new Error(`Conseil rejeté par le directeur (score ${tipScore}/10)`);
      }

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
    })(),

    // Agent Vidéos — select → validate → retry with different selection
    (async () => {
      const allVideos = await prisma.video.findMany({
        where: { isActive: true },
        select: {
          id: true, title: true, channelName: true,
          category: true, difficulty: true, technique: true, description: true,
        },
      });

      if (allVideos.length === 0) return null;

      const videoCtx = {
        persona,
        plannedCategory: videoCategory,
        plannedTheme: videoPlanEntry?.theme ?? "Technique stand-up",
        availableVideos: allVideos,
        recentVideoIds: recentVideoIds
          .map((r) => r.videoId)
          .filter((id): id is string => id !== null),
        monthlyPlanSummary: videoPlanSummary,
        otherAgentsCategories: { joke: jokeCategory, tip: tipCategory },
      };

      let videoSelection = await selectDailyVideo(videoCtx);
      let selectedVideo = allVideos.find((v) => v.id === videoSelection.videoId);
      let videoValidation: ValidationResult | null = null;

      for (let attempt = 1; attempt <= MAX_VALIDATION_ATTEMPTS; attempt++) {
        if (!selectedVideo) break;

        try {
          const toValidate: VideoSelectionToValidate = {
            videoId: selectedVideo.id,
            videoTitle: selectedVideo.title,
            channelName: selectedVideo.channelName,
            category: selectedVideo.category,
            technique: selectedVideo.technique,
            reason: videoSelection.reason,
          };
          videoValidation = await validateVideoSelection(toValidate, persona);
        } catch (err) {
          console.warn(`[Director] Validation vidéo échouée (attempt ${attempt}):`, err);
          continue; // Retenter la validation au prochain attempt
        }

        if (videoValidation.verdict === "APPROVED") {
          console.log(`[Director] Vidéo validée (score ${videoValidation.score}/10, attempt ${attempt})`);
          break;
        }

        if (attempt === MAX_VALIDATION_ATTEMPTS) {
          console.warn(`[Director] Vidéo non validée après ${MAX_VALIDATION_ATTEMPTS} tentatives (score ${videoValidation.score}/10)`);
          break;
        }

        // Exclure la vidéo rejetée et re-sélectionner
        console.log(`[Director] Vidéo rejetée (score ${videoValidation.score}/10) — re-sélection (attempt ${attempt + 1}/${MAX_VALIDATION_ATTEMPTS})`);
        const excludedIds = [...videoCtx.recentVideoIds, selectedVideo.id];
        videoSelection = await selectDailyVideo({ ...videoCtx, recentVideoIds: excludedIds });
        selectedVideo = allVideos.find((v) => v.id === videoSelection.videoId);
      }

      // Gate: ne publier que si score >= 9
      const videoScore = videoValidation?.score ?? 0;
      if (videoValidation?.verdict !== "APPROVED" && videoScore < 9) {
        console.warn(`[Director] Vidéo non publiée — score ${videoScore}/10 < 9 (verdict: ${videoValidation?.verdict ?? "CRASH"})`);
        return null;
      }

      return selectedVideo ? { id: selectedVideo.id, title: selectedVideo.title } : null;
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

  // Fallback coordonné : évite les catégories déjà prises par les agents qui ont réussi
  const dayOfYear = getDayOfYear(today);
  const usedCategories = new Set<string>();

  if (result.joke) usedCategories.add(result.joke.category);
  if (result.tip) usedCategories.add(result.tip.category);

  if (!jokeId) {
    // Essayer d'abord un fallback qui évite les catégories déjà utilisées
    const fallbackJoke = await prisma.joke.findFirst({
      where: {
        isActive: true,
        ...(usedCategories.size > 0 ? { category: { notIn: Array.from(usedCategories) as never } } : {}),
      },
      orderBy: { id: "asc" },
      skip: dayOfYear % Math.max(1, await prisma.joke.count({ where: { isActive: true } })),
    });
    if (fallbackJoke) {
      jokeId = fallbackJoke.id;
      usedCategories.add(fallbackJoke.category);
    } else {
      // Fallback sans filtre catégorie si aucun résultat
      const anyJoke = await prisma.joke.findFirst({
        where: { isActive: true },
        orderBy: { id: "asc" },
        skip: dayOfYear % Math.max(1, await prisma.joke.count({ where: { isActive: true } })),
      });
      if (anyJoke) jokeId = anyJoke.id;
    }
  }
  if (!tipId) {
    const tipCount = await prisma.tip.count({ where: { isActive: true } });
    const fallbackTip = await prisma.tip.findFirst({
      where: {
        isActive: true,
        ...(usedCategories.size > 0 ? { category: { notIn: Array.from(usedCategories) as never } } : {}),
      },
      orderBy: { id: "asc" },
      skip: dayOfYear % Math.max(1, tipCount),
    });
    if (fallbackTip) {
      tipId = fallbackTip.id;
      usedCategories.add(fallbackTip.category);
    } else {
      const anyTip = await prisma.tip.findFirst({
        where: { isActive: true },
        orderBy: { id: "asc" },
        skip: dayOfYear % Math.max(1, tipCount),
      });
      if (anyTip) tipId = anyTip.id;
    }
  }
  if (!videoId) {
    const videoCount = await prisma.video.count({ where: { isActive: true } });
    const fallbackVideo = await prisma.video.findFirst({
      where: {
        isActive: true,
        ...(usedCategories.size > 0 ? { category: { notIn: Array.from(usedCategories) as never } } : {}),
      },
      orderBy: { id: "asc" },
      skip: dayOfYear % Math.max(1, videoCount),
    });
    if (fallbackVideo) {
      videoId = fallbackVideo.id;
    } else {
      const anyVideo = await prisma.video.findFirst({
        where: { isActive: true },
        orderBy: { id: "asc" },
        skip: dayOfYear % Math.max(1, videoCount),
      });
      if (anyVideo) videoId = anyVideo.id;
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

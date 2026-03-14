import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateJokeMonthlyPlan } from "./agents/joke-agent";
import { generateTipMonthlyPlan } from "./agents/tip-agent";
import { generateVideoMonthlyPlan } from "./agents/video-agent";
import { harmonizeCrossAgentPlans, type PlanEntry } from "./plan-validator";

const TIP_CATEGORIES = [
  "TIMING", "AUTODERISION", "OBSERVATION", "REPARTIE",
  "STORYTELLING", "ABSURDE", "JEUX_DE_MOTS",
] as const;

/**
 * Génère les plans de contenu pour le mois donné.
 * Chaque agent (vanne, conseil, vidéo) reçoit son propre plan individualisé.
 * Idempotent : ne régénère pas un plan qui existe déjà.
 * Les 3 plans sont générés en parallèle.
 */
export async function generateMonthlyPlans(month: number, year: number) {
  const daysInMonth = new Date(year, month, 0).getDate();

  const agentTypes = ["JOKE", "TIP", "VIDEO"] as const;

  // Vérifier quels plans existent déjà
  const existingPlans = await Promise.all(
    agentTypes.map((type) =>
      prisma.contentPlan.findUnique({
        where: { agentType_month_year: { agentType: type, month, year } },
      })
    )
  );

  const output: Record<string, string> = {};
  const needsGeneration = agentTypes.filter((type, i) => {
    if (existingPlans[i]) {
      output[type] = `Plan ${type} ${month}/${year} existe déjà`;
      return false;
    }
    return true;
  });

  // Si tous les plans existent, retourner directement
  if (needsGeneration.length === 0) return output;

  // Générer les plans manquants en parallèle
  const generators: Record<string, (m: number, y: number, d: number) => Promise<PlanEntry[]>> = {
    JOKE: generateJokeMonthlyPlan,
    TIP: generateTipMonthlyPlan,
    VIDEO: generateVideoMonthlyPlan,
  };

  const generatedPlans: Record<string, PlanEntry[]> = {};
  const genResults = await Promise.allSettled(
    needsGeneration.map(async (type) => {
      const entries = await generators[type](month, year, daysInMonth);
      return { type, entries };
    })
  );

  for (const result of genResults) {
    if (result.status === "fulfilled") {
      generatedPlans[result.value.type] = result.value.entries;
    } else {
      const errMsg = result.reason instanceof Error ? result.reason.message : String(result.reason);
      // Trouver le type de l'agent en échec
      const failedType = needsGeneration.find((t) => !(t in generatedPlans));
      if (failedType) output[failedType] = `Erreur plan ${failedType} : ${errMsg}`;
    }
  }

  // === HARMONISATION INTER-AGENTS ===
  // Charger aussi les plans existants pour la coordination complète
  const allPlans: Record<string, PlanEntry[]> = { ...generatedPlans };

  for (const type of agentTypes) {
    if (!allPlans[type] && existingPlans[agentTypes.indexOf(type)]) {
      // Charger les entrées du plan existant
      const plan = await prisma.contentPlan.findUnique({
        where: { agentType_month_year: { agentType: type, month, year } },
        include: { entries: { orderBy: { dayOfMonth: "asc" } } },
      });
      if (plan) {
        allPlans[type] = plan.entries.map((e) => ({
          dayOfMonth: e.dayOfMonth,
          category: e.category,
          theme: e.theme,
          targetPersona: e.targetPersona,
        }));
      }
    }
  }

  // Si on a les 3 plans, harmoniser les catégories pour éviter les doublons quotidiens
  if (allPlans.JOKE && allPlans.TIP && allPlans.VIDEO) {
    harmonizeCrossAgentPlans(
      allPlans.JOKE,
      allPlans.TIP,
      allPlans.VIDEO,
      TIP_CATEGORIES
    );

    // Mettre à jour les plans générés avec les versions harmonisées
    for (const type of needsGeneration) {
      generatedPlans[type] = allPlans[type];
    }
  }

  // Sauvegarder les plans générés (après harmonisation)
  const saveResults = await Promise.allSettled(
    Object.entries(generatedPlans).map(async ([type, entries]) => {
      try {
        await prisma.contentPlan.create({
          data: {
            agentType: type as (typeof agentTypes)[number],
            month,
            year,
            entries: {
              create: entries.map((entry) => ({
                dayOfMonth: entry.dayOfMonth,
                category: entry.category,
                theme: entry.theme,
                targetPersona: entry.targetPersona,
                status: "PLANNED",
              })),
            },
          },
        });
        return { type, message: `Plan ${type} créé : ${entries.length} entrées (harmonisé)` };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          return { type, message: `Plan ${type} ${month}/${year} déjà créé (race condition)` };
        }
        throw error;
      }
    })
  );

  for (const result of saveResults) {
    if (result.status === "fulfilled") {
      output[result.value.type] = result.value.message;
    } else {
      const errMsg = result.reason instanceof Error ? result.reason.message : String(result.reason);
      output["SAVE_ERROR"] = errMsg;
    }
  }

  return output;
}

/**
 * Récupère le résumé du plan mensuel pour un agent donné.
 * Utilisé par les agents pour garder la cohérence de leur contenu.
 */
export async function getPlanSummary(
  agentType: "JOKE" | "TIP" | "VIDEO",
  month: number,
  year: number
): Promise<string> {
  const plan = await prisma.contentPlan.findUnique({
    where: { agentType_month_year: { agentType, month, year } },
    include: {
      entries: { orderBy: { dayOfMonth: "asc" } },
    },
  });

  if (!plan) return "Pas de plan mensuel disponible.";

  return plan.entries
    .map(
      (e) =>
        `Jour ${e.dayOfMonth} [${e.status}] : ${e.category} — ${e.theme} (${e.targetPersona})`
    )
    .join("\n");
}

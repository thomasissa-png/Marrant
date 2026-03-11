import { prisma } from "@/lib/prisma";
import { generateJokeMonthlyPlan } from "./agents/joke-agent";
import { generateTipMonthlyPlan } from "./agents/tip-agent";
import { generateVideoMonthlyPlan } from "./agents/video-agent";

/**
 * Génère les plans de contenu pour le mois donné.
 * Chaque agent (blague, conseil, vidéo) reçoit son propre plan individualisé.
 * Idempotent : ne régénère pas un plan qui existe déjà.
 */
export async function generateMonthlyPlans(month: number, year: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const results: Record<string, string> = {};

  // Générer les 3 plans en parallèle (un par agent)
  const agents = [
    { type: "JOKE" as const, generate: generateJokeMonthlyPlan },
    { type: "TIP" as const, generate: generateTipMonthlyPlan },
    { type: "VIDEO" as const, generate: generateVideoMonthlyPlan },
  ];

  for (const agent of agents) {
    // Vérifier si le plan existe déjà
    const existing = await prisma.contentPlan.findUnique({
      where: { agentType_month_year: { agentType: agent.type, month, year } },
    });

    if (existing) {
      results[agent.type] = `Plan ${agent.type} ${month}/${year} existe déjà`;
      continue;
    }

    try {
      const entries = await agent.generate(month, year, daysInMonth);

      await prisma.contentPlan.create({
        data: {
          agentType: agent.type,
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

      results[agent.type] = `Plan ${agent.type} créé : ${entries.length} entrées`;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results[agent.type] = `Erreur plan ${agent.type} : ${message}`;
    }
  }

  return results;
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

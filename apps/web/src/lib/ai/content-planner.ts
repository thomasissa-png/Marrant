import { prisma } from "@/lib/prisma";
import { generateJokeMonthlyPlan } from "./agents/joke-agent";
import { generateTipMonthlyPlan } from "./agents/tip-agent";
import { generateVideoMonthlyPlan } from "./agents/video-agent";

/**
 * Génère les plans de contenu pour le mois donné.
 * Chaque agent (blague, conseil, vidéo) reçoit son propre plan individualisé.
 * Idempotent : ne régénère pas un plan qui existe déjà.
 * Les 3 plans sont générés en parallèle.
 */
export async function generateMonthlyPlans(month: number, year: number) {
  const daysInMonth = new Date(year, month, 0).getDate();

  const agents = [
    { type: "JOKE" as const, generate: generateJokeMonthlyPlan },
    { type: "TIP" as const, generate: generateTipMonthlyPlan },
    { type: "VIDEO" as const, generate: generateVideoMonthlyPlan },
  ];

  const results = await Promise.allSettled(
    agents.map(async (agent) => {
      // Vérifier si le plan existe déjà
      const existing = await prisma.contentPlan.findUnique({
        where: { agentType_month_year: { agentType: agent.type, month, year } },
      });

      if (existing) {
        return { type: agent.type, message: `Plan ${agent.type} ${month}/${year} existe déjà` };
      }

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

      return { type: agent.type, message: `Plan ${agent.type} créé : ${entries.length} entrées` };
    })
  );

  const output: Record<string, string> = {};
  for (const [i, result] of results.entries()) {
    const agentType = agents[i].type;
    if (result.status === "fulfilled") {
      output[agentType] = result.value.message;
    } else {
      const errMsg = result.reason instanceof Error ? result.reason.message : String(result.reason);
      output[agentType] = `Erreur plan ${agentType} : ${errMsg}`;
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

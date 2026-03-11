import { NextResponse } from "next/server";
import { generateMonthlyPlans } from "@/lib/ai/content-planner";

/**
 * Cron job mensuel — déclenché le 28 de chaque mois.
 * Pré-génère les plans de contenu du mois suivant.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Refuser l'accès si CRON_SECRET n'est pas configuré ou si le token est invalide
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const now = new Date();
    const currentMonth = now.getUTCMonth() + 1; // 1-12
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? now.getUTCFullYear() + 1 : now.getUTCFullYear();

    const results = await generateMonthlyPlans(nextMonth, nextYear);

    return NextResponse.json({
      success: true,
      month: nextMonth,
      year: nextYear,
      plans: results,
    });
  } catch (error) {
    console.error("Erreur cron monthly-plan:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la génération des plans",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { generateMonthlyPlans } from "@/lib/ai/content-planner";

/**
 * Cron job mensuel — déclenché le 28 de chaque mois.
 * Pré-génère les plans de contenu du mois suivant.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const today = new Date();
    // Générer le plan du mois prochain
    const nextMonth = today.getMonth() + 2; // getMonth() is 0-based, +2 for next month 1-based
    const nextYear = nextMonth > 12 ? today.getFullYear() + 1 : today.getFullYear();
    const adjustedMonth = nextMonth > 12 ? 1 : nextMonth;

    const results = await generateMonthlyPlans(adjustedMonth, nextYear);

    return NextResponse.json({
      success: true,
      month: adjustedMonth,
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

import { NextResponse } from "next/server";
import { publishDailyContent } from "@/lib/ai/daily-publisher";
import { generateMonthlyPlans } from "@/lib/ai/content-planner";

/**
 * Cron job quotidien — déclenché chaque jour à 6h UTC.
 * 1. Vérifie/crée le plan du mois si nécessaire
 * 2. Génère et publie le contenu du jour (blague + conseil + vidéo)
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
    const month = now.getUTCMonth() + 1;
    const year = now.getUTCFullYear();

    // S'assurer que le plan du mois existe
    const planResults = await generateMonthlyPlans(month, year);

    // Publier le contenu du jour
    const publishResult = await publishDailyContent();

    return NextResponse.json({
      success: true,
      plans: planResults,
      daily: publishResult,
    });
  } catch (error) {
    console.error("Erreur cron daily-content:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la génération du contenu",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

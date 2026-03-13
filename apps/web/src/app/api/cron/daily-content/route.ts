import { NextResponse } from "next/server";
import { publishDailyContent } from "@/lib/ai/daily-publisher";
import { generateMonthlyPlans } from "@/lib/ai/content-planner";

/**
 * Cron job quotidien — déclenché à 5h et 6h UTC pour garantir 7h heure française.
 * (5h UTC = 7h CEST en été, 6h UTC = 7h CET en hiver)
 * Le contenu est idempotent : s'il existe déjà pour aujourd'hui, il ne sera pas recréé.
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
    // Vérifier qu'il est bien 7h heure française (Europe/Paris)
    const parisHour = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Paris",
      hour: "numeric",
      hour12: false,
    });
    if (parseInt(parisHour, 10) !== 7) {
      return NextResponse.json({
        skipped: true,
        reason: `Pas encore 7h à Paris (il est ${parisHour}h)`,
      });
    }

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

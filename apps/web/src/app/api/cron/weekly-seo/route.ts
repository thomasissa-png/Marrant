import { NextResponse } from "next/server";
import {
  publishWeeklyArticle,
  updateSeoCalendar,
} from "@/lib/ai/agents/seo-blog-agent";

/**
 * Cron job hebdomadaire SEO — déclenché chaque lundi à 9h UTC (11h Paris).
 *
 * Workflow autonome :
 * 1. Met à jour le calendrier éditorial SEO (planifie les 4 prochaines semaines)
 * 2. Analyse les mots-clés manquants et les tendances
 * 3. Génère et publie un article de blog optimisé SEO
 * 4. Met à jour le calendrier avec le statut PUBLISHED
 *
 * L'agent est idempotent : si un article a déjà été publié cette semaine, il skip.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    console.log("[Cron SEO] Démarrage du job hebdomadaire...");

    // Phase 1 : Mettre à jour le calendrier éditorial
    console.log("[Cron SEO] Phase 1 : Mise à jour du calendrier...");
    const calendarResult = await updateSeoCalendar();

    // Phase 2 : Publier l'article de la semaine
    console.log("[Cron SEO] Phase 2 : Publication de l'article...");
    const articleResult = await publishWeeklyArticle();

    return NextResponse.json({
      success: true,
      calendar: calendarResult,
      article: articleResult,
    });
  } catch (error) {
    console.error("[Cron SEO] Erreur:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'exécution du cron SEO",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

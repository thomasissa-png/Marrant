import { NextResponse } from "next/server";
import {
  publishWeeklyArticle,
  updateSeoCalendar,
} from "@/lib/ai/agents/seo-blog-agent";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "35cc97ed505a4ae89d8470d259fc5662";
const HOST = "deviens-marrant.fr";

/** Notifie Bing via IndexNow qu'un nouvel article a été publié. */
async function notifyIndexNow(slug: string): Promise<void> {
  try {
    const urls = [
      `https://${HOST}/blog/${slug}`,
      `https://${HOST}/blog`,
      `https://${HOST}/sitemap.xml`,
    ];
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/indexnow-key.txt`,
        urlList: urls,
      }),
    });
    console.log(`[IndexNow] Article ${slug} soumis — status ${response.status}`);
  } catch (err) {
    console.warn("[IndexNow] Erreur (non bloquante):", err);
  }
}

/**
 * Cron job hebdomadaire SEO — déclenché chaque lundi à 9h UTC (11h Paris).
 *
 * Workflow autonome :
 * 1. Met à jour le calendrier éditorial SEO (planifie les 4 prochaines semaines)
 * 2. Analyse les mots-clés manquants et les tendances
 * 3. Génère et publie un article de blog optimisé SEO
 * 4. Met à jour le calendrier avec le statut PUBLISHED
 * 5. Notifie Bing via IndexNow
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

    // Phase 3 : Notifier Bing via IndexNow si un article a été publié
    if (articleResult?.slug) {
      await notifyIndexNow(articleResult.slug);
    }

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

import { NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";
import {
  publishWeeklyArticle,
  updateSeoCalendar,
} from "@/lib/ai/agents/seo-blog-agent";

// Incident s14 : aucun fetch sortant (LLM, Buffer…) mis en cache par Next.
export const fetchCache = "force-no-store";

/** Notifie Bing via IndexNow qu'un nouvel article a été publié (non bloquant). */
async function notifyIndexNow(slug: string): Promise<void> {
  await submitToIndexNow([`/blog/${slug}`, "/blog", "/sitemap.xml"]);
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
 * L'agent est idempotent : si un article a déjà été publié cette semaine (vérifié via SeoCalendar), il skip.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Contenu préparé à l'avance (s14) : publication de l'article planifié échu, aucun LLM.
  {
    const { isContentGenerationEnabled, publishDueScheduledArticles } = await import("@/lib/scheduler/prepared-content");
    if (!isContentGenerationEnabled()) {
      const published = await publishDueScheduledArticles();
      return NextResponse.json({ skipped: "CONTENT_GENERATION_ENABLED != true", published });
    }
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
    if (articleResult?.article?.slug) {
      await notifyIndexNow(articleResult.article.slug);
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

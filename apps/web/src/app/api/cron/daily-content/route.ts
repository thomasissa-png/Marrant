import { NextResponse } from "next/server";
import { INDEXNOW_HOST, submitToIndexNow } from "@/lib/indexnow";
import { publishDailyContent } from "@/lib/ai/daily-publisher";
import { generateMonthlyPlans } from "@/lib/ai/content-planner";

export const dynamic = "force-dynamic";
// Incident s14 : aucun fetch sortant (LLM, Buffer…) mis en cache par Next.
export const fetchCache = "force-no-store";

const HOST = INDEXNOW_HOST;

/** Pages produit à notifier après publication de contenu frais. */
const PRODUCT_PAGES = [
  `https://${HOST}/vannes`,
  `https://${HOST}/conseils`,
  `https://${HOST}/videos`,
  `https://${HOST}/`,
];

/**
 * Notifie Bing (+ Yandex, Naver, Seznam) via IndexNow que les pages ont du contenu frais.
 * Non bloquant : ne fait jamais échouer le cron (lib/indexnow, timeout 5 s).
 */
async function notifyIndexNow(urls: string[]): Promise<{ submitted: number; status: number } | null> {
  const result = await submitToIndexNow(urls);
  return result.ok ? { submitted: result.submitted, status: result.status } : null;
}

/**
 * Cron job quotidien — déclenché à 5h et 6h UTC pour garantir 7h heure française.
 * (5h UTC = 7h CEST en été, 6h UTC = 7h CET en hiver)
 * Le contenu est idempotent : s'il existe déjà pour aujourd'hui, il ne sera pas recréé.
 * 1. Vérifie/crée le plan du mois si nécessaire
 * 2. Génère et publie le contenu du jour (blague + conseil + vidéo)
 * 3. Notifie Bing via IndexNow que les pages produit ont du contenu frais
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const querySecret = searchParams.get("secret");

  // Refuser l'accès si CRON_SECRET n'est pas configuré ou si le token est invalide
  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Contenu préparé à l'avance (s14) : aucun LLM, trou du calendrier comblé depuis le stock.
  {
    const { isContentGenerationEnabled, ensureDailyContentFromStock } = await import("@/lib/scheduler/prepared-content");
    if (!isContentGenerationEnabled()) {
      const { todayUTC } = await import("@/lib/ai/date-utils");
      const stock = await ensureDailyContentFromStock(todayUTC());
      return NextResponse.json({ skipped: "CONTENT_GENERATION_ENABLED != true", stock });
    }
  }

  const force = searchParams.get("force") === "true";

  try {
    const now = new Date();
    const month = now.getUTCMonth() + 1;
    const year = now.getUTCFullYear();

    // S'assurer que le plan du mois existe
    const planResults = await generateMonthlyPlans(month, year);

    // Publier le contenu du jour (force = supprime l'existant et régénère)
    const publishResult = await publishDailyContent(undefined, { force });

    // Notifier Bing via IndexNow (fire-and-forget, ne bloque pas le cron)
    const indexNowResult = await notifyIndexNow(PRODUCT_PAGES);

    return NextResponse.json({
      success: true,
      plans: planResults,
      daily: publishResult,
      indexNow: indexNowResult,
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

import { NextResponse } from "next/server";
import { publishDailyContent } from "@/lib/ai/daily-publisher";
import { generateMonthlyPlans } from "@/lib/ai/content-planner";

export const dynamic = "force-dynamic";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "35cc97ed505a4ae89d8470d259fc5662";
const HOST = "deviens-marrant.fr";

/** Pages produit à notifier après publication de contenu frais. */
const PRODUCT_PAGES = [
  `https://${HOST}/vannes`,
  `https://${HOST}/conseils`,
  `https://${HOST}/videos`,
  `https://${HOST}/`,
];

/**
 * Notifie Bing (+ Yandex, Naver, Seznam) via IndexNow que les pages ont du contenu frais.
 * Fire-and-forget : ne bloque jamais le cron en cas d'erreur.
 */
async function notifyIndexNow(urls: string[]): Promise<{ submitted: number; status: number } | null> {
  try {
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
    console.log(`[IndexNow] ${urls.length} URLs soumises — status ${response.status}`);
    return { submitted: urls.length, status: response.status };
  } catch (err) {
    console.warn("[IndexNow] Erreur (non bloquante):", err);
    return null;
  }
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

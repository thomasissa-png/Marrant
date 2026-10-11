import { NextResponse } from "next/server";
import { runQualityWatch } from "@/lib/ai/quality-watch";

export const dynamic = "force-dynamic";

/**
 * Contrôle qualité du matin (lot Q4, s14) : relit la vanne et le conseil du
 * jour, remplace ce qui est sous la barre, envoie un récap admin si besoin.
 * Au plus 1 appel LLM par jour. À déclencher après daily-content (voir
 * src/lib/ai/quality-watch.ts). `?force=true` ignore le verrou quotidien.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const result = await runQualityWatch({ force: searchParams.get("force") === "true" });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Erreur cron quality-watch:", error);
    return NextResponse.json(
      {
        error: "Erreur lors du contrôle qualité",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

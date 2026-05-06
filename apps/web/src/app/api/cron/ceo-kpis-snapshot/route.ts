import { NextResponse } from "next/server";
import { snapshotCeoKpis } from "@/lib/ai/ceo-helpers";

export const dynamic = "force-dynamic";

/**
 * Cron CEO KPIs snapshot — daily 5h UTC.
 * Calcule North Star (engagement 30j glissants) + 3 satellites + 6 KPIs ops
 * et insère 1 row dans CeoKpiSnapshot (date unique).
 *
 * Idempotent par contrainte UNIQUE sur `date` (DATE) → si rejoué le même jour,
 * upsert update plutôt qu'insert duplicate.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Time gate : 5h UTC (tolérance 5-6h pour cron horaire qui n'exécute qu'une fois)
  const force = searchParams.get("force") === "true";
  const utcHour = new Date().getUTCHours();
  if (!force && utcHour !== 5) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: `out-of-window (utc=${utcHour}h, expected=5h UTC)`,
    });
  }

  try {
    const snapshot = await snapshotCeoKpis();
    return NextResponse.json({
      success: true,
      snapshotId: snapshot.id,
      date: snapshot.date.toISOString().slice(0, 10),
      northStar: snapshot.northStarEngagement30d,
      conversions: snapshot.ceoAttributedConversions,
    });
  } catch (error) {
    console.error("[cron/ceo-kpis-snapshot] Erreur :", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * Déclenchement manuel du rapport hebdomadaire des visites.
 *
 * - Auth : `Authorization: Bearer {ADMIN_PASSWORD}` (comme les autres /api/admin/*).
 * - `POST /api/admin/visits-report?dryRun=1` : renvoie le JSON du rapport
 *   (objet de l'email et section `blog` compris) sans rien envoyer.
 * - `POST /api/admin/visits-report` : calcule et envoie l'email à l'admin.
 *   Ne prend pas le verrou hebdomadaire du scheduler (envoi explicite).
 * Toujours dynamique (données du moment, aucune mise en cache).
 */
import { NextRequest, NextResponse } from "next/server";
import { UmamiError } from "@/lib/analytics/umami";
import { runWeeklyVisitsReport } from "@/lib/analytics/weekly-visits-job";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const dryRunParam = request.nextUrl.searchParams.get("dryRun");
  const dryRun = dryRunParam === "1" || dryRunParam === "true";

  try {
    const result = await runWeeklyVisitsReport({ dryRun });
    if (result.status === "skipped") {
      return NextResponse.json(
        { success: false, error: "Secrets Umami absents (UMAMI_API_KEY, UMAMI_WEBSITE_ID)" },
        { status: 503 },
      );
    }
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err instanceof UmamiError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 502 });
    }
    console.error(`[admin:visits-report] Échec : ${err instanceof Error ? err.message : "erreur inconnue"}`);
    return NextResponse.json({ success: false, error: "Échec de génération ou d'envoi du rapport" }, { status: 500 });
  }
}

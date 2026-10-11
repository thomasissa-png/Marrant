import { NextResponse } from "next/server";
import { runStartupTasks } from "@/lib/startup-tasks";

export const dynamic = "force-dynamic";
// Incident s14 : aucun fetch sortant (LLM, Buffer…) mis en cache par Next.
export const fetchCache = "force-no-store";

/**
 * GET /api/cron/startup-tasks — tâches de démarrage idempotentes.
 *
 * Sur Replit, `runStartupTasks()` est lancée au boot par instrumentation.ts.
 * Sous Cloudflare Workers il n'y a pas de boot : cette route l'expose telle
 * quelle (logique inchangée : marqueurs DataPatch, dont
 * `applyCatalogueContentTask`). Rejouable sans risque (chaque tâche est
 * idempotente et fail-safe).
 *
 * Déclencheurs : Cron Trigger « 0 1 * * * » (wrangler.jsonc) + appel manuel
 * juste après chaque déploiement (voir docs/infra/cloudflare-runbook.md).
 *
 * Auth : identique aux autres crons (Bearer CRON_SECRET ou ?secret=).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const startedAt = Date.now();
  try {
    await runStartupTasks();
    const durationMs = Date.now() - startedAt;
    console.log(`[startup-tasks] Terminées en ${durationMs} ms.`);
    return NextResponse.json({ success: true, durationMs });
  } catch (error) {
    console.error("[startup-tasks] Échec :", error);
    return NextResponse.json(
      {
        error: "Échec des tâches de démarrage",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

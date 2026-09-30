import { NextResponse } from "next/server";
import { isCloudflareWorkers } from "@/lib/runtime-env";
import { createSchedulerJobs, loopbackCronRouteCaller } from "@/lib/scheduler/jobs";
import { createInProcessCronRouteCaller } from "@/lib/scheduler/in-process-cron-caller";

export const dynamic = "force-dynamic";
// Incident s14 : aucun fetch sortant (LLM, Buffer…) mis en cache par Next.
export const fetchCache = "force-no-store";

/**
 * GET /api/cron/scheduler-tick — un « tick » du planificateur interne.
 *
 * Exécute UNE fois les 11 jobs de `src/lib/scheduler/jobs.ts` (mêmes fenêtres
 * horaires, guards DB, verrous et ordre que le setInterval Replit). Chaque job
 * décide lui-même s'il a quelque chose à faire à l'heure UTC courante.
 *
 * Déclencheur Cloudflare : Cron Trigger « *\/15 * * * * » (wrangler.jsonc →
 * cloudflare/worker.ts). Sur Replit, cette route n'est PAS planifiée
 * (instrumentation.ts garde son setInterval) ; un appel manuel reste possible.
 *
 * Auth : identique aux autres crons (Bearer CRON_SECRET ou ?secret=).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const caller = isCloudflareWorkers()
    ? createInProcessCronRouteCaller(origin)
    : loopbackCronRouteCaller;
  const { runAllJobs } = createSchedulerJobs(caller);

  const startedAt = Date.now();
  // Chaque job capture ses propres erreurs (comme sur Replit) : runAllJobs ne rejette pas.
  await runAllJobs();
  const durationMs = Date.now() - startedAt;

  console.log(`[scheduler-tick] Tick terminé en ${durationMs} ms.`);
  return NextResponse.json({ success: true, durationMs });
}

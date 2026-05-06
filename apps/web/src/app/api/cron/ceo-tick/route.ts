import { NextResponse } from "next/server";
import { runDailyTick } from "@/lib/ai/agents/ceo-agent";
import { tryAcquireLock, releaseLock } from "@/lib/job-lock";

export const dynamic = "force-dynamic";

/**
 * Cron CEO tick — appelé toutes les heures par Replit, mais ne s'exécute QUE
 * dans la fenêtre 2-4h UTC pour étaler les actions sur la nuit (anti-runaway,
 * fenêtre de tolérance opérationnelle pour Thomas qui dort).
 *
 * Pattern :
 *  1. Auth Bearer CRON_SECRET (cf docs/marrant/playbook.md)
 *  2. Time gate : 2-4h59 UTC uniquement (sauf ?force=true en query)
 *  3. Lock applicatif "ceo-tick" TTL 30 min
 *  4. runDailyTick() : kill-switch → budget → pull tasks → execute
 *
 * Idempotent : si lock détenu (autre worker), retourne {skipped:true}.
 */
const CEO_TICK_LOCK_KEY = "cron:ceo-tick";
const CEO_TICK_LOCK_TTL_MS = 30 * 60 * 1000; // 30 min

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const querySecret = searchParams.get("secret");

  if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Time gate : 2-4h59 UTC sauf force=true
  const force = searchParams.get("force") === "true";
  const utcHour = new Date().getUTCHours();
  const inWindow = utcHour >= 2 && utcHour <= 4;
  if (!force && !inWindow) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: `out-of-window (utc=${utcHour}h, window=2-4h UTC)`,
      tasksExecuted: 0,
      errors: [],
    });
  }

  // Lock applicatif
  const lockAcquired = await tryAcquireLock(CEO_TICK_LOCK_KEY, CEO_TICK_LOCK_TTL_MS);
  if (!lockAcquired) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "lock-held",
      tasksExecuted: 0,
      errors: [],
    });
  }

  try {
    const result = await runDailyTick();
    return NextResponse.json({
      success: true,
      tasksExecuted: result.processed ?? 0,
      status: result.status,
      errors: result.errors ?? 0,
    });
  } catch (error) {
    console.error("[cron/ceo-tick] Erreur :", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  } finally {
    await releaseLock(CEO_TICK_LOCK_KEY).catch(() => undefined);
  }
}

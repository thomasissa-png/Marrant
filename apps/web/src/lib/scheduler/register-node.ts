/**
 * Démarrage du planificateur interne — runtime Node.js uniquement (Replit).
 *
 * Corps DÉPLACÉ tel quel depuis `register()` de `src/instrumentation.ts`
 * (migration Cloudflare, étape B) : `register()` n'importe plus ce module que
 * dans une branche `process.env.NEXT_RUNTIME === "nodejs"`, que webpack élimine
 * du bundle edge (sinon `edge-instrumentation.js` embarque des `require` Node
 * — crypto, pg… — et le build OpenNext échoue).
 *
 * Comportement Replit inchangé : tâches de démarrage à T+30 s puis 11 jobs
 * toutes les 15 min. Sous Cloudflare Workers : sortie immédiate (Cron Triggers).
 */
export async function registerNodeScheduler(): Promise<void> {
  // Cloudflare Workers (OpenNext) : ni processus permanent ni boot → pas de
  // setTimeout/setInterval. Les mêmes jobs sont déclenchés par Cron Triggers
  // (wrangler.jsonc → cloudflare/worker.ts → /api/cron/scheduler-tick et
  // /api/cron/startup-tasks). Sur Replit, cette garde est sans effet.
  const { isCloudflareWorkers } = await import("@/lib/runtime-env");
  if (isCloudflareWorkers()) {
    console.log("[scheduler] Cloudflare Workers détecté — planificateur interne désactivé (Cron Triggers).");
    return;
  }

  const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

  // Jobs du planificateur : source unique partagée avec Cloudflare Workers
  // (src/lib/scheduler/jobs.ts). Sur Replit, les routes cron sont appelées en
  // boucle locale (localhost / 127.0.0.1:${PORT}) exactement comme avant.
  const { createSchedulerJobs, loopbackCronRouteCaller } = await import("@/lib/scheduler/jobs");
  const { runAllJobs } = createSchedulerJobs(loopbackCronRouteCaller);

  // Tâches de démarrage idempotentes (auto-seed CeoConfig + cleanup WILD_CARD).
  // Exécutées une seule fois au boot — rattrapent ce que le build Replit
  // (prisma db push, sans migrate deploy ni seed en prod) ne peut pas faire.
  const runStartupOnce = async () => {
    try {
      const { runStartupTasks } = await import("@/lib/startup-tasks");
      await runStartupTasks();
    } catch (err) {
      console.error("[startup] runStartupTasks échoué (non bloquant) :", err);
    }
  };

  // Premier check 30 secondes après le démarrage
  setTimeout(() => {
    runStartupOnce().finally(() => {
      runAllJobs();
      // Puis toutes les 15 minutes
      setInterval(runAllJobs, INTERVAL_MS);
    });
  }, 30_000);

  console.log("[scheduler] Initialisé — 11 jobs (daily + SEO blog + monthly plans + social media + SEO audit + SEO report + CEO tick + CEO KPIs + copy review) — check toutes les 15 min.");
}

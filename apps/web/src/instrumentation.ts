/**
 * Next.js Instrumentation — s'exécute une seule fois au démarrage du serveur.
 * Lance un scheduler interne qui vérifie toutes les 15 minutes
 * si le contenu du jour existe, et le génère sinon.
 *
 * Pourquoi : sur Replit il n'y a pas de cron externe.
 * Le scheduler + le lazy-init dans /api/daily garantissent
 * que le contenu est toujours généré automatiquement.
 */
export async function register() {
  // Ne s'exécute que côté serveur (pas dans le edge runtime ni le build)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

    const runDailyCheck = async () => {
      try {
        const { prisma } = await import("@/lib/prisma");
        const { todayUTC } = await import("@/lib/ai/date-utils");
        const { publishDailyContent } = await import(
          "@/lib/ai/daily-publisher"
        );
        const { generateMonthlyPlans } = await import(
          "@/lib/ai/content-planner"
        );

        const today = todayUTC();

        // Vérifier si le contenu du jour existe déjà
        const existing = await prisma.dailyContent.findUnique({
          where: { date: today },
        });

        if (existing) return;

        console.log("[scheduler] Contenu du jour absent — lancement de la génération…");

        const month = today.getUTCMonth() + 1;
        const year = today.getUTCFullYear();

        await generateMonthlyPlans(month, year);
        await publishDailyContent(today);

        console.log("[scheduler] Contenu du jour généré avec succès.");
      } catch (err) {
        console.error("[scheduler] Échec de la génération automatique :", err);
      }
    };

    // Premier check 30 secondes après le démarrage (laisser le serveur s'initialiser)
    setTimeout(() => {
      runDailyCheck();
      // Puis toutes les 15 minutes
      setInterval(runDailyCheck, INTERVAL_MS);
    }, 30_000);

    console.log("[scheduler] Scheduler de contenu quotidien initialisé (check toutes les 15 min).");
  }
}

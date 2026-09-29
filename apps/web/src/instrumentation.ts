/**
 * Next.js Instrumentation — s'exécute une seule fois au démarrage du serveur.
 *
 * Scheduler interne qui remplace les crons Vercel sur Replit.
 * Vérifie toutes les 15 minutes si les contenus planifiés existent
 * et les génère automatiquement sinon.
 *
 * 11 jobs gérés — tous délèguent aux crons HTTP pour éviter les doublons :
 * 1. Contenu quotidien (blague + conseil + vidéo) — tous les jours
 * 2. Article blog SEO — une fois par semaine (lundi)
 * 3. Plans mensuels — le 28 du mois (pré-génère le mois suivant)
 * 4. Posts sociaux quotidiens — délègue à /api/cron/daily-social
 * 5. Publication posts sociaux — délègue à /api/cron/publish-social
 * 6. Analytics social — délègue à /api/cron/social-analytics
 * 7. Audit SEO — mercredi, délègue à /api/cron/seo-audit
 * 8. Rapport SEO — mensuel, délègue à /api/cron/seo-report
 * 9. CEO tick — 2h-4h UTC, délègue à /api/cron/ceo-tick (court-circuit si CEO off)
 * 10. CEO KPIs snapshot — 5h UTC (court-circuit si CEO off)
 *
 * Note : le décryptage des vannes existantes N'EST PLUS un job scheduler IA.
 * Les 265 décryptages pré-rédigés sont appliqués INSTANTANÉMENT au boot
 * (sans IA) via `applyJokeDecryptagesTask` dans `runStartupTasks`. Les
 * NOUVELLES vannes quotidiennes reçoivent leur décryptage via l'IA à la
 * génération (generateDailyJoke).
 */
export async function register() {
  // Branche éliminée à la compilation edge (NEXT_RUNTIME remplacé par une
  // constante) → aucune dépendance Node dans edge-instrumentation.js.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerNodeScheduler } = await import("@/lib/scheduler/register-node");
    await registerNodeScheduler();
  }
}

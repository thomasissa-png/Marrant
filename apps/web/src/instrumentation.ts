/**
 * Next.js Instrumentation — s'exécute une seule fois au démarrage du serveur.
 *
 * Scheduler interne qui remplace les crons Vercel sur Replit.
 * Vérifie toutes les 15 minutes si les contenus planifiés existent
 * et les génère automatiquement sinon.
 *
 * 3 jobs gérés :
 * 1. Contenu quotidien (blague + conseil + vidéo) — tous les jours
 * 2. Article blog SEO — une fois par semaine (lundi)
 * 3. Plans mensuels — le 28 du mois (pré-génère le mois suivant)
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

  /**
   * Job 1 : Contenu quotidien
   * Vérifie si le contenu du jour existe, sinon génère le plan + contenu.
   */
  const runDailyContentJob = async () => {
    try {
      const { prisma } = await import("@/lib/prisma");
      const { todayUTC } = await import("@/lib/ai/date-utils");
      const { publishDailyContent } = await import("@/lib/ai/daily-publisher");
      const { generateMonthlyPlans } = await import("@/lib/ai/content-planner");

      const today = todayUTC();

      const existing = await prisma.dailyContent.findUnique({
        where: { date: today },
      });

      if (existing) return;

      console.log("[scheduler:daily] Contenu du jour absent — génération…");

      const month = today.getUTCMonth() + 1;
      const year = today.getUTCFullYear();

      await generateMonthlyPlans(month, year);
      await publishDailyContent(today);

      console.log("[scheduler:daily] Contenu du jour généré avec succès.");
    } catch (err) {
      console.error("[scheduler:daily] Échec :", err);
    }
  };

  /**
   * Job 2 : Article blog SEO hebdomadaire
   * Vérifie si un article a déjà été publié cette semaine, sinon en génère un.
   */
  const runWeeklySeoJob = async () => {
    try {
      const { prisma } = await import("@/lib/prisma");
      const { publishWeeklyArticle, updateSeoCalendar } = await import(
        "@/lib/ai/agents/seo-blog-agent"
      );

      const now = new Date();

      // Déterminer le lundi de cette semaine (début de semaine ISO)
      const dayOfWeek = now.getUTCDay(); // 0=dimanche, 1=lundi, ...
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setUTCDate(now.getUTCDate() + diffToMonday);
      monday.setUTCHours(0, 0, 0, 0);

      // Vérifier si un article a été publié depuis lundi
      const articleThisWeek = await prisma.blogArticle.findFirst({
        where: {
          generatedByAI: true,
          publishedAt: { gte: monday },
        },
      });

      if (articleThisWeek) return;

      console.log("[scheduler:seo] Pas d'article blog cette semaine — génération…");

      await updateSeoCalendar();
      await publishWeeklyArticle();

      console.log("[scheduler:seo] Article blog SEO publié avec succès.");
    } catch (err) {
      console.error("[scheduler:seo] Échec :", err);
    }
  };

  /**
   * Job 3 : Plans mensuels
   * Le 28 du mois (ou après), pré-génère les plans du mois suivant.
   */
  const runMonthlyPlanJob = async () => {
    try {
      const { prisma } = await import("@/lib/prisma");
      const { generateMonthlyPlans } = await import("@/lib/ai/content-planner");

      const now = new Date();
      const dayOfMonth = now.getUTCDate();

      // Ne lancer que du 28 au 31
      if (dayOfMonth < 28) return;

      const currentMonth = now.getUTCMonth() + 1;
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear =
        currentMonth === 12 ? now.getUTCFullYear() + 1 : now.getUTCFullYear();

      // Vérifier si les plans du mois prochain existent déjà
      const existingPlan = await prisma.contentPlan.findFirst({
        where: { month: nextMonth, year: nextYear },
      });

      if (existingPlan) return;

      console.log(`[scheduler:monthly] Plans du mois ${nextMonth}/${nextYear} absents — génération…`);

      await generateMonthlyPlans(nextMonth, nextYear);

      console.log(`[scheduler:monthly] Plans du mois ${nextMonth}/${nextYear} générés avec succès.`);
    } catch (err) {
      console.error("[scheduler:monthly] Échec :", err);
    }
  };

  /**
   * Orchestrateur : exécute les 3 jobs séquentiellement.
   * Séquentiel pour éviter de surcharger l'API IA avec des appels simultanés.
   */
  const runAllJobs = async () => {
    await runDailyContentJob();
    await runWeeklySeoJob();
    await runMonthlyPlanJob();
  };

  // Premier check 30 secondes après le démarrage
  setTimeout(() => {
    runAllJobs();
    // Puis toutes les 15 minutes
    setInterval(runAllJobs, INTERVAL_MS);
  }, 30_000);

  console.log("[scheduler] Initialisé — daily + SEO blog + monthly plans (check toutes les 15 min).");
}

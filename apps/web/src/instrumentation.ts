/**
 * Next.js Instrumentation — s'exécute une seule fois au démarrage du serveur.
 *
 * Scheduler interne qui remplace les crons Vercel sur Replit.
 * Vérifie toutes les 15 minutes si les contenus planifiés existent
 * et les génère automatiquement sinon.
 *
 * 8 jobs gérés — tous délèguent aux crons HTTP pour éviter les doublons :
 * 1. Contenu quotidien (blague + conseil + vidéo) — tous les jours
 * 2. Article blog SEO — une fois par semaine (lundi)
 * 3. Plans mensuels — le 28 du mois (pré-génère le mois suivant)
 * 4. Posts sociaux quotidiens — délègue à /api/cron/daily-social
 * 5. Publication posts sociaux — délègue à /api/cron/publish-social
 * 6. Analytics social — délègue à /api/cron/social-analytics
 * 7. Audit SEO — mercredi, délègue à /api/cron/seo-audit
 * 8. Rapport SEO — mensuel, délègue à /api/cron/seo-report
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
   * Job 4 : Génération quotidienne des posts sociaux — TIME-GATED
   *
   * Déclenche UNIQUEMENT dans la fenêtre 4h-5h UTC (1x/jour).
   * + Catch-up d'urgence entre 6h-23h si aucun post Twitter n'existe
   *   pour la journée (fallback si le run de 4h UTC a échoué).
   *
   * L'idempotence est garantie par :
   *   - Time gate : exclut 95% des runs (15 min = 96 runs/jour → 4-5 éligibles)
   *   - HARD LOCK dans le cron HTTP (limites par plateforme + jour)
   *   - Filtre quantitatif (ne génère que ce qui manque)
   */
  const runDailySocialJob = async () => {
    try {
      const now = new Date();
      const utcHour = now.getUTCHours();

      // Fenêtre principale : 4h-5h UTC (slot officiel)
      const isMainWindow = utcHour === 4;

      // Fenêtre de catch-up : 6h-23h UTC
      // Ne déclenche que si AUCUN post Twitter aujourd'hui (panne totale du run de 4h)
      const isCatchupWindow = utcHour >= 6 && utcHour <= 23;

      if (!isMainWindow && !isCatchupWindow) return;

      // Pour le catch-up, on vérifie si les quotas sont atteints aujourd'hui.
      // Déclenche si DÉFICIT (pas seulement count=0) pour rattraper les échecs partiels.
      if (isCatchupWindow) {
        const { prisma } = await import("@/lib/prisma");
        const startOfDay = new Date(now);
        startOfDay.setUTCHours(0, 0, 0, 0);

        // Quotas minimaux attendus pour aujourd'hui (approximation conservatrice)
        // On veut rattraper si MOINS de 2 Twitter OU 0 Instagram
        const dayOfWeek = now.getUTCDay();
        const minExpectedTwitter = (dayOfWeek === 0) ? 2 : 2; // au moins 2 tweets tous les jours
        const minExpectedInstagram = 1;

        const countsByPlatform = await prisma.socialPost.groupBy({
          by: ["platform"],
          where: { createdAt: { gte: startOfDay } },
          _count: true,
        });
        const countMap = new Map(countsByPlatform.map((g) => [g.platform, g._count]));
        const twitterCount = countMap.get("TWITTER") || 0;
        const instagramCount = countMap.get("INSTAGRAM") || 0;

        // Pas de déficit → skip le catch-up
        if (twitterCount >= minExpectedTwitter && instagramCount >= minExpectedInstagram) {
          return;
        }
        console.warn(
          `[scheduler:social] Catch-up activé ${utcHour}h UTC — déficit : Twitter ${twitterCount}/${minExpectedTwitter}, Instagram ${instagramCount}/${minExpectedInstagram}`,
        );
      }

      const PORT = process.env.PORT || "3000";
      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await fetch(`http://localhost:${PORT}/api/cron/daily-social?secret=${secret}`);
      if (res.ok) {
        console.log(`[scheduler:social] Daily-social trigger (${isMainWindow ? "main 4h UTC" : "catch-up " + utcHour + "h"}).`);
      }
    } catch (err) {
      console.error("[scheduler:social] Échec génération :", err);
    }
  };

  /**
   * Job 5 : Publication des posts sociaux approuvés via Buffer
   * Délègue au cron HTTP /api/cron/publish-social pour éviter les doublons.
   */
  const runPublishSocialJob = async () => {
    try {
      const PORT = process.env.PORT || "3000";
      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await fetch(`http://localhost:${PORT}/api/cron/publish-social?secret=${secret}`);
      if (res.ok) {
        console.log("[scheduler:publish] Posts publiés via cron HTTP.");
      }
    } catch (err) {
      console.error("[scheduler:publish] Échec publication :", err);
    }
  };

  /**
   * Job 6 : Suivi et nettoyage des posts sociaux
   * Appelle le cron endpoint /api/cron/social-analytics qui gère :
   * - Nettoyage des posts stuck (APPROVED > 48h → FAILED)
   * - Stats par plateforme/format/persona
   * - Vérification queue Buffer
   * Analytics détaillées disponibles dans le dashboard Buffer.
   */
  const runSocialAnalyticsJob = async () => {
    try {
      const PORT = process.env.PORT || "3000";
      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await fetch(`http://localhost:${PORT}/api/cron/social-analytics`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.ok) {
        console.log("[scheduler:analytics] Suivi social exécuté.");
      }
    } catch (err) {
      console.error("[scheduler:analytics] Échec :", err);
    }
  };

  /**
   * Job 7 : Audit SEO hebdomadaire (mercredi)
   * Vérifie le maillage interne et réconcilie le plan éditorial avec la DB.
   */
  const runSeoAuditJob = async () => {
    try {
      const now = new Date();
      // Ne lancer que le mercredi (3)
      if (now.getUTCDay() !== 3) return;

      const PORT = process.env.PORT || "3000";
      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await fetch(`http://localhost:${PORT}/api/cron/seo-audit`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.ok) {
        console.log("[scheduler:seo-audit] Audit SEO hebdomadaire exécuté.");
      }
    } catch (err) {
      console.error("[scheduler:seo-audit] Échec :", err);
    }
  };

  /**
   * Job 8 : Rapport SEO mensuel (1er du mois)
   * Génère un rapport complet de l'état SEO du site.
   */
  const runSeoReportJob = async () => {
    try {
      const now = new Date();
      // Ne lancer que le 1er du mois
      if (now.getUTCDate() !== 1) return;

      const PORT = process.env.PORT || "3000";
      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await fetch(`http://localhost:${PORT}/api/cron/seo-report`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.ok) {
        console.log("[scheduler:seo-report] Rapport SEO mensuel généré.");
      }
    } catch (err) {
      console.error("[scheduler:seo-report] Échec :", err);
    }
  };

  /**
   * Orchestrateur : exécute les 8 jobs séquentiellement.
   * Séquentiel pour éviter de surcharger l'API IA avec des appels simultanés.
   */
  const runAllJobs = async () => {
    await runDailyContentJob();
    await runWeeklySeoJob();
    await runMonthlyPlanJob();
    await runDailySocialJob();
    await runPublishSocialJob();
    await runSocialAnalyticsJob();
    await runSeoAuditJob();
    await runSeoReportJob();
  };

  // Premier check 30 secondes après le démarrage
  setTimeout(() => {
    runAllJobs();
    // Puis toutes les 15 minutes
    setInterval(runAllJobs, INTERVAL_MS);
  }, 30_000);

  console.log("[scheduler] Initialisé — 8 jobs (daily + SEO blog + monthly plans + social media + SEO audit + SEO report) — check toutes les 15 min.");
}

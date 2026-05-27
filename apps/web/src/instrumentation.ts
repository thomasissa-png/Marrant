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
 * 11. Back-fill décryptage vannes — 6h UTC, 50/jour (court-circuit si 0 reliquat)
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

  /**
   * Job 1 : Contenu quotidien — TIME-GATED
   *
   * Fenêtre principale : 5h-6h UTC (slot officiel du cron daily-content).
   * Catch-up conditionnel : 7h-22h UTC uniquement si aucun contenu n'existe pour le jour.
   * Bloqué totalement en dehors (0h-4h UTC et 23h UTC) pour éviter les runs parasites.
   *
   * Avant ce fix : `setInterval` tous les 15 min sans time gate = jusqu'à 20 runs
   * parasites entre 0h et 5h UTC (cause principale du surcoût LLM observé).
   *
   * Sécurité anti-concurrent via `JobLock` (upsert atomique, TTL 10 min).
   */
  const runDailyContentJob = async () => {
    try {
      const now = new Date();
      const utcHour = now.getUTCHours();

      // Fenêtre principale : 5h-6h UTC (slot officiel cron)
      const isMainWindow = utcHour === 5;
      // Fenêtre catch-up : 7h-22h UTC (fallback si le slot principal a échoué)
      const isCatchupWindow = utcHour >= 7 && utcHour <= 22;

      if (!isMainWindow && !isCatchupWindow) return;

      const { prisma } = await import("@/lib/prisma");
      const { todayUTC } = await import("@/lib/ai/date-utils");
      const { publishDailyContent } = await import("@/lib/ai/daily-publisher");
      const { generateMonthlyPlans } = await import("@/lib/ai/content-planner");
      const { tryAcquireLock, releaseLock, buildJobLockKey } = await import("@/lib/job-lock");

      const today = todayUTC();

      // Guard DB : si le contenu du jour existe déjà, on ne refait rien
      // (c'est la ligne de défense principale, AVANT tout appel LLM).
      const existing = await prisma.dailyContent.findUnique({
        where: { date: today },
      });
      if (existing) return;

      // En catch-up : on ne lance QUE si le contenu manque réellement
      // (déjà checké ci-dessus), et uniquement si aucune autre instance
      // n'a pris le lock.
      const lockKey = buildJobLockKey("daily-content", today);
      const lockAcquired = await tryAcquireLock(lockKey, 10 * 60 * 1000);
      if (!lockAcquired) {
        // Une autre instance (cron HTTP ou autre worker) est en cours — on skip
        return;
      }

      try {
        console.log(
          `[scheduler:daily] Contenu du jour absent — génération (${isMainWindow ? "main 5h UTC" : `catch-up ${utcHour}h`})…`,
        );

        const month = today.getUTCMonth() + 1;
        const year = today.getUTCFullYear();

        await generateMonthlyPlans(month, year);
        await publishDailyContent(today);

        console.log("[scheduler:daily] Contenu du jour généré avec succès.");
      } finally {
        await releaseLock(lockKey);
      }
    } catch (err) {
      console.error("[scheduler:daily] Échec :", err);
    }
  };

  /**
   * Job 2 : Article blog SEO hebdomadaire — TIME-GATED
   *
   * Fenêtre principale : lundi 9h-11h UTC (slot officiel du cron weekly-seo).
   * Catch-up conditionnel : mardi + mercredi (toute la journée UTC) si l'article
   * de la semaine n'a pas encore été publié.
   * Bloqué totalement du jeudi au dimanche et en dehors du lundi 9-11h.
   *
   * Avant ce fix : un lundi matin entre 0h et 9h UTC, le scheduler lançait
   * `publishWeeklyArticle` jusqu'à 36 fois avant que le cron HTTP ne réussisse
   * à écrire l'article en DB. Worst case observé : ~$14 gaspillés sur un seul lundi.
   *
   * Sécurité anti-concurrent via `JobLock` (TTL 20 min — la génération d'un
   * article de 2500 mots + validation Director peut prendre 3-5 minutes).
   */
  const runWeeklySeoJob = async () => {
    try {
      const now = new Date();
      const dayOfWeek = now.getUTCDay(); // 0=dimanche, 1=lundi, ..., 6=samedi
      const utcHour = now.getUTCHours();

      // Fenêtre principale : lundi 9h-11h UTC
      const isMainWindow = dayOfWeek === 1 && utcHour >= 9 && utcHour < 11;
      // Fenêtre catch-up : mardi (2) ou mercredi (3), toute la journée
      const isCatchupWindow = dayOfWeek === 2 || dayOfWeek === 3;

      if (!isMainWindow && !isCatchupWindow) return;

      const { prisma } = await import("@/lib/prisma");
      const { publishWeeklyArticle, updateSeoCalendar } = await import(
        "@/lib/ai/agents/seo-blog-agent"
      );
      const { tryAcquireLock, releaseLock, buildWeeklyJobLockKey } = await import("@/lib/job-lock");

      // Déterminer le lundi de cette semaine (début de semaine ISO)
      // À ce stade, dayOfWeek est forcément 1, 2 ou 3 (main + catch-up)
      // → formule simple `1 - dayOfWeek` (0, -1, -2)
      const diffToMonday = 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setUTCDate(now.getUTCDate() + diffToMonday);
      monday.setUTCHours(0, 0, 0, 0);

      // Guard DB : si un article a déjà été publié cette semaine, skip.
      const articleThisWeek = await prisma.blogArticle.findFirst({
        where: {
          generatedByAI: true,
          publishedAt: { gte: monday },
        },
      });
      if (articleThisWeek) return;

      // Lock anti-concurrent : TTL 20 min (génération article = 3-5 min
      // + validation directeur + retry éventuel).
      const lockKey = buildWeeklyJobLockKey("weekly-seo", now);
      const lockAcquired = await tryAcquireLock(lockKey, 20 * 60 * 1000);
      if (!lockAcquired) return;

      try {
        console.log(
          `[scheduler:seo] Pas d'article blog cette semaine — génération (${isMainWindow ? "main lundi" : `catch-up jour ${dayOfWeek}`})…`,
        );

        await updateSeoCalendar();
        await publishWeeklyArticle();

        console.log("[scheduler:seo] Article blog SEO publié avec succès.");
      } finally {
        await releaseLock(lockKey);
      }
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

      // P1 race condition lock applicatif (s08/04) — un seul run/jour franchit
      // la barrière, même si le scheduler retente pendant la catch-up window.
      // Cf docs/marrant/playbook.md + apps/web/src/lib/social-post-daily-lock.ts
      const { tryAcquireSocialDailyLock } = await import("@/lib/social-post-daily-lock");
      const lockAcquired = await tryAcquireSocialDailyLock(now);
      if (!lockAcquired) {
        console.log(`[scheduler:social] Lock journalier déjà détenu pour ${now.toISOString().slice(0, 10)} — skip`);
        return;
      }

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
   * Job 9 : CEO tick quotidien — TIME-GATED + LOCK + KILL-SWITCH
   *
   * Fallback du cron HTTP /api/cron/ceo-tick quand Replit ne déclenche pas.
   * Fenêtre 2h-4h UTC (identique au time gate interne de la route ceo-tick).
   *
   * Triple sécurité (NE JAMAIS retirer — bug P0 coûts x8 si scheduler sans gate) :
   *  1. Court-circuit kill-switch AVANT toute acquisition de lock → 0 coût quand
   *     le CEO est désactivé (défaut après deploy via ensureCeoConfig).
   *  2. Lock scheduler dédié (tryAcquireLock) → un seul déclenchement/jour.
   *  3. La route ceo-tick a SON propre lock interne (CEO_TICK_LOCK_KEY) +
   *     runDailyTick re-check le kill-switch → idempotence garantie même si le
   *     cron HTTP Replit tourne en parallèle.
   */
  const runCeoTickJob = async () => {
    try {
      const now = new Date();
      const utcHour = now.getUTCHours();

      // Time gate : 2h-4h UTC (cohérent avec la route /api/cron/ceo-tick)
      if (utcHour < 2 || utcHour > 4) return;

      // Court-circuit kill-switch : si CEO désactivé, ne RIEN faire (0 coût,
      // pas de lock, pas de fetch). Auto-seed le singleton si absent (fail-safe).
      const { ensureCeoConfig } = await import("@/lib/ai/ceo-helpers");
      const cfg = await ensureCeoConfig();
      if (!cfg.enabled) return;

      const { tryAcquireLock, releaseLock, buildJobLockKey } = await import("@/lib/job-lock");
      const lockKey = buildJobLockKey("scheduler-ceo-tick", now);
      const lockAcquired = await tryAcquireLock(lockKey, 15 * 60 * 1000);
      if (!lockAcquired) return;

      try {
        const PORT = process.env.PORT || "3000";
        const secret = process.env.CRON_SECRET;
        if (!secret) return;

        const res = await fetch(`http://127.0.0.1:${PORT}/api/cron/ceo-tick?secret=${secret}`, {
          signal: AbortSignal.timeout(300_000),
        });
        if (res.ok) console.log(`[scheduler:ceo-tick] Tick déclenché (${utcHour}h UTC).`);
      } finally {
        await releaseLock(lockKey);
      }
    } catch (err) {
      console.error("[scheduler:ceo-tick] Échec :", err);
    }
  };

  /**
   * Job 10 : Snapshot KPIs CEO quotidien — TIME-GATED + LOCK + KILL-SWITCH
   *
   * Fenêtre 5h UTC (1x/jour). Court-circuit si CEO désactivé.
   * Appelle snapshotCeoKpis() directement (lecture/agrégation DB, pas de LLM).
   */
  const runCeoKpisJob = async () => {
    try {
      const now = new Date();
      if (now.getUTCHours() !== 5) return;

      const { ensureCeoConfig, snapshotCeoKpis } = await import("@/lib/ai/ceo-helpers");
      const cfg = await ensureCeoConfig();
      if (!cfg.enabled) return;

      const { tryAcquireLock, releaseLock, buildJobLockKey } = await import("@/lib/job-lock");
      const lockKey = buildJobLockKey("scheduler-ceo-kpis", now);
      const lockAcquired = await tryAcquireLock(lockKey, 10 * 60 * 1000);
      if (!lockAcquired) return;

      try {
        await snapshotCeoKpis();
        console.log("[scheduler:ceo-kpis] Snapshot KPIs enregistré.");
      } finally {
        await releaseLock(lockKey);
      }
    } catch (err) {
      console.error("[scheduler:ceo-kpis] Échec :", err);
    }
  };

  /**
   * Job 11 : Back-fill progressif du décryptage des vannes — TIME-GATED + LOCK
   *
   * Décrypte automatiquement les ~289 vannes existantes après un deploy, sans
   * lancer le script manuel. 50 vannes/jour → catalogue complet en ~6 jours,
   * coût lissé < 0,1€/jour (ménage l'API Anthropic + Neon free tier).
   *
   * Idempotent par nature : backfillJokeDecryptage ne traite QUE les vannes
   * `comedyTechnique: null`. Quand tout est décrypté → 0 vanne → 0 coût.
   *
   * Court-circuit : on vérifie d'abord le COMPTE de vannes à traiter et on ne
   * fait RIEN (ni lock, ni appel) s'il n'en reste aucune.
   */
  const runJokeBackfillJob = async () => {
    try {
      const now = new Date();
      if (now.getUTCHours() !== 6) return;

      const { prisma } = await import("@/lib/prisma");
      // Court-circuit : aucune vanne à traiter → ne RIEN faire (0 coût).
      const remaining = await prisma.joke.count({ where: { comedyTechnique: null } });
      if (remaining === 0) return;

      const { tryAcquireLock, releaseLock, buildJobLockKey } = await import("@/lib/job-lock");
      const lockKey = buildJobLockKey("scheduler-joke-backfill", now);
      const lockAcquired = await tryAcquireLock(lockKey, 30 * 60 * 1000);
      if (!lockAcquired) return;

      try {
        const { backfillJokeDecryptage } = await import("../scripts/backfill-joke-decryptage");
        console.log(`[scheduler:joke-backfill] ${remaining} vanne(s) restante(s) — batch de 50…`);
        const result = await backfillJokeDecryptage({ dryRun: false, limit: 50, delayMs: 400 });
        console.log(
          `[scheduler:joke-backfill] Batch terminé : ${result.success} succès, ${result.failed} échec(s).`,
        );
      } finally {
        await releaseLock(lockKey);
      }
    } catch (err) {
      console.error("[scheduler:joke-backfill] Échec :", err);
    }
  };

  /**
   * Orchestrateur : exécute les 11 jobs séquentiellement.
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
    await runCeoTickJob();
    await runCeoKpisJob();
    await runJokeBackfillJob();
  };

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

  console.log("[scheduler] Initialisé — 11 jobs (daily + SEO blog + monthly plans + social media + SEO audit + SEO report + CEO tick + CEO KPIs + back-fill vannes) — check toutes les 15 min.");
}

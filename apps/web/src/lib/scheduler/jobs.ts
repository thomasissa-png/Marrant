/**
 * Planificateur interne — jobs partagés entre Replit et Cloudflare Workers.
 *
 * Code DÉPLACÉ tel quel depuis `src/instrumentation.ts` (migration Cloudflare,
 * étape B) : mêmes fenêtres horaires UTC, mêmes guards DB, mêmes verrous, même
 * ordre d'exécution. Seule différence : l'appel HTTP en boucle locale vers les
 * routes `/api/cron/*` passe par `callCronRoute`, injecté par l'appelant :
 *
 *  - Replit (instrumentation.ts, setInterval 15 min) : `loopbackCronRouteCaller`
 *    → `fetch(http://localhost|127.0.0.1:${PORT}/api/cron/...)`, strictement
 *    identique à l'avant-migration ;
 *  - Workers (route /api/cron/scheduler-tick, Cron Trigger « *\/15 * * * * ») :
 *    appel EN PROCESSUS du handler GET de la route (pas de self-fetch réseau),
 *    voir `src/lib/scheduler/in-process-cron-caller.ts`.
 *
 * Toute évolution d'un job se fait ICI (source unique pour les deux hébergeurs).
 */

/** Appelle une route cron interne. `path` inclut la query (`?secret=` le cas échéant). */
export type CronRouteCaller = (
  path: string,
  init?: RequestInit,
  loopbackHost?: "localhost" | "127.0.0.1",
) => Promise<Response>;

/** Implémentation Replit/Node : fetch en boucle locale sur le port du serveur Next. */
export const loopbackCronRouteCaller: CronRouteCaller = (path, init, loopbackHost = "localhost") => {
  const PORT = process.env.PORT || "3000";
  return fetch(`http://${loopbackHost}:${PORT}${path}`, init);
};

export function createSchedulerJobs(callCronRoute: CronRouteCaller) {
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
      // Contenu préparé à l'avance (s14) : aucun LLM, on comble seulement un
      // trou du calendrier depuis le stock validé (à toute heure, idempotent).
      const { isContentGenerationEnabled, ensureDailyContentFromStock } = await import("./prepared-content");
      if (!isContentGenerationEnabled()) {
        const { todayUTC } = await import("@/lib/ai/date-utils");
        await ensureDailyContentFromStock(todayUTC());
        return;
      }

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
      const { tryAcquireLock, releaseLock, buildJobLockKey, tryConsumeJobAttempt, nextUtcDay } =
        await import("@/lib/job-lock");

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
        // Plafond persistant (s14) : 2 tentatives max par jour UTC, en base.
        const dayKey = today.toISOString().slice(0, 10);
        const attempt = await tryConsumeJobAttempt("daily-content", dayKey, nextUtcDay(today));
        if (attempt === 0) {
          console.warn(`[scheduler:daily] Plafond de tentatives atteint pour ${dayKey} — pas de nouvel essai avant demain.`);
          return;
        }
        console.log(
          `[scheduler:daily] Contenu du jour absent — génération (${isMainWindow ? "main 5h UTC" : `catch-up ${utcHour}h`}, tentative ${attempt})…`,
        );

        const month = today.getUTCMonth() + 1;
        const year = today.getUTCFullYear();

        // Les plans mensuels ne doivent jamais bloquer le contenu du jour
        // (budget LLM atteint, panne API…) : publishDailyContent a ses valeurs
        // par défaut et son repli catalogue.
        try {
          await generateMonthlyPlans(month, year);
        } catch (planErr) {
          console.error("[scheduler:daily] Plans mensuels indisponibles, publication quand même :", planErr);
        }
        const result = await publishDailyContent(today);

        if (result.errors.length > 0) {
          console.warn(`[scheduler:daily] Publication avec avertissements : ${result.errors.join(" | ")}`);
        }
        console.log("[scheduler:daily] Contenu du jour traité.");
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
      // Contenu préparé à l'avance (s14) : publie l'article planifié échu de
      // la semaine s'il existe, sinon rien. Aucun LLM.
      const { isContentGenerationEnabled, publishDueScheduledArticles } = await import("./prepared-content");
      if (!isContentGenerationEnabled()) {
        await publishDueScheduledArticles();
        return;
      }

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
      const { tryAcquireLock, releaseLock, buildWeeklyJobLockKey, tryConsumeJobAttempt, nextUtcMonday } =
        await import("@/lib/job-lock");

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
        // Plafond persistant (s14) : 2 tentatives max par semaine ISO, en base.
        // Avant : publishWeeklyArticle renvoyait { success:false } sans lever,
        // le verrou était relâché et le job relançait toutes les 15 min.
        const weekKey = buildWeeklyJobLockKey("week", now).slice("week-".length);
        const attempt = await tryConsumeJobAttempt("weekly-seo", weekKey, nextUtcMonday(now));
        if (attempt === 0) {
          console.warn(`[scheduler:seo] Plafond de tentatives atteint pour ${weekKey} — pas de nouvel essai cette semaine.`);
          return;
        }
        console.log(
          `[scheduler:seo] Pas d'article blog cette semaine — génération (${isMainWindow ? "main lundi" : `catch-up jour ${dayOfWeek}`}, tentative ${attempt})…`,
        );

        await updateSeoCalendar();
        const result = await publishWeeklyArticle();

        if (result.success) {
          console.log(`[scheduler:seo] Article blog SEO publié : ${result.article?.slug ?? "?"}.`);
        } else {
          console.error(`[scheduler:seo] Article NON publié (tentative ${attempt}) : ${result.error ?? "raison inconnue"}`);
        }
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
      // Contenu préparé à l'avance (s14) : pas de plans mensuels générés par IA.
      const { isContentGenerationEnabled } = await import("./prepared-content");
      if (!isContentGenerationEnabled()) return;

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

      // Plafond persistant (s14) : 2 tentatives max pour ce mois cible, en base.
      const { tryConsumeJobAttempt, nextUtcMonth } = await import("@/lib/job-lock");
      const monthKey = `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
      const attempt = await tryConsumeJobAttempt("monthly-plan", monthKey, nextUtcMonth(now));
      if (attempt === 0) {
        console.warn(`[scheduler:monthly] Plafond de tentatives atteint pour ${monthKey}.`);
        return;
      }

      console.log(`[scheduler:monthly] Plans du mois ${nextMonth}/${nextYear} absents — génération (tentative ${attempt})…`);

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

      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await callCronRoute(`/api/cron/daily-social?secret=${secret}`);
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
      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await callCronRoute(`/api/cron/publish-social?secret=${secret}`);
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
      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await callCronRoute(`/api/cron/social-analytics`, {
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

      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await callCronRoute(`/api/cron/seo-audit`, {
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

      const secret = process.env.CRON_SECRET;
      if (!secret) return;

      const res = await callCronRoute(`/api/cron/seo-report`, {
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

      const { tryAcquireLock, releaseLock, buildJobLockKey, tryConsumeJobAttempt, nextUtcDay } =
        await import("@/lib/job-lock");
      const lockKey = buildJobLockKey("scheduler-ceo-tick", now);
      const lockAcquired = await tryAcquireLock(lockKey, 15 * 60 * 1000);
      if (!lockAcquired) return;

      try {
        const secret = process.env.CRON_SECRET;
        if (!secret) return;

        // Plafond persistant (s14) : 2 déclenchements max par jour UTC, en base.
        const attempt = await tryConsumeJobAttempt("ceo-tick", now.toISOString().slice(0, 10), nextUtcDay(now));
        if (attempt === 0) return;

        const res = await callCronRoute(
          `/api/cron/ceo-tick?secret=${secret}`,
          { signal: AbortSignal.timeout(300_000) },
          "127.0.0.1",
        );
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
   * Job 11 : Relecture automatique du corpus (charte s11) — TIME-GATED + LOCK + KILL-SWITCH
   *
   * Passe quotidienne du Copy Review Agent : Sonnet relit un lot borné de
   * vannes/conseils générés (generatedByAI=true) et applique la charte s11
   * (GARDER / RÉÉCRIRE / RETIRER). Chaque réécriture est ensuite validée par
   * le Stand-Up Director (score ≥ 8) avant d'écrire en DB. Réversibilité
   * garantie via `originalContent` / `originalPunchline` / `originalTitle`.
   *
   * Fenêtre : 3h-4h UTC (créneau calme, hors slot daily-content à 5h).
   * Kill-switch : `COPY_REVIEW_ENABLED=false` court-circuite avant lock.
   * Lock : verrou daté conservé (TTL 3 h) → un seul lot 25+25 par jour.
   * Batch : `COPY_REVIEW_BATCH` (défaut 25 vannes + 25 conseils).
   *
   * Idempotence : la sélection SQL filtre sur `copyReviewVersion` — seuls les
   * items non relus pour la version courante (`COPY_REVIEW_VERSION`) passent.
   */
  const runCopyReviewJob = async () => {
    try {
      const now = new Date();
      const utcHour = now.getUTCHours();
      if (utcHour !== 3 && utcHour !== 4) return;

      // Un seul lot par jour : verrou daté NON relâché (TTL 3 h > fenêtre).
      // Relâcher le verrou relançait un lot à chaque tick de 15 min (8×/jour).
      const { runDailyCopyReviewOnce } = await import("@/lib/ai/copy-review-runner");
      await runDailyCopyReviewOnce(now);
    } catch (err) {
      console.error("[scheduler:copy-review] Échec :", err);
    }
  };

  /**
   * Contrôle qualité du matin (s14, lot Q4) : relit la vanne et le conseil du
   * jour, remplace une vanne sous la barre des étalons par une vanne validée et
   * envoie un récap admin si besoin. Fenêtre 6h-8h UTC (après daily-content à
   * 5h) ; verrou daté interne à runQualityWatch : 1 seul passage par jour,
   * au plus 1 appel LLM (sous le coupe-circuit budget).
   */
  const runQualityWatchJob = async () => {
    try {
      const utcHour = new Date().getUTCHours();
      if (utcHour < 6 || utcHour >= 8) return;
      const { runQualityWatch } = await import("@/lib/ai/quality-watch");
      const res = await runQualityWatch();
      if (!res.skipped) {
        console.log(`[scheduler:quality-watch] ${res.date} : ${res.defects.length} défaut(s), e-mail ${res.emailed ? "envoyé" : "non"}.`);
      }
    } catch (err) {
      console.error("[scheduler:quality-watch] Échec :", err);
    }
  };

  /**
   * Orchestrateur : exécute les jobs séquentiellement.
   * Séquentiel pour éviter de surcharger l'API IA avec des appels simultanés.
   *
   * Le décryptage des vannes existantes ne fait PLUS partie du scheduler :
   * il est appliqué une fois au boot via `runStartupTasks`
   * (applyJokeDecryptagesTask), sans IA, depuis le fichier pré-rédigé.
   */
  const runAllJobs = async () => {
    await runDailyContentJob();
    await runQualityWatchJob();
    await runWeeklySeoJob();
    await runMonthlyPlanJob();
    await runDailySocialJob();
    await runPublishSocialJob();
    await runSocialAnalyticsJob();
    await runSeoAuditJob();
    await runSeoReportJob();
    await runCeoTickJob();
    await runCeoKpisJob();
    await runCopyReviewJob();
  };

  return { runAllJobs };
}

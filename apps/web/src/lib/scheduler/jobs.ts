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

import type { CouvertureDb } from "@/lib/social/couverture";

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
   * Job 4 : Génération quotidienne des posts sociaux — ARRÊTÉE DÉFINITIVEMENT (s14).
   *
   * Décision Thomas du 01/10/2026 (audit réseaux sociaux s14) : plus aucune
   * génération IA de posts. Les posts X et Instagram sont préparés chaque mois
   * à partir du catalogue validé (`scripts/content/prepare-social-month.ts`),
   * relus sur échantillon de 10 par Thomas, puis insérés en APPROVED.
   * Le job est conservé (planning inchangé) mais retourne immédiatement :
   * aucun appel à `/api/cron/daily-social`, aucun verrou pris, aucun appel LLM.
   */
  const runDailySocialJob = async (): Promise<void> => {
    return;
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
   * Job 5 bis : Relecture du statut réel des posts remis à Buffer (s15, 05/10/2026).
   * TIME-GATED (1 passage par heure UTC) + LOCK horaire non relâché.
   *
   * Posts PUBLISHED non confirmés remis à Buffer depuis moins de 30 jours
   * (détail : `lib/social/buffer-status-check.ts`) : sent → confirmé ; error →
   * FAILED ; supprimé chez Buffer → FAILED introuvable ; bloqué 6 h → non
   * confirmé ; autorisation perdue → réseau mis en pause. E-mail admin 1 par
   * jour et par réseau, jamais perdu. Aucun LLM. Ne publie rien.
   */
  const runBufferStatusCheckJob = async () => {
    try {
      const { isBufferConfigured } = await import("@/lib/social/buffer-client");
      if (!isBufferConfigured()) return;

      const now = new Date();
      const { tryAcquireLock, buildJobLockKey } = await import("@/lib/job-lock");
      const hour = String(now.getUTCHours()).padStart(2, "0");
      const lockKey = `${buildJobLockKey("buffer-status-check", now)}-h${hour}`;
      if (!(await tryAcquireLock(lockKey, 55 * 60 * 1000))) return;

      const { runBufferStatusCheck } = await import("@/lib/social/buffer-status-check");
      const res = await runBufferStatusCheck(now);
      if (res?.error) {
        console.warn(`[scheduler:buffer-status] Buffer injoignable, aucun changement : ${res.error}`);
      } else if (res && (res.confirmed + res.failed + res.missing + res.unconfirmed > 0 || res.alerted.length > 0)) {
        console.log(
          `[scheduler:buffer-status] ${res.confirmed} confirmé(s), ${res.failed} en échec, ${res.missing} introuvable(s), ${res.unconfirmed} non confirmé(s), pause auto : ${res.paused.join(", ") || "aucune"}, alerte : ${res.alerted.join(", ") || "aucune"}.`,
        );
      }
    } catch (err) {
      console.error("[scheduler:buffer-status] Échec :", err);
    }
  };

  /**
   * Job 5 ter : Couverture de la file sociale (s15, QA cycles 1-2, plan v2 §5 et §8).
   * TIME-GATED (5h-21h UTC, les créneaux de publication) + LOCK horaire non
   * relâché (1 passage par heure, comme la relecture Buffer).
   *
   * Réseaux non en pause : pause automatique après 2 FAILED consécutifs ;
   * alerte « file basse » (moins de 10 jours de posts APPROVED) ; tranche en
   * retard (à sa date de prêt, J-14 : insérés < prévus, 9 tranches du plan v2).
   * Tous réseaux : stock éligible < 14 ; e-mail de lancement de tranche.
   * Alertes enregistrées par réseau et par type (s15 06/10 : plus d'e-mail,
   * lues par la session via /api/admin/alertes). Aucun LLM, aucun appel Buffer. Détail : `lib/social/couverture.ts`.
   */
  const runCouvertureSocialeJob = async () => {
    try {
      const now = new Date();
      const utcHour = now.getUTCHours();
      if (utcHour < 5 || utcHour > 21) return;

      const { tryAcquireLock, buildJobLockKey } = await import("@/lib/job-lock");
      const lockKey = `${buildJobLockKey("social-couverture", now)}-h${String(utcHour).padStart(2, "0")}`;
      if (!(await tryAcquireLock(lockKey, 55 * 60 * 1000))) return;

      const { prisma } = await import("@/lib/prisma");
      const { runCouvertureSociale } = await import("@/lib/social/couverture");
      const { sendDailyPublishFailureAlert } = await import("@/lib/social/publish-failure");
      const res = await runCouvertureSociale(prisma as unknown as CouvertureDb, sendDailyPublishFailureAlert, now);
      if (res.alertes.length + res.pauses.length + res.fileBasse.length + res.tranchesEnRetard.length > 0) {
        console.log(
          `[scheduler:social-couverture] pause : ${res.pauses.join(", ") || "aucune"} ; file basse : ${res.fileBasse.map((f) => `${f.platform} ${f.jours.toFixed(1)} j`).join(", ") || "aucune"} ; tranche en retard : ${res.tranchesEnRetard.map((t) => `${t.platform} ${t.tranche} ${t.inseres}/${t.prevus}`).join(", ") || "aucune"} ; stock : ${JSON.stringify(res.stock)} ; lancement : ${res.lancement ?? "aucun"} ; alertes : ${res.alertes.join(", ") || "aucune"}.`,
        );
      }
    } catch (err) {
      console.error("[scheduler:social-couverture] Échec :", err);
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
      // [CHOIX UTILISATEUR] Thomas 01/10 (s14) : aucune IA ne produit seule.
      // La relecture IA réécrit le catalogue en prod : coupée avec l'interrupteur.
      const { isContentGenerationEnabled } = await import("./prepared-content");
      if (!isContentGenerationEnabled()) return;

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
        console.log(`[scheduler:quality-watch] ${res.date} : ${res.defects.length} défaut(s), alerte ${res.emailed ? "enregistrée" : "non"}.`);
      }
    } catch (err) {
      console.error("[scheduler:quality-watch] Échec :", err);
    }
  };

  /**
   * Job : Rappel légal de reconduction de l'annuel (L.215-1, s14 04/10/2026)
   * TIME-GATED + LOCK + anti-doublon en base.
   *
   * Fenêtre 8h UTC (4 ticks de 15 min : les envois en échec sont retentés au
   * tick suivant). Abonnés annuels actifs dont la période se termine dans
   * 32 à 40 jours (cible J-40), un seul email par période : clé unique
   * RenewalReminder (subscriptionId, periodEnd) insérée AVANT l'envoi.
   * Aucun LLM, aucun appel Stripe : lecture base + mailer transactionnel.
   */
  const runAnnualRenewalReminderJob = async () => {
    try {
      const now = new Date();
      if (now.getUTCHours() !== 8) return;

      const { tryAcquireLock, releaseLock, buildJobLockKey } = await import("@/lib/job-lock");
      const lockKey = buildJobLockKey("annual-renewal-reminders", now);
      const lockAcquired = await tryAcquireLock(lockKey, 10 * 60 * 1000);
      if (!lockAcquired) return;

      try {
        const { prisma } = await import("@/lib/prisma");
        const { sendTransactionalTextEmail } = await import("@/lib/email");
        const { runAnnualRenewalReminders } = await import("@/lib/billing/annual-renewal-reminders");
        const baseUrl = process.env.NEXTAUTH_URL || "https://deviens-marrant.fr";
        const res = await runAnnualRenewalReminders(now, {
          prisma,
          // s16 : clé d'alerte dédiée `email-envoi-rappel-annuel` si Resend refuse.
          sendEmail: (to: string, subject: string, text: string) =>
            sendTransactionalTextEmail(to, subject, text, "rappel-annuel"),
          manageUrl: `${baseUrl}/profil`,
        });
        if (res.candidates > 0) {
          console.log(
            `[scheduler:renewal-reminder] ${res.sent} envoyé(s), ${res.skipped} ignoré(s), ${res.failed} échec(s) sur ${res.candidates}.`,
          );
        }
      } finally {
        await releaseLock(lockKey);
      }
    } catch (err) {
      console.error("[scheduler:renewal-reminder] Échec :", err);
    }
  };

  /**
   * Job : Réconciliation quotidienne Stripe ↔ base (s16, 07/10/2026).
   * Fenêtre 4h UTC (avant le digest de 07:30 heure de Paris), verrou daté du
   * jour CONSERVÉ après succès (une seule passe par jour), relâché en cas
   * d'échec pour retenter au tick suivant. Lecture seule ; écarts → alerte A.
   * Clé Stripe absente ou factice : rien (le /api/health le signale déjà).
   */
  const runStripeReconciliationJob = async (now: Date = new Date()) => {
    try {
      if (now.getUTCHours() !== 4) return;
      const key = process.env.STRIPE_SECRET_KEY ?? "";
      if (!/^(sk|rk)_(live|test)_/.test(key)) return;

      const { tryAcquireLock, releaseLock, buildJobLockKey } = await import("@/lib/job-lock");
      const lockKey = buildJobLockKey("stripe-reconciliation", now);
      if (!(await tryAcquireLock(lockKey, 2 * 60 * 60 * 1000))) return;

      try {
        const { prisma } = await import("@/lib/prisma");
        const { getStripe } = await import("@/lib/stripe");
        const { runStripeReconciliation } = await import("@/lib/billing/stripe-reconciliation");
        const res = await runStripeReconciliation(now, {
          stripe: getStripe(),
          db: prisma as unknown as import("@/lib/billing/stripe-reconciliation").ReconciliationDb,
        });
        console.log(
          `[scheduler:stripe-reconciliation] ${res.stripeEnCours} abonnement(s) en cours ; écarts : ${res.payeSansPremium.length} payé(s) sans Premium, ${res.premiumSansAbonnement.length} Premium sans abonnement, ${res.doublons.length} doublon(s), ${res.impayesProlonges.length} impayé(s) prolongé(s) ; ${res.evenementsNonLivres.length} événement(s) non livré(s).`,
        );
      } catch (err) {
        await releaseLock(lockKey);
        throw err;
      }
    } catch (err) {
      console.error("[scheduler:stripe-reconciliation] Échec :", err);
      // Lot H : un échec n'est plus silencieux (une ligne par jour, occurrences incrémentées).
      const { recordAdminAlert, CLES_TUNNEL } = await import("@/lib/admin-alerts");
      await recordAdminAlert({
        cle: `${CLES_TUNNEL.reconciliation}-echec`,
        sujet: "Réconciliation Stripe en échec (nouvel essai au tick suivant, entre 4h et 5h UTC)",
        html: `<p>${(err instanceof Error ? err.message : String(err)).replace(/</g, "&lt;").slice(0, 500)}</p><p>À vérifier si l'alerte persiste : clé Stripe, base, logs du Worker.</p>`,
        now,
      });
    }
  };

  /**
   * Job : Alertes des parcours (s17, data-analyst §7). Fenêtre 4h UTC (avant
   * le digest du matin), verrou daté du jour CONSERVÉ (un seul passage par
   * jour). Alertes de classe B enregistrées, aucun e-mail direct.
   */
  const runParcoursAlertesJob = async (now: Date = new Date()) => {
    try {
      if (now.getUTCHours() !== 4) return;
      const { tryAcquireLock, buildJobLockKey } = await import("@/lib/job-lock");
      if (!(await tryAcquireLock(buildJobLockKey("parcours-alertes", now), 2 * 60 * 60 * 1000))) return;
      const { runParcoursAlertes } = await import("@/lib/analytics/parcours-alertes");
      const res = await runParcoursAlertes(now);
      console.log(`[scheduler:parcours-alertes] ${res.sansDemarrage} abonné(s) sans démarrage ; suivi muet : ${res.suiviMuet ?? "non contrôlé"}.`);
    } catch (err) {
      console.error("[scheduler:parcours-alertes] Échec :", err);
    }
  };

  /**
   * Job : Rappel e-mail des parcours SUR DEMANDE (s17, D7). Chaque jour à 9h
   * heure de Paris (4 ticks : un envoi en échec est retenté au tick suivant).
   * Un seul e-mail par personne et par semaine de Paris, au jour choisi
   * (`lastSentWeek` réservé avant l'envoi). Arrêt automatique des rappels des
   * comptes qui ne sont plus Premium. Aucun LLM.
   */
  const runParcoursReminderJob = async (now: Date = new Date()) => {
    try {
      const { parisParts } = await import("@/lib/analytics/weekly-visits-period");
      if (parisParts(now).hour !== 9) return;
      const { tryAcquireLock, releaseLock, buildJobLockKey } = await import("@/lib/job-lock");
      const lockKey = buildJobLockKey("rappel-parcours", now);
      if (!(await tryAcquireLock(lockKey, 10 * 60 * 1000))) return;
      try {
        const { prisma } = await import("@/lib/prisma");
        const { sendServiceTextEmail } = await import("@/lib/email");
        const { runParcoursReminders } = await import("@/lib/rappels/rappel-parcours");
        const res = await runParcoursReminders(now, {
          db: prisma as unknown as import("@/lib/rappels/rappel-parcours").RappelDb,
          sendEmail: (to, subject, text, headers) =>
            sendServiceTextEmail(to, subject, text, "rappel-parcours", { headers, replyTo: "contact@deviens-marrant.fr" }),
          baseUrl: process.env.NEXTAUTH_URL || "https://deviens-marrant.fr",
        });
        if (res.secretAbsent) {
          const { recordAdminAlert, CLES_PARCOURS } = await import("@/lib/admin-alerts");
          await recordAdminAlert({
            cle: CLES_PARCOURS.rappelEchec,
            sujet: "Rappel des parcours non envoyé : secret du lien d'arrêt absent",
            html: "<p>UNSUBSCRIBE_HMAC_SECRET absent ou trop court (32 caractères minimum) : aucun rappel ne part sans lien d'arrêt.</p>",
            now,
          });
        }
        if (res.candidats + res.arretesFinPremium > 0) {
          console.log(
            `[scheduler:rappel-parcours] ${res.envoyes} envoyé(s), ${res.sansParcours} sans parcours en cours, ${res.echecs} échec(s) sur ${res.candidats} ; ${res.arretesFinPremium} arrêté(s) (fin de Premium).`,
          );
        }
      } finally {
        await releaseLock(lockKey);
      }
    } catch (err) {
      console.error("[scheduler:rappel-parcours] Échec :", err);
    }
  };

  /**
   * Job : Lettre mensuelle gratuite (s21). À chaque tick : rien si l'interrupteur
   * `LETTRE_ENVOIS_OUVERTS` est fermé ; sinon envoie le numéro VALIDE ET approuvé par Thomas
   * (s22) du mois dès que sa date prévue est passée, par lots (`LETTRE_LOT_PAR_PASSAGE`), journal réservé
   * avant chaque envoi (jamais deux fois la même adresse). Verrou par mois, relâché
   * à la fin du passage. Aucun LLM, contenu préparé en base uniquement.
   */
  const runLettreMensuelleJob = async (now: Date = new Date()) => {
    try {
      const { LETTRE_ENVOIS_OUVERTS } = await import("@/config/lettre");
      if (!LETTRE_ENVOIS_OUVERTS) return;
      const { periodeMensuelle, envoyerLettreDuMois } = await import("@/lib/lettre/envoi");
      const { tryAcquireLock, releaseLock } = await import("@/lib/job-lock");
      const lockKey = `lettre-mensuelle-${periodeMensuelle(now)}`;
      if (!(await tryAcquireLock(lockKey, 20 * 60 * 1000))) return;
      try {
        const { sendServiceTextEmail } = await import("@/lib/email");
        const { LETTRE_CONTACT } = await import("@/config/textes/lettre-s21");
        const { siteBaseUrl } = await import("@/lib/newsletter");
        const res = await envoyerLettreDuMois(now, {
          baseUrl: siteBaseUrl(),
          envoyer: (to, subject, text, headers) =>
            sendServiceTextEmail(to, subject, text, "lettre-numero", { headers, replyTo: LETTRE_CONTACT }),
        });
        if (res.nonApprouve) {
          const { recordAdminAlert } = await import("@/lib/admin-alerts");
          console.warn(`[scheduler:lettre-mensuelle] ALERTE ${res.numero} validé mais pas approuvé par Thomas (ou modifié depuis l'approbation). Rien n'est envoyé.`);
          await recordAdminAlert({ cle: "lettre-mensuelle-non-approuve", sujet: `Lettre du mois ${res.numero} : en attente de ton approbation`, html: "<p>Rien n'est parti. Relire le numéro dans l'admin (Abonnés › Lettre, « Numéros à approuver ») puis « Approuver ce numéro » : il partira au passage suivant (15 min au plus), jusqu'à la fin du mois.</p>", now });
        }
        if (res.reporte && res.prochainEnvoi) {
          console.log(
            `[scheduler:lettre-mensuelle] ${res.numero} reporté : article(s) cité(s) en ligne, départ au créneau du ${res.prochainEnvoi.toISOString()} (jeudi 8 h, Paris).`,
          );
        } else if (res.reporte) {
          console.warn(
            `[scheduler:lettre-mensuelle] ALERTE ${res.numero} reporté au passage suivant : article(s) cité(s) pas encore en ligne (${res.articlesNonPublies.join(", ")}). Rien n'est envoyé ; vérifier isPublished et publishedAt.`,
          );
        }
        if (res.bloque) {
          console.warn(`[scheduler:lettre-mensuelle] ${res.numero} bloqué : ${res.motifs.join(", ") || "marqueur [À COMPLÉTER] dans le numéro (mention d'éditeur @legal ?)"}. Rien n'est envoyé.`);
        }
        if (res.numero && res.candidats + res.dejaTraites > 0) {
          console.log(
            `[scheduler:lettre-mensuelle] ${res.numero} : ${res.envoyes} envoyé(s), ${res.echecs} échec(s), ${res.dejaTraites} déjà traité(s), ${res.canalPremium} abonné(s) Premium (version Premium), ${res.dedoublonnes} doublon(s) évité(s), ${res.exclusOpposition} exclu(s) opposition${res.termine ? ", numéro terminé" : ""}.`,
          );
        }
      } finally {
        await releaseLock(lockKey);
      }
    } catch (err) {
      console.error("[scheduler:lettre-mensuelle] Échec :", err);
    }
  };

  /**
   * Job : Lettre de la semaine (hebdo Premium, s21, spec §6.4). À chaque tick : rien si
   * `LETTRE_HEBDO_ENVOIS_OUVERTS` est fermé ; sinon, à partir du jeudi 8 h (Paris), envoie
   * le numéro VALIDE de la semaine ISO par lots, journal réservé avant chaque envoi.
   * Verrou par semaine relâché à la fin du passage. Alertes (au plus une par jour et par
   * clé, digest admin) : aucun numéro, numéro bloqué ou reporté, stock sous 4.
   */
  const runLettreHebdoJob = async (now: Date = new Date()) => {
    try {
      const { LETTRE_HEBDO_ENVOIS_OUVERTS } = await import("@/config/lettre");
      if (!LETTRE_HEBDO_ENVOIS_OUVERTS) return;
      const { semaineIsoParis } = await import("@/lib/lettre/calendrier");
      const { envoyerLettreDeLaSemaine } = await import("@/lib/lettre/envoi-hebdo");
      const { tryAcquireLock, releaseLock } = await import("@/lib/job-lock");
      const lockKey = `lettre-hebdo-${semaineIsoParis(now)}`;
      if (!(await tryAcquireLock(lockKey, 20 * 60 * 1000))) return;
      try {
        const { sendServiceTextEmail } = await import("@/lib/email");
        const { LETTRE_CONTACT } = await import("@/config/textes/lettre-s21");
        const { siteBaseUrl } = await import("@/lib/newsletter");
        const { recordAdminAlert } = await import("@/lib/admin-alerts");
        const { stockHebdo } = await import("@/lib/lettre/numeros-hebdo");
        const res = await envoyerLettreDeLaSemaine(now, {
          baseUrl: siteBaseUrl(),
          envoyer: (to, subject, text, headers) =>
            sendServiceTextEmail(to, subject, text, "lettre-hebdo", { headers, replyTo: LETTRE_CONTACT }),
        });
        if (res.semaineMensuelle) {
          console.log(`[scheduler:lettre-hebdo] ${res.semaine} : semaine de la lettre du mois, pas de lettre réservée (les abonnés reçoivent la lettre du mois).`);
        }
        if (res.sansNumero) {
          console.warn(`[scheduler:lettre-hebdo] ALERTE ${res.semaine} : aucun numéro VALIDE pour la semaine. Rien n'est envoyé.`);
          await recordAdminAlert({ cle: "lettre-hebdo-sans-numero", sujet: `Lettre de la semaine ${res.semaine} : aucun numéro validé`, html: "<p>Rien n'est parti ce jeudi. Valider un numéro dans data/lettre/hebdo-premium.json.</p>", now });
        }
        if (res.nonApprouve) {
          console.warn(`[scheduler:lettre-hebdo] ALERTE ${res.numero} validé mais pas approuvé par Thomas (ou modifié depuis l'approbation). Rien n'est envoyé.`);
          await recordAdminAlert({ cle: "lettre-hebdo-non-approuve", sujet: `Lettre de la semaine ${res.numero} : en attente de ton approbation`, html: "<p>Rien n'est parti. Relire le numéro dans l'admin (Abonnés › Lettre) puis « Approuver ce numéro » : il partira au passage suivant, jusqu'à dimanche soir.</p>", now });
        }
        if (res.bloque) {
          console.warn(`[scheduler:lettre-hebdo] ALERTE ${res.numero} bloqué (${res.motifs.join(", ") || "marqueur [À COMPLÉTER"}). Rien n'est envoyé.`);
          await recordAdminAlert({ cle: "lettre-hebdo-bloque", sujet: `Lettre de la semaine ${res.numero} bloquée`, html: `<p>Motifs : ${res.motifs.join(", ") || "marqueur [À COMPLÉTER"}.</p>`, now });
        }
        if (res.reporte) {
          console.warn(`[scheduler:lettre-hebdo] ALERTE ${res.numero} reporté : lien(s) hors ligne (${res.liensMorts.join(", ")}).`);
          await recordAdminAlert({ cle: "lettre-hebdo-reporte", sujet: `Lettre de la semaine ${res.numero} reportée`, html: `<p>Liens hors ligne : ${res.liensMorts.join(", ")}.</p>`, now });
        }
        if (res.numero && res.candidats + res.dejaTraites > 0) {
          console.log(
            `[scheduler:lettre-hebdo] ${res.numero} : ${res.envoyes} envoyé(s), ${res.echecs} échec(s), ${res.dejaTraites} déjà traité(s), ${res.destinataires} destinataire(s)${res.termine ? ", numéro terminé" : ""}.`,
          );
        }
        const stock = await stockHebdo(now);
        if (stock.alerte) {
          await recordAdminAlert({ cle: "lettre-hebdo-stock", sujet: `Lettre de la semaine : stock sous le seuil (${stock.aVenir} à venir)`, html: "<p>Préparer le prochain lot de numéros.</p>", now });
        }
      } finally {
        await releaseLock(lockKey);
      }
    } catch (err) {
      console.error("[scheduler:lettre-hebdo] Échec :", err);
    }
  };

  /**
   * Job : Entretien de la lettre de la semaine (s21), une fois par jour à 4 h (Paris),
   * interrupteurs ouverts ou non : filet `fin-premium` (la fermeture principale est
   * posée avec le passage du plan à FREE) et effacement du journal après 12 mois.
   */
  const runLettreHebdoEntretienJob = async (now: Date = new Date()) => {
    try {
      const { parisParts } = await import("@/lib/analytics/weekly-visits-period");
      if (parisParts(now).hour !== 4) return;
      const { tryAcquireLock, buildJobLockKey } = await import("@/lib/job-lock");
      if (!(await tryAcquireLock(buildJobLockKey("lettre-hebdo-entretien", now), 2 * 3600 * 1000))) return;
      const { rapprocherFinPremium, purgerJournalHebdo } = await import("@/lib/lettre/hebdo");
      const fins = await rapprocherFinPremium(now);
      const purges = await purgerJournalHebdo(now);
      if (fins + purges > 0) console.log(`[scheduler:lettre-hebdo-entretien] ${fins} arrêt(s) fin-premium, ${purges} ligne(s) de journal effacée(s).`);
    } catch (err) {
      console.error("[scheduler:lettre-hebdo-entretien] Échec :", err);
    }
  };

  /**
   * Job : Entretien de la liste de la lettre (s21, @legal L4), une fois par jour
   * à 4 h heure de Paris : purge des non confirmés (7 j), reconfirmation (24 mois),
   * effacement des traces de désinscription (3 ans). Inscriptions fermées et liste
   * vide : aucune requête au-delà du comptage.
   */
  const runLettreEntretienJob = async (now: Date = new Date()) => {
    try {
      const { parisParts } = await import("@/lib/analytics/weekly-visits-period");
      if (parisParts(now).hour !== 4) return;
      const { LETTRE_INSCRIPTIONS_OUVERTES } = await import("@/config/lettre");
      const { prisma } = await import("@/lib/prisma");
      if (!LETTRE_INSCRIPTIONS_OUVERTES && (await prisma.newsletterSubscriber.count()) === 0) return;
      const { tryAcquireLock, buildJobLockKey } = await import("@/lib/job-lock");
      // Verrou de 2 h non relâché : un seul passage par jour.
      if (!(await tryAcquireLock(buildJobLockKey("lettre-entretien", now), 2 * 3600 * 1000))) return;
      const { sendServiceTextEmail } = await import("@/lib/email");
      const { LETTRE_CONTACT } = await import("@/config/textes/lettre-s21");
      const { siteBaseUrl } = await import("@/lib/newsletter");
      const { entretenirLettre } = await import("@/lib/lettre/entretien");
      const res = await entretenirLettre(now, {
        baseUrl: siteBaseUrl(),
        envoyer: (to, subject, text, headers) =>
          sendServiceTextEmail(to, subject, text, "lettre-confirmation", { headers, replyTo: LETTRE_CONTACT }),
      });
      console.log(
        `[scheduler:lettre-entretien] ${res.pendingEffaces} non confirmé(s) effacé(s), ${res.reconfirmationsEnvoyees} reconfirmation(s), ${res.desinscritsSansReponse} désinscrit(s) sans réponse, ${res.tracesEffacees} trace(s) effacée(s).`,
      );
    } catch (err) {
      console.error("[scheduler:lettre-entretien] Échec :", err);
    }
  };

  /**
   * Job : Surveillance DNS des e-mails (s22) : SPF, DKIM, DMARC, MX par DoH, une fois par
   * jour dans la fenêtre 4h UTC (avant le point du matin). Verrou daté du jour CONSERVÉ
   * après un contrôle enregistré ; DoH injoignable avant 4h45 : verrou relâché, nouvel
   * essai au tick suivant. 2 jours de suite hors `ok` : alerte A `email-dns`. Aucun LLM.
   */
  const runEmailDnsJob = async (now: Date = new Date()) => {
    try {
      if (now.getUTCHours() !== 4) return;
      const { tryAcquireLock, releaseLock, buildJobLockKey } = await import("@/lib/job-lock");
      const lockKey = buildJobLockKey("email-dns", now);
      if (!(await tryAcquireLock(lockKey, 2 * 60 * 60 * 1000))) return;
      try {
        const { prisma } = await import("@/lib/prisma");
        const { recordAdminAlert, jourParisDe } = await import("@/lib/admin-alerts");
        const { surveillerDns } = await import("@/lib/delivrabilite/dns");
        const res = await surveillerDns(now, {
          db: prisma as unknown as import("@/lib/delivrabilite/dns").DnsDb,
          jour: jourParisDe(now),
          alerter: recordAdminAlert,
          dernierEssai: now.getUTCMinutes() >= 45,
        });
        if (res.aRetenter) {
          await releaseLock(lockKey);
          console.warn("[scheduler:email-dns] Résolveur DoH injoignable : nouvel essai au tick suivant.");
          return;
        }
        const enDefaut = res.etat?.enDefaut ?? [];
        console.log(`[scheduler:email-dns] ${res.statut}${enDefaut.length ? ` (${enDefaut.join(", ")}, ${res.etat?.consecutifs} jour(s) de suite)` : ""}.`);
      } catch (err) {
        await releaseLock(lockKey);
        throw err;
      }
    } catch (err) {
      console.error("[scheduler:email-dns] Échec :", err);
    }
  };

  /**
   * Job : Rapport hebdomadaire des visites (Umami + conversions en base).
   * Lundi 7h-8h heure de Paris (heure d'été gérée), verrou hebdomadaire
   * conservé après envoi (1 email par semaine), relâché en cas d'échec pour
   * retenter au tick suivant. Secrets Umami absents : rien, avertissement.
   */
  const runWeeklyVisitsReportJob = async () => {
    try {
      const { runScheduledWeeklyVisitsReport } = await import("@/lib/analytics/weekly-visits-job");
      await runScheduledWeeklyVisitsReport(new Date());
    } catch (err) {
      console.error("[scheduler:weekly-visits] Échec :", err);
    }
  };

  /**
   * Job : Digest quotidien des alertes admin (s15, 06/10/2026). Le SEUL e-mail
   * d'alerte vers l'admin : au plus 1 par jour, 07:30-09:59 heure de Paris,
   * seulement s'il y a une action pour Thomas (ou des alertes B non relues par
   * la session depuis 48 h). Verrou daté par jour. Détail : `lib/admin-digest.ts`.
   */
  const runAdminDigestJob = async () => {
    try {
      const { runDailyAdminDigest } = await import("@/lib/admin-digest");
      await runDailyAdminDigest(new Date());
    } catch (err) {
      console.error("[scheduler:admin-digest] Échec :", err);
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
    await runBufferStatusCheckJob();
    await runCouvertureSocialeJob();
    await runSocialAnalyticsJob();
    await runSeoAuditJob();
    await runSeoReportJob();
    await runCeoTickJob();
    await runCeoKpisJob();
    await runCopyReviewJob();
    await runAnnualRenewalReminderJob();
    await runStripeReconciliationJob();
    await runParcoursAlertesJob();
    await runParcoursReminderJob();
    await runLettreMensuelleJob();
    await runLettreHebdoJob();
    await runLettreEntretienJob();
    await runLettreHebdoEntretienJob();
    await runEmailDnsJob();
    await runWeeklyVisitsReportJob();
    await runAdminDigestJob();
  };

  // runDailySocialJob exposé pour le test de non-régression s14 (génération arrêtée) ;
  // runAnnualRenewalReminderJob pour le test du rappel légal de l'annuel.
  return {
    runAllJobs,
    runDailySocialJob,
    runAnnualRenewalReminderJob,
    runStripeReconciliationJob,
    runParcoursAlertesJob,
    runParcoursReminderJob,
    runLettreMensuelleJob,
    runLettreHebdoJob,
    runLettreEntretienJob,
    runLettreHebdoEntretienJob,
    runWeeklyVisitsReportJob,
    runBufferStatusCheckJob,
    runCouvertureSocialeJob,
    runAdminDigestJob,
    runEmailDnsJob,
  };
}

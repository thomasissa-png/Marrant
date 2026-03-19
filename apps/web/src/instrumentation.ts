/**
 * Next.js Instrumentation — s'exécute une seule fois au démarrage du serveur.
 *
 * Scheduler interne qui remplace les crons Vercel sur Replit.
 * Vérifie toutes les 15 minutes si les contenus planifiés existent
 * et les génère automatiquement sinon.
 *
 * 5 jobs gérés :
 * 1. Contenu quotidien (blague + conseil + vidéo) — tous les jours
 * 2. Article blog SEO — une fois par semaine (lundi)
 * 3. Plans mensuels — le 28 du mois (pré-génère le mois suivant)
 * 4. Posts sociaux quotidiens — tous les jours (génération PENDING)
 * 5. Publication posts sociaux — toutes les 15 min (publie les APPROVED)
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
   * Job 4 : Génération quotidienne des posts sociaux
   * Génère 2-3 posts Twitter + 1 LinkedIn (status PENDING) pour validation admin.
   */
  const runDailySocialJob = async () => {
    try {
      const { prisma } = await import("@/lib/prisma");
      const { generateDailySocialPosts, getOptimalScheduleTime } = await import(
        "@/lib/ai/agents/social-media-agent"
      );
      const { getPersonaForDay } = await import("@/lib/ai/personas");

      const today = new Date();
      const dayOfMonth = today.getDate();

      // Check if posts already generated today
      const startOfDay = new Date(today);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const existingCount = await prisma.socialPost.count({
        where: { createdAt: { gte: startOfDay, lte: endOfDay } },
      });

      if (existingCount > 0) return;

      const persona = getPersonaForDay(dayOfMonth);
      console.log(`[scheduler:social] Génération posts jour ${dayOfMonth} — persona ${persona}…`);

      const posts = await generateDailySocialPosts(dayOfMonth);

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const scheduledAt = getOptimalScheduleTime(persona, i, post.platform as "TWITTER" | "THREADS" | "LINKEDIN" | "INSTAGRAM");
        await prisma.socialPost.create({
          data: {
            platform: post.platform,
            format: post.format,
            hook: post.hook,
            content: post.content,
            cta: post.cta || "",
            hashtags: post.hashtags || [],
            targetPersona: post.targetPersona,
            sourceType: post.sourceType || null,
            sourceId: post.sourceId || null,
            threadParts: post.threadParts || [],
            directorScore: post.directorScore ?? null,
            directorNote: post.directorNote ?? null,
            status: "APPROVED",
            scheduledAt,
          },
        });
      }

      console.log(`[scheduler:social] ${posts.length} posts générés (PENDING).`);
    } catch (err) {
      console.error("[scheduler:social] Échec génération :", err);
    }
  };

  /**
   * Job 5 : Publication des posts sociaux approuvés
   * Publie sur Twitter et LinkedIn les posts APPROVED dont l'heure est passée.
   */
  const runPublishSocialJob = async () => {
    try {
      const { prisma } = await import("@/lib/prisma");
      const { postTweet, postThread, isTwitterConfigured } = await import(
        "@/lib/social/twitter-client"
      );
      const { postLinkedIn, isLinkedInConfigured } = await import(
        "@/lib/social/linkedin-client"
      );

      const twitterReady = isTwitterConfigured();
      const linkedInReady = isLinkedInConfigured();
      if (!twitterReady && !linkedInReady) return;

      const now = new Date();
      const posts = await prisma.socialPost.findMany({
        where: { status: "APPROVED", scheduledAt: { lte: now } },
        orderBy: { scheduledAt: "asc" },
        take: 10,
      });

      if (posts.length === 0) return;

      let published = 0;
      for (const post of posts) {
        try {
          if (post.platform === "TWITTER") {
            if (!twitterReady) continue;
            let externalId: string;
            if (post.format === "THREAD" && post.threadParts.length > 0) {
              externalId = await postThread(post.threadParts);
            } else {
              externalId = await postTweet(post.content);
            }
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "PUBLISHED", publishedAt: new Date(), externalId },
            });
            published++;
          } else if (post.platform === "LINKEDIN") {
            if (!linkedInReady) continue;
            const externalId = await postLinkedIn(post.content);
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "PUBLISHED", publishedAt: new Date(), externalId },
            });
            published++;
          } else {
            // Threads, Instagram — phase 3
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "FAILED" },
            });
            continue;
          }

          // Pause 1s entre les posts pour les rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Erreur inconnue";
          console.error(`[scheduler:publish] Erreur post ${post.id}:`, errMsg);

          const isPermanent = errMsg.includes("401") || errMsg.includes("400") || errMsg.includes("trop long") || errMsg.includes("expiré");

          if (isPermanent) {
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "FAILED" },
            });
          } else {
            const retryCount = (post.directorNote?.match(/\[retry:(\d+)\]/)?.[1] ?? "0");
            const count = parseInt(retryCount, 10) + 1;

            if (count >= 3) {
              await prisma.socialPost.update({
                where: { id: post.id },
                data: { status: "FAILED" },
              });
            } else {
              const retryAt = new Date(Date.now() + 30 * 60 * 1000);
              await prisma.socialPost.update({
                where: { id: post.id },
                data: {
                  scheduledAt: retryAt,
                  directorNote: `${post.directorNote || ""}[retry:${count}] ${errMsg}`.trim(),
                },
              });
            }
          }
        }
      }

      if (published > 0) {
        console.log(`[scheduler:publish] ${published}/${posts.length} posts publiés.`);
      }
    } catch (err) {
      console.error("[scheduler:publish] Échec publication :", err);
    }
  };

  /**
   * Job 6 : Récupération des métriques des posts sociaux publiés.
   * Met à jour impressions, likes, retweets, replies, clicks (7 derniers jours).
   */
  const runSocialAnalyticsJob = async () => {
    try {
      const { prisma } = await import("@/lib/prisma");
      const { getTweetMetrics, isTwitterConfigured } = await import(
        "@/lib/social/twitter-client"
      );
      const { getLinkedInMetrics, isLinkedInConfigured } = await import(
        "@/lib/social/linkedin-client"
      );

      const twitterReady = isTwitterConfigured();
      const linkedInReady = isLinkedInConfigured();
      if (!twitterReady && !linkedInReady) return;

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const posts = await prisma.socialPost.findMany({
        where: {
          status: "PUBLISHED",
          publishedAt: { gte: sevenDaysAgo },
          externalId: { not: null },
        },
        take: 50,
      });

      if (posts.length === 0) return;

      let updated = 0;
      for (const post of posts) {
        if (!post.externalId || post.externalId === "unknown") continue;
        try {
          if (post.platform === "TWITTER" && twitterReady) {
            const m = await getTweetMetrics(post.externalId);
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { impressions: m.impressions, likes: m.likes, retweets: m.retweets, replies: m.replies, clicks: m.urlClicks },
            });
            updated++;
          } else if (post.platform === "LINKEDIN" && linkedInReady) {
            const m = await getLinkedInMetrics(post.externalId);
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { impressions: m.impressions, likes: m.likes, replies: m.comments, retweets: m.shares, clicks: m.clicks },
            });
            updated++;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`[scheduler:analytics] Erreur metrics ${post.id}:`, err);
        }
      }

      if (updated > 0) {
        console.log(`[scheduler:analytics] ${updated} posts mis à jour.`);
      }
    } catch (err) {
      console.error("[scheduler:analytics] Échec récupération métriques :", err);
    }
  };

  /**
   * Orchestrateur : exécute les 6 jobs séquentiellement.
   * Séquentiel pour éviter de surcharger l'API IA avec des appels simultanés.
   */
  const runAllJobs = async () => {
    await runDailyContentJob();
    await runWeeklySeoJob();
    await runMonthlyPlanJob();
    await runDailySocialJob();
    await runPublishSocialJob();
    await runSocialAnalyticsJob();
  };

  // Premier check 30 secondes après le démarrage
  setTimeout(() => {
    runAllJobs();
    // Puis toutes les 15 minutes
    setInterval(runAllJobs, INTERVAL_MS);
  }, 30_000);

  console.log("[scheduler] Initialisé — daily + SEO blog + monthly plans + social media (check toutes les 15 min).");
}

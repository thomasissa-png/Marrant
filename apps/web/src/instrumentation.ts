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
        const scheduledAt = getOptimalScheduleTime(persona, i, post.platform as "TWITTER" | "LINKEDIN" | "INSTAGRAM");
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
            directorNote: post.directorValidated !== true
              ? "⚠️ Validation directeur échouée — review manuelle requise"
              : (post.directorScore ?? 0) < 9
                ? `⚠️ Score ${post.directorScore}/10 < 9 — review manuelle requise`
                : (post.directorNote ?? null),
            status: post.directorValidated === true && (post.directorScore ?? 0) >= 9
              ? "APPROVED"
              : "PENDING",
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
   * Job 5 : Publication des posts sociaux approuvés via Buffer
   * Publie les posts APPROVED dont l'heure est passée en passant par Buffer.
   */
  const runPublishSocialJob = async () => {
    try {
      const { prisma } = await import("@/lib/prisma");
      const {
        createBufferPost,
        createBufferThread,
        createBufferImagePost,
        isBufferConfigured,
        isChannelConfigured,
        BufferQueueFullError,
      } = await import("@/lib/social/buffer-client");
      type BufferPlatform = import("@/lib/social/buffer-client").BufferPlatform;

      if (!isBufferConfigured()) return;

      const now = new Date();
      // Même logique que publish-social cron : approvedBy OR directorScore >= 9
      const posts = await prisma.socialPost.findMany({
        where: {
          status: "APPROVED",
          scheduledAt: { lte: now },
          OR: [
            { approvedBy: { not: null } },
            { directorScore: { gte: 9 } },
          ],
        },
        orderBy: { scheduledAt: "asc" },
        take: 10,
      });

      // Demote any APPROVED posts with low/null scores back to PENDING
      // SAUF les posts approuvés manuellement par l'admin (approvedBy != null)
      await prisma.socialPost.updateMany({
        where: {
          status: "APPROVED",
          approvedBy: null,
          OR: [
            { directorScore: { lt: 9 } },
            { directorScore: null },
          ],
        },
        data: {
          status: "PENDING",
          directorNote: "⚠️ Rétrogradé APPROVED→PENDING — score directeur < 9/10",
        },
      });

      if (posts.length === 0) return;

      // Helper pour découper tweets trop longs en thread
      function splitIntoTweetThread(text: string): string[] {
        const MAX = 280;
        if (text.length <= MAX) return [text];
        const parts: string[] = [];
        const paragraphs = text.split(/\n\n+/).filter(Boolean);
        let current = "";
        for (const para of paragraphs) {
          if (current && (current + "\n\n" + para).length > MAX) {
            parts.push(current.trim());
            current = para;
          } else {
            current = current ? current + "\n\n" + para : para;
          }
        }
        if (current.trim()) parts.push(current.trim());
        const result: string[] = [];
        for (const part of parts) {
          if (part.length <= MAX) { result.push(part); continue; }
          const sentences = part.split(/(?<=[.!?])\s+/);
          let chunk = "";
          for (const sentence of sentences) {
            if (chunk && (chunk + " " + sentence).length > MAX) {
              result.push(chunk.trim());
              chunk = sentence;
            } else {
              chunk = chunk ? chunk + " " + sentence : sentence;
            }
          }
          if (chunk.trim()) result.push(chunk.trim());
        }
        return result;
      }

      function getBaseUrl(): string {
        if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
        if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
        return `http://localhost:${process.env.PORT || "3000"}`;
      }

      let published = 0;
      const queueFullPlatforms = new Set<string>();
      for (const post of posts) {
        try {
          const platform = post.platform as BufferPlatform;

          if (queueFullPlatforms.has(platform)) continue;
          if (!isChannelConfigured(platform)) continue;

          let externalId: string;

          if (platform === "TWITTER" && post.format === "THREAD" && post.threadParts.length > 0) {
            externalId = await createBufferThread(post.threadParts, post.scheduledAt || undefined);
          } else if (platform === "TWITTER" && post.content.length > 270) {
            // Safety net : tweet trop long → auto-split en thread
            console.warn(`[scheduler:publish] Tweet ${post.id} trop long (${post.content.length} chars) — auto-split`);
            const parts = splitIntoTweetThread(post.content);
            externalId = await createBufferThread(parts, post.scheduledAt || undefined);
          } else if (platform === "INSTAGRAM") {
            // Utilise l'image Object Storage si disponible, sinon fallback URL dynamique
            const imageUrl = post.imageUrl
              ? post.imageUrl
              : `${getBaseUrl()}/api/social/image?postId=${post.id}`;
            const hashtags = post.hashtags.length > 0 ? post.hashtags.join(" ") : undefined;
            externalId = await createBufferImagePost(platform, post.content, imageUrl, post.scheduledAt || undefined, hashtags);
          } else {
            externalId = await createBufferPost(platform, post.content, post.scheduledAt || undefined);
          }

          await prisma.socialPost.update({
            where: { id: post.id },
            data: { status: "PUBLISHED", publishedAt: new Date(), externalId },
          });
          published++;

          // Pause 500ms entre les posts pour les rate limits
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : "Erreur inconnue";
          console.error(`[scheduler:publish] Erreur post ${post.id}:`, errMsg);

          // Queue Buffer pleine → repousser de 2h et skip cette plateforme
          if (error instanceof BufferQueueFullError) {
            const retryAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { scheduledAt: retryAt },
            });
            queueFullPlatforms.add(post.platform);
            console.warn(`[scheduler:publish] Queue pleine ${post.platform} — post ${post.id} reporté de 2h`);
            continue;
          }

          // Cohérent avec publish-social/route.ts
          const isPermanent =
            /\b(401|403|400)\b/.test(errMsg) ||
            errMsg.includes("trop long") ||
            errMsg.includes("expiré") ||
            errMsg.includes("invalide") ||
            errMsg.includes("invalid") ||
            errMsg.includes("unauthorized") ||
            errMsg.includes("forbidden") ||
            errMsg.includes("not found") ||
            errMsg.includes("MutationError");

          if (isPermanent) {
            await prisma.socialPost.update({
              where: { id: post.id },
              data: { status: "FAILED" },
            });
          } else {
            const retryMatch = post.directorNote?.match(/\[retry:(\d+)\]$/);
            const currentRetries = retryMatch ? parseInt(retryMatch[1], 10) : 0;
            const newRetryCount = currentRetries + 1;

            if (newRetryCount >= 3) {
              await prisma.socialPost.update({
                where: { id: post.id },
                data: { status: "FAILED" },
              });
            } else {
              const retryNote = post.directorNote
                ? post.directorNote.replace(/\s*\[retry:\d+\]$/, "") + ` [retry:${newRetryCount}]`
                : `[retry:${newRetryCount}]`;
              const retryAt = new Date(Date.now() + 30 * 60 * 1000);
              await prisma.socialPost.update({
                where: { id: post.id },
                data: {
                  scheduledAt: retryAt,
                  directorNote: retryNote,
                },
              });
            }
          }
        }
      }

      if (published > 0) {
        console.log(`[scheduler:publish] ${published}/${posts.length} posts publiés via Buffer.`);
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

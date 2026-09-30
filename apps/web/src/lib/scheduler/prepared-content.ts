/**
 * Contenu PRÉPARÉ À L'AVANCE (décision fondateur du 30/09/2026, s14).
 *
 * Interrupteur `CONTENT_GENERATION_ENABLED` (wrangler.jsonc, défaut "false") :
 * tant qu'il ne vaut pas "true", daily-content, weekly-seo, monthly-plan et
 * monthly-videos n'appellent AUCUN LLM. Le calendrier (DailyContent datés,
 * articles planifiés) est rempli en base à l'avance ; ce module ne fait que
 * combler un trou, de façon déterministe et sans IA.
 */
import { prisma } from "@/lib/prisma";
import { getDayOfYear } from "@/lib/ai/date-utils";
import { buildJobLockKey, releaseLock, tryAcquireLock } from "@/lib/job-lock";
import { revalidateBlogPaths } from "@/lib/blog-revalidate";
import { submitToIndexNow } from "@/lib/indexnow";

export function isContentGenerationEnabled(): boolean {
  return process.env.CONTENT_GENERATION_ENABLED?.trim() === "true";
}

type StockResult =
  | { status: "exists" }
  | { status: "created"; jokeId: string; tipId: string; videoId: string | null }
  | { status: "missing-stock"; missing: string[] };

/** Choix déterministe (même jour → même élément) parmi `count` candidats triés par id. */
function pickSkip(count: number, dayOfYear: number): number {
  return count > 0 ? dayOfYear % count : 0;
}

/**
 * Vérifie que le DailyContent de `today` existe ; sinon le crée depuis le stock
 * validé : vanne active + copyVerdict GARDER + décryptage (jamais utilisée en
 * DailyContent si possible), conseil actif, vidéo active. Aucun LLM.
 */
export async function ensureDailyContentFromStock(today: Date): Promise<StockResult> {
  const existing = await prisma.dailyContent.findUnique({ where: { date: today } });
  if (existing) return { status: "exists" };

  const day = getDayOfYear(today);

  const validatedJoke = {
    isActive: true,
    copyVerdict: "GARDER",
    comedyTechnique: { not: null },
    howToApply: { not: null },
  };
  const pickJoke = async (neverUsed: boolean) => {
    const where = neverUsed ? { ...validatedJoke, dailyContents: { none: {} } } : validatedJoke;
    const count = await prisma.joke.count({ where });
    if (count === 0) return null;
    return prisma.joke.findFirst({ where, orderBy: { id: "asc" }, skip: pickSkip(count, day), select: { id: true } });
  };
  const joke = (await pickJoke(true)) ?? (await pickJoke(false));

  const pickActive = async (model: "tip" | "video", neverUsed: boolean) => {
    const where = neverUsed ? { isActive: true, dailyContents: { none: {} } } : { isActive: true };
    const delegate = prisma[model] as unknown as {
      count(args: { where: object }): Promise<number>;
      findFirst(args: object): Promise<{ id: string } | null>;
    };
    const count = await delegate.count({ where });
    if (count === 0) return null;
    return delegate.findFirst({ where, orderBy: { id: "asc" }, skip: pickSkip(count, day), select: { id: true } });
  };
  const tip = (await pickActive("tip", true)) ?? (await pickActive("tip", false));
  const video = (await pickActive("video", true)) ?? (await pickActive("video", false));

  if (!joke || !tip) {
    const missing = [!joke && "vanne GARDER avec décryptage", !tip && "conseil actif"].filter(Boolean) as string[];
    console.error(`[prepared-content] DailyContent du ${today.toISOString().slice(0, 10)} impossible : stock vide (${missing.join(", ")}).`);
    return { status: "missing-stock", missing };
  }

  try {
    await prisma.dailyContent.create({
      data: { date: today, jokeId: joke.id, tipId: tip.id, videoId: video?.id ?? null },
    });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2002") return { status: "exists" };
    throw err;
  }
  console.warn(
    `[prepared-content] DailyContent du ${today.toISOString().slice(0, 10)} absent du calendrier : créé depuis le stock validé (sans IA).`,
  );
  return { status: "created", jokeId: joke.id, tipId: tip.id, videoId: video?.id ?? null };
}

/** Lundi 00:00 UTC de la semaine ISO de `now`. */
export function startOfIsoWeekUtc(now: Date): Date {
  const dayNum = now.getUTCDay() || 7;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (dayNum - 1)));
}

/** Clé du verrou de publication (TTL court : la bascule prend quelques ms). */
const PUBLISH_LOCK_TTL_MS = 5 * 60 * 1000;

/**
 * Publie les articles PLANIFIÉS échus (publication programmée, s14). Aucun LLM.
 *
 * Un article planifié est stocké en base avec `isPublished=false` et
 * `publishedAt` = date/heure prévue (import : scripts/content/import-article.ts,
 * lundi 05:00 UTC par défaut). Le site filtre sur `isPublished` (et, par
 * garde-fou, sur `publishedAt <= now`, voir lib/blog-visibility.ts).
 *
 * Appelé à CHAQUE tick du scheduler (15 min) et par le cron HTTP weekly-seo :
 *  - borné à la semaine ISO en cours : un article retiré (publishedAt ancien,
 *    isPublished=false) n'est jamais republié ;
 *  - verrou `JobLock` quotidien (lib/job-lock) pris seulement s'il y a un
 *    article échu : zéro écriture en base les autres ticks ;
 *  - bascule par compare-and-set (`isPublished: false` dans le where) : un
 *    seul processus « gagne » chaque article, donc une seule revalidation et
 *    un seul ping IndexNow, même en cas de course. Idempotent.
 * Pas de plafond de tentatives : l'opération est gratuite (pas de LLM) et un
 * échec base doit être retenté au tick suivant.
 *
 * @returns slugs publiés par CET appel.
 */
export async function publishDueScheduledArticles(now: Date = new Date()): Promise<string[]> {
  const due = await prisma.blogArticle.findMany({
    where: { isPublished: false, publishedAt: { gte: startOfIsoWeekUtc(now), lte: now } },
    select: { id: true, slug: true },
    orderBy: { publishedAt: "asc" },
  });
  if (due.length === 0) return [];

  const lockKey = buildJobLockKey("publish-scheduled-articles", now);
  if (!(await tryAcquireLock(lockKey, PUBLISH_LOCK_TTL_MS))) return [];

  const published: string[] = [];
  try {
    for (const article of due) {
      const { count } = await prisma.blogArticle.updateMany({
        where: { id: article.id, isPublished: false },
        data: { isPublished: true },
      });
      if (count === 1) published.push(article.slug);
    }
  } finally {
    await releaseLock(lockKey);
  }
  if (published.length === 0) return [];

  console.log(`[prepared-content] Article(s) planifié(s) publié(s) : ${published.join(", ")}.`);
  revalidateBlogPaths(published);
  await submitToIndexNow([...published.map((slug) => `/blog/${slug}`), "/blog", "/sitemap.xml"]);
  return published;
}

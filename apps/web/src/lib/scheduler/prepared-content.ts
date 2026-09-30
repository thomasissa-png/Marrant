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

/**
 * Publie l'article PLANIFIÉ de la semaine : BlogArticle déjà en base avec
 * `isPublished=false` et `publishedAt` dans la semaine ISO en cours, échu.
 * Le site filtre sur `isPublished` (pas sur `publishedAt`) : un article
 * planifié doit donc être stocké NON publié avec sa date prévue.
 * Borné à la semaine en cours : les articles retirés (publishedAt ancien,
 * isPublished=false) ne sont jamais republiés. Aucun LLM.
 */
export async function publishDueScheduledArticles(now: Date = new Date()): Promise<number> {
  const { count } = await prisma.blogArticle.updateMany({
    where: { isPublished: false, publishedAt: { gte: startOfIsoWeekUtc(now), lte: now } },
    data: { isPublished: true },
  });
  if (count > 0) console.log(`[prepared-content] ${count} article(s) planifié(s) publié(s).`);
  return count;
}

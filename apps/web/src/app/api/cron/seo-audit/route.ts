import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { blogArticles } from "@/lib/blog-articles";

export const dynamic = "force-dynamic";

/**
 * Cron hebdomadaire audit SEO — vérifie le maillage interne et réconcilie plan/DB.
 * Déclenchement recommandé : mercredi 10h UTC.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const results = {
      linkAudit: await auditInternalLinks(),
      planReconciliation: await reconcilePlanWithDB(),
    };

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("[Cron SEO Audit] Erreur:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'audit SEO",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

/**
 * Audit internal linking — checks that each article has minimum 5 internal links.
 */
async function auditInternalLinks() {
  const warnings: string[] = [];

  // Check static articles
  for (const article of blogArticles) {
    const linkMatches = article.content.match(/\]\(\//g) || [];
    const linkCount = linkMatches.length;
    if (linkCount < 5) {
      warnings.push(
        `[Static] "${article.slug}" has ${linkCount} internal links (min: 5)`,
      );
    }
  }

  // Check DB articles
  let dbArticles: { slug: string; content: string }[] = [];
  try {
    dbArticles = await prisma.blogArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, content: true },
    });
  } catch {}

  for (const article of dbArticles) {
    const linkMatches = article.content.match(/\]\(\//g) || [];
    const linkCount = linkMatches.length;
    if (linkCount < 5) {
      warnings.push(
        `[DB] "${article.slug}" has ${linkCount} internal links (min: 5)`,
      );
    }
  }

  if (warnings.length > 0) {
    console.warn("[SEO Audit] Internal linking issues:", warnings);
  } else {
    console.log("[SEO Audit] All articles meet minimum 5 internal links");
  }

  return {
    totalArticles: blogArticles.length + dbArticles.length,
    issues: warnings,
    healthy: warnings.length === 0,
  };
}

/**
 * Reconcile editorial plan with actual DB — checks that "published" articles
 * in seo-editorial-plan.json actually exist.
 */
async function reconcilePlanWithDB() {
  let editorialPlan: { plannedArticles?: { slug: string; status: string; publishedDate?: string }[] } = {};
  try {
    const planPath = join(process.cwd(), "../../seo-editorial-plan.json");
    editorialPlan = JSON.parse(readFileSync(planPath, "utf-8"));
  } catch {
    return { error: "Could not load seo-editorial-plan.json" };
  }

  const planned = editorialPlan.plannedArticles || [];
  const publishedInPlan = planned.filter((a) => a.status === "published");
  const missing: string[] = [];

  for (const article of publishedInPlan) {
    // Check static articles
    const inStatic = blogArticles.some((a) => a.slug === article.slug);
    if (inStatic) continue;

    // Check DB
    try {
      const inDB = await prisma.blogArticle.findUnique({
        where: { slug: article.slug },
        select: { slug: true, isPublished: true },
      });
      if (!inDB || !inDB.isPublished) {
        missing.push(article.slug);
      }
    } catch {
      missing.push(article.slug);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `[SEO Audit] ${missing.length} articles marked as "published" in plan but missing from DB:`,
      missing,
    );
  } else {
    console.log("[SEO Audit] All published articles in plan exist in DB");
  }

  return {
    publishedInPlan: publishedInPlan.length,
    missingFromDB: missing,
    healthy: missing.length === 0,
  };
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogArticles } from "@/lib/blog-articles";
import { BLOG_CLUSTERS } from "@/lib/blog-clusters";

export const dynamic = "force-dynamic";

/**
 * Cron mensuel rapport SEO — génère un rapport complet de l'état SEO du site.
 * Déclenchement recommandé : 1er du mois à 10h UTC.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const report = await generateSeoReport();
    console.log("[SEO Report]", JSON.stringify(report, null, 2));
    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("[Cron SEO Report] Erreur:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la génération du rapport SEO",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

async function generateSeoReport() {
  // 1. Article counts
  let dbArticleCount = 0;
  let dbArticles: { slug: string; content: string; publishedAt: Date | null; targetKeyword: string }[] = [];
  try {
    dbArticles = await prisma.blogArticle.findMany({
      where: { isPublished: true },
      select: { slug: true, content: true, publishedAt: true, targetKeyword: true },
    });
    dbArticleCount = dbArticles.length;
  } catch {}

  const totalArticles = blogArticles.length + dbArticleCount;

  // 2. Cluster coverage
  const allSlugs = new Set([
    ...blogArticles.map((a) => a.slug),
    ...dbArticles.map((a) => a.slug),
  ]);

  const clusterCoverage = BLOG_CLUSTERS.map((cluster) => {
    const allClusterSlugs = [cluster.pillarSlug, ...cluster.satelliteSlugs];
    const coveredSlugs = allClusterSlugs.filter((s) => allSlugs.has(s));
    return {
      cluster: cluster.id,
      name: cluster.name,
      total: allClusterSlugs.length,
      covered: coveredSlugs.length,
      missing: allClusterSlugs.filter((s) => !allSlugs.has(s)),
      hasPillar: allSlugs.has(cluster.pillarSlug),
      coverage: Math.round((coveredSlugs.length / allClusterSlugs.length) * 100),
    };
  });

  // 3. Internal linking health
  const linkingIssues: string[] = [];
  for (const article of blogArticles) {
    const linkCount = (article.content.match(/\]\(\//g) || []).length;
    if (linkCount < 5) {
      linkingIssues.push(`${article.slug}: ${linkCount} links`);
    }
  }
  for (const article of dbArticles) {
    const linkCount = (article.content.match(/\]\(\//g) || []).length;
    if (linkCount < 5) {
      linkingIssues.push(`${article.slug}: ${linkCount} links`);
    }
  }

  // 4. Content stats
  const allContents = [
    ...blogArticles.map((a) => ({ slug: a.slug, content: a.content })),
    ...dbArticles.map((a) => ({ slug: a.slug, content: a.content })),
  ];
  const avgWordCount = allContents.length > 0
    ? Math.round(
        allContents.reduce((sum, a) => sum + a.content.split(/\s+/).length, 0) / allContents.length,
      )
    : 0;

  // 5. Keyword coverage
  const coveredKeywords = new Set([
    ...blogArticles.map((a) => a.slug),
    ...dbArticles.map((a) => a.targetKeyword),
  ]);

  // 6. Publishing frequency (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentArticles = dbArticles.filter(
    (a) => a.publishedAt && a.publishedAt > thirtyDaysAgo,
  ).length;

  return {
    date: new Date().toISOString().split("T")[0],
    summary: {
      totalArticles,
      staticArticles: blogArticles.length,
      dbArticles: dbArticleCount,
      avgWordCount,
      articlesLast30Days: recentArticles,
    },
    clusters: {
      total: BLOG_CLUSTERS.length,
      coverage: clusterCoverage,
      overallCoverage: Math.round(
        (clusterCoverage.reduce((s, c) => s + c.coverage, 0) / BLOG_CLUSTERS.length),
      ),
    },
    internalLinking: {
      issueCount: linkingIssues.length,
      issues: linkingIssues,
      healthy: linkingIssues.length === 0,
    },
    keywords: {
      covered: coveredKeywords.size,
    },
  };
}

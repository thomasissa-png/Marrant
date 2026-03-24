import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFileSync } from "fs";
import { resolve } from "path";

function verifyAdmin(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${adminPassword}`;
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * GET /api/admin/planning — Vue consolidée de tous les plannings.
 * Retourne : blog articles, social posts, daily content (vannes/conseils/vidéos).
 */
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const now = new Date();
    const currentWeek = getISOWeekNumber(now);

    // ─── 1. Blog editorial plan ─────────────────────────────────
    let blogPlan: Array<{
      id: number;
      slug: string;
      title: string;
      category: string;
      type: string;
      scheduledWeek: number;
      status: string;
      publishedDate?: string;
      cluster?: string;
    }> = [];
    try {
      const planPath = resolve(process.cwd(), "seo-editorial-plan.json");
      const plan = JSON.parse(readFileSync(planPath, "utf-8"));
      blogPlan = (plan.plannedArticles ?? []).map((a: Record<string, unknown>) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        category: a.category,
        type: a.type,
        scheduledWeek: a.scheduledWeek,
        status: a.status,
        publishedDate: a.publishedDate,
        cluster: a.cluster,
      }));
    } catch {
      // Plan file not available — return empty
    }

    // ─── 2. Social posts (last 30 days + upcoming) ──────────────
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const socialPosts = await prisma.socialPost.findMany({
      where: {
        OR: [
          { scheduledAt: { gte: thirtyDaysAgo } },
          { status: { in: ["PENDING", "APPROVED"] } },
        ],
      },
      select: {
        id: true,
        platform: true,
        format: true,
        hook: true,
        targetPersona: true,
        status: true,
        directorScore: true,
        scheduledAt: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: { scheduledAt: "asc" },
      take: 200,
    });

    // ─── 3. Daily content (last 14 days + today) ────────────────
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const dailyContent = await prisma.dailyContent.findMany({
      where: { date: { gte: fourteenDaysAgo } },
      include: {
        joke: { select: { id: true, category: true, content: true } },
        tip: { select: { id: true, title: true, category: true } },
        video: { select: { id: true, title: true, channelName: true } },
      },
      orderBy: { date: "desc" },
      take: 30,
    });

    // ─── 4. SEO calendar ────────────────────────────────────────
    const seoCalendar = await prisma.seoCalendar.findMany({
      where: { year: now.getFullYear() },
      orderBy: { weekNumber: "asc" },
      select: {
        weekNumber: true,
        year: true,
        targetKeyword: true,
        articleTitle: true,
        status: true,
      },
    });

    // ─── 5. Content plans (monthly plans for joke/tip/video agents) ──
    const contentPlans = await prisma.contentPlan.findMany({
      where: {
        year: now.getFullYear(),
        month: { gte: now.getMonth() }, // current month onwards
      },
      include: {
        entries: {
          select: {
            dayOfMonth: true,
            category: true,
            theme: true,
            status: true,
          },
          orderBy: { dayOfMonth: "asc" },
        },
      },
      orderBy: [{ month: "asc" }, { agentType: "asc" }],
    });

    // ─── 6. Summary stats ───────────────────────────────────────
    const blogStats = {
      total: blogPlan.length,
      published: blogPlan.filter((a) => a.status === "published").length,
      planned: blogPlan.filter((a) => a.status === "planned").length,
      overdue: blogPlan.filter(
        (a) => a.status === "planned" && a.scheduledWeek < currentWeek
      ).length,
    };

    const socialStats = {
      total: socialPosts.length,
      pending: socialPosts.filter((p) => p.status === "PENDING").length,
      approved: socialPosts.filter((p) => p.status === "APPROVED").length,
      published: socialPosts.filter((p) => p.status === "PUBLISHED").length,
      failed: socialPosts.filter((p) => p.status === "FAILED").length,
    };

    const todayStr = now.toISOString().split("T")[0];
    const todayContent = dailyContent.find(
      (d) => d.date.toISOString().split("T")[0] === todayStr
    );

    return NextResponse.json({
      currentWeek,
      blogPlan,
      blogStats,
      socialPosts: socialPosts.map((p) => ({
        ...p,
        scheduledAt: p.scheduledAt?.toISOString() ?? null,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        createdAt: p.createdAt.toISOString(),
      })),
      socialStats,
      dailyContent: dailyContent.map((d) => ({
        date: d.date.toISOString().split("T")[0],
        joke: d.joke ? { id: d.joke.id, category: d.joke.category, preview: d.joke.content.slice(0, 80) } : null,
        tip: d.tip ? { id: d.tip.id, title: d.tip.title, category: d.tip.category } : null,
        video: d.video ? { id: d.video.id, title: d.video.title, channel: d.video.channelName } : null,
      })),
      hasTodayContent: !!todayContent,
      seoCalendar,
      contentPlans: contentPlans.map((cp) => ({
        agentType: cp.agentType,
        month: cp.month,
        year: cp.year,
        entries: cp.entries,
      })),
    });
  } catch (error) {
    console.error("[Admin Planning] Error:", error);
    return NextResponse.json(
      { error: "Erreur chargement planning", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

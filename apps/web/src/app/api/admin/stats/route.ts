import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      premiumUsers,
      freeUsers,
      usersLast7d,
      usersLast30d,
      activeSubscriptions,
      canceledSubscriptions,
      pastDueSubscriptions,
      jokes,
      tips,
      videos,
      paths,
      favorites,
      totalXp,
      socialPendingCount,
      socialFailedCount,
      socialPendingPosts,
      todayDailyContent,
      recentBlogArticle,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: "PREMIUM" } }),
      prisma.user.count({ where: { plan: "FREE" } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.count({ where: { status: "CANCELED" } }),
      prisma.subscription.count({ where: { status: "PAST_DUE" } }),
      prisma.joke.count(),
      prisma.tip.count(),
      prisma.video.count(),
      prisma.learningPath.count(),
      prisma.userFavorite.count(),
      prisma.user.aggregate({ _sum: { xp: true } }),
      // Content quality alerts — Social
      prisma.socialPost.count({ where: { status: "PENDING" } }),
      prisma.socialPost.count({ where: { status: "FAILED" } }),
      prisma.socialPost.findMany({
        where: { status: { in: ["PENDING", "FAILED"] } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          platform: true,
          format: true,
          hook: true,
          content: true,
          directorScore: true,
          directorNote: true,
          status: true,
          createdAt: true,
        },
      }),
      // Content quality alerts — Daily content (joke + tip + video)
      prisma.dailyContent.findFirst({
        where: {
          date: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          },
        },
        select: {
          id: true,
          jokeId: true,
          tipId: true,
          videoId: true,
        },
      }),
      // Content quality alerts — Blog (last article in 7 days)
      prisma.blogArticle.findFirst({
        where: {
          isPublished: true,
          publishedAt: { gte: sevenDaysAgo },
        },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
        },
      }),
    ]);

    const conversionRate = totalUsers > 0
      ? ((premiumUsers / totalUsers) * 100).toFixed(1)
      : "0.0";

    // MRR = abonnements actifs * 0.99€
    const mrr = (activeSubscriptions * 0.99).toFixed(2);

    return NextResponse.json({
      // KPIs business
      totalUsers,
      premiumUsers,
      freeUsers,
      conversionRate,
      mrr,
      usersLast7d,
      usersLast30d,
      // Subscriptions
      activeSubscriptions,
      canceledSubscriptions,
      pastDueSubscriptions,
      // Content
      jokes,
      tips,
      videos,
      paths,
      favorites,
      // Engagement
      totalXp: totalXp._sum.xp ?? 0,
      // Content quality alerts
      socialPendingCount,
      socialFailedCount,
      socialPendingPosts,
      // Daily content alerts
      dailyContentMissing: {
        joke: !todayDailyContent?.jokeId,
        tip: !todayDailyContent?.tipId,
        video: !todayDailyContent?.videoId,
        noDailyContent: !todayDailyContent,
      },
      // Blog alerts
      blogAlert: !recentBlogArticle
        ? { missing: true, message: "Aucun article blog publié depuis 7 jours" }
        : { missing: false, lastArticle: recentBlogArticle },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des stats" },
      { status: 500 }
    );
  }
}

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
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des stats" },
      { status: 500 }
    );
  }
}

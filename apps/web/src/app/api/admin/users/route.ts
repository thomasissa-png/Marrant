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
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)));
    const filter = searchParams.get("filter") ?? "all"; // all, premium, free
    const sort = searchParams.get("sort") ?? "recent"; // recent, oldest, xp, streak
    const search = searchParams.get("q") ?? "";

    // Build where clause
    const where: Record<string, unknown> = {};
    if (filter === "premium") where.plan = "PREMIUM";
    if (filter === "free") where.plan = "FREE";
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    const orderByMap: Record<string, Record<string, string>> = {
      recent: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      xp: { xp: "desc" },
      streak: { streak: "desc" },
    };
    const orderBy = orderByMap[sort] ?? orderByMap.recent;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          level: true,
          xp: true,
          streak: true,
          lastActiveAt: true,
          createdAt: true,
          subscription: {
            select: {
              status: true,
              stripeCustomerId: true,
              stripeSubscriptionId: true,
              currentPeriodEnd: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              jokeLikes: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des utilisateurs" },
      { status: 500 }
    );
  }
}

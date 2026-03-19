import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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

/**
 * PATCH /api/admin/users — Synchroniser le plan d'un utilisateur avec Stripe
 * Body: { userId: string }
 * Vérifie directement auprès de Stripe si l'utilisateur a un abonnement actif
 */
export async function PATCH(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré" }, { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: { userId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }

  const { userId } = body;
  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, plan: true, subscription: { select: { stripeCustomerId: true, stripeSubscriptionId: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Chercher le customer Stripe par email
    const customers = await stripe.customers.list({ email: user.email ?? "", limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json({ error: "Aucun customer Stripe trouvé", plan: user.plan });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "active", limit: 1 });

    if (subscriptions.data.length === 0) {
      // Pas d'abonnement actif — s'assurer que le plan est FREE
      if (user.plan === "PREMIUM") {
        await prisma.user.update({ where: { id: userId }, data: { plan: "FREE" } });
        return NextResponse.json({ plan: "FREE", synced: true, message: "Aucun abonnement actif — plan corrigé à FREE" });
      }
      return NextResponse.json({ plan: "FREE", synced: false, message: "Aucun abonnement actif Stripe" });
    }

    const sub = subscriptions.data[0];

    // Mettre à jour la DB avec les infos Stripe
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { plan: "PREMIUM" },
      }),
      prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan: "PREMIUM",
          stripeCustomerId: customer.id,
          stripeSubscriptionId: sub.id,
          status: "ACTIVE",
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
        update: {
          plan: "PREMIUM",
          stripeCustomerId: customer.id,
          stripeSubscriptionId: sub.id,
          status: "ACTIVE",
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      }),
    ]);

    console.log(`[Admin] User ${userId} synced to PREMIUM from Stripe`);
    return NextResponse.json({ plan: "PREMIUM", synced: true, message: "Plan synchronisé avec Stripe" });
  } catch (error) {
    console.error("[Admin] Erreur sync plan:", error);
    return NextResponse.json({ error: "Erreur de synchronisation" }, { status: 500 });
  }
}

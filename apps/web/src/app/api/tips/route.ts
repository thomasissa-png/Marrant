import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { dedupeTipsByTitle } from "@/lib/tips-dedupe";
import { FREE_TIP_LIMIT } from "@/config/premium";

const querySchema = z.object({
  category: z.string().optional(),
  difficulty: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = querySchema.parse({
      category: searchParams.get("category") ?? undefined,
      difficulty: searchParams.get("difficulty") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      page: searchParams.get("page") ?? 1,
      limit: searchParams.get("limit") ?? 10,
    });

    // Vérifier le plan de l'utilisateur
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    let isPremium = false;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true },
      });
      isPremium = user?.plan === "PREMIUM";
    }

    const where = {
      isActive: true,
      ...(query.category && { category: query.category as never }),
      ...(query.difficulty && { difficulty: query.difficulty as never }),
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" as const } },
          { content: { contains: query.q, mode: "insensitive" as const } },
        ],
      }),
    };

    // Conseils au titre identique en base : dédoublonnés ici, pas en base (N12 s12,
    // même schéma que les vannes). Pagination sur la liste dédoublonnée.
    const orderBy = [{ createdAt: "desc" as const }, { id: "asc" as const }];
    const candidates = await prisma.tip.findMany({
      where,
      select: { id: true, title: true },
      orderBy,
    });
    const uniqueIds = dedupeTipsByTitle(candidates).map((c) => c.id);
    const total = uniqueIds.length;

    // FREE : limiter le total accessible
    const accessibleTotal = isPremium ? total : Math.min(total, FREE_TIP_LIMIT);
    const effectiveLimit = Math.min(query.limit, accessibleTotal - (query.page - 1) * query.limit);

    if (effectiveLimit <= 0 && !isPremium) {
      return NextResponse.json({
        tips: [],
        pagination: {
          page: query.page,
          limit: query.limit,
          total: accessibleTotal,
          totalPages: Math.ceil(accessibleTotal / query.limit),
        },
        limited: true,
        totalReal: total,
        upgradeMessage: "Abonne-toi pour accéder à tous les conseils",
      });
    }

    const start = (query.page - 1) * query.limit;
    const pageIds = uniqueIds.slice(start, start + (isPremium ? query.limit : Math.max(0, effectiveLimit)));
    const tips = pageIds.length
      ? await prisma.tip.findMany({ where: { id: { in: pageIds } }, orderBy })
      : [];

    return NextResponse.json({
      tips,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: accessibleTotal,
        totalPages: Math.ceil(accessibleTotal / query.limit),
      },
      limited: !isPremium,
      totalReal: total,
      ...((!isPremium && total > FREE_TIP_LIMIT) ? { upgradeMessage: `${total - FREE_TIP_LIMIT} conseils supplémentaires avec l'abonnement` } : {}),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

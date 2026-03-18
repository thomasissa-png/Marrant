import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

    // Limites gratuites : 25 vidéos max pour les FREE
    const FREE_VIDEO_LIMIT = 25;

    const where = {
      isActive: true,
      ...(query.category && { category: query.category as never }),
      ...(query.difficulty && { difficulty: query.difficulty as never }),
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" as const } },
          { channelName: { contains: query.q, mode: "insensitive" as const } },
          { description: { contains: query.q, mode: "insensitive" as const } },
        ],
      }),
    };

    const total = await prisma.video.count({ where });

    // FREE : limiter le total accessible
    const accessibleTotal = isPremium ? total : Math.min(total, FREE_VIDEO_LIMIT);
    const effectiveLimit = Math.min(query.limit, accessibleTotal - (query.page - 1) * query.limit);

    if (effectiveLimit <= 0 && !isPremium) {
      return NextResponse.json({
        videos: [],
        pagination: {
          page: query.page,
          limit: query.limit,
          total: accessibleTotal,
          totalPages: Math.ceil(accessibleTotal / query.limit),
        },
        limited: true,
        upgradeMessage: "Abonne-toi pour accéder à toutes les vidéos",
      });
    }

    const videos = await prisma.video.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: isPremium ? query.limit : Math.max(0, effectiveLimit),
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    });

    return NextResponse.json({
      videos,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: accessibleTotal,
        totalPages: Math.ceil(accessibleTotal / query.limit),
      },
      limited: !isPremium,
      ...((!isPremium && total > FREE_VIDEO_LIMIT) ? { upgradeMessage: `${total - FREE_VIDEO_LIMIT} vidéos supplémentaires avec l'abonnement` } : {}),
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

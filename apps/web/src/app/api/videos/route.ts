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

    // Limites gratuites : 3 vidéos max pour les FREE
    const FREE_VIDEO_LIMIT = 3;

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
        totalReal: total,
        upgradeMessage: "Abonne-toi pour accéder à toutes les vidéos",
      });
    }

    // Récupérer la vidéo du jour pour la placer en premier (comme vannes et conseils)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const dailyContent = await prisma.dailyContent.findUnique({
      where: { date: today },
      select: { videoId: true },
    });
    const dailyVideoId = dailyContent?.videoId ?? null;

    const videos = await prisma.video.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: isPremium ? query.limit : Math.max(0, effectiveLimit),
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    });

    // Placer la vidéo du jour en premier sur la page 1
    if (dailyVideoId && query.page === 1) {
      const dailyIdx = videos.findIndex((v) => v.id === dailyVideoId);
      if (dailyIdx > 0) {
        // La vidéo du jour est dans la liste mais pas en premier → la remonter
        const [daily] = videos.splice(dailyIdx, 1);
        videos.unshift(daily);
      } else if (dailyIdx === -1) {
        // La vidéo du jour n'est pas dans la page (filtres ou pagination)
        // La chercher et l'ajouter en premier
        const dailyVideo = await prisma.video.findFirst({
          where: { id: dailyVideoId, isActive: true, ...where },
        });
        if (dailyVideo) {
          videos.unshift(dailyVideo);
          videos.pop(); // Garder la même taille de page
        }
      }
    }

    return NextResponse.json({
      videos,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: accessibleTotal,
        totalPages: Math.ceil(accessibleTotal / query.limit),
      },
      limited: !isPremium,
      totalReal: total,
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

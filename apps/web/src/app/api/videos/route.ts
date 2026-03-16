import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { selectSlidingFreeItems, insertDailyFirst } from "@/lib/free-content";
import { todayUTC } from "@/lib/ai/date-utils";

const FREE_LIMIT = 25;

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

    // FREE / anonyme : fenêtre glissante + daily en premier
    if (!isPremium) {
      const total = await prisma.video.count({ where: { isActive: true } });

      const allVideos = await prisma.video.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
      });

      // Fenêtre glissante : avance de 1 par jour
      const sliding = selectSlidingFreeItems(allVideos, FREE_LIMIT);

      // Insérer la vidéo du jour en première position
      const daily = await prisma.dailyContent.findUnique({
        where: { date: todayUTC() },
        select: { videoId: true },
      });

      const rotated = insertDailyFirst(
        sliding,
        daily?.videoId,
        (video) => video.id,
        FREE_LIMIT
      );

      return NextResponse.json({
        videos: rotated,
        pagination: { page: 1, limit: FREE_LIMIT, total: rotated.length, totalPages: 1 },
        limited: true,
        totalAvailable: total,
      });
    }

    const where = {
      isActive: true,
      ...(query.category && { category: query.category as never }),
      ...(query.difficulty && { difficulty: query.difficulty as never }),
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" as const } },
          { comedian: { contains: query.q, mode: "insensitive" as const } },
        ],
      }),
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.video.count({ where }),
    ]);

    return NextResponse.json({
      videos,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      limited: false,
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

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { selectSlidingFreeItems } from "@/lib/free-content";

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

    // FREE / anonyme : rotation quotidienne, catégories bloquées
    if (!isPremium) {
      const total = await prisma.video.count({ where: { isActive: true } });

      // Fenêtre glissante : 1 vidéo remplacée par jour au lieu de tout changer
      const allVideos = await prisma.video.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
      });

      const rotated = selectSlidingFreeItems(
        allVideos,
        FREE_LIMIT,
        5381,
        (video) => video.category
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

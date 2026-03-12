import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getDayOfYear, todayUTC } from "@/lib/ai/date-utils";

const FREE_LIMIT = 5;

const querySchema = z.object({
  category: z.string().optional(),
  difficulty: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = querySchema.parse({
      category: searchParams.get("category") ?? undefined,
      difficulty: searchParams.get("difficulty") ?? undefined,
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
      const total = await prisma.tip.count({ where: { isActive: true } });

      const dayOfYear = getDayOfYear(todayUTC());
      const seed = dayOfYear * 6871;

      const allTips = await prisma.tip.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
      });

      const offset = seed % Math.max(allTips.length, 1);
      const rotated = [];
      for (let i = 0; i < Math.min(FREE_LIMIT, allTips.length); i++) {
        rotated.push(allTips[(offset + i) % allTips.length]);
      }

      return NextResponse.json({
        tips: rotated,
        pagination: { page: 1, limit: FREE_LIMIT, total: rotated.length, totalPages: 1 },
        limited: true,
        totalAvailable: total,
      });
    }

    const where = {
      isActive: true,
      ...(query.category && { category: query.category as never }),
      ...(query.difficulty && { difficulty: query.difficulty as never }),
    };

    const [tips, total] = await Promise.all([
      prisma.tip.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.tip.count({ where }),
    ]);

    return NextResponse.json({
      tips,
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

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const [user, pathProgress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          level: true,
          xp: true,
          streak: true,
          lastActiveAt: true,
          _count: {
            select: {
              favorites: true,
              jokeLikes: { where: { isLike: true } },
              pathProgress: { where: { completedAt: { not: null } } },
            },
          },
        },
      }),
      prisma.userPathProgress.findMany({
        where: { userId },
        select: { completedSteps: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const tipsCompleted = pathProgress.reduce(
      (sum, p) => sum + p.completedSteps.length,
      0
    );

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        lastActiveAt: user.lastActiveAt,
        stats: {
          jokesRead: user._count.jokeLikes,
          tipsCompleted,
          videosWatched: 0,
          totalFavorites: user._count.favorites,
          pathsCompleted: user._count.pathProgress,
        },
      },
    });
  } catch (error) {
    console.error("[API /user]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

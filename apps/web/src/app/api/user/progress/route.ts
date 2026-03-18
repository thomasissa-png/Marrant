import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ progress: {}, parcours: [] });
    }

    const userId = (session.user as { id: string }).id;

    const allProgress = await prisma.userPathProgress.findMany({
      where: { userId },
      select: {
        learningPathId: true,
        completedSteps: true,
        completedAt: true,
        learningPath: {
          select: {
            slug: true,
            title: true,
            icon: true,
            steps: {
              select: { id: true },
            },
          },
        },
      },
    });

    // Legacy format for parcours-content.tsx compatibility
    const progress: Record<string, number> = {};
    // Rich format for profil-dashboard
    const parcours = allProgress.map((p) => {
      progress[p.learningPathId] = p.completedSteps.length;
      return {
        slug: p.learningPath.slug,
        title: p.learningPath.title,
        icon: p.learningPath.icon,
        completedSteps: p.completedSteps.length,
        totalSteps: p.learningPath.steps.length,
        completedAt: p.completedAt?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ progress, parcours });
  } catch (error) {
    console.error("[API /user/progress]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

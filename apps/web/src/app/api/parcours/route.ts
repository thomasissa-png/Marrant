import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Parcours actifs + progression de la personne connectée, par parcours.
 * Sert la liste /parcours (correspondance par `slug`, plus par titre : FS-13 b)
 * et la carte de fin (suite = premier parcours non terminé : UX-06).
 * Seules les étapes validées et la date de fin sortent : aucun contenu d'étape.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    const [paths, progresses] = await Promise.all([
      prisma.learningPath.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          steps: {
            orderBy: { order: "asc" },
            include: {
              tip: {
                select: { id: true, title: true, category: true, difficulty: true },
              },
            },
          },
        },
      }),
      prisma.userPathProgress.findMany({
        where: { userId },
        select: { learningPathId: true, completedSteps: true, completedAt: true },
      }),
    ]);

    const progressByPath = new Map(progresses.map((p) => [p.learningPathId, p]));

    return NextResponse.json(
      {
        paths: paths.map((p) => {
          const prog = progressByPath.get(p.id);
          return {
            ...p,
            progress: prog
              ? { completedSteps: [...new Set(prog.completedSteps)], completedAt: prog.completedAt }
              : null,
          };
        }),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

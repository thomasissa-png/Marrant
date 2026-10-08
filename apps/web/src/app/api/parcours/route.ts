import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSeedForSlug } from "@/lib/parcours-data";

/**
 * Parcours actifs + progression de la personne connectée, par parcours.
 * Sert la liste /parcours (correspondance par `slug`, plus par titre : FS-13 b)
 * et la carte de fin (suite = premier parcours non terminé : UX-06).
 * Seules les étapes validées et la date de fin sortent : aucun contenu d'étape.
 */
/** Dernière validation d'étape par parcours ; erreur = carte vide (ordre par `order`, jamais de panne). */
async function lastValidationByPath(userId: string): Promise<Map<string, Date | null>> {
  try {
    const rows = await prisma.userPathStepCompletion.groupBy({
      by: ["learningPathId"],
      where: { userId },
      _max: { completedAt: true },
    });
    return new Map(rows.map((r) => [r.learningPathId, r._max.completedAt]));
  } catch {
    return new Map();
  }
}

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
    // s18 (spec s17 §5.5, SU-09) : dernière validation par parcours, pour ordonner les parcours en cours.
    const lastByPath = await lastValidationByPath(userId);

    return NextResponse.json(
      {
        paths: paths.map((p) => {
          const prog = progressByPath.get(p.id);
          return {
            ...p,
            // s18 : phrase d'accroche de la suite quand ce n'est pas le parcours conseillé (§5.5, point 5).
            personaTagline: getSeedForSlug(p.slug)?.personaTagline ?? null,
            progress: prog
              ? {
                  completedSteps: [...new Set(prog.completedSteps)],
                  completedAt: prog.completedAt,
                  ...(lastByPath.has(p.id) && { lastActivityAt: lastByPath.get(p.id) ?? null }),
                }
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

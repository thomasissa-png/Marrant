import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import parcoursSeed from "../../../../../../../../docs/content/parcours-seed.json";

function buildFallbackFromSeed(slug: string) {
  const seed = parcoursSeed.find((p) => p.slug === slug);
  if (!seed) return null;

  return {
    id: `seed-${seed.slug}`,
    title: seed.title,
    description: seed.description,
    slug: seed.slug,
    duration: seed.duration,
    difficulty: seed.difficulty,
    icon: seed.icon,
    steps: seed.steps.map((s, i) => ({
      id: `seed-step-${i + 1}`,
      order: i + 1,
      dayNumber: s.dayNumber,
      tip: {
        id: `seed-tip-${i + 1}`,
        title: s.moduleTitle,
        content: s.moduleDetail,
        category: "GENERAL",
        difficulty: seed.difficulty,
        example: s.moduleFormat,
        exercise: s.why,
      },
    })),
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const path = await prisma.learningPath.findUnique({
      where: { slug: params.slug, isActive: true },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: {
            tip: {
              select: {
                id: true,
                title: true,
                content: true,
                category: true,
                difficulty: true,
                example: true,
                exercise: true,
              },
            },
          },
        },
      },
    });

    if (!path) {
      // Fallback to seed data if parcours not in DB
      const fallback = buildFallbackFromSeed(params.slug);
      if (fallback) {
        return NextResponse.json({ path: fallback, userProgress: null });
      }
      return NextResponse.json(
        { error: "Parcours introuvable" },
        { status: 404 }
      );
    }

    // Fetch user progress if authenticated
    let userProgress = null;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (userId) {
      userProgress = await prisma.userPathProgress.findUnique({
        where: {
          userId_learningPathId: { userId, learningPathId: path.id },
        },
      });
    }

    return NextResponse.json({ path, userProgress });
  } catch (error) {
    console.error("[API /parcours/by-slug]", error);
    // Fallback to seed data on DB error too
    const fallback = buildFallbackFromSeed(params.slug);
    if (fallback) {
      return NextResponse.json({ path: fallback, userProgress: null });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

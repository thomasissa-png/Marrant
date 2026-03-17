import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

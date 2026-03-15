import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ progress: null });
    }

    const userId = (session.user as { id: string }).id;

    const progress = await prisma.userPathProgress.findUnique({
      where: { userId_learningPathId: { userId, learningPathId: params.id } },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("[API /parcours/progress GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { stepOrder } = await request.json();

    // Vérifier si le step a déjà été complété
    const existingProgress = await prisma.userPathProgress.findUnique({
      where: { userId_learningPathId: { userId, learningPathId: params.id } },
    });

    const alreadyCompleted = existingProgress?.completedSteps.includes(stepOrder) ?? false;

    if (alreadyCompleted) {
      return NextResponse.json({
        progress: existingProgress,
        xpGained: 0,
        pathCompleted: false,
        message: "Step déjà complété",
      });
    }

    // Upsert le progress + increment XP dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      const progress = await tx.userPathProgress.upsert({
        where: { userId_learningPathId: { userId, learningPathId: params.id } },
        create: {
          userId,
          learningPathId: params.id,
          currentStep: stepOrder,
          completedSteps: [stepOrder],
        },
        update: {
          currentStep: stepOrder,
          completedSteps: { push: stepOrder },
        },
      });

      // Award XP atomiquement
      await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: 20 } },
      });

      let xpGained = 20;

      // Vérifier si tous les steps sont complétés
      const path = await tx.learningPath.findUnique({
        where: { id: params.id },
        include: { steps: true },
      });

      let pathCompleted = false;
      if (path && progress.completedSteps.length >= path.steps.length) {
        pathCompleted = true;
        await tx.userPathProgress.update({
          where: { id: progress.id },
          data: { completedAt: new Date() },
        });
        // Bonus XP pour complétion du parcours
        await tx.user.update({
          where: { id: userId },
          data: { xp: { increment: 100 } },
        });
        xpGained += 100;
      }

      return { progress, xpGained, pathCompleted };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /parcours/progress POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

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
  } catch {
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

    const progress = await prisma.userPathProgress.upsert({
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

    // Award XP for completing a step
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: 20 } },
    });

    // Check if all steps are completed
    const path = await prisma.learningPath.findUnique({
      where: { id: params.id },
      include: { steps: true },
    });

    if (path && progress.completedSteps.length >= path.steps.length) {
      await prisma.userPathProgress.update({
        where: { id: progress.id },
        data: { completedAt: new Date() },
      });
      // Bonus XP for completing a path
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: 100 } },
      });
    }

    return NextResponse.json({
      progress,
      xpGained: 20,
      pathCompleted: path ? progress.completedSteps.length >= path.steps.length : false,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

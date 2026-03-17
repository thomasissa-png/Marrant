import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ progress: null });
    }

    const userId = (session.user as { id: string }).id;

    // Vérifier que le parcours existe
    const path = await prisma.learningPath.findUnique({
      where: { id: params.id, isActive: true },
      select: { id: true },
    });

    if (!path) {
      return NextResponse.json(
        { error: "Parcours introuvable" },
        { status: 404 }
      );
    }

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
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    const userId = (session.user as { id: string }).id;

    // Rate limiting : max 10 completions par minute par utilisateur
    const rl = rateLimit(`progress:${userId}`, {
      maxRequests: 10,
      windowMs: 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessaie dans une minute." },
        { status: 429 }
      );
    }

    // Valider le body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    const stepOrder =
      typeof body === "object" &&
      body !== null &&
      "stepOrder" in body &&
      typeof (body as Record<string, unknown>).stepOrder === "number"
        ? (body as { stepOrder: number }).stepOrder
        : null;

    if (stepOrder === null || !Number.isInteger(stepOrder) || stepOrder < 1) {
      return NextResponse.json(
        { error: "stepOrder doit être un entier positif" },
        { status: 400 }
      );
    }

    // Tout dans la transaction pour éviter les race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Vérifier que le parcours existe et récupérer ses steps
      const path = await tx.learningPath.findUnique({
        where: { id: params.id, isActive: true },
        include: { steps: { select: { order: true } } },
      });

      if (!path) {
        return { error: "Parcours introuvable", status: 404 } as const;
      }

      // Vérifier que le stepOrder correspond à un vrai step
      const validStepOrders = path.steps.map((s) => s.order);
      if (!validStepOrders.includes(stepOrder)) {
        return { error: "Étape invalide", status: 400 } as const;
      }

      // Vérifier si le step a déjà été complété
      const existingProgress = await tx.userPathProgress.findUnique({
        where: { userId_learningPathId: { userId, learningPathId: params.id } },
      });

      if (existingProgress?.completedSteps.includes(stepOrder)) {
        return {
          progress: existingProgress,
          xpGained: 0,
          pathCompleted: !!existingProgress.completedAt,
        };
      }

      // Upsert le progress
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
      let pathCompleted = false;
      if (progress.completedSteps.length >= path.steps.length) {
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

    // Gérer les erreurs retournées par la transaction
    if ("error" in result && "status" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /parcours/progress POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

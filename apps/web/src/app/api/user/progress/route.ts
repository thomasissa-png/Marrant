import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ progress: {} });
    }

    const userId = (session.user as { id: string }).id;

    const allProgress = await prisma.userPathProgress.findMany({
      where: { userId },
      select: {
        learningPathId: true,
        completedSteps: true,
      },
    });

    const progress: Record<string, number> = {};
    for (const p of allProgress) {
      progress[p.learningPathId] = p.completedSteps.length;
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("[API /user/progress]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

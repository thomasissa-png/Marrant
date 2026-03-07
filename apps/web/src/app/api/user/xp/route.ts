import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const XP_THRESHOLDS = {
  NOVICE: 0,
  APPRENTI: 100,
  FARCEUR: 500,
  COMIQUE: 1500,
  LEGENDE: 5000,
} as const;

type UserLevel = keyof typeof XP_THRESHOLDS;

function calculateLevel(xp: number): UserLevel {
  if (xp >= XP_THRESHOLDS.LEGENDE) return "LEGENDE";
  if (xp >= XP_THRESHOLDS.COMIQUE) return "COMIQUE";
  if (xp >= XP_THRESHOLDS.FARCEUR) return "FARCEUR";
  if (xp >= XP_THRESHOLDS.APPRENTI) return "APPRENTI";
  return "NOVICE";
}

const xpSchema = z.object({
  amount: z.number().min(1).max(500),
  action: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const { amount } = xpSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const newXp = user.xp + amount;
    const newLevel = calculateLevel(newXp);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
        lastActiveAt: new Date(),
      },
      select: { xp: true, level: true },
    });

    return NextResponse.json({
      xp: updatedUser.xp,
      level: updatedUser.level,
      xpGained: amount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

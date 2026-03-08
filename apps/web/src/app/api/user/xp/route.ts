import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

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

    // Rate limit: 30 gains XP par minute par utilisateur
    const rl = rateLimit(`xp:${userId}`, { maxRequests: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Réessaie dans quelques instants." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { amount } = xpSchema.parse(body);

    // Increment atomique pour éviter les race conditions
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: amount },
        lastActiveAt: new Date(),
      },
      select: { xp: true },
    });

    // Recalculer le niveau après l'increment atomique
    const newLevel = calculateLevel(updatedUser.xp);

    const finalUser = await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
      select: { xp: true, level: true },
    });

    return NextResponse.json({
      xp: finalUser.xp,
      level: finalUser.level,
      xpGained: amount,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[API /user/xp]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

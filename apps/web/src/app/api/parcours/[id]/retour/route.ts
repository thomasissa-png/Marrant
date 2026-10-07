import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { retryAfterSeconds, sharedRateLimit } from "@/lib/rate-limit";
import { isPremiumPlan } from "@/lib/parcours-access";
import { RETOURS_EXERCICE } from "@/lib/progression";
import { TEXTES_PROGRESSION_API as T } from "@/config/textes/parcours-emails";

/**
 * Retour sur l'exercice d'une étape (s17, PM-06) : 3 valeurs fermées,
 * facultatif, jamais exigé pour valider (avis @legal C13).
 *  - GET  → `{ retours: [{ stepOrder, retour }] }` (connecté, sinon liste vide)
 *  - POST `{ stepOrder, retour }` → `{ stepOrder, retour }` (abonné Premium ;
 *    un nouveau choix remplace le précédent).
 */
const bodySchema = z.object({
  stepOrder: z.number().int().min(1).max(100),
  retour: z.enum(RETOURS_EXERCICE),
});

function userIdDe(session: unknown): string | null {
  const user = (session as { user?: { id?: string } } | null)?.user;
  return user?.id ?? null;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = userIdDe(await getServerSession(authOptions));
    if (!userId) return NextResponse.json({ retours: [] });
    const rows = await prisma.userPathStepFeedback.findMany({
      where: { userId, learningPathId: params.id },
      select: { stepOrder: true, retour: true },
      orderBy: { stepOrder: "asc" },
    });
    return NextResponse.json({ retours: rows });
  } catch (error) {
    console.error("[API /parcours/retour GET]", error);
    return NextResponse.json({ error: T.serveur, code: "serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = userIdDe(await getServerSession(authOptions));
    if (!userId) return NextResponse.json({ error: T.authRequise, code: "auth" }, { status: 401 });

    const rl = await sharedRateLimit("parcours-retour", userId, { maxRequests: 20, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: T.limite, code: "limite" },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds(rl)) } },
      );
    }

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: T.retourInvalide, code: "corps" }, { status: 400 });
    const { stepOrder, retour } = parsed.data;

    const owner = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (!isPremiumPlan(owner?.plan)) {
      return NextResponse.json({ error: T.reserveePremium, code: "refus" }, { status: 403 });
    }

    const step = await prisma.learningPathStep.findFirst({
      where: { learningPathId: params.id, order: stepOrder, learningPath: { isActive: true } },
      select: { id: true },
    });
    if (!step) return NextResponse.json({ error: T.etapeInvalide, code: "etape" }, { status: 400 });

    await prisma.userPathStepFeedback.upsert({
      where: { userId_learningPathId_stepOrder: { userId, learningPathId: params.id, stepOrder } },
      create: { userId, learningPathId: params.id, stepOrder, retour },
      update: { retour },
    });
    return NextResponse.json({ stepOrder, retour });
  } catch (error) {
    console.error("[API /parcours/retour POST]", error);
    return NextResponse.json({ error: T.serveur, code: "serveur" }, { status: 500 });
  }
}

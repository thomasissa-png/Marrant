import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { noterExerciceOuvert } from "@/lib/mesure/evenements-usage";

/**
 * Exercice d'une fiche conseil, vidéo (et points clés d'une vidéo) ou vanne (« À toi de jouer »,
 * `howToApply`, depuis le 08/11), pour un abonné Premium seulement (s23). Les fiches sont en ISR : la même page pour tous, donc l'exercice ne peut
 * pas être passé en prop au composant client sans finir dans le payload RSC lisible par un
 * non-abonné (règle `lib/champs-premium.ts` : jamais envoyé à un compte non Premium, ni par
 * le HTML). Le bloc abonné le charge ici, après lecture de la session.
 */
export const dynamic = "force-dynamic";

const querySchema = z.object({
  type: z.enum(["conseil", "video", "vanne"]),
  id: z.string().min(1).max(64),
});

const PRIVE = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const query = querySchema.safeParse({
    type: request.nextUrl.searchParams.get("type"),
    id: request.nextUrl.searchParams.get("id"),
  });
  if (!query.success) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400, headers: PRIVE });
  }

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401, headers: PRIVE });
  }

  const rl = rateLimit(`fiche-exercice:${userId}`, { maxRequests: 60, windowMs: 60_000 });
  if (!rl.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Trop de requêtes" },
      { status: 429, headers: { ...PRIVE, "Retry-After": String(retryAfter) } },
    );
  }

  try {
    // Plan relu en base (pas celui du jeton) : même règle que /api/tips et /api/videos.
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (user?.plan !== "PREMIUM") {
      return NextResponse.json({ error: "Réservé à Premium" }, { status: 403, headers: PRIVE });
    }

    const { type, id } = query.data;
    if (type === "conseil") {
      const tip = await prisma.tip.findFirst({ where: { id, isActive: true }, select: { exercise: true } });
      if (!tip) return NextResponse.json({ error: "Introuvable" }, { status: 404, headers: PRIVE });
      // s24 mesure (lot 0) : exercice réellement servi = premier accès Premium et « aha ». Ne lève jamais.
      if (tip.exercise) await noterExerciceOuvert(user.plan, userId, type);
      return NextResponse.json({ exercice: tip.exercise || null, pointsCles: [] }, { headers: PRIVE });
    }

    if (type === "vanne") {
      const joke = await prisma.joke.findFirst({ where: { id, isActive: true }, select: { howToApply: true } });
      if (!joke) return NextResponse.json({ error: "Introuvable" }, { status: 404, headers: PRIVE });
      if (joke.howToApply) await noterExerciceOuvert(user.plan, userId, type);
      return NextResponse.json({ exercice: joke.howToApply || null, pointsCles: [] }, { headers: PRIVE });
    }

    const video = await prisma.video.findFirst({
      where: { id, isActive: true },
      select: { exercise: true, learnings: true },
    });
    if (!video) return NextResponse.json({ error: "Introuvable" }, { status: 404, headers: PRIVE });
    if (video.exercise || video.learnings.some((l) => l.trim())) await noterExerciceOuvert(user.plan, userId, type);
    return NextResponse.json(
      {
        exercice: video.exercise || null,
        pointsCles: video.learnings.filter((l) => l.trim()),
      },
      { headers: PRIVE },
    );
  } catch (error) {
    console.error("[api/fiches/exercice]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: PRIVE });
  }
}

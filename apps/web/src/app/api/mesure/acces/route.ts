import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { refuserSiAutreSite } from "@/lib/same-site";
import { noterPremiereFois } from "@/lib/mesure/evenements-usage";
import { detailSignal, type SignalAcces } from "@/lib/mesure/signal-acces";

/**
 * POST /api/mesure/acces (s24, lot 0) : un contenu réservé vient d'être RÉELLEMENT affiché à un
 * abonné (définitions du §5.2 du brief espace client) : étape 2+ dépliée, élément de liste au-delà
 * de la limite gratuite entré dans la vue, bloc exercice d'une fiche entré dans la vue. Appelée par
 * le navigateur sans attendre de réponse (`keepalive`) : aucun effet sur le rendu.
 *
 * Session obligatoire (401), plan relu EN BASE (403 sinon Premium), corps d'une liste fermée (400),
 * étape vérifiée en base (ordre >= 2 d'un parcours actif, sinon 400). Écrit au plus un
 * `premier_acces_premium` par abonnement ; réponse 204 même si l'écriture échoue.
 */
export const dynamic = "force-dynamic";

/** Liste fermée des signaux admis (tout autre champ ou valeur = 400). */
const CORPS_SIGNAL_ACCES = z.discriminatedUnion("type", [
  z.object({ type: z.literal("etape"), parcours: z.string().regex(/^[a-z0-9-]{1,80}$/), etape: z.number().int().min(2).max(100) }).strict(),
  z.object({ type: z.literal("liste"), liste: z.enum(["vannes", "conseils", "videos"]) }).strict(),
  z.object({ type: z.literal("exercice"), fiche: z.enum(["conseil", "video", "vanne"]) }).strict(),
]) satisfies z.ZodType<SignalAcces>;

const PRIVE = { "Cache-Control": "private, no-store" };
const refus = (status: number) => new NextResponse(null, { status, headers: PRIVE });

export async function POST(request: Request) {
  const autreSite = refuserSiAutreSite(request, "POST /api/mesure/acces");
  if (autreSite) return autreSite;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return refus(401);

  const rl = rateLimit(`mesure-acces:${userId}`, { maxRequests: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
    return new NextResponse(null, { status: 429, headers: { ...PRIVE, "Retry-After": String(retryAfter) } });
  }

  const corps = CORPS_SIGNAL_ACCES.safeParse(await request.json().catch(() => null));
  if (!corps.success) return refus(400);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (user?.plan !== "PREMIUM") return refus(403);

    if (corps.data.type === "etape") {
      const etape = await prisma.learningPathStep.findFirst({
        where: { order: corps.data.etape, learningPath: { slug: corps.data.parcours, isActive: true } },
        select: { id: true },
      });
      if (!etape) return refus(400);
    }

    await noterPremiereFois("premier_acces_premium", user.plan, userId, detailSignal(corps.data));
  } catch {
    // Lecture du plan ou de l'étape impossible : rien n'est mesuré, rien n'est montré.
    console.warn("[mesure] acces non vérifié (base)");
  }
  return refus(204);
}

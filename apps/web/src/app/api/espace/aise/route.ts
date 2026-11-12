import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { REPONSES_AISE, enregistrerAise } from "@/lib/espace/aise";

/**
 * POST /api/espace/aise (s24, lot D3) : réponse à « Où veux-tu être plus à l'aise ? » (C9).
 * Interrupteur fermé : 404 avant toute lecture. 401 sans session, 403 sans abonnement actif
 * (plan relu en base), 400 valeur hors liste. Une seule réponse gardée (la première).
 */
export const dynamic = "force-dynamic";

const corps = z.object({ aise: z.enum(REPONSES_AISE) }).strict();
const json = (d: Record<string, unknown>, status = 200) =>
  NextResponse.json(d, { status, headers: { "Cache-Control": "private, no-store" } });

export async function POST(request: Request) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const lu = corps.safeParse(await request.json().catch(() => null));
  if (!lu.success) return json({ error: "valeur" }, 400);
  try {
    const { deja } = await enregistrerAise(garde.userId, lu.data.aise);
    return json({ ok: true, deja });
  } catch (error) {
    console.error("[espace/aise] enregistrement impossible :", error);
    return json({ error: "indisponible" }, 503);
  }
}

/** Interrupteur fermé : 404 comme une adresse inexistante ; ouvert : 405. */
export async function GET() {
  return methodeNonPermise();
}

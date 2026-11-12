import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { CLES_COMPTEUR, VALEURS_COMPTEUR, compter } from "@/lib/espace/vanne";
import { sharedRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/espace/compteur (s24, lot D3) : capteur ANONYME du toucher (architecture 7.7).
 * Clé et valeur d'une liste fermée ; rien d'autre n'est lu ni écrit (aucun identifiant d'abonné,
 * aucune vanne). Abonné actif seulement ; 60 événements par minute et par compte au plus
 * (la limite tient en mémoire partagée, jamais dans le compteur).
 */
export const dynamic = "force-dynamic";

const corps = z.object({ cle: z.enum(CLES_COMPTEUR), valeur: z.enum(VALEURS_COMPTEUR) }).strict();
const json = (d: Record<string, unknown>, status = 200) =>
  NextResponse.json(d, { status, headers: { "Cache-Control": "private, no-store" } });

export async function POST(request: Request) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const lu = corps.safeParse(await request.json().catch(() => null));
  if (!lu.success) return json({ error: "valeur" }, 400);
  try {
    const limite = await sharedRateLimit("espace-compteur", garde.userId, { maxRequests: 60, windowMs: 60_000 });
    if (!limite.allowed) {
      const attente = Math.max(1, Math.ceil((limite.resetAt - Date.now()) / 1000));
      return NextResponse.json({ ok: false }, { status: 429, headers: { "Cache-Control": "private, no-store", "Retry-After": String(attente) } });
    }
    await compter(lu.data.cle, lu.data.valeur);
    return json({ ok: true });
  } catch (error) {
    console.error("[espace/compteur] écriture impossible :", error);
    return json({ error: "indisponible" }, 503);
  }
}

/** Interrupteur fermé : 404 comme une adresse inexistante ; ouvert : 405. */
export async function GET() {
  return methodeNonPermise();
}

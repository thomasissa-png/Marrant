import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { jsonEspace, lireCorps, limiterEcritures } from "@/lib/espace/api";
import { EVENEMENTS_NAVIGATEUR, noterEvenementEspace } from "@/lib/mesure/evenements-espace";

/**
 * POST /api/espace/mesure (s24, lot D9) : événement d'usage signalé par le navigateur, liste fermée
 * (`cloche_ouverte` seule ; architecture 7.7 point 6). Corps `{ evenement }` strict : tout autre champ ou
 * valeur = 400, aucun texte n'est lu. Fermé : 404 avant toute lecture (garde) ; 401 sans session ; 403
 * sans abonnement actif ; 60 par minute et par compte. Réponse 204 même si l'écriture échoue (la mesure
 * n'a aucun effet sur l'écran). Les capteurs anonymes du toucher restent sur `/api/espace/compteur`.
 */
export const dynamic = "force-dynamic";

const corps = z.object({ evenement: z.enum(EVENEMENTS_NAVIGATEUR) }).strict();

export async function POST(request: Request) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const lu = corps.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: "valeur" }, 400);
  try {
    const trop = await limiterEcritures("espace-mesure", garde.userId);
    if (trop) return trop;
  } catch {
    // Limite illisible : on n'écrit rien (en cas de doute, pas de mesure).
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
  }
  await noterEvenementEspace({ type: lu.data.evenement }, garde.userId);
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
}

/** Interrupteur fermé : 404 comme une adresse inexistante ; ouvert : 405. */
export async function GET() {
  return methodeNonPermise();
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { jsonEspace, lireCorps, limiterEcritures } from "@/lib/espace/api";
import { compterAnonyme } from "@/lib/espace/compteurs";

/**
 * POST /api/espace/mesure (s24, lot D9, revu au lot D10) : ouverture signalée par le navigateur, liste
 * fermée (`{ ouverture: "cloche" }` seule ; architecture 7.7 point 6). Lot D10 : compteur ANONYME
 * (`lib/espace/compteurs.ts`), rien n'est rattaché au compte ; le compte ne sert qu'à la limite de débit
 * (mémoire partagée, jamais dans le compteur). Corps strict : tout autre champ ou valeur = 400, aucun
 * texte n'est lu. Fermé : 404 avant toute lecture (garde) ; 401 sans session ; 403 sans abonnement
 * actif ; 60 par minute et par compte. Réponse 204 même si l'écriture échoue (aucun effet sur l'écran).
 */
export const dynamic = "force-dynamic";

const corps = z.object({ ouverture: z.enum(["cloche"]) }).strict();

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
  await compterAnonyme({ cle: "ouverture", valeur: lu.data.ouverture });
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
}

/** Interrupteur fermé : 404 comme une adresse inexistante ; ouvert : 405. */
export async function GET() {
  return methodeNonPermise();
}

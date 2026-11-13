import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { RETOURS_GESTE, declarerRetour } from "@/lib/espace/fiche-fait";
import { ficheAcceptantReplique, journaliserSansTexte } from "@/lib/espace/repliques";
import { idFiche } from "@/lib/espace/fiches-schema";
import { jsonEspace, lireCorps, limiterEcritures } from "@/lib/espace/api";

/**
 * POST /api/espace/fiche-fait (s24, lot D5) : « Ton retour » sous le geste d'une fiche. « Essayé, bof »
 * et « Essayé, ça a marché » posent « Fait » (une ligne `FicheFait` par fiche, idempotent) ; « Pas
 * essayé » le retire. Fiche à geste servie à l'abonné seulement (404 sinon). Ni XP, ni cap, ni série.
 * Fermé : 404 avant toute lecture ; 401, 403 (abonné actif seulement), 503.
 */
export const dynamic = "force-dynamic";

const corps = z.object({ ficheId: idFiche, retour: z.enum(RETOURS_GESTE) }).strict();

export async function POST(request: Request) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const lu = corps.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: "valeur" }, 400);
  if (!ficheAcceptantReplique(lu.data.ficheId, { acces: "ouvert", userId: garde.userId })) return jsonEspace({ error: "introuvable" }, 404);
  try {
    const trop = await limiterEcritures("fiche-fait", garde.userId);
    if (trop) return trop;
    const { fait } = await declarerRetour(garde.userId, lu.data.ficheId, lu.data.retour);
    return jsonEspace({ ok: true, fait });
  } catch (error) {
    journaliserSansTexte("fiche-fait", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function GET() {
  return methodeNonPermise();
}

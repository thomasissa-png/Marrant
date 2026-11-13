import { NextResponse } from "next/server";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { jsonEspace } from "@/lib/espace/api";
import { lireCloche } from "@/lib/espace/cloche";

/**
 * GET /api/espace/cloche (s24, lot D8, architecture v20 2.9) : contenu du panneau de la cloche pour un
 * abonné actif. Lecture SEULE : ni l'appel ni l'ouverture du panneau ne rendent une réponse « lue » (seule
 * l'ouverture du fil le fait, `api/espace/questions/[id]/ouvert`). Réponse : `nonLues` (nombre de fils dont
 * la réponse de l'équipe n'est pas lue), `reponses`, `nouveautes`, `lettre`. Jamais de bonus, jamais de
 * texte d'un message, aucun e-mail. Fermé : 404 avant toute lecture ; 401, 403, 503 comme le reste de l'espace.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  try {
    return jsonEspace({ ...(await lireCloche(garde.userId)) });
  } catch (error) {
    const e = error as { name?: unknown } | null;
    console.error(`[espace/cloche] lecture impossible : ${typeof e?.name === "string" ? e.name : "Erreur"}`);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function POST() {
  return methodeNonPermise();
}

export async function PUT() {
  return methodeNonPermise();
}

export async function DELETE() {
  return methodeNonPermise();
}

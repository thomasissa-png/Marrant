import { NextResponse } from "next/server";
import { garderApiLectureSeule, methodeNonPermise } from "@/lib/espace/garde";
import { FORMAT_CLE, jsonEspace } from "@/lib/espace/api";
import { journaliserQuestions, marquerOuvert } from "@/lib/espace/questions";

/**
 * POST /api/espace/questions/[id]/ouvert (s24, lot D7 ; architecture 2.9) : l'abonné a ouvert le fil, ses
 * réponses deviennent lues (pastille de la cloche éteinte, gardé après rechargement). Ouvrir le panneau de
 * la cloche n'appelle pas cette route. Fil d'un autre compte : 404. Aucun corps, aucune donnée de texte.
 */
export const dynamic = "force-dynamic";

type Contexte = { params: { id: string } };
/** Appel sans segment (tests de fermeture) : la garde répond avant toute lecture de l'identifiant. */
const SANS_ID: Contexte = { params: { id: "" } };

export async function POST(_request: Request, { params }: Contexte = SANS_ID) {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  if (!FORMAT_CLE.test(params.id)) return jsonEspace({ error: "introuvable" }, 404);
  try {
    return (await marquerOuvert(garde.userId, params.id)) ? jsonEspace({ ok: true }) : jsonEspace({ error: "introuvable" }, 404);
  } catch (error) {
    journaliserQuestions("ouvert", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function GET() {
  return methodeNonPermise();
}

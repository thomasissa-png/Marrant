import { NextResponse } from "next/server";
import { garderApiLectureSeule, methodeNonPermise } from "@/lib/espace/garde";
import { FORMAT_CLE, jsonEspace, limiterEcritures } from "@/lib/espace/api";
import { journaliserQuestions, lireFil, retirerFil } from "@/lib/espace/questions";

/**
 * /api/espace/questions/[id] (s24, lot D7) : un fil de l'abonné.
 * GET : le fil (404 s'il n'existe pas ou appartient à un autre compte : jamais distingués).
 * DELETE : « Retirer de mon historique » (demande de l'abonné, décision C10 a) : le fil et ses messages
 *   sont supprimés ; accepté aussi après la résiliation (lecture seule : la suppression reste possible).
 * Fermé : 404 avant toute lecture ; 401 sans session ; 403 compte jamais abonné.
 */
export const dynamic = "force-dynamic";

type Contexte = { params: { id: string } };
/** Appel sans segment (tests de fermeture) : la garde répond avant toute lecture de l'identifiant. */
const SANS_ID: Contexte = { params: { id: "" } };

export async function GET(_request: Request, { params }: Contexte = SANS_ID) {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  if (!FORMAT_CLE.test(params.id)) return jsonEspace({ error: "introuvable" }, 404);
  try {
    const fil = await lireFil(garde.userId, params.id);
    return fil ? jsonEspace({ fil, lectureSeule: !garde.actif }) : jsonEspace({ error: "introuvable" }, 404);
  } catch (error) {
    journaliserQuestions("fil", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function DELETE(_request: Request, { params }: Contexte = SANS_ID) {
  const garde = await garderApiLectureSeule();
  if (garde instanceof NextResponse) return garde;
  if (!FORMAT_CLE.test(params.id)) return jsonEspace({ error: "introuvable" }, 404);
  try {
    const trop = await limiterEcritures("questions-retirer", garde.userId);
    if (trop) return trop;
    return (await retirerFil(garde.userId, params.id)) ? jsonEspace({ ok: true }) : jsonEspace({ error: "introuvable" }, 404);
  } catch (error) {
    journaliserQuestions("retirer", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function POST() {
  return methodeNonPermise();
}

export async function PUT() {
  return methodeNonPermise();
}

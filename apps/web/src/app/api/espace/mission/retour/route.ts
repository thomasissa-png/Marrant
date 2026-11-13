import { NextResponse } from "next/server";
import { z } from "zod";
import { garderApiEspace, methodeNonPermise } from "@/lib/espace/garde";
import { RETOURS_GESTE } from "@/lib/espace/fiche-fait";
import { marcheProposee, missionOuverte, missionsServiesValidees, suiteApres } from "@/lib/espace/missions";
import { enregistrerRetourMission, lireRetoursMission } from "@/lib/espace/missions-serveur";
import { idFiche } from "@/lib/espace/fiches-schema";
import { journaliserSansTexte } from "@/lib/espace/repliques";
import { FORMAT_CLE, jsonEspace, lireCorps, limiterEcritures } from "@/lib/espace/api";

/**
 * POST /api/espace/mission/retour (s24, lot D5) : « Ton retour » d'une mission (`{ missionId, retour, cle }`).
 * Une ligne `MissionRetour` par clé ; renvoie la suite (`marche`, `bof`, `pas`, `pas2`), la marche
 * proposée et la mission ouverte suivante (une seule à la fois). Toujours facultative, jamais comptée.
 * Fermé : 404 avant toute lecture ; 401, 403 (abonné actif seulement), 400, 404 mission inconnue, 503.
 */
export const dynamic = "force-dynamic";

const corps = z.object({ missionId: idFiche, retour: z.enum(RETOURS_GESTE), cle: z.string().regex(FORMAT_CLE) }).strict();

export async function POST(request: Request) {
  const garde = await garderApiEspace();
  if (garde instanceof NextResponse) return garde;
  const lu = corps.safeParse(await lireCorps(request));
  if (!lu.success) return jsonEspace({ error: "valeur" }, 400);
  const mission = missionsServiesValidees().find((m) => m.id === lu.data.missionId);
  if (!mission) return jsonEspace({ error: "introuvable" }, 404);
  try {
    const trop = await limiterEcritures("mission", garde.userId);
    if (trop) return trop;
    await enregistrerRetourMission(garde.userId, mission, lu.data.retour, lu.data.cle);
    const retours = await lireRetoursMission(garde.userId);
    const suivante = missionOuverte(missionsServiesValidees(), retours);
    return jsonEspace({ ok: true, suite: suiteApres(retours), marche: marcheProposee(retours), mission: suivante?.id ?? null });
  } catch (error) {
    journaliserSansTexte("mission", error);
    return jsonEspace({ error: "indisponible" }, 503);
  }
}

export async function GET() {
  return methodeNonPermise();
}

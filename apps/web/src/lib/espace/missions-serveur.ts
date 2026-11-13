/**
 * Côté base des missions (s24, lot D5) : journal `MissionRetour` (migration 24), lu dans l'ordre, et
 * enregistrement d'un retour (idempotent par clé : un double clic n'écrit qu'une ligne, et ne compte
 * donc jamais pour deux « Pas essayé »). Ni XP, ni cap, ni série. Règles : `lib/espace/missions.ts`.
 */
import { prisma } from "@/lib/prisma";
import { RETOURS_GESTE, type RetourGeste } from "@/lib/espace/retours";
import type { Mission, RetourMissionLu } from "@/lib/espace/missions";

export async function lireRetoursMission(userId: string): Promise<RetourMissionLu[]> {
  const lignes = await prisma.missionRetour.findMany({
    where: { userId },
    select: { missionId: true, marche: true, retour: true },
    orderBy: { creeLe: "asc" },
    take: 500,
  });
  return lignes.filter((l): l is RetourMissionLu => (RETOURS_GESTE as readonly string[]).includes(l.retour));
}

export async function enregistrerRetourMission(userId: string, mission: Mission, retour: RetourGeste, cle: string): Promise<void> {
  const deja = await prisma.missionRetour.findUnique({ where: { userId_cle: { userId, cle } }, select: { id: true } });
  if (deja) return;
  try {
    await prisma.missionRetour.create({ data: { userId, missionId: mission.id, marche: mission.marche, retour, cle } });
  } catch (error) {
    // Double clic simultané : la clé unique refuse la seconde ligne, le premier retour compte seul.
    if ((error as { code?: unknown })?.code !== "P2002") throw error;
  }
}

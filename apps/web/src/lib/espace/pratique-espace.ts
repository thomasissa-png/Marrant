/**
 * Pratique venue de l'espace (s27, défaut D4 de `docs/qa/parcours-abonne-s27.md`, go de Thomas du 26/11) : une réplique
 * enregistrée (« Ma réplique à moi ») ou un « Ton retour » qui dit « Essayé » compte comme pratique du jour.
 *
 * - Série : la même règle que les étapes et les quiz d'étape (s17, `recordPractice` : un jour civil de Paris au plus,
 *   `lastPracticeAt`), donc écrire dix répliques le même jour ne compte qu'un jour.
 * - Premier pas : figé (`figerPremierPas`, une fois pour toutes), « Aujourd'hui » passe à la suite.
 * - XP : AUCUN. Les XP restent fixés par le serveur à la validation d'étape et en fin de parcours (anti-triche s24) :
 *   rien ici n'écrit `xp`, `level` ni de cap.
 *
 * Ne lève jamais : l'écriture de l'abonné (réplique, retour) est déjà faite ; un échec ici est journalisé sans texte.
 */
import { prisma } from "@/lib/prisma";
import { recordPractice, type PracticeDb } from "@/lib/progression";
import { figerPremierPas } from "@/lib/espace/premier-pas-fige";

export async function compterPratiqueEspace(userId: string, origine: "replique" | "retour", maintenant: Date = new Date()): Promise<void> {
  try {
    await recordPractice(prisma as unknown as PracticeDb, userId, maintenant);
    await figerPremierPas(userId, maintenant);
  } catch (error) {
    console.error(`[espace/pratique] ${origine} :`, error instanceof Error ? error.name : "erreur");
  }
}

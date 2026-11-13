import { prisma } from "@/lib/prisma";

/**
 * Fige le premier pas (lot D7, migration 26, décision de la session sur le point du D5b) : `premierPasLe`
 * est posé UNE fois et jamais effacé ni réécrit (création sans conflit, puis mise à jour seulement si vide).
 * « Fait » est réversible (« Pas essayé » retire la ligne) : sans cette date, le premier pas pouvait
 * redevenir faux entre le « Fait » et la réponse à C9.
 */
export async function figerPremierPas(userId: string, maintenant: Date = new Date()): Promise<void> {
  await prisma.espaceCompte.createMany({ data: [{ userId, premierPasLe: maintenant }], skipDuplicates: true });
  await prisma.espaceCompte.updateMany({ where: { userId, premierPasLe: null }, data: { premierPasLe: maintenant } });
}

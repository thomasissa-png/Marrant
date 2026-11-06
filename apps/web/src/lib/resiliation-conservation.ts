/**
 * Conservation des réponses à la question de la résiliation (s23, @legal O3), table
 * `CancellationFeedback`. Durée PROVISOIRE `RESILIATION_CONSERVATION_MOIS` (à confirmer par Thomas).
 * Table absente (migration 17 pas jouée) : rien à faire, aucune erreur. Module à part : importé par
 * `lib/account.ts` (suppression du compte) sans cycle avec `lib/resiliation.ts`.
 */
import { prisma } from "@/lib/prisma";
import { estTableAbsente } from "@/lib/analytics/weekly-lettre";
import { RESILIATION_CONSERVATION_MOIS } from "@/config/resiliation";

/** Purge quotidienne : réponses de plus de `RESILIATION_CONSERVATION_MOIS` mois effacées. Nombre effacé. */
export async function purgerMotifsResiliation(now: Date = new Date()): Promise<number> {
  const limite = new Date(now);
  limite.setMonth(limite.getMonth() - RESILIATION_CONSERVATION_MOIS);
  try {
    const { count } = await prisma.cancellationFeedback.deleteMany({ where: { createdAt: { lt: limite } } });
    return count;
  } catch (err) {
    if (estTableAbsente(err)) return 0;
    throw err;
  }
}

/**
 * Suppression du compte : mot libre effacé (il peut contenir un nom ou un fait identifiant) ; les
 * raisons cochées restent, détachées du compte par `onDelete: SetNull`.
 */
export async function effacerMotsLibresDuCompte(userId: string): Promise<number> {
  try {
    const { count } = await prisma.cancellationFeedback.updateMany({
      where: { userId, comment: { not: null } },
      data: { comment: null },
    });
    return count;
  } catch (err) {
    if (estTableAbsente(err)) return 0;
    throw err;
  }
}

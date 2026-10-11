/**
 * Lock idempotent au jour près pour `runDailySocialJob`.
 *
 * Corrige P1 ouvert s08/04 : si le run de 4h UTC dépasse 15 min, le scheduler
 * peut relancer un 2e run avant que le 1er ait fini ses INSERT SocialPost →
 * duplication de contenu. La fenêtre catch-up (6h-23h) augmente encore la
 * surface (n'importe quelle heure peut déclencher un retry).
 *
 * Différent de `lib/job-lock.ts` (TTL court, lock par run) : ici PK unique par
 * jour calendaire UTC, **pas de TTL**. Le lock vit la journée entière et le
 * 1er run qui réussit verrouille les suivants. Cleanup hebdomadaire conseillé
 * (cron purge des dateUTC < 7j pour éviter croissance infinie).
 *
 * Pattern : `tryAcquireSocialDailyLock(date)` est non-bloquant : il return
 * immédiatement true (lock acquis) ou false (déjà détenu). À wrapper en
 * première ligne de `runDailySocialJob`.
 */
import { prisma } from "@/lib/prisma";

/** Convertit une Date en clé "YYYY-MM-DD" (UTC). Pure function pour testabilité. */
export function buildSocialDailyLockKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Tente d'acquérir le lock journalier social. Retourne `true` si acquis (le
 * caller peut lancer son pipeline), `false` si déjà détenu (skip).
 *
 * **Silent-fail** : sur erreur DB, retourne `false` (préfère ne pas lancer
 * que double-déclencher). L'erreur est loggée en console.
 *
 * @param date Date du run (UTC). Le lock est unique par dateUTC (YYYY-MM-DD).
 */
export async function tryAcquireSocialDailyLock(date: Date = new Date()): Promise<boolean> {
  const dateUTC = buildSocialDailyLockKey(date);

  try {
    // INSERT atomique. L'unique constraint sur `dateUTC` garantit que seul le
    // 1er process à arriver passe ; les autres prennent P2002 et retournent false.
    await prisma.socialPostDailyLock.create({ data: { dateUTC } });
    return true;
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      // Lock déjà détenu — comportement attendu, pas un bug.
      return false;
    }
    console.error(`[social-daily-lock] Erreur acquisition "${dateUTC}" :`, err);
    return false;
  }
}

/**
 * Purge les locks anciens (> 7 jours) pour éviter une croissance infinie de
 * la table. À appeler depuis un cron hebdomadaire ou en début de journée
 * lors de l'acquisition du nouveau lock.
 */
export async function purgeOldSocialDailyLocks(olderThanDays = 7): Promise<number> {
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
  try {
    const { count } = await prisma.socialPostDailyLock.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    return count;
  } catch (err) {
    console.error("[social-daily-lock] Erreur purge :", err);
    return 0;
  }
}

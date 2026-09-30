/**
 * Quota journalier PERSISTANT (Postgres), valable sous Workers (incident s14).
 *
 * Le `rateLimit` de src/lib/rate-limit.ts est en mémoire : sous Cloudflare
 * Workers chaque isolat a sa propre mémoire, recyclée à tout moment, donc la
 * limite n'est pas fiable. Ici, chaque consommation est une ligne `JobLock`
 * (clé `quota:<scope>:<jour UTC>:<uuid>`), ce qui évite une migration de schéma.
 * Le comptage se fait par préfixe de clé ; une course entre deux requêtes
 * simultanées peut dépasser la limite d'une unité, ce qui reste acceptable pour
 * un garde-fou de coût.
 *
 * Fail-closed : si la base ne répond pas, la consommation est refusée.
 */
import { prisma } from "@/lib/prisma";

export function quotaDayPrefix(scope: string, now: Date): string {
  return `quota:${scope}:${now.toISOString().slice(0, 10)}:`;
}

export async function consumeDailyQuota(
  scope: string,
  limit: number,
  now: Date = new Date(),
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const prefix = quotaDayPrefix(scope, now);
  try {
    // Ménage opportuniste des jetons expirés (tous scopes confondus).
    await prisma.jobLock.deleteMany({
      where: { jobKey: { startsWith: "quota:" }, expiresAt: { lt: now } },
    });
    const used = await prisma.jobLock.count({ where: { jobKey: { startsWith: prefix } } });
    if (used >= limit) return { allowed: false, used, limit };
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    await prisma.jobLock.create({
      data: { jobKey: `${prefix}${crypto.randomUUID()}`, acquiredAt: now, expiresAt: endOfDay },
    });
    return { allowed: true, used: used + 1, limit };
  } catch (err) {
    console.error(`[quota] Lecture/écriture impossible pour "${prefix}", refus par précaution :`, err);
    return { allowed: false, used: limit, limit };
  }
}

/**
 * Verrou anti-concurrent pour les jobs schedulés.
 *
 * Problème résolu : entre le scheduler interne (`instrumentation.ts`) et le
 * cron HTTP (`/api/cron/*`), deux instances peuvent déclencher le MÊME pipeline
 * LLM en parallèle avant que le premier écrive son résultat en base. Cela coûte
 * cher (chaque pipeline = jusqu'à ~$0.20 en tokens) et peut créer des doublons
 * de contenu.
 *
 * Solution : upsert atomique sur une table `JobLock` avec un TTL. Si le lock est
 * expiré, un nouveau process peut le réacquérir (tolérance aux crashs).
 */
import { prisma } from "@/lib/prisma";

/**
 * Calcule la clé de lock pour un job donné à une date donnée.
 * Format jour : `<jobName>-YYYY-MM-DD` (UTC)
 * Format semaine : `<jobName>-YYYY-W<numéro-semaine>`
 */
export function buildJobLockKey(jobName: string, date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${jobName}-${year}-${month}-${day}`;
}

/**
 * Calcule une clé de lock hebdomadaire (basée sur le numéro de semaine ISO).
 * Utilisé pour `runWeeklySeoJob` où l'unité naturelle est la semaine.
 */
export function buildWeeklyJobLockKey(jobName: string, date: Date): string {
  // Numéro de semaine ISO 8601 (lundi = jour 1)
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = target.getUTCDay() || 7; // dimanche = 7
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${jobName}-${target.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Tente d'acquérir un lock pour le job donné.
 *
 * Retourne `true` si le lock est acquis (le caller peut lancer son pipeline),
 * `false` si un autre process le détient encore (pipeline en cours ailleurs).
 *
 * Les locks expirés (TTL dépassé, typiquement dû à un crash de process)
 * sont automatiquement réacquérables par le prochain appelant.
 *
 * Cette fonction est **silent-fail** : si la DB est inaccessible, retourne
 * `false` (on préfère ne pas lancer le job plutôt que de risquer un double
 * déclenchement silencieux).
 *
 * @param jobKey clé unique du lock (ex: "daily-content-2026-04-11")
 * @param ttlMs durée de vie du lock en millisecondes (ex: 10 min)
 */
export async function tryAcquireLock(jobKey: string, ttlMs: number): Promise<boolean> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMs);

  try {
    // 1. Nettoyer les locks expirés pour cette clé (permet la ré-acquisition
    //    après crash). On delete uniquement si expiré, pas d'impact sur un
    //    lock encore valide.
    await prisma.jobLock.deleteMany({
      where: {
        jobKey,
        expiresAt: { lt: now },
      },
    });

    // 2. Tenter d'insérer le nouveau lock. L'unique constraint sur `jobKey`
    //    garantit l'atomicité : si un autre process vient d'insérer, on
    //    prend une erreur P2002 et on retourne false.
    await prisma.jobLock.create({
      data: {
        jobKey,
        acquiredAt: now,
        expiresAt,
      },
    });

    return true;
  } catch (err) {
    // Erreur P2002 Prisma = unique constraint violation = lock déjà détenu.
    // Toute autre erreur = DB down ou transient, on préfère skip le job.
    const code = (err as { code?: string })?.code;
    if (code !== "P2002") {
      console.error(`[job-lock] Erreur acquisition "${jobKey}" :`, err);
    }
    return false;
  }
}

/**
 * Libère un lock après exécution réussie du job.
 *
 * Cette fonction est **silent-fail** : une erreur de libération ne doit pas
 * faire crasher le pipeline qui vient juste de réussir. Le TTL prendra le
 * relais si la DB refuse le delete.
 */
export async function releaseLock(jobKey: string): Promise<void> {
  try {
    await prisma.jobLock.deleteMany({
      where: { jobKey },
    });
  } catch (err) {
    console.error(`[job-lock] Erreur libération "${jobKey}" :`, err);
  }
}

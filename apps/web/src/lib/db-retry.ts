/**
 * Retry ciblé pour les erreurs de connexion Neon (cold start).
 *
 * Problème résolu (P1 ouvert s8) : Neon free tier suspend le compute DB après
 * ~5 min d'inactivité. Quand un cron se réveille sur une DB froide, le PREMIER
 * appel Prisma tape AVANT que Neon ait réveillé le compute (wake 1-5s) → erreur
 * `Can't reach database server at ...neon.tech:5432` (Prisma `P1001`) → le cron
 * plante et spamme une alerte email toutes les ~3h.
 *
 * Mitigation (Option A, budget 0€) : retry avec backoff exponentiel UNIQUEMENT
 * sur les erreurs de connexion transitoires. Une fois la DB réveillée au 1er
 * retry, les appels suivants passent. Les autres erreurs (validation, contrainte
 * unique P2002, etc.) sont re-throw immédiatement — pas de masquage de bug réel.
 *
 * Usage : wrapper le PREMIER appel Prisma d'un cron (celui qui tombe sur la DB
 * froide). Inutile de wrapper les appels internes — une fois le compute réveillé
 * au 1er appel, les suivants ne timeout plus.
 *
 *   const posts = await withDbRetry(
 *     () => prisma.socialPost.findMany({ where: { status: "APPROVED" } }),
 *     { label: "publish-social:findApproved" },
 *   );
 */

export interface WithDbRetryOptions {
  /** Nombre total de tentatives (1re incluse). Défaut : 3. */
  maxAttempts?: number;
  /** Délai de base en ms. Backoff = baseMs * 2^(attempt-1). Défaut : 500. */
  baseMs?: number;
  /** Label pour les logs d'observabilité (ex: "ceo-tick:acquireLock"). */
  label?: string;
}

/**
 * Détecte si une erreur est une erreur de connexion Neon transitoire (cold start,
 * connexion coupée). Ce sont les seules erreurs qu'on retry.
 *
 * - `P1001` : code Prisma "Can't reach database server"
 * - messages réseau bas niveau : connexion injoignable, terminée, refusée, timeout
 *
 * On NE retry PAS : P2002 (unique constraint), P2025 (record not found),
 * erreurs de validation, etc. — ce sont des erreurs déterministes, pas transitoires.
 */
export function isConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const code = (error as { code?: unknown }).code;
  if (code === "P1001") return true;

  const message = (error as { message?: unknown }).message;
  if (typeof message !== "string") return false;

  const haystack = message.toLowerCase();
  return (
    haystack.includes("can't reach database server") ||
    haystack.includes("cant reach database server") ||
    haystack.includes("connection terminated") ||
    haystack.includes("econnrefused") ||
    haystack.includes("etimedout")
  );
}

/** Pause non bloquante. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exécute `fn` avec retry sur erreurs de connexion Neon uniquement.
 *
 * Backoff exponentiel : tentative 1 échoue → attend baseMs, tentative 2 échoue →
 * attend baseMs*2, etc. Avec les défauts (3 tentatives, base 500ms) : 500ms puis
 * 1000ms entre les essais (total ≤ 1.5s d'attente, sous le pool_timeout de 30s).
 *
 * @throws la DERNIÈRE erreur si toutes les tentatives de connexion échouent
 *         (le cron alerte alors légitimement — la DB est vraiment down).
 * @throws immédiatement toute erreur NON-connexion (re-throw sans retry).
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  opts: WithDbRetryOptions = {},
): Promise<T> {
  const maxAttempts = opts.maxAttempts ?? 3;
  const baseMs = opts.baseMs ?? 500;
  const label = opts.label ?? "db";

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Erreur non-connexion → re-throw immédiat (pas un cold start Neon).
      if (!isConnectionError(error)) {
        throw error;
      }

      lastError = error;

      // Dernière tentative épuisée → re-throw (la DB est vraiment injoignable).
      if (attempt >= maxAttempts) {
        break;
      }

      const backoffMs = baseMs * Math.pow(2, attempt - 1);
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(
        `[db-retry:${label}] erreur connexion (cold start ?) — tentative ${attempt}/${maxAttempts}, retry dans ${backoffMs}ms : ${reason}`,
      );
      await delay(backoffMs);
    }
  }

  throw lastError;
}

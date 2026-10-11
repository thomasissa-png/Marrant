/**
 * Cache module-level pour la queue Buffer (TTL 60 min).
 *
 * Amortit la pression sur l'API Buffer même si le cron social-analytics est
 * appelé toutes les 15 min par Replit Scheduled Deployments.
 *
 * Extrait de `app/api/cron/social-analytics/route.ts` (s11) : Next.js 14
 * refuse tout export autre que les handlers HTTP et la config de route dans
 * un `route.ts` — le helper de reset des tests y bloquait le typecheck du build.
 */
export type BufferQueueCache = {
  count: number;
  cachedAt: number;
};

export const BUFFER_QUEUE_CACHE_TTL_MS = 60 * 60 * 1000; // 60 min

let bufferQueueCache: BufferQueueCache | null = null;

export function getBufferQueueCache(): BufferQueueCache | null {
  return bufferQueueCache;
}

export function setBufferQueueCache(value: BufferQueueCache): void {
  bufferQueueCache = value;
}

/**
 * Reset du cache — exposé pour les tests uniquement.
 * Ne JAMAIS appeler en production.
 */
export function __resetBufferQueueCacheForTests(): void {
  bufferQueueCache = null;
}

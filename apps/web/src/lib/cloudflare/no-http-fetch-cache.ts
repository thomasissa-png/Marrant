/**
 * Incremental cache OpenNext SANS cache des réponses HTTP `fetch` (incident s14).
 *
 * Next 14.2 met en cache par défaut (« auto cache », revalidate = false, soit
 * 1 an) tout `fetch` exécuté dans un route handler, y compris les POST sans
 * en-tête `authorization`/`cookie`. Sous Workers, OpenNext stocke ces entrées
 * dans R2 (`incremental-cache/<buildId>/<hash>.fetch`). Conséquence constatée
 * le 30/09/2026 : les réponses `POST https://api.anthropic.com/v1/messages`
 * (et Buffer GraphQL) étaient REJOUÉES à l'identique d'un tick à l'autre, y
 * compris une réponse tronquée (stop_reason max_tokens) → le job échouait au
 * même endroit toutes les 15 min. Voir docs/infra/diagnostic-crons-s14.md.
 *
 * Ce wrapper laisse passer ISR (`cacheType` "cache") et `unstable_cache`
 * (entrées FETCH sans URL), et neutralise uniquement les réponses HTTP
 * (entrées FETCH dont `data.url` est renseigné) : jamais écrites, jamais
 * relues (les anciennes entrées éventuellement présentes sont ignorées).
 */

/** Sous-ensemble du contrat IncrementalCache d'OpenNext utilisé ici. */
export interface IncrementalCacheLike {
  name: string;
  get(key: string, cacheType?: string): Promise<unknown>;
  set(key: string, value: unknown, cacheType?: string): Promise<void>;
  delete(key: string): Promise<void>;
}

/** Vrai si la valeur est la réponse d'un vrai appel HTTP `fetch` (et non un `unstable_cache`). */
export function isHttpFetchCacheValue(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const v = value as { kind?: unknown; data?: { url?: unknown } };
  return v.kind === "FETCH" && typeof v.data?.url === "string" && v.data.url.length > 0;
}

export function withoutHttpFetchCache<T extends IncrementalCacheLike>(inner: T): T {
  const wrapped: IncrementalCacheLike = {
    name: `${inner.name}-sans-fetch-http`,
    async get(key, cacheType) {
      const entry = await inner.get(key, cacheType);
      if (cacheType !== "fetch" || !entry) return entry;
      const value = (entry as { value?: unknown }).value;
      return isHttpFetchCacheValue(value) ? null : entry;
    },
    async set(key, value, cacheType) {
      if (cacheType === "fetch" && isHttpFetchCacheValue(value)) return;
      await inner.set(key, value, cacheType);
    },
    delete: (key) => inner.delete(key),
  };
  return wrapped as unknown as T;
}

/**
 * Client minimal de l'API Umami Cloud (lecture des statistiques du site).
 *
 * - Base : https://api.umami.is/v1, header `x-umami-api-key`.
 * - Secrets Worker : `UMAMI_API_KEY`, `UMAMI_WEBSITE_ID`. Absents ou placeholder
 *   → `getUmamiConfig()` renvoie null : l'appelant ne fait rien et le signale.
 * - Timeout explicite (5 s) sur chaque appel. La clé n'est jamais journalisée
 *   ni recopiée dans un message d'erreur.
 */

export const UMAMI_API_BASE = "https://api.umami.is/v1";
export const UMAMI_TIMEOUT_MS = 5_000;

export type UmamiConfig = { apiKey: string; websiteId: string };

export type UmamiStats = {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  /** Temps total cumulé des visites, en secondes. */
  totaltime: number;
};

export type UmamiPoint = { x: string; y: number };
export type UmamiPageviewsSeries = { pageviews: UmamiPoint[]; sessions: UmamiPoint[] };
/** `url` : nom antérieur au 07/10/2025 de `path` (repli automatique, voir fetchUmamiPathMetrics). */
export type UmamiMetricType = "path" | "url" | "referrer" | "event";

export class UmamiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "UmamiError";
  }
}

function isUsable(value: string | undefined): value is string {
  if (!value) return false;
  const v = value.trim();
  if (!v || v.startsWith("xxxx") || v.includes("change-me") || v === "...") return false;
  return true;
}

/** Configuration lue au runtime (jamais mise en cache : un secret peut changer). */
export function getUmamiConfig(): UmamiConfig | null {
  const apiKey = process.env.UMAMI_API_KEY;
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  if (!isUsable(apiKey) || !isUsable(websiteId)) return null;
  return { apiKey: apiKey.trim(), websiteId: websiteId.trim() };
}

/** Accepte `{ value: n }` (Umami récent) ou `n` directement (anciennes versions). */
export function readMetricValue(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (raw && typeof raw === "object" && "value" in raw) {
    const v = (raw as { value: unknown }).value;
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return 0;
}

function toPoints(raw: unknown): UmamiPoint[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p): p is { x: unknown; y: unknown } => !!p && typeof p === "object")
    .map((p) => ({ x: typeof p.x === "string" ? p.x : "", y: typeof p.y === "number" ? p.y : 0 }));
}

async function umamiGet(config: UmamiConfig, path: string, params: Record<string, string | number>): Promise<unknown> {
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const url = `${UMAMI_API_BASE}/websites/${encodeURIComponent(config.websiteId)}/${path}?${query}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "x-umami-api-key": config.apiKey, accept: "application/json" },
      signal: AbortSignal.timeout(UMAMI_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (err) {
    const timeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    throw new UmamiError(timeout ? `Umami ${path} : délai de ${UMAMI_TIMEOUT_MS} ms dépassé` : `Umami ${path} : réseau indisponible`);
  }
  if (!res.ok) throw new UmamiError(`Umami ${path} : HTTP ${res.status}`, res.status);
  try {
    return await res.json();
  } catch {
    throw new UmamiError(`Umami ${path} : réponse non JSON`, res.status);
  }
}

export async function fetchUmamiStats(config: UmamiConfig, startAt: number, endAt: number): Promise<UmamiStats> {
  const data = (await umamiGet(config, "stats", { startAt, endAt })) as Record<string, unknown> | null;
  const d = data ?? {};
  return {
    pageviews: readMetricValue(d.pageviews),
    visitors: readMetricValue(d.visitors),
    visits: readMetricValue(d.visits),
    bounces: readMetricValue(d.bounces),
    totaltime: readMetricValue(d.totaltime),
  };
}

export async function fetchUmamiPageviews(
  config: UmamiConfig,
  startAt: number,
  endAt: number,
  timezone = "Europe/Paris",
): Promise<UmamiPageviewsSeries> {
  const data = (await umamiGet(config, "pageviews", { startAt, endAt, unit: "day", timezone })) as Record<
    string,
    unknown
  > | null;
  return { pageviews: toPoints(data?.pageviews), sessions: toPoints(data?.sessions) };
}

export async function fetchUmamiMetrics(
  config: UmamiConfig,
  startAt: number,
  endAt: number,
  type: UmamiMetricType,
  limit = 10,
  filters: Record<string, string> = {},
): Promise<UmamiPoint[]> {
  return toPoints(await umamiGet(config, "metrics", { startAt, endAt, type, limit, ...filters }));
}

/**
 * Pages vues par chemin. Umami a renommé `type=url` en `type=path` (et le
 * filtre `url` en `path`) le 07/10/2025 : on demande `path`, et sur HTTP 400
 * (API plus ancienne) on rejoue avec `url`.
 */
export async function fetchUmamiPathMetrics(
  config: UmamiConfig,
  startAt: number,
  endAt: number,
  limit = 10,
  pathFilter?: string,
): Promise<UmamiPoint[]> {
  try {
    return await fetchUmamiMetrics(config, startAt, endAt, "path", limit, pathFilter ? { path: pathFilter } : {});
  } catch (err) {
    if (!(err instanceof UmamiError) || err.status !== 400) throw err;
    return fetchUmamiMetrics(config, startAt, endAt, "url", limit, pathFilter ? { url: pathFilter } : {});
  }
}

export type UmamiPropertyValue = { value: string; total: number };

/**
 * Répartition d'une propriété d'événement (`GET /event-data/values`).
 * Le nom d'événement part en `event` (nom actuel) et `eventName` (ancien nom,
 * encore listé dans la référence) : Umami ignore celui qu'il ne connaît pas.
 * Une valeur numérique peut revenir en « 75 » ou « 75.0000 ».
 */
export async function fetchUmamiEventDataValues(
  config: UmamiConfig,
  startAt: number,
  endAt: number,
  event: string,
  propertyName: string,
  filters: Record<string, string> = {},
): Promise<UmamiPropertyValue[]> {
  const raw = await umamiGet(config, "event-data/values", {
    startAt,
    endAt,
    event,
    eventName: event,
    propertyName,
    ...filters,
  });
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r): r is { value: unknown; total: unknown } => !!r && typeof r === "object")
    .map((r) => ({
      value: typeof r.value === "number" ? String(r.value) : typeof r.value === "string" ? r.value.replace(/\.0+$/, "") : "",
      total: typeof r.total === "number" && Number.isFinite(r.total) ? r.total : 0,
    }));
}

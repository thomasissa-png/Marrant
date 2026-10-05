/**
 * Mock de fetch pour l'API Umami (aucun appel réseau réel dans les tests).
 * Répond selon l'endpoint ; `stats` distingue la semaine courante via `startAt`.
 */
export const TEST_UMAMI_KEY = "test-umami-key-not-real";
export const TEST_WEBSITE_ID = "site-123";

export type UmamiFixture = {
  currentStartAt: number;
  statsCurrent: unknown;
  statsPrevious: unknown;
  pageviews?: unknown;
  urls?: unknown;
  referrers?: unknown;
};

export function installUmamiFetch(fx: UmamiFixture): jest.Mock {
  const fetchMock = jest.fn(async (input: string | URL) => {
    const url = new URL(String(input));
    const endpoint = url.pathname.split("/").pop();
    let body: unknown = {};
    if (endpoint === "stats") {
      body = Number(url.searchParams.get("startAt")) === fx.currentStartAt ? fx.statsCurrent : fx.statsPrevious;
    } else if (endpoint === "pageviews") {
      body = fx.pageviews ?? { pageviews: [], sessions: [] };
    } else if (endpoint === "metrics") {
      body = url.searchParams.get("type") === "url" ? (fx.urls ?? []) : (fx.referrers ?? []);
    }
    return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

export function setUmamiEnv(): void {
  process.env.UMAMI_API_KEY = TEST_UMAMI_KEY;
  process.env.UMAMI_WEBSITE_ID = TEST_WEBSITE_ID;
}

export function clearUmamiEnv(): void {
  delete process.env.UMAMI_API_KEY;
  delete process.env.UMAMI_WEBSITE_ID;
}

/** Lundi 05/10/2026 7h15 heure de Paris (heure d'été, UTC+2). */
export const MONDAY_7H_PARIS = new Date("2026-10-05T05:15:00Z");
/** Début de la semaine du 28/09 (minuit Paris) en ms UTC. */
export const WEEK_START_2809 = Date.parse("2026-09-27T22:00:00Z");

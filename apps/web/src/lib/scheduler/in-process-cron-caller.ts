/**
 * Appel EN PROCESSUS des routes cron (Cloudflare Workers).
 *
 * Sous Workers il n'y a pas de serveur HTTP local : le self-fetch
 * `http://127.0.0.1:${PORT}` de Replit est impossible. On invoque donc
 * directement le handler `GET` de la route, avec une `Request` construite à
 * l'identique (même chemin, même query `?secret=`, mêmes en-têtes
 * `Authorization`). Les routes elles-mêmes ne sont pas modifiées : elles
 * refont leur propre contrôle `CRON_SECRET`.
 *
 * Seules les routes réellement appelées par `src/lib/scheduler/jobs.ts`
 * figurent dans la table (toute autre route → erreur explicite).
 */
import type { CronRouteCaller } from "./jobs";

type CronRouteModule = { GET: (request: Request) => Promise<Response> };

const CRON_ROUTE_LOADERS: Record<string, () => Promise<CronRouteModule>> = {
  "/api/cron/daily-social": () => import("@/app/api/cron/daily-social/route"),
  "/api/cron/publish-social": () => import("@/app/api/cron/publish-social/route"),
  "/api/cron/social-analytics": () => import("@/app/api/cron/social-analytics/route"),
  "/api/cron/seo-audit": () => import("@/app/api/cron/seo-audit/route"),
  "/api/cron/seo-report": () => import("@/app/api/cron/seo-report/route"),
  "/api/cron/ceo-tick": () => import("@/app/api/cron/ceo-tick/route"),
};

/**
 * @param origin origine de la requête entrante (ex. https://deviens-marrant.fr),
 *   utilisée seulement pour construire des URL absolues valides.
 */
export function createInProcessCronRouteCaller(origin: string): CronRouteCaller {
  return async (path, init) => {
    const url = new URL(path, origin);
    const load = CRON_ROUTE_LOADERS[url.pathname];
    if (!load) {
      throw new Error(`[scheduler] Route cron non déclarée pour l'appel en processus : ${url.pathname}`);
    }
    const { GET } = await load();
    return GET(new Request(url, init));
  };
}

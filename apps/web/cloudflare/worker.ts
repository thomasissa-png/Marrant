/**
 * Point d'entrée Cloudflare Workers (wrangler.jsonc → "main").
 *
 * - `fetch` : handler OpenNext généré par `opennextjs-cloudflare build`
 *   (.open-next/worker.js), réexporté tel quel.
 * - `scheduled` : Cron Triggers → appel EN PROCESSUS (pas de réseau) du handler
 *   fetch sur la route cron correspondante, avec `Authorization: Bearer
 *   CRON_SECRET` (même auth que le planificateur Replit).
 *
 * Table cron → route : doit rester alignée avec "triggers.crons" de wrangler.jsonc.
 */
// @ts-ignore -- fichier généré au build par `opennextjs-cloudflare build`
import { default as openNextHandler } from "../.open-next/worker.js";

// Durable Objects exportés par le worker OpenNext (non utilisés par la config
// actuelle, réexportés pour rester conforme au worker généré).
// @ts-ignore -- fichier généré au build
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "../.open-next/worker.js";

/** Sous-ensembles des types workerd (évite d'ajouter les types globaux au projet Next). */
interface WorkerEnv {
  CRON_SECRET?: string;
  /** Interrupteur : les Cron Triggers n'appellent les routes que si "true". */
  CRON_ENABLED?: string;
  /** Origine publique utilisée pour les requêtes cron synthétiques (voir runbook). */
  CRON_ORIGIN?: string;
  [binding: string]: unknown;
}
interface ScheduledControllerLike {
  cron: string;
  scheduledTime: number;
}
interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
interface OpenNextHandler {
  fetch(request: Request, env: WorkerEnv, ctx: ExecutionContextLike): Promise<Response>;
}

/** Expression cron (identique à wrangler.jsonc) → route à appeler. */
export const CRON_ROUTES: Record<string, string> = {
  // Planificateur interne : 11 jobs, fenêtres horaires gérées dans src/lib/scheduler/jobs.ts
  "*/15 * * * *": "/api/cron/scheduler-tick",
  // Tâches de démarrage idempotentes (marqueurs DataPatch)
  "0 1 * * *": "/api/cron/startup-tasks",
};

const DEFAULT_ORIGIN = "https://deviens-marrant.fr";

const handler = openNextHandler as OpenNextHandler;

/** Cache des fichiers Next hashés (identique à la règle /_next/static/* de public/_headers). */
export const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * Les règles de public/_headers ne s'appliquent pas aux réponses renvoyées par le
 * Worker : on pose ici le Cache-Control des chunks servis via run_worker_first.
 * Uniquement sur succès (2xx) ou 304 : une 404 ne doit jamais être mise en cache 1 an.
 */
export function withImmutableCache(res: Response): Response {
  if (!res.ok && res.status !== 304) return res;
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", IMMUTABLE_CACHE_CONTROL);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

/** Balise insérée par Next quand une page appelle redirect()/permanentRedirect(). */
const NEXT_REDIRECT_META = /<meta[^>]*id="__next-page-redirect"[^>]*content="\d+;url=([^"]+)"/;
// Repli : selon le chemin de rendu (page d'erreur ISR mise en cache), seule la
// digest RSC porte la destination : « NEXT_REDIRECT;replace;/vannes;308 ».
// Chemins internes uniquement (commence par « / » mais pas « // ») : pas de
// redirection ouverte vers un autre domaine.
const NEXT_REDIRECT_DIGEST = /NEXT_REDIRECT;(?:replace|push);(\\?\/(?!\\?\/)[^;"\s]*);30[178]/;

/**
 * Next 14.2 + ISR : une page qui appelle permanentRedirect() (fiches catalogue
 * retirées) est mise en cache avec son statut 308 mais SANS l'en-tête Location
 * (seuls status et headers « de rendu » sont stockés, Location est posé à part).
 * Les hits de cache suivants renverraient un 308 sans destination. On restaure
 * Location depuis la balise meta refresh que Next écrit dans le HTML.
 * N'intervient que sur un 3xx HTML sans Location (cas rare) : aucun impact sur
 * le streaming des pages normales.
 */
export async function restoreRedirectLocation(res: Response): Promise<Response> {
  if (res.status < 300 || res.status >= 400 || res.headers.has("location")) return res;
  if (!(res.headers.get("content-type") ?? "").includes("text/html")) return res;
  const html = await res.text();
  const headers = new Headers(res.headers);
  const match = html.match(NEXT_REDIRECT_META);
  if (match) {
    headers.set("Location", match[1].replace(/&amp;/g, "&"));
  } else {
    const digest = html.match(NEXT_REDIRECT_DIGEST);
    if (digest) headers.set("Location", digest[1].replace(/\\\//g, "/"));
  }
  return new Response(html, { status: res.status, statusText: res.statusText, headers });
}

export default {
  async fetch(request: Request, env: WorkerEnv, ctx: ExecutionContextLike): Promise<Response> {
    const url = new URL(request.url);
    // Chunks des groupes de routes « (dashboard) » et des segments « [slug] » : la
    // couche assets redirige (307) vers sa forme canonique d'encodage (%28 ↔ (,
    // [ ↔ %5B), que certains navigateurs redemandent sous l'autre forme : boucle
    // ERR_TOO_MANY_REDIRECTS et page blanche. On suit ces redirections côté Worker
    // et on sert le fichier final directement (run_worker_first dans wrangler.jsonc).
    if (url.pathname.startsWith("/_next/static/")) {
      const assets = env.ASSETS as { fetch(req: Request): Promise<Response> } | undefined;
      if (assets) {
        const seen = new Set<string>();
        let target = url.toString();
        for (let hop = 0; hop < 4 && !seen.has(target); hop++) {
          seen.add(target);
          const res = await assets.fetch(new Request(target, { method: request.method, headers: request.headers }));
          const location = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null;
          if (!location) return withImmutableCache(res);
          target = new URL(location, target).toString();
        }
        return new Response("Not found", { status: 404 });
      }
    }
    const response = await restoreRedirectLocation(await handler.fetch(request, env, ctx));
    // Adresse de test *.workers.dev : jamais indexée (doublon SEO du domaine de prod).
    if (new URL(request.url).hostname.endsWith(".workers.dev")) {
      const headers = new Headers(response.headers);
      headers.set("X-Robots-Tag", "noindex, nofollow");
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    return response;
  },

  async scheduled(controller: ScheduledControllerLike, env: WorkerEnv, ctx: ExecutionContextLike): Promise<void> {
    // Garde-fou étape B : tant que la prod tourne sur Replit, le Worker de test
    // (*.workers.dev) ne doit ni publier sur les réseaux, ni envoyer d'e-mails,
    // ni générer de contenu en double. Passer CRON_ENABLED="true" à la bascule.
    if (env.CRON_ENABLED !== "true") {
      console.log(`[cf-cron] ${controller.cron} ignoré : CRON_ENABLED !== "true".`);
      return;
    }
    const path = CRON_ROUTES[controller.cron];
    if (!path) {
      console.error(`[cf-cron] Expression cron sans route associée : "${controller.cron}"`);
      return;
    }
    const secret = env.CRON_SECRET;
    if (!secret) {
      console.error(`[cf-cron] CRON_SECRET absent — ${path} non appelée.`);
      return;
    }

    const origin = typeof env.CRON_ORIGIN === "string" && env.CRON_ORIGIN ? env.CRON_ORIGIN : DEFAULT_ORIGIN;
    const request = new Request(new URL(path, origin), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`,
        "x-marrant-cron": controller.cron,
      },
    });

    const startedAt = Date.now();
    try {
      const response = await handler.fetch(request, env, ctx);
      const body = await response.text();
      const log = `[cf-cron] ${controller.cron} → ${path} : HTTP ${response.status} en ${Date.now() - startedAt} ms`;
      if (response.ok) console.log(log);
      else console.error(`${log} — ${body.slice(0, 500)}`);
    } catch (error) {
      console.error(`[cf-cron] ${controller.cron} → ${path} : échec`, error);
    }
  },
};

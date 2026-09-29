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

export default {
  fetch(request: Request, env: WorkerEnv, ctx: ExecutionContextLike): Promise<Response> {
    return handler.fetch(request, env, ctx);
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

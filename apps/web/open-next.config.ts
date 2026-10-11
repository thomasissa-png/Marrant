// Configuration OpenNext pour Cloudflare Workers (@opennextjs/cloudflare 1.15.1).
// Cache incrémental Next (ISR, fetch cache) stocké dans R2 (binding
// NEXT_INC_CACHE_R2_BUCKET → bucket "marrant-next-cache", voir wrangler.jsonc).
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import { getCloudflareContext } from "@opennextjs/cloudflare/cloudflare-context";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";
import { withoutHttpFetchCache } from "./src/lib/cloudflare/no-http-fetch-cache";

// File de revalidation ISR : sans elle, les pages restent servies « STALE » et ne se
// régénèrent jamais (contenu du jour, blog, sitemap figés). La memory-queue redemande
// la page au Worker via le binding WORKER_SELF_REFERENCE (wrangler.jsonc). Pas de tag
// cache : le code n'appelle ni revalidateTag ni revalidatePath.
//
// s20 (docs/infra/diagnostic-vitesse-ahrefs-s20.md) : l'interception de cache (plus
// bas) appelle `await queue.send()` AVANT de répondre, et la memory-queue attend la
// fin du rendu (jusqu'à 10 s). On rend l'envoi non bloquant : la revalidation part
// en waitUntil, la page obsolète est servie tout de suite (même comportement que le
// chemin sans interception, qui passe déjà par waitUntil).
// La déduplication par isolat reste celle de la memory-queue (même instance).
const nonBlockingMemoryQueue = {
  name: "memory-queue-non-bloquante",
  async send(message: Parameters<typeof memoryQueue.send>[0]): Promise<void> {
    getCloudflareContext().ctx.waitUntil(
      memoryQueue.send(message).catch((error: unknown) => {
        console.error("[isr] revalidation non lancée", message.MessageBody.url, error);
      }),
    );
  },
};

// Incident s14 (docs/infra/diagnostic-crons-s14.md) : les réponses HTTP `fetch`
// (Anthropic, Buffer…) ne sont JAMAIS mises en cache (Next 14 les cachait 1 an
// et les rejouait d'un tick cron à l'autre). ISR et unstable_cache inchangés.
export default defineCloudflareConfig({
  incrementalCache: withoutHttpFetchCache(r2IncrementalCache),
  queue: nonBlockingMemoryQueue,
  // s20 : sert les pages ISR (fiches vannes/conseils/vidéos, blog, parcours, pages
  // statiques) directement depuis R2, sans charger le serveur Next. Corrige surtout
  // le « STALE perpétuel » : les fiches (generateStaticParams vide) sont absentes du
  // prerender-manifest, Next 14 les juge donc obsolètes 1 s après écriture dans tout
  // isolat qui ne les a pas rendues lui-même, et relance un rendu complet à chaque
  // visite. L'intercepteur lit le vrai `revalidate` stocké dans l'entrée R2.
  // Sans effet sur les routes dynamiques (/abonnement, /vannes?page=, API, carnet,
  // aperçu blog) : seules les routes du prerender-manifest sont interceptées. Cookies
  // ignorés comme le fait déjà Next pour une page ISR (aucun HTML personnalisé n'est
  // mis en cache). Pas de PPR (Next 14) : compatible.
  enableCacheInterception: true,
});

// Configuration OpenNext pour Cloudflare Workers (@opennextjs/cloudflare 1.15.1).
// Cache incrémental Next (ISR, fetch cache) stocké dans R2 (binding
// NEXT_INC_CACHE_R2_BUCKET → bucket "marrant-next-cache", voir wrangler.jsonc).
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

// File de revalidation ISR : sans elle, les pages restent servies « STALE » et ne se
// régénèrent jamais (contenu du jour, blog, sitemap figés). La memory-queue redemande
// la page au Worker via le binding WORKER_SELF_REFERENCE (wrangler.jsonc). Pas de tag
// cache : le code n'appelle ni revalidateTag ni revalidatePath.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: memoryQueue,
});

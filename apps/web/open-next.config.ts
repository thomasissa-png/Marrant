// Configuration OpenNext pour Cloudflare Workers (@opennextjs/cloudflare 1.15.1).
// Cache incrémental Next (ISR, fetch cache) stocké dans R2 (binding
// NEXT_INC_CACHE_R2_BUCKET → bucket "marrant-next-cache", voir wrangler.jsonc).
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});

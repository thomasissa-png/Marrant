/**
 * Revalidation à la demande des pages qui listent les articles de blog.
 *
 * BEST EFFORT, jamais bloquant :
 *  - Replit / Node (route handler) : `revalidatePath` invalide immédiatement
 *    le cache ISR des chemins listés.
 *  - Hors contexte de requête (setInterval d'instrumentation.ts) : Next lève
 *    « static generation store missing » → capturé, on retombe sur l'ISR.
 *  - Cloudflare / OpenNext : pas de tag cache configuré (open-next.config.ts),
 *    l'appel est accepté mais sans effet.
 *
 * La visibilité est donc GARANTIE par l'ISR (`revalidate = 3600` sur /blog,
 * /blog/[slug], sitemap.xml, llms.txt, llms-full.txt) : au plus ~1 h après la
 * bascule `isPublished`, la première visite régénère la page.
 */
import { revalidatePath } from "next/cache";

export function blogPathsToRevalidate(slugs: string[]): string[] {
  return ["/blog", ...slugs.map((slug) => `/blog/${slug}`), "/sitemap.xml", "/llms.txt", "/llms-full.txt"];
}

/** @returns nombre de chemins effectivement revalidés sans erreur. */
export function revalidateBlogPaths(slugs: string[]): number {
  let revalidated = 0;
  for (const path of blogPathsToRevalidate(slugs)) {
    try {
      revalidatePath(path);
      revalidated++;
    } catch (err) {
      console.warn(
        `[blog-revalidate] revalidatePath("${path}") indisponible (${err instanceof Error ? err.message : String(err)}) : l'ISR 1 h prend le relais.`,
      );
      return revalidated;
    }
  }
  return revalidated;
}

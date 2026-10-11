/**
 * Aperçu d'un article de blog programmé (`/blog/apercu/[slug]`), réservé à
 * l'admin (relecture avant sortie, captures). Constantes partagées par le
 * middleware, la page, le garde Umami (lib/umami.ts) et le layout racine.
 */

/** Préfixe de l'aperçu : aucun événement Umami ne part sous ce chemin. */
export const BLOG_PREVIEW_PATH = "/blog/apercu";

/** Paramètre d'URL portant ADMIN_PASSWORD, retiré par redirection une fois le cookie posé. */
export const BLOG_PREVIEW_QUERY_PARAM = "cle";

/** Cookie httpOnly d'accès, restreint à BLOG_PREVIEW_PATH. */
export const BLOG_PREVIEW_COOKIE = "blog_apercu";

/** Durée de validité du cookie : 2 h. */
export const BLOG_PREVIEW_MAX_AGE_S = 2 * 60 * 60;

export function isBlogPreviewPath(pathname: string): boolean {
  return pathname === BLOG_PREVIEW_PATH || pathname.startsWith(`${BLOG_PREVIEW_PATH}/`);
}

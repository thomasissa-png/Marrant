/**
 * Pagination crawlable des listes catalogue (lot S1 s14, P0-1).
 * Module pur (sans Prisma) : importable côté serveur ET client.
 *
 * Convention d'URL : page 1 = URL sans paramètre, pages suivantes = `?page=N`.
 */

const SITE_URL = "https://deviens-marrant.fr";

/** Page de liste rendue par le serveur, passée en props aux listes client. */
export interface CataloguePage<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * `?page=N` → entier >= 1. Toute valeur absente ou non entière vaut 1
 * (et la page porte alors le canonical sans paramètre).
 */
export function parsePageParam(raw: string | string[] | null | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || !/^\d{1,5}$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 ? page : 1;
}

/** Lien relatif d'une page de liste : page 1 = URL sans paramètre. */
export function listPageHref(path: string, page: number): string {
  return page > 1 ? `${path}?page=${page}` : path;
}

/** Canonical absolu et auto-référent (les autres paramètres, `q`, `utm_*`, sont ignorés). */
export function listCanonical(path: string, page: number): string {
  return `${SITE_URL}${listPageHref(path, page)}`;
}

/**
 * URL courante avec `page` remplacé (les autres paramètres, dont `q`, sont gardés).
 * Utilisé par la navigation client (history.pushState) sans rechargement.
 */
export function withPageParam(pathname: string, search: string, page: number): string {
  const params = new URLSearchParams(search);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

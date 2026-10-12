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

/** Au-delà de ce nombre de pages, la rangée de numéros est abrégée avec « … ». */
export const PAGINATION_FULL_ROW_MAX = 15;

export type PaginationItem = number | "ellipsis";

/**
 * Rangée de numéros de la pagination (s20, spec maillage S1).
 * - `totalPages ≤ 15` : toutes les pages (profondeur de clic max 3 par les listes).
 * - Au-delà : 1, 2, page courante ±2, avant-dernière, dernière ; chaque trou → « … ».
 * Page hors bornes ramenée dans [1, totalPages] (la page elle-même répond 404 ailleurs).
 */
export function paginationItems(page: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 1) return [];
  if (totalPages <= PAGINATION_FULL_ROW_MAX) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const current = Math.min(Math.max(page, 1), totalPages);
  const pages = new Set<number>([1, 2, totalPages - 1, totalPages]);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("ellipsis");
    items.push(p);
  });
  return items;
}

/** Colonnes max de la grille mobile : 7 cellules de 44 px dès 360 px de large, 6 en dessous. */
const GRID_MAX_COLS = 7;
const GRID_MAX_COLS_XS = 6;

/**
 * Colonnes de la grille mobile de pagination (cellules = Précédent + numéros/« … » + Suivant),
 * choisies pour des rangées égales : 14 cellules → 7 + 7, 10 → 5 + 5, 13 → 7 + 6.
 */
export function paginationGridColumns(cells: number): { cols: number; colsXs: number } {
  const columns = (max: number) => Math.ceil(cells / Math.ceil(cells / max));
  return { cols: columns(GRID_MAX_COLS), colsXs: columns(GRID_MAX_COLS_XS) };
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

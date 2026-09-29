/**
 * Génération et parsing de slugs stables pour /vannes/[slug], /conseils/[slug], /videos/[slug].
 *
 * Stratégie : pas de champ slug persisté (pas de migration DB) — le slug est dérivé
 * de manière déterministe du contenu + id. Format :
 *   `${slugifiedTitle}-${id.slice(0, 10)}`
 *
 * Résolution : on extrait les 10 premiers caractères de l'id via regex, puis
 * `findFirst({ where: { id: { startsWith: shortId } } })`. Les cuids étant sur ~25
 * caractères, une collision sur 10 chars est virtuellement impossible pour un
 * catalogue < 1M d'items.
 */

export const SHORT_ID_LENGTH = 10;

const ACCENT_MAP: Record<string, string> = {
  à: "a", â: "a", ä: "a", á: "a", ã: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  î: "i", ï: "i", í: "i",
  ô: "o", ö: "o", ó: "o", õ: "o",
  ù: "u", û: "u", ü: "u", ú: "u",
  ç: "c", ñ: "n",
  "œ": "oe", "æ": "ae",
};

/**
 * Convertit un texte en fragment de slug URL-safe.
 * - minuscules, accents ASCII, seulement [a-z0-9-]
 * - collapse multi-tirets, trim tirets début/fin
 * - limité à maxLength (par défaut 60)
 */
export function slugifyText(input: string, maxLength = 60): string {
  if (!input) return "";
  const lower = input.toLowerCase();
  const noAccents = lower.replace(/[àâäáãéèêëîïíôöóõùûüúçñœæ]/g, (c) => ACCENT_MAP[c] ?? c);
  const cleaned = noAccents
    .replace(/['`’"“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (cleaned.length <= maxLength) return cleaned;
  // Coupe propre au dernier tiret avant maxLength si possible
  const truncated = cleaned.slice(0, maxLength);
  const lastDash = truncated.lastIndexOf("-");
  if (lastDash > maxLength / 2) return truncated.slice(0, lastDash);
  return truncated;
}

/**
 * Génère le slug complet pour un contenu du catalogue.
 * @param text Texte source (content pour une vanne, title pour tip/video)
 * @param id Cuid Prisma du contenu
 */
export function buildCatalogueSlug(text: string, id: string): string {
  const base = slugifyText(text, 60);
  const shortId = id.slice(0, SHORT_ID_LENGTH);
  if (!base) return shortId;
  return `${base}-${shortId}`;
}

/**
 * Extrait le shortId depuis un slug. Retourne null si le format ne correspond pas.
 * Le shortId est le dernier segment de 10 caractères alphanumériques précédé d'un tiret.
 */
export function parseShortIdFromSlug(slug: string): string | null {
  if (!slug) return null;
  // On accepte le shortId seul (backward compat) ou en suffixe -shortId
  const trimmed = slug.trim().toLowerCase();
  const suffixMatch = trimmed.match(/(?:^|-)([a-z0-9]{10})$/);
  if (suffixMatch) return suffixMatch[1];
  return null;
}

/**
 * Construit le slug pour une vanne (utilise content).
 */
export function buildJokeSlug(joke: { id: string; content: string }): string {
  return buildCatalogueSlug(joke.content, joke.id);
}

/**
 * Construit le slug pour un conseil (utilise title).
 */
export function buildTipSlug(tip: { id: string; title: string }): string {
  return buildCatalogueSlug(tip.title, tip.id);
}

/**
 * Construit le slug pour une vidéo (utilise title).
 */
export function buildVideoSlug(video: { id: string; title: string }): string {
  return buildCatalogueSlug(video.title, video.id);
}

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
 * Ancien slug d'un conseil renommé, calculé depuis `originalTitle` (titre avant
 * réécriture). Sert à résoudre l'ancienne URL vers la bonne fiche (puis 308).
 */
export function buildFormerTipSlugs(tip: { id: string; originalTitle?: string | null }): string[] {
  return tip.originalTitle ? [buildCatalogueSlug(tip.originalTitle, tip.id)] : [];
}

/**
 * Construit le slug pour une vidéo (utilise title).
 */
export function buildVideoSlug(video: { id: string; title: string }): string {
  return buildCatalogueSlug(video.title, video.id);
}

/**
 * Choisit, parmi les contenus qui partagent le même shortId, celui qui
 * correspond au slug demandé.
 *
 * s11 : les cuid créés en rafale par le seed partagent souvent leurs 10
 * premiers caractères (ex. 89 vidéos → 3 préfixes). `findFirst({ startsWith })`
 * renvoyait alors la même fiche pour des URL différentes (contenu dupliqué,
 * mauvaise vidéo affichée). On compare donc le slug complet, puis, à défaut
 * (ancienne URL d'un contenu renommé), le nombre de mots en commun.
 * Les URL existantes ne changent pas.
 *
 * s18 : avant le score de mots, une ancienne URL qui correspond EXACTEMENT à
 * l'ancien slug d'un candidat (`buildFormerSlugs`, ex. depuis `originalTitle`)
 * désigne ce candidat. Sans cela, « construire-une-histoire-drole-cmmp8ozsx0 »
 * partait vers une autre fiche du même préfixe qui avait plus de mots en commun.
 */
export function pickBySlug<T extends { id: string }>(
  candidates: T[],
  slug: string,
  buildSlug: (item: T) => string,
  buildFormerSlugs?: (item: T) => string[]
): T | null {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  const wanted = slug.trim().toLowerCase();
  const exact = candidates.find((c) => buildSlug(c) === wanted);
  if (exact) return exact;
  if (buildFormerSlugs) {
    const former = candidates.find((c) => buildFormerSlugs(c).includes(wanted));
    if (former) return former;
  }
  const words = new Set(wanted.split("-"));
  let best = candidates[0];
  let bestScore = -1;
  for (const c of candidates) {
    const score = buildSlug(c)
      .split("-")
      .filter((w) => words.has(w)).length;
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  return best;
}

/** Résultat de la résolution d'un slug de fiche catalogue. */
export type SlugResolution<T> =
  | { status: "active"; item: T }
  | { status: "inactive" }
  | { status: "missing" };

/**
 * Résout un slug parmi TOUS les contenus partageant le shortId (actifs ET
 * retirés) : la fiche visée est choisie par `pickBySlug`, puis son statut
 * décide de la réponse. Chercher parmi les seuls actifs ferait servir, pour
 * l'URL d'une fiche retirée, un autre contenu qui partage le même préfixe d'id.
 *
 * - "active"   : fiche affichée
 * - "inactive" : fiche retirée (soft delete) → redirection permanente vers la liste
 * - "missing"  : aucun contenu → 404
 */
export function resolveBySlug<T extends { id: string; isActive: boolean }>(
  candidates: T[],
  slug: string,
  buildSlug: (item: T) => string,
  buildFormerSlugs?: (item: T) => string[]
): SlugResolution<T> {
  const picked = pickBySlug(candidates, slug, buildSlug, buildFormerSlugs);
  if (!picked) return { status: "missing" };
  if (!picked.isActive) return { status: "inactive" };
  return { status: "active", item: picked };
}

/**
 * Lot S3d (s14) : le slug dérive du texte, et les vannes vont être réécrites.
 * Une ancienne URL (texte d'avant, casse différente) résout toujours la fiche
 * par son shortId : si le slug demandé n'est pas le slug canonique actuel, la
 * fiche redirige en permanence (308) vers ce dernier. Les slugs canoniques ne
 * contiennent que [a-z0-9-] : l'URL cible résout exactement, pas de boucle.
 */
export function isNonCanonicalSlug(requested: string, canonical: string): boolean {
  return requested !== canonical;
}

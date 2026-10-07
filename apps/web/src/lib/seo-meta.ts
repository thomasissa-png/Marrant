import type { Metadata } from "next";

/**
 * Helpers de métadonnées SEO (passe finale s11).
 *
 * Problème corrigé : les pages dynamiques (blog, conseils, vannes, vidéos)
 * tronquaient brutalement le <title> à 36 caractères + "..." pour tenir sous
 * 60 caractères avec le suffixe du template. Résultat en prod :
 * « Comment raconter une blague sans la ... | deviens-marrant.fr » — mot-clé
 * coupé, titre différent du H1 (signal faible pour Bing, qui pondère l'exact
 * match title/H1).
 *
 * Règle appliquée :
 *  - titre + suffixe « | deviens-marrant.fr » ≤ 60 car. → template (marque visible) ;
 *  - sinon titre seul (absolute) s'il fait ≤ 60 car. ;
 *  - sinon coupe propre à la dernière frontière de mot, sans casser le début
 *    (qui porte le mot-clé).
 */

export const SITE_SUFFIX = " | deviens-marrant.fr";
export const TITLE_MAX = 60;

/** Normalise les espaces et retire le Markdown courant (gras, liens, titres). */
export function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Coupe à la dernière frontière de mot ≤ max (ellipse incluse dans le budget). */
export function truncateAtWord(text: string, max: number, ellipsis = "…"): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const budget = max - ellipsis.length;
  const cut = clean.slice(0, budget + 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > budget * 0.6 ? cut.slice(0, lastSpace) : clean.slice(0, budget))
    .replace(/[\s,;:—–-]+$/, "");
  return base + ellipsis;
}

/**
 * Titre de page ≤ 60 caractères rendus, sans jamais tronquer le mot-clé de tête.
 * Retourne une valeur directement utilisable dans `metadata.title`.
 */
export function fitTitle(title: string): Metadata["title"] {
  const clean = title.replace(/\s+/g, " ").trim();
  if (clean.length + SITE_SUFFIX.length <= TITLE_MAX) return clean;
  if (clean.length <= TITLE_MAX) return { absolute: clean };
  return { absolute: truncateAtWord(clean, TITLE_MAX) };
}

/**
 * Meta description ≤ 160 caractères : coupe de préférence en fin de phrase
 * (si la phrase dépasse 110 car.), sinon à la frontière de mot avec « … ».
 */
export function fitDescription(text: string, max = 160): string {
  const clean = stripMarkdown(text);
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max);
  const lastStop = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (lastStop >= 110) return window.slice(0, lastStop + 1);
  return truncateAtWord(clean, max);
}

/**
 * Image OG par défaut (route `src/app/opengraph-image.tsx`). À mettre dans
 * `openGraph.images` / `twitter.images` des pages qui redéfinissent `openGraph`
 * ou `twitter` sans image dédiée : Next.js remplace l'objet du layout en entier
 * (fusion superficielle), l'image du layout est alors perdue.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "deviens-marrant.fr — Apprends à devenir drôle et à avoir de la répartie",
} as const;

/**
 * Consignes robots d'une page introuvable (404). Seul `notFound()` pose la
 * consigne (`noindex` de Next) : une seule balise robots.
 * - `robots: null` retire le « index, follow » (et googleBot) du layout racine ;
 * - `other.bingbot: ""` neutralise le `bingbot: index, follow` du layout : Next
 *   fusionne `other` clé par clé et n'émet pas une meta au contenu vide.
 * À mettre dans `not-found.tsx` (head serveur de la 404) ET dans la branche
 * « introuvable » de `generateMetadata` (head reconstruite au navigateur).
 */
export const NOT_FOUND_ROBOTS = {
  robots: null,
  other: { bingbot: "" },
} satisfies Metadata;

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
const openQuote = (s: string) => (s.match(/«/g) ?? []).length > (s.match(/»/g) ?? []).length;

export function fitDescription(text: string, max = 160): string {
  const clean = stripMarkdown(text);
  if (clean.length <= max) return clean;
  // max + 1 : une phrase qui finit pile au caractère `max` (suivie d'une espace)
  // compte comme tenant dans la limite. Une phrase qui finit dans une citation
  // garde son » (« … rire. ») ; jamais de coupe avant lui (s20 : guillemet orphelin).
  const window = clean.slice(0, max + 1);
  const ends = [...window.matchAll(/[.!?](?: »)?(?= )/g)]
    .map((m) => m.index! + m[0].length)
    .filter((end) => end > 110 && end <= max && !openQuote(window.slice(0, end)));
  if (ends.length) return window.slice(0, ends[ends.length - 1]);
  const cut = truncateAtWord(clean, max);
  if (!openQuote(cut)) return cut;
  // coupe au mot tombée dans une citation : on s'arrête avant le guillemet ouvrant
  return cut.slice(0, cut.lastIndexOf("«")).replace(/[\s,;:]+$/, "") + "…";
}

/** Méta description (et OG/Twitter) d'une fiche vidéo : 155 car. max (s20). */
export const VIDEO_META_DESCRIPTION_MAX = 155;

/**
 * Méta d'une fiche vidéo : « Chaîne : description » (sans tiret cadratin, règle
 * commune n° 12). Les descriptions s20 font 250 à 420 car. : coupe en fin de
 * phrase (si elle dépasse 110 car.), sinon au dernier mot + « … ». Description
 * courte (< 110 car.) : complétée par la technique à retenir.
 */
export function buildVideoMetaDescription(video: {
  channelName: string;
  description: string;
  technique?: string | null;
}): string {
  const max = VIDEO_META_DESCRIPTION_MAX;
  const base = fitDescription(`${video.channelName} : ${video.description}`, max);
  return base.length < 110 && video.technique
    ? fitDescription(`${base} La technique à retenir : ${video.technique}.`, max)
    : base;
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
  alt: "deviens-marrant.fr : apprends à devenir drôle et à avoir de la répartie",
} as const;

/**
 * `openGraph` complet d'une page « website » (audit Ahrefs 07/10/2026 : 15 pages
 * sans og:type ou og:image). Un `openGraph` de page remplace celui du layout en
 * entier : type, locale, siteName et image par défaut sont donc reposés ici.
 */
export function websiteOpenGraph(og: {
  title: string;
  description: string;
  url: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    locale: "fr_FR",
    siteName: "deviens-marrant.fr",
    images: [DEFAULT_OG_IMAGE],
    ...og,
  };
}

/**
 * `twitter` propre à la page : sans lui, la page hérite du titre et de la
 * description Twitter de l'accueil (layout racine).
 */
export function websiteTwitter(tw: { title: string; description: string }): NonNullable<Metadata["twitter"]> {
  return { card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url], ...tw };
}

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

/**
 * Consignes robots d'une page valide hors index (lettre, carnet, inscription).
 * SEO s21 : `other.bingbot: ""` neutralise le `bingbot: index, follow` du layout
 * racine, sinon la page émet `robots: noindex` ET `bingbot: index` (contradictoire).
 */
export const NOINDEX_ROBOTS = {
  robots: { index: false, follow: false },
  other: { bingbot: "" },
} satisfies Metadata;

/**
 * Aperçu de partage propre à une page (SEO s21) : `og:url` et titres de la page,
 * sinon Facebook et LinkedIn rattachent le partage à l'accueil (layout racine).
 */
export function pageShareMeta(meta: { title: string; description: string; url: string }) {
  return {
    openGraph: websiteOpenGraph(meta),
    twitter: websiteTwitter({ title: meta.title, description: meta.description }),
  } satisfies Metadata;
}

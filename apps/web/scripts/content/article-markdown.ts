/**
 * Parsing d'un brouillon d'article (format docs/copy/articles-q4/*.md) vers
 * une ligne de la table BlogArticle. Module PUR (aucun accès disque ni base) :
 * utilisé par scripts/content/import-article.ts et testé par jest.
 *
 * Format attendu :
 *   ## Métadonnées
 *   - **slug** : `mon-slug`
 *   - **title** (54 car.) : Titre
 *   - **date de publication** : 2026-10-05 (lundi) · **category** : CATALOGUE · **readingTime** : 6 min
 *   ...
 *   ## Contenu de l'article (...)
 *   <markdown du champ `content`, FAQ finale « ## FAQ » + « ### Question ? » comprise>
 */
import { BLOG_CATEGORY_LABELS } from "@/lib/blog-labels";
import { splitTrailingFaq, type BlogFaq } from "@/lib/blog-faq";

export const EM_DASH = "—";
/** Heure UTC de publication par défaut : 05:00 UTC = 7 h à Paris l'été, 6 h l'hiver. */
export const DEFAULT_PUBLISH_HOUR_UTC = 5;

export interface ParsedArticle {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  targetKeyword: string;
  category: string;
  readingTime: string;
  /** YYYY-MM-DD */
  publishDate: string;
  /** Markdown stocké tel quel dans `content` (FAQ finale incluse, rendue par lib/blog-faq). */
  content: string;
  faqs: BlogFaq[];
  /** Chemins internes normalisés (sans domaine, ancre ni query), dans l'ordre d'apparition. */
  internalLinks: string[];
}

/** Ligne BlogArticle à insérer (colonnes Prisma). */
export interface BlogArticleRow {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readingTime: string;
  targetKeyword: string;
  metaTitle: null;
  metaDescription: string;
  isPublished: false;
  publishedAt: string;
  generatedByAI: false;
}

const REQUIRED_KEYS: Record<string, keyof ParsedArticle> = {
  slug: "slug",
  title: "title",
  metadescription: "metaDescription",
  excerpt: "excerpt",
  "mot-clé principal": "targetKeyword",
  "date de publication": "publishDate",
  category: "category",
  readingtime: "readingTime",
};

/** Lit les puces « - **clé** (note) : valeur · **clé2** : valeur2 » de la section Métadonnées. */
export function parseMetadata(markdown: string): Record<string, string> {
  const start = markdown.search(/^## Métadonnées\s*$/m);
  if (start === -1) throw new Error("Section « ## Métadonnées » introuvable.");
  const rest = markdown.slice(start).split("\n").slice(1);
  const meta: Record<string, string> = {};
  for (const line of rest) {
    if (/^(## |---\s*$)/.test(line)) break;
    if (!line.startsWith("- ")) continue;
    for (const segment of line.slice(2).split(/\s+·\s+(?=\*\*)/)) {
      const m = /^\*\*(.+?)\*\*(?:\s*\([^)]*\))?\s*:\s*(.*)$/.exec(segment.trim());
      if (!m) continue;
      meta[m[1].trim().toLowerCase()] = m[2].trim().replace(/^`([^`]*)`$/, "$1").trim();
    }
  }
  return meta;
}

export function extractContent(markdown: string): string {
  const m = /^## Contenu de l'article.*$/m.exec(markdown);
  if (!m) throw new Error("Section « ## Contenu de l'article » introuvable.");
  return markdown.slice(m.index + m[0].length).trim();
}

const SITE_URL = /^https?:\/\/(?:www\.)?deviens-marrant\.fr(?=\/|$)/i;

export function normalizeInternalPath(href: string): string | null {
  const raw = href.trim();
  let path: string;
  if (SITE_URL.test(raw)) path = raw.replace(SITE_URL, "") || "/";
  else if (raw.startsWith("/") && !raw.startsWith("//")) path = raw;
  else return null;
  path = path.split("#")[0].split("?")[0];
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path || "/";
}

export function extractInternalLinks(content: string): string[] {
  const links: string[] = [];
  for (const m of Array.from(content.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g))) {
    const path = normalizeInternalPath(m[1]);
    if (path && !links.includes(path)) links.push(path);
  }
  return links;
}

export function parseArticleMarkdown(markdown: string): ParsedArticle {
  const meta = parseMetadata(markdown);
  const values: Partial<Record<keyof ParsedArticle, string>> = {};
  const missing: string[] = [];
  for (const [key, field] of Object.entries(REQUIRED_KEYS)) {
    if (meta[key]) values[field] = meta[key];
    else missing.push(key);
  }
  if (missing.length > 0) throw new Error(`Métadonnées manquantes : ${missing.join(", ")}.`);

  const date = /^(\d{4}-\d{2}-\d{2})\b/.exec(values.publishDate ?? "");
  if (!date) throw new Error(`Date de publication illisible : « ${values.publishDate} » (attendu AAAA-MM-JJ).`);

  const content = extractContent(markdown);
  return {
    slug: values.slug!,
    title: values.title!,
    metaDescription: values.metaDescription!,
    excerpt: values.excerpt!,
    targetKeyword: values.targetKeyword!,
    category: values.category!,
    readingTime: values.readingTime!,
    publishDate: date[1],
    content,
    faqs: splitTrailingFaq(content).faqs,
    internalLinks: extractInternalLinks(content),
  };
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

/** Début (lundi 00:00 UTC) de la semaine ISO : même borne que lib/scheduler/prepared-content. */
export function startOfIsoWeekUtc(now: Date): Date {
  const dayNum = now.getUTCDay() || 7;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (dayNum - 1)));
}

export function publishedAtFor(publishDate: string, hourUtc: number = DEFAULT_PUBLISH_HOUR_UTC): Date {
  const [y, m, d] = publishDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, hourUtc, 0, 0));
  if (Number.isNaN(date.getTime()) || date.getUTCDate() !== d || date.getUTCMonth() !== m - 1) {
    throw new Error(`Date de publication invalide : ${publishDate}.`);
  }
  return date;
}

/** Contrôles sans base ni disque : format, tiret cadratin, catégorie, date, FAQ. */
export function validateArticle(article: ParsedArticle, publishedAt: Date, now: Date): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    errors.push(`Slug invalide « ${article.slug} » (minuscules, chiffres et tirets uniquement).`);
  }

  const fields: [string, string][] = [
    ["title", article.title],
    ["metaDescription", article.metaDescription],
    ["excerpt", article.excerpt],
    ["mot-clé principal", article.targetKeyword],
  ];
  for (const [name, value] of fields) {
    if (value.includes(EM_DASH)) errors.push(`Tiret cadratin (${EM_DASH}) dans ${name}.`);
  }
  article.content.split("\n").forEach((line, i) => {
    if (line.includes(EM_DASH)) {
      errors.push(`Tiret cadratin (${EM_DASH}) dans le contenu, ligne ${i + 1} : « ${line.trim().slice(0, 80)} ».`);
    }
  });

  if (!(article.category in BLOG_CATEGORY_LABELS)) {
    errors.push(`Catégorie inconnue « ${article.category} » (attendu : ${Object.keys(BLOG_CATEGORY_LABELS).join(", ")}).`);
  }
  if (!/^\d{1,2} min$/.test(article.readingTime)) {
    errors.push(`readingTime « ${article.readingTime} » : format attendu « N min ».`);
  }
  if (/^# /m.test(article.content)) {
    errors.push("Le contenu contient un titre H1 (« # ») : le H1 de la page vient du champ title.");
  }

  if (publishedAt.getTime() < startOfIsoWeekUtc(now).getTime()) {
    errors.push(
      `Date de publication ${article.publishDate} antérieure à la semaine en cours : la publication programmée ne la publierait jamais.`,
    );
  } else if (publishedAt.getTime() <= now.getTime()) {
    warnings.push(`Date de publication ${article.publishDate} déjà échue : l'article sera publié au prochain tick (15 min).`);
  }
  if (publishedAt.getUTCDay() !== 1) warnings.push(`${article.publishDate} n'est pas un lundi (calendrier : 1 article par lundi).`);

  const hasFaqHeading = /^##[ \t]+(?:FAQ|Questions fréquentes)[ \t]*$/im.test(article.content);
  if (hasFaqHeading && article.faqs.length === 0) {
    errors.push(
      "Section FAQ non conforme : elle doit être la dernière H2, avec des « ### Question » suivies d'une réponse en texte brut (sans lien, gras ni liste).",
    );
  } else if (!hasFaqHeading) {
    warnings.push("Aucune FAQ en fin d'article (pas de JSON-LD FAQPage).");
  }

  if (article.title.length > 60) warnings.push(`title de ${article.title.length} caractères (> 60) : <title> sans la marque.`);
  if (article.metaDescription.length > 160) {
    warnings.push(`metaDescription de ${article.metaDescription.length} caractères (> 160).`);
  }
  return { errors, warnings };
}

export function toBlogArticleRow(article: ParsedArticle, publishedAt: Date): BlogArticleRow {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    readingTime: article.readingTime,
    targetKeyword: article.targetKeyword,
    // null : la page affiche `metaTitle || title` comme H1, le title du brouillon sert aux deux.
    metaTitle: null,
    metaDescription: article.metaDescription,
    isPublished: false,
    publishedAt: publishedAt.toISOString(),
    generatedByAI: false,
  };
}

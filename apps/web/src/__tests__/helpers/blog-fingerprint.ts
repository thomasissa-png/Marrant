/**
 * Empreintes d'un article de blog statique, pour prouver qu'une passe
 * « ponctuation seulement » (retrait des tirets cadratins, s12) n'a changé
 * AUCUN mot, titre, slug, lien, chiffre ni question de FAQ.
 *
 * La baseline (`__tests__/lib/fixtures/blog-em-dash-baseline.json`) a été
 * calculée sur la version d'avant la passe ; le test compare les empreintes de
 * la version courante à cette baseline.
 */
import { createHash } from "crypto";
import type { BlogArticle } from "@/lib/blog-articles";

export interface BlogFingerprint {
  /** Suite des mots (lettres/chiffres), ponctuation et espaces retirés. */
  words: string;
  wordCount: number;
  /** Lignes de titre Markdown (#, ##, ###) à l'identique. */
  headings: string;
  /** Liens Markdown [texte](url) à l'identique, dans l'ordre. */
  links: string;
  /** Nombres (chiffres) dans l'ordre. */
  numbers: string;
  /** title + excerpt + date + readingTime + category + questions de FAQ. */
  meta: string;
}

const sha = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

/** Texte « corps » d'un article : contenu Markdown + réponses de FAQ. */
export function bodyTexts(a: BlogArticle): string[] {
  return [a.content, ...(a.faqs ?? []).map((f) => f.answer)];
}

export function wordsOf(text: string): string[] {
  return text.normalize("NFC").match(/[\p{L}\p{N}]+/gu) ?? [];
}

export function fingerprint(a: BlogArticle): BlogFingerprint {
  const body = bodyTexts(a).join("\n");
  const words = wordsOf(body);
  const headings = a.content.split("\n").filter((l) => /^\s{0,3}#{1,6}\s/.test(l));
  const links = body.match(/!?\[[^\]]*\]\([^)]*\)/g) ?? [];
  const numbers = body.match(/\d+(?:[.,]\d+)?/g) ?? [];
  const meta = [
    a.slug,
    a.title,
    a.excerpt,
    a.date,
    a.updatedAt ?? "",
    a.readingTime,
    a.category,
    ...(a.faqs ?? []).map((f) => f.question),
  ];
  return {
    words: sha(words.join(" ")),
    wordCount: words.length,
    headings: sha(headings.join("\n")),
    links: sha(links.join("\n")),
    numbers: sha(numbers.join(" ")),
    meta: sha(meta.join("\n")),
  };
}

/**
 * @jest-environment node
 *
 * Contrôle P0 « mesurer le diff réel » de la passe s12 de retrait des tirets
 * cadratins dans les articles statiques (règle projet n°12).
 *
 * Pour chaque article de `blog-articles.ts`, comparé à la baseline calculée
 * AVANT la passe :
 *  - la suite de MOTS du corps (contenu + réponses FAQ), ponctuation et espaces
 *    retirés, est strictement identique (sensible à la casse) ;
 *  - titres Markdown, liens, chiffres, slug/title/excerpt/questions FAQ
 *    identiques ;
 *  - plus aucun « — » dans le corps (les titres et l'excerpt, intouchables
 *    SEO, gardent les leurs).
 */
import { blogArticles } from "@/lib/blog-articles";
import { stripEmDashes } from "@/lib/em-dash";
import baseline from "./fixtures/blog-em-dash-baseline.json";
import { bodyTexts, fingerprint } from "../helpers/blog-fingerprint";

type Baseline = Record<string, ReturnType<typeof fingerprint> & { emDashesBefore: number }>;
const base = baseline.articles as Baseline;

const isHeading = (l: string) => /^\s{0,3}#{1,6}\s/.test(l);

describe("blog statique : retrait des tirets cadratins (ponctuation seulement)", () => {
  it("couvre exactement les articles de la baseline", () => {
    expect(blogArticles.map((a) => a.slug).sort()).toEqual(Object.keys(base).sort());
    expect(baseline._meta.emDashesBefore).toBe(467);
  });

  describe.each(blogArticles.map((a) => [a.slug, a] as const))("%s", (slug, article) => {
    const now = fingerprint(article);
    const before = base[slug];

    it("suite de mots strictement identique", () => {
      expect(now.wordCount).toBe(before.wordCount);
      expect(now.words).toBe(before.words);
    });

    it("titres, liens, chiffres et métadonnées identiques", () => {
      expect(now.headings).toBe(before.headings);
      expect(now.links).toBe(before.links);
      expect(now.numbers).toBe(before.numbers);
      expect(now.meta).toBe(before.meta);
    });

    it("aucun tiret cadratin dans le corps", () => {
      const body = bodyTexts(article)
        .join("\n")
        .split("\n")
        .filter((l) => !isHeading(l));
      expect(body.filter((l) => l.includes("—"))).toEqual([]);
    });

    it("la passe est stable (stripEmDashes ne change plus rien)", () => {
      expect(stripEmDashes(article.content)).toBe(article.content);
    });
  });
});

/**
 * @jest-environment node
 *
 * Audit des articles du code (s20, 12/10/2026) : application des corrections
 * validées à l'aveugle (`docs/copy/application-audit-code-s20.md`).
 *
 * La fixture `blog-audit-code-s20.json` est extraite par script des documents
 * de corrections (avant / après exacts, partie 1, partie 2, textes finaux C1-C3)
 * et de la passe mécanique des tirets d'intertitres (règle 4).
 *  - aucune chaîne « avant » ne subsiste, chaque « après » est présent ;
 *  - plus aucun « — » dans les intertitres H2/H3 des articles servis ;
 *  - toutes les ancres internes (#…) pointent vers un id rendu ;
 *  - updatedAt = date réelle de modification pour les articles touchés.
 */
import { blogArticles, type BlogArticle } from "@/lib/blog-articles";
import { SEO_REDIRECTS } from "@/lib/seo-redirects";
import { renderMarkdown } from "@/components/ui/markdown-renderer";
import audit from "./fixtures/blog-audit-code-s20.json";

const bySlug = new Map(blogArticles.map((a) => [a.slug, a] as const));
const redirected = new Set(
  SEO_REDIRECTS.map((r) => r.source.match(/^\/blog\/([a-z0-9-]+)$/)?.[1]).filter(Boolean),
);
const served = blogArticles.filter((a) => !redirected.has(a.slug));
const corpus = (a: BlogArticle) => [a.content, ...(a.faqs ?? []).map((f) => f.answer)].join("\n");
const allText = blogArticles.map(corpus).join("\n");
const idsOf = (a: BlogArticle) =>
  new Set(Array.from(renderMarkdown(a.content).matchAll(/\sid="([^"]+)"/g), (m) => m[1]));

describe("audit code s20 : corrections appliquées", () => {
  it("fixture complète (166 remplacements, 49 intertitres, 24 articles)", () => {
    expect(audit.pairs).toHaveLength(166);
    expect(audit.headings).toHaveLength(49);
    expect(audit.modified).toHaveLength(24);
  });

  it.each(audit.pairs.map((p) => [p.id, p] as const))("%s : avant absent, après présent", (_id, p) => {
    expect(allText.includes(p.avant)).toBe(false);
    const article = bySlug.get(p.slug);
    expect(article).toBeDefined();
    expect(corpus(article as BlogArticle)).toContain(p.apres);
  });

  it.each(audit.headings.map((h) => [h.apres, h] as const))("intertitre « %s »", (_t, h) => {
    const lines = (bySlug.get(h.slug) as BlogArticle).content.split("\n");
    expect(lines).toContain(h.apres);
    expect(lines).not.toContain(h.avant);
  });

  it("plus aucun tiret cadratin dans les intertitres H2/H3 des articles servis", () => {
    const fautifs = served.flatMap((a) =>
      a.content.split("\n").filter((l) => /^#{2,3} /.test(l) && l.includes("—")).map((l) => `${a.slug}: ${l}`),
    );
    expect(fautifs).toEqual([]);
  });

  it("toutes les ancres internes (#…, /blog/slug#…) sont résolues", () => {
    const broken: string[] = [];
    let checked = 0;
    for (const a of blogArticles) {
      for (const m of corpus(a).matchAll(/\]\((\/blog\/([a-z0-9-]+))?#([^)\s]+)\)/g)) {
        checked++;
        const target = m[2] ? bySlug.get(m[2]) : a;
        if (!target || !idsOf(target).has(m[3])) broken.push(`${a.slug} -> ${m[0]}`);
      }
    }
    // Sommaire de meilleures-blagues-droles-2026 : 7 ancres au minimum.
    expect(checked).toBeGreaterThanOrEqual(7);
    expect(broken).toEqual([]);
  });

  it("H2 renommé de l'article humour noir : nouvelle ancre, ancienne disparue", () => {
    const ids = idsOf(bySlug.get("humour-noir-utiliser-sans-blesser") as BlogArticle);
    expect(ids.has("3-exemples-decortiques")).toBe(true);
    expect(ids.has("3-sketches-decortiques")).toBe(false);
  });

  it.each(audit.modified)("%s : updatedAt = 2026-10-12", (slug) => {
    expect(bySlug.get(slug)?.updatedAt).toBe(audit.updatedAt);
  });
});

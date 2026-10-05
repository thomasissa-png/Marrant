/**
 * Notation iter3, E1 et E2 : typographie au rendu, sans changer le texte visible.
 * - E2 : mot composé court (Post-it, week-end) jamais coupé au trait d'union,
 *   via un span nowrap (aucun caractère ajouté, liens et attributs intacts).
 * - E1 : frTypo idempotente (jamais 2 insécables d'affilée).
 */
import { keepCompoundsTogether, renderMarkdown } from "@/components/ui/markdown-renderer";
import { frTypo } from "@/lib/fr-typo";
import { blogArticles } from "@/lib/blog-articles";

const NBSP = String.fromCharCode(0xa0);
const NOWRAP_RE = /<span class="whitespace-nowrap">([^<]*)<\/span>/g;
const stripTags = (html: string) => html.replace(/<[^>]*>/g, "");
const unwrap = (html: string) => html.replace(NOWRAP_RE, "$1");

describe("E2 : mots composés courts jamais coupés", () => {
  it("ne coupe pas un mot composé court, sans toucher aux liens", () => {
    const html = renderMarkdown("Un Post-it et un [lien](/blog/blague-du-jour).");
    expect(html).toContain('<span class="whitespace-nowrap">Post-it</span>');
    expect(html).toContain('href="/blog/blague-du-jour"');
  });

  it("protège week-end, Wi-Fi et un lien dont le libellé est composé", () => {
    const html = renderMarkdown("Ce week-end, le Wi-Fi lâche. [Mots-clés](/blog/x-y)");
    expect(html).toContain('<span class="whitespace-nowrap">week-end</span>');
    expect(html).toContain('<span class="whitespace-nowrap">Wi-Fi</span>');
    expect(html).toContain('href="/blog/x-y"');
    expect(html).toContain('<span class="whitespace-nowrap">Mots-clés</span></a>');
  });

  it("laisse se couper les mots longs et les chaînes à plusieurs traits d'union", () => {
    const html = renderMarkdown("La pré-production, c'est-à-dire un vis-à-vis.");
    expect(html).not.toContain(">pré-production<");
    expect(html).not.toMatch(/whitespace-nowrap">(est|à)-/);
    expect(html).not.toContain("vis-à-vis</span>");
  });

  it("ne touche à aucune balise ni attribut (segments impairs du split)", () => {
    const input = '<a href="/blog/week-end" class="text-accent-link">Post-it</a>';
    expect(keepCompoundsTogether(input)).toBe(
      '<a href="/blog/week-end" class="text-accent-link"><span class="whitespace-nowrap">Post-it</span></a>',
    );
  });

  it("tous les articles : seuls des spans nowrap sont ajoutés, texte visible identique", () => {
    for (const article of blogArticles) {
      const html = renderMarkdown(article.content, { shareJokes: true });
      const before = unwrap(html);
      // Rendu d'avant E2 + la passe = rendu actuel : la passe n'ajoute que les spans.
      expect(keepCompoundsTogether(before)).toBe(html);
      expect(stripTags(html)).toBe(stripTags(before));
      // Aucun caractère ajouté autour des traits d'union (ni U+2011, ni insécable).
      expect(html).not.toContain(String.fromCharCode(0x2011));
      for (const [, word] of html.matchAll(NOWRAP_RE)) {
        expect(word).toMatch(/^[A-Za-zÀ-ÖØ-öø-ÿŒœ]{1,8}-[A-Za-zÀ-ÖØ-öø-ÿŒœ]{1,8}$/);
      }
      // Aucun span glissé dans un attribut (href, data-text, class).
      for (const [, value] of html.matchAll(/="([^"]*)"/g)) expect(value).not.toContain("<");
    }
  });

  it("meilleures-blagues : Post-it (n°2) et week-end (n°24) insécables, vannes intactes", () => {
    const article = blogArticles.find((a) => a.slug === "meilleures-blagues-droles-2026")!;
    const html = renderMarkdown(article.content, { shareJokes: true });
    const block = (n: number) => html.split(`id="vanne-${n}"`)[1].split('id="vanne-')[0];
    expect(block(2)).toContain('<span class="whitespace-nowrap">Post-it</span> pour se rappeler');
    expect(block(2)).toContain('des <span class="whitespace-nowrap">Post-it</span>.');
    expect(block(24)).toContain('<span class="whitespace-nowrap">week-end</span>');
    // data-text du partage = texte stocké, sans balise.
    expect(html).toContain("data-text=\"« Mon coloc a mis un Post-it pour se rappeler d'acheter des Post-it.");
  });
});

describe("E1 : frTypo sans double insécable", () => {
  it("est idempotente", () => {
    const samples = [
      "Comment trouver des blagues drôles à raconter ?",
      "Comment faire rire une fille : 7 techniques",
      "Il dit « bonjour » ; puis « au revoir » !",
    ];
    for (const s of samples) expect(frTypo(frTypo(s))).toBe(frTypo(s));
  });

  it("garde une seule insécable si le texte en contient déjà une", () => {
    expect(frTypo(`désespoir.${NBSP}»`)).toBe(`désespoir.${NBSP}»`);
    expect(frTypo(`raconter${NBSP} ?`)).toBe(`raconter${NBSP}?`);
    expect(frTypo(`raconter ${NBSP}?`)).toBe(`raconter${NBSP}?`);
    expect(frTypo(`«${NBSP} mot`)).toBe(`«${NBSP}mot`);
    expect(frTypo("raconter ?")).not.toContain(`${NBSP}${NBSP}`);
  });
});

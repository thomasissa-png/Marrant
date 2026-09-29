import { frenchQuotes, renderMarkdown } from "@/components/ui/markdown-renderer";
import { frTypo } from "@/lib/fr-typo";
import { blogArticles } from "@/lib/blog-articles";
import blogArticleRewrites from "@/data/blog-article-rewrites.json";

const NBSP = String.fromCharCode(0xa0);

describe("frTypo", () => {
  it("lie la ponctuation haute, les guillemets et les nombres", () => {
    expect(frTypo("Comment devenir drôle : le guide ?")).toBe(
      `Comment devenir drôle${NBSP}: le guide${NBSP}?`
    );
    expect(frTypo("le « sens de l'humour »")).toBe(`le «${NBSP}sens de l'humour${NBSP}»`);
    expect(frTypo("5 méthodes en 7 min")).toBe(`5${NBSP}méthodes en 7${NBSP}min`);
  });

  it("ne touche pas aux URL", () => {
    expect(frTypo("https://deviens-marrant.fr/blog?x=1")).toBe("https://deviens-marrant.fr/blog?x=1");
  });
});

describe("renderMarkdown", () => {
  it("rend les citations et les séparateurs", () => {
    const html = renderMarkdown("> **En bref :** texte\n\n---\n\nSuite");
    expect(html).toContain("<blockquote");
    expect(html).toContain("<strong>En bref");
    expect(html).toContain("<hr");
    expect(html).not.toContain("&gt;");
    expect(html).not.toContain("---");
  });

  it("sépare une ligne d'intro et la liste qui suit", () => {
    const html = renderMarkdown("Les 2 types :\n1. Absurde\n2. Noir\n\nCe n'est pas :\n- Être méchant");
    expect(html).toMatch(/<p[^>]*>Les 2.types.:<\/p><ol/);
    expect(html).toContain("<li>Absurde</li>");
    expect(html).toMatch(/<\/p><ul[^>]*><li>Être méchant<\/li><\/ul>/);
  });

  it("rend une phrase d'intro suivie d'une citation", () => {
    const html = renderMarkdown('**La phrase d\'accroche :**\n> "Je suis encore en mode week-end"');
    expect(html).toMatch(/<\/p><blockquote/);
  });

  it("ne garde que la 1re ligne dans le titre", () => {
    const html = renderMarkdown("### Sketch 1\nElle parle de thérapie.");
    expect(html).toMatch(/<h3[^>]*>Sketch.1<\/h3><p/);
  });

  it("ne laisse aucun markdown brut dans les articles statiques", () => {
    for (const article of blogArticles) {
      const html = renderMarkdown(article.content);
      expect(html).not.toMatch(/>&gt;/);
      expect(html).not.toMatch(/>-{3,}/);
      expect(html).not.toMatch(/<br\/>(- |\d+\. )/);
    }
  });
});

describe("frenchQuotes (guillemets au rendu)", () => {
  it("convertit les paires équilibrées en « … » avec insécables", () => {
    expect(frenchQuotes('Il dit "bonjour" puis "au revoir".')).toBe(
      `Il dit «${NBSP}bonjour${NBSP}» puis «${NBSP}au revoir${NBSP}».`
    );
  });

  it("laisse le texte intact si les guillemets ne sont pas équilibrés", () => {
    expect(frenchQuotes('Un "seul guillemet')).toBe('Un "seul guillemet');
    expect(frenchQuotes('"a" et "b')).toBe('"a" et "b');
  });

  it("ne touche ni aux URL de liens ni au code inline", () => {
    expect(frenchQuotes('Lis "ça" [ici](/blog?q="x") et `"code"`')).toBe(
      `Lis «${NBSP}ça${NBSP}» [ici](/blog?q="x") et \`"code"\``
    );
  });

  it("gère une citation dans une citation sans inverser les guillemets", () => {
    expect(frenchQuotes('"Bref, il dit "pas de moutarde". Ah, au restaurant."')).toBe(
      `«${NBSP}Bref, il dit “pas de moutarde”. Ah, au restaurant.${NBSP}»`
    );
    // Contenu réel (réécriture s11 appliquée en base au démarrage)
    const rewrite = blogArticleRewrites.rewrites.find((r) => r.slug === "comment-raconter-une-blague-sans-la-rater");
    const html = renderMarkdown(rewrite?.content?.split("\n\n")[0] ?? "");
    expect(html).toContain("“pas de moutarde”");
    expect(html).not.toMatch(/»\s*pas de moutarde/);
  });

  it("produit des attributs HTML intacts dans le rendu", () => {
    const html = renderMarkdown('Un [lien "cité"](/parcours) et "une vanne".');
    expect(html).toContain('<a href="/parcours" class="text-accent-link hover:underline">');
    expect(html).toContain(`lien «${NBSP}cité${NBSP}»`);
    expect(html).toContain(`«${NBSP}une vanne${NBSP}»`);
  });
});

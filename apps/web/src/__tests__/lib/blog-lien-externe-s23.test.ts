import { renderMarkdownSections } from "@/components/ui/markdown-renderer";
import { getArticleBySlug } from "@/lib/blog-articles";
import { PARAGRAPHE_FLORINE_S23 as PARAGRAPHE, URL_FLORINE } from "../helpers/blog-ajouts-posterieurs";

describe("s23 : mention éditoriale dans « Humour quotidien : 8 habitudes simples »", () => {
  const article = getArticleBySlug("humour-quotidien-8-habitudes");

  it("le paragraphe exact est présent une seule fois, après l'habitude 6 et avant l'habitude 7", () => {
    expect(article).toBeDefined();
    const content = article!.content;
    expect(content.split(PARAGRAPHE).length - 1).toBe(1);
    const fin6 = content.indexOf("Un trait d'esprit, pas un festival de l'auto-flagellation.");
    const para = content.indexOf(PARAGRAPHE);
    const h7 = content.indexOf("## Habitude 7 : Le callback");
    expect(fin6).toBeGreaterThan(-1);
    expect(fin6).toBeLessThan(para);
    expect(para).toBeLessThan(h7);
  });

  it("date de mise à jour au 5 novembre 2026", () => {
    expect(article!.updatedAt).toBe("2026-11-05");
  });

  it("lien rendu avec l'ancre exacte, dofollow, convention des liens externes du site", () => {
    const html = renderMarkdownSections(PARAGRAPHE).map((s) => s.html).join("");
    const lien = html.match(/<a [^>]*>Les bienfaits du rire au quotidien<\/a>/)?.[0] ?? "";
    expect(lien).toContain(`href="${URL_FLORINE}"`);
    expect(lien).toContain('target="_blank"');
    expect(lien).toContain('rel="noopener noreferrer"');
    expect(lien).not.toMatch(/nofollow|sponsored|ugc/);
  });

  it("les liens internes du blog ne changent pas (ni target ni rel)", () => {
    const html = renderMarkdownSections("Lis [l'autodérision](/blog/autoderision-interactions).")
      .map((s) => s.html)
      .join("");
    expect(html).toContain('<a href="/blog/autoderision-interactions" class="text-accent-link underline underline-offset-2">');
    expect(html).not.toContain("target=");
    expect(html).not.toContain("rel=");
  });
});

/**
 * @jest-environment node
 *
 * Publication programmée (s14) : un article en base n'est jamais exposé avant
 * d'être publié ET daté du passé ; FAQ stockée en fin de `content`.
 */
import { isBlogArticleVisible, visibleBlogArticleWhere } from "@/lib/blog-visibility";
import { splitTrailingFaq } from "@/lib/blog-faq";

const NOW = new Date("2026-10-05T06:00:00Z");

describe("visibilité d'un article en base", () => {
  it("filtre Prisma : publié ET (sans date OU date échue)", () => {
    expect(visibleBlogArticleWhere(NOW)).toEqual({
      isPublished: true,
      OR: [{ publishedAt: null }, { publishedAt: { lte: NOW } }],
    });
  });

  it.each<[boolean, Date | null, boolean, string]>([
    [false, new Date("2026-10-01T00:00:00Z"), false, "non publié, date passée"],
    [false, new Date("2026-10-12T05:00:00Z"), false, "planifié (non publié, futur)"],
    [true, new Date("2026-10-12T05:00:00Z"), false, "publié par erreur avant sa date"],
    [true, new Date("2026-10-05T05:00:00Z"), true, "publié, date échue"],
    [true, null, true, "publié, ancien article sans date"],
  ])("isPublished=%s publishedAt=%s → %s (%s)", (isPublished, publishedAt, expected) => {
    expect(isBlogArticleVisible({ isPublished, publishedAt }, NOW)).toBe(expected);
  });
});

describe("splitTrailingFaq", () => {
  const body = "## Section\n\nTexte avec [lien](/vannes).";

  it("extrait la FAQ finale (## FAQ + ### questions) et la retire du markdown", () => {
    const content = `${body}\n\n## FAQ\n\n### Première question ?\n\nRéponse une,\nsur deux lignes.\n\nSecond paragraphe.\n\n### Deuxième question ?\n\nRéponse deux.\n`;
    expect(splitTrailingFaq(content)).toEqual({
      content: body,
      faqs: [
        { question: "Première question ?", answer: "Réponse une, sur deux lignes. Second paragraphe." },
        { question: "Deuxième question ?", answer: "Réponse deux." },
      ],
    });
  });

  it("accepte « ## Questions fréquentes »", () => {
    expect(splitTrailingFaq(`${body}\n\n## Questions fréquentes\n\n### Q ?\n\nR.`).faqs).toHaveLength(1);
  });

  it.each([
    ["pas de FAQ", body],
    ["FAQ suivie d'une autre H2", `${body}\n\n## FAQ\n\n### Q ?\n\nR.\n\n## Conclusion\n\nFin.`],
    ["question sans réponse", `${body}\n\n## FAQ\n\n### Q ?\n`],
    ["lien markdown dans une réponse", `${body}\n\n## FAQ\n\n### Q ?\n\nVoir [ici](/blog).`],
    ["texte libre avant la première question", `${body}\n\n## FAQ\n\nIntro.\n\n### Q ?\n\nR.`],
  ])("%s : contenu intact, FAQ vide", (_label, content) => {
    expect(splitTrailingFaq(content)).toEqual({ content, faqs: [] });
  });
});

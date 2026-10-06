/**
 * s15 (06/10) : l'image Open Graph d'un article EN BASE affichait « Article introuvable »
 * (carte X du relais Halloween). Elle doit utiliser la même résolution que la page.
 */
jest.mock("next/og", () => ({
  ImageResponse: class {
    element: unknown;
    constructor(element: unknown) {
      this.element = element;
    }
  },
}));
jest.mock("@/lib/blog-article-page", () => ({
  findBlogArticle: jest.fn(),
}));

import OgImage from "@/app/(dashboard)/blog/[slug]/opengraph-image";
import { findBlogArticle } from "@/lib/blog-article-page";

const texte = (n: unknown): string => {
  if (n === null || n === undefined || typeof n === "boolean") return "";
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(texte).join(" ");
  const props = (n as { props?: { children?: unknown } }).props;
  return props ? texte(props.children) : "";
};

describe("opengraph-image des articles du blog", () => {
  it("article en base : titre réel, jamais « Article introuvable »", async () => {
    (findBlogArticle as jest.Mock).mockResolvedValue({
      article: { title: "Blagues d'Halloween : 8 vannes pour ta soirée déguisée", category: "Saison" },
      isVisible: true,
    });
    const img = (await OgImage({ params: { slug: "blagues-halloween-soiree-deguisee" } })) as unknown as { element: unknown };
    const t = texte(img.element);
    expect(t).toContain("Blagues d'Halloween : 8 vannes pour ta soirée déguisée");
    expect(t).not.toContain("Article introuvable");
  });

  it("article absent ou base en erreur : libellé du blog, pas d'erreur", async () => {
    (findBlogArticle as jest.Mock).mockRejectedValue(new Error("base indisponible"));
    const img = (await OgImage({ params: { slug: "inconnu" } })) as unknown as { element: unknown };
    const t = texte(img.element);
    expect(t).toContain("Le blog humour et répartie");
    expect(t).not.toContain("Article introuvable");
  });
});

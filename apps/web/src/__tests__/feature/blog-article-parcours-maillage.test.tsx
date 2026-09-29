import { render, screen } from "@testing-library/react";
import { BlogArticleParcoursMaillage } from "@/components/blog/blog-article-parcours-maillage";

describe("BlogArticleParcoursMaillage", () => {
  it("suggère /parcours/repartie pour un article du cluster techniques-repartie", () => {
    render(
      <BlogArticleParcoursMaillage
        articleSlug="comment-avoir-de-la-repartie"
        articleCategory="REPARTIE"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/parcours/repartie");
  });

  it("suggère /parcours/confiance pour un article du cluster douleurs-personas", () => {
    render(
      <BlogArticleParcoursMaillage
        articleSlug="je-suis-pas-drole-comment-changer"
        articleCategory="PSYCHOLOGIE"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/parcours/confiance");
  });

  it("suggère /parcours/machine-a-cafe pour un article du cluster humour-contexte", () => {
    render(
      <BlogArticleParcoursMaillage
        articleSlug="blagues-travail-faire-rire-pro"
        articleCategory="CONTEXTE"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/parcours/machine-a-cafe");
  });

  it("suggère /parcours/machine-a-cafe pour le cluster fort-volume", () => {
    render(
      <BlogArticleParcoursMaillage
        articleSlug="meilleures-blagues-droles"
        articleCategory="CATALOGUE"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/parcours/machine-a-cafe");
  });

  it("fallback /parcours/repartie pour un slug inconnu", () => {
    render(
      <BlogArticleParcoursMaillage
        articleSlug="article-inconnu-dans-aucun-cluster"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/parcours/repartie");
  });

  it("ne mentionne jamais d'IA dans le texte (règle absolue projet)", () => {
    const { container } = render(
      <BlogArticleParcoursMaillage
        articleSlug="comment-avoir-de-la-repartie"
        articleCategory="REPARTIE"
      />,
    );
    const text = container.textContent?.toLowerCase() || "";
    expect(text).not.toContain("intelligence artificielle");
    expect(text).not.toContain(" ia ");
    expect(text).not.toContain("gpt");
    expect(text).not.toContain("chatgpt");
  });

  it("est marqué comme aside/complementary pour l'accessibilité", () => {
    render(
      <BlogArticleParcoursMaillage
        articleSlug="comment-avoir-de-la-repartie"
        articleCategory="REPARTIE"
      />,
    );
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import AnatomieVannePage from "@/app/(dashboard)/anatomie-vanne/page";

describe("AnatomieVannePage", () => {
  it("renders the main heading", () => {
    render(<AnatomieVannePage />);
    expect(
      screen.getByText("Anatomie d'une vanne"),
    ).toBeInTheDocument();
  });

  it("renders the 3 structure parts", () => {
    render(<AnatomieVannePage />);
    expect(screen.getByText("Le Setup")).toBeInTheDocument();
    expect(screen.getByText("Le Pivot")).toBeInTheDocument();
    expect(screen.getByText("La Punchline")).toBeInTheDocument();
  });

  it("renders the 3 dissected joke examples", () => {
    render(<AnatomieVannePage />);
    expect(screen.getByText("3 vannes décortiquées")).toBeInTheDocument();
    expect(screen.getByText("Observation")).toBeInTheDocument();
    expect(screen.getByText("Autodérision")).toBeInTheDocument();
    expect(screen.getByText("Absurde")).toBeInTheDocument();
  });

  it("renders the 6 types of pivots", () => {
    render(<AnatomieVannePage />);
    expect(screen.getByText("Les 6 types de pivots")).toBeInTheDocument();
    expect(screen.getByText("Double sens")).toBeInTheDocument();
    expect(screen.getByText("Retournement")).toBeInTheDocument();
    expect(screen.getByText("Exagération")).toBeInTheDocument();
    expect(screen.getByText("Décalage")).toBeInTheDocument();
    expect(screen.getByText("Sous-entendu")).toBeInTheDocument();
    expect(screen.getByText("Anti-chute")).toBeInTheDocument();
  });

  it("renders the 5 common errors section", () => {
    render(<AnatomieVannePage />);
    expect(
      screen.getByText("Les 5 erreurs qui tuent une vanne"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("La punchline est plus longue que le setup"),
    ).toBeInTheDocument();
  });

  it("renders CTA links", () => {
    render(<AnatomieVannePage />);
    expect(
      screen.getByText("Voir des vannes en action"),
    ).toBeInTheDocument();
    expect(screen.getByText("Techniques de pro")).toBeInTheDocument();
  });

  it("renders FAQ section", () => {
    render(<AnatomieVannePage />);
    expect(screen.getByText("Questions fréquentes")).toBeInTheDocument();
    expect(
      screen.getByText("C'est quoi le setup d'une blague ?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Comment écrire une bonne punchline ?"),
    ).toBeInTheDocument();
  });

  it("renders internal links for SEO", () => {
    render(<AnatomieVannePage />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/vannes");
    expect(hrefs).toContain("/conseils");
    expect(hrefs).toContain("/quiz-humour");
  });

  it("renders analysis for each example", () => {
    render(<AnatomieVannePage />);
    const analyses = screen.getAllByText("Analyse");
    expect(analyses.length).toBe(3);
  });

  it("renders Partie labels", () => {
    render(<AnatomieVannePage />);
    expect(screen.getByText("Partie 1")).toBeInTheDocument();
    expect(screen.getByText("Partie 2")).toBeInTheDocument();
    expect(screen.getByText("Partie 3")).toBeInTheDocument();
  });
});

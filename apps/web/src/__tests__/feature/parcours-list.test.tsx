import { render, screen } from "@testing-library/react";
import ParcoursPage from "@/app/(dashboard)/parcours/page";

describe("ParcoursPage — Parcours structurés", () => {
  beforeEach(() => {
    render(<ParcoursPage />);
  });

  it("renders the hero section with title and description", () => {
    expect(screen.getByText("Parcours structurés")).toBeInTheDocument();
    expect(
      screen.getByText(/Choisis ton parcours et progresse semaine après semaine/)
    ).toBeInTheDocument();
  });

  it("shows the launch price", () => {
    expect(
      screen.getByText(/Prix de lancement : 0,99 €\/mois/)
    ).toBeInTheDocument();
  });

  it("renders the 3 parcours titles", () => {
    expect(screen.getByText(/Parcours Répartie/)).toBeInTheDocument();
    expect(screen.getByText(/Parcours Machine à Café/)).toBeInTheDocument();
    expect(screen.getByText(/Parcours Confiance/)).toBeInTheDocument();
  });

  it("shows the duration for each parcours", () => {
    expect(screen.getByText("4 semaines")).toBeInTheDocument();
    expect(screen.getByText("3 semaines")).toBeInTheDocument();
    expect(screen.getByText("6 semaines")).toBeInTheDocument();
  });

  it("shows difficulty badges", () => {
    const intermediaire = screen.getAllByText("DEBUTANT → INTERMEDIAIRE");
    expect(intermediaire).toHaveLength(2);
    expect(screen.getByText("DEBUTANT → EXPERT")).toBeInTheDocument();
  });

  it("renders CTA buttons for each parcours", () => {
    const buttons = screen.getAllByText("Commencer ce parcours");
    expect(buttons).toHaveLength(3);
    buttons.forEach((btn) => {
      expect(btn.closest("a")).toHaveAttribute("href", "/register");
    });
  });

  it("shows weekly modules for Parcours Répartie", () => {
    expect(screen.getByText("Les bases de la répartie")).toBeInTheDocument();
    expect(screen.getByText("Le timing et les silences")).toBeInTheDocument();
    expect(
      screen.getByText("L'autodérision comme arme secrète")
    ).toBeInTheDocument();
    expect(screen.getByText("Répartie avancée")).toBeInTheDocument();
  });

  it("shows weekly modules for Parcours Machine à Café", () => {
    expect(
      screen.getByText("Blagues courtes et mémorisables")
    ).toBeInTheDocument();
    expect(screen.getByText("L'art du timing social")).toBeInTheDocument();
    expect(screen.getByText("Anecdotes et storytelling")).toBeInTheDocument();
  });

  it("shows weekly modules for Parcours Confiance", () => {
    expect(
      screen.getByText("Redécouvrir ce qui te fait rire")
    ).toBeInTheDocument();
    expect(
      screen.getByText("L'autodérision bienveillante")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Techniques de storytelling")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Répartie et conversations")
    ).toBeInTheDocument();
    expect(screen.getByText("Humour avancé")).toBeInTheDocument();
    expect(
      screen.getByText("Développer son style personnel")
    ).toBeInTheDocument();
  });

  it("shows week labels for modules", () => {
    const semaine1 = screen.getAllByText("Semaine 1");
    expect(semaine1.length).toBeGreaterThanOrEqual(3);
    const semaine6 = screen.getAllByText("Semaine 6");
    expect(semaine6).toHaveLength(1);
  });
});

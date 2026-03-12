import { render, screen } from "@testing-library/react";
import ParcoursPage from "@/app/(dashboard)/parcours/page";

describe("ParcoursPage — Bientôt disponible", () => {
  it("shows 'Bientôt disponible' badge", () => {
    render(<ParcoursPage />);
    expect(screen.getByText("Bientôt disponible")).toBeInTheDocument();
  });

  it("shows heading about parcours coming soon", () => {
    render(<ParcoursPage />);
    expect(screen.getByText("Les parcours arrivent bientôt")).toBeInTheDocument();
  });

  it("shows description text", () => {
    render(<ParcoursPage />);
    expect(screen.getByText(/programmes pas à pas/)).toBeInTheDocument();
  });

  it("has register CTA with 0,99 € price", () => {
    render(<ParcoursPage />);
    const registerBtn = screen.getByText(/Commencer à 0,99 €\/mois/);
    expect(registerBtn).toBeInTheDocument();
    expect(registerBtn.closest("a")).toHaveAttribute("href", "/register");
  });

  it("has return to home button", () => {
    render(<ParcoursPage />);
    const homeBtn = screen.getByText(/Retour à l'accueil/);
    expect(homeBtn).toBeInTheDocument();
    expect(homeBtn.closest("a")).toHaveAttribute("href", "/");
  });
});

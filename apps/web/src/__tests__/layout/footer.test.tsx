import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";

describe("Footer", () => {
  it("renders brand name", () => {
    render(<Footer />);
    expect(screen.getByText("deviens-marrant")).toBeInTheDocument();
  });

  it("renders brand description", () => {
    render(<Footer />);
    expect(
      screen.getByText(/coach humour perso/)
    ).toBeInTheDocument();
  });

  it("renders product links including Parcours", () => {
    render(<Footer />);
    expect(screen.getByText("Vannes")).toBeInTheDocument();
    expect(screen.getByText("Conseils")).toBeInTheDocument();
    expect(screen.getByText("Vidéos stand-up")).toBeInTheDocument();
    expect(screen.getByText("Parcours")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Blog").closest("a")).toHaveAttribute("href", "/blog");
  });

  it("renders legal links", () => {
    render(<Footer />);
    expect(screen.getByText("Mentions légales")).toBeInTheDocument();
    expect(screen.getByText("CGU")).toBeInTheDocument();
    expect(screen.getByText("Confidentialité")).toBeInTheDocument();
    expect(screen.getByText("Rétractation")).toBeInTheDocument();
  });

  it("has correct href for retractation link", () => {
    render(<Footer />);
    expect(screen.getByText("Rétractation").closest("a")).toHaveAttribute(
      "href",
      "/retractation"
    );
  });

  it("renders Produit and Légal section headers", () => {
    render(<Footer />);
    expect(screen.getByText("Produit")).toBeInTheDocument();
    expect(screen.getByText("Légal")).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/humour \(et un peu de café\)/)).toBeInTheDocument();
  });

  it("has correct href for product links", () => {
    render(<Footer />);
    expect(screen.getByText("Vannes").closest("a")).toHaveAttribute("href", "/vannes");
    expect(screen.getByText("Conseils").closest("a")).toHaveAttribute("href", "/conseils");
  });

  it("has correct href for legal links", () => {
    render(<Footer />);
    expect(screen.getByText("CGU").closest("a")).toHaveAttribute("href", "/cgu");
    expect(screen.getByText("Confidentialité").closest("a")).toHaveAttribute(
      "href",
      "/confidentialite"
    );
  });
});

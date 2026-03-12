import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/home/hero-section";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

const { useSession } = require("next-auth/react");

describe("HeroSection", () => {
  it("shows badge text with launch offer", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/Prix de lancement — 0,99 €\/mois — Ce tarif ne durera pas/)).toBeInTheDocument();
  });

  it("shows main heading with drôle", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("drôle")).toBeInTheDocument();
    expect(screen.getByText(/du groupe/)).toBeInTheDocument();
  });

  it("shows description with répartie", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/techniques de répartie/)).toBeInTheDocument();
  });

  it("shows use-case tags for all 3 personas", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Avoir de la répartie")).toBeInTheDocument();
    expect(screen.getByText("Briller à la machine à café")).toBeInTheDocument();
    expect(screen.getByText("Retrouver confiance en soi")).toBeInTheDocument();
    expect(screen.getByText("Blagues prêtes à ressortir")).toBeInTheDocument();
  });

  it("does not show CTA buttons when unauthenticated (CTA is in HomeCta)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.queryByText(/Commencer — 0,99 €\/mois/)).not.toBeInTheDocument();
    expect(screen.queryByText("Voir les blagues gratuites")).not.toBeInTheDocument();
  });

  it("shows authenticated buttons", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Explorer les blagues")).toBeInTheDocument();
    expect(screen.getByText("Voir les conseils")).toBeInTheDocument();
  });

  it("links to /blagues when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Explorer les blagues").closest("a")).toHaveAttribute("href", "/blagues");
  });

  it("links to /conseils when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Voir les conseils").closest("a")).toHaveAttribute("href", "/conseils");
  });
});

import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/home/hero-section";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const { useSession } = require("next-auth/react");

describe("HeroSection", () => {
  it("shows main heading with drôle", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("drôle")).toBeInTheDocument();
    expect(screen.getByText(/du groupe/)).toBeInTheDocument();
  });

  it("shows description with motivation hook", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/ta motivation/)).toBeInTheDocument();
  });

  it("shows social proof counter", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/1 500\+ membres/)).toBeInTheDocument();
  });

  it("shows use-case tags for all 3 personas", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Avoir de la répartie")).toBeInTheDocument();
    expect(screen.getByText("Briller à la machine à café")).toBeInTheDocument();
    expect(screen.getByText("Retrouver confiance en soi")).toBeInTheDocument();
    expect(screen.getByText("Progresser chaque jour")).toBeInTheDocument();
    expect(screen.getByText("Vannes prêtes à ressortir")).toBeInTheDocument();
  });

  it("shows CTA when unauthenticated", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Commencer à 0,99 €/mois")).toBeInTheDocument();
  });

  it("shows authenticated buttons", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Explorer les vannes")).toBeInTheDocument();
    expect(screen.getByText("Voir les conseils")).toBeInTheDocument();
  });

  it("links to /vannes when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Explorer les vannes").closest("a")).toHaveAttribute("href", "/vannes");
  });

  it("links to /conseils when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Voir les conseils").closest("a")).toHaveAttribute("href", "/conseils");
  });
});

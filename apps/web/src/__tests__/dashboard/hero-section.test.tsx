import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/home/hero-section";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

const { useSession } = require("next-auth/react");

describe("HeroSection", () => {
  it("shows badge text", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Nouveau : coaching IA personnalisé")).toBeInTheDocument();
  });

  it("shows main heading", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("drôle")).toBeInTheDocument();
    expect(screen.getByText(/pour de vrai/)).toBeInTheDocument();
  });

  it("shows description", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/Blagues, conseils de pros/)).toBeInTheDocument();
  });

  it("shows unauthenticated buttons", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Découvrir mon profil humour")).toBeInTheDocument();
    expect(screen.getByText("Voir les blagues")).toBeInTheDocument();
  });

  it("shows authenticated buttons", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Mes parcours")).toBeInTheDocument();
    expect(screen.getByText("Explorer les blagues")).toBeInTheDocument();
  });

  it("links to /onboarding when unauthenticated", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Découvrir mon profil humour").closest("a")).toHaveAttribute(
      "href",
      "/onboarding"
    );
  });

  it("links to /parcours when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Mes parcours").closest("a")).toHaveAttribute("href", "/parcours");
  });

  it("links to /blagues for both states", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Voir les blagues").closest("a")).toHaveAttribute("href", "/blagues");
  });
});

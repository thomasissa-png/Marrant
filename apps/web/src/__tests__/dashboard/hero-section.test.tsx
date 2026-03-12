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
    expect(screen.getByText(/Offre de lancement — 0,99 €\/mois au lieu de 9,99 €/)).toBeInTheDocument();
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
    expect(screen.getByText("Avoir de la répartie au lycée")).toBeInTheDocument();
    expect(screen.getByText("Briller à la machine à café")).toBeInTheDocument();
    expect(screen.getByText("Retrouver confiance en soi")).toBeInTheDocument();
    expect(screen.getByText("Blagues prêtes à ressortir")).toBeInTheDocument();
  });

  it("shows unauthenticated buttons", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/Essayer pour 0,99 €\/mois/)).toBeInTheDocument();
    expect(screen.getByText("Voir les blagues gratuites")).toBeInTheDocument();
  });

  it("shows authenticated buttons", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Explorer les blagues")).toBeInTheDocument();
    expect(screen.getByText("Voir les conseils")).toBeInTheDocument();
  });

  it("links to /register when unauthenticated", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/Essayer pour 0,99 €\/mois/).closest("a")).toHaveAttribute(
      "href",
      "/register"
    );
  });

  it("links to /blagues when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Explorer les blagues").closest("a")).toHaveAttribute("href", "/blagues");
  });

  it("links to /blagues for unauthenticated secondary CTA", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Voir les blagues gratuites").closest("a")).toHaveAttribute("href", "/blagues");
  });

  it("shows reassurance text", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/Sans engagement/)).toBeInTheDocument();
  });
});

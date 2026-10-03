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
  it("shows main heading (étalon D)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("personne rit")).toBeInTheDocument();
    expect(screen.getByText(/On va arranger ça/)).toBeInTheDocument();
  });

  it("shows description with motivation hook", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/ta motivation/)).toBeInTheDocument();
  });

  it("shows social proof « 1 500+ membres » (texte fixe validé fondateur)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText(/Rejoins 1\s500\+ membres/)).toBeInTheDocument();
  });

  it("links each persona tag to its parcours (s12 T02)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Avoir de la répartie").closest("a")).toHaveAttribute("href", "/parcours/repartie");
    expect(screen.getByText("Briller à la machine à café").closest("a")).toHaveAttribute("href", "/parcours/machine-a-cafe");
    expect(screen.getByText("Reprendre confiance en toi").closest("a")).toHaveAttribute("href", "/parcours/confiance");
    // Les 2 libellés descriptifs restent, non cliquables et masqués en mobile (arbitrage Thomas).
    // Forme audit s14 P0-1 : sortis de la rangée de pastilles, sur une ligne à part sans fond ni bordure.
    for (const label of ["Un petit exercice par jour", "Vannes prêtes à ressortir"]) {
      const tag = screen.getByText(label);
      expect(tag.closest("a")).toBeNull();
      expect(tag.closest("button")).toBeNull();
      const row = tag.closest("ul");
      expect(row).toHaveClass("hidden", "sm:flex");
      expect(row?.querySelector("a")).toBeNull();
      expect(tag.closest("li")).not.toHaveClass("border");
    }
  });

  it("orders the 3 parcours like the rest of the site (audit forme s14 P2-4, tranché par Thomas)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((href) => href?.startsWith("/parcours/"));
    expect(hrefs).toEqual(["/parcours/machine-a-cafe", "/parcours/repartie", "/parcours/confiance"]);
  });

  it("shows the H1 as two sentences, one per block (s12 T01)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.children).toHaveLength(2);
    expect(h1.textContent).toBe("Tu parles et personne rit.On va arranger ça.");
  });

  it("shows CTA when unauthenticated, with the free path right below (s12 T03)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection />);
    expect(screen.getByText("Créer mon compte gratuit")).toBeInTheDocument();
    expect(screen.getByText("Puis 2,99 €/mois pour tout débloquer, sans engagement")).toBeInTheDocument();
    expect(screen.getByText("Voir les vannes gratuites").closest("a")).toHaveAttribute("href", "/vannes");
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

import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/home/hero-section";
import { ACCUEIL_HAUT } from "@/config/textes/cta-articles-accueil";

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
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    expect(screen.getByText("personne rit")).toBeInTheDocument();
    expect(screen.getByText(/On va arranger ça/)).toBeInTheDocument();
  });

  it("shows description with motivation hook", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    expect(screen.getByText(/ta motivation/)).toBeInTheDocument();
  });

  it("shows social proof « 1 500+ membres » (texte fixe validé fondateur)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    const proof = screen.getByText(/1\s500\+ membres bossent leur humour\. Rejoins-les\./);
    expect(proof).toBeInTheDocument();
    expect(proof.textContent).toMatch(/1\s500\+ membres/);
  });

  it("links each persona tag to its parcours (s12 T02)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    expect(screen.getByText("Avoir de la répartie").closest("a")).toHaveAttribute("href", "/parcours/repartie?src=accueil#etape-1");
    expect(screen.getByText("Briller à la machine à café").closest("a")).toHaveAttribute("href", "/parcours/machine-a-cafe?src=accueil#etape-1");
    expect(screen.getByText("Reprendre confiance en toi").closest("a")).toHaveAttribute("href", "/parcours/confiance?src=accueil#etape-1");
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
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    const pastilles = screen.getByText("Avoir de la répartie").closest("ul") as HTMLElement;
    const hrefs = Array.from(pastilles.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      "/parcours/machine-a-cafe?src=accueil#etape-1",
      "/parcours/repartie?src=accueil#etape-1",
      "/parcours/confiance?src=accueil#etape-1",
    ]);
  });

  it("shows the H1 as two sentences, one per block (s12 T01)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.children).toHaveLength(2);
    expect(h1.textContent).toBe("Tu parles et personne rit.On va arranger ça.");
  });

  it("s21 (B3) visiteur : plein vers l'étape 1 de Répartie, note ; s21 concision : aucun lien payant dessous", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { container } = render(<HeroSection textes={ACCUEIL_HAUT} />);
    const plein = screen.getByText(ACCUEIL_HAUT.bouton).closest("a")!;
    expect(plein).toHaveAttribute("href", "/parcours/repartie?src=accueil#etape-1");
    expect(plein.className).toContain("bg-accent-secondary-hover");
    // Le payant est porté par le bouton de prix de l'en-tête (src=header), plus par le haut d'accueil.
    expect(container.querySelector('a[href^="/abonnement"]')).toBeNull();
    expect(container.querySelector('a[data-accueil-cta="abonnement"]')).toBeNull();
    expect(screen.queryByText(/^Ouvrir les \d parcours/)).toBeNull();
    expect(screen.getByText(/^Sans compte : l'étape 1 du parcours Répartie \(conseil, défi, 5 vannes, 2 vidéos, quiz\)\. Les 3 suivantes, dont « Retourner les piques avec le sourire », c'est Premium, résiliable depuis ton profil\.$/)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/compte gratuit|sans engagement|Accéder aux parcours complets/i);
    expect(screen.getByText("1 500+ membres bossent leur humour. Rejoins-les.")).toBeInTheDocument();
    expect(screen.queryByText("Voir les vannes gratuites")).toBeNull();
    // Un seul plein dans la zone d'action (les pastilles sont des chips).
    expect(document.querySelectorAll("a.bg-accent-secondary-hover")).toHaveLength(1);
  });

  it("shows authenticated buttons", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    expect(screen.getByText("Explorer les vannes")).toBeInTheDocument();
    expect(screen.getByText("Voir les conseils")).toBeInTheDocument();
  });

  it("links to /vannes when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    expect(screen.getByText("Explorer les vannes").closest("a")).toHaveAttribute("href", "/vannes");
  });

  it("links to /conseils when authenticated", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<HeroSection textes={ACCUEIL_HAUT} />);
    expect(screen.getByText("Voir les conseils").closest("a")).toHaveAttribute("href", "/conseils");
  });
});

/**
 * Bienvenue après paiement, trajet de conversion s21 tour 3 (textes-trajet-v3 BV1 à BV3) : un seul
 * texte, par priorité : favori ajouté (drapeau `favori=JOKE|TIP|VIDEO`, liste blanche), sinon
 * progression à reprendre, sinon défaut. Couvre les trois types de favori (arbitrage 7 du tour 3).
 */
import { render, screen } from "@testing-library/react";
import { PremiumWelcome } from "@/components/premium/premium-welcome";
import { BIENVENUE_PREMIUM } from "@/config/textes/abonnement-vente";

let params = new URLSearchParams();
jest.mock("next/navigation", () => ({ useSearchParams: () => params }));
const mockReprendre = jest.fn();
jest.mock("@/hooks/use-parcours-a-reprendre", () => ({ useParcoursAReprendre: () => mockReprendre() }));

const texte = () => (screen.getByTestId("bienvenue-texte").textContent ?? "").replace(/⁠/g, "").replace(/\s/g, " ");
const t = (s: string) => s.replace(/\s/g, " ");

beforeEach(() => {
  mockReprendre.mockReturnValue(null);
});

describe("PremiumWelcome (v3 BV1 à BV3)", () => {
  it("sans ?premium=bienvenue : rien", () => {
    params = new URLSearchParams("favori=JOKE");
    const { container } = render(<PremiumWelcome />);
    expect(container).toBeEmptyDOMElement();
  });

  it("BV1 : compte sans progression, sans favori", () => {
    params = new URLSearchParams("premium=bienvenue");
    render(<PremiumWelcome />);
    expect(texte()).toBe(t("Tout est ouvert : les listes, les parcours, les carnets. Sers-toi."));
    expect(screen.getByText("Bienvenue dans Premium")).toBeInTheDocument();
  });

  it("BV2 : progression à reprendre", () => {
    mockReprendre.mockReturnValue({ slug: "repartie", etape: 2 });
    params = new URLSearchParams("premium=bienvenue");
    render(<PremiumWelcome />);
    expect(texte()).toBe(t("Tout est ouvert : les listes, les parcours, les carnets. Reprends là où tu t’étais arrêté."));
  });

  it.each([
    ["JOKE", "Ta vanne est dans tes favoris."],
    ["TIP", "Ton conseil est dans tes favoris."],
    ["VIDEO", "Ta vidéo est dans tes favoris."],
  ] as const)("BV3 : favori %s ajouté, prioritaire sur la progression", (type, debut) => {
    mockReprendre.mockReturnValue({ slug: "repartie", etape: 2 });
    params = new URLSearchParams(`premium=bienvenue&favori=${type}`);
    render(<PremiumWelcome />);
    expect(texte()).toBe(t(BIENVENUE_PREMIUM.favori[type]));
    expect(texte().startsWith(debut)).toBe(true);
    expect(texte()).toContain("Le reste est ouvert aussi : les listes, les parcours, les carnets.");
  });

  it.each(["JOKE.j1", "USER", "joke", ""])("drapeau hors liste blanche (%p) : jamais « dans tes favoris »", (valeur) => {
    params = new URLSearchParams(`premium=bienvenue&favori=${valeur}`);
    render(<PremiumWelcome />);
    expect(texte()).not.toMatch(/favoris/);
  });
});

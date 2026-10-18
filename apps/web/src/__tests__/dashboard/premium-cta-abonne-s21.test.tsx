/**
 * s21 (QA M2) : la carte Premium de l'accueil ne s'affiche pas pour un abonné, même quand
 * le store utilisateur est vide (il n'est rempli que par /profil) : plan lu dans la session.
 */
import { render, screen } from "@testing-library/react";
import { PremiumCta } from "@/components/home/premium-cta";

let session: { data: unknown; status: string } = { data: null, status: "unauthenticated" };
jest.mock("next-auth/react", () => ({ useSession: () => session }));
jest.mock("@/stores/user-store", () => ({
  useUserStore: (selector: (s: { user: null }) => unknown) => selector({ user: null }),
}));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/premium/premium-benefits", () => ({ PremiumBenefits: () => null }));

describe("PremiumCta, abonné reconnu par la session", () => {
  it("abonné PREMIUM, store vide : aucune carte Premium (ni bouton de paiement)", () => {
    session = { data: { user: { id: "u1", plan: "PREMIUM" } }, status: "authenticated" };
    const { container } = render(<PremiumCta />);
    expect(container).toBeEmptyDOMElement();
  });

  it("compte sans abonnement : la carte reste affichée", () => {
    session = { data: { user: { id: "u2", plan: "FREE" } }, status: "authenticated" };
    render(<PremiumCta />);
    expect(document.getElementById("offres")).not.toBeNull();
    expect(screen.getAllByRole("button").length + screen.queryAllByRole("link").length).toBeGreaterThan(0);
  });
});

describe("PremiumCta, ligne « inscrits » (QA v2 m-c)", () => {
  it("visiteur : ligne affichée, texte inchangé", () => {
    session = { data: null, status: "unauthenticated" };
    render(<PremiumCta />);
    expect(screen.getByTestId("carte-premium-inscrits")).toHaveTextContent(/^Déjà 1\s500\+ inscrits, et toi\s?\?$/);
  });

  it("compte connecté sans abonnement : ligne masquée", () => {
    session = { data: { user: { id: "u3", plan: "FREE" } }, status: "authenticated" };
    render(<PremiumCta />);
    expect(screen.queryByTestId("carte-premium-inscrits")).toBeNull();
  });
});

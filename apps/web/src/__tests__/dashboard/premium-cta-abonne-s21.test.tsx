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
  it("abonné PREMIUM, store vide : aucune carte « Active mon accès »", () => {
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

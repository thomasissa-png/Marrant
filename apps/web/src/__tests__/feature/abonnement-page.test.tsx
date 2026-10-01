import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }),
}));

jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));

jest.mock("@/components/home/faq-section", () => ({
  FaqSection: () => <div data-testid="faq-section" />,
}));

jest.mock("@/components/auth/auth-modal", () => ({
  AuthModal: ({ isOpen, callbackUrl }: { isOpen: boolean; callbackUrl?: string }) =>
    isOpen ? <div data-testid="auth-modal" data-callback={callbackUrl ?? ""} /> : null,
}));

const { useSession } = require("next-auth/react");

describe("AbonnementPage (s12 T45)", () => {
  it("shows the free account block then the paid card to anonymous visitors", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementPage />);
    expect(screen.getByText("Compte gratuit")).toBeInTheDocument();
    expect(screen.getByText("Accès complet")).toBeInTheDocument();
    // Fin de l'offre de lancement (01/10/2026) : plus aucun badge « Prix de lancement ».
    expect(screen.queryByText("Prix de lancement")).not.toBeInTheDocument();
  });

  it("free CTA opens sign-up without callback (onboarding)", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementPage />);

    await userEvent.click(screen.getByText("Crée ton compte gratuit"));
    expect(screen.getByTestId("auth-modal")).toHaveAttribute("data-callback", "");
  });

  it("paid CTA keeps /abonnement as the destination", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementPage />);

    await userEvent.click(screen.getByText("Commencer à 4,99 €/mois"));
    expect(screen.getByTestId("auth-modal")).toHaveAttribute("data-callback", "/abonnement");
  });

  it("shows only the paid card with the checkout button to signed-in users", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementPage />);
    expect(screen.queryByText("Compte gratuit")).not.toBeInTheDocument();
    expect(screen.getByText("Active mon accès · 4,99 €/mois")).toBeInTheDocument();
  });
});

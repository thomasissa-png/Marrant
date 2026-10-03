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

describe("AbonnementPage : formule annuelle (01/10/2026)", () => {
  const fetchMock = jest.fn();
  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue({ ok: false, json: async () => ({ error: "stop" }) });
    global.fetch = fetchMock as unknown as typeof fetch;
    window.history.replaceState({}, "", "/abonnement");
  });

  it("shows both plans with exact figures, monthly selected by default", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementPage />);
    expect(screen.getByRole("radio", { name: /Mensuel/ })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Annuel/ })).not.toBeChecked();
    expect(screen.getByText("39,99 €")).toBeInTheDocument();
    expect(screen.getByText("Payé en une fois, soit 3,33 € par mois")).toBeInTheDocument();
    expect(screen.getByText("Tu économises 19,89 € par an")).toBeInTheDocument();
  });

  it("sends plan=annual to checkout once the annual plan is chosen", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementPage />);
    await userEvent.click(screen.getByRole("radio", { name: /Annuel/ }));
    await userEvent.click(screen.getByText("Active mon accès · 39,99 €/an"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/stripe/checkout",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ plan: "annual" }) })
    );
  });

  it("sends plan=monthly by default", async () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementPage />);
    await userEvent.click(screen.getByText("Active mon accès · 4,99 €/mois"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/stripe/checkout",
      expect.objectContaining({ body: JSON.stringify({ plan: "monthly" }) })
    );
  });

  it("keeps the annual choice through sign-up (callback /abonnement?plan=annual)", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementPage />);
    await userEvent.click(screen.getByRole("radio", { name: /Annuel/ }));
    await userEvent.click(screen.getByText("Commencer à 39,99 €/an"));
    expect(screen.getByTestId("auth-modal")).toHaveAttribute("data-callback", "/abonnement?plan=annual");
  });

  it("preselects the annual plan from ?plan=annual", () => {
    window.history.replaceState({}, "", "/abonnement?plan=annual");
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementPage />);
    expect(screen.getByRole("radio", { name: /Annuel/ })).toBeChecked();
  });
});

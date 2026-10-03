import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PremiumModal } from "@/components/premium/premium-modal";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 100, tips: 100, videos: 50, members: 0 }),
}));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
jest.mock("@/components/auth/auth-modal", () => ({
  AuthModal: ({ isOpen, callbackUrl }: { isOpen: boolean; callbackUrl?: string }) =>
    isOpen ? <div data-testid="auth-modal" data-callback={callbackUrl ?? ""} /> : null,
}));

const { useSession } = require("next-auth/react");

describe("PremiumModal (offre vraie, 03/10)", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it("favoris : dit clairement que les favoris font partie de Premium", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
    expect(screen.getByRole("heading", { name: "Les favoris font partie de Premium" })).toBeInTheDocument();
    expect(screen.getByText("Les 3 parcours en entier")).toBeInTheDocument();
  });

  it("ne vend ni le contenu quotidien ni des filtres avancés", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/Contenu quotidien|Filtres avancés|illimit|chaque mois|annuel/i);
    expect(text).toContain("La première étape de chaque parcours est offerte");
  });

  it("anonyme : inscription puis /abonnement avec retour à la page courante", async () => {
    window.history.pushState({}, "", "/vannes?page=2");
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumModal isOpen onClose={jest.fn()} reason="favoris" />);
    await userEvent.click(screen.getByText("Créer un compte pour commencer"));
    expect(screen.getByTestId("auth-modal")).toHaveAttribute(
      "data-callback",
      "/abonnement?returnTo=%2Fvannes%3Fpage%3D2",
    );
  });

  it("connecté : checkout avec returnTo de la page courante", async () => {
    window.history.pushState({}, "", "/parcours/repartie");
    useSession.mockReturnValue({ status: "authenticated" });
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    render(<PremiumModal isOpen onClose={jest.fn()} />);
    await userEvent.click(screen.getByText("Active mon accès · 4,99 €/mois"));
    expect(fetchMock).toHaveBeenCalledWith("/api/stripe/checkout", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ returnTo: "/parcours/repartie" });
  });
});

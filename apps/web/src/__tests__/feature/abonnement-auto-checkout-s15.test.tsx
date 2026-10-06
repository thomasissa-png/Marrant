/**
 * /abonnement après inscription (plus de compte gratuit, s15, spec §2.3 et
 * critères 5 et 6) : `auto=1` ouvre Stripe Checkout sans clic, une seule fois
 * (retiré de l'URL avant l'appel) ; jamais après un abandon (`upgrade=cancel`) ;
 * échec : bouton manuel et message habituel.
 */
import { render, screen, waitFor } from "@testing-library/react";
import { AbonnementView } from "@/components/premium/abonnement-view";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }),
}));
const mockToast = jest.fn();
jest.mock("@/components/ui/toast", () => ({ toast: (...a: unknown[]) => mockToast(...a) }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  trackUmami: (...a: unknown[]) => mockTrack(...a),
  trackUmamiWhenReady: (...a: unknown[]) => mockTrack(...a),
}));

const { useSession } = require("next-auth/react");

function checkoutCalls(): unknown[][] {
  return (global.fetch as jest.Mock).mock.calls.filter(([url]) => url === "/api/stripe/checkout");
}

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ url: "about:blank#stripe" }) });
});

afterEach(() => window.history.pushState({}, "", "/"));

describe("auto=1 : paiement ouvert sans clic intermédiaire", () => {
  it("compte connecté : un seul appel checkout, intention gardée, auto retiré de l'URL", async () => {
    window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Frepartie&auto=1");
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementView annualAvailable={false} />);
    await waitFor(() => expect(checkoutCalls()).toHaveLength(1));
    expect(JSON.parse((checkoutCalls()[0][1] as RequestInit).body as string)).toEqual({ returnTo: "/parcours/repartie" });
    expect(window.location.search).toBe("?returnTo=%2Fparcours%2Frepartie");
    expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", { formule: "mensuel", src: "abonnement", declencheur: "auto" });
  });

  it("rechargement de l'URL nettoyée : pas de seconde session de paiement", async () => {
    window.history.pushState({}, "", "/abonnement?auto=1");
    useSession.mockReturnValue({ status: "authenticated" });
    const first = render(<AbonnementView annualAvailable={false} />);
    await waitFor(() => expect(checkoutCalls()).toHaveLength(1));
    first.unmount();
    render(<AbonnementView annualAvailable={false} />);
    await new Promise((r) => setTimeout(r, 20));
    expect(checkoutCalls()).toHaveLength(1);
  });

  it("session en chargement puis connectée : lancé une fois la session confirmée", async () => {
    window.history.pushState({}, "", "/abonnement?auto=1");
    useSession.mockReturnValue({ status: "loading" });
    const view = render(<AbonnementView annualAvailable={false} />);
    expect(checkoutCalls()).toHaveLength(0);
    useSession.mockReturnValue({ status: "authenticated" });
    view.rerender(<AbonnementView annualAvailable={false} />);
    await waitFor(() => expect(checkoutCalls()).toHaveLength(1));
  });

  it("formule annuelle choisie : l'annuel est payé (pas le mensuel par défaut)", async () => {
    window.history.pushState({}, "", "/abonnement?plan=annual&auto=1");
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementView annualAvailable />);
    await waitFor(() => expect(checkoutCalls()).toHaveLength(1));
    expect(JSON.parse((checkoutCalls()[0][1] as RequestInit).body as string)).toEqual({ plan: "annual" });
    expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", { formule: "annuel", src: "abonnement", declencheur: "auto" });
  });

  it("checkout abandonné (upgrade=cancel) : aucun lancement, abonnement-annule mesuré, bouton manuel", async () => {
    window.history.pushState({}, "", "/abonnement?upgrade=cancel&auto=1");
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementView annualAvailable={false} />);
    await new Promise((r) => setTimeout(r, 20));
    expect(checkoutCalls()).toHaveLength(0);
    expect(mockTrack).toHaveBeenCalledWith("abonnement-annule");
    expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeInTheDocument();
  });

  it("visiteur sans session : jamais de lancement, auto retiré", async () => {
    window.history.pushState({}, "", "/abonnement?auto=1");
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable={false} />);
    await new Promise((r) => setTimeout(r, 20));
    expect(checkoutCalls()).toHaveLength(0);
    expect(window.location.search).toBe("");
  });

  it("échec (503) : message habituel et bouton manuel disponible", async () => {
    window.history.pushState({}, "", "/abonnement?auto=1");
    useSession.mockReturnValue({ status: "authenticated" });
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ error: "x" }) });
    render(<AbonnementView annualAvailable={false} />);
    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        "Cette formule n'est pas disponible pour le moment. Choisis le mensuel ou réessaie plus tard.",
        "error",
      ),
    );
    expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeEnabled();
  });
});

describe("visiteur : un seul chemin vers /register (étape 1 sur 2)", () => {
  it("source d'entrée (`src`) et intention relayées à l'inscription", async () => {
    window.history.pushState({}, "", "/abonnement?returnTo=%2Fvannes%2Fma-vanne&src=fiche-vanne");
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable={false} />);
    await waitFor(() => {
      const href = screen.getByText("Commencer à 2,99 €/mois").closest("a")?.getAttribute("href") ?? "";
      const params = new URL(href, "https://deviens-marrant.fr").searchParams;
      expect(params.get("src")).toBe("fiche-vanne");
      expect(params.get("callbackUrl")).toBe("/abonnement?returnTo=%2Fvannes%2Fma-vanne");
    });
  });
});

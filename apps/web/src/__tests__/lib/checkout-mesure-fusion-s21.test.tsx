/**
 * s21, fusion des blocs d'appel A + B : `checkout-ouvert` / `checkout-echec` (partie A)
 * branchés sur les chemins de paiement de la partie B : `usePremiumCheckout` (fenêtre
 * Premium, quiz d'orientation), /abonnement (AbonnementView) et PremiumPaywall.
 * Ouvert juste avant le départ vers Stripe, échec à chaque erreur (serveur, 409, réseau).
 */
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePremiumCheckout } from "@/hooks/use-premium-checkout";
import { AbonnementView } from "@/components/premium/abonnement-view";
import { PremiumPaywall } from "@/components/marketing/premium-paywall";

jest.mock("next-auth/react", () => ({ useSession: () => ({ data: { user: { plan: "FREE" } }, status: "authenticated" }) }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("@/hooks/use-content-stats", () => ({ useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }) }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));

const track = jest.fn();
const realFetch = global.fetch;
const reponse = (status: number, body: unknown = {}) => ({ ok: status < 300, status, json: async () => body });
const appels = (nom: string) => track.mock.calls.filter(([n]) => n === nom).map(([, data]) => data);
const checkoutVers = (status: number, body?: unknown) => {
  global.fetch = jest.fn(async () => reponse(status, body)) as unknown as typeof fetch;
};

beforeEach(() => {
  track.mockClear();
  window.sessionStorage.clear();
  (window as unknown as { umami: { track: jest.Mock } }).umami = { track };
});
afterEach(() => {
  global.fetch = realFetch;
  window.history.replaceState(null, "", "/");
});

describe("usePremiumCheckout (fenêtre Premium, quiz)", () => {
  it("échec serveur : checkout-echec erreur, jamais ouvert", async () => {
    checkoutVers(500);
    const { result } = renderHook(() => usePremiumCheckout("modale-favoris"));
    await act(() => result.current.startCheckout(null));
    expect(appels("checkout-ouvert")).toEqual([]);
    expect(appels("checkout-echec")).toEqual([{ src: "modale-favoris", raison: "erreur" }]);
  });

  it("réseau coupé : checkout-echec reseau", async () => {
    global.fetch = jest.fn(async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    const { result } = renderHook(() => usePremiumCheckout("onboarding"));
    await act(() => result.current.startCheckout("/vannes"));
    expect(appels("checkout-echec")).toEqual([{ src: "onboarding", raison: "reseau" }]);
  });
});

describe("/abonnement (compte connecté)", () => {
  it("source d'entrée `?src=header` reprise, formule mensuelle, échec serveur", async () => {
    checkoutVers(500);
    window.history.replaceState(null, "", "/abonnement?src=header");
    render(<AbonnementView annualAvailable={false} carnetExtrait={null} />);
    await act(async () => {
      await userEvent.click(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois"));
    });
    expect(appels("checkout-ouvert")).toEqual([]);
    expect(appels("checkout-echec")).toEqual([{ src: "header", raison: "erreur", formule: "mensuel" }]);
  });

  it("sans `?src=` : source « abonnement » ; réseau coupé", async () => {
    global.fetch = jest.fn(async (url: string) => {
      if (url === "/api/stripe/checkout") throw new TypeError("Failed to fetch");
      return reponse(500);
    }) as unknown as typeof fetch;
    window.history.replaceState(null, "", "/abonnement");
    render(<AbonnementView annualAvailable={false} carnetExtrait={null} />);
    await act(async () => {
      await userEvent.click(screen.getByText("Ouvrir les 5 parcours · 2,99 €/mois"));
    });
    expect(appels("checkout-echec")).toEqual([{ src: "abonnement", raison: "reseau", formule: "mensuel" }]);
  });

  it("une seule mention de Stripe sous le bouton, pas de « Droit de rétractation »", () => {
    checkoutVers(500);
    render(<AbonnementView annualAvailable={false} carnetExtrait={null} />);
    expect(screen.getAllByText(/Stripe/)).toHaveLength(1);
    expect(screen.queryByText(/Droit de/)).toBeNull();
  });
});

describe("PremiumPaywall (web)", () => {
  it("pas d'URL de paiement : checkout-echec erreur, source « paywall »", async () => {
    checkoutVers(500, { error: "x" });
    render(<PremiumPaywall />);
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /^Ouvrir les \d\sparcours/ }));
    });
    expect(appels("checkout-ouvert")).toEqual([]);
    expect(appels("checkout-echec")).toEqual([{ src: "paywall", raison: "erreur" }]);
  });
});

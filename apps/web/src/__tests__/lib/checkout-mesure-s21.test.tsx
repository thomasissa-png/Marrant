/**
 * s21, blocs d'appel partie A (point 7) : mesure de Stripe Checkout.
 * - `checkout-ouvert` {src, formule} juste avant le départ vers Stripe ;
 * - `checkout-echec` {src, raison} sur erreur, conflit, réseau, et au retour sans paiement
 *   (source retrouvée dans sessionStorage) ;
 * Filtre d'hôte du rapport Umami : umami-hote-s21.test.ts (environnement node).
 */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mesurerRetourCheckout, trackCheckoutEchec, trackCheckoutOuvert } from "@/lib/checkout-tracking";
import { CheckoutRetourTracker } from "@/components/analytics/checkout-retour-tracker";
import { PremiumCta } from "@/components/home/premium-cta";

jest.mock("next-auth/react", () => ({ useSession: () => ({ data: { user: { plan: "FREE" } }, status: "authenticated" }) }));
jest.mock("@/stores/user-store", () => ({ useUserStore: () => null }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/premium/premium-benefits", () => ({ PremiumBenefits: () => null }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));

const track = jest.fn();
const realFetch = global.fetch;

beforeEach(() => {
  track.mockClear();
  window.sessionStorage.clear();
  (window as unknown as { umami: { track: jest.Mock } }).umami = { track };
});
afterEach(() => {
  global.fetch = realFetch;
});

const appels = (nom: string) => track.mock.calls.filter(([n]) => n === nom).map(([, data]) => data);

describe("checkout-ouvert / checkout-echec", () => {
  it("ouvert : src et formule, source mémorisée pour le retour", () => {
    trackCheckoutOuvert("header", "annuel");
    expect(appels("checkout-ouvert")).toEqual([{ src: "header", formule: "annuel" }]);
    expect(window.sessionStorage.getItem("marrant.checkout-src")).toBe("header");
  });

  it("src invalide : « inconnu », jamais la valeur brute", () => {
    trackCheckoutEchec("<script>", "erreur");
    expect(appels("checkout-echec")).toEqual([{ src: "inconnu", raison: "erreur" }]);
  });

  it("retour sans paiement : checkout-echec avec la source de l'aller, une seule fois", () => {
    trackCheckoutOuvert("accueil-premium");
    expect(mesurerRetourCheckout("?paiement=annule&upgrade=cancel")).toBe(true);
    expect(appels("checkout-echec")).toEqual([{ src: "accueil-premium", raison: "retour-sans-paiement" }]);
    expect(window.sessionStorage.getItem("marrant.checkout-src")).toBeNull();
    expect(mesurerRetourCheckout("?src=header")).toBe(false);
  });

  it("tracker du layout : mesure le retour au chargement", () => {
    window.history.replaceState(null, "", "/abonnement?paiement=annule");
    render(<CheckoutRetourTracker />);
    expect(appels("checkout-echec")).toEqual([{ src: "inconnu", raison: "retour-sans-paiement" }]);
    window.history.replaceState(null, "", "/");
  });

  it("carte Premium (compte sans abonnement) : ouvert avant le départ, échec sur 500", async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 500, json: async () => ({ error: "x" }) })) as unknown as typeof fetch;
    render(<PremiumCta />);
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /Active mon accès/ }));
    });
    expect(appels("checkout-ouvert")).toEqual([]);
    expect(appels("checkout-echec")).toEqual([{ src: "accueil-premium", raison: "erreur" }]);
  });
});

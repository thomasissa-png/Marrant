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
import { courbe } from "../helpers/texte-normalise";

jest.mock("next-auth/react", () => ({ useSession: () => ({ data: { user: { plan: "FREE" } }, status: "authenticated" }) }));
jest.mock("@/stores/user-store", () => ({ useUserStore: () => null }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/premium/avantages-premium", () => ({ AvantagesPremium: () => null }));
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
      await userEvent.click(screen.getByRole("button", { name: /^S’abonner\s·\s1,99/ }));
    });
    expect(appels("checkout-ouvert")).toEqual([]);
    expect(appels("checkout-echec")).toEqual([{ src: "accueil-premium", raison: "erreur" }]);
  });

  it("carte Premium (compte sans abonnement), QA v2 m-b : abonnement-clic et checkout-ouvert, même source", async () => {
    global.fetch = jest.fn(async () => ({ ok: true, status: 200, json: async () => ({ url: "#stripe-simule" }) })) as unknown as typeof fetch;
    render(<PremiumCta />);
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /^S’abonner\s·\s1,99/ }));
    });
    expect(appels("abonnement-clic")).toEqual([
      { formule: "mensuel", src: "accueil-premium", declencheur: "manuel", statut: "membre" },
    ]);
    expect(appels("checkout-ouvert")).toEqual([{ src: "accueil-premium", formule: "mensuel" }]);
  });
});

describe("carte Premium de l'accueil, compte connecté sans abonnement (concision v5, textes-v5-a §5)", () => {
  it("phrase d'objet avant le bouton, puis « S'abonner » (paiement direct, trajet de conversion s21 §2) ; plus de « Tu as déjà ton compte »", () => {
    render(<PremiumCta />);
    // Le compte paie sans avoir lu l'offre : la phrase dit ce qu'il achète ; la phrase du visiteur disparaît.
    expect(screen.queryByTestId("carte-premium-intro")).toBeNull();
    const phrase = screen.getByTestId("carte-premium-intro-connecte");
    expect(phrase).toHaveTextContent("Premium ouvre tout : le catalogue, les 5 parcours, un carnet de répartie par mois.");
    const bouton = screen.getByRole("button", { name: /^S’abonner\s·\s1,99\s€\/mois$/ });
    expect(phrase.compareDocumentPosition(bouton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByTestId("carte-premium-ligne-connecte")).toBeNull();
    expect(screen.queryByText(/Active mon accès|Tu as déjà ton compte|sécurisé par Stripe/)).toBeNull();
  });

  it("QA v2 m-c : pas de « Déjà 1 500+ inscrits, et toi ? » pour un compte déjà inscrit", () => {
    render(<PremiumCta />);
    expect(screen.queryByTestId("carte-premium-inscrits")).toBeNull();
    expect(screen.queryByText(/inscrits, et toi/)).toBeNull();
  });
});

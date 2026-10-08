import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";
import { STORYTELLING_PUBLIE } from "@/config/parcours-publication";

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

const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  trackUmami: (...args: unknown[]) => mockTrack(...args),
  trackUmamiWhenReady: (...args: unknown[]) => mockTrack(...args),
}));

const { useSession } = require("next-auth/react");

/** s15 : les CTA anonymes sont des liens /register (plus de modale). */
function registerParams(text: string): URLSearchParams {
  const href = screen.getByText(text).closest("a")?.getAttribute("href") ?? "";
  expect(href.startsWith("/register")).toBe(true);
  return new URL(href, "https://deviens-marrant.fr").searchParams;
}

/** Appels au paiement seuls : /abonnement lit aussi /api/stripe/status au montage (lot F s16). */
function checkoutCalls(mock: jest.Mock) {
  return mock.mock.calls.filter(([url]) => url === "/api/stripe/checkout");
}

describe("AbonnementPage (s12 T45)", () => {
  it("visiteur : un seul bloc Premium, plus de bloc « Compte gratuit » (s15)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementPage />);
    expect(screen.queryByText("Compte gratuit")).not.toBeInTheDocument();
    expect(screen.queryByText(/Crée ton compte gratuit/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Premium" })).toBeInTheDocument();
    // Titre et sous-titre déclinés de l'étalon 1.2 (prix visible, lecture libre).
    expect(screen.getByRole("heading", { level: 1, name: "Accéder aux parcours complets" })).toBeInTheDocument();
    expect(
      screen.getByText("2,99 €/mois, sans engagement. La première étape de chaque parcours reste en lecture libre."),
    ).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/compte gratuit|sans carte/i);
    // Fin de l'offre de lancement (01/10/2026) : plus aucun badge « Prix de lancement ».
    expect(screen.queryByText("Prix de lancement")).not.toBeInTheDocument();
  });

  it("paid CTA keeps /abonnement as the destination", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementPage />);
    const params = registerParams("Commencer à 2,99 €/mois");
    expect(params.get("callbackUrl")).toBe("/abonnement");
    expect(params.get("src")).toBe("abonnement");
  });

  it("shows only the paid card with the checkout button to signed-in users", () => {
    useSession.mockReturnValue({ status: "authenticated" });
    render(<AbonnementPage />);
    expect(screen.queryByText("Compte gratuit")).not.toBeInTheDocument();
    expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeInTheDocument();
  });

  describe("offre Premium vraie (décision Thomas 03/10)", () => {
    afterEach(() => window.history.pushState({}, "", "/"));

    it("met les 3 parcours en avant et ne vend plus le gratuit ni l'inexistant", () => {
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<AbonnementPage />);
      expect(screen.getByText(`Les ${STORYTELLING_PUBLIE ? 4 : 3} parcours en entier`)).toBeInTheDocument();
      const text = document.body.textContent ?? "";
      expect(text).toContain("Machine à Café (15 min/semaine), Répartie (20 min/semaine), Confiance (20 min/semaine)");
      expect(text).toContain("La première étape de chaque parcours est offerte");
      // Seul contenu mensuel vendu : le carnet, qui existe (décision 03/10/2026).
      expect(text).toContain("Le carnet mensuel de situations de répartie");
      expect(text.replace("(nouveau chaque mois)", "")).not.toMatch(/Contenu quotidien|Filtres avancés|illimit|chaque mois|annuel|par an/i);
      expect(text).not.toContain("\u2014");
    });

    it("anonyme : le CTA payant garde l'intention d'origine (returnTo)", async () => {
      window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Frepartie");
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<AbonnementPage />);
      expect(registerParams("Commencer à 2,99 €/mois").get("callbackUrl")).toBe(
        "/abonnement?returnTo=%2Fparcours%2Frepartie",
      );
    });

    it("connecté : returnTo transmis au checkout, valeur externe ignorée", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
      global.fetch = fetchMock as unknown as typeof fetch;

      window.history.pushState({}, "", "/abonnement?returnTo=%2Fparcours%2Fconfiance");
      const { unmount } = render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({ returnTo: "/parcours/confiance" });
      unmount();

      window.history.pushState({}, "", "/abonnement?returnTo=https%3A%2F%2Fevil.example");
      render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[1][1].body)).toEqual({});
    });
  });
});

describe("AbonnementPage : formule annuelle 24,99 €/an (04/10/2026)", () => {
  const saved = process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
  const fetchMock = jest.fn();
  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;
    window.history.pushState({}, "", "/abonnement");
  });
  afterEach(() => {
    if (saved === undefined) delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
    else process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = saved;
    window.history.pushState({}, "", "/");
  });

  describe("sans STRIPE_PREMIUM_ANNUAL_PRICE_ID : mensuel seul, comme avant", () => {
    it.each([undefined, "", "price_XXXXXXXXXXXXXXXXXXXX"])("valeur %p : aucune trace de l'annuel", (value) => {
      if (value === undefined) delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      else process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = value;
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
      expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/24,99|annuel|par an|\/an/i);
    });

    it("?plan=annual ignoré : le checkout reste mensuel (corps historique)", async () => {
      delete process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID;
      window.history.pushState({}, "", "/abonnement?plan=annual");
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({});
    });
  });

  describe("avec STRIPE_PREMIUM_ANNUAL_PRICE_ID", () => {
    beforeEach(() => {
      process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID = "price_test_annual_1";
    });

    it("sélecteur de formule, mensuel coché par défaut", () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(screen.getByRole("radio", { name: "Mensuel" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Annuel" })).not.toBeChecked();
      expect(screen.getByText("Active mon accès · 2,99 €/mois")).toBeInTheDocument();
    });

    it("annuel : 24,99 €/an, soit 2,08 € par mois, plus de 3 mois offerts et 10,89 € économisés (D5 s16), envoi plan=annual", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      await userEvent.click(screen.getByRole("radio", { name: "Annuel" }));
      expect(screen.getByText("24,99 €")).toBeInTheDocument();
      expect(
        screen.getByText("soit 2,08 € par mois, plus de 3 mois offerts, 10,89 € économisés par an"),
      ).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/4 mois/);
      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/4 mois/);
      expect(text).not.toContain("—");
      await userEvent.click(screen.getByText("Active mon accès · 24,99 €/an"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({ plan: "annual" });
    });

    it("mensuel choisi : corps historique, sans plan", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(JSON.parse(checkoutCalls(fetchMock)[0][1].body)).toEqual({});
    });

    it("anonyme : le choix annuel survit à l'inscription (callback plan=annual + returnTo)", async () => {
      window.history.pushState({}, "", "/abonnement?returnTo=%2Fcarnet");
      useSession.mockReturnValue({ status: "unauthenticated" });
      render(<AbonnementPage />);
      await userEvent.click(screen.getByRole("radio", { name: "Annuel" }));
      expect(registerParams("Commencer à 24,99 €/an").get("callbackUrl")).toBe(
        "/abonnement?returnTo=%2Fcarnet&plan=annual",
      );
    });

    it("?plan=annual préselectionne l'annuel", () => {
      window.history.pushState({}, "", "/abonnement?plan=annual");
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(screen.getByRole("radio", { name: "Annuel" })).toBeChecked();
    });
  });

  describe("mesure Umami du tunnel (s15)", () => {
    beforeEach(() => mockTrack.mockClear());
    afterEach(() => window.history.pushState({}, "", "/"));

    it("retour Stripe sans paiement (upgrade=cancel) : abonnement-annule", () => {
      window.history.pushState({}, "", "/abonnement?upgrade=cancel");
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(mockTrack).toHaveBeenCalledWith("abonnement-annule");
    });

    it("visite normale : aucun abonnement-annule", () => {
      useSession.mockReturnValue({ status: "authenticated" });
      render(<AbonnementPage />);
      expect(mockTrack).not.toHaveBeenCalledWith("abonnement-annule");
    });

    it("clic paiement : abonnement-clic avec formule et source", async () => {
      useSession.mockReturnValue({ status: "authenticated" });
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }) as unknown as typeof fetch;
      render(<AbonnementPage />);
      await userEvent.click(screen.getByText("Active mon accès · 2,99 €/mois"));
      expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
        formule: "mensuel",
        src: "abonnement",
        declencheur: "manuel",
        statut: "membre",
      });
    });
  });
});

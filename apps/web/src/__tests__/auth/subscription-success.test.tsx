import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next-auth
const mockUpdate = jest.fn().mockResolvedValue(null);
jest.mock("next-auth/react", () => ({
  useSession: () => ({ update: mockUpdate }),
}));

// Mock next/navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams("session_id=cs_test_123");
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  trackUmamiWhenReady: (...args: unknown[]) => mockTrack(...args),
}));

import SubscriptionSuccessPage from "@/app/(dashboard)/abonnement/success/page";
import { TEXTES_SUCCESS } from "@/config/textes/paiement";

describe("SubscriptionSuccessPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("état initial : vérification en cours, JAMAIS « Paiement reçu » avant preuve (s16)", () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ plan: "FREE" }) });
    render(<SubscriptionSuccessPage />);
    expect(screen.getByText(TEXTES_SUCCESS.verificationTitre, { selector: "h1" })).toBeInTheDocument();
    expect(screen.queryByText("Paiement reçu !")).not.toBeInTheDocument();
  });

  it("redirects to /parcours with welcome when status returns PREMIUM (webhook already processed)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "PREMIUM" }),
    });

    render(<SubscriptionSuccessPage />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/parcours?premium=bienvenue");
    });
  });

  it("calls verify-session when status returns FREE (webhook not yet processed)", async () => {
    // First call: /api/stripe/status returns FREE
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "FREE" }),
    });
    // Second call: /api/stripe/verify-session returns PREMIUM
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "PREMIUM", activated: true }),
    });

    render(<SubscriptionSuccessPage />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/stripe/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: "cs_test_123" }),
      });
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/parcours?premium=bienvenue");
    });
  });

  it("shows error state after MAX_ATTEMPTS with retry button", async () => {
    // All calls return FREE
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ plan: "FREE" }),
    });

    render(<SubscriptionSuccessPage />);

    // Advance through all 16 attempts (0 to 15)
    for (let i = 0; i <= 15; i++) {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }

    await waitFor(() => {
      expect(screen.getByText(TEXTES_SUCCESS.nonVerifieTitre)).toBeInTheDocument();
      expect(screen.queryByText(/paiement est bien reçu/)).not.toBeInTheDocument();
      expect(screen.getByText("Réessayer")).toBeInTheDocument();
      expect(screen.getByText("Voir les parcours")).toBeInTheDocument();
    });
  });

  it("retry button resets attempts and tries again", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ plan: "FREE" }),
    });

    render(<SubscriptionSuccessPage />);

    // Reach error state
    for (let i = 0; i <= 15; i++) {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }

    await waitFor(() => {
      expect(screen.getByText("Réessayer")).toBeInTheDocument();
    });

    // Now mock a successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "PREMIUM" }),
    });

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await user.click(screen.getByText("Réessayer"));

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/parcours?premium=bienvenue");
    });
  });

  it("'Voir les parcours' navigates to /parcours", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ plan: "FREE" }),
    });

    render(<SubscriptionSuccessPage />);

    for (let i = 0; i <= 15; i++) {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
    }

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await user.click(screen.getByText("Voir les parcours"));
    expect(mockPush).toHaveBeenCalledWith("/parcours");
  });

  it("handles network errors gracefully and retries", async () => {
    // First status call: network error
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    // First verify call: also fails
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    // Second status call: returns PREMIUM
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ plan: "PREMIUM" }),
    });

    render(<SubscriptionSuccessPage />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Second attempt
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/parcours?premium=bienvenue");
    });
  });

  describe("returnTo (retour à l'intention d'origine, 03/10)", () => {
    afterEach(() => mockSearchParams.delete("returnTo"));

    it("returnTo interne : retour à l'étape de parcours avec message de bienvenue", async () => {
      mockSearchParams.set("returnTo", "/parcours/repartie");
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/parcours/repartie?premium=bienvenue");
      });
    });

    it("returnTo externe : ignoré, retour à /parcours", async () => {
      mockSearchParams.set("returnTo", "https://evil.example/phish");
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/parcours?premium=bienvenue");
      });
    });
  });

  describe("mesure Umami (s15)", () => {
    afterEach(() => mockSearchParams.delete("formule"));

    it("abonnement confirmé : abonnement-reussi mensuel, une seule fois", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => expect(mockPush).toHaveBeenCalled());
      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack).toHaveBeenCalledWith("abonnement-reussi", { formule: "mensuel" });
    });

    it("formule=annuel dans l'URL de retour : abonnement-reussi annuel", async () => {
      mockSearchParams.set("formule", "annuel");
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => expect(mockTrack).toHaveBeenCalledWith("abonnement-reussi", { formule: "annuel" }));
    });

    it("paiement pas encore confirmé : aucun événement", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ plan: "FREE" }) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      expect(mockTrack).not.toHaveBeenCalled();
    });
  });

  describe("s16 : visiteur, session d'un autre compte, preuve de paiement", () => {
    afterEach(() => mockSearchParams.delete("formule"));

    it("visiteur non connecté (401) : boucle arrêtée tout de suite, bouton Se connecter qui revient ici avec session_id", async () => {
      mockSearchParams.set("formule", "annuel");
      mockFetch.mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({ error: "Non authentifié" }) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => expect(screen.getByText(TEXTES_SUCCESS.connexionTitre)).toBeInTheDocument());
      const link = screen.getByRole("link", { name: TEXTES_SUCCESS.connexionBouton });
      expect(link).toHaveAttribute(
        "href",
        `/login?callbackUrl=${encodeURIComponent("/abonnement/success?session_id=cs_test_123&formule=annuel")}`,
      );
      // Plus aucun appel après le 401
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          jest.advanceTimersByTime(2000);
        });
      }
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("Paiement reçu !")).not.toBeInTheDocument();
    });

    it("verify-session en 401 (session perdue entre deux appels) : même invitation à se connecter", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ plan: "FREE" }) })
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => expect(screen.getByText(TEXTES_SUCCESS.connexionTitre)).toBeInTheDocument());
    });

    it("session de paiement d'un autre compte (403) : message honnête + contact, pas de « Paiement reçu »", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ plan: "FREE" }) })
        .mockResolvedValueOnce({ ok: false, status: 403, json: () => Promise.resolve({}) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => expect(screen.getByText(TEXTES_SUCCESS.nonVerifieTitre)).toBeInTheDocument());
      expect(screen.getByRole("link", { name: "contact@deviens-marrant.fr" })).toHaveAttribute("href", "mailto:contact@deviens-marrant.fr");
      expect(screen.queryByText("Paiement reçu !")).not.toBeInTheDocument();
    });

    it("plan Premium vérifié : « Paiement reçu ! » affiché puis redirection", async () => {
      mockFetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ plan: "PREMIUM" }) });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => expect(screen.getByText("Paiement reçu !")).toBeInTheDocument());
      expect(mockPush).toHaveBeenCalledWith("/parcours?premium=bienvenue");
    });
  });
});

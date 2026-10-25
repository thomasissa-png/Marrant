import React from "react";
import { render, screen, waitFor, act, cleanup } from "@testing-library/react";
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

// Interrupteur des inscriptions à la lettre de la semaine (s21) : fermé par défaut, ouvert
// seulement dans le bloc dédié en fin de fichier.
let mockInscriptions = false;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_HEBDO_INSCRIPTIONS_OUVERTES() {
    return mockInscriptions;
  },
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

  it("favori mémorisé (étoile avant paiement) : ajouté une fois le plan vérifié, puis retiré de la destination (s21 tour 2)", async () => {
    mockSearchParams.set("returnTo", "/vannes?favori=JOKE.j1");
    mockFetch.mockImplementation((url: string, init?: { method?: string; body?: string }) => {
      if (url === "/api/stripe/status") return Promise.resolve({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
      if (url === "/api/favorites" && init?.method === "POST")
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorite: { id: "f1", contentType: "JOKE", jokeId: "j1" } }) });
      if (url === "/api/favorites") return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorites: [{ id: "f1", contentType: "JOKE", jokeId: "j1" }] }) });
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });
    render(<SubscriptionSuccessPage />);
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    // v3 §5 point 4 : ajout réussi → drapeau `favori=JOKE` (le type, jamais l'id) pour la bienvenue.
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/vannes?premium=bienvenue&favori=JOKE"));
    const post = mockFetch.mock.calls.find((c) => c[0] === "/api/favorites" && c[1]?.method === "POST");
    expect(JSON.parse(post![1].body)).toEqual({ contentType: "JOKE", contentId: "j1" });
    // Ajouté AVANT la redirection : la page d'arrivée montre l'étoile pleine.
    const ordrePost = mockFetch.mock.invocationCallOrder[mockFetch.mock.calls.indexOf(post!)];
    expect(ordrePost).toBeLessThan(mockPush.mock.invocationCallOrder[0]);
    expect(mockPush).toHaveBeenCalledTimes(1);
    mockSearchParams.delete("returnTo");
  });

  it.each([
    ["TIP.t9", 201, "/conseils?premium=bienvenue&favori=TIP"],
    ["VIDEO.v3", 409, "/conseils?premium=bienvenue&favori=VIDEO"],
    ["JOKE.j1", 500, "/conseils?premium=bienvenue"],
  ])("v3 drapeau : %s, réponse %s → %s (échec : pas de drapeau, jamais « dans tes favoris » sans ajout)", async (memo, statut, attendu) => {
    mockSearchParams.set("returnTo", `/conseils?favori=${memo}`);
    mockFetch.mockImplementation((url: string, init?: { method?: string }) => {
      if (url === "/api/stripe/status") return Promise.resolve({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
      if (url === "/api/favorites" && init?.method === "POST")
        return Promise.resolve({ ok: statut < 300, status: statut, json: () => Promise.resolve({}) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorites: [] }) });
    });
    render(<SubscriptionSuccessPage />);
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(attendu));
    expect(mockPush.mock.calls[0][0]).not.toMatch(/\.(t9|v3|j1)/);
    mockSearchParams.delete("returnTo");
  });

  it("favori : jamais ajouté sans plan Premium vérifié", async () => {
    mockSearchParams.set("returnTo", "/vannes?favori=JOKE.j1");
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ plan: "FREE" }) });
    render(<SubscriptionSuccessPage />);
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(mockFetch.mock.calls.some((c) => c[0] === "/api/favorites")).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
    mockSearchParams.delete("returnTo");
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
      // Étalon 5a.2 validé (lot E), mot pour mot.
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Connecte-toi pour retrouver ton abonnement");
      expect(
        screen.getByText(
          "Tu n’es pas connecté sur cet appareil, alors on ne peut pas confirmer ton paiement d’ici. Si tu viens de t’abonner, connecte-toi : ton accès apparaîtra dans ton profil.",
        ),
      ).toBeInTheDocument();
      expect(link).toHaveTextContent("Me connecter");
      expect(screen.getByText(/Pas encore abonné \?/)).toHaveTextContent("Pas encore abonné ? Voir Premium");
      expect(screen.getByRole("link", { name: "Voir Premium" })).toHaveAttribute("href", "/abonnement");
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

  describe("s22 fusion : inscriptions à la lettre de la semaine OUVERTES", () => {
    beforeEach(() => {
      mockInscriptions = true;
    });
    afterEach(() => {
      mockInscriptions = false;
      mockSearchParams.delete("returnTo");
    });

    const avecPreference = (preference: unknown) => (url: string) => {
      if (url === "/api/lettre-premium/preference") return Promise.resolve(preference ? { ok: true, json: () => Promise.resolve(preference) } : { ok: false, json: () => Promise.resolve({}) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
    };

    it.each([
      ["reçoit (inscrit d'office)", { eligible: true, enabled: true, opposition: false }, "recoit", /^Chaque jeudi, la lettre de la semaine arrive dans ta boîte : elle est incluse dans ton abonnement\. Tu peux l.arrêter en un clic, depuis chaque lettre ou ton profil\.$/],
      ["réabonné qui avait arrêté (arrêt explicite)", { eligible: true, enabled: false, opposition: false }, "arretee", /^Ta lettre de la semaine reste arrêtée, comme tu l.avais demandé\. Tu peux la reprendre depuis ton profil\.$/],
      ["opposition à nos e-mails", { eligible: true, enabled: true, opposition: true }, "opposition", /^Tu nous as demandé de ne plus recevoir nos e-mails, hors ceux de ton compte et de ton abonnement : la lettre de la semaine ne t.est donc pas envoyée\. Pour la recevoir, écris-nous à contact@deviens-marrant\.fr\.$/],
    ])("s22 B1 : ligne selon l'état du compte, %s ; pas de redirection, plus de case, bouton vers la destination", async (_, preference, etat, texteAttendu) => {
      mockFetch.mockImplementation(avecPreference(preference));
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      expect(await screen.findByText("Paiement reçu !")).toBeInTheDocument();
      const ligne = await screen.findByTestId("lettre-hebdo-paiement");
      expect(ligne).toHaveAttribute("data-etat", etat);
      expect(ligne.textContent?.replace(/\u2060/g, "").replace(/\s+/g, " ")).toMatch(texteAttendu);
      expect(screen.queryByRole("checkbox")).toBeNull();
      await act(async () => {
        jest.advanceTimersByTime(10_000);
      });
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByRole("link", { name: TEXTES_SUCCESS.pretBouton })).toHaveAttribute("href", "/parcours?premium=bienvenue");
    });

    it("s22 B1 : état de la lettre illisible (erreur, compte pas encore Premium) : aucune ligne, jamais une phrase devinée", async () => {
      mockFetch.mockImplementation(avecPreference(null));
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      expect(await screen.findByText("Paiement reçu !")).toBeInTheDocument();
      await waitFor(() => expect(mockFetch.mock.calls.some((c) => c[0] === "/api/lettre-premium/preference")).toBe(true));
      expect(screen.queryByTestId("lettre-hebdo-paiement")).toBeNull();
      cleanup();
      mockFetch.mockImplementation(avecPreference({ eligible: false, enabled: true, opposition: false }));
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      expect(await screen.findByText("Paiement reçu !")).toBeInTheDocument();
      expect(screen.queryByTestId("lettre-hebdo-paiement")).toBeNull();
    });

    it("favori mémorisé : ajouté quand même (POST + fetchFavorites), pas de redirection, bouton avec le drapeau favori", async () => {
      mockSearchParams.set("returnTo", "/vannes?favori=JOKE.j1");
      mockFetch.mockImplementation((url: string, init?: { method?: string }) => {
        if (url === "/api/stripe/status") return Promise.resolve({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
        if (url === "/api/favorites" && init?.method === "POST")
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorite: { id: "f1", contentType: "JOKE", jokeId: "j1" } }) });
        if (url === "/api/favorites") return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorites: [{ id: "f1", contentType: "JOKE", jokeId: "j1" }] }) });
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
      });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => expect(screen.getByRole("link", { name: "Continuer" })).toHaveAttribute("href", "/vannes?premium=bienvenue&favori=JOKE"));
      const post = mockFetch.mock.calls.find((c) => c[0] === "/api/favorites" && c[1]?.method === "POST");
      expect(JSON.parse(post![1].body)).toEqual({ contentType: "JOKE", contentId: "j1" });
      expect(mockFetch.mock.calls.some((c) => c[0] === "/api/favorites" && !c[1]?.method)).toBe(true);
      // État de la lettre illisible dans ce faux réseau : aucune ligne (jamais une phrase devinée).
      expect(screen.queryByTestId("lettre-hebdo-paiement")).toBeNull();
      await act(async () => {
        jest.advanceTimersByTime(10_000);
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("favori dont l'ajout échoue : bouton sans drapeau, jamais « dans tes favoris » sans ajout", async () => {
      mockSearchParams.set("returnTo", "/vannes?favori=JOKE.j1");
      mockFetch.mockImplementation((url: string, init?: { method?: string }) => {
        if (url === "/api/stripe/status") return Promise.resolve({ ok: true, json: () => Promise.resolve({ plan: "PREMIUM" }) });
        if (url === "/api/favorites" && init?.method === "POST") return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) });
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ favorites: [] }) });
      });
      render(<SubscriptionSuccessPage />);
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      await waitFor(() => expect(mockFetch.mock.calls.some((c) => c[0] === "/api/favorites" && c[1]?.method === "POST")).toBe(true));
      await act(async () => {
        jest.advanceTimersByTime(6000);
      });
      expect(screen.getByRole("link", { name: "Continuer" })).toHaveAttribute("href", "/vannes?premium=bienvenue");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

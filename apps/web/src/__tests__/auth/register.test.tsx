import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockSignIn = jest.fn();

const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => mockSearchParams,
}));

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  trackUmami: (...args: unknown[]) => mockTrack(...args),
}));

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
  await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
  await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
  await userEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));
}

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders registration form", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Crée ton compte, ta première vanne t'attend")).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("has submit button", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: "Créer mon compte" })).toBeInTheDocument();
  });

  it("has Google sign-up button", () => {
    render(<RegisterPage />);
    expect(screen.getByText("S'inscrire avec Google")).toBeInTheDocument();
  });

  it("has login link", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Connecte-toi")).toBeInTheDocument();
  });

  it("shows password minimum length hint", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Au moins 8 caractères")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    render(<RegisterPage />);
    const pwInput = screen.getByLabelText("Mot de passe");
    expect(pwInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByLabelText("Afficher le mot de passe"));
    expect(pwInput).toHaveAttribute("type", "text");
  });

  it("posts to /api/auth/register and signs in on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "1" } }),
    });
    mockSignIn.mockResolvedValue({ error: null });

    render(<RegisterPage />);

    await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
    await userEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Jean", email: "jean@test.fr", password: "password1234545" }),
      });
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "jean@test.fr",
        password: "password1234545",
        redirect: false,
      });
    });
  });

  it("redirects to /onboarding on success (no callbackUrl)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    mockSignIn.mockResolvedValue({ error: null });

    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password12345");
    await userEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/onboarding");
    });
  });

  it("shows API error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Email déjà utilisé." }),
    });

    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
    await userEvent.type(screen.getByLabelText("Email"), "exists@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password12345");
    await userEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Email déjà utilisé.");
    });
  });

  it("shows loading state", async () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<RegisterPage />);
    await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
    await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password12345");
    await userEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));

    expect(screen.getByText("On prépare ton compte…")).toBeInTheDocument();
  });

  it("calls Google signIn with /onboarding callback when no callbackUrl", async () => {
    render(<RegisterPage />);
    await userEvent.click(screen.getByText("S'inscrire avec Google"));
    // Marqueur de retour pour la mesure (AuthReturnTracker), s15.
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/onboarding?auth=inscription-google" });
    expect(mockTrack).toHaveBeenCalledWith("inscription-envoi", { methode: "google", src: "direct" });
  });

  describe("tunnel s15 : destination, source et mesure", () => {
    afterEach(() => {
      mockSearchParams.delete("callbackUrl");
      mockSearchParams.delete("src");
      mockSearchParams.delete("error");
    });

    it("email : inscription-envoi puis inscription-reussie avec la source", async () => {
      mockSearchParams.set("src", "blog-meilleures-blagues-droles-2026");
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ user: { id: "1" } }) });
      mockSignIn.mockResolvedValue({ error: null });
      render(<RegisterPage />);
      await fillAndSubmit();
      const data = { methode: "email", src: "blog-meilleures-blagues-droles-2026" };
      await waitFor(() => expect(mockTrack).toHaveBeenCalledWith("inscription-reussie", data));
      expect(mockTrack).toHaveBeenCalledWith("inscription-envoi", data);
      expect(mockPush).toHaveBeenCalledWith("/onboarding");
    });

    it("échec API : envoi mesuré, pas de réussite", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({ error: "Email déjà utilisé" }) });
      render(<RegisterPage />);
      await fillAndSubmit();
      await waitFor(() => expect(screen.getByText("Email déjà utilisé")).toBeInTheDocument());
      expect(mockTrack).toHaveBeenCalledWith("inscription-envoi", { methode: "email", src: "direct" });
      expect(mockTrack).not.toHaveBeenCalledWith("inscription-reussie", expect.anything());
    });

    it("formule choisie sur /abonnement retrouvée après inscription", async () => {
      mockSearchParams.set("callbackUrl", "/abonnement?plan=annual");
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ user: { id: "1" } }) });
      mockSignIn.mockResolvedValue({ error: null });
      render(<RegisterPage />);
      await fillAndSubmit();
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/abonnement?plan=annual"));
    });

    it("Google : destination + marqueur + source conservés", async () => {
      mockSearchParams.set("callbackUrl", "/parcours/repartie");
      mockSearchParams.set("src", "parcours");
      render(<RegisterPage />);
      await userEvent.click(screen.getByText("S'inscrire avec Google"));
      expect(mockSignIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/parcours/repartie?auth=inscription-google&src=parcours",
      });
    });

    it("source invalide ignorée (jamais de donnée libre envoyée)", async () => {
      mockSearchParams.set("src", "jean@test.fr");
      render(<RegisterPage />);
      await userEvent.click(screen.getByText("S'inscrire avec Google"));
      expect(mockTrack).toHaveBeenCalledWith("inscription-envoi", { methode: "google", src: "direct" });
    });

    it("lien « Connecte-toi » garde la destination", () => {
      mockSearchParams.set("callbackUrl", "/abonnement");
      render(<RegisterPage />);
      expect(screen.getByRole("link", { name: "Connecte-toi" })).toHaveAttribute(
        "href",
        "/login?callbackUrl=%2Fabonnement",
      );
    });

    it("OAuthCallback : message compréhensible", () => {
      mockSearchParams.set("error", "OAuthCallback");
      render(<RegisterPage />);
      expect(screen.getByRole("alert")).toHaveTextContent("L'inscription avec Google n'a pas abouti");
    });
  });

});

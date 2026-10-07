import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/(auth)/login/page";

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

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Content de te revoir")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("renders logo linking to home", () => {
    render(<LoginPage />);
    expect(screen.getByText("deviens-marrant.fr")).toBeInTheDocument();
  });

  it("has submit button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: "Se connecter" })).toBeInTheDocument();
  });

  it("has Google sign-in button", () => {
    render(<LoginPage />);
    expect(screen.getByText("Continuer avec Google")).toBeInTheDocument();
  });

  it("has forgot password link", () => {
    render(<LoginPage />);
    expect(screen.getByText("Mot de passe oublié ?")).toBeInTheDocument();
  });

  it("propose clairement l'abonnement vers /register (s15, plus de compte gratuit)", () => {
    render(<LoginPage />);
    expect(screen.getByText("Pas encore abonné ?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Créer mon compte et m'abonner" })).toHaveAttribute("href", "/register?src=login");
  });

  it("le lien d'inscription garde la destination et la source (s15)", () => {
    mockSearchParams.set("callbackUrl", "/abonnement?plan=annual");
    mockSearchParams.set("src", "header");
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: "Créer mon compte et m'abonner" })).toHaveAttribute(
      "href",
      "/register?callbackUrl=%2Fabonnement%3Fplan%3Dannual&src=header",
    );
    mockSearchParams.delete("callbackUrl");
    mockSearchParams.delete("src");
  });

  it("OAuthCallback : message compréhensible (navigateur intégré, email)", () => {
    mockSearchParams.set("error", "OAuthCallback");
    mockSearchParams.set("callbackUrl", "https://deviens-marrant.fr");
    render(<LoginPage />);
    expect(screen.getByRole("alert")).toHaveTextContent("La connexion avec Google n'a pas abouti");
    expect(screen.getByRole("alert")).toHaveTextContent("ouvre le site dans ton navigateur");
    expect(screen.getByRole("alert").textContent).not.toContain("\u2014");
    mockSearchParams.delete("error");
    mockSearchParams.delete("callbackUrl");
  });

  it("connexion email réussie : événement connexion-reussie", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    render(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Email"), "a@b.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "motdepasse123");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    await waitFor(() => expect(mockTrack).toHaveBeenCalledWith("connexion-reussie", { methode: "email" }));
  });

  it("toggles password visibility", async () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText("Mot de passe");
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByLabelText("Afficher le mot de passe"));
    expect(passwordInput).toHaveAttribute("type", "text");

    await userEvent.click(screen.getByLabelText("Masquer le mot de passe"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("calls signIn on form submit", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "test@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@test.fr",
        password: "password123",
        redirect: false,
      });
    });
  });

  it("redirects to /vannes by default on success", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "test@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "pass1234");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/vannes");
    });
  });

  it("redirects to callbackUrl from search params on success", async () => {
    mockSearchParams.set("callbackUrl", "/parcours");
    mockSignIn.mockResolvedValue({ error: null });
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "test@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "pass1234");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/parcours");
    });
    mockSearchParams.delete("callbackUrl");
  });

  it("shows error on invalid credentials", async () => {
    mockSignIn.mockResolvedValue({ error: "CredentialsSignin" });
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "bad@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("E-mail ou mot de passe incorrect. Réessaie, ou réinitialise ton mot de passe.");
    });
  });

  it("shows error on network failure", async () => {
    mockSignIn.mockRejectedValue(new Error("Network error"));
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "test@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "pass1234");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Quelque chose a coincé de notre côté. Réessaie dans un instant.");
    });
  });

  it("shows loading state during submission", async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "test@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "pass1234");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(screen.getByText("On t'ouvre…")).toBeInTheDocument();
  });

  it("calls Google signIn with default /vannes callbackUrl", async () => {
    render(<LoginPage />);
    await userEvent.click(screen.getByText("Continuer avec Google"));
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/vannes?auth=connexion-google" });
  });

  it("calls Google signIn with callbackUrl from search params", async () => {
    mockSearchParams.set("callbackUrl", "/conseils");
    render(<LoginPage />);
    await userEvent.click(screen.getByText("Continuer avec Google"));
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/conseils?auth=connexion-google" });
    mockSearchParams.delete("callbackUrl");
  });

  // s16 reco 13 : liaison Google automatique coupée, donc plus de relance
  // automatique de Google sur OAuthAccountNotLinked (voir login-s16.test.tsx).
  it("OAuthAccountNotLinked : pas de relance Google, renvoi vers le mot de passe", () => {
    mockSearchParams.set("error", "OAuthAccountNotLinked");
    render(<LoginPage />);
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("déjà un compte avec mot de passe");
    mockSearchParams.delete("error");
  });

});

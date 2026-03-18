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
  signIn: (...args) => mockSignIn(...args),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("renders logo linking to home", () => {
    render(<LoginPage />);
    expect(screen.getByText("deviens-marrant")).toBeInTheDocument();
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

  it("has register link", () => {
    render(<LoginPage />);
    expect(screen.getByText("Inscris-toi")).toBeInTheDocument();
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
      expect(screen.getByRole("alert")).toHaveTextContent("Email ou mot de passe incorrect.");
    });
  });

  it("shows error on network failure", async () => {
    mockSignIn.mockRejectedValue(new Error("Network error"));
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "test@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "pass1234");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Une erreur est survenue. Réessaie.");
    });
  });

  it("shows loading state during submission", async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText("Email"), "test@test.fr");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "pass1234");
    await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(screen.getByText("Connexion...")).toBeInTheDocument();
  });

  it("calls Google signIn with default /vannes callbackUrl", async () => {
    render(<LoginPage />);
    await userEvent.click(screen.getByText("Continuer avec Google"));
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/vannes" });
  });

  it("calls Google signIn with callbackUrl from search params", async () => {
    mockSearchParams.set("callbackUrl", "/conseils");
    render(<LoginPage />);
    await userEvent.click(screen.getByText("Continuer avec Google"));
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/conseils" });
    mockSearchParams.delete("callbackUrl");
  });

  it("auto-retries Google sign-in on OAuthAccountNotLinked error", async () => {
    sessionStorage.clear();
    mockSearchParams.set("error", "OAuthAccountNotLinked");
    render(<LoginPage />);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/vannes" });
    });
    mockSearchParams.delete("error");
    sessionStorage.clear();
  });

  it("shows fallback message if OAuthAccountNotLinked auto-retry already failed", () => {
    sessionStorage.setItem("oauth-auto-retry", "1");
    mockSearchParams.set("error", "OAuthAccountNotLinked");
    render(<LoginPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Tu as déjà un compte"
    );
    mockSearchParams.delete("error");
    sessionStorage.clear();
  });

});

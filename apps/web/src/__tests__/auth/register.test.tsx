import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockSignIn = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders registration form", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Créer un compte")).toBeInTheDocument();
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
    expect(screen.getByText("Au moins 12 caractères")).toBeInTheDocument();
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

  it("redirects to /onboarding on success", async () => {
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

    expect(screen.getByText("Création...")).toBeInTheDocument();
  });

  it("calls Google signIn with onboarding callback", async () => {
    render(<RegisterPage />);
    await userEvent.click(screen.getByText("S'inscrire avec Google"));
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/onboarding" });
  });

});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders page title", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText("Mot de passe oublié")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText(/Entre ton email/)).toBeInTheDocument();
  });

  it("renders logo linking to home", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText("deviens-marrant")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByRole("button", { name: "Envoyer le lien" })).toBeInTheDocument();
  });

  it("renders back to login link", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText("Retour à la connexion")).toBeInTheDocument();
    expect(screen.getByText("Retour à la connexion").closest("a")).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("accepts email input", async () => {
    render(<ForgotPasswordPage />);
    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("calls API on submit and shows success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Lien envoyé" }),
    });

    render(<ForgotPasswordPage />);
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer le lien" }));

    expect(global.fetch).toHaveBeenCalledWith("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    await waitFor(() => {
      expect(screen.getByText(/Si un compte existe/)).toBeInTheDocument();
    });
  });

  it("shows error on API failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Trop de tentatives" }),
    });

    render(<ForgotPasswordPage />);
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer le lien" }));

    await waitFor(() => {
      expect(screen.getByText("Trop de tentatives")).toBeInTheDocument();
    });
  });

  it("shows error on network failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network"));

    render(<ForgotPasswordPage />);
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer le lien" }));

    await waitFor(() => {
      expect(screen.getByText("Connexion perdue, réessaie")).toBeInTheDocument();
    });
  });
});

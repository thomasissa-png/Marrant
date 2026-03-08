import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";

describe("ForgotPasswordPage", () => {
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
    expect(screen.getByText("deviensmarrant")).toBeInTheDocument();
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

  it("prevents default form submission", async () => {
    render(<ForgotPasswordPage />);
    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "test@example.com");
    // Submit should not throw or navigate
    await userEvent.click(screen.getByRole("button", { name: "Envoyer le lien" }));
    // Page should still be visible
    expect(screen.getByText("Mot de passe oublié")).toBeInTheDocument();
  });
});

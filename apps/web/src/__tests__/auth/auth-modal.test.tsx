import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal } from "@/components/auth/auth-modal";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("AuthModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders login form by default", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("renders register form when defaultTab is register", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} defaultTab="register" />);
    expect(screen.getByText("Créer mon compte")).toBeInTheDocument();
  });

  it("shows logo text", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText("deviens-marrant.fr")).toBeInTheDocument();
  });

  it("has tabbed navigation", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByRole("tab", { name: "Connexion" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Inscription" })).toBeInTheDocument();
  });

  it("switches to register tab on click", async () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);
    await userEvent.click(screen.getByRole("tab", { name: "Inscription" }));
    expect(screen.getByText("Créer mon compte")).toBeInTheDocument();
  });

  it("switches back to login tab", async () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} defaultTab="register" />);
    await userEvent.click(screen.getByRole("tab", { name: "Connexion" }));
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("shows email and password fields for login", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("shows name field for register", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} defaultTab="register" />);
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
  });

  it("shows forgot password link in login tab", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText("Mot de passe oublié ?")).toBeInTheDocument();
  });

  it("shows Google button for login", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText("Continuer avec Google")).toBeInTheDocument();
  });

  it("shows Google button for register", () => {
    render(<AuthModal isOpen={true} onClose={jest.fn()} defaultTab="register" />);
    expect(screen.getByText(/inscrire avec Google/)).toBeInTheDocument();
  });
});

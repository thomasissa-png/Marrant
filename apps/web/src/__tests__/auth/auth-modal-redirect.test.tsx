import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal } from "@/components/auth/auth-modal";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockSignIn = jest.fn();

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

async function fillRegister() {
  await userEvent.type(screen.getByLabelText("Prénom"), "Yanis");
  await userEvent.type(screen.getByLabelText("Email"), "yanis@example.fr");
  await userEvent.type(screen.getByLabelText("Mot de passe"), "motdepasse123");
  await userEvent.click(screen.getByText("Créer mon compte"));
}

describe("AuthModal : destination après inscription (s12 T40)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    mockSignIn.mockResolvedValue({ error: null });
  });

  it("envoie vers l'onboarding sans callback (jamais vers /abonnement)", async () => {
    render(<AuthModal isOpen onClose={jest.fn()} defaultTab="register" />);
    await fillRegister();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/onboarding"));
  });

  it("transmet un callback générique à l'onboarding", async () => {
    render(<AuthModal isOpen onClose={jest.fn()} defaultTab="register" callbackUrl="/vannes" />);
    await fillRegister();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/onboarding?callbackUrl=%2Fvannes"));
  });

  it("respecte un callback d'intention explicite (parcours)", async () => {
    render(<AuthModal isOpen onClose={jest.fn()} defaultTab="register" callbackUrl="/parcours/repartie" />);
    await fillRegister();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/parcours/repartie"));
  });

  it("Google à l'inscription suit la même règle", async () => {
    render(<AuthModal isOpen onClose={jest.fn()} defaultTab="register" callbackUrl="/onboarding" />);
    await userEvent.click(screen.getByText(/inscrire avec Google/));
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/onboarding" });
  });
});

describe("AuthModal : validation de l'inscription (s12 T41)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("affiche les erreurs par champ sans appeler l'API", async () => {
    render(<AuthModal isOpen onClose={jest.fn()} defaultTab="register" />);
    await userEvent.type(screen.getByLabelText("Prénom"), "Y");
    await userEvent.type(screen.getByLabelText("Email"), "pas-un-email@x");
    await userEvent.type(screen.getByLabelText("Mot de passe"), "motdepasse123");
    await userEvent.click(screen.getByText("Créer mon compte"));

    expect(screen.getByText("Ton prénom doit faire au moins 2 caractères.")).toBeInTheDocument();
    expect(screen.getByText("Cette adresse email a l'air bizarre. Tu peux vérifier ?")).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom")).toHaveAttribute("aria-invalid", "true");
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

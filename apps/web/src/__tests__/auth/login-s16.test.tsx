/**
 * s16 (recos 13, 16, 19) : /login.
 * - messages distincts : trop d'essais, compte Google, identifiants, serveur ;
 * - événement Umami `connexion-echec` avec motif ;
 * - e-mail gardé et focus remis sur le champ utile ;
 * - OAuthAccountNotLinked : message clair, plus de relance Google automatique.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/(auth)/login/page";
import { LOGIN_ERROR_CODES, TEXTES_CONNEXION } from "@/config/textes/compte";

const mockSignIn = jest.fn();
const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock("next-auth/react", () => ({ signIn: (...a: unknown[]) => mockSignIn(...a) }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...a: unknown[]) => mockTrack(...a) }));

async function tenterConnexion() {
  await userEvent.type(screen.getByLabelText("Email"), "a@b.fr");
  await userEvent.type(screen.getByLabelText("Mot de passe"), "motdepasse");
  await userEvent.click(screen.getByRole("button", { name: "Se connecter" }));
}

beforeEach(() => {
  jest.clearAllMocks();
  mockSearchParams.delete("error");
});

describe("/login : échecs de connexion e-mail", () => {
  it.each([
    [LOGIN_ERROR_CODES.identifiants, TEXTES_CONNEXION.identifiants, "identifiants"],
    [LOGIN_ERROR_CODES.tropDEssais, TEXTES_CONNEXION.tropDEssais, "trop-d-essais"],
    [LOGIN_ERROR_CODES.compteGoogle, TEXTES_CONNEXION.compteGoogle, "compte-google"],
    [LOGIN_ERROR_CODES.serveur, TEXTES_CONNEXION.serveur, "serveur"],
  ])("%s : message dédié + connexion-echec", async (code, message, motif) => {
    mockSignIn.mockResolvedValue({ error: code });
    render(<LoginPage />);
    await tenterConnexion();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(message));
    expect(mockTrack).toHaveBeenCalledWith("connexion-echec", { methode: "email", motif });
  });

  it("identifiants incorrects : e-mail gardé, mot de passe vidé et focalisé", async () => {
    mockSignIn.mockResolvedValue({ error: LOGIN_ERROR_CODES.identifiants });
    render(<LoginPage />);
    await tenterConnexion();
    await waitFor(() => expect(screen.getByLabelText("Mot de passe")).toHaveFocus());
    expect(screen.getByLabelText("Email")).toHaveValue("a@b.fr");
    expect(screen.getByLabelText("Mot de passe")).toHaveValue("");
  });

  it("compte Google : focus sur « Continuer avec Google »", async () => {
    mockSignIn.mockResolvedValue({ error: LOGIN_ERROR_CODES.compteGoogle });
    render(<LoginPage />);
    await tenterConnexion();
    await waitFor(() => expect(screen.getByRole("button", { name: /Continuer avec Google/ })).toHaveFocus());
  });

  it("panne réseau : message serveur, motif reseau", async () => {
    mockSignIn.mockRejectedValue(new Error("offline"));
    render(<LoginPage />);
    await tenterConnexion();
    await waitFor(() => expect(mockTrack).toHaveBeenCalledWith("connexion-echec", { methode: "email", motif: "reseau" }));
  });
});

describe("/login : retour Google en erreur", () => {
  it("OAuthAccountNotLinked : message « compte avec mot de passe », aucune relance Google", () => {
    mockSearchParams.set("error", "OAuthAccountNotLinked");
    render(<LoginPage />);
    expect(screen.getByRole("alert")).toHaveTextContent(TEXTES_CONNEXION.oauthCompteExistant);
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockTrack).toHaveBeenCalledWith("connexion-echec", { methode: "google", motif: "compte-mot-de-passe" });
    expect(screen.getByLabelText("Email")).toHaveFocus();
  });

  it("OAuthCallback : échec mesuré une seule fois", () => {
    mockSearchParams.set("error", "OAuthCallback");
    const { rerender } = render(<LoginPage />);
    rerender(<LoginPage />);
    expect(mockTrack.mock.calls.filter((c) => c[0] === "connexion-echec")).toHaveLength(1);
  });
});

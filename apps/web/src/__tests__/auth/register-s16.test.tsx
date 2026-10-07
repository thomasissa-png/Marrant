/**
 * Audit parcours s16, lot C : /register (reco 9 réassurance + CGU, reco 17
 * `inscription-echec`, reco 19 liens soulignés, D4 « Premium »).
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";

const mockPush = jest.fn();
const mockSignIn = jest.fn();
const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock("next-auth/react", () => ({ signIn: (...args: unknown[]) => mockSignIn(...args) }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...args: unknown[]) => mockTrack(...args) }));

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText("Prénom"), "Jean");
  await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
  await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
  await userEvent.click(screen.getByRole("button", { name: "Créer mon compte" }));
}

describe("RegisterPage, audit s16", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of [...mockSearchParams.keys()]) mockSearchParams.delete(key);
    global.fetch = jest.fn();
  });

  it("réassurance TTC / 14 jours / résiliable en ligne et acceptation des CGU avec lien", () => {
    render(<RegisterPage />);
    expect(screen.getByText("2,99 € TTC par mois, remboursé sous 14 jours, résiliable en ligne quand tu veux.")).toBeInTheDocument();
    const cgu = screen.getByRole("link", { name: "CGU" });
    expect(cgu).toHaveAttribute("href", "/cgu");
    expect(cgu.closest("p")).toHaveTextContent("En créant ton compte, tu acceptes les CGU.");
  });

  it("rappel de formule avec le nom Premium (D4), étalon 2.1 sinon inchangé", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Premium, 2,99 €/mois, annulable à tout moment.")).toBeInTheDocument();
    expect(screen.getByText("Étape 1 sur 2")).toBeInTheDocument();
    expect(screen.getByText("Étape 2 : le paiement sécurisé, juste après.")).toBeInTheDocument();
  });

  it("liens dans le texte soulignés en permanence (axe link-in-text-block)", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("link", { name: "Connecte-toi" }).className).toMatch(/(^|\s)underline(\s|$)/);
    expect(screen.getByRole("link", { name: "CGU" }).className).toMatch(/(^|\s)underline(\s|$)/);
  });

  it("e-mail déjà pris (409) : inscription-echec avec motif, pas de réussite", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 409, json: async () => ({ error: "x" }) });
    render(<RegisterPage />);
    await fillAndSubmit();
    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith("inscription-echec", {
        methode: "email",
        motif: "email-deja-pris",
        src: "direct",
        etape: "abonnement",
      }),
    );
    expect(mockTrack).not.toHaveBeenCalledWith("inscription-reussie", expect.anything());
  });

  it("réseau coupé : inscription-echec motif reseau", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("offline"));
    render(<RegisterPage />);
    await fillAndSubmit();
    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith("inscription-echec", expect.objectContaining({ motif: "reseau" })),
    );
  });

  it("retour de Google en erreur : un seul inscription-echec, motif = code d'erreur", () => {
    mockSearchParams.set("error", "OAuthCallback");
    mockSearchParams.set("src", "vannes");
    const { rerender } = render(<RegisterPage />);
    rerender(<RegisterPage />);
    const calls = mockTrack.mock.calls.filter(([name]) => name === "inscription-echec");
    expect(calls).toEqual([
      ["inscription-echec", { methode: "google", motif: "OAuthCallback", src: "vannes", etape: "abonnement" }],
    ]);
  });
});

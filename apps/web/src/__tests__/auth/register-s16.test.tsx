/**
 * Audit parcours s16, lot C : /register (reco 9 réassurance + CGU, reco 17
 * `inscription-echec`, reco 19 liens soulignés, D4 « Premium »).
 */
import { render, screen, waitFor } from "@testing-library/react";
import { REGISTER_CTA } from "@/config/textes/cta-pages";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/(auth)/register/page";
import { normalizeParcoursSrc } from "@/lib/parcours-tracking";

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
  await userEvent.type(screen.getByLabelText("Email"), "jean@test.fr");
  await userEvent.type(screen.getByLabelText("Mot de passe"), "password1234545");
  await userEvent.click(screen.getByRole("button", { name: REGISTER_CTA.bouton }));
}

describe("RegisterPage, audit s16", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of [...mockSearchParams.keys()]) mockSearchParams.delete(key);
    global.fetch = jest.fn();
  });

  it("réassurance premier paiement (s21) et acceptation des CGU avec lien", () => {
    render(<RegisterPage />);
    expect(screen.getByTestId("register-reassurance")).toHaveTextContent(
      /^Premium : premier paiement remboursable sous 14 jours\. Résiliable depuis ton profil\.$/,
    );
    const cgu = screen.getByRole("link", { name: "CGU" });
    expect(cgu).toHaveAttribute("href", "/cgu");
    expect(cgu.closest("p")).toHaveTextContent("En créant ton compte, tu acceptes les CGU.");
  });

  it("revue v3 m2 : une seule mention CGU, juste sous Google, avant le formulaire e-mail", () => {
    render(<RegisterPage />);
    const mention = screen.getByTestId("register-cgu");
    expect(screen.getAllByText(/En créant ton compte, tu acceptes les/)).toHaveLength(1);
    const google = screen.getByRole("button", { name: /Continuer avec Google/ });
    const suit = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(google.nextElementSibling).toBe(mention);
    expect(suit(mention, screen.getByLabelText("Email"))).toBe(true);
    expect(suit(mention, screen.getByRole("button", { name: REGISTER_CTA.bouton }))).toBe(true);
  });

  it("revue v3 m3 : `register-etape1`, source connue de parcours-ouvert", () => {
    expect(normalizeParcoursSrc("register-etape1")).toBe("register-etape1");
  });

  it("rappel de formule avec le nom Premium (D4) et le prix (textes-trajet-v2 G02)", () => {
    render(<RegisterPage />);
    expect(screen.getByTestId("register-rappel-offre").textContent?.replace(/\s/g, " ")).toBe("Premium, 1,99 €/mois.");
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

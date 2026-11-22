/**
 * s26 allègement du tunnel (décision du 22/11, `docs/legal/allegement-tunnel-achat-s26.md` §2) : formulaire
 * d'un seul tenant (Google, champs, bouton), puis, SOUS le bouton, en petit, deux lignes : remboursement,
 * puis CGU, confidentialité (RGPD art. 13) et lettre du mois. Test changé (raison : décision de Thomas du
 * 22/11, « à quoi ça sert vu qu'il n'est pas inscrit, enlevez-moi ça ») : plus de lien « Renoncer au
 * contrat ici » sur /register, avant toute souscription (il reste en pied de page, profil, confirmation).
 */
import { render, screen } from "@testing-library/react";
import RegisterPage from "@/app/(auth)/register/page";
import { LIBELLE_RENONCER_CONTRAT } from "@/config/textes/paiement";
import { REGISTER_CTA } from "@/config/textes/cta-pages";

const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock("next-auth/react", () => ({ signIn: jest.fn() }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

/** Espaces insécables (frTypo) ramenées à des espaces simples. */
const espaces = (t: string | null | undefined) => (t ?? "").replace(/\s/g, " ");
const suit = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("RegisterPage, s26 allègement du tunnel", () => {
  it("aucun lien « Renoncer au contrat ici » ni vers /retractation sur /register", () => {
    render(<RegisterPage />);
    expect(screen.queryByRole("link", { name: LIBELLE_RENONCER_CONTRAT })).toBeNull();
    expect(screen.queryByTestId("register-retractation")).toBeNull();
    expect(document.querySelector('a[href="/retractation"]')).toBeNull();
  });

  it("ligne 1 mot pour mot : le remboursement, sans lien", () => {
    render(<RegisterPage />);
    const ligne = screen.getByTestId("register-reassurance");
    expect(espaces(ligne.textContent)).toBe("Premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.");
    expect(ligne.querySelector("a")).toBeNull();
  });

  it("ligne 2 mot pour mot : CGU et confidentialité liées, lettre du mois", () => {
    render(<RegisterPage />);
    const ligne = screen.getByTestId("register-cgu");
    expect(espaces(ligne.textContent)).toBe(
      "En créant ton compte, tu acceptes les CGU et la confidentialité. Tu recevras la lettre du mois, désinscription en un clic.",
    );
    expect(screen.getByRole("link", { name: "CGU" })).toHaveAttribute("href", "/cgu");
    expect(screen.getByRole("link", { name: "confidentialité" })).toHaveAttribute("href", "/confidentialite");
  });

  it("ordre : Google, E-mail, Mot de passe, bouton, ligne 1, ligne 2, « Déjà un compte ? »", () => {
    render(<RegisterPage />);
    const ordre = [
      screen.getByRole("button", { name: /Continuer avec Google/ }),
      screen.getByLabelText("E-mail"),
      screen.getByLabelText("Mot de passe"),
      screen.getByRole("button", { name: REGISTER_CTA.bouton }),
      screen.getByTestId("register-reassurance"),
      screen.getByTestId("register-cgu"),
      screen.getByRole("link", { name: REGISTER_CTA.connecteToi }),
    ];
    for (let i = 1; i < ordre.length; i++) expect(suit(ordre[i - 1], ordre[i])).toBe(true);
  });

  it("retraits : plus de « Paiement sécurisé par Stripe », de « Premium : » en tête, ni de ligne seule", () => {
    render(<RegisterPage />);
    const texte = espaces(document.body.textContent);
    expect(texte).not.toContain("Stripe");
    expect(texte).not.toContain("Premium : ");
    expect(texte).not.toContain("une fois par mois");
    expect(screen.queryByTestId("register-stripe")).toBeNull();
    expect(screen.getAllByText(/En créant ton compte, tu acceptes les/)).toHaveLength(1);
    expect(texte).not.toContain("—");
  });

  it("deux lignes en petit, discrètes, liens soulignés", () => {
    render(<RegisterPage />);
    for (const id of ["register-reassurance", "register-cgu"]) {
      const el = screen.getByTestId(id);
      const classes = `${el.className} ${el.parentElement?.className ?? ""}`;
      expect(classes).toContain("text-xs");
      expect(classes).toContain("text-text-muted");
    }
    for (const nom of ["CGU", "confidentialité"]) {
      expect(screen.getByRole("link", { name: nom }).className.split(/\s+/)).toEqual(
        expect.arrayContaining(["underline", "underline-offset-2", "hover:text-text-secondary"]),
      );
    }
  });
});

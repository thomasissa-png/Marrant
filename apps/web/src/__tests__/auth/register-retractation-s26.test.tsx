/**
 * s26 rétractation /register (décision de Thomas du 20/11, `docs/legal/retractation-register-s26.md`) :
 * sous la mention des CGU, le lien vers /retractation avec le libellé légal EXISTANT, sans texte nouveau.
 */
import { render, screen } from "@testing-library/react";
import RegisterPage from "@/app/(auth)/register/page";
import { LIBELLE_RENONCER_CONTRAT } from "@/config/textes/paiement";

const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock("next-auth/react", () => ({ signIn: jest.fn() }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

describe("RegisterPage, s26 rétractation /register", () => {
  it("lien présent, vers /retractation, libellé exact « Renoncer au contrat ici »", () => {
    render(<RegisterPage />);
    expect(LIBELLE_RENONCER_CONTRAT).toBe("Renoncer au contrat ici");
    const liens = screen.getAllByRole("link", { name: LIBELLE_RENONCER_CONTRAT });
    expect(liens).toHaveLength(1);
    expect(liens[0]).toHaveAttribute("href", "/retractation");
    expect(liens[0].textContent).toBe("Renoncer au contrat ici");
  });

  it("juste sous la mention des CGU, avant le formulaire e-mail, sans phrase d'introduction", () => {
    render(<RegisterPage />);
    const bloc = screen.getByTestId("register-retractation");
    expect(screen.getByTestId("register-cgu").nextElementSibling).toBe(bloc);
    expect(bloc.textContent).toBe(LIBELLE_RENONCER_CONTRAT);
    const suit = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(suit(bloc, screen.getByLabelText("Email"))).toBe(true);
    expect(bloc.textContent).not.toContain("—");
  });

  it("même style que le lien CGU (souligné, discret), cible de 44 px comme les liens isolés de la page", () => {
    render(<RegisterPage />);
    const lien = screen.getByRole("link", { name: LIBELLE_RENONCER_CONTRAT });
    for (const classe of ["underline", "underline-offset-2", "hover:text-text-secondary", "min-h-11", "inline-flex"]) {
      expect(lien.className.split(/\s+/)).toContain(classe);
    }
    expect(lien.closest("p")?.className).toContain("text-text-muted");
  });
});

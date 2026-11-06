/**
 * s23 (UX O2) : /login?callbackUrl=/resiliation (ou /resiliation/confirmee), interrupteur ouvert :
 * phrase de contexte, ni « Pas encore abonné ? » ni « Créer mon compte et m’abonner » (hors sujet,
 * lu comme une relance). « Retour à l’accueil » reste. Interrupteur fermé : page inchangée.
 */
import { render, screen } from "@testing-library/react";

jest.mock("@/config/resiliation", () => ({
  ...jest.requireActual("@/config/resiliation"),
  get RESILIATION_PAGE_OUVERTE() {
    return (globalThis as { __RESILIATION_OUVERTE__?: boolean }).__RESILIATION_OUVERTE__ === true;
  },
}));
const mockSearchParams = new URLSearchParams();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useSearchParams: () => mockSearchParams,
}));
jest.mock("next-auth/react", () => ({ signIn: jest.fn() }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

import LoginPage from "@/app/(auth)/login/page";
import { TEXTES_RESILIATION } from "@/config/textes/resiliation";

const drapeau = globalThis as { __RESILIATION_OUVERTE__?: boolean };
const inscription = () => screen.queryByRole("link", { name: "Créer mon compte et m’abonner" });

beforeEach(() => {
  drapeau.__RESILIATION_OUVERTE__ = false;
  mockSearchParams.delete("callbackUrl");
});
afterAll(() => {
  drapeau.__RESILIATION_OUVERTE__ = false;
});

describe("/login pour résilier", () => {
  it.each(["/resiliation", "/resiliation/confirmee"])("ouvert, callbackUrl=%s : contexte, pas d'inscription, retour accueil gardé", (cible) => {
    drapeau.__RESILIATION_OUVERTE__ = true;
    mockSearchParams.set("callbackUrl", cible);
    render(<LoginPage />);
    expect(screen.getByText(TEXTES_RESILIATION.connexion)).toBeInTheDocument();
    expect(inscription()).not.toBeInTheDocument();
    expect(screen.queryByText("Pas encore abonné ?")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Retour à l’accueil" })).toHaveAttribute("href", "/");
  });

  it("ouvert, autre destination : inscription visible", () => {
    drapeau.__RESILIATION_OUVERTE__ = true;
    mockSearchParams.set("callbackUrl", "/vannes");
    render(<LoginPage />);
    expect(inscription()).toBeInTheDocument();
  });

  it("fermé, callbackUrl=/resiliation : page inchangée (inscription visible, aucune phrase de contexte)", () => {
    mockSearchParams.set("callbackUrl", "/resiliation");
    render(<LoginPage />);
    expect(inscription()).toBeInTheDocument();
    expect(screen.queryByText(TEXTES_RESILIATION.connexion)).not.toBeInTheDocument();
  });
});

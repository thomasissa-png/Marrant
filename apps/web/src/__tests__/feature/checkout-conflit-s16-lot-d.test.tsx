/**
 * Audit s16, lot D (point 3) : refus 409 de /api/stripe/checkout (déjà abonné,
 * paiement en retard) → message du serveur + lien /profil sur /abonnement, la
 * modale Premium et le bloc Premium de l'accueil, jamais un toast générique.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AbonnementView } from "@/components/premium/abonnement-view";
import { PremiumModal } from "@/components/premium/premium-modal";
import { PremiumCta } from "@/components/home/premium-cta";
import { readCheckoutConflict } from "@/lib/checkout-conflict";
import { TEXTES_CHECKOUT } from "@/config/textes/paiement";

jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "authenticated" }) }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }),
}));
const mockToast = jest.fn();
jest.mock("@/components/ui/toast", () => ({ toast: (...a: unknown[]) => mockToast(...a) }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));
jest.mock("@/stores/user-store", () => ({
  useUserStore: (sel: (s: { user: null }) => unknown) => sel({ user: null }),
}));

const IMPAYE = { error: TEXTES_CHECKOUT.impaye, code: "paiement-en-retard", portal: true };
const DEJA = { error: TEXTES_CHECKOUT.dejaAbonne, code: "deja-abonne", portal: true };

function mockCheckout(status: number, body: unknown) {
  global.fetch = jest.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body }) as jest.Mock;
}

async function expectConflict(message: string, code: string) {
  const alerte = await screen.findByTestId("checkout-conflit");
  expect(alerte).toHaveAttribute("role", "alert");
  expect(alerte).toHaveAttribute("data-code", code);
  expect(alerte).toHaveTextContent(message);
  expect(screen.getByRole("link", { name: TEXTES_CHECKOUT.lienProfil })).toHaveAttribute("href", "/profil");
  expect(mockToast).not.toHaveBeenCalled();
}

beforeEach(() => jest.clearAllMocks());

describe("readCheckoutConflict", () => {
  it("409 lu (message serveur), code par défaut, repli sur les textes ; autre statut = null", () => {
    expect(readCheckoutConflict(409, IMPAYE)).toEqual({ code: "paiement-en-retard", message: TEXTES_CHECKOUT.impaye });
    expect(readCheckoutConflict(409, { code: "paiement-en-retard" })?.message).toBe(TEXTES_CHECKOUT.impaye);
    expect(readCheckoutConflict(409, null)).toEqual({ code: "deja-abonne", message: TEXTES_CHECKOUT.dejaAbonne });
    expect(readCheckoutConflict(500, DEJA)).toBeNull();
    expect(readCheckoutConflict(200, {})).toBeNull();
  });
});

describe("409 au checkout : message + lien /profil", () => {
  it("/abonnement : impayé", async () => {
    mockCheckout(409, IMPAYE);
    render(<AbonnementView annualAvailable={false} />);
    await userEvent.click(screen.getByRole("button", { name: /Active mon accès/ }));
    await expectConflict(TEXTES_CHECKOUT.impaye, "paiement-en-retard");
  });

  it("/abonnement : autre erreur = toast habituel, pas d'avis", async () => {
    mockCheckout(500, { error: "x" });
    render(<AbonnementView annualAvailable={false} />);
    await userEvent.click(screen.getByRole("button", { name: /Active mon accès/ }));
    expect(mockToast).toHaveBeenCalledWith("Le paiement n'a pas pu démarrer. Réessaie dans un instant.", "error");
    expect(screen.queryByTestId("checkout-conflit")).not.toBeInTheDocument();
  });

  it("modale Premium : déjà abonné, le lien ferme la modale", async () => {
    mockCheckout(409, DEJA);
    const onClose = jest.fn();
    render(<PremiumModal isOpen onClose={onClose} reason="favoris" />);
    await userEvent.click(screen.getByRole("button", { name: /Active mon accès/ }));
    await expectConflict(TEXTES_CHECKOUT.dejaAbonne, "deja-abonne");
    jest.spyOn(console, "error").mockImplementation(() => {}); // navigation jsdom non implémentée
    await userEvent.click(screen.getByRole("link", { name: TEXTES_CHECKOUT.lienProfil }));
    expect(onClose).toHaveBeenCalled();
  });

  it("accueil (bloc Premium) : déjà abonné", async () => {
    mockCheckout(409, DEJA);
    render(<PremiumCta />);
    await userEvent.click(screen.getByRole("button", { name: /2,99/ }));
    await expectConflict(TEXTES_CHECKOUT.dejaAbonne, "deja-abonne");
  });
});

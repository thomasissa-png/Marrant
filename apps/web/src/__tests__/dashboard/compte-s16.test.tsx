/**
 * s16 recos 5, 11, 19 : carte Abonnement du profil, suppression du compte,
 * page de réinitialisation (afficher le mot de passe, new-password).
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AbonnementCard, ANCRE_ABONNEMENT, etatAbonnement } from "@/components/profil/abonnement-card";
import { useSubscriptionSummary } from "@/hooks/use-subscription-summary";
import { SupprimerCompteCard, confirmationValide } from "@/components/profil/supprimer-compte-card";
import ResetPasswordPage from "@/app/(auth)/reset-password/page";
import { TEXTES_ABONNEMENT, TEXTES_SUPPRESSION } from "@/config/textes/compte";
import type { SubscriptionSummary } from "@/lib/account";

const mockSignOut = jest.fn();
jest.mock("next-auth/react", () => ({ signOut: (...a: unknown[]) => mockSignOut(...a) }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...a: unknown[]) => mockTrack(...a) }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
const mockSearchParams = new URLSearchParams("token=t&email=a%40b.fr");
jest.mock("next/navigation", () => ({ useSearchParams: () => mockSearchParams }));

const actif: SubscriptionSummary = {
  status: "ACTIVE",
  formule: "monthly",
  priceCents: 299,
  currentPeriodEnd: "2026-11-12T10:00:00.000Z",
  cancelAtPeriodEnd: false,
  hasPortal: true,
  hasStripeSubscription: true,
};

function mockSummary(subscription: SubscriptionSummary | null) {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ subscription }) }) as jest.Mock;
}

/** Le profil lit le résumé une fois et le passe à la carte (lot G) : même câblage ici. */
function CarteAvecResume({ plan }: { plan: string }) {
  const abonnement = useSubscriptionSummary(true);
  return <AbonnementCard plan={plan} xp={0} onCheckout={jest.fn()} isCheckoutLoading={false} abonnement={abonnement} />;
}
const card = (plan = "PREMIUM") => <CarteAvecResume plan={plan} />;

beforeEach(() => jest.clearAllMocks());

describe("etatAbonnement", () => {
  it("impayé prioritaire, résilié, actif, hors Stripe, aucun", () => {
    expect(etatAbonnement("FREE", { ...actif, status: "PAST_DUE" })).toBe("impaye");
    expect(etatAbonnement("PREMIUM", { ...actif, cancelAtPeriodEnd: true })).toBe("resilie");
    expect(etatAbonnement("PREMIUM", actif)).toBe("actif");
    expect(etatAbonnement("PREMIUM", undefined)).toBe("actif");
    expect(etatAbonnement("PREMIUM", null)).toBe("premium-sans-resume");
    expect(etatAbonnement("PREMIUM", { ...actif, hasPortal: false, hasStripeSubscription: false })).toBe("premium-hors-stripe");
    expect(etatAbonnement("FREE", null)).toBe("aucun");
  });
});

describe("AbonnementCard (reco 11)", () => {
  it("actif mensuel : formule, prix, prochain prélèvement, changer de formule, un seul bouton de résiliation tutoyé", async () => {
    mockSummary(actif);
    render(card());
    expect(await screen.findByText("Formule mensuelle, 2,99 €/mois")).toBeInTheDocument();
    expect(screen.getByText("Prochain prélèvement le 12 novembre 2026.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: TEXTES_ABONNEMENT.changerFormule })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Résilier/ })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Résilier ton contrat" })).toBeInTheDocument();
    expect(screen.getByText(/tu gardes Premium jusqu'au 12 novembre 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Passe à l'annuel : plus de 3 mois offerts, 10,89 € économisés/)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/votre|—/);
  });

  it("résilié : « Premium jusqu'au … », plus de bouton de résiliation", async () => {
    mockSummary({ ...actif, formule: "annual", priceCents: 2499, cancelAtPeriodEnd: true });
    render(card());
    expect(await screen.findByText("Premium jusqu'au 12 novembre 2026.")).toBeInTheDocument();
    expect(screen.getByText("Formule annuelle, 24,99 €/an")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Résilier/ })).not.toBeInTheDocument();
  });

  it("impayé : message carte refusée + bouton vers le parcours carte du portail", async () => {
    mockSummary({ ...actif, status: "PAST_DUE" });
    render(card());
    expect(await screen.findByText(TEXTES_ABONNEMENT.impaye)).toBeInTheDocument();
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    await userEvent.click(screen.getByRole("button", { name: TEXTES_ABONNEMENT.majCarte }));
    expect(global.fetch).toHaveBeenLastCalledWith(
      "/api/user/subscription/portal",
      expect.objectContaining({ body: JSON.stringify({ parcours: "carte" }) }),
    );
    expect(screen.queryByText(/S'abonner/)).not.toBeInTheDocument();
  });

  it("changer de formule : appelle le portail ciblé", async () => {
    mockSummary(actif);
    render(card());
    const bouton = await screen.findByRole("button", { name: TEXTES_ABONNEMENT.changerFormule });
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    await userEvent.click(bouton);
    expect(global.fetch).toHaveBeenLastCalledWith(
      "/api/user/subscription/portal",
      expect.objectContaining({ body: JSON.stringify({ parcours: "changer-formule" }) }),
    );
  });
});

describe("SupprimerCompteCard (reco 5)", () => {
  it("confirmationValide : casse et espaces ignorés", () => {
    expect(confirmationValide(" supprimer ")).toBe(true);
    expect(confirmationValide("supprime")).toBe(false);
  });

  it("mot incorrect : aucune requête, erreur annoncée", async () => {
    global.fetch = jest.fn() as jest.Mock;
    render(<SupprimerCompteCard abonne />);
    expect(screen.getByText(TEXTES_SUPPRESSION.avecAbonnement(null))).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: TEXTES_SUPPRESSION.ouvrir }));
    await userEvent.type(screen.getByLabelText(TEXTES_SUPPRESSION.consigne), "oui");
    await userEvent.click(screen.getByRole("button", { name: TEXTES_SUPPRESSION.confirmer }));
    expect(screen.getByRole("alert")).toHaveTextContent(TEXTES_SUPPRESSION.motIncorrect);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("confirmé : DELETE /api/user puis déconnexion vers l'accueil", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }) as jest.Mock;
    render(<SupprimerCompteCard abonne={false} />);
    await userEvent.click(screen.getByRole("button", { name: TEXTES_SUPPRESSION.ouvrir }));
    await userEvent.type(screen.getByLabelText(TEXTES_SUPPRESSION.consigne), "SUPPRIMER");
    await userEvent.click(screen.getByRole("button", { name: TEXTES_SUPPRESSION.confirmer }));
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" }));
    expect(global.fetch).toHaveBeenCalledWith("/api/user", expect.objectContaining({ method: "DELETE" }));
    expect(mockTrack).toHaveBeenCalledWith("compte-supprime", { abonne: "non" });
  });

  it("échec serveur : message du serveur, pas de déconnexion", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: TEXTES_SUPPRESSION.echecStripe }) }) as jest.Mock;
    render(<SupprimerCompteCard abonne />);
    await userEvent.click(screen.getByRole("button", { name: TEXTES_SUPPRESSION.ouvrir }));
    await userEvent.type(screen.getByLabelText(TEXTES_SUPPRESSION.consigne), "SUPPRIMER");
    await userEvent.click(screen.getByRole("button", { name: TEXTES_SUPPRESSION.confirmer }));
    expect(await screen.findByRole("alert")).toHaveTextContent(TEXTES_SUPPRESSION.echecStripe);
    expect(mockSignOut).not.toHaveBeenCalled();
  });
});

describe("/reset-password (reco 19)", () => {
  it("autocomplete new-password et bouton afficher le mot de passe", async () => {
    render(<ResetPasswordPage />);
    const champ = screen.getByLabelText("Nouveau mot de passe");
    expect(champ).toHaveAttribute("autocomplete", "new-password");
    expect(screen.getByLabelText("Confirmer le mot de passe")).toHaveAttribute("autocomplete", "new-password");
    expect(champ).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Afficher le mot de passe" }));
    expect(champ).toHaveAttribute("type", "text");
    await userEvent.click(screen.getByRole("button", { name: "Masquer le mot de passe" }));
    expect(champ).toHaveAttribute("type", "password");
  });
});

describe("AbonnementCard, impayé (audit s16, lot D)", () => {
  it("impayé : mise à jour de la carte ET bouton légal de résiliation", async () => {
    mockSummary({ ...actif, status: "PAST_DUE" });
    render(card());
    expect(await screen.findByText(TEXTES_ABONNEMENT.impaye)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: TEXTES_ABONNEMENT.majCarte })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Résilier ton contrat" })).toBeInTheDocument();
  });
});

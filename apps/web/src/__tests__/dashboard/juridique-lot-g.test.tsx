/**
 * Lot G (07/10/2026) : bouton « Résilier ton contrat » permanent (variante
 * outline), lien du pied de page, avertissement de suppression de compte,
 * CGU art. 3/6/7, /retractation (modèle légal + périmètre), confidentialité.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AbonnementCard, ANCRE_ABONNEMENT } from "@/components/profil/abonnement-card";
import { SupprimerCompteCard } from "@/components/profil/supprimer-compte-card";
import { Footer } from "@/components/layout/footer";
import { useSubscriptionSummary } from "@/hooks/use-subscription-summary";
import { toast } from "@/components/ui/toast";
import CGUPage from "@/app/(dashboard)/cgu/page";
import RetractationPage from "@/app/(dashboard)/retractation/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import { TEXTES_ABONNEMENT, TEXTES_SUPPRESSION } from "@/config/textes/compte";
import { MODELE_FORMULAIRE_TITRE, RETRACTATION_PERIMETRE } from "@/config/textes/juridique";
import { formulaireTypeRetractation } from "@/config/textes/paiement";
import type { SubscriptionSummary } from "@/lib/account";

jest.mock("next-auth/react", () => ({ signOut: jest.fn() }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
jest.mock("@/components/retractation/retractation-form", () => ({ RetractationForm: () => null }));

const RESILIER = TEXTES_ABONNEMENT.resilier;

function Carte({ plan = "PREMIUM" }: { plan?: string }) {
  const abonnement = useSubscriptionSummary(true);
  return <AbonnementCard plan={plan} xp={0} onCheckout={jest.fn()} isCheckoutLoading={false} abonnement={abonnement} />;
}

beforeEach(() => jest.clearAllMocks());

describe("bouton « Résilier ton contrat » toujours présent pour un Premium", () => {
  it.each([
    ["lecture du résumé en échec (500)", () => jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) })],
    ["réseau coupé", () => jest.fn().mockRejectedValue(new Error("offline"))],
    ["résumé null", () => jest.fn().mockResolvedValue({ ok: true, json: async () => ({ subscription: null }) })],
  ])("%s : bouton affiché, variante outline", async (_cas, fetchMock) => {
    global.fetch = fetchMock() as jest.Mock;
    render(<Carte />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/user/subscription"));
    const bouton = await screen.findByRole("button", { name: RESILIER });
    expect(bouton.className).toContain("border border-border text-text-primary");
    expect(bouton.className).not.toContain("text-text-secondary");
    expect(screen.getByText(TEXTES_ABONNEMENT.resilierDetailSansDate)).toBeInTheDocument();
    expect(document.getElementById(ANCRE_ABONNEMENT)).not.toBeNull();
  });

  it("portail en 404 (aucun client Stripe) : message clair, pas d'erreur générique", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ subscription: null }) })
      .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) }) as jest.Mock;
    render(<Carte />);
    await userEvent.click(await screen.findByRole("button", { name: RESILIER }));
    expect(toast).toHaveBeenCalledWith(TEXTES_ABONNEMENT.aucunAbonnementCarte, "error");
  });

  it("résumé lu sans client Stripe (hors Stripe) : pas de bouton ; non abonné : pas de bouton", async () => {
    const horsStripe: SubscriptionSummary = {
      status: "ACTIVE",
      formule: null,
      priceCents: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      hasPortal: false,
      hasStripeSubscription: false,
    };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ subscription: horsStripe }) }) as jest.Mock;
    const { unmount } = render(<Carte />);
    await waitFor(() => expect(screen.queryByRole("button", { name: RESILIER })).not.toBeInTheDocument());
    unmount();
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ subscription: null }) }) as jest.Mock;
    render(<Carte plan="FREE" />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(screen.queryByRole("button", { name: RESILIER })).not.toBeInTheDocument();
  });
});

describe("pied de page : lien « Résilier ton contrat »", () => {
  it("colonne Légal, vers l'ancre de la carte Abonnement du profil (libellé unique)", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: RESILIER })).toHaveAttribute("href", `/profil#${ANCRE_ABONNEMENT}`);
  });
});

describe("suppression du compte en cours d'abonnement", () => {
  it("avertissement avec la vraie date de fin et lien vers /retractation", () => {
    render(<SupprimerCompteCard abonne finPeriode="2026-11-12T10:00:00.000Z" />);
    expect(screen.getByText(TEXTES_SUPPRESSION.avecAbonnement("12 novembre 2026"))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: TEXTES_SUPPRESSION.retractationLien })).toHaveAttribute("href", "/retractation");
  });

  it("déjà résilié : variante dédiée ; non abonné : aucun avertissement", () => {
    const { unmount } = render(<SupprimerCompteCard abonne resilie finPeriode="2026-11-12T10:00:00.000Z" />);
    expect(screen.getByText(TEXTES_SUPPRESSION.avecAbonnementResilie("12 novembre 2026"))).toBeInTheDocument();
    unmount();
    render(<SupprimerCompteCard abonne={false} />);
    expect(screen.queryByText(/n'est pas remboursée/)).not.toBeInTheDocument();
  });
});

describe("pages légales", () => {
  it("CGU : art. 3 mensuel à durée indéterminée, art. 6 périmètre, art. 7 sans libellé Stripe", () => {
    render(<CGUPage />);
    const text = document.body.textContent ?? "";
    expect(text).not.toContain("reconduite tacitement chaque mois");
    expect(text).toContain("La formule mensuelle est conclue pour une durée indéterminée, sans engagement : elle est prélevée chaque mois jusqu'à ta résiliation.");
    expect(text).toContain(RETRACTATION_PERIMETRE);
    expect(text).not.toContain("Confirmer la résiliation");
    expect(text).toContain(`via le bouton « ${RESILIER} », puis en confirmant la résiliation sur la page qui s'ouvre.`);
    expect(text).toContain("sans remboursement de la période déjà payée, sauf rétractation (article 6)");
  });

  it("/retractation : modèle légal (même source que l'e-mail) et périmètre", () => {
    render(<RetractationPage />);
    expect(screen.getByRole("heading", { name: MODELE_FORMULAIRE_TITRE })).toBeInTheDocument();
    expect(document.querySelector("pre")?.textContent).toBe(formulaireTypeRetractation());
    expect(document.body.textContent).toContain(RETRACTATION_PERIMETRE);
  });

  it("confidentialité : 5 compléments @legal, aucune durée inventée", () => {
    render(<ConfidentialitePage />);
    const text = document.body.textContent ?? "";
    expect(text).toContain("empreinte de ton adresse IP");
    expect(text).toContain("pendant 10 ans");
    expect(text).toContain("Un compte inactif n'est pas supprimé automatiquement");
    expect(text).toContain("on te répond sous un mois");
    expect(text).toContain("pour son propre compte (prévention de la fraude");
    expect(text).not.toMatch(/—|\bvous\b/i);
  });
});

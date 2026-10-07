/**
 * Audit parcours s16, lot C : offre (D4, D5, reco 9, 12), mesure (reco 17),
 * pages légales (reco 18), accessibilité (reco 19).
 */
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AbonnementView, isCheckoutCancelReturn } from "@/components/premium/abonnement-view";
import { PremiumCta } from "@/components/home/premium-cta";
import { useMurVu } from "@/components/premium/use-mur-vu";
import { ProgressBar } from "@/components/ui/progress-bar";
import MentionsLegalesPage from "@/app/(dashboard)/mentions-legales/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import CGUPage from "@/app/(dashboard)/cgu/page";
import RetractationPage from "@/app/(dashboard)/retractation/page";
import {
  ANNUEL_AVANTAGE_LABEL,
  ANNUEL_ECONOMIE_LABEL,
  ANNUEL_MOIS_OFFERTS_LABEL,
  REASSURANCE_PAIEMENT,
} from "@/config/textes/offre";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/stores/user-store", () => ({ useUserStore: () => null }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/retractation/retractation-form", () => ({ RetractationForm: () => null }));
jest.mock("@/hooks/use-content-stats", () => ({
  useContentStats: () => ({ jokes: 600, tips: 400, videos: 80, members: 0 }),
}));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({
  trackUmami: (...args: unknown[]) => mockTrack(...args),
  trackUmamiWhenReady: (...args: unknown[]) => mockTrack(...args),
}));

const { useSession } = require("next-auth/react");

beforeEach(() => {
  mockTrack.mockClear();
  window.history.pushState({}, "", "/abonnement");
});

describe("offre : textes calculés (D5)", () => {
  it("annuel : plus de 3 mois offerts ET 10,89 € économisés, jamais 4 mois", () => {
    expect(ANNUEL_MOIS_OFFERTS_LABEL).toBe("plus de 3 mois offerts");
    expect(ANNUEL_ECONOMIE_LABEL).toBe("10,89 € économisés");
    expect(ANNUEL_AVANTAGE_LABEL).toBe("plus de 3 mois offerts, 10,89 € économisés par an");
    expect(ANNUEL_AVANTAGE_LABEL).not.toMatch(/4 mois|—/);
  });
});

describe("/abonnement (reco 9, 12, 17, D4)", () => {
  it("visiteur : nom Premium, réassurance sous le bouton, vue mesurée avec la source", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    window.history.pushState({}, "", "/abonnement?src=vannes");
    render(<AbonnementView annualAvailable={false} />);
    expect(screen.getByRole("heading", { name: "Premium" })).toBeInTheDocument();
    expect(screen.getByText(REASSURANCE_PAIEMENT)).toBeInTheDocument();
    expect(mockTrack).toHaveBeenCalledWith("abonnement-vu", { src: "vannes" });
    expect(screen.queryByTestId("paiement-annule")).not.toBeInTheDocument();
  });

  it("visiteur : clic vers l'inscription mesuré (abonnement-clic, statut visiteur)", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    window.history.pushState({}, "", "/abonnement?src=modale-defaut");
    render(<AbonnementView annualAvailable={false} />);
    const link = screen.getByText("Commencer à 2,99 €/mois");
    link.addEventListener("click", (e) => e.preventDefault());
    await userEvent.click(link);
    expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
      formule: "mensuel",
      src: "abonnement",
      entree: "modale-defaut",
      statut: "visiteur",
    });
  });

  it.each(["/abonnement?paiement=annule", "/abonnement?upgrade=cancel"])(
    "retour de Stripe sans paiement (%s) : message clair + abonnement-annule",
    (url) => {
      useSession.mockReturnValue({ status: "authenticated" });
      window.history.pushState({}, "", url);
      render(<AbonnementView annualAvailable={false} />);
      expect(screen.getByRole("status")).toHaveTextContent("Paiement annulé, rien n'a été débité.");
      expect(mockTrack).toHaveBeenCalledWith("abonnement-annule");
    },
  );

  it("isCheckoutCancelReturn : nouveau et ancien paramètre", () => {
    expect(isCheckoutCancelReturn(new URLSearchParams("paiement=annule"))).toBe(true);
    expect(isCheckoutCancelReturn(new URLSearchParams("upgrade=cancel"))).toBe(true);
    expect(isCheckoutCancelReturn(new URLSearchParams("plan=annual"))).toBe(false);
  });
});

describe("accueil : bloc Premium", () => {
  it("visiteur : nom Premium, réassurance, clic mesuré ; 1 500+ intact", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumCta />);
    expect(screen.getByRole("heading", { name: "Premium" })).toBeInTheDocument();
    expect(screen.getByText(REASSURANCE_PAIEMENT)).toBeInTheDocument();
    expect(document.body.textContent).toContain("Déjà 1 500+ inscrits");
    const link = screen.getByText("Commencer à 2,99 €/mois");
    link.addEventListener("click", (e) => e.preventDefault());
    await userEvent.click(link);
    expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", { formule: "mensuel", src: "accueil-premium", statut: "visiteur" });
  });
});

describe("mesure et accessibilité", () => {
  it("useMurVu : un seul mur-vu par montage, seulement une fois visible", () => {
    const { rerender } = renderHook(({ visible }) => useMurVu(visible, "conseils"), { initialProps: { visible: false } });
    expect(mockTrack).not.toHaveBeenCalled();
    rerender({ visible: true });
    rerender({ visible: true });
    expect(mockTrack).toHaveBeenCalledTimes(1);
    expect(mockTrack).toHaveBeenCalledWith("mur-vu", { type: "conseils", src: "conseils" });
  });

  it("barre de progression nommée par son libellé (axe aria-progressbar-name)", () => {
    render(<ProgressBar label="1/3 étapes complétées" value={1} max={3} />);
    expect(screen.getByRole("progressbar", { name: "1/3 étapes complétées" })).toBeInTheDocument();
  });
});

describe("pages légales (reco 18, D6)", () => {
  it("mentions légales : hébergeur Cloudflare, plus Replit", () => {
    render(<MentionsLegalesPage />);
    const text = document.body.textContent ?? "";
    expect(text).toContain("Cloudflare, Inc.");
    expect(text).toContain("101 Townsend St, San Francisco, CA 94107");
    expect(text).not.toMatch(/Replit/);
  });

  it("confidentialité : prestataires réels, mesure sans cookie, suppression depuis le profil", () => {
    render(<ConfidentialitePage />);
    const text = document.body.textContent ?? "";
    for (const nom of ["Cloudflare", "Neon", "Stripe", "Resend", "Umami Cloud", "Google"]) expect(text).toContain(nom);
    expect(text).toContain("sans cookie");
    expect(text).toContain("7 octobre 2026");
    expect(text).not.toMatch(/Replit|soumis à votre consentement|intelligence artificielle|\bIA\b/);
    expect(screen.getByRole("link", { name: "profil" })).toHaveAttribute("href", "/profil");
  });

  it("CGU : règle consommateur à la place des tribunaux de Paris exclusifs", () => {
    render(<CGUPage />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/compétence exclusive|tribunaux de Paris/);
    expect(text).toContain("R.631-3");
    expect(text).toContain("médiateur de la consommation");
  });

  it("tutoiement sur les 4 pages légales, sans tiret cadratin", () => {
    for (const Page of [MentionsLegalesPage, ConfidentialitePage, CGUPage, RetractationPage]) {
      const { container, unmount } = render(<Page />);
      expect(container.textContent).not.toMatch(/\bvous\b|\bvotre\b|\bvos\b|—/i);
      unmount();
    }
  });
});

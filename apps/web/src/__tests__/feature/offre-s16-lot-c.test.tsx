/**
 * Audit parcours s16, lot C : offre (D4, D5, reco 9, 12), mesure (reco 17),
 * pages légales (reco 18), accessibilité (reco 19).
 */
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AbonnementView, isCheckoutCancelReturn } from "@/components/premium/abonnement-view";
import { PremiumCta } from "@/components/home/premium-cta";
import { useMurVu } from "@/components/premium/use-mur-vu";
import { ProgressBar } from "@/components/ui/progress-bar";
import MentionsLegalesPage from "@/app/(dashboard)/mentions-legales/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";
import CGUPage from "@/app/(dashboard)/cgu/page";
import RetractationPage from "@/app/(dashboard)/retractation/page";
import { formulaireTypeRetractation } from "@/config/textes/paiement";
import {
  ANNUEL_AVANTAGE_LABEL,
  ANNUEL_ECONOMIE_LABEL,
  ANNUEL_MOIS_OFFERTS_LABEL,
} from "@/config/textes/offre";
import { CARTE_PREMIUM } from "@/config/textes/cta-articles-accueil";
import { normalise } from "../helpers/texte-normalise";

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
    expect(ANNUEL_ECONOMIE_LABEL).toBe("10,89\u00A0€ économisés");
    expect(ANNUEL_AVANTAGE_LABEL).toBe("plus de 3 mois offerts, 10,89\u00A0€ économisés par an");
    expect(ANNUEL_AVANTAGE_LABEL).not.toMatch(/4 mois|—/);
  });
});

describe("/abonnement (reco 9, 12, 17, D4)", () => {
  it("visiteur : nom Premium, réassurance sous le bouton, vue mesurée avec la source", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    window.history.pushState({}, "", "/abonnement?src=vannes");
    render(<AbonnementView annualAvailable={false} />);
    // Trajet de conversion s21 : le nom de la carte reste pour les lecteurs d'écran (le titre dit déjà Premium).
    expect(screen.getByRole("heading", { name: "Offre Premium" })).toBeInTheDocument();
    expect(screen.getByText("TTC / mois")).toBeInTheDocument(); // V3 s21 : « 2,99 € TTC / mois »
    // REASS unique (concision v5) sous le bouton du haut, et sous le bouton final.
    expect(screen.getByTestId("reassurance-paiement")).toHaveTextContent("Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.");
    expect(screen.getByTestId("reassurance-paiement-final")).toHaveTextContent("Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.");
    expect(document.body.textContent).not.toContain("remboursé sous 14 jours");
    expect(mockTrack).toHaveBeenCalledWith("abonnement-vu", { src: "vannes" });
    expect(screen.queryByTestId("paiement-annule")).not.toBeInTheDocument();
  });

  it("s21 (QA M1) : visiteur, le lien d'inscription ramène la source d'entrée sur /abonnement", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    window.history.pushState({}, "", "/abonnement?returnTo=%2Fvannes&src=header");
    render(<AbonnementView annualAvailable={false} />);
    const lien = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href") ?? "")
      .find((h) => h.startsWith("/register?"));
    expect(lien).toBeDefined();
    const callback = new URL(`https://x${lien}`).searchParams.get("callbackUrl") ?? "";
    expect(callback).toBe("/abonnement?returnTo=%2Fvannes&src=header");
  });

  it("s21 (QA M1) : retour d'inscription (auto=1) compté à part, la source d'entrée n'est pas doublée", () => {
    useSession.mockReturnValue({ status: "loading" });
    window.history.pushState({}, "", "/abonnement?returnTo=%2Fvannes&src=header&auto=1");
    render(<AbonnementView annualAvailable={false} />);
    expect(mockTrack).toHaveBeenCalledWith("abonnement-vu", { src: "retour-inscription" });
    expect(mockTrack).not.toHaveBeenCalledWith("abonnement-vu", { src: "header" });
  });

  it("s21 (QA M1) : retour Google, `src` retiré de l'URL avant le paiement auto : la source lue au montage reste", async () => {
    const fetchAvant = global.fetch;
    global.fetch = jest.fn(async () => ({ ok: true, status: 200, json: async () => ({ url: "/?stripe=1" }) })) as unknown as typeof fetch;
    useSession.mockReturnValue({ status: "loading" });
    window.history.pushState({}, "", "/abonnement?src=header&auto=1&auth=inscription-google");
    const { rerender } = render(<AbonnementView annualAvailable={false} />);
    // Le traceur du layout (AuthReturnTracker) retire `auth` et `src` après coup.
    window.history.replaceState({}, "", "/abonnement?auto=1");
    useSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "FREE" } } });
    rerender(<AbonnementView annualAvailable={false} />);
    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith("checkout-ouvert", expect.objectContaining({ src: "header", formule: "mensuel" })),
    );
    global.fetch = fetchAvant;
  });

  it("annuel choisi : « TTC / an » près du montant, même réassurance (V3 s21)", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<AbonnementView annualAvailable />);
    await userEvent.click(screen.getByRole("radio", { name: /^Annuel/ }));
    expect(screen.getByText("TTC / an")).toBeInTheDocument();
    expect(screen.getByTestId("reassurance-paiement")).toHaveTextContent("Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.");
  });

  it("visiteur : clic vers l'inscription mesuré (abonnement-clic, statut visiteur)", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    window.history.pushState({}, "", "/abonnement?src=modale-defaut");
    render(<AbonnementView annualAvailable={false} />);
    const link = screen.getAllByText("S’abonner · 2,99 €/mois")[0];
    link.addEventListener("click", (e) => e.preventDefault());
    await userEvent.click(link);
    expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", {
      formule: "mensuel",
      src: "abonnement",
      entree: "modale-defaut",
      statut: "visiteur",
      emplacement: "haut",
    });
  });

  it.each(["/abonnement?paiement=annule", "/abonnement?upgrade=cancel"])(
    "retour de Stripe sans paiement (%s) : message clair + abonnement-annule",
    (url) => {
      useSession.mockReturnValue({ status: "authenticated" });
      window.history.pushState({}, "", url);
      render(<AbonnementView annualAvailable={false} />);
      // Étalon 5b.2 validé : « Paiement annulé, rien n'a été prélevé. Tu peux réessayer quand tu veux. »
      expect(screen.getByRole("status")).toHaveTextContent("Paiement annulé, rien n’a été prélevé.");
      expect(screen.getByRole("status")).toHaveTextContent("Tu peux réessayer quand tu veux.");
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
  it("visiteur : REASS sous le plein, clic mesuré (concision v5 : plus d'en-tête de prix ni d'« inscrits »)", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<PremiumCta />);
    expect(screen.queryByRole("heading", { name: "Premium" })).toBeNull();
    expect(screen.getByText("Premium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("remboursé sous 14 jours");
    expect(document.body.textContent).not.toContain("inscrits");
    // s21 (B4 + B5) : plein vers /abonnement?src=accueil-premium, libellé du tour 4.
    const link = screen.getByText(normalise(CARTE_PREMIUM.bouton));
    expect(link.closest("a")).toHaveAttribute("href", "/abonnement?src=accueil-premium");
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
      // Lot G : le modèle légal de formulaire (vouvoiement imposé, annexe R.221-1) est exclu du contrôle.
      expect((container.textContent ?? "").replace(formulaireTypeRetractation(), "")).not.toMatch(/\bvous\b|\bvotre\b|\bvos\b|—/i);
      unmount();
    }
  });
});

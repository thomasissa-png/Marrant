/**
 * s21, carte Premium de l'accueil après la concision v5 (textes-v5-a §4 et §5) :
 * - titre, une phrase, plein `OUVRIR` vers /abonnement?src=accueil-premium, REASS, lien gratuit ;
 * - plus d'en-tête de prix, de liste des parcours, d'avantages ni de preuve sociale ;
 * - « Tu crois avoir tout essayé » (HomeCta) n'existe plus.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { PremiumCta } from "@/components/home/premium-cta";
import { CARTE_PREMIUM, libelleOuvrirParcours } from "@/config/textes/cta-articles-accueil";
import { REASSURANCE_UNIQUE } from "@/config/textes/offre";
import { PARCOURS_COUNT } from "@/config/premium";
import { normalise } from "../helpers/texte-normalise";

jest.mock("next-auth/react", () => ({ useSession: () => ({ data: null, status: "unauthenticated" }) }));
jest.mock("@/stores/user-store", () => ({ useUserStore: () => null }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/premium/avantages-premium", () => ({ AvantagesPremium: () => <ul data-testid="avantages" /> }));

describe("carte Premium de l'accueil (B4 + B5)", () => {
  it("titre et phrase unique, rien d'autre au-dessus du plein (ni prix, ni liste, ni avantages)", () => {
    render(<PremiumCta />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(normalise(CARTE_PREMIUM.titre));
    expect(normalise(screen.getByTestId("carte-premium-intro").textContent ?? "")).toBe(
      normalise("De la coloc à l'afterwork, de quoi répondre partout."),
    );
    expect(screen.queryByTestId("avantages")).toBeNull();
    const texte = normalise(document.body.textContent ?? "");
    expect(texte).not.toMatch(/Droit de rétractation|sans engagement|Prix TTC|Un seul prix|inscrits|tout s'ouvre d'un coup|économisés/i);
    expect(screen.queryByRole("link", { name: /rétractation/i })).toBeNull();
  });

  it("plein Premium puis lien texte étape 1 de Répartie (s21 concision), dans cet ordre, un seul plein", () => {
    const { container } = render(<PremiumCta />);
    const plein = container.querySelector<HTMLAnchorElement>('a[data-accueil-cta="abonnement"]')!;
    const contour = container.querySelector<HTMLAnchorElement>('a[data-accueil-cta="etape-1"]')!;
    expect(plein).toHaveAttribute("href", "/abonnement?src=accueil-premium");
    expect(plein).toHaveTextContent(normalise(CARTE_PREMIUM.bouton));
    expect(contour).toHaveAttribute("href", "/parcours/repartie?src=accueil#etape-1");
    expect(contour).toHaveTextContent(CARTE_PREMIUM.contour);
    // s21 concision (18/10) : le gratuit n'est plus un bouton contour mais un lien texte (L2).
    expect(contour.className).toContain("underline");
    expect(contour.className).not.toMatch(/\bborder\b/);
    expect(plein.compareDocumentPosition(contour) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelectorAll("a.bg-accent-secondary-hover")).toHaveLength(1);
    expect(screen.queryByText("Voir les vannes gratuites")).toBeNull();
    // REASS entre le plein et le lien gratuit.
    const reass = screen.getByText(normalise(REASSURANCE_UNIQUE));
    expect(plein.compareDocumentPosition(reass) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(reass.compareDocumentPosition(contour) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("le bloc « Tu crois avoir tout essayé » a disparu de l'accueil", () => {
    const page = fs.readFileSync(path.join(__dirname, "..", "..", "app", "(dashboard)", "page.tsx"), "utf8");
    expect(page).not.toContain("HomeCta");
    expect(fs.existsSync(path.join(__dirname, "..", "..", "components", "home", "home-cta.tsx"))).toBe(false);
  });
});

describe("libellé d'ouverture OUVRIR (unique depuis la concision v5)", () => {
  it("OUVRIR : nombre de parcours depuis PARCOURS_COUNT, repli « tous les parcours »", () => {
    expect(normalise(libelleOuvrirParcours())).toBe(`Ouvrir les ${PARCOURS_COUNT} parcours · 2,99 €/mois`);
    expect(normalise(libelleOuvrirParcours(1))).toBe("Ouvrir tous les parcours · 2,99 €/mois");
    expect(normalise(libelleOuvrirParcours(0))).toBe("Ouvrir tous les parcours · 2,99 €/mois");
  });

});

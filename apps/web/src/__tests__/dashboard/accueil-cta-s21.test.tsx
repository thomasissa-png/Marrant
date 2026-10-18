/**
 * s21, blocs d'appel partie A (B4 + B5) : carte Premium fusionnée de l'accueil.
 * - « Tu crois avoir tout essayé » (HomeCta) n'existe plus ;
 * - [S12] sans « Droit de rétractation » ni « sans engagement », annuel seulement s'il existe ;
 * - plein vers /abonnement?src=accueil-premium, contour vers l'étape 1 de Répartie.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { PremiumCta } from "@/components/home/premium-cta";
import { CARTE_PREMIUM, lienDebloquerParcours } from "@/config/textes/cta-articles-accueil";
import { PARCOURS_COUNT } from "@/config/premium";
import { normalise } from "../helpers/texte-normalise";

jest.mock("next-auth/react", () => ({ useSession: () => ({ data: null, status: "unauthenticated" }) }));
jest.mock("@/stores/user-store", () => ({ useUserStore: () => null }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/components/premium/premium-benefits", () => ({ PremiumBenefits: () => <ul data-testid="avantages" /> }));

describe("carte Premium de l'accueil (B4 + B5)", () => {
  it("titre et intro du tour 4, sans mention juridique", () => {
    render(<PremiumCta />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(normalise(CARTE_PREMIUM.titre));
    expect(normalise(document.body.textContent ?? "")).toContain("La table qui rit, et la réplique, c'est toi qui l'as lancée.");
    expect(normalise(document.body.textContent ?? "")).toMatch(/une étape par semaine \(15 à 20 minutes\)/);
    expect(normalise(document.body.textContent ?? "")).not.toMatch(/Droit de rétractation|sans engagement|Pour t'y mettre/i);
    expect(screen.queryByRole("link", { name: /rétractation/i })).toBeNull();
  });

  it("[S12] : « Prix TTC » seul, puis avec l'annuel quand il est configuré", () => {
    const { unmount } = render(<PremiumCta />);
    expect(screen.getByText("Prix TTC")).toBeInTheDocument();
    expect(normalise(document.body.textContent ?? "")).not.toContain("24,99");
    unmount();
    render(<PremiumCta annuelDisponible />);
    expect(screen.getByText(normalise(CARTE_PREMIUM.ligneTarif(true)))).toBeInTheDocument();
    expect(normalise(document.body.textContent ?? "")).toMatch(/Prix TTC, ou 24,99 €\/an \(soit 2,08 €\/mois, 10,89 € économisés\)/);
  });

  it("plein Premium puis contour étape 1 de Répartie, dans cet ordre, un seul plein", () => {
    const { container } = render(<PremiumCta />);
    const plein = container.querySelector<HTMLAnchorElement>('a[data-accueil-cta="abonnement"]')!;
    const contour = container.querySelector<HTMLAnchorElement>('a[data-accueil-cta="etape-1"]')!;
    expect(plein).toHaveAttribute("href", "/abonnement?src=accueil-premium");
    expect(plein).toHaveTextContent(normalise(CARTE_PREMIUM.bouton));
    expect(contour).toHaveAttribute("href", "/parcours/repartie?src=accueil#etape-1");
    expect(contour).toHaveTextContent(CARTE_PREMIUM.contour);
    expect(contour.className).toContain("border");
    expect(plein.compareDocumentPosition(contour) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelectorAll("a.bg-accent-secondary-hover")).toHaveLength(1);
    expect(screen.queryByText("Voir les vannes gratuites")).toBeNull();
    expect(normalise(document.body.textContent ?? "")).toContain("Déjà 1 500+ inscrits, et toi");
  });

  it("le bloc « Tu crois avoir tout essayé » a disparu de l'accueil", () => {
    const page = fs.readFileSync(path.join(__dirname, "..", "..", "app", "(dashboard)", "page.tsx"), "utf8");
    expect(page).not.toContain("HomeCta");
    expect(fs.existsSync(path.join(__dirname, "..", "..", "components", "home", "home-cta.tsx"))).toBe(false);
  });
});

describe("lien payant (gabarit)", () => {
  it("nombre de parcours depuis PARCOURS_COUNT, repli « tous les parcours »", () => {
    expect(normalise(lienDebloquerParcours())).toBe(`Débloquer les ${PARCOURS_COUNT} parcours, 2,99 €/mois`);
    expect(normalise(lienDebloquerParcours(1))).toBe("Débloquer tous les parcours, 2,99 €/mois");
    expect(normalise(lienDebloquerParcours(0))).toBe("Débloquer tous les parcours, 2,99 €/mois");
  });
});

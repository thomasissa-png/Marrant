/**
 * s21 concision (choix de Thomas du 18/10, règle 11 et étalons 4 et 6) : un composant
 * unique `AvantagesPremium` (4 lignes), alimenté par une seule constante de texte
 * (`AVANTAGES_PREMIUM`), utilisé sur /abonnement et la carte Premium de l'accueil ;
 * retiré du mur du carnet. Texte actuel gardé provisoirement, mot pour mot.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { AvantagesPremium } from "@/components/premium/avantages-premium";
import { AVANTAGES_COMPTEURS, AVANTAGES_PREMIUM } from "@/config/textes/avantages-premium";
import { PARCOURS_COUNT } from "@/config/premium";

const mockStats = { jokes: 0, tips: 0, videos: 0 };
jest.mock("@/hooks/use-content-stats", () => ({ useContentStats: () => mockStats }));

const SRC = path.join(__dirname, "..", "..");
const lire = (f: string) => fs.readFileSync(path.join(SRC, f), "utf8");

describe("AvantagesPremium", () => {
  afterEach(() => Object.assign(mockStats, { jokes: 0, tips: 0, videos: 0 }));

  it("4 lignes, dans l'ordre de la constante, titre en gras", () => {
    render(<AvantagesPremium />);
    const lignes = screen.getAllByRole("listitem");
    expect(AVANTAGES_PREMIUM).toHaveLength(4);
    expect(lignes).toHaveLength(4);
    lignes.forEach((li, i) => expect(li.querySelector("strong")).toHaveTextContent(AVANTAGES_PREMIUM[i].fort));
  });

  it("texte actuel gardé (provisoire) : sans chiffres du catalogue, puis avec", () => {
    const { rerender } = render(<AvantagesPremium />);
    const texte = () => screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(texte()[0]).toMatch(new RegExp(`^✓Les ${PARCOURS_COUNT} parcours en entier : .+\\. La première étape de chaque parcours est offerte\\.$`));
    expect(texte()[2]).toBe("✓Tes favoris : garde sous la main les vannes, conseils et vidéos à ressortir.");
    expect(texte()[3]).toBe(
      "✓Les listes complètes, au lieu de 10 vannes, 3 conseils et 3 vidéos sans abonnement, avec le filtre par catégorie des vannes.",
    );
    Object.assign(mockStats, { jokes: 200, tips: 60, videos: 80 });
    rerender(<AvantagesPremium />);
    expect(texte()[3]).toBe(
      "✓Les listes complètes (200+ vannes, 60+ conseils, 80+ vidéos analysées), au lieu de 10 vannes, 3 conseils et 3 vidéos sans abonnement, avec le filtre par catégorie des vannes.",
    );
    expect(document.body.textContent).not.toContain(AVANTAGES_COMPTEURS);
  });

  it("une seule source de texte : le composant n'écrit rien en dur", () => {
    const composant = lire("components/premium/avantages-premium.tsx");
    for (const { fort } of AVANTAGES_PREMIUM) expect(composant).not.toContain(fort);
    expect(composant).not.toMatch(/carnet mensuel|Tes favoris|listes complètes/);
  });

  it("utilisé sur /abonnement et la carte d'accueil, retiré du mur du carnet, ancien composant supprimé", () => {
    expect(lire("components/premium/abonnement-view.tsx")).toContain("<AvantagesPremium ");
    expect(lire("components/home/premium-cta.tsx")).toContain("<AvantagesPremium ");
    const carnet = lire("components/carnet/carnet-page.tsx");
    expect(carnet).not.toContain("AvantagesPremium");
    expect(carnet).not.toContain("PremiumBenefits");
    expect(fs.existsSync(path.join(SRC, "components/premium/premium-benefits.tsx"))).toBe(false);
  });
});

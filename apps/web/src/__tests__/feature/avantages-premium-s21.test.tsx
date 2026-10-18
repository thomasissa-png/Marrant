/**
 * Concision v5 (textes-v5-c §2, validé à l'aveugle le 18/10) : un composant unique
 * `AvantagesPremium` (4 lignes, 22 mots), alimenté par une seule constante de texte
 * (`AVANTAGES_PREMIUM`), utilisé sur /abonnement seulement (retiré de l'accueil, du carnet
 * et de la fenêtre Premium).
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { AvantagesPremium } from "@/components/premium/avantages-premium";
import { AVANTAGES_PREMIUM } from "@/config/textes/avantages-premium";

const SRC = path.join(__dirname, "..", "..");
const lire = (f: string) => fs.readFileSync(path.join(SRC, f), "utf8");

describe("AvantagesPremium", () => {
  it("les 4 lignes de la v5, mot pour mot, dans l'ordre", () => {
    render(<AvantagesPremium />);
    const lignes = screen.getAllByRole("listitem").map((li) => (li.textContent ?? "").replace(/ /g, " "));
    expect(lignes).toEqual([
      "✓Chaque parcours en entier",
      "✓Un nouveau carnet de répartie chaque mois",
      "✓Tout le catalogue : vannes, conseils, vidéos",
      "✓Tes favoris sous la main",
    ]);
    expect(AVANTAGES_PREMIUM.join(" ").split(/\s+/).filter((m) => /[\p{L}\d]/u.test(m))).toHaveLength(22);
  });

  it("une seule source de texte : le composant n'écrit rien en dur", () => {
    const composant = lire("components/premium/avantages-premium.tsx");
    for (const ligne of AVANTAGES_PREMIUM) expect(composant).not.toContain(ligne);
  });

  it("utilisé sur /abonnement seulement ; retiré de l'accueil, du carnet et de la fenêtre", () => {
    expect(lire("components/premium/abonnement-view.tsx")).toContain("<AvantagesPremium ");
    for (const f of ["components/home/premium-cta.tsx", "components/carnet/carnet-page.tsx", "components/premium/premium-modal.tsx"]) {
      expect(lire(f)).not.toContain("AvantagesPremium");
      expect(lire(f)).not.toContain("PremiumBenefits");
    }
    expect(fs.existsSync(path.join(SRC, "components/premium/premium-benefits.tsx"))).toBe(false);
  });
});

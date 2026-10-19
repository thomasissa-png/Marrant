/**
 * Concision v5 puis trajet de conversion s21 (étalon A, 19/10) : un composant unique
 * `AvantagesPremium` (3 lignes, 4 avec la promesse de la lettre), alimenté par une seule constante de texte
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
  it("les 3 lignes de l'étalon A, mot pour mot, dans l'ordre ; la 4e (lettre) seulement si la promesse est vraie", () => {
    const { unmount } = render(<AvantagesPremium />);
    const lignes = screen.getAllByRole("listitem").map((li) => (li.textContent ?? "").replace(/\s/g, " "));
    expect(lignes).toEqual([
      "✓Tout le catalogue : vannes, conseils, vidéos",
      "✓Les 5 parcours, de la première à la dernière étape",
      "✓Un nouveau carnet de répartie chaque mois",
    ]);
    expect(AVANTAGES_PREMIUM.join(" ").split(/\s+/).filter((m) => /[\p{L}\d]/u.test(m))).toHaveLength(23);
    unmount();
    render(<AvantagesPremium lettre />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getAllByRole("listitem")[3]).toHaveTextContent(/^✓Une lettre par e-\u2060?mail chaque semaine, si tu la veux\.$/);
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

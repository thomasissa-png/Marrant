/**
 * Audit s16, lot D (point 7) : nom accessible des barres de progression.
 */
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { progressionParcoursLabel } from "@/config/textes/accessibilite";

describe("ProgressBar ariaLabel", () => {
  it("ariaLabel donne le nom de la barre, sans libellé visible", () => {
    render(<ProgressBar value={2} max={5} ariaLabel={progressionParcoursLabel("Répartie", 2, 5)} />);
    expect(screen.getByRole("progressbar", { name: "Progression du parcours Répartie : 2 étapes sur 5" })).toBeInTheDocument();
    expect(screen.queryByText(/Progression du parcours/)).not.toBeInTheDocument();
  });

  it("ariaLabel prioritaire sur label ; label seul reste le nom (compatibilité)", () => {
    const { unmount } = render(<ProgressBar value={1} max={4} label="1/4 étapes" ariaLabel="Nom dédié" />);
    expect(screen.getByRole("progressbar", { name: "Nom dédié" })).toBeInTheDocument();
    unmount();
    render(<ProgressBar value={1} max={4} label="1/4 étapes" />);
    expect(screen.getByRole("progressbar", { name: "1/4 étapes" })).toBeInTheDocument();
  });

  it("singulier à 0 ou 1 étape", () => {
    expect(progressionParcoursLabel("X", 1, 3)).toBe("Progression du parcours X : 1 étape sur 3");
    expect(progressionParcoursLabel("X", 0, 3)).toBe("Progression du parcours X : 0 étape sur 3");
  });
});

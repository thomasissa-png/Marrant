import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StreakCounter } from "@/components/ui/streak-counter";

describe("Button", () => {
  it("rend un bouton avec le texte", () => {
    render(<Button>Cliquer</Button>);
    expect(screen.getByRole("button", { name: "Cliquer" })).toBeInTheDocument();
  });

  it("applique la variante primary par défaut", () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-accent-secondary-hover");
  });

  it("applique la variante ghost", () => {
    render(<Button variant="ghost">Test</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("text-text-secondary");
  });

  it("est désactivable", () => {
    render(<Button disabled>Désactivé</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Badge", () => {
  it("rend le texte du badge", () => {
    render(<Badge>Premium</Badge>);
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });
});

describe("Card", () => {
  it("rend le contenu de la card", () => {
    render(
      <Card>
        <CardTitle>Titre</CardTitle>
      </Card>
    );
    expect(screen.getByText("Titre")).toBeInTheDocument();
  });
});

describe("ProgressBar", () => {
  it("rend avec la bonne progression", () => {
    render(<ProgressBar value={50} max={100} label="Progression" showPercentage />);
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("Progression")).toBeInTheDocument();
  });

  it("a le rôle progressbar avec les attributs ARIA", () => {
    render(<ProgressBar value={30} max={100} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });
});

describe("StreakCounter", () => {
  it("affiche le compteur de streak", () => {
    // Étalon 3.8 A (s17 tour 1) : jours de pratique d'affilée + aide, nom vocal en français.
    render(<StreakCounter count={7} />);
    expect(screen.getByText("7 jours de pratique d'affilée")).toBeInTheDocument();
    expect(screen.getByText("Un jour compte quand tu valides une étape ou que tu termines un quiz d'étape.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "série" })).toBeInTheDocument();
  });

  it("gère le singulier", () => {
    render(<StreakCounter count={1} />);
    expect(screen.getByText("1 jour de pratique d'affilée")).toBeInTheDocument();
  });

  it("à zéro : invitation, jamais de culpabilité", () => {
    render(<StreakCounter count={0} />);
    expect(screen.getByText("Ta série démarre à ta prochaine étape.")).toBeInTheDocument();
  });
});

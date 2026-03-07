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
    expect(button.className).toContain("bg-accent-yellow");
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
    render(<StreakCounter count={7} />);
    expect(screen.getByText("7 jours")).toBeInTheDocument();
    expect(screen.getByText("de suite")).toBeInTheDocument();
  });

  it("gère le singulier", () => {
    render(<StreakCounter count={1} />);
    expect(screen.getByText("1 jour")).toBeInTheDocument();
  });
});

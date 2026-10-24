import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-accent-secondary-hover");
  });

  it("applies secondary variant", () => {
    render(<Button variant="secondary">Sec</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-accent-secondary");
  });

  it("applies ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-text-secondary");
  });

  it("applies outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");
  });

  it("niveau 2 : une seule variante, `outline-accent` (bordure violette à 80 %)", () => {
    render(<Button variant="outline-accent">Niveau 2</Button>);
    expect(screen.getByRole("button")).toHaveClass("border", "border-accent-primary/80");
  });

  it("aucune surcharge locale de bordure violette sur un bouton (revue design s21 M3)", () => {
    const fs = jest.requireActual<typeof import("fs")>("fs");
    const path = jest.requireActual<typeof import("path")>("path");
    const fautifs: string[] = [];
    const parcourir = (dossier: string) => {
      for (const nom of fs.readdirSync(dossier)) {
        const chemin = path.join(dossier, nom);
        if (fs.statSync(chemin).isDirectory()) parcourir(chemin);
        else if (chemin.endsWith(".tsx")) {
          const source = fs.readFileSync(chemin, "utf8");
          if (/variant:\s*"outline"[^)]*\)?,?[\s\S]{0,300}?border-accent-primary(?!\/[0-3]0)/.test(source)) fautifs.push(chemin);
        }
      }
    };
    parcourir(path.join(process.cwd(), "src", "components"));
    expect(fautifs).toEqual([]);
  });

  it("applies danger variant", () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-error");
  });

  it("applies sm size", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8");
  });

  it("applies md size by default", () => {
    render(<Button>Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10");
  });

  it("applies lg size", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-12");
  });

  it("applies icon size", () => {
    render(<Button size="icon">I</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-10");
  });

  it("renders as disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass("disabled:opacity-50");
  });

  it("handles click events", async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire click when disabled", async () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Nope</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges custom className", () => {
    render(<Button className="my-class">Btn</Button>);
    expect(screen.getByRole("button")).toHaveClass("my-class");
  });

  it("forwards ref", () => {
    const ref = jest.fn();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it("passes through HTML attributes", () => {
    render(<Button type="submit" aria-label="submit form">Submit</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("type", "submit");
    expect(btn).toHaveAttribute("aria-label", "submit form");
  });
});

import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default variant", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("bg-background-elevated");
  });

  it("applies yellow variant", () => {
    render(<Badge variant="yellow">Yellow</Badge>);
    expect(screen.getByText("Yellow")).toHaveClass("text-accent-yellow");
  });

  it("applies violet variant", () => {
    render(<Badge variant="violet">Violet</Badge>);
    expect(screen.getByText("Violet")).toHaveClass("text-accent-violet");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText("OK")).toHaveClass("text-success");
  });

  it("applies error variant", () => {
    render(<Badge variant="error">Err</Badge>);
    expect(screen.getByText("Err")).toHaveClass("text-error");
  });

  it("applies premium variant with gradient", () => {
    render(<Badge variant="premium">PRO</Badge>);
    expect(screen.getByText("PRO")).toHaveClass("bg-gradient-to-r");
  });

  it("merges custom className", () => {
    render(<Badge className="custom">Badge</Badge>);
    expect(screen.getByText("Badge")).toHaveClass("custom");
  });

  it("renders as span element", () => {
    render(<Badge>Span</Badge>);
    expect(screen.getByText("Span").tagName).toBe("SPAN");
  });
});

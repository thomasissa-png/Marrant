import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/ui/empty-state";

describe("EmptyState", () => {
  it("renders emoji with role img and aria-label", () => {
    render(<EmptyState emoji="😅" emojiLabel="triste" title="Rien" />);
    expect(screen.getByRole("img", { name: "triste" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "triste" })).toHaveTextContent("😅");
  });

  it("renders title", () => {
    render(<EmptyState emoji="🔍" emojiLabel="search" title="Aucun résultat" />);
    expect(screen.getByText("Aucun résultat")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <EmptyState emoji="🔍" emojiLabel="s" title="T" description="Some description" />
    );
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(
      <EmptyState emoji="🔍" emojiLabel="s" title="T" />
    );
    expect(container.querySelectorAll("p").length).toBe(1); // only title
  });

  it("renders CTA button when both ctaLabel and ctaHref are provided", () => {
    render(
      <EmptyState
        emoji="🔍"
        emojiLabel="s"
        title="T"
        ctaLabel="Go"
        ctaHref="/somewhere"
      />
    );
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("does not render CTA when ctaLabel is missing", () => {
    render(
      <EmptyState emoji="🔍" emojiLabel="s" title="T" ctaHref="/somewhere" />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render CTA when ctaHref is missing", () => {
    render(
      <EmptyState emoji="🔍" emojiLabel="s" title="T" ctaLabel="Go" />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

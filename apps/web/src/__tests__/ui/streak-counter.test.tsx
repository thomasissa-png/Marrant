import { render, screen } from "@testing-library/react";
import { StreakCounter } from "@/components/ui/streak-counter";

describe("StreakCounter", () => {
  it("renders fire emoji with role img", () => {
    render(<StreakCounter count={5} />);
    expect(screen.getByRole("img", { name: "streak" })).toBeInTheDocument();
  });

  it("displays count", () => {
    render(<StreakCounter count={7} />);
    expect(screen.getByText(/7 jours/)).toBeInTheDocument();
  });

  it("uses singular when count is 1", () => {
    render(<StreakCounter count={1} />);
    expect(screen.getByText("1 jour")).toBeInTheDocument();
  });

  it("uses plural when count > 1", () => {
    render(<StreakCounter count={3} />);
    expect(screen.getByText("3 jours")).toBeInTheDocument();
  });

  it("shows 'de suite' label", () => {
    render(<StreakCounter count={2} />);
    expect(screen.getByText("de suite")).toBeInTheDocument();
  });

  it("applies pulse animation when count > 0", () => {
    const { container } = render(<StreakCounter count={5} />);
    const emoji = container.querySelector(".animate-streak-pulse");
    expect(emoji).toBeInTheDocument();
  });

  it("does not apply pulse when count is 0", () => {
    const { container } = render(<StreakCounter count={0} />);
    const emoji = container.querySelector(".animate-streak-pulse");
    expect(emoji).not.toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<StreakCounter count={1} className="my-class" />);
    expect(container.firstChild).toHaveClass("my-class");
  });
});

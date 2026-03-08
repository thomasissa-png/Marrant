import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/components/ui/progress-bar";

describe("ProgressBar", () => {
  it("renders with role progressbar", () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow correctly", () => {
    render(<ProgressBar value={30} max={100} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "30");
  });

  it("sets aria-valuemin and aria-valuemax", () => {
    render(<ProgressBar value={10} max={200} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "200");
  });

  it("sets aria-label from label prop", () => {
    render(<ProgressBar value={50} label="Progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Progress");
  });

  it("shows label text", () => {
    render(<ProgressBar value={50} label="XP Progress" />);
    expect(screen.getByText("XP Progress")).toBeInTheDocument();
  });

  it("shows percentage when showPercentage is true", () => {
    render(<ProgressBar value={75} max={100} showPercentage />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("caps percentage at 100%", () => {
    render(<ProgressBar value={200} max={100} showPercentage />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("defaults max to 100", () => {
    render(<ProgressBar value={50} showPercentage />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("does not show label/percentage when not provided", () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.querySelector(".mb-1")).not.toBeInTheDocument();
  });

  it("applies yellow variant by default", () => {
    const { container } = render(<ProgressBar value={50} />);
    const inner = container.querySelector(".bg-accent-yellow");
    expect(inner).toBeInTheDocument();
  });

  it("applies gradient variant", () => {
    const { container } = render(<ProgressBar value={50} variant="gradient" />);
    const inner = container.querySelector(".bg-gradient-to-r");
    expect(inner).toBeInTheDocument();
  });

  it("applies violet variant", () => {
    const { container } = render(<ProgressBar value={50} variant="violet" />);
    const inner = container.querySelector(".bg-accent-violet");
    expect(inner).toBeInTheDocument();
  });
});

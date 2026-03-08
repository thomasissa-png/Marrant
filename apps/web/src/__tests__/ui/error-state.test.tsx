import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "@/components/ui/error-state";

describe("ErrorState", () => {
  it("renders error emoji with correct aria-label", () => {
    render(<ErrorState />);
    expect(screen.getByRole("img", { name: "erreur" })).toBeInTheDocument();
  });

  it("shows default message", () => {
    render(<ErrorState />);
    expect(screen.getByText("Oups, quelque chose s'est mal passé.")).toBeInTheDocument();
  });

  it("shows custom message", () => {
    render(<ErrorState message="Custom error" />);
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("shows supportive message", () => {
    render(<ErrorState />);
    expect(
      screen.getByText("Pas de panique, même les meilleurs humoristes ratent des blagues.")
    ).toBeInTheDocument();
  });

  it("shows retry button when onRetry is provided", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument();
  });

  it("does not show retry button when onRetry is not provided", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const onRetry = jest.fn();
    render(<ErrorState onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: "Réessayer" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

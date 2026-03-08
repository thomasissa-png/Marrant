import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "@/components/ui/toast";

function TestToastTrigger() {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast("Success!", "success")}>Success</button>
      <button onClick={() => addToast("Error!", "error")}>Error</button>
      <button onClick={() => addToast("Info!", "info")}>Info</button>
    </div>
  );
}

// Mock crypto.randomUUID
Object.defineProperty(globalThis.crypto, "randomUUID", {
  value: jest.fn(() => Math.random().toString(36).substring(2)),
});

describe("ToastProvider", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders nothing when no toasts", () => {
    const { container } = render(<ToastProvider />);
    expect(container.firstChild).toBeNull();
  });

  it("shows toast when addToast is called", async () => {
    render(
      <>
        <ToastProvider />
        <TestToastTrigger />
      </>
    );
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Success")
    );
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });

  it("shows error toast with error styling", async () => {
    render(
      <>
        <ToastProvider />
        <TestToastTrigger />
      </>
    );
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Error")
    );
    expect(screen.getByText("Error!")).toBeInTheDocument();
    expect(screen.getByText("Error!").closest("[role='status']")).toHaveClass("bg-error");
  });

  it("shows info toast with yellow styling", async () => {
    render(
      <>
        <ToastProvider />
        <TestToastTrigger />
      </>
    );
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Info")
    );
    expect(screen.getByText("Info!")).toBeInTheDocument();
    expect(screen.getByText("Info!").closest("[role='status']")).toHaveClass("bg-accent-yellow");
  });

  it("has aria-live polite for accessibility", async () => {
    render(
      <>
        <ToastProvider />
        <TestToastTrigger />
      </>
    );
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Success")
    );
    expect(screen.getByText("Success!").closest("[aria-live]")).toHaveAttribute(
      "aria-live",
      "polite"
    );
  });

  it("removes toast after 3 seconds", async () => {
    render(
      <>
        <ToastProvider />
        <TestToastTrigger />
      </>
    );
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Success")
    );
    expect(screen.getByText("Success!")).toBeInTheDocument();

    act(() => { jest.advanceTimersByTime(3100); });
    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
  });

  it("has a close button with aria-label", async () => {
    render(
      <>
        <ToastProvider />
        <TestToastTrigger />
      </>
    );
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Success")
    );
    expect(screen.getByLabelText("Fermer")).toBeInTheDocument();
  });

  it("removes toast when close button clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <>
        <ToastProvider />
        <TestToastTrigger />
      </>
    );
    await user.click(screen.getByText("Success"));
    await user.click(screen.getByLabelText("Fermer"));
    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
  });
});

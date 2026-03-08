import { render, screen, act } from "@testing-library/react";
import { XpNotificationProvider, showXpGain } from "@/components/ui/xp-notification";

describe("XpNotification", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders nothing initially", () => {
    const { container } = render(<XpNotificationProvider />);
    expect(container.firstChild).toBeNull();
  });

  it("shows XP notification when showXpGain is called", () => {
    render(<XpNotificationProvider />);
    act(() => {
      showXpGain(10);
    });
    expect(screen.getByText("+10 XP ⚡")).toBeInTheDocument();
  });

  it("has role=status for accessibility", () => {
    render(<XpNotificationProvider />);
    act(() => {
      showXpGain(25);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has aria-label with XP amount", () => {
    render(<XpNotificationProvider />);
    act(() => {
      showXpGain(10);
    });
    expect(screen.getByLabelText("10 XP gagnés")).toBeInTheDocument();
  });

  it("auto-removes after 2 seconds", () => {
    render(<XpNotificationProvider />);
    act(() => {
      showXpGain(10);
    });
    expect(screen.getByText("+10 XP ⚡")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2100);
    });
    expect(screen.queryByText("+10 XP ⚡")).not.toBeInTheDocument();
  });

  it("applies xp-float animation class", () => {
    render(<XpNotificationProvider />);
    act(() => {
      showXpGain(10);
    });
    const el = screen.getByText("+10 XP ⚡");
    expect(el.className).toContain("animate-xp-float");
  });
});

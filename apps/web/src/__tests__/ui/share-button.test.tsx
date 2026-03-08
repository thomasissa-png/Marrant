/**
 * @jest-environment jsdom
 */
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareButton } from "@/components/ui/share-button";

// Override navigator to add clipboard and share support
const writeTextMock = jest.fn().mockImplementation(() => Promise.resolve());
const shareMock = jest.fn().mockImplementation(() => Promise.resolve());

beforeAll(() => {
  // In jsdom, navigator is read-only but we can define properties
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });
  } else {
    jest.spyOn(navigator.clipboard, "writeText").mockImplementation(writeTextMock);
  }
});

describe("ShareButton", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    writeTextMock.mockClear();
    shareMock.mockClear();

    // Remove navigator.share so we test clipboard fallback
    if ("share" in navigator) {
      Object.defineProperty(navigator, "share", {
        value: undefined,
        writable: true,
        configurable: true,
      });
    }
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders share button with aria-label Partager", () => {
    render(<ShareButton title="Test" text="Hello" />);
    expect(screen.getByLabelText("Partager")).toBeInTheDocument();
  });

  it("uses clipboard fallback and shows Copié state", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ShareButton title="Test" text="Hello World" />);

    await user.click(screen.getByLabelText("Partager"));

    // The component calls navigator.clipboard.writeText and updates aria-label
    await waitFor(() => {
      expect(screen.getByLabelText("Copié !")).toBeInTheDocument();
    });
  });

  it("reverts to Partager after 2 seconds", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ShareButton title="Test" text="Hello" />);

    await user.click(screen.getByLabelText("Partager"));

    await waitFor(() => {
      expect(screen.getByLabelText("Copié !")).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(2100);
    });

    expect(screen.getByLabelText("Partager")).toBeInTheDocument();
  });

  it("stops event propagation on click", async () => {
    const parentClick = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <div onClick={parentClick}>
        <ShareButton title="T" text="X" />
      </div>
    );

    await user.click(screen.getByLabelText("Partager"));
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("calls navigator.share when available", async () => {
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      writable: true,
      configurable: true,
    });

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ShareButton title="My Title" text="My Text" />);

    await user.click(screen.getByLabelText("Partager"));

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: "My Title", text: "My Text" })
      );
    });
  });

  it("merges custom className", () => {
    render(<ShareButton title="T" text="X" className="my-class" />);
    expect(screen.getByLabelText("Partager")).toHaveClass("my-class");
  });
});

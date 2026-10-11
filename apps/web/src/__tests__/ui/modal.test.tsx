import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/ui/modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders children when open", () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Hello World</p>
      </Modal>
    );
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("has dialog role and aria-modal", () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("shows close button with aria-label", () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByLabelText("Fermer")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", async () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    await userEvent.click(screen.getByLabelText("Fermer"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on Escape key", () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking overlay", async () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    const overlay = screen.getByRole("dialog");
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("links the dialog to its title with aria-labelledby", () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} labelledBy="modal-title">
        <h2 id="modal-title">Titre</h2>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "modal-title");
    expect(screen.getByRole("dialog", { name: "Titre" })).toBeInTheDocument();
  });

  it("moves focus to the first control of the content on open", () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <button type="button">Premier</button>
        <button type="button">Second</button>
      </Modal>
    );
    expect(screen.getByText("Premier")).toHaveFocus();
  });

  it("falls back to the close button when the content has no control", () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByLabelText("Fermer")).toHaveFocus();
  });

  it("traps Tab and Shift+Tab inside the modal", () => {
    render(
      <>
        <button type="button">Derrière</button>
        <Modal isOpen={true} onClose={jest.fn()}>
          <button type="button">Premier</button>
          <button type="button">Dernier</button>
        </Modal>
      </>
    );
    const close = screen.getByLabelText("Fermer");
    const last = screen.getByText("Dernier");

    // Tab sur le dernier élément : retour au premier (« Fermer », premier dans l'ordre DOM).
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    // Shift+Tab sur le premier élément : passage au dernier.
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();

    // Focus parti hors de la modale : Tab le ramène dedans.
    screen.getByText("Derrière").focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();
  });

  it("does not interfere with Tab between middle elements", () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <button type="button">Premier</button>
        <button type="button">Dernier</button>
      </Modal>
    );
    const first = screen.getByText("Premier");
    first.focus();
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("returns focus to the trigger when closed", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Ouvrir
          </button>
          <Modal isOpen={open} onClose={() => setOpen(false)}>
            <button type="button">Dedans</button>
          </Modal>
        </>
      );
    }
    render(<Harness />);
    const trigger = screen.getByText("Ouvrir");
    await userEvent.click(trigger);
    expect(screen.getByText("Dedans")).toHaveFocus();
    await userEvent.click(screen.getByLabelText("Fermer"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps focus in place when the parent re-renders with a new onClose", () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => undefined}>
        <button type="button">Premier</button>
        <button type="button">Second</button>
      </Modal>
    );
    const second = screen.getByText("Second");
    second.focus();
    rerender(
      <Modal isOpen={true} onClose={() => undefined}>
        <button type="button">Premier</button>
        <button type="button">Second</button>
      </Modal>
    );
    expect(second).toHaveFocus();
  });
});

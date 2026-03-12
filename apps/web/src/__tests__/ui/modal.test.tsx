import { render, screen } from "@testing-library/react";
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
});

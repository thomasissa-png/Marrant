import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("accepts and displays typed text", async () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("applies type attribute", () => {
    render(<Input type="email" placeholder="email" />);
    expect(screen.getByPlaceholderText("email")).toHaveAttribute("type", "email");
  });

  it("renders as disabled", () => {
    render(<Input disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });

  it("merges custom className", () => {
    render(<Input className="my-input" placeholder="c" />);
    expect(screen.getByPlaceholderText("c")).toHaveClass("my-input");
  });

  it("forwards ref", () => {
    const ref = jest.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("supports required attribute", () => {
    render(<Input required placeholder="req" />);
    expect(screen.getByPlaceholderText("req")).toBeRequired();
  });

  it("has displayName set", () => {
    expect(Input.displayName).toBe("Input");
  });
});

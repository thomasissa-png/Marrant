import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RetractationForm } from "@/components/retractation/retractation-form";

describe("RetractationForm", () => {
  it("renders email field", () => {
    render(<RetractationForm />);
    expect(screen.getByLabelText(/Adresse email du compte/)).toBeInTheDocument();
  });

  it("renders date field", () => {
    render(<RetractationForm />);
    expect(screen.getByLabelText(/Date d'achat/)).toBeInTheDocument();
  });

  it("renders optional motif field", () => {
    render(<RetractationForm />);
    expect(screen.getByLabelText(/Motif/)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<RetractationForm />);
    expect(screen.getByRole("button", { name: "Envoyer ma demande" })).toBeInTheDocument();
  });

  it("shows confirmation message after submit", async () => {
    render(<RetractationForm />);

    await userEvent.type(screen.getByLabelText(/Adresse email du compte/), "test@example.com");
    await userEvent.type(screen.getByLabelText(/Date d'achat/), "2026-03-01");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer ma demande" }));

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/demande de rétractation a bien été enregistrée/)).toBeInTheDocument();
  });

  it("shows contact email in confirmation", async () => {
    render(<RetractationForm />);

    await userEvent.type(screen.getByLabelText(/Adresse email du compte/), "test@example.com");
    await userEvent.type(screen.getByLabelText(/Date d'achat/), "2026-03-01");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer ma demande" }));

    expect(screen.getByText("contact@deviens-marrant.fr")).toBeInTheDocument();
  });

  it("hides form after successful submit", async () => {
    render(<RetractationForm />);

    await userEvent.type(screen.getByLabelText(/Adresse email du compte/), "test@example.com");
    await userEvent.type(screen.getByLabelText(/Date d'achat/), "2026-03-01");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer ma demande" }));

    expect(screen.queryByRole("button", { name: "Envoyer ma demande" })).not.toBeInTheDocument();
  });

  it("email field is required", () => {
    render(<RetractationForm />);
    const emailInput = screen.getByLabelText(/Adresse email du compte/);
    expect(emailInput).toBeRequired();
  });

  it("date field is required", () => {
    render(<RetractationForm />);
    const dateInput = screen.getByLabelText(/Date d'achat/);
    expect(dateInput).toBeRequired();
  });

  it("motif field is not required", () => {
    render(<RetractationForm />);
    const motifInput = screen.getByLabelText(/Motif/);
    expect(motifInput).not.toBeRequired();
  });
});

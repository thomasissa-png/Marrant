import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RetractationForm } from "@/components/retractation/retractation-form";
import { TEXTES_RETRACTATION_FORM } from "@/config/textes/paiement";

// s16 : la demande part vraiment (POST /api/retractation) ; succès affiché
// seulement après la réponse du serveur.
const mockFetch = jest.fn();
global.fetch = mockFetch;
const ok = (body: Record<string, unknown> = { ok: true, reference: "R-1", ackSent: true }) =>
  mockFetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(body) });

async function remplirEtEnvoyer() {
  await userEvent.type(screen.getByLabelText(/Adresse email du compte/), "test@example.com");
  await userEvent.type(screen.getByLabelText(/Date d'achat/), "2026-03-01");
  await userEvent.click(screen.getByRole("button", { name: "Envoyer ma demande" }));
}

beforeEach(() => {
  mockFetch.mockReset();
  ok();
});

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

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByText(TEXTES_RETRACTATION_FORM.succesTitre)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith("/api/retractation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", dateAchat: "2026-03-01", motif: "" }),
    });
  });

  it("shows contact email in confirmation", async () => {
    render(<RetractationForm />);

    await userEvent.type(screen.getByLabelText(/Adresse email du compte/), "test@example.com");
    await userEvent.type(screen.getByLabelText(/Date d'achat/), "2026-03-01");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer ma demande" }));

    expect(await screen.findByText("contact@deviens-marrant.fr")).toBeInTheDocument();
  });

  it("hides form after successful submit", async () => {
    render(<RetractationForm />);

    await userEvent.type(screen.getByLabelText(/Adresse email du compte/), "test@example.com");
    await userEvent.type(screen.getByLabelText(/Date d'achat/), "2026-03-01");
    await userEvent.click(screen.getByRole("button", { name: "Envoyer ma demande" }));

    await screen.findByRole("status");
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

  it("e-mail de confirmation non parti : succès honnête qui invite à écrire au contact", async () => {
    ok({ ok: true, reference: "R-1", ackSent: false });
    render(<RetractationForm />);
    await remplirEtEnvoyer();
    expect(await screen.findByText(new RegExp(TEXTES_RETRACTATION_FORM.succesSansEmail.slice(0, 40)))).toBeInTheDocument();
  });

  it("erreur serveur : aucun message de succès, formulaire conservé, contact proposé", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({ error: "x" }) });
    render(<RetractationForm />);
    await remplirEtEnvoyer();
    expect(await screen.findByRole("alert")).toHaveTextContent(TEXTES_RETRACTATION_FORM.erreurServeur);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Envoyer ma demande" })).toBeInTheDocument();
  });

  it("trop de demandes (429) : message dédié", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 429, json: () => Promise.resolve({}) });
    render(<RetractationForm />);
    await remplirEtEnvoyer();
    expect(await screen.findByRole("alert")).toHaveTextContent(TEXTES_RETRACTATION_FORM.erreurTropDeDemandes);
  });

  it("réseau coupé : message d'erreur, pas de succès", async () => {
    mockFetch.mockRejectedValue(new Error("offline"));
    render(<RetractationForm />);
    await remplirEtEnvoyer();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

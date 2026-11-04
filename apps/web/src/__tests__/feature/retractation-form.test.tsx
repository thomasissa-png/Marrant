import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RetractationForm } from "@/components/retractation/retractation-form";
import { TEXTES_RETRACTATION_FORM } from "@/config/textes/paiement";

// s16 : la demande part vraiment (POST /api/retractation) ; succès affiché
// seulement après la réponse du serveur.
// s23 (audit rétractation, D.221-5) : deux étapes. « Renoncer au contrat ici »
// n'envoie rien (récapitulatif) ; seul « Confirmer la rétractation » appelle l'API.
const mockSession: { data: { user: { name?: string | null; email?: string | null } } | null } = { data: null };
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: mockSession.data, status: mockSession.data ? "authenticated" : "unauthenticated" }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;
const ok = (body: Record<string, unknown> = { ok: true, reference: "R-1", ackSent: true }) =>
  mockFetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(body) });

const ETAPE1 = "Renoncer au contrat ici";
const CONFIRMER = "Confirmer la rétractation";

async function remplir({ date = true }: { date?: boolean } = {}) {
  await userEvent.type(screen.getByLabelText(/Prénom et nom/), "Marie Dupont");
  await userEvent.type(screen.getByLabelText(/Adresse e-mail du compte/), "test@example.com");
  if (date) await userEvent.type(screen.getByLabelText(/Date d['’]achat/), "2026-03-01");
}

async function remplirEtConfirmer() {
  await remplir();
  await userEvent.click(screen.getByRole("button", { name: ETAPE1 }));
  await userEvent.click(screen.getByRole("button", { name: CONFIRMER }));
}

beforeEach(() => {
  mockFetch.mockReset();
  mockSession.data = null;
  ok();
});

describe("RetractationForm", () => {
  it("affiche les champs nom, e-mail, date d'achat et motif", () => {
    render(<RetractationForm />);
    expect(screen.getByLabelText(/Prénom et nom/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Adresse e-mail du compte/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date d['’]achat/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Motif/)).toBeInTheDocument();
  });

  it("bouton de l'étape 1 libellé selon la formule légale", () => {
    render(<RetractationForm />);
    expect(screen.getByRole("button", { name: ETAPE1 })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: CONFIRMER })).not.toBeInTheDocument();
  });

  it("champs obligatoires : nom et e-mail ; facultatifs : date d'achat et motif", () => {
    render(<RetractationForm />);
    expect(screen.getByLabelText(/Prénom et nom/)).toBeRequired();
    expect(screen.getByLabelText(/Adresse e-mail du compte/)).toBeRequired();
    expect(screen.getByLabelText(/Date d['’]achat/)).not.toBeRequired();
    expect(screen.getByLabelText(/Motif/)).not.toBeRequired();
  });

  it("étape 1 : n'envoie rien et montre le récapitulatif de la déclaration", async () => {
    render(<RetractationForm />);
    await remplir();
    await userEvent.type(screen.getByLabelText(/Motif/), "Pas pour moi");
    await userEvent.click(screen.getByRole("button", { name: ETAPE1 }));

    expect(mockFetch).not.toHaveBeenCalled();
    const recap = screen.getByTestId("retractation-recap");
    expect(recap).toHaveTextContent("Marie Dupont");
    expect(recap).toHaveTextContent("test@example.com");
    expect(recap).toHaveTextContent("1er mars 2026");
    expect(recap).toHaveTextContent("Pas pour moi");
    expect(screen.getByRole("button", { name: CONFIRMER })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: TEXTES_RETRACTATION_FORM.recapTitre })).toHaveFocus();
  });

  it("récapitulatif sans date ni motif : « non indiqué »", async () => {
    render(<RetractationForm />);
    await remplir({ date: false });
    await userEvent.click(screen.getByRole("button", { name: ETAPE1 }));
    expect(screen.getAllByText(TEXTES_RETRACTATION_FORM.recapNonIndique)).toHaveLength(2);
  });

  it("« Modifier » revient à la saisie sans rien perdre ni envoyer", async () => {
    render(<RetractationForm />);
    await remplir();
    await userEvent.click(screen.getByRole("button", { name: ETAPE1 }));
    await userEvent.click(screen.getByRole("button", { name: TEXTES_RETRACTATION_FORM.modifier }));
    expect(screen.getByLabelText(/Prénom et nom/)).toHaveValue("Marie Dupont");
    expect(screen.getByLabelText(/Adresse e-mail du compte/)).toHaveValue("test@example.com");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("étape 2 : « Confirmer la rétractation » envoie la déclaration confirmée, puis le succès", async () => {
    render(<RetractationForm />);
    await remplirEtConfirmer();

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByText(TEXTES_RETRACTATION_FORM.succesTitre)).toBeInTheDocument();
    expect(screen.getByText("contact@deviens-marrant.fr")).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("/api/retractation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirme: true, nom: "Marie Dupont", email: "test@example.com", dateAchat: "2026-03-01", motif: "" }),
    });
    expect(screen.queryByRole("button", { name: CONFIRMER })).not.toBeInTheDocument();
  });

  it("compte connecté : nom et e-mail pré-remplis", () => {
    mockSession.data = { user: { name: "Camille Martin", email: "camille@exemple.fr" } };
    render(<RetractationForm />);
    expect(screen.getByLabelText(/Prénom et nom/)).toHaveValue("Camille Martin");
    expect(screen.getByLabelText(/Adresse e-mail du compte/)).toHaveValue("camille@exemple.fr");
  });

  it("e-mail de confirmation non parti : succès honnête qui invite à écrire au contact", async () => {
    ok({ ok: true, reference: "R-1", ackSent: false });
    render(<RetractationForm />);
    await remplirEtConfirmer();
    expect(await screen.findByText(new RegExp(TEXTES_RETRACTATION_FORM.succesSansEmail.slice(0, 40)))).toBeInTheDocument();
  });

  it("erreur serveur : aucun succès, récapitulatif conservé, contact proposé", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({ error: "x" }) });
    render(<RetractationForm />);
    await remplirEtConfirmer();
    expect(await screen.findByRole("alert")).toHaveTextContent(TEXTES_RETRACTATION_FORM.erreurServeur);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: CONFIRMER })).toBeInTheDocument();
  });

  it("trop de demandes (429) : message dédié", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 429, json: () => Promise.resolve({}) });
    render(<RetractationForm />);
    await remplirEtConfirmer();
    expect(await screen.findByRole("alert")).toHaveTextContent(TEXTES_RETRACTATION_FORM.erreurTropDeDemandes);
  });

  it("réseau coupé : message d'erreur, pas de succès", async () => {
    mockFetch.mockRejectedValue(new Error("offline"));
    render(<RetractationForm />);
    await remplirEtConfirmer();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

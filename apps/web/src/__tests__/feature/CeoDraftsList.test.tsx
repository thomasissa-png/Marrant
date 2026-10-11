import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CeoDraftsList } from "@/components/admin/ceo/CeoDraftsList";
import type { CeoDraftDto } from "@/components/admin/ceo/types";

const draftBase: CeoDraftDto = {
  id: "msg-1",
  channel: "EMAIL",
  recipient: "ya***@gmail.com",
  subject: "Bienvenue chez Marrant",
  content: "Salut Yanis, on a remarqué que tu progressais vite — voici une ressource pour aller plus loin.",
  status: "PENDING",
  directorScore: 8,
  directorValidated: true,
  directorNote: null,
  requiresHumanReview: true,
  playbook: "P1",
  createdAt: new Date().toISOString(),
};

describe("CeoDraftsList", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({ ok: true }) })
    ) as unknown as typeof fetch;
    window.confirm = jest.fn(() => true);
    window.prompt = jest.fn(() => "Tonalité trop forcée");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("affiche le message vide si pas de drafts", () => {
    render(
      <CeoDraftsList drafts={[]} onChange={() => {}} getAuthHeader={() => ({})} />
    );
    expect(screen.getByText(/Rien à valider/i)).toBeInTheDocument();
  });

  it("affiche un draft avec subject, score et badge review humaine", () => {
    render(
      <CeoDraftsList
        drafts={[draftBase]}
        onChange={() => {}}
        getAuthHeader={() => ({})}
      />
    );
    expect(screen.getByText(/Bienvenue chez Marrant/)).toBeInTheDocument();
    expect(screen.getByText(/Director: 8\/10/)).toBeInTheDocument();
    expect(screen.getByText(/Review humaine requise/i)).toBeInTheDocument();
    expect(screen.getByText(/P1/)).toBeInTheDocument();
  });

  it("appelle l'API approve au click sur Approuver", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <CeoDraftsList
        drafts={[draftBase]}
        onChange={onChange}
        getAuthHeader={() => ({ Authorization: "Bearer x" })}
      />
    );

    await user.click(screen.getByRole("button", { name: /Approuver/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admin/ceo/approve",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("msg-1"),
        })
      );
    });
    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it("appelle l'API reject avec la raison saisie", async () => {
    const user = userEvent.setup();
    render(
      <CeoDraftsList
        drafts={[draftBase]}
        onChange={() => {}}
        getAuthHeader={() => ({})}
      />
    );

    await user.click(screen.getByRole("button", { name: /Rejeter/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admin/ceo/reject",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("Tonalité trop forcée"),
        })
      );
    });
  });
});

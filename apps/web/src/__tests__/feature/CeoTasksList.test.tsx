/**
 * Phase 5.D — Groupe 6 : CeoTasksList composant
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CeoTasksList } from "@/components/admin/ceo/CeoTasksList";
import type { CeoTaskDto } from "@/components/admin/ceo/types";

const baseTask: CeoTaskDto = {
  id: "t-1",
  type: "send_email",
  status: "PENDING",
  scheduledFor: new Date("2026-05-07T10:00:00.000Z").toISOString(),
  attempts: 0,
  errorMessage: null,
  createdAt: new Date().toISOString(),
  startedAt: null,
  completedAt: null,
  payloadSummary: "leadId: lead-abc",
};

describe("CeoTasksList", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({ ok: true }) }),
    ) as unknown as typeof fetch;
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("affiche le message vide si pas de tâches", () => {
    render(
      <CeoTasksList tasks={[]} onChange={() => {}} getAuthHeader={() => ({})} />,
    );
    expect(screen.getByText(/Aucune tâche ne correspond/i)).toBeInTheDocument();
  });

  it("affiche une tâche avec son type, statut, payload", () => {
    render(
      <CeoTasksList tasks={[baseTask]} onChange={() => {}} getAuthHeader={() => ({})} />,
    );
    // "send_email" peut apparaître en option du dropdown ET en cellule du tableau
    expect(screen.getAllByText("send_email").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("PENDING").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("leadId: lead-abc")).toBeInTheDocument();
    expect(screen.getByText("0/3")).toBeInTheDocument();
  });

  it("filtre par status (PENDING affiche 1, DONE affiche 0)", async () => {
    const user = userEvent.setup();
    render(
      <CeoTasksList tasks={[baseTask]} onChange={() => {}} getAuthHeader={() => ({})} />,
    );

    const statusSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(statusSelect, "DONE");

    expect(screen.getByText(/Aucune tâche ne correspond/i)).toBeInTheDocument();
  });

  it("affiche bouton Forcer pour PENDING/FAILED, masqué sinon", () => {
    const tasksMixed: CeoTaskDto[] = [
      { ...baseTask, id: "t-1", status: "PENDING" },
      { ...baseTask, id: "t-2", status: "DONE" },
      { ...baseTask, id: "t-3", status: "FAILED" },
    ];
    render(
      <CeoTasksList tasks={tasksMixed} onChange={() => {}} getAuthHeader={() => ({})} />,
    );
    const forceBtns = screen.getAllByRole("button", { name: /Forcer/i });
    expect(forceBtns).toHaveLength(2); // PENDING + FAILED
  });

  it("appelle l'API run-task au click sur Forcer + onChange", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <CeoTasksList
        tasks={[baseTask]}
        onChange={onChange}
        getAuthHeader={() => ({ Authorization: "Bearer x" })}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Forcer/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admin/ceo/run-task",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("t-1"),
        }),
      );
    });
    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it("ne déclenche pas l'API si l'utilisateur annule la confirm", async () => {
    window.confirm = jest.fn(() => false);
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <CeoTasksList tasks={[baseTask]} onChange={onChange} getAuthHeader={() => ({})} />,
    );
    await user.click(screen.getByRole("button", { name: /Forcer/i }));
    expect(global.fetch).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("affiche errorMessage tronqué si présent", () => {
    const failed: CeoTaskDto = {
      ...baseTask,
      status: "FAILED",
      attempts: 3,
      errorMessage: "Anthropic timeout: connection reset after 30s on first attempt",
    };
    render(
      <CeoTasksList tasks={[failed]} onChange={() => {}} getAuthHeader={() => ({})} />,
    );
    expect(screen.getByText(/Anthropic timeout/i)).toBeInTheDocument();
    expect(screen.getByText("3/3")).toBeInTheDocument();
  });

  it("compteur 'X/Y tâches' affiché", () => {
    const tasks: CeoTaskDto[] = [
      { ...baseTask, id: "t-1" },
      { ...baseTask, id: "t-2" },
      { ...baseTask, id: "t-3" },
    ];
    render(
      <CeoTasksList tasks={tasks} onChange={() => {}} getAuthHeader={() => ({})} />,
    );
    expect(screen.getByText("3 / 3 tâches")).toBeInTheDocument();
  });

  it("alert si l'API renvoie ok=false", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: async () => ({ error: "boom" }) }),
    ) as unknown as typeof fetch;
    const user = userEvent.setup();
    render(
      <CeoTasksList tasks={[baseTask]} onChange={() => {}} getAuthHeader={() => ({})} />,
    );
    await user.click(screen.getByRole("button", { name: /Forcer/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });
});

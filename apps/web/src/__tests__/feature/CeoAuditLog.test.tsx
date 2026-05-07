/**
 * Phase 5.D — Groupe 6 : CeoAuditLog composant
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CeoAuditLog } from "@/components/admin/ceo/CeoAuditLog";
import type { CeoAuditLogDto } from "@/components/admin/ceo/types";

const baseLog: CeoAuditLogDto = {
  id: "log-1",
  timestamp: new Date("2026-05-07T10:00:00.000Z").toISOString(),
  action: "message_approved",
  targetType: "outbound_message",
  channel: "EMAIL",
  outcome: "sent",
  reasoning: "Approbation admin — playbook P1",
  aiDecisionScore: 8,
  aiModel: "claude-sonnet-4-5",
};

describe("CeoAuditLog", () => {
  it("affiche message vide si pas de logs", () => {
    render(<CeoAuditLog logs={[]} />);
    expect(screen.getByText(/Pas d'entrées d'audit/i)).toBeInTheDocument();
  });

  it("affiche un log avec action, targetType, channel, outcome", () => {
    render(<CeoAuditLog logs={[baseLog]} />);
    // action et outcome apparaissent à la fois dans la liste ET dans les <option>
    expect(screen.getAllByText("message_approved").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("outbound_message")).toBeInTheDocument();
    expect(screen.getByText("EMAIL")).toBeInTheDocument();
    expect(screen.getAllByText("sent").length).toBeGreaterThanOrEqual(1);
  });

  it("affiche aiModel si présent", () => {
    render(<CeoAuditLog logs={[baseLog]} />);
    expect(screen.getByText("claude-sonnet-4-5")).toBeInTheDocument();
  });

  it("expand un log au click puis collapse", async () => {
    const user = userEvent.setup();
    render(<CeoAuditLog logs={[baseLog]} />);

    // Avant click : reasoning pas visible
    expect(screen.queryByText(/Approbation admin/i)).not.toBeInTheDocument();

    // Clique sur le bouton expand de la <li> (button-role) plutôt que sur le texte
    // potentiellement ambigu (option dropdown).
    const expandBtn = screen.getAllByRole("button").find((btn) =>
      btn.textContent?.includes("message_approved"),
    );
    if (!expandBtn) throw new Error("expand button not found");

    await user.click(expandBtn);
    expect(screen.getByText(/Approbation admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Score IA : 8\/10/i)).toBeInTheDocument();

    // Re-click → collapse
    await user.click(expandBtn);
    expect(screen.queryByText(/Approbation admin/i)).not.toBeInTheDocument();
  });

  it("affiche 'Pas de raisonnement' si reasoning=null après expand", async () => {
    const user = userEvent.setup();
    render(<CeoAuditLog logs={[{ ...baseLog, reasoning: null }]} />);

    const expandBtn = screen.getAllByRole("button").find((btn) =>
      btn.textContent?.includes("message_approved"),
    );
    if (!expandBtn) throw new Error("expand button not found");

    await user.click(expandBtn);
    expect(screen.getByText(/Pas de raisonnement/i)).toBeInTheDocument();
  });

  it("filtre par action (selectOptions)", async () => {
    const user = userEvent.setup();
    const logs: CeoAuditLogDto[] = [
      { ...baseLog, id: "1", action: "message_approved" },
      { ...baseLog, id: "2", action: "kill_switch_triggered" },
    ];
    render(<CeoAuditLog logs={logs} />);

    const actionSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(actionSelect, "kill_switch_triggered");

    // Filtre actif : seul kill_switch_triggered doit apparaître DANS la liste
    // (mais il reste 1 occurrence dans <option>). On compare donc les counts.
    const approvedNodes = screen.getAllByText("message_approved");
    // Reste seulement l'<option>
    expect(approvedNodes).toHaveLength(1);
    expect(approvedNodes[0].tagName.toLowerCase()).toBe("option");
    expect(screen.getAllByText("kill_switch_triggered").length).toBeGreaterThanOrEqual(2);
  });

  it("filtre par outcome", async () => {
    const user = userEvent.setup();
    const logs: CeoAuditLogDto[] = [
      { ...baseLog, id: "1", outcome: "sent", action: "message_approved" },
      { ...baseLog, id: "2", outcome: "rejected", action: "message_rejected" },
    ];
    render(<CeoAuditLog logs={logs} />);

    const outcomeSelect = screen.getAllByRole("combobox")[1];
    await user.selectOptions(outcomeSelect, "rejected");

    // message_approved n'apparaît plus que dans l'<option> du dropdown action
    const approvedNodes = screen.queryAllByText("message_approved");
    expect(approvedNodes).toHaveLength(1);
    expect(approvedNodes[0].tagName.toLowerCase()).toBe("option");
    expect(screen.getAllByText("message_rejected").length).toBeGreaterThanOrEqual(2);
  });

  it("affiche compteur + mention rétention 3 ans (RGPD)", () => {
    render(<CeoAuditLog logs={[baseLog, { ...baseLog, id: "2" }]} />);
    expect(screen.getByText(/2 entrées/i)).toBeInTheDocument();
    expect(screen.getByText(/rétention 3 ans \(art\. 30 RGPD\)/i)).toBeInTheDocument();
  });

  it("dropdowns 'ALL' par défaut, options dérivées des logs", () => {
    const logs: CeoAuditLogDto[] = [
      { ...baseLog, id: "1", action: "a1", outcome: "sent" },
      { ...baseLog, id: "2", action: "a2", outcome: "rejected" },
    ];
    render(<CeoAuditLog logs={logs} />);

    const actionSelect = screen.getAllByRole("combobox")[0] as HTMLSelectElement;
    expect(actionSelect.value).toBe("ALL");
    // Options : ALL + a1 + a2
    expect(actionSelect.options).toHaveLength(3);
  });
});

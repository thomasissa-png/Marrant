import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CeoHeader } from "@/components/admin/ceo/CeoHeader";
import type { CeoConfigDto } from "@/components/admin/ceo/types";

const baseConfig: CeoConfigDto = {
  id: "cfg-1",
  enabled: true,
  dailyBudgetEur: 4,
  maxActionsPerTick: 3,
  autoSendEmail: false,
  autoSendDm: false,
  killSwitchReason: null,
  socialOutboundEnabled: false,
  dryRun: false,
  updatedAt: new Date().toISOString(),
};

describe("CeoHeader", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({ ok: true }) })
    ) as unknown as typeof fetch;
    // mock confirm/prompt for kill-switch flow
    window.confirm = jest.fn(() => true);
    window.prompt = jest.fn(() => "Test reason");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("affiche statut ACTIF quand enabled=true", () => {
    render(
      <CeoHeader
        config={baseConfig}
        lastSnapshot={null}
        onChange={() => {}}
        getAuthHeader={() => ({})}
      />
    );
    expect(screen.getByText("ACTIF")).toBeInTheDocument();
    expect(screen.getByText(/Couper l'agent/i)).toBeInTheDocument();
  });

  it("affiche COUPÉ + raison quand enabled=false", () => {
    render(
      <CeoHeader
        config={{ ...baseConfig, enabled: false, killSwitchReason: "Budget dépassé" }}
        lastSnapshot={null}
        onChange={() => {}}
        getAuthHeader={() => ({})}
      />
    );
    expect(screen.getByText("COUPÉ")).toBeInTheDocument();
    expect(screen.getByText(/Budget dépassé/i)).toBeInTheDocument();
    expect(screen.getByText(/Réactiver/i)).toBeInTheDocument();
  });

  it("appelle l'API kill-switch puis onChange au click", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(
      <CeoHeader
        config={baseConfig}
        lastSnapshot={null}
        onChange={onChange}
        getAuthHeader={() => ({ Authorization: "Bearer test" })}
      />
    );

    await user.click(screen.getByText(/Couper l'agent/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admin/ceo/kill-switch",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({ Authorization: "Bearer test" }),
        })
      );
    });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it("affiche le badge DRY-RUN si dryRun=true", () => {
    render(
      <CeoHeader
        config={{ ...baseConfig, dryRun: true }}
        lastSnapshot={null}
        onChange={() => {}}
        getAuthHeader={() => ({})}
      />
    );
    expect(screen.getByText("DRY-RUN")).toBeInTheDocument();
  });
});

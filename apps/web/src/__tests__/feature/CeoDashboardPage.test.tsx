/**
 * Phase 5.D — Groupe 6 : page /admin/ceo (auth gate sessionStorage + tabs)
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CeoDashboardPage from "@/app/admin/ceo/page";

const fetchMock = jest.fn();
const buildDashboardData = () => ({
  config: {
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
  },
  lastSnapshot: null,
  kpiHistory: [],
  tasks: [],
  drafts: [],
  funnel: {
    sent: 0,
    opens: 0,
    replies: 0,
    clicks: 0,
    siteVisits: 0,
    conversions: 0,
    openRate: 0,
    replyRate: 0,
    clickRate: 0,
    visitRate: 0,
    conversionRate: 0,
  },
  backlinks: [],
  auditLog: [],
  budgetSpentToday: 0,
  lastTickAt: null,
  nextTickAt: null,
});

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  // Reset sessionStorage entre tests
  sessionStorage.clear();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("page /admin/ceo — auth gate", () => {
  it("affiche le formulaire de login si pas auth dans sessionStorage", () => {
    render(<CeoDashboardPage />);
    expect(screen.getByText("CEO — pilotage")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe admin/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrer/i })).toBeInTheDocument();
  });

  it("ne fetch PAS /api/admin/ceo/data tant que non authentifié", () => {
    render(<CeoDashboardPage />);
    expect(fetchMock).not.toHaveBeenCalledWith(
      "/api/admin/ceo/data",
      expect.anything(),
    );
  });

  it("auto-auth si sessionStorage.admin_auth='true'", async () => {
    sessionStorage.setItem("admin_auth", "true");
    sessionStorage.setItem("admin_pass", "test-pass");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => buildDashboardData(),
    } as Response);

    render(<CeoDashboardPage />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/admin/ceo/data",
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer test-pass" }),
        }),
      );
    });
  });

  it("login OK → set sessionStorage + fetch data", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/admin/auth") {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true }) } as Response);
      }
      if (url === "/api/admin/ceo/data") {
        return Promise.resolve({
          ok: true,
          json: async () => buildDashboardData(),
        } as Response);
      }
      return Promise.reject(new Error(`Unmocked URL: ${url}`));
    });

    const user = userEvent.setup();
    render(<CeoDashboardPage />);

    const input = screen.getByPlaceholderText(/Mot de passe admin/i);
    await user.type(input, "monpass");
    await user.click(screen.getByRole("button", { name: /Entrer/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("admin_auth")).toBe("true");
      expect(sessionStorage.getItem("admin_pass")).toBe("monpass");
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/auth", expect.objectContaining({ method: "POST" }));
    });
  });

  it("login KO → affiche message d'erreur, pas de set sessionStorage", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Mot de passe incorrect" }),
    } as Response);

    const user = userEvent.setup();
    render(<CeoDashboardPage />);

    await user.type(screen.getByPlaceholderText(/Mot de passe admin/i), "wrong");
    await user.click(screen.getByRole("button", { name: /Entrer/i }));

    await waitFor(() => {
      expect(screen.getByText(/Mot de passe incorrect/i)).toBeInTheDocument();
    });
    expect(sessionStorage.getItem("admin_auth")).toBeNull();
  });

  it("erreur réseau au login → message 'Erreur réseau'", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    const user = userEvent.setup();
    render(<CeoDashboardPage />);
    await user.type(screen.getByPlaceholderText(/Mot de passe admin/i), "x");
    await user.click(screen.getByRole("button", { name: /Entrer/i }));

    await waitFor(() => {
      expect(screen.getByText(/Erreur réseau/i)).toBeInTheDocument();
    });
  });
});

describe("page /admin/ceo — tabs (post-auth)", () => {
  beforeEach(() => {
    sessionStorage.setItem("admin_auth", "true");
    sessionStorage.setItem("admin_pass", "p");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => buildDashboardData(),
    } as Response);
  });

  it("affiche les 6 onglets après auth", async () => {
    render(<CeoDashboardPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tâches" })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Brouillons" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Funnel 30j" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "KPIs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Backlinks" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Audit" })).toBeInTheDocument();
  });

  it("change de tab au click (Tâches)", async () => {
    const user = userEvent.setup();
    render(<CeoDashboardPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Tâches" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Tâches" }));

    // Vérifie que le contenu CeoTasksList s'affiche (msg vide car tasks=[])
    await waitFor(() => {
      expect(screen.getByText(/Aucune tâche ne correspond/i)).toBeInTheDocument();
    });
  });
});

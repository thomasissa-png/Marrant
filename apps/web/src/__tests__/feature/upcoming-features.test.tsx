import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpcomingFeatures } from "@/components/home/upcoming-features";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/components/ui/toast", () => ({
  toast: jest.fn(),
}));

const { useSession } = require("next-auth/react");
const { toast } = require("@/components/ui/toast");

function mockFetch(
  getResponse: { counts: Record<string, number>; userVotes: string[] },
  postResponse?: { ok: boolean; data?: Record<string, unknown> }
) {
  (global.fetch as jest.Mock).mockImplementation(
    (_url: string, options?: RequestInit) => {
      if (!options || options.method !== "POST") {
        return Promise.resolve({
          ok: true,
          json: async () => getResponse,
        });
      }
      if (postResponse) {
        return Promise.resolve({
          ok: postResponse.ok,
          json: async () => postResponse.data ?? {},
        });
      }
      return Promise.resolve({ ok: false });
    }
  );
}

describe("UpcomingFeatures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ status: "authenticated" });
    global.fetch = jest.fn();
  });

  it("renders all four feature cards", async () => {
    mockFetch({
      counts: { whatsapp: 47, "nouveaux-parcours": 34, communaute: 62, surprises: 21 },
      userVotes: [],
    });

    render(<UpcomingFeatures />);

    await waitFor(() => {
      expect(screen.getByText("Vannes, vidéos et conseils du jour par WhatsApp")).toBeInTheDocument();
      expect(screen.getByText("De nouveaux parcours")).toBeInTheDocument();
      expect(screen.getByText("Une communauté")).toBeInTheDocument();
      expect(screen.getByText("Et bien plus encore...")).toBeInTheDocument();
    });
  });

  it("displays vote counts from API", async () => {
    mockFetch({
      counts: { whatsapp: 47, "nouveaux-parcours": 34, communaute: 62, surprises: 21 },
      userVotes: [],
    });

    render(<UpcomingFeatures />);

    await waitFor(() => {
      expect(screen.getByLabelText("47 votes pour Vannes, vidéos et conseils du jour par WhatsApp")).toBeInTheDocument();
      expect(screen.getByLabelText("62 votes pour Une communauté")).toBeInTheDocument();
    });
  });

  it("shows 'Voté !' for features the user already voted on", async () => {
    mockFetch({
      counts: { whatsapp: 47, "nouveaux-parcours": 34, communaute: 62, surprises: 21 },
      userVotes: ["communaute"],
    });

    render(<UpcomingFeatures />);

    await waitFor(() => {
      const communityBtn = screen.getByLabelText("62 votes pour Une communauté");
      expect(communityBtn).toHaveTextContent("Voté !");
    });
  });

  it("toggles vote on click (optimistic update)", async () => {
    mockFetch(
      { counts: { whatsapp: 47, "nouveaux-parcours": 34, communaute: 62, surprises: 21 }, userVotes: [] },
      { ok: true, data: { action: "created" } }
    );

    render(<UpcomingFeatures />);

    await waitFor(() => {
      expect(screen.getByLabelText("62 votes pour Une communauté")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("62 votes pour Une communauté"));

    await waitFor(() => {
      expect(screen.getByLabelText("63 votes pour Une communauté")).toHaveTextContent("Voté !");
    });
  });

  it("removes vote on second click", async () => {
    mockFetch(
      { counts: { whatsapp: 47, "nouveaux-parcours": 34, communaute: 62, surprises: 21 }, userVotes: ["communaute"] },
      { ok: true, data: { action: "removed" } }
    );

    render(<UpcomingFeatures />);

    await waitFor(() => {
      expect(screen.getByLabelText("62 votes pour Une communauté")).toHaveTextContent("Voté !");
    });

    await userEvent.click(screen.getByLabelText("62 votes pour Une communauté"));

    await waitFor(() => {
      expect(screen.getByLabelText("61 votes pour Une communauté")).toHaveTextContent("Je veux ça !");
    });
  });

  it("shows toast when unauthenticated user tries to vote", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    mockFetch({
      counts: { whatsapp: 47, "nouveaux-parcours": 34, communaute: 62, surprises: 21 },
      userVotes: [],
    });

    render(<UpcomingFeatures />);

    await waitFor(() => {
      expect(screen.getByLabelText("62 votes pour Une communauté")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("62 votes pour Une communauté"));

    expect(toast).toHaveBeenCalledWith("Connecte-toi pour voter", "error");
  });

  it("rolls back on API error", async () => {
    mockFetch(
      { counts: { whatsapp: 47, "nouveaux-parcours": 34, communaute: 62, surprises: 21 }, userVotes: [] },
      { ok: false }
    );

    render(<UpcomingFeatures />);

    await waitFor(() => {
      expect(screen.getByLabelText("62 votes pour Une communauté")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("62 votes pour Une communauté"));

    // Should rollback to 62 after error
    await waitFor(() => {
      expect(screen.getByLabelText("62 votes pour Une communauté")).toHaveTextContent("Je veux ça !");
      expect(toast).toHaveBeenCalledWith("Erreur lors du vote, réessaie", "error");
    });
  });

  it("calls correct API endpoint with feature slug", async () => {
    mockFetch(
      { counts: { whatsapp: 47, "nouveaux-parcours": 34, communaute: 62, surprises: 21 }, userVotes: [] },
      { ok: true, data: { action: "created" } }
    );

    render(<UpcomingFeatures />);

    await waitFor(() => {
      expect(screen.getByLabelText("47 votes pour Vannes, vidéos et conseils du jour par WhatsApp")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("47 votes pour Vannes, vidéos et conseils du jour par WhatsApp"));

    expect(global.fetch).toHaveBeenCalledWith("/api/features/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featureSlug: "whatsapp" }),
    });
  });

  it("renders section heading and subtitle", async () => {
    mockFetch({
      counts: { whatsapp: 0, "nouveaux-parcours": 0, communaute: 0, surprises: 0 },
      userVotes: [],
    });

    render(<UpcomingFeatures />);

    expect(screen.getByText("Prochainement")).toBeInTheDocument();
    expect(screen.getByText("Vote pour la fonctionnalité que tu veux voir arriver en premier !")).toBeInTheDocument();
  });
});

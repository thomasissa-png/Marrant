import { render, screen, waitFor } from "@testing-library/react";
import { ParcoursList } from "@/components/parcours/parcours-list";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({ status: "unauthenticated" }),
}));

const mockPaths = [
  {
    id: "p1",
    title: "Maîtrise l'absurde",
    description: "Apprends l'humour absurde",
    slug: "maitrise-absurde",
    duration: "2 semaines",
    difficulty: "DEBUTANT",
    icon: "🤪",
    steps: [
      { id: "s1", order: 1, tip: { id: "t1", title: "Step 1" } },
      { id: "s2", order: 2, tip: { id: "t2", title: "Step 2" } },
      { id: "s3", order: 3, tip: { id: "t3", title: "Step 3" } },
    ],
  },
  {
    id: "p2",
    title: "Répartie de pro",
    description: "Deviens imbattable",
    slug: "repartie-pro",
    duration: "3 semaines",
    difficulty: "EXPERT",
    icon: "⚡",
    steps: [{ id: "s4", order: 1, tip: { id: "t4", title: "Step A" } }],
  },
];

describe("ParcoursList", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ paths: mockPaths }),
    });
  });

  it("fetches and displays parcours", async () => {
    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("Maîtrise l'absurde")).toBeInTheDocument();
      expect(screen.getByText("Répartie de pro")).toBeInTheDocument();
    });
  });

  it("shows difficulty badges", async () => {
    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("Débutant")).toBeInTheDocument();
      expect(screen.getByText("Expert")).toBeInTheDocument();
    });
  });

  it("shows duration", async () => {
    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("2 semaines")).toBeInTheDocument();
    });
  });

  it("shows step count with progress", async () => {
    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("0/3 étapes")).toBeInTheDocument();
      expect(screen.getByText("0/1 étapes")).toBeInTheDocument();
    });
  });

  it("calculates XP correctly (steps * 20 + 100)", async () => {
    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("+160 XP")).toBeInTheDocument(); // 3*20+100
      expect(screen.getByText("+120 XP")).toBeInTheDocument(); // 1*20+100
    });
  });

  it("shows icons", async () => {
    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("🤪")).toBeInTheDocument();
      expect(screen.getByText("⚡")).toBeInTheDocument();
    });
  });

  it("has links to parcours detail pages", async () => {
    render(<ParcoursList />);
    await waitFor(() => {
      const links = screen.getAllByText("Commencer le parcours");
      expect(links[0].closest("a")).toHaveAttribute("href", "/parcours/maitrise-absurde");
      expect(links[1].closest("a")).toHaveAttribute("href", "/parcours/repartie-pro");
    });
  });

  it("shows empty message when no paths", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ paths: [] }),
    });
    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("Les parcours arrivent bientôt !")).toBeInTheDocument();
    });
  });

  it("shows loading skeleton initially", () => {
    render(<ParcoursList />);
    const cards = document.querySelectorAll(".animate-pulse");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("shows description", async () => {
    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("Apprends l'humour absurde")).toBeInTheDocument();
    });
  });

  it("shows 'Continuer le parcours' when progress exists", async () => {
    const { useSession } = require("next-auth/react");
    useSession.mockReturnValue({ status: "authenticated" });

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/api/user/progress")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ progress: { p1: 2 } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ paths: mockPaths }),
      });
    });

    render(<ParcoursList />);
    await waitFor(() => {
      expect(screen.getByText("Continuer le parcours")).toBeInTheDocument();
      expect(screen.getByText("2/3 étapes")).toBeInTheDocument();
    });
  });
});

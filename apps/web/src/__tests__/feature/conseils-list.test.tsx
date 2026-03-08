import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConseilsList } from "@/components/conseils/conseils-list";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ status: "unauthenticated" }),
}));

jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: () => ({
    isFavorite: () => false,
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getFavoriteId: () => null,
  }),
}));

jest.mock("@/stores/user-store", () => ({
  useUserStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ addXp: jest.fn() }),
}));

const mockTips = [
  {
    id: "t1",
    title: "Conseil timing",
    content: "Maîtrise le timing",
    category: "TIMING",
    difficulty: "DEBUTANT",
    example: "Exemple timing",
    exercise: "Exercice timing",
  },
  {
    id: "t2",
    title: "Conseil observation",
    content: "Observe tout",
    category: "OBSERVATION",
    difficulty: "EXPERT",
    example: "Ex observation",
    exercise: "Exo observation",
  },
];

describe("ConseilsList", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        tips: mockTips,
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
      }),
    });
  });

  it("renders difficulty filter tabs", async () => {
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getByRole("tablist", { name: "Niveaux de difficulté" })).toBeInTheDocument();
    });
    expect(screen.getByRole("tab", { name: "Tous" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Débutant" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Expert" })).toBeInTheDocument();
  });

  it("renders category filter tabs", async () => {
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getByRole("tablist", { name: "Catégories de conseils" })).toBeInTheDocument();
    });
    expect(screen.getByRole("tab", { name: "Toutes" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Timing" })).toBeInTheDocument();
  });

  it("fetches and displays tips", async () => {
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getByText("Conseil timing")).toBeInTheDocument();
      expect(screen.getByText("Conseil observation")).toBeInTheDocument();
    });
  });

  it("shows difficulty badges", async () => {
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getByText("Débutant")).toBeInTheDocument();
      expect(screen.getByText("Expert")).toBeInTheDocument();
    });
  });

  it("expands tip to show example and exercise on click", async () => {
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getByText("Conseil timing")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Conseil timing"));
    expect(screen.getByText("Exemple")).toBeInTheDocument();
    expect(screen.getByText("Exemple timing")).toBeInTheDocument();
    expect(screen.getByText("Exercice")).toBeInTheDocument();
    expect(screen.getByText("Exercice timing")).toBeInTheDocument();
  });

  it("shows hint before expanding", async () => {
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getAllByText("Clique pour voir l'exemple et l'exercice")).toHaveLength(2);
    });
  });

  it("shows error state on failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getByText("Impossible de charger les conseils.")).toBeInTheDocument();
    });
  });

  it("shows empty state when no tips", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ tips: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }),
    });
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getByText("Aucun conseil avec ces filtres")).toBeInTheDocument();
    });
  });

  it("filters by difficulty", async () => {
    render(<ConseilsList />);
    await waitFor(() => {
      expect(screen.getByText("Conseil timing")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("tab", { name: "Expert" }));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("difficulty=EXPERT"));
  });
});

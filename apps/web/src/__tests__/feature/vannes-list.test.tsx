import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VannesList } from "@/components/vannes/vannes-list";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: mockPush }),
}));

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

const mockJokes = [
  { id: "1", content: "Setup vanne 1", punchline: "Chute 1", category: "ABSURDE", type: "ONESHOT", maturityLevel: 1 },
  { id: "2", content: "Setup vanne 2", punchline: "Chute 2", category: "SITUATION", type: "DIALOGUE", maturityLevel: 2 },
];

describe("VannesList", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        jokes: mockJokes,
        pagination: { page: 1, limit: 12, total: 2, totalPages: 1 },
      }),
    });
  });

  it("renders category filter tabs", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByRole("tablist", { name: "Catégories de vannes" })).toBeInTheDocument();
    });
    expect(screen.getByRole("tab", { name: "Toutes" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Absurde" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Situation" })).toBeInTheDocument();
  });

  it("shows aria-selected on active category", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Toutes" })).toHaveAttribute("aria-selected", "true");
    });
    expect(screen.getByRole("tab", { name: "Absurde" })).toHaveAttribute("aria-selected", "false");
  });

  it("fetches and displays jokes", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
      expect(screen.getByText("Setup vanne 2")).toBeInTheDocument();
    });
  });

  it("shows punchline hint", async () => {
    render(<VannesList />);
    await waitFor(() => {
      // Les teasers varient par index — vérifier qu'il y a 2 hints (1 par vanne non révélée)
      expect(screen.getByText("Clique pour la chute")).toBeInTheDocument();
      expect(screen.getByText("La chute va te surprendre")).toBeInTheDocument();
    });
  });

  it("reveals punchline on card click", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Setup vanne 1"));
    expect(screen.getByText("Chute 1")).toBeInTheDocument();
  });

  it("shows category badge labels", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Absurde")).toBeInTheDocument();
      expect(screen.getByText("Situation")).toBeInTheDocument();
    });
  });

  it("shows error state on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network"));
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Les vannes se sont perdues en chemin.")).toBeInTheDocument();
    });
    expect(screen.getByText("Réessayer")).toBeInTheDocument();
  });

  it("shows empty state when no jokes", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ jokes: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }),
    });
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Rien ici... c'est aussi vide que mon frigo un dimanche soir")).toBeInTheDocument();
    });
  });

  it("changes category on filter click", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("tab", { name: "Absurde" }));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("category=ABSURDE"));
  });

  it("does not show pagination when only 1 page", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });
    expect(screen.queryByText("Précédent")).not.toBeInTheDocument();
  });

  it("shows pagination when multiple pages", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        jokes: mockJokes,
        pagination: { page: 1, limit: 12, total: 30, totalPages: 3 },
      }),
    });
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Précédent")).toBeInTheDocument();
      expect(screen.getByText("Suivant")).toBeInTheDocument();
      expect(screen.getByText("Page 1 / 3")).toBeInTheDocument();
    });
  });

  it("disables Précédent on first page", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        jokes: mockJokes,
        pagination: { page: 1, limit: 12, total: 30, totalPages: 3 },
      }),
    });
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Précédent")).toBeDisabled();
    });
  });
});

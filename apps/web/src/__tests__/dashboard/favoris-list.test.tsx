import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavorisList } from "@/components/favoris/favoris-list";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

const mockFetchFavorites = jest.fn();
const mockRemoveFavorite = jest.fn();

jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: jest.fn(),
}));

const { useSession } = require("next-auth/react");
const { useFavoritesStore } = require("@/stores/favorites-store");

const mockFavorites = [
  {
    id: "f1",
    contentType: "JOKE",
    jokeId: "j1",
    tipId: null,
    videoId: null,
    createdAt: "2024-01-01",
    joke: { content: "Une blague drôle" },
    tip: null,
    video: null,
  },
  {
    id: "f2",
    contentType: "TIP",
    jokeId: null,
    tipId: "t1",
    videoId: null,
    createdAt: "2024-01-02",
    joke: null,
    tip: { title: "Un super conseil" },
    video: null,
  },
  {
    id: "f3",
    contentType: "VIDEO",
    jokeId: null,
    tipId: null,
    videoId: "v1",
    createdAt: "2024-01-03",
    joke: null,
    tip: null,
    video: { title: "Vidéo stand-up" },
  },
];

describe("FavorisList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ status: "authenticated" });
    useFavoritesStore.mockReturnValue({
      favorites: mockFavorites,
      isLoading: false,
      fetchFavorites: mockFetchFavorites,
      removeFavorite: mockRemoveFavorite,
    });
  });

  it("shows lock for unauthenticated users", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<FavorisList />);
    expect(screen.getByRole("img", { name: "cadenas" })).toBeInTheDocument();
    expect(screen.getByText("Connecte-toi pour voir tes favoris")).toBeInTheDocument();
  });

  it("renders tab filters", () => {
    render(<FavorisList />);
    expect(screen.getByText("Tout")).toBeInTheDocument();
    expect(screen.getByText("Blagues")).toBeInTheDocument();
    expect(screen.getByText("Conseils")).toBeInTheDocument();
    expect(screen.getByText("Vidéos")).toBeInTheDocument();
  });

  it("shows all favorites by default", () => {
    render(<FavorisList />);
    expect(screen.getByText("Une blague drôle")).toBeInTheDocument();
    expect(screen.getByText("Un super conseil")).toBeInTheDocument();
    expect(screen.getByText("Vidéo stand-up")).toBeInTheDocument();
  });

  it("shows content type badges", () => {
    render(<FavorisList />);
    expect(screen.getByText("Blague")).toBeInTheDocument();
    expect(screen.getByText("Conseil")).toBeInTheDocument();
    expect(screen.getByText("Vidéo")).toBeInTheDocument();
  });

  it("filters by JOKE tab", async () => {
    render(<FavorisList />);
    await userEvent.click(screen.getByText("Blagues"));
    expect(screen.getByText("Une blague drôle")).toBeInTheDocument();
    expect(screen.queryByText("Un super conseil")).not.toBeInTheDocument();
    expect(screen.queryByText("Vidéo stand-up")).not.toBeInTheDocument();
  });

  it("filters by TIP tab", async () => {
    render(<FavorisList />);
    await userEvent.click(screen.getByText("Conseils"));
    expect(screen.queryByText("Une blague drôle")).not.toBeInTheDocument();
    expect(screen.getByText("Un super conseil")).toBeInTheDocument();
  });

  it("filters by VIDEO tab", async () => {
    render(<FavorisList />);
    await userEvent.click(screen.getByText("Vidéos"));
    expect(screen.getByText("Vidéo stand-up")).toBeInTheDocument();
    expect(screen.queryByText("Une blague drôle")).not.toBeInTheDocument();
  });

  it("has remove buttons with aria-label", () => {
    render(<FavorisList />);
    const removeButtons = screen.getAllByLabelText("Retirer des favoris");
    expect(removeButtons).toHaveLength(3);
  });

  it("calls removeFavorite on remove button click", async () => {
    render(<FavorisList />);
    const removeButtons = screen.getAllByLabelText("Retirer des favoris");
    await userEvent.click(removeButtons[0]);
    expect(mockRemoveFavorite).toHaveBeenCalledWith("f1");
  });

  it("shows empty state when no favorites", () => {
    useFavoritesStore.mockReturnValue({
      favorites: [],
      isLoading: false,
      fetchFavorites: mockFetchFavorites,
      removeFavorite: mockRemoveFavorite,
    });
    render(<FavorisList />);
    expect(screen.getByRole("img", { name: "favoris" })).toBeInTheDocument();
    expect(screen.getByText("Aucun favori pour le moment")).toBeInTheDocument();
  });

  it("shows loading skeleton", () => {
    useFavoritesStore.mockReturnValue({
      favorites: [],
      isLoading: true,
      fetchFavorites: mockFetchFavorites,
      removeFavorite: mockRemoveFavorite,
    });
    const { container } = render(<FavorisList />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("fetches favorites on mount when authenticated", () => {
    render(<FavorisList />);
    expect(mockFetchFavorites).toHaveBeenCalled();
  });
});

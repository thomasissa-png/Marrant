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

jest.mock("@/stores/user-store", () => ({
  useUserStore: jest.fn(),
}));

const { useSession } = require("next-auth/react");
const { useFavoritesStore } = require("@/stores/favorites-store");
const { useUserStore } = require("@/stores/user-store");

const mockFavorites = [
  {
    id: "f1",
    contentType: "JOKE",
    jokeId: "j1",
    tipId: null,
    videoId: null,
    createdAt: "2024-01-01",
    joke: { content: "Une vanne drôle", punchline: "Et la chute qui tue", category: "ABSURDE", type: "ONE_LINER" },
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
    tip: { title: "Un super conseil", content: "Le contenu du conseil", category: "TIMING", difficulty: "DEBUTANT", example: "Exemple concret", exercise: "DÉFI TIMING : fais ceci" },
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
    video: { youtubeId: "abc123", title: "Vidéo stand-up", channelName: "ComedyFR", category: "OBSERVATION", difficulty: "INTERMEDIAIRE", description: "Masterclass", technique: "Callback", learnings: ["Observer le timing"], exercise: "Regarde et note" },
  },
];

describe("FavorisList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ status: "authenticated" });
    useUserStore.mockImplementation((selector: (s: Record<string, unknown>) => unknown) =>
      selector({ user: { plan: "PREMIUM" } })
    );
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
    expect(screen.getByText(/Connecte-toi pour retrouver tes p/)).toBeInTheDocument();
  });

  it("shows premium upsell for free users", () => {
    useUserStore.mockImplementation((selector: (s: Record<string, unknown>) => unknown) =>
      selector({ user: { plan: "FREE" } })
    );
    render(<FavorisList />);
    expect(screen.getByText(/réservés aux membres Premium/)).toBeInTheDocument();
    expect(screen.getByText(/Découvrir l'offre Premium/)).toBeInTheDocument();
  });

  it("renders tab filters with ARIA", () => {
    render(<FavorisList />);
    expect(screen.getByRole("tablist", { name: "Type de favoris" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Tout/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Vannes/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Conseils/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Vidéos/ })).toBeInTheDocument();
  });

  it("shows all favorites by default", () => {
    render(<FavorisList />);
    expect(screen.getByText("Une vanne drôle")).toBeInTheDocument();
    expect(screen.getByText("Un super conseil")).toBeInTheDocument();
    expect(screen.getByText("Vidéo stand-up")).toBeInTheDocument();
  });

  it("shows content type badges", () => {
    render(<FavorisList />);
    expect(screen.getByText("Vanne")).toBeInTheDocument();
    expect(screen.getByText("Conseil")).toBeInTheDocument();
    expect(screen.getByText("Vidéo")).toBeInTheDocument();
  });

  it("filters by JOKE tab", async () => {
    render(<FavorisList />);
    await userEvent.click(screen.getByRole("tab", { name: /Vannes/ }));
    expect(screen.getByText("Une vanne drôle")).toBeInTheDocument();
    expect(screen.queryByText("Un super conseil")).not.toBeInTheDocument();
    expect(screen.queryByText("Vidéo stand-up")).not.toBeInTheDocument();
  });

  it("filters by TIP tab", async () => {
    render(<FavorisList />);
    await userEvent.click(screen.getByRole("tab", { name: /Conseils/ }));
    expect(screen.queryByText("Une vanne drôle")).not.toBeInTheDocument();
    expect(screen.getByText("Un super conseil")).toBeInTheDocument();
  });

  it("filters by VIDEO tab", async () => {
    render(<FavorisList />);
    await userEvent.click(screen.getByRole("tab", { name: /Vidéos/ }));
    expect(screen.getByText("Vidéo stand-up")).toBeInTheDocument();
    expect(screen.queryByText("Une vanne drôle")).not.toBeInTheDocument();
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

  // Bug fix: contextual empty state per tab
  it("shows contextual empty state for vannes tab", async () => {
    useFavoritesStore.mockReturnValue({
      favorites: [mockFavorites[1]], // Only a TIP, no jokes
      isLoading: false,
      fetchFavorites: mockFetchFavorites,
      removeFavorite: mockRemoveFavorite,
    });
    render(<FavorisList />);
    await userEvent.click(screen.getByRole("tab", { name: /Vannes/ }));
    expect(screen.getByText("Pas encore de vanne en favoris")).toBeInTheDocument();
    expect(screen.getByText("Parcourir les vannes")).toBeInTheDocument();
  });

  it("shows contextual empty state for conseils tab", async () => {
    useFavoritesStore.mockReturnValue({
      favorites: [mockFavorites[0]], // Only a JOKE, no tips
      isLoading: false,
      fetchFavorites: mockFetchFavorites,
      removeFavorite: mockRemoveFavorite,
    });
    render(<FavorisList />);
    await userEvent.click(screen.getByRole("tab", { name: /Conseils/ }));
    expect(screen.getByText("Pas encore de conseil en favoris")).toBeInTheDocument();
    expect(screen.getByText("Découvrir les conseils")).toBeInTheDocument();
  });

  it("shows contextual empty state for vidéos tab", async () => {
    useFavoritesStore.mockReturnValue({
      favorites: [mockFavorites[0]], // Only a JOKE, no videos
      isLoading: false,
      fetchFavorites: mockFetchFavorites,
      removeFavorite: mockRemoveFavorite,
    });
    render(<FavorisList />);
    await userEvent.click(screen.getByRole("tab", { name: /Vidéos/ }));
    expect(screen.getByText("Pas encore de vidéo en favoris")).toBeInTheDocument();
    expect(screen.getByText("Explorer les vidéos")).toBeInTheDocument();
  });

  it("shows generic empty state on Tout tab", () => {
    useFavoritesStore.mockReturnValue({
      favorites: [],
      isLoading: false,
      fetchFavorites: mockFetchFavorites,
      removeFavorite: mockRemoveFavorite,
    });
    render(<FavorisList />);
    expect(screen.getByText("Aucun favori pour l'instant")).toBeInTheDocument();
  });

  // Bug fix: joke punchline reveal
  it("reveals joke punchline on click", async () => {
    render(<FavorisList />);
    expect(screen.getByText("Une vanne drôle")).toBeInTheDocument();
    expect(screen.queryByText("Et la chute qui tue")).not.toBeInTheDocument();
    expect(screen.getByText("Clique pour la chute")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Une vanne drôle"));
    expect(screen.getByText("Et la chute qui tue")).toBeInTheDocument();
  });

  // Bug fix: tip content expansion
  it("shows tip content and expands on click", async () => {
    render(<FavorisList />);
    expect(screen.getByText("Le contenu du conseil")).toBeInTheDocument();
    expect(screen.queryByText("Exemple concret")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Un super conseil"));
    expect(screen.getByText("Exemple concret")).toBeInTheDocument();
    expect(screen.getByText("DÉFI TIMING : fais ceci")).toBeInTheDocument();
  });

  // Bug fix: video player and details
  it("shows video player and details", () => {
    render(<FavorisList />);
    expect(screen.getByText("Vidéo stand-up")).toBeInTheDocument();
    expect(screen.getByText("ComedyFR")).toBeInTheDocument();
    expect(screen.getByText("Observer le timing")).toBeInTheDocument();
    expect(screen.getByText("Regarde et note")).toBeInTheDocument();
    expect(screen.getByLabelText("Lire la vidéo : Vidéo stand-up")).toBeInTheDocument();
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

  it("shows share buttons for each favorite type", () => {
    render(<FavorisList />);
    const shareButtons = screen.getAllByLabelText("Partager");
    expect(shareButtons).toHaveLength(3);
  });

  it("shows category badges on joke cards", () => {
    render(<FavorisList />);
    expect(screen.getByText("Absurde")).toBeInTheDocument();
  });

  it("shows difficulty and category badges on tip cards", () => {
    render(<FavorisList />);
    expect(screen.getByText("Débutant")).toBeInTheDocument();
    expect(screen.getByText("Timing")).toBeInTheDocument();
  });
});

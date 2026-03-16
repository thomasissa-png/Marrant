import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideosGrid } from "@/components/videos/videos-grid";

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

const mockVideos = [
  {
    id: "v1",
    youtubeId: "abc123",
    title: "Stand-up hilarant",
    channelName: "ComedyFR",
    duration: "PT12M30S",
    category: "TIMING",
    difficulty: "DEBUTANT",
    description: "Une vidéo super drôle",
    technique: "Callback",
    learnings: ["Observer le timing des pauses", "Utiliser le callback en fin de set"],
    exercise: "Regarde la vidéo et note chaque pause de plus de 2 secondes. Essaie de reproduire ce timing dans une anecdote.",
  },
  {
    id: "v2",
    youtubeId: "def456",
    title: "Masterclass humour",
    channelName: "HumorPro",
    duration: "PT1H5M",
    category: "STORYTELLING",
    difficulty: "EXPERT",
    description: "Technique avancée",
    technique: "Rule of Three",
    learnings: [],
    exercise: null,
  },
];

describe("VideosGrid", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        videos: mockVideos,
        pagination: { page: 1, limit: 12, total: 2, totalPages: 1 },
      }),
    });
  });

  it("renders difficulty filter", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByRole("tablist", { name: "Niveaux de difficulté" })).toBeInTheDocument();
    });
    expect(screen.getByRole("tab", { name: "Tous" })).toBeInTheDocument();
  });

  it("fetches and displays videos", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Stand-up hilarant")).toBeInTheDocument();
      expect(screen.getByText("Masterclass humour")).toBeInTheDocument();
    });
  });

  it("displays channel names", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("ComedyFR")).toBeInTheDocument();
      expect(screen.getByText("HumorPro")).toBeInTheDocument();
    });
  });

  it("shows category and technique badges", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Timing")).toBeInTheDocument();
      expect(screen.getByText("Callback")).toBeInTheDocument();
    });
  });

  it("shows YouTube thumbnail with play button", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      const playButton = screen.getByLabelText("Lire la vidéo : Stand-up hilarant");
      expect(playButton).toBeInTheDocument();
    });
  });

  it("loads iframe on play click", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByLabelText("Lire la vidéo : Stand-up hilarant")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByLabelText("Lire la vidéo : Stand-up hilarant"));
    const iframe = screen.getByTitle("Stand-up hilarant");
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/abc123?autoplay=1");
    expect(iframe).toHaveAttribute("allowFullScreen");
  });

  it("shows error state on failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Les vidéos ont pris un jour de congé.")).toBeInTheDocument();
    });
  });

  it("shows empty state when no videos", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ videos: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }),
    });
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Pas de vidéo ici... même les humoristes font des pauses")).toBeInTheDocument();
    });
  });

  it("displays learnings and exercise when available", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Ce que tu vas apprendre")).toBeInTheDocument();
      expect(screen.getByText("Observer le timing des pauses")).toBeInTheDocument();
      expect(screen.getByText("Utiliser le callback en fin de set")).toBeInTheDocument();
      expect(screen.getByText("Exercice pratique")).toBeInTheDocument();
    });
  });

  it("filters by difficulty", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Stand-up hilarant")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("tab", { name: "Expert" }));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("difficulty=EXPERT"));
  });
});

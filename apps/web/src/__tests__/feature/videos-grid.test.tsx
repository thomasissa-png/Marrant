import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideosGrid } from "@/components/videos/videos-grid";

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

  it("formats duration correctly (PT12M30S -> 12:30)", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("12:30")).toBeInTheDocument();
    });
  });

  it("formats duration with hours (PT1H5M -> 1:5:00)", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("1:5:00")).toBeInTheDocument();
    });
  });

  it("shows category and technique badges", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Timing")).toBeInTheDocument();
      expect(screen.getByText("Callback")).toBeInTheDocument();
    });
  });

  it("links to YouTube with target _blank", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      const link = screen.getByAltText("Stand-up hilarant").closest("a");
      expect(link).toHaveAttribute("href", "https://www.youtube.com/watch?v=abc123");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("uses lazy loading for thumbnails", async () => {
    render(<VideosGrid />);
    await waitFor(() => {
      const img = screen.getByAltText("Stand-up hilarant");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  it("shows error state on failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Impossible de charger les vidéos.")).toBeInTheDocument();
    });
  });

  it("shows empty state when no videos", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ videos: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }),
    });
    render(<VideosGrid />);
    await waitFor(() => {
      expect(screen.getByText("Aucune vidéo avec ce filtre")).toBeInTheDocument();
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

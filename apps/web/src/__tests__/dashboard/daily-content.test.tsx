import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DailyContent } from "@/components/home/daily-content";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({ status: "authenticated" }),
}));

jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: () => ({
    isFavorite: jest.fn().mockReturnValue(false),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getFavoriteId: jest.fn().mockReturnValue(null),
  }),
}));

jest.mock("@/stores/user-store", () => ({
  useUserStore: jest.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ user: { plan: "PREMIUM" } })
  ),
}));

jest.mock("@/components/ui/toast", () => ({
  toast: jest.fn(),
}));

const mockDailyData = {
  joke: {
    id: "j1",
    content: "Pourquoi les plongeurs plongent-ils toujours en arrière ?",
    punchline: "Parce que sinon ils tomberaient dans le bateau.",
    category: "ABSURDE",
  },
  tip: {
    id: "t1",
    title: "Le timing parfait",
    content: "Fais une pause avant la chute.",
    category: "TIMING",
    difficulty: "DEBUTANT",
    example: "Quand tu racontes une histoire, marque une pause de 2 secondes.",
    exercise: "Raconte une blague à un ami en faisant 3 pauses aujourd'hui.",
  },
  video: {
    id: "v1",
    youtubeId: "dQw4w9WgXcQ",
    title: "Les secrets du timing comique",
    channelName: "Humour Academy",
    duration: "PT12M30S",
    category: "TIMING",
    technique: "Pause dramatique",
    learnings: ["Maîtriser la pause avant la chute", "Varier le rythme de parole"],
    exercise: "Raconte une blague en variant les pauses ce soir.",
  },
};

describe("DailyContent", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDailyData,
    });
  });

  it("shows loading skeleton initially", () => {
    const { container } = render(<DailyContent />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows section title", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Ton contenu du jour")).toBeInTheDocument();
    });
  });

  it("shows Vanne du jour section", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Vanne du jour").length).toBeGreaterThan(0);
    });
  });

  it("shows Conseil du jour section", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Conseil du jour").length).toBeGreaterThan(0);
    });
  });

  it("shows Vidéo du jour section", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Vidéo du jour").length).toBeGreaterThan(0);
    });
  });

  it("shows joke setup", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(
        screen.getByText("Pourquoi les plongeurs plongent-ils toujours en arrière ?")
      ).toBeInTheDocument();
    });
  });

  it("shows 'Révéler la chute' button", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Révéler la chute")).toBeInTheDocument();
    });
  });

  it("reveals punchline on button click", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Révéler la chute")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText("Révéler la chute"));
    expect(screen.getByText("Parce que sinon ils tomberaient dans le bateau.")).toBeInTheDocument();
  });

  it("shows category badge", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Absurde")).toBeInTheDocument();
    });
  });

  it("shows tip title and content", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Le timing parfait")).toBeInTheDocument();
      expect(screen.getByText("Fais une pause avant la chute.")).toBeInTheDocument();
    });
  });

  it("shows tip category badge", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Timing").length).toBeGreaterThan(0);
    });
  });

  it("shows video title and channel", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Les secrets du timing comique")).toBeInTheDocument();
      expect(screen.getByText("Humour Academy")).toBeInTheDocument();
    });
  });

  it("shows YouTube thumbnail with play button", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      const playButton = screen.getByLabelText("Lire la vidéo : Les secrets du timing comique");
      expect(playButton).toBeInTheDocument();
    });
  });

  it("shows video technique badge", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Pause dramatique")).toBeInTheDocument();
    });
  });

  it("shows no content messages when null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ joke: null, tip: null, video: null }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Même l'humour prend un jour off. Reviens demain pour ta dose !")).toBeInTheDocument();
      expect(screen.getByText("Le prof d'humour est en pause café. Ça revient demain.")).toBeInTheDocument();
      expect(screen.getByText("L'humoriste du jour est en coulisses. À demain !")).toBeInTheDocument();
    });
  });

  it("handles missing video gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockDailyData, video: null }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("L'humoriste du jour est en coulisses. À demain !")).toBeInTheDocument();
      expect(
        screen.getByText("Pourquoi les plongeurs plongent-ils toujours en arrière ?")
      ).toBeInTheDocument();
    });
  });

  it("handles fetch error gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Même l'humour prend un jour off. Reviens demain pour ta dose !")).toBeInTheDocument();
      expect(screen.getByText("Le prof d'humour est en pause café. Ça revient demain.")).toBeInTheDocument();
      expect(screen.getByText("L'humoriste du jour est en coulisses. À demain !")).toBeInTheDocument();
    });
  });

  it("handles network failure gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Même l'humour prend un jour off. Reviens demain pour ta dose !")).toBeInTheDocument();
    });
  });

  it("shows tip example and exercise", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Exemple concret")).toBeInTheDocument();
      expect(screen.getByText(/Quand tu racontes une histoire/)).toBeInTheDocument();
      expect(screen.getByText("Exercice du jour")).toBeInTheDocument();
      expect(screen.getByText(/Raconte une blague à un ami/)).toBeInTheDocument();
    });
  });

  it("hides example/exercise when not available", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockDailyData,
        tip: { ...mockDailyData.tip, example: undefined, exercise: undefined },
      }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Le timing parfait")).toBeInTheDocument();
      expect(screen.queryByText("Exemple concret")).not.toBeInTheDocument();
      expect(screen.queryByText("Exercice du jour")).not.toBeInTheDocument();
    });
  });

  it("shows video learnings", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Ce que tu vas apprendre")).toBeInTheDocument();
      expect(screen.getByText("Maîtriser la pause avant la chute")).toBeInTheDocument();
      expect(screen.getByText("Varier le rythme de parole")).toBeInTheDocument();
    });
  });

  it("shows video exercise", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Exercice pratique")).toBeInTheDocument();
      expect(screen.getByText("Raconte une blague en variant les pauses ce soir.")).toBeInTheDocument();
    });
  });

  it("hides video learnings/exercise when not available", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockDailyData,
        video: { ...mockDailyData.video, learnings: [], exercise: null },
      }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Les secrets du timing comique")).toBeInTheDocument();
      expect(screen.queryByText("Ce que tu vas apprendre")).not.toBeInTheDocument();
      expect(screen.queryByText("Exercice pratique")).not.toBeInTheDocument();
    });
  });

  it("fetches from /api/daily", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/daily");
    });
  });

  it("shows share buttons for joke, tip and video", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      const shareButtons = screen.getAllByLabelText("Partager");
      expect(shareButtons).toHaveLength(3);
    });
  });

  it("shows favorite buttons for joke, tip and video", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      const favButtons = screen.getAllByLabelText("Ajouter aux favoris");
      expect(favButtons).toHaveLength(3);
    });
  });

  it("does not show share/favorite buttons when content is null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ joke: null, tip: null, video: null }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Même l'humour prend un jour off. Reviens demain pour ta dose !")).toBeInTheDocument();
    });
    expect(screen.queryByLabelText("Partager")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Ajouter aux favoris")).not.toBeInTheDocument();
  });
});

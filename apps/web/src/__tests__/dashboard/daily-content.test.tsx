import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DailyContent } from "@/components/home/daily-content";

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

  it("shows Blague du jour section", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Blague du jour").length).toBeGreaterThan(0);
    });
  });

  it("shows Conseil du jour section", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Conseil du jour").length).toBeGreaterThan(0);
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
      expect(screen.getByText("Timing")).toBeInTheDocument();
    });
  });

  it("shows no joke message when null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ joke: null, tip: null }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Aucune blague disponible aujourd'hui.")).toBeInTheDocument();
      expect(screen.getByText("Aucun conseil disponible aujourd'hui.")).toBeInTheDocument();
    });
  });

  it("fetches from /api/daily", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/daily");
    });
  });
});

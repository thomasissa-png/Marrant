import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactionButtons } from "@/components/ui/reaction-buttons";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("@/components/ui/toast", () => ({
  toast: jest.fn(),
}));

const { useSession } = require("next-auth/react");
const { toast } = require("@/components/ui/toast");

// Helper: mock fetch to handle GET (mount) then POST (click)
function mockFetchSequence(
  getResponse: { likes: number; dislikes: number; userReaction: boolean | null },
  postResponse?: { ok: boolean; data?: Record<string, unknown> }
) {
  (global.fetch as jest.Mock).mockImplementation((url: string, options?: RequestInit) => {
    if (!options || options.method !== "POST") {
      // GET request (mount)
      return Promise.resolve({
        ok: true,
        json: async () => getResponse,
      });
    }
    // POST request (click)
    if (postResponse) {
      return Promise.resolve({
        ok: postResponse.ok,
        json: async () => postResponse.data ?? {},
      });
    }
    return Promise.resolve({ ok: false });
  });
}

describe("ReactionButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ status: "authenticated" });
    global.fetch = jest.fn();
  });

  it("renders like and dislike buttons", async () => {
    mockFetchSequence({ likes: 0, dislikes: 0, userReaction: null });
    render(<ReactionButtons jokeId="j1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("0 hilarant")).toBeInTheDocument();
      expect(screen.getByLabelText("0 pas terrible")).toBeInTheDocument();
    });
  });

  it("fetches and displays counts from API on mount", async () => {
    mockFetchSequence({ likes: 12, dislikes: 3, userReaction: null });
    render(<ReactionButtons jokeId="j1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("12 hilarant")).toBeInTheDocument();
      expect(screen.getByLabelText("3 pas terrible")).toBeInTheDocument();
    });
  });

  it("displays initial counts before fetch resolves", () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves
    render(<ReactionButtons jokeId="j1" initialLikes={5} initialDislikes={3} />);
    expect(screen.getByLabelText("5 hilarant")).toBeInTheDocument();
    expect(screen.getByLabelText("3 pas terrible")).toBeInTheDocument();
  });

  it("increments likes on created action", async () => {
    mockFetchSequence(
      { likes: 2, dislikes: 0, userReaction: null },
      { ok: true, data: { action: "created" } }
    );

    render(<ReactionButtons jokeId="j1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("2 hilarant")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("2 hilarant"));

    await waitFor(() => {
      expect(screen.getByLabelText("3 hilarant")).toBeInTheDocument();
    });
  });

  it("decrements likes on removed action", async () => {
    mockFetchSequence(
      { likes: 5, dislikes: 0, userReaction: true },
      { ok: true, data: { action: "removed" } }
    );

    render(<ReactionButtons jokeId="j1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("5 hilarant")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("5 hilarant"));

    await waitFor(() => {
      expect(screen.getByLabelText("4 hilarant")).toBeInTheDocument();
    });
  });

  it("posts to correct API endpoint", async () => {
    mockFetchSequence(
      { likes: 0, dislikes: 0, userReaction: null },
      { ok: true, data: { action: "created" } }
    );

    render(<ReactionButtons jokeId="joke-123" />);
    await waitFor(() => {
      expect(screen.getByLabelText("0 hilarant")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("0 hilarant"));

    expect(global.fetch).toHaveBeenCalledWith("/api/jokes/joke-123/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLike: true }),
    });
  });

  it("sends isLike false for dislike", async () => {
    mockFetchSequence(
      { likes: 0, dislikes: 0, userReaction: null },
      { ok: true, data: { action: "created" } }
    );

    render(<ReactionButtons jokeId="j1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("0 pas terrible")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("0 pas terrible"));

    expect(global.fetch).toHaveBeenCalledWith("/api/jokes/j1/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLike: false }),
    });
  });

  it("shows toast on API error", async () => {
    mockFetchSequence(
      { likes: 0, dislikes: 0, userReaction: null },
      { ok: false }
    );

    render(<ReactionButtons jokeId="j1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("0 hilarant")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("0 hilarant"));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Erreur lors de la réaction", "error");
    });
  });

  it("shows toast on network error", async () => {
    let callCount = 0;
    (global.fetch as jest.Mock).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // GET on mount
        return Promise.resolve({
          ok: true,
          json: async () => ({ likes: 0, dislikes: 0, userReaction: null }),
        });
      }
      // POST throws
      return Promise.reject(new Error("Network"));
    });

    render(<ReactionButtons jokeId="j1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("0 hilarant")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByLabelText("0 hilarant"));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Connexion perdue, réessaie", "error");
    });
  });

  it("does nothing when unauthenticated", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    mockFetchSequence({ likes: 0, dislikes: 0, userReaction: null });

    render(<ReactionButtons jokeId="j1" />);
    await waitFor(() => {
      expect(screen.getByLabelText("0 hilarant")).toBeInTheDocument();
    });

    // Reset mock to track only POST calls
    (global.fetch as jest.Mock).mockClear();
    await userEvent.click(screen.getByLabelText("0 hilarant"));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});

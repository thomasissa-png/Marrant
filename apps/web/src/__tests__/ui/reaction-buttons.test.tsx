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

describe("ReactionButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ status: "authenticated" });
    global.fetch = jest.fn();
  });

  it("renders like and dislike buttons", () => {
    render(<ReactionButtons jokeId="j1" />);
    expect(screen.getByLabelText("0 j'adore")).toBeInTheDocument();
    expect(screen.getByLabelText("0 bof")).toBeInTheDocument();
  });

  it("displays initial counts", () => {
    render(<ReactionButtons jokeId="j1" initialLikes={5} initialDislikes={3} />);
    expect(screen.getByLabelText("5 j'adore")).toBeInTheDocument();
    expect(screen.getByLabelText("3 bof")).toBeInTheDocument();
  });

  it("increments likes on created action", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ action: "created" }),
    });

    render(<ReactionButtons jokeId="j1" initialLikes={2} />);
    await userEvent.click(screen.getByLabelText("2 j'adore"));

    await waitFor(() => {
      expect(screen.getByLabelText("3 j'adore")).toBeInTheDocument();
    });
  });

  it("decrements likes on removed action", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ action: "removed" }),
    });

    render(<ReactionButtons jokeId="j1" initialLikes={5} initialUserReaction={true} />);
    await userEvent.click(screen.getByLabelText("5 j'adore"));

    await waitFor(() => {
      expect(screen.getByLabelText("4 j'adore")).toBeInTheDocument();
    });
  });

  it("posts to correct API endpoint", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ action: "created" }),
    });

    render(<ReactionButtons jokeId="joke-123" />);
    await userEvent.click(screen.getByLabelText("0 j'adore"));

    expect(global.fetch).toHaveBeenCalledWith("/api/jokes/joke-123/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLike: true }),
    });
  });

  it("sends isLike false for dislike", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ action: "created" }),
    });

    render(<ReactionButtons jokeId="j1" />);
    await userEvent.click(screen.getByLabelText("0 bof"));

    expect(global.fetch).toHaveBeenCalledWith("/api/jokes/j1/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLike: false }),
    });
  });

  it("shows toast on API error", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    render(<ReactionButtons jokeId="j1" />);
    await userEvent.click(screen.getByLabelText("0 j'adore"));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Erreur lors de la réaction", "error");
    });
  });

  it("shows toast on network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network"));

    render(<ReactionButtons jokeId="j1" />);
    await userEvent.click(screen.getByLabelText("0 j'adore"));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Connexion perdue, réessaie", "error");
    });
  });

  it("does nothing when unauthenticated", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });

    render(<ReactionButtons jokeId="j1" />);
    await userEvent.click(screen.getByLabelText("0 j'adore"));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/ui/search-bar";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockResults = [
  { id: "1", type: "JOKE", title: "Blague drôle", preview: "Setup..." },
  { id: "2", type: "TIP", title: "Bon conseil", preview: "Astuce..." },
  { id: "3", type: "VIDEO", title: "Vidéo fun", preview: "Watch..." },
];

describe("SearchBar", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockPush.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders search input with placeholder", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText("Rechercher une blague, un conseil...")).toBeInTheDocument();
  });

  it("does not fetch for queries shorter than 2 characters", async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Rechercher une blague, un conseil...");
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, "a");
    jest.advanceTimersByTime(500);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("fetches results after 300ms debounce", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Rechercher une blague, un conseil...");

    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, "bl");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/search?q=bl");
    });
  });

  it("shows type labels: Blague, Conseil, Vidéo", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Rechercher une blague, un conseil...");
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, "test");

    await waitFor(() => {
      expect(screen.getByText("Blague")).toBeInTheDocument();
      expect(screen.getByText("Conseil")).toBeInTheDocument();
      expect(screen.getByText("Vidéo")).toBeInTheDocument();
    });
  });

  it("displays result titles", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    render(<SearchBar />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByPlaceholderText("Rechercher une blague, un conseil..."),
      "test"
    );

    await waitFor(() => {
      expect(screen.getByText("Blague drôle")).toBeInTheDocument();
      expect(screen.getByText("Bon conseil")).toBeInTheDocument();
      expect(screen.getByText("Vidéo fun")).toBeInTheDocument();
    });
  });

  it("shows no results message when empty", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });

    render(<SearchBar />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByPlaceholderText("Rechercher une blague, un conseil..."),
      "xyz"
    );

    await waitFor(() => {
      expect(screen.getByText(/Aucun résultat/)).toBeInTheDocument();
    });
  });

  it("navigates on JOKE result click", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockResults[0]] }),
    });

    render(<SearchBar />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByPlaceholderText("Rechercher une blague, un conseil..."),
      "blague"
    );

    await waitFor(() => {
      expect(screen.getByText("Blague drôle")).toBeInTheDocument();
    });

    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Blague drôle")
    );

    expect(mockPush).toHaveBeenCalledWith("/blagues");
  });

  it("merges custom className", () => {
    const { container } = render(<SearchBar className="w-96" />);
    expect(container.firstChild).toHaveClass("w-96");
  });
});

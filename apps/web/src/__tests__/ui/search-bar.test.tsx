import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/ui/search-bar";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockResults = [
  { id: "1", type: "JOKE", title: "Vanne drôle", preview: "Setup..." },
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

  it("renders search input with combobox role and placeholder", () => {
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-label", "Rechercher");
    expect(input).toHaveAttribute("placeholder", "Rechercher...");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
  });

  it("does not fetch for queries shorter than 2 characters", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
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
    const input = screen.getByRole("combobox");

    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, "bl");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/search?q=bl");
    });
  });

  it("shows results grouped by type with section headers", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(input, "test");

    await waitFor(() => {
      expect(screen.getByText("Vannes (1)")).toBeInTheDocument();
      expect(screen.getByText("Conseils (1)")).toBeInTheDocument();
      expect(screen.getByText("Vidéos (1)")).toBeInTheDocument();
    });
  });

  it("shows 'Voir' links for each type group", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    render(<SearchBar />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByRole("combobox"),
      "test"
    );

    await waitFor(() => {
      expect(screen.getByText("Voir vannes")).toBeInTheDocument();
      expect(screen.getByText("Voir conseils")).toBeInTheDocument();
      expect(screen.getByText("Voir vidéos")).toBeInTheDocument();
    });
  });

  it("displays result titles and previews", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    render(<SearchBar />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByRole("combobox"),
      "test"
    );

    await waitFor(() => {
      expect(screen.getByText("Vanne drôle")).toBeInTheDocument();
      expect(screen.getByText("Bon conseil")).toBeInTheDocument();
      expect(screen.getByText("Vidéo fun")).toBeInTheDocument();
    });
  });

  it("shows no results message with suggestions when empty", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });

    render(<SearchBar />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByRole("combobox"),
      "xyz"
    );

    await waitFor(() => {
      expect(screen.getByText(/Rien trouvé/)).toBeInTheDocument();
      // Should show suggestion buttons
      expect(screen.getByText("timing")).toBeInTheDocument();
      expect(screen.getByText("répartie")).toBeInTheDocument();
    });
  });

  it("navigates on JOKE result click", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockResults[0]] }),
    });

    render(<SearchBar />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByRole("combobox"),
      "blague"
    );

    await waitFor(() => {
      expect(screen.getByText("Vanne drôle")).toBeInTheDocument();
    });

    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Vanne drôle")
    );

    expect(mockPush).toHaveBeenCalledWith("/vannes?q=blague");
  });

  it("shows suggestions on focus when no query", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(input);

    expect(screen.getByText("Suggestions")).toBeInTheDocument();
    expect(screen.getByText("timing")).toBeInTheDocument();
    expect(screen.getByText("storytelling")).toBeInTheDocument();
  });

  it("fills query when clicking a suggestion", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("combobox");
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(input);

    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("timing")
    );

    expect(input).toHaveValue("timing");
  });

  it("supports keyboard navigation with ArrowDown/Up and Enter", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockResults[0]] }),
    });

    render(<SearchBar />);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const input = screen.getByRole("combobox");

    await user.type(input, "blague");

    await waitFor(() => {
      expect(screen.getByText("Vanne drôle")).toBeInTheDocument();
    });

    // ArrowDown to select first result
    await user.keyboard("{ArrowDown}");
    const firstOption = screen.getByText("Vanne drôle").closest("[role='option']");
    expect(firstOption).toHaveAttribute("aria-selected", "true");

    // Enter to navigate
    await user.keyboard("{Enter}");
    expect(mockPush).toHaveBeenCalledWith("/vannes?q=blague");
  });

  it("closes dropdown on Escape", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    render(<SearchBar />);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await user.type(screen.getByRole("combobox"), "test");

    await waitFor(() => {
      expect(screen.getByText("Vanne drôle")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Vanne drôle")).not.toBeInTheDocument();
  });

  it("has listbox role on results dropdown", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults }),
    });

    render(<SearchBar />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByRole("combobox"),
      "test"
    );

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  it("calls onNavigate callback when selecting a result", async () => {
    const onNavigate = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [mockResults[0]] }),
    });

    render(<SearchBar onNavigate={onNavigate} />);
    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).type(
      screen.getByRole("combobox"),
      "test"
    );

    await waitFor(() => {
      expect(screen.getByText("Vanne drôle")).toBeInTheDocument();
    });

    await userEvent.setup({ advanceTimers: jest.advanceTimersByTime }).click(
      screen.getByText("Vanne drôle")
    );

    expect(onNavigate).toHaveBeenCalled();
  });

  it("merges custom className", () => {
    const { container } = render(<SearchBar className="w-96" />);
    expect(container.firstChild).toHaveClass("w-96");
  });
});

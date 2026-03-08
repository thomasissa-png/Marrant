import { useFavoritesStore } from "@/stores/favorites-store";

// Reset store between tests
const initialState = useFavoritesStore.getState();

describe("FavoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState(initialState);
    global.fetch = jest.fn();
  });

  it("has empty favorites by default", () => {
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });

  it("has isLoading false by default", () => {
    expect(useFavoritesStore.getState().isLoading).toBe(false);
  });

  describe("fetchFavorites", () => {
    it("sets isLoading during fetch", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ favorites: [] }),
      });

      const promise = useFavoritesStore.getState().fetchFavorites();
      expect(useFavoritesStore.getState().isLoading).toBe(true);
      await promise;
      expect(useFavoritesStore.getState().isLoading).toBe(false);
    });

    it("sets favorites from API response", async () => {
      const mockFavs = [
        { id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "" },
      ];
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ favorites: mockFavs }),
      });

      await useFavoritesStore.getState().fetchFavorites();
      expect(useFavoritesStore.getState().favorites).toEqual(mockFavs);
    });

    it("handles fetch failure gracefully", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
      await useFavoritesStore.getState().fetchFavorites();
      expect(useFavoritesStore.getState().isLoading).toBe(false);
    });
  });

  describe("addFavorite", () => {
    it("adds favorite on success", async () => {
      const newFav = { id: "f2", contentType: "TIP", jokeId: null, tipId: "t1", videoId: null, createdAt: "" };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ favorite: newFav }),
      });

      const result = await useFavoritesStore.getState().addFavorite("TIP", "t1");
      expect(result).toBe(true);
      expect(useFavoritesStore.getState().favorites).toContainEqual(newFav);
    });

    it("returns false on failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await useFavoritesStore.getState().addFavorite("JOKE", "j1");
      expect(result).toBe(false);
    });

    it("posts to /api/favorites", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ favorite: {} }),
      });
      await useFavoritesStore.getState().addFavorite("VIDEO", "v1");
      expect(global.fetch).toHaveBeenCalledWith("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: "VIDEO", contentId: "v1" }),
      });
    });
  });

  describe("removeFavorite", () => {
    it("removes favorite on success", async () => {
      useFavoritesStore.setState({
        favorites: [{ id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "" }] as never[],
      });
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      const result = await useFavoritesStore.getState().removeFavorite("f1");
      expect(result).toBe(true);
      expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    });

    it("returns false on failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await useFavoritesStore.getState().removeFavorite("f1");
      expect(result).toBe(false);
    });

    it("calls DELETE on /api/favorites/:id", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      await useFavoritesStore.getState().removeFavorite("f1");
      expect(global.fetch).toHaveBeenCalledWith("/api/favorites/f1", { method: "DELETE" });
    });
  });

  describe("isFavorite", () => {
    it("returns true for existing JOKE favorite", () => {
      useFavoritesStore.setState({
        favorites: [{ id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "" }] as never[],
      });
      expect(useFavoritesStore.getState().isFavorite("JOKE", "j1")).toBe(true);
    });

    it("returns false for non-existing favorite", () => {
      expect(useFavoritesStore.getState().isFavorite("JOKE", "j99")).toBe(false);
    });

    it("returns true for TIP favorite", () => {
      useFavoritesStore.setState({
        favorites: [{ id: "f2", contentType: "TIP", jokeId: null, tipId: "t1", videoId: null, createdAt: "" }] as never[],
      });
      expect(useFavoritesStore.getState().isFavorite("TIP", "t1")).toBe(true);
    });

    it("returns true for VIDEO favorite", () => {
      useFavoritesStore.setState({
        favorites: [{ id: "f3", contentType: "VIDEO", jokeId: null, tipId: null, videoId: "v1", createdAt: "" }] as never[],
      });
      expect(useFavoritesStore.getState().isFavorite("VIDEO", "v1")).toBe(true);
    });
  });

  describe("getFavoriteId", () => {
    it("returns favorite ID when found", () => {
      useFavoritesStore.setState({
        favorites: [{ id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "" }] as never[],
      });
      expect(useFavoritesStore.getState().getFavoriteId("JOKE", "j1")).toBe("f1");
    });

    it("returns null when not found", () => {
      expect(useFavoritesStore.getState().getFavoriteId("JOKE", "j99")).toBeNull();
    });
  });
});

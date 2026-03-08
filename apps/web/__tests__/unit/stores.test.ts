/**
 * Tests des stores Zustand — user-store et favorites-store
 * On teste la logique pure (état initial, mutations) sans fetch réel
 */

// Mock fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { useUserStore } from "@/stores/user-store";
import { useFavoritesStore } from "@/stores/favorites-store";

beforeEach(() => {
  mockFetch.mockReset();
  // Reset stores entre les tests
  useUserStore.setState({ user: null, isLoading: false });
  useFavoritesStore.setState({ favorites: [], isLoading: false });
});

describe("useUserStore", () => {
  it("a un état initial correct", () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it("fetchUser charge le profil quand l'API répond OK", async () => {
    const mockUser = {
      id: "u1",
      name: "Test",
      email: "test@test.fr",
      plan: "FREE",
      level: "NOVICE",
      xp: 0,
      streak: 1,
      lastActiveAt: null,
      stats: { jokesRead: 0, tipsCompleted: 0, videosWatched: 0, totalFavorites: 0 },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    await useUserStore.getState().fetchUser();

    expect(useUserStore.getState().user).toEqual(mockUser);
    expect(useUserStore.getState().isLoading).toBe(false);
  });

  it("fetchUser met user à null si l'API échoue", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await useUserStore.getState().fetchUser();

    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().isLoading).toBe(false);
  });

  it("fetchUser met user à null en cas d'erreur réseau", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await useUserStore.getState().fetchUser();

    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().isLoading).toBe(false);
  });

  it("addXp met à jour xp et level après succès", async () => {
    useUserStore.setState({
      user: {
        id: "u1",
        name: "Test",
        email: "test@test.fr",
        plan: "FREE" as const,
        level: "NOVICE" as const,
        xp: 50,
        streak: 1,
        lastActiveAt: null,
        stats: { jokesRead: 0, tipsCompleted: 0, videosWatched: 0, totalFavorites: 0 },
      },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ xp: 70, level: "NOVICE" }),
    });

    await useUserStore.getState().addXp(20, "joke_read");

    expect(useUserStore.getState().user?.xp).toBe(70);
  });

  it("addXp ne fait rien si user est null", async () => {
    await useUserStore.getState().addXp(20, "test");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("reset remet l'état initial", () => {
    useUserStore.setState({
      user: { id: "u1" } as never,
      isLoading: true,
    });

    useUserStore.getState().reset();

    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().isLoading).toBe(false);
  });
});

describe("useFavoritesStore", () => {
  it("a un état initial correct", () => {
    const state = useFavoritesStore.getState();
    expect(state.favorites).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it("fetchFavorites charge la liste", async () => {
    const mockFavorites = [
      { id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "2026-01-01" },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favorites: mockFavorites }),
    });

    await useFavoritesStore.getState().fetchFavorites();

    expect(useFavoritesStore.getState().favorites).toEqual(mockFavorites);
  });

  it("addFavorite ajoute en tête de liste", async () => {
    const mockFav = {
      id: "f2",
      contentType: "TIP",
      jokeId: null,
      tipId: "t1",
      videoId: null,
      createdAt: "2026-01-02",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ favorite: mockFav }),
    });

    const result = await useFavoritesStore.getState().addFavorite("TIP", "t1");

    expect(result).toBe(true);
    expect(useFavoritesStore.getState().favorites[0]).toEqual(mockFav);
  });

  it("addFavorite retourne false si l'API échoue", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    const result = await useFavoritesStore.getState().addFavorite("JOKE", "j1");

    expect(result).toBe(false);
  });

  it("removeFavorite retire l'élément de la liste", async () => {
    useFavoritesStore.setState({
      favorites: [
        { id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "2026-01-01" },
        { id: "f2", contentType: "TIP", jokeId: null, tipId: "t1", videoId: null, createdAt: "2026-01-02" },
      ],
    });

    mockFetch.mockResolvedValueOnce({ ok: true });

    const result = await useFavoritesStore.getState().removeFavorite("f1");

    expect(result).toBe(true);
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
    expect(useFavoritesStore.getState().favorites[0].id).toBe("f2");
  });

  it("isFavorite détecte un favori JOKE", () => {
    useFavoritesStore.setState({
      favorites: [
        { id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "2026-01-01" },
      ],
    });

    expect(useFavoritesStore.getState().isFavorite("JOKE", "j1")).toBe(true);
    expect(useFavoritesStore.getState().isFavorite("JOKE", "j999")).toBe(false);
    expect(useFavoritesStore.getState().isFavorite("TIP", "j1")).toBe(false);
  });

  it("getFavoriteId retourne l'ID du favori ou null", () => {
    useFavoritesStore.setState({
      favorites: [
        { id: "f1", contentType: "VIDEO", jokeId: null, tipId: null, videoId: "v1", createdAt: "2026-01-01" },
      ],
    });

    expect(useFavoritesStore.getState().getFavoriteId("VIDEO", "v1")).toBe("f1");
    expect(useFavoritesStore.getState().getFavoriteId("VIDEO", "v999")).toBeNull();
  });
});

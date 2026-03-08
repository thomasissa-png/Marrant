import { useUserStore } from "@/stores/user-store";

const initialState = useUserStore.getState();

describe("UserStore", () => {
  beforeEach(() => {
    useUserStore.setState(initialState);
    global.fetch = jest.fn();
  });

  it("has null user by default", () => {
    expect(useUserStore.getState().user).toBeNull();
  });

  it("has isLoading false by default", () => {
    expect(useUserStore.getState().isLoading).toBe(false);
  });

  describe("fetchUser", () => {
    it("fetches user from /api/user", async () => {
      const mockUser = {
        id: "u1",
        name: "Jean",
        email: "jean@test.fr",
        plan: "FREE",
        level: "NOVICE",
        xp: 50,
        streak: 3,
        lastActiveAt: null,
        stats: { jokesRead: 10, tipsCompleted: 5, videosWatched: 2, totalFavorites: 3 },
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ user: mockUser }),
      });

      await useUserStore.getState().fetchUser();
      expect(useUserStore.getState().user).toEqual(mockUser);
      expect(useUserStore.getState().isLoading).toBe(false);
    });

    it("sets user to null on API error", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      await useUserStore.getState().fetchUser();
      expect(useUserStore.getState().user).toBeNull();
    });

    it("handles network error", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
      await useUserStore.getState().fetchUser();
      expect(useUserStore.getState().user).toBeNull();
      expect(useUserStore.getState().isLoading).toBe(false);
    });
  });

  describe("addXp", () => {
    const mockUser = {
      id: "u1",
      name: "Jean",
      email: "jean@test.fr",
      plan: "FREE" as const,
      level: "NOVICE" as const,
      xp: 50,
      streak: 3,
      lastActiveAt: null,
      stats: { jokesRead: 10, tipsCompleted: 5, videosWatched: 2, totalFavorites: 3 },
    };

    it("does nothing when no user", async () => {
      await useUserStore.getState().addXp(10, "test");
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("posts to /api/user/xp and updates user", async () => {
      useUserStore.setState({ user: mockUser });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ xp: 60, level: "NOVICE" }),
      });

      await useUserStore.getState().addXp(10, "tip_read");
      expect(global.fetch).toHaveBeenCalledWith("/api/user/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 10, action: "tip_read" }),
      });
      expect(useUserStore.getState().user?.xp).toBe(60);
    });

    it("updates level on level up", async () => {
      useUserStore.setState({ user: mockUser });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ xp: 150, level: "APPRENTI" }),
      });

      await useUserStore.getState().addXp(100, "test");
      expect(useUserStore.getState().user?.level).toBe("APPRENTI");
    });
  });

  describe("reset", () => {
    it("resets user to null", () => {
      useUserStore.setState({
        user: { id: "u1" } as never,
        isLoading: true,
      });
      useUserStore.getState().reset();
      expect(useUserStore.getState().user).toBeNull();
      expect(useUserStore.getState().isLoading).toBe(false);
    });
  });
});

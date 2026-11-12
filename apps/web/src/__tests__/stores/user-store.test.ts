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
        stats: { jokesRead: 10, tipsCompleted: 5, videosWatched: 2, totalFavorites: 3, pathsCompleted: 0 },
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

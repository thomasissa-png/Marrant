import { render, screen, waitFor } from "@testing-library/react";
import { ProfilDashboard } from "@/components/profil/profil-dashboard";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

const mockFetchUser = jest.fn();
jest.mock("@/stores/user-store", () => ({
  useUserStore: jest.fn(),
}));

const { useSession } = require("next-auth/react");
const { useUserStore } = require("@/stores/user-store");

const mockUser = {
  id: "u1",
  name: "Jean",
  email: "jean@test.fr",
  plan: "FREE",
  level: "FARCEUR",
  xp: 750,
  streak: 5,
  lastActiveAt: null,
  stats: {
    jokesRead: 42,
    tipsCompleted: 15,
    videosWatched: 8,
    totalFavorites: 10,
  },
};

describe("ProfilDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ status: "authenticated" });
    useUserStore.mockReturnValue({
      user: mockUser,
      isLoading: false,
      fetchUser: mockFetchUser,
    });
  });

  it("shows lock and login button when unauthenticated", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<ProfilDashboard />);
    expect(screen.getByRole("img", { name: "cadenas" })).toBeInTheDocument();
    expect(screen.getByText("Connecte-toi pour voir ton profil")).toBeInTheDocument();
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("shows loading skeleton when loading", () => {
    useUserStore.mockReturnValue({ user: null, isLoading: true, fetchUser: mockFetchUser });
    const { container } = render(<ProfilDashboard />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("fetches user on mount when authenticated", () => {
    render(<ProfilDashboard />);
    expect(mockFetchUser).toHaveBeenCalled();
  });

  it("displays level info", () => {
    render(<ProfilDashboard />);
    expect(screen.getByText("Farceur")).toBeInTheDocument();
    expect(screen.getByText("🃏")).toBeInTheDocument();
  });

  it("displays XP", () => {
    render(<ProfilDashboard />);
    expect(screen.getByText("750 XP")).toBeInTheDocument();
  });

  it("displays streak counter", () => {
    render(<ProfilDashboard />);
    expect(screen.getByText("5 jours")).toBeInTheDocument();
  });

  it("displays statistics", () => {
    render(<ProfilDashboard />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Blagues lues")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Conseils terminés")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Vidéos vues")).toBeInTheDocument();
  });

  it("shows Gratuit badge for FREE plan", () => {
    render(<ProfilDashboard />);
    expect(screen.getByText("Gratuit")).toBeInTheDocument();
  });

  it("shows upgrade button for FREE plan", () => {
    render(<ProfilDashboard />);
    expect(screen.getByText("Passer Premium — 9,99€/mois")).toBeInTheDocument();
  });

  it("shows Premium badge for PREMIUM plan", () => {
    useUserStore.mockReturnValue({
      user: { ...mockUser, plan: "PREMIUM" },
      isLoading: false,
      fetchUser: mockFetchUser,
    });
    render(<ProfilDashboard />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });

  it("shows premium description for PREMIUM plan", () => {
    useUserStore.mockReturnValue({
      user: { ...mockUser, plan: "PREMIUM" },
      isLoading: false,
      fetchUser: mockFetchUser,
    });
    render(<ProfilDashboard />);
    expect(screen.getByText(/accès illimité et du coaching/)).toBeInTheDocument();
  });

  it("shows progress section", () => {
    render(<ProfilDashboard />);
    expect(screen.getByText("Progression")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});

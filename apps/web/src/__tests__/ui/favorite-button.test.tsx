import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteButton } from "@/components/ui/favorite-button";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

const mockAddFavorite = jest.fn();
const mockRemoveFavorite = jest.fn();
const mockIsFavorite = jest.fn();
const mockGetFavoriteId = jest.fn();

jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: () => ({
    isFavorite: mockIsFavorite,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    getFavoriteId: mockGetFavoriteId,
  }),
}));

jest.mock("@/stores/user-store", () => ({
  useUserStore: jest.fn(),
}));

jest.mock("@/components/ui/toast", () => ({
  toast: jest.fn(),
}));

// Mock PremiumModal pour éviter les dépendances (useContentStats, fetch, etc.)
jest.mock("@/components/premium/premium-modal", () => ({
  PremiumModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="premium-modal">
        <button onClick={onClose}>Fermer</button>
      </div>
    ) : null,
}));

const { useSession } = require("next-auth/react");
const { useUserStore } = require("@/stores/user-store");

describe("FavoriteButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ status: "authenticated" });
    useUserStore.mockImplementation((selector: (s: Record<string, unknown>) => unknown) =>
      selector({ user: { plan: "PREMIUM" } })
    );
    mockIsFavorite.mockReturnValue(false);
    mockGetFavoriteId.mockReturnValue(null);
  });

  it("renders button when unauthenticated (shows for everyone)", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<FavoriteButton contentType="JOKE" contentId="1" />);
    expect(screen.getByLabelText("Ajouter aux favoris")).toBeInTheDocument();
  });

  it("opens premium modal when unauthenticated user clicks", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<FavoriteButton contentType="JOKE" contentId="1" />);
    await userEvent.click(screen.getByLabelText("Ajouter aux favoris"));
    expect(screen.getByTestId("premium-modal")).toBeInTheDocument();
  });

  it("renders button for free users", () => {
    useUserStore.mockImplementation((selector: (s: Record<string, unknown>) => unknown) =>
      selector({ user: { plan: "FREE" } })
    );
    render(<FavoriteButton contentType="JOKE" contentId="1" />);
    expect(screen.getByLabelText("Ajouter aux favoris")).toBeInTheDocument();
  });

  it("opens premium modal when free user clicks favorite", async () => {
    useUserStore.mockImplementation((selector: (s: Record<string, unknown>) => unknown) =>
      selector({ user: { plan: "FREE" } })
    );
    render(<FavoriteButton contentType="JOKE" contentId="1" />);
    await userEvent.click(screen.getByLabelText("Ajouter aux favoris"));
    expect(screen.getByTestId("premium-modal")).toBeInTheDocument();
    expect(mockAddFavorite).not.toHaveBeenCalled();
  });

  it("renders button when authenticated", () => {
    render(<FavoriteButton contentType="JOKE" contentId="1" />);
    expect(screen.getByLabelText("Ajouter aux favoris")).toBeInTheDocument();
  });

  it("shows 'Retirer des favoris' when already favorite", () => {
    mockIsFavorite.mockReturnValue(true);
    mockGetFavoriteId.mockReturnValue("fav-1");
    render(<FavoriteButton contentType="JOKE" contentId="1" />);
    expect(screen.getByLabelText("Retirer des favoris")).toBeInTheDocument();
  });

  it("calls addFavorite when not a favorite", async () => {
    render(<FavoriteButton contentType="TIP" contentId="tip-1" />);
    await userEvent.click(screen.getByLabelText("Ajouter aux favoris"));
    expect(mockAddFavorite).toHaveBeenCalledWith("TIP", "tip-1");
  });

  it("calls removeFavorite when already favorite", async () => {
    mockIsFavorite.mockReturnValue(true);
    mockGetFavoriteId.mockReturnValue("fav-99");
    render(<FavoriteButton contentType="VIDEO" contentId="v1" />);
    await userEvent.click(screen.getByLabelText("Retirer des favoris"));
    expect(mockRemoveFavorite).toHaveBeenCalledWith("fav-99");
  });

  it("applies scale-110 class when favorite", () => {
    mockIsFavorite.mockReturnValue(true);
    mockGetFavoriteId.mockReturnValue("fav-1");
    render(<FavoriteButton contentType="JOKE" contentId="1" />);
    expect(screen.getByLabelText("Retirer des favoris")).toHaveClass("scale-110");
  });

  it("closes premium modal when close is clicked", async () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    render(<FavoriteButton contentType="JOKE" contentId="1" />);
    await userEvent.click(screen.getByLabelText("Ajouter aux favoris"));
    expect(screen.getByTestId("premium-modal")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Fermer"));
    expect(screen.queryByTestId("premium-modal")).not.toBeInTheDocument();
  });
});

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

const { useSession } = require("next-auth/react");

describe("FavoriteButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ status: "authenticated" });
    mockIsFavorite.mockReturnValue(false);
    mockGetFavoriteId.mockReturnValue(null);
  });

  it("returns null when unauthenticated", () => {
    useSession.mockReturnValue({ status: "unauthenticated" });
    const { container } = render(
      <FavoriteButton contentType="JOKE" contentId="1" />
    );
    expect(container.firstChild).toBeNull();
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
});

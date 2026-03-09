import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/header";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: () => ({ push: jest.fn() }),
}));

const mockSignOut = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

jest.mock("@/components/ui/search-bar", () => ({
  SearchBar: ({ className }: { className?: string }) => (
    <div data-testid="search-bar" className={className} />
  ),
}));

const { useSession } = require("next-auth/react");
const { usePathname } = require("next/navigation");

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    usePathname.mockReturnValue("/");
  });

  it("renders logo linking to home", () => {
    render(<Header />);
    expect(screen.getByText("deviensmarrant")).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    render(<Header />);
    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Blagues")).toBeInTheDocument();
    expect(screen.getByText("Conseils")).toBeInTheDocument();
    expect(screen.getByText("Parcours")).toBeInTheDocument();
    expect(screen.getByText("Vidéos")).toBeInTheDocument();
  });

  it("shows Connexion and Commencer when unauthenticated", () => {
    render(<Header />);
    expect(screen.getAllByText("Connexion").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Commencer").length).toBeGreaterThan(0);
  });

  it("shows Favoris, Profil, Déconnexion when authenticated", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Jean" } },
      status: "authenticated",
    });
    render(<Header />);
    expect(screen.getAllByText("Favoris").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Jean").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Déconnexion").length).toBeGreaterThan(0);
  });

  it("has navigation principale aria-label", () => {
    render(<Header />);
    expect(screen.getByLabelText("Navigation principale")).toBeInTheDocument();
  });

  it("has menu button with aria-label and aria-expanded", () => {
    render(<Header />);
    const menuBtn = screen.getByLabelText("Menu");
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles mobile menu on menu button click", async () => {
    render(<Header />);
    const menuBtn = screen.getByLabelText("Menu");
    await userEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByLabelText("Navigation mobile")).toBeInTheDocument();
  });

  it("has search button on mobile", () => {
    render(<Header />);
    expect(screen.getByLabelText("Rechercher")).toBeInTheDocument();
  });

  it("highlights current path in navigation", () => {
    usePathname.mockReturnValue("/blagues");
    render(<Header />);
    const blaguesLinks = screen.getAllByText("Blagues");
    const desktopLink = blaguesLinks[0];
    expect(desktopLink).toHaveClass("text-accent-primary");
  });

  it("calls signOut with callbackUrl on Déconnexion click", async () => {
    useSession.mockReturnValue({
      data: { user: { name: "Jean" } },
      status: "authenticated",
    });
    render(<Header />);
    // Click mobile menu to reveal Déconnexion
    await userEvent.click(screen.getByLabelText("Menu"));
    const disconnectButtons = screen.getAllByText("Déconnexion");
    await userEvent.click(disconnectButtons[disconnectButtons.length - 1]);
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });

  it("renders SearchBar component", () => {
    render(<Header />);
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });
});

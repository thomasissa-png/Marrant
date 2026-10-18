import { render, screen, within } from "@testing-library/react";
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
    expect(screen.getByText("deviens-marrant.fr")).toBeInTheDocument();
  });

  it("renders navigation items including Parcours", () => {
    render(<Header />);
    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Vannes")).toBeInTheDocument();
    expect(screen.getByText("Conseils")).toBeInTheDocument();
    expect(screen.getByText("Vidéos")).toBeInTheDocument();
    expect(screen.getAllByText("Parcours").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Articles").length).toBeGreaterThan(0);
  });

  it("shows Commencer CTA when unauthenticated", () => {
    render(<Header />);
    expect(screen.getAllByText("Commencer").length).toBeGreaterThan(0);
  });

  it("s15 : « Commencer » et « Connexion » sont de vrais liens (HTML serveur), retour sur la page", () => {
    usePathname.mockReturnValue("/blog/meilleures-blagues-droles-2026");
    render(<Header />);
    // Desktop + en-tête mobile (s20) : même destination.
    for (const link of screen.getAllByRole("link", { name: "Commencer" })) {
      expect(link).toHaveAttribute("href", "/register?callbackUrl=%2Fblog%2Fmeilleures-blagues-droles-2026&src=header");
    }
    // Desktop + en-tête mobile (s16) : même destination.
    for (const link of screen.getAllByRole("link", { name: "Connexion" })) {
      expect(link).toHaveAttribute("href", "/login?callbackUrl=%2Fblog%2Fmeilleures-blagues-droles-2026");
    }
  });

  it("s15 : session en cours de chargement (rendu serveur) = liens anonymes présents", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });
    render(<Header />);
    expect(screen.getAllByRole("link", { name: "Commencer" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Connexion" })).toHaveLength(2);
  });

  it("s15 : menu mobile anonyme avec les deux liens", async () => {
    render(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    // Desktop + en-tête mobile (s20) + menu.
    expect(screen.getAllByRole("link", { name: "Commencer" })).toHaveLength(3);
    // Desktop + en-tête mobile (s16) + menu.
    expect(screen.getAllByRole("link", { name: "Connexion" })).toHaveLength(3);
  });

  it("s16 reco 19 : « Connexion » dans l'en-tête mobile sans ouvrir le menu, absent si connecté", () => {
    const { unmount } = render(<Header />);
    const mobile = screen.getByRole("button", { name: "Menu" }).parentElement as HTMLElement;
    const lien = within(mobile).getByRole("link", { name: "Connexion" });
    expect(lien).toHaveAttribute("href", "/login?callbackUrl=%2F");
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
    unmount();
    useSession.mockReturnValue({ data: { user: { name: "Jean" } }, status: "authenticated" });
    render(<Header />);
    expect(screen.queryByRole("link", { name: "Connexion" })).not.toBeInTheDocument();
  });

  it("s20 : « Commencer » dans l'en-tête mobile sans ouvrir le menu, cible de 44 px, absent si connecté", () => {
    usePathname.mockReturnValue("/blog/meilleures-blagues-droles-2026");
    const { unmount } = render(<Header />);
    const mobile = screen.getByRole("button", { name: "Menu" }).parentElement as HTMLElement;
    const lien = within(mobile).getByRole("link", { name: "Commencer" });
    expect(lien).toHaveAttribute("href", "/register?callbackUrl=%2Fblog%2Fmeilleures-blagues-droles-2026&src=header");
    expect(lien.className).toContain("h-11");
    expect(mobile.className).toContain("lg:hidden");
    unmount();
    useSession.mockReturnValue({ data: { user: { name: "Jean" } }, status: "authenticated" });
    render(<Header />);
    expect(screen.queryByRole("link", { name: "Commencer" })).not.toBeInTheDocument();
  });

  it("connecté : un seul bouton « Mon compte » (menu Radix) regroupe Favoris, Mon profil et Déconnexion", async () => {
    useSession.mockReturnValue({
      data: { user: { name: "Jean" } },
      status: "authenticated",
    });
    render(<Header />);
    // Barre ordinateur : plus d'étoile, de profil ni de « Déconnexion » permanents.
    expect(screen.queryByLabelText("Favoris")).not.toBeInTheDocument();
    expect(screen.queryByText("Déconnexion")).not.toBeInTheDocument();
    const compte = screen.getByRole("button", { name: "Mon compte" });
    expect(compte).toHaveAttribute("aria-haspopup", "menu");
    // Revue s21 N3 : « Mon compte » reste un nom vocal, jamais une infobulle affichée.
    expect(compte).not.toHaveAttribute("title");
    expect(compte.className).toContain("h-11");
    // Radix ouvre le menu au clavier (Entrée), focus dans le menu.
    compte.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await screen.findByRole("menu");
    const entrees = within(menu).getAllByRole("menuitem");
    expect(entrees.map((e) => e.textContent)).toEqual(["Favoris", "Mon profil", "Déconnexion"]);
    expect(entrees[0]).toHaveAttribute("href", "/favoris");
    expect(entrees[1]).toHaveAttribute("href", "/profil");
    await userEvent.click(entrees[2]);
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });

  it("« Activer mon accès » reste dans la barre (hors menu de compte), pas pour un Premium", () => {
    useSession.mockReturnValue({ data: { user: { name: "Jean" } }, status: "authenticated" });
    const { unmount } = render(<Header />);
    expect(screen.getAllByRole("link", { name: "Activer mon accès" })).toHaveLength(1);
    unmount();
    useSession.mockReturnValue({ data: { user: { name: "Jean", plan: "PREMIUM" } }, status: "authenticated" });
    render(<Header />);
    expect(screen.queryByRole("link", { name: "Activer mon accès" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mon compte" })).toBeInTheDocument();
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

  it("menu mobile : Échap le ferme et rend le focus au bouton « Menu » (QA s21 tour 2 n1)", async () => {
    render(<Header />);
    const menuBtn = screen.getByLabelText("Menu");
    await userEvent.click(menuBtn);
    // Focus dans le menu (premier onglet), puis Échap.
    screen.getByLabelText("Navigation mobile").querySelector("a")?.focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByLabelText("Navigation mobile")).not.toBeInTheDocument();
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    expect(menuBtn).toHaveFocus();
  });

  it("recherche : champ dès 1280 px (xl, largeur fixe), loupe de 1024 à 1279 px et sur mobile", async () => {
    render(<Header />);
    const champ = screen.getByTestId("search-bar");
    expect(champ.className.split(" ")).toEqual(expect.arrayContaining(["hidden", "xl:block", "w-44", "shrink-0"]));
    expect(champ.className).not.toMatch(/(^| )lg:block|2xl:/);
    const loupes = screen.getAllByRole("button", { name: "Rechercher" });
    expect(loupes).toHaveLength(2);
    expect(loupes[0].className.split(" ")).toEqual(expect.arrayContaining(["hidden", "lg:flex", "xl:hidden"]));
    for (const loupe of loupes) {
      expect(loupe).toHaveAttribute("aria-controls", "mobile-search");
      expect(loupe).toHaveAttribute("aria-expanded", "false");
    }
    await userEvent.click(loupes[0]);
    expect(loupes[0]).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-search")?.className).toContain("xl:hidden");
  });

  it("menu mobile : hauteur maximale, défilement interne et marge de zone sûre (revue design s21 M1)", async () => {
    render(<Header />);
    await userEvent.click(screen.getByLabelText("Menu"));
    const nav = screen.getByLabelText("Navigation mobile");
    expect(nav.className.split(" ")).toEqual(
      expect.arrayContaining(["max-h-[calc(100dvh-4rem-1px)]", "overflow-y-auto", "overscroll-contain", "pb-[max(1rem,env(safe-area-inset-bottom))]"]),
    );
  });

  it("highlights current path in navigation", () => {
    usePathname.mockReturnValue("/vannes");
    render(<Header />);
    const vannesLinks = screen.getAllByText("Vannes");
    const desktopLink = vannesLinks[0];
    expect(desktopLink).toHaveClass("text-accent-link");
  });

  it("keeps the section tab active on sub-pages (s12 design)", () => {
    usePathname.mockReturnValue("/blog/comment-devenir-drole");
    render(<Header />);
    expect(screen.getAllByText("Articles")[0]).toHaveClass("text-accent-link");
    expect(screen.getAllByText("Accueil")[0]).not.toHaveClass("text-accent-link");
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

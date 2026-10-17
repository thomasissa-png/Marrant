/**
 * Intégration s21 : place de la lettre sur le site (`docs/copy/lettre-mensuelle-s21/place-sur-le-site.md`).
 * Textes validés à l'aveugle (pack `pack-relecture-place-sur-le-site.md`) : menu = duel 1 A
 * « La lettre », accueil = duel 2 A. Menu, accueil et pied de page suivent
 * `LETTRE_INSCRIPTIONS_OUVERTES` ; jamais dans la barre mobile ; aucun bouton plein
 * sur l'accueil (le bouton Premium reste la seule action principale).
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockOuvert = true;
jest.mock("@/config/lettre", () => ({
  ...jest.requireActual("@/config/lettre"),
  get LETTRE_INSCRIPTIONS_OUVERTES() {
    return mockOuvert;
  },
}));
jest.mock("next/navigation", () => ({ usePathname: jest.fn(() => "/"), useRouter: () => ({ push: jest.fn() }) }));
jest.mock("next-auth/react", () => ({ useSession: jest.fn(), signOut: jest.fn() }));
jest.mock("@/components/ui/search-bar", () => ({ SearchBar: () => <div data-testid="search-bar" /> }));

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LettreAccueil } from "@/components/home/lettre-accueil";
import { TEXTES_LETTRE } from "@/config/textes/lettre-s21";
import { NBSP } from "@/lib/fr-typo";

const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const { usePathname } = jest.requireMock("next/navigation") as { usePathname: jest.Mock };
const anonyme = { data: null, status: "unauthenticated" };
const premium = { data: { user: { email: "p@x.fr", plan: "PREMIUM" } }, status: "authenticated" };
const sansInsecables = (s: string | null | undefined) => (s ?? "").split(NBSP).join(" ").replace(/\s+/g, " ").trim();

beforeEach(() => {
  mockOuvert = true;
  useSession.mockReturnValue(anonyme);
  usePathname.mockReturnValue("/");
});

describe("Textes validés à l'aveugle, mot pour mot", () => {
  it("menu : duel 1, version A ; accueil : duel 2, version A", () => {
    expect(TEXTES_LETTRE.menu).toBe("La lettre");
    expect(sansInsecables(TEXTES_LETTRE.accueil.titre)).toBe("Une vanne décryptée, chaque mois");
    expect(sansInsecables(TEXTES_LETTRE.accueil.phrase)).toBe("Tu la reçois par e-mail, avec un exercice pour t'entraîner. Gratuit, sans compte.");
    expect(TEXTES_LETTRE.accueil.lien).toBe("Voir la lettre");
  });
});

describe("Menu", () => {
  it("dernier onglet après « Blog » dans la barre ordinateur, vers /lettre", () => {
    render(<Header />);
    const liens = within(screen.getByRole("navigation", { name: "Navigation principale" })).getAllByRole("link");
    expect(liens.map((l) => l.textContent)).toEqual(["Accueil", "Vannes", "Conseils", "Vidéos", "Parcours", "Blog", "La lettre"]);
    expect(liens[6]).toHaveAttribute("href", "/lettre");
    // Mêmes classes que les autres onglets, aucune couleur d'accent hors état actif.
    expect(liens[6].className).not.toMatch(/bg-accent|badge/);
    // Mesuré : la barre déborde entre 1024 et 1279 px avec l'onglet ; il n'y entre qu'à 1280 (xl).
    expect(liens[6].className.split(" ")).toEqual(expect.arrayContaining(["hidden", "xl:inline-flex"]));
    expect(liens[5].className).not.toMatch(/(^| )hidden( |$)/);
  });

  it("menu déroulant : après « Blog », avant le filet et « Commencer »", async () => {
    render(<Header />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const menu = screen.getByRole("navigation", { name: "Navigation mobile" });
    const textes = within(menu).getAllByRole("link").map((l) => l.textContent);
    expect(textes.indexOf("La lettre")).toBe(textes.indexOf("Blog") + 1);
    expect(textes.indexOf("La lettre")).toBeLessThan(textes.indexOf("Commencer"));
  });

  it("jamais dans la barre mobile (menu fermé : un seul lien, celui de la barre ordinateur)", () => {
    render(<Header />);
    expect(screen.getAllByRole("link", { name: "La lettre" })).toHaveLength(1);
  });

  it("actif sur /lettre et ses sous-pages", () => {
    usePathname.mockReturnValue("/lettre/confirmer");
    render(<Header />);
    expect(screen.getByRole("link", { name: "La lettre" }).className).toContain("text-accent-link");
  });

  it("interrupteur fermé ou abonné Premium : pas d'onglet", () => {
    mockOuvert = false;
    const { unmount } = render(<Header />);
    expect(screen.queryByRole("link", { name: "La lettre" })).toBeNull();
    unmount();
    mockOuvert = true;
    useSession.mockReturnValue(premium);
    render(<Header />);
    expect(screen.queryByRole("link", { name: "La lettre" })).toBeNull();
  });
});

describe("Accueil", () => {
  it("titre h2, phrase et lien texte vers /lettre ; aucun bouton, aucun formulaire", () => {
    const { container } = render(<LettreAccueil />);
    const section = container.querySelector("section[aria-labelledby='lettre-accueil']");
    expect(sansInsecables(section?.querySelector("h2#lettre-accueil")?.textContent)).toBe("Une vanne décryptée, chaque mois");
    expect(sansInsecables(section?.textContent)).toContain("Tu la reçois par e-mail, avec un exercice pour t'entraîner. Gratuit, sans compte.");
    const lien = screen.getByRole("link", { name: "Voir la lettre" });
    expect(lien).toHaveAttribute("href", "/lettre");
    expect(sansInsecables(lien.textContent)).toBe("Voir la lettre →");
    expect(lien.className).not.toMatch(/bg-accent|bg-gradient|variant/);
    expect(container.querySelector("form, input, button, [data-blog-cta]")).toBeNull();
  });

  it("interrupteur fermé ou abonné Premium : rien", () => {
    mockOuvert = false;
    expect(render(<LettreAccueil />).container.innerHTML).toBe("");
    mockOuvert = true;
    useSession.mockReturnValue(premium);
    expect(render(<LettreAccueil />).container.innerHTML).toBe("");
  });

  it("placé entre l'offre Premium (+ FAQ) et « Prochainement »", () => {
    const page = jest.requireActual<typeof import("fs")>("fs").readFileSync(require.resolve("@/app/(dashboard)/page.tsx"), "utf8");
    const i = (motif: string) => page.indexOf(motif);
    expect(i("<PremiumCta />")).toBeLessThan(i("<LettreAccueil />"));
    expect(i("<LettreAccueil />")).toBeLessThan(i("<UpcomingFeatures />"));
  });
});

describe("Pied de page", () => {
  it("lien « La lettre du mois » selon l'interrupteur", () => {
    const { unmount } = render(<Footer />);
    expect(screen.getByRole("link", { name: "La lettre du mois" })).toHaveAttribute("href", "/lettre");
    unmount();
    mockOuvert = false;
    render(<Footer />);
    expect(screen.queryByRole("link", { name: "La lettre du mois" })).toBeNull();
  });
});

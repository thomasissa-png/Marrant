/**
 * s26 : Favoris (vue de l'abonné) et Carnet, espace ouvert (`docs/ux/favoris-carnet-s26.md`,
 * `docs/design/favoris-carnet-s26.md`). Fermé : rendus d'avant (`inertie-espace` pour /favoris, `carnet-page` pour /carnet).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { act, fireEvent, render, screen, within } from "@testing-library/react";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/components/ui/reaction-buttons", () => ({ ReactionButtons: () => <div data-reactions /> }));
jest.mock("@/components/ui/youtube-player", () => ({ YouTubePlayer: () => <div data-lecteur /> }));
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return true;
  },
}));
// s26 DA, s'entraîner et favoris : le favori ouvert est dans l'adresse (`?favori=<id>`).
const adresse = { favori: null as string | null };
const routeur = { push: jest.fn(), replace: jest.fn(), back: jest.fn(), refresh: jest.fn() };
jest.mock("next/navigation", () => ({
  useRouter: () => routeur,
  usePathname: () => "/favoris",
  useSearchParams: () => new URLSearchParams(adresse.favori ? { favori: adresse.favori } : {}),
}));

import { FavorisAbonne } from "@/components/espace/favoris/favoris-abonne";
import { useFavoritesStore } from "@/stores/favorites-store";
import { CarnetPage } from "@/components/carnet/carnet-page";
import { carnetViewForPlan, parseCarnets } from "@/lib/carnet";
import { TABS } from "@/components/favoris/libelles";

const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const EMOJI = /\p{Extended_Pictographic}/u;
const vanne = (id: string, createdAt: string, punchline: string) => ({
  id,
  contentType: "JOKE" as const,
  jokeId: `j-${id}`,
  tipId: null,
  videoId: null,
  createdAt,
  joke: { content: `Début ${id}`, punchline, category: "ABSURDE" },
});
const conseil = (id: string, createdAt: string) => ({
  id,
  contentType: "TIP" as const,
  jokeId: null,
  tipId: `t-${id}`,
  videoId: null,
  createdAt,
  tip: { title: `Conseil ${id}`, content: "Contenu", category: "TIMING", difficulty: "DEBUTANT", example: "Un exemple", exercise: "Un exercice" },
});
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);

beforeEach(() => {
  adresse.favori = null;
  window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;
  Object.values(routeur).forEach((f) => f.mockReset());
  useSession.mockReturnValue({ status: "authenticated", data: { user: { id: "u", plan: "PREMIUM" } } });
  useFavoritesStore.setState({ favorites: [], isLoading: false, fetchFavorites: jest.fn(async () => {}) });
});

// s26 DA, s'entraîner et favoris (Thomas, 19/11 « pourquoi on ne garde pas le menu à gauche ? » et 20/11, DA de
// l'accueil) : liste et détail comme Quoi répondre ; remplace le rail d'onglets et la grille de cartes repliables.
describe("Favoris, abonné (s26 DA, s'entraîner et favoris)", () => {
  it("liste groupée par type (effectifs), le plus récent ouvert d'office, une seule ligne active, liens `?favori=`", () => {
    useFavoritesStore.setState({ favorites: [vanne("a", "2026-11-01T00:00:00Z", "Chute A"), conseil("c", "2026-11-05T00:00:00Z"), vanne("b", "2026-11-10T00:00:00Z", "Chute B")] });
    const { container } = render(<FavorisAbonne />);
    const liste = container.querySelector("[data-liste-favoris]") as HTMLElement;
    const groupes = [...liste.querySelectorAll("[data-groupe-favoris]")];
    expect(groupes.map((g) => [g.getAttribute("data-groupe-favoris"), g.querySelector("h3")!.textContent])).toEqual([["JOKE", "Vannes"], ["TIP", "Conseils"]]);
    expect(groupes[0].textContent).toContain("2");
    const lignes = [...liste.querySelectorAll("a[data-ligne-favori]")];
    expect(lignes.map((l) => l.getAttribute("href"))).toEqual(["/favoris?favori=b", "/favoris?favori=a", "/favoris?favori=c"]);
    expect(liste.querySelectorAll("a[aria-current='page']")).toHaveLength(1);
    expect(lignes[0]).toHaveAttribute("aria-current", "page");
    // Le détail : la vanne la plus récente, chute visible, cellule cachée sous 1024 tant qu'aucun favori n'est demandé.
    const detail = container.querySelector("[data-favori-detail='b']") as HTMLElement;
    expect(detail.textContent).toContain("Chute B");
    expect(classes(container.querySelector("[data-zone='panneau']"))).toEqual(expect.arrayContaining(["hidden", "lg:block"]));
    expect(classes(container.querySelector("[data-zone='liste']"))).toContain("block");
  });

  it("favori demandé : son détail, la liste masquée sous 1024 seulement, « Retour : Mes favoris »", () => {
    adresse.favori = "c";
    useFavoritesStore.setState({ favorites: [vanne("a", "2026-11-01T00:00:00Z", "Chute A"), conseil("c", "2026-11-05T00:00:00Z")] });
    const { container } = render(<FavorisAbonne titre="Mes favoris" />);
    expect(container.querySelector("[data-favori-detail='c']")).not.toBeNull();
    expect(container.querySelector("a[data-ligne-favori='c']")).toHaveAttribute("aria-current", "page");
    expect(classes(container.querySelector("[data-zone='liste']"))).toEqual(expect.arrayContaining(["hidden", "lg:block"]));
    expect(screen.getByRole("link", { name: /Retour/ }).textContent).toContain("Mes favoris");
  });

  it("détail à la DA de l'accueil : bandeau, émoji, pastille violette du type, blocs, aucun bouton plein", () => {
    adresse.favori = "c";
    useFavoritesStore.setState({ favorites: [conseil("c", "2026-11-05T00:00:00Z")] });
    const { container } = render(<FavorisAbonne />);
    const detail = container.querySelector("[data-favori-detail='c']") as HTMLElement;
    expect(classes(detail.firstElementChild)).toEqual(expect.arrayContaining(["h-1", "bg-gradient-to-r"]));
    expect(detail.textContent).toContain("💡");
    expect(within(detail).getByText("Conseil").className).toContain("bg-accent-primary/20");
    expect(within(detail).getByText("Exemple").className).toContain("text-accent-link");
    expect(within(detail).getByRole("button", { name: "Retirer des favoris" }).className).toContain("underline");
    expect([...container.querySelectorAll("[class]")].filter((e) => classes(e).includes("bg-accent-secondary-hover"))).toEqual([]);
  });

  it("retirer le favori ouvert : retour à la liste (`replace`)", async () => {
    adresse.favori = "c";
    const removeFavorite = jest.fn(async () => true);
    useFavoritesStore.setState({ favorites: [conseil("c", "2026-11-05T00:00:00Z"), vanne("a", "2026-11-01T00:00:00Z", "A")], removeFavorite });
    render(<FavorisAbonne />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Retirer des favoris" }));
    });
    expect(removeFavorite).toHaveBeenCalledWith("c");
    expect(routeur.replace).toHaveBeenCalledWith("/favoris", { scroll: false });
  });

  it("état vide : phrase existante, un seul bouton plein, aucun émoji", () => {
    const { container } = render(<FavorisAbonne />);
    const etat = container.querySelector("[data-favoris-etat]") as HTMLElement;
    expect(etat.textContent).toContain(TABS[0].emptyTitle);
    expect(etat.textContent).toContain(TABS[0].emptyDesc);
    expect(within(etat).getByRole("link", { name: TABS[0].ctaLabel })).toHaveAttribute("href", TABS[0].ctaHref);
    expect(EMOJI.test(container.textContent ?? "")).toBe(false);
  });

  it("aucun tiret cadratin dans les fichiers de la vue", () => {
    for (const f of ["favoris-abonne", "liste-favoris", "detail-favori", "cartes-favori"]) {
      const code = readFileSync(join(__dirname, `../../components/espace/favoris/${f}.tsx`), "utf8");
      expect([f, code.includes("—")]).toEqual([f, false]);
    }
  });
});

describe("Carnet ouvert (s26)", () => {
  const lire = (f: string): unknown => JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", f), "utf8"));
  const [precedent, courant] = parseCarnets([lire("2026-10.json"), lire("2026-11.json")]);
  const page = (plan: string | null) => render(<CarnetPage view={carnetViewForPlan(courant, plan)} months={[courant.mois, precedent.mois]} returnTo="/carnet" src="carnet" visiteur={plan === null} />);

  it("visiteur : verrouillage inchangé (fiche offerte seule en entier), « Situation 10 sur 30, offerte », aucune capitale", () => {
    const { container } = page(null);
    const offerte = courant.fiches.find((f) => f.id === "2026-11-10")!;
    expect(container.querySelectorAll("[data-carnet-fiche]")).toHaveLength(1);
    expect(container.innerHTML).toContain(offerte.pourquoi.slice(0, 20));
    for (const f of courant.fiches.filter((x) => x !== offerte)) expect(container.innerHTML).not.toContain(f.reponse);
    // s26 carnet liste et détail : « Situation n sur N » (À VALIDER), même donnée.
    expect(screen.getByText("Situation 10 sur 30, offerte")).toBeTruthy();
    expect(container.innerHTML).not.toMatch(/uppercase|tracking-wider/);
    expect(screen.getByRole("link", { name: "Connexion" })).toBeTruthy();
  });

  // s26 carnet liste et détail : la page de l'abonné ne rend plus que le panneau (n° 1), la liste est dans le layout
  // (`carnet-liste-detail-s26.test.tsx`).
  it("abonné : aucun bouton plein, une seule fiche (n° 1), « Situation suivante » en contour", () => {
    const { container } = page("PREMIUM");
    expect(container.querySelectorAll("[data-carnet-fiche]")).toHaveLength(1);
    expect(container.querySelector("[data-carnet-panneau]")?.getAttribute("data-carnet-panneau")).toBe("1");
    expect(container.querySelectorAll("a, button").length).toBeGreaterThan(0);
    for (const el of container.querySelectorAll("a, button")) expect(el.className.split(" ")).not.toContain("bg-accent-primary");
    expect(container.querySelector("[data-situation-suivante]")).toHaveAttribute("href", "/carnet/2026-11/2");
  });

  // s26 tour 3 (encarts, piste 1 du tour 2) : la zone « Connexion » de la carte d'offre descend de 14 px dans la marge
  // (air sous le texte = air au-dessus du bouton, 24 px à 1280, 16 à 375), cible de 44 px gardée ; rien de 768 à 1023.
  it("visiteur : zone « Connexion » de la carte d'offre calée sur l'air du haut, cible de 44 px", () => {
    page(null);
    const lien = screen.getByRole("link", { name: "Connexion" });
    expect(lien.className.split(" ")).toEqual(expect.arrayContaining(["min-h-11", "min-w-11"]));
    // s26 liste et détail, tour 5 : `pb-px` (même hauteur de carte que le gratuit, filet de 1 px compris), sauf de 768 à 1023.
    expect((lien.parentElement!.parentElement as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["-mb-3.5", "pb-px", "md:max-lg:mb-0", "md:max-lg:pb-0"]));
  });
});

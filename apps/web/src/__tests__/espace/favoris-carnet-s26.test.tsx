/**
 * s26 : Favoris (vue de l'abonné) et Carnet, espace ouvert (`docs/ux/favoris-carnet-s26.md`,
 * `docs/design/favoris-carnet-s26.md`). Fermé : rendus d'avant (`inertie-espace` pour /favoris, `carnet-page` pour /carnet).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { fireEvent, render, screen, within } from "@testing-library/react";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/components/ui/reaction-buttons", () => ({ ReactionButtons: () => <div data-reactions /> }));
jest.mock("@/components/ui/youtube-player", () => ({ YouTubePlayer: () => <div data-lecteur /> }));
jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return true;
  },
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

beforeEach(() => {
  useSession.mockReturnValue({ status: "authenticated", data: { user: { id: "u", plan: "PREMIUM" } } });
  useFavoritesStore.setState({ favorites: [], isLoading: false, fetchFavorites: jest.fn(async () => {}) });
});

describe("Favoris, abonné (s26)", () => {
  it("rail d'onglets (effectifs réels, actif sans aplat), flèches du clavier, carte la plus récente en tête et dépliée", () => {
    useFavoritesStore.setState({ favorites: [vanne("a", "2026-11-01T00:00:00Z", "Chute A"), vanne("b", "2026-11-10T00:00:00Z", "Chute B")] });
    const { container } = render(<FavorisAbonne />);
    const rail = container.querySelector("[data-rail-favoris]") as HTMLElement;
    const onglets = within(rail).getAllByRole("tab");
    expect(onglets.map((o) => o.textContent)).toEqual(["Tout2", "Vannes2", "Conseils0", "Vidéos0"]);
    expect(onglets[0]).toHaveAttribute("aria-selected", "true");
    for (const o of onglets) expect(o.className).not.toMatch(/bg-accent|bg-primary/);
    expect(onglets[0].className.split(" ")).toEqual(expect.arrayContaining(["border-l-2", "border-text-primary"]));
    // La plus récente (b) en tête, chute visible ; l'autre repliée.
    const cartes = container.querySelectorAll("[data-favori]");
    expect(cartes[0].textContent).toContain("Chute B");
    expect(cartes[1].textContent).not.toContain("Chute A");
    // Actions en liens gris, jamais de bouton plein.
    expect(within(cartes[0] as HTMLElement).getByRole("button", { name: "Retirer des favoris" }).className).toContain("underline");
    fireEvent.keyDown(onglets[0], { key: "ArrowDown" });
    expect(within(rail).getAllByRole("tab")[1]).toHaveAttribute("aria-selected", "true");
  });

  it("état vide par onglet : phrase existante, un seul bouton plein, aucun émoji", () => {
    const { container } = render(<FavorisAbonne />);
    const etat = container.querySelector("[data-favoris-etat]") as HTMLElement;
    expect(etat.textContent).toContain(TABS[0].emptyTitle);
    expect(etat.textContent).toContain(TABS[0].emptyDesc);
    expect(within(etat).getByRole("link", { name: TABS[0].ctaLabel })).toHaveAttribute("href", TABS[0].ctaHref);
    expect(EMOJI.test(container.textContent ?? "")).toBe(false);
  });

  it("aucune capitale ni émoji dans les fichiers de la vue (constantes de `typo.ts`)", () => {
    for (const f of ["favoris-abonne", "cartes-abonne", "cartes-favori", "onglets-favoris"]) {
      const code = readFileSync(join(__dirname, `../../components/espace/favoris/${f}.tsx`), "utf8");
      expect([f, /uppercase|tracking-|text-xs|font-bold/.test(code), EMOJI.test(code), code.includes("—")]).toEqual([f, false, false, false]);
    }
  });
});

describe("Carnet ouvert (s26)", () => {
  const lire = (f: string): unknown => JSON.parse(readFileSync(join(__dirname, "..", "..", "data", "carnet", f), "utf8"));
  const [precedent, courant] = parseCarnets([lire("2026-10.json"), lire("2026-11.json")]);
  const page = (plan: string | null) => render(<CarnetPage view={carnetViewForPlan(courant, plan)} months={[courant.mois, precedent.mois]} returnTo="/carnet" src="carnet" visiteur={plan === null} />);

  it("visiteur : verrouillage inchangé (fiche offerte seule en entier), « Situation 10, offerte », aucune capitale", () => {
    const { container } = page(null);
    const offerte = courant.fiches.find((f) => f.id === "2026-11-10")!;
    expect(container.querySelectorAll("[data-carnet-fiche]")).toHaveLength(1);
    expect(container.innerHTML).toContain(offerte.pourquoi.slice(0, 20));
    for (const f of courant.fiches.filter((x) => x !== offerte)) expect(container.innerHTML).not.toContain(f.reponse);
    expect(screen.getByText("Situation 10, offerte")).toBeTruthy();
    expect(container.innerHTML).not.toMatch(/uppercase|tracking-wider/);
    expect(screen.getByRole("link", { name: "Connexion" })).toBeTruthy();
  });

  it("abonné : aucun bouton plein, rail des fiches, « Retour au sommaire » après chaque fiche", () => {
    const { container } = page("PREMIUM");
    expect(container.innerHTML).not.toMatch(/bg-accent-primary|bg-accent-secondary|uppercase/);
    expect(container.querySelectorAll("[data-carnet-rail] a")).toHaveLength(30);
    expect(container.querySelectorAll("[data-carnet-retour-sommaire]")).toHaveLength(30);
    expect(container.querySelector('[data-carnet-rail] a[aria-current="location"]')).not.toBeNull();
  });
});

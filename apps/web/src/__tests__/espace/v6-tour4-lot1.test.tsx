/**
 * Navigation v6, tour 4, lot 1 (espace) : `docs/espace-client/travail-en-cours/plan-corrections-v6-tour-4.md`,
 * points 1 (S’entraîner, colonne centrée), 6 (favoris : « Explorer les vannes » à 44 px dès 768) et 7 (favoris : plus de
 * vanne creusée, plus de carte orpheline). Rendu ouvert seulement : fermé, /mon-espace est la 404 et `/favoris` garde
 * ses classes d'avant (contrôlé ici et par `inertie-espace.test.tsx`).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({
  ...jest.requireActual("@/config/espace-client"),
  get ESPACE_CLIENT_PUBLIE() {
    return (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ === true;
  },
}));
jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/stores/favorites-store", () => ({ useFavoritesStore: jest.fn() }));
jest.mock("@/stores/user-store", () => ({ useUserStore: jest.fn() }));

import carnetNovembre from "@/data/carnet/2026-11.json";
import situationPoele from "@/lib/espace/fixtures/situation-coloc-la-poele.json";
import { parseCarnets } from "@/lib/carnet";
import { ficheSchema, type Fiche } from "@/lib/espace/fiches-schema";
import { cartesDesSituations, cartesDuCarnet } from "@/lib/espace/rafale";
import { CarteEtToi } from "@/components/espace/carte/carte-et-toi";
import { CarteRegistre } from "@/components/espace/carte/carte-registre";
import { cadreCarte } from "@/components/espace/carte/carte-registre";
import { FavorisList } from "@/components/favoris/favoris-list";

const { useSession } = jest.requireMock("next-auth/react");
const { useFavoritesStore } = jest.requireMock("@/stores/favorites-store");
const { useUserStore } = jest.requireMock("@/stores/user-store");

const SRC = join(__dirname, "../..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
const ouvrir = (oui: boolean) => {
  (globalThis as { __ESPACE_OUVERT__?: boolean }).__ESPACE_OUVERT__ = oui;
};
afterEach(() => ouvrir(false));

const fiche1129 = parseCarnets([carnetNovembre])[0].fiches.find((f) => f.id === "2026-11-29")!;
const carteEtToi = cartesDuCarnet([fiche1129])[0];
const carteRegistre = cartesDesSituations([ficheSchema.parse(situationPoele) as Extract<Fiche, { type: "situation" }>])[0];

/** Classes qui étirent une carte, creusent un vide ou la coupent en colonnes : interdites dans les cartes (tour 4). */
const ETIREMENT = /^(?:[a-z0-9]+:)*(flex-1|h-full|mt-auto|contents|grid-rows-subgrid|grid-cols-2|row-span-\d|col-span-2)$/;
const etirements = (el: Element) => [el, ...el.querySelectorAll("*")].flatMap(classes).filter((c) => ETIREMENT.test(c));

// s26 (`docs/design/rubriques-abonne-s26.md` §2, retour de Thomas : plus de colonne centrée seule) : la colonne du tour 4
// devient la grille 7/5 ; une disposition par carte reste (blocs empilés, rien d'étiré), cadre selon la place.
describe("point 1 : S'entraîner, une disposition par carte (arbitrage 1 ; colonne remplacée par la grille 7/5 en s26)", () => {
  it("« Quel registre ? » : cadre de la carte à faire (`cadreCarte(\"action\")`), blocs dans l'ordre (en-tête, scène, contexte, « Ta réponse d'abord », réponses), rien d'étiré", () => {
    const { container } = render(<CarteRegistre carte={carteRegistre} nouvelle ancre="carte-2" />);
    const article = container.querySelector("article")!;
    expect(article.className).toBe(cadreCarte("action"));
    expect(etirements(article)).toEqual([]);
    const texte = article.textContent ?? "";
    const ordre = [carteRegistre.titre, carteRegistre.scene.texte, carteRegistre.contexte].map((t) => texte.indexOf(t.slice(0, 15)));
    expect(ordre.every((n, i) => n >= 0 && (i === 0 || n > ordre[i - 1]))).toBe(true);
    const h3 = [...article.querySelectorAll("h3")].map((h) => h.textContent);
    expect(h3.length).toBeGreaterThanOrEqual(2);
    expect(article.querySelectorAll("button").length).toBeGreaterThanOrEqual(3);
  });

  it("« Et toi ? » : cadre selon la place, rien d'étiré", () => {
    const { container } = render(<CarteEtToi carte={carteEtToi} nouvelle ancre="carte-1" cadre="repliee" />);
    const article = container.querySelector("article")!;
    expect(article.className).toBe(cadreCarte("repliee"));
    expect(etirements(article)).toEqual([]);
  });

  // s26 DA, s'entraîner et favoris : cadre en paramètre, `CADRE_CARTE_ENTRAINER` (DA de l'accueil) par défaut ; la page
  // passe un filet (mission sous l'échelle, dans la même carte).
  it("mission : un cadre seul (`cadre`, DA par défaut), plus de colonnes internes", () => {
    const source = lire("components/espace/mission/mission-carte.tsx");
    expect(source).toContain('className={cn(cadre, "min-w-0 space-y-4 p-6 [overflow-wrap:anywhere]")} data-mission={mission.id}');
    expect(source).toContain("cadre = CADRE_CARTE_ENTRAINER");
    expect(source).not.toMatch(/lg:grid|md:contents|flex-1|mt-auto/);
  });

  it("page : plus de colonne centrée, ni de place seule ou jumelle", () => {
    const page = lire("app/(dashboard)/mon-espace/s-entrainer/page.tsx");
    expect(page).not.toMatch(/COLONNE_ENTRAINEMENT|mx-auto max-w-3xl/);
    expect(page).not.toMatch(/md:grid-cols-2|md:col-span-2|md:contents|items-stretch|"seule"|jumelle|place=/);
    const styles = lire("components/espace/carte/styles.ts");
    expect(styles).not.toMatch(/cadreEntrainement|texteEntrainement|actionsEntrainement|SAUT_CONTEXTE|PlaceEntrainement/);
  });
});

// ---------------------------------------------------------------- Favoris (points 6 et 7)
const vanne = (id: string) => ({
  id,
  contentType: "JOKE",
  jokeId: `j-${id}`,
  createdAt: "2026-11-01",
  joke: { content: `Vanne ${id}`, punchline: "La chute", category: "AUTODERISION", type: "ONE_LINER" },
  tip: null,
  video: null,
});
const conseil = (id: string) => ({
  id,
  contentType: "TIP",
  tipId: `t-${id}`,
  createdAt: "2026-11-02",
  joke: null,
  tip: { title: `Conseil ${id}`, content: "Le contenu du conseil, assez long pour être tronqué.", category: "TIMING", difficulty: "DEBUTANT", example: "Exemple", exercise: "Défi" },
  video: null,
});
const video = (id: string) => ({
  id,
  contentType: "VIDEO",
  videoId: `v-${id}`,
  createdAt: "2026-11-03",
  joke: null,
  tip: null,
  video: { youtubeId: "abc123", title: "Vidéo", channelName: "Chaîne", category: "TIMING", difficulty: "DEBUTANT", description: "Desc", technique: "Callback", learnings: [], exercise: null },
});

function rendreFavoris(favorites: unknown[]) {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ liked: false, disliked: false, likes: 0, dislikes: 0 }) });
  useSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "PREMIUM" } } });
  useUserStore.mockImplementation((sel: (s: unknown) => unknown) => sel({ user: { plan: "PREMIUM" } }));
  useFavoritesStore.mockReturnValue({ favorites, isLoading: false, fetchFavorites: jest.fn(), removeFavorite: jest.fn() });
  return render(<FavorisList />);
}
/** Cartes de la grille des favoris, dans l'ordre. */
const cartesFavoris = (container: HTMLElement) => [...(container.querySelector("div.grid")?.children ?? [])];
const spans = (el: Element) => classes(el).filter((c) => /^(md|lg):col-span-\d$/.test(c));

describe("point 7 : Favoris, aucune carte orpheline (ouvert)", () => {
  it("grille de 6 colonnes dès `lg`, mêmes hauteurs par rangée ; vidéo sur toute la rangée", () => {
    ouvrir(true);
    const { container } = rendreFavoris([vanne("a"), conseil("b"), vanne("c"), video("d")]);
    expect(classes(container.querySelector("div.grid"))).toEqual(expect.arrayContaining(["items-stretch", "md:grid-cols-2", "lg:grid-cols-6", "md:grid-flow-row-dense"]));
    const cartes = cartesFavoris(container);
    // 3 cartes courtes : 3 par rangée dès `lg` ; à 768 la 3e (impaire) prend la rangée.
    expect(cartes.slice(0, 3).map(spans)).toEqual([["lg:col-span-2"], ["lg:col-span-2"], ["md:col-span-2", "lg:col-span-2"]]);
    expect(spans(cartes[3])).toEqual(["md:col-span-2", "lg:col-span-6"]);
  });

  it.each([
    [1, [["md:col-span-2", "lg:col-span-6"]]],
    [2, [["lg:col-span-3"], ["lg:col-span-3"]]],
    [4, [["lg:col-span-3"], ["lg:col-span-3"], ["lg:col-span-3"], ["lg:col-span-3"]]],
    [5, [["lg:col-span-2"], ["lg:col-span-2"], ["lg:col-span-2"], ["lg:col-span-3"], ["md:col-span-2", "lg:col-span-3"]]],
    [6, Array.from({ length: 6 }, () => ["lg:col-span-2"])],
    [7, [...Array.from({ length: 3 }, () => ["lg:col-span-2"]), ["lg:col-span-3"], ["lg:col-span-3"], ["lg:col-span-3"], ["md:col-span-2", "lg:col-span-3"]]],
  ])("%i cartes courtes : chaque rangée pleine à 768 et dès 1 024 px", (n, attendu) => {
    ouvrir(true);
    const { container } = rendreFavoris(Array.from({ length: n }, (_, i) => vanne(`v${i}`)));
    const cartes = cartesFavoris(container);
    expect(cartes.map(spans)).toEqual(attendu);
    // Somme des colonnes : multiple de 6 dès `lg`, de 2 à 768.
    const lg = cartes.reduce((s, c) => s + Number(spans(c).find((x) => x.startsWith("lg:"))!.slice(-1)), 0);
    const md = cartes.reduce((s, c) => s + (spans(c).includes("md:col-span-2") ? 2 : 1), 0);
    expect(lg % 6).toBe(0);
    expect(md % 2).toBe(0);
  });

  it("conseil replié tronqué à 2 lignes ; déplié, le texte entier", () => {
    ouvrir(true);
    rendreFavoris([vanne("a"), conseil("b")]);
    const texte = screen.getByText("Le contenu du conseil, assez long pour être tronqué.");
    expect(classes(texte)).toContain("line-clamp-2");
    fireEvent.click(screen.getByText("Conseil b"));
    expect(classes(screen.getByText("Le contenu du conseil, assez long pour être tronqué."))).not.toContain("line-clamp-2");
  });

  it("fermé : la grille d'avant, aucune largeur nouvelle, conseil non tronqué", () => {
    const { container } = rendreFavoris([vanne("a"), conseil("b"), vanne("c")]);
    expect(container.querySelector("div.grid")?.getAttribute("class")).toBe("grid gap-4 md:grid-flow-row-dense md:grid-cols-2");
    expect(container.innerHTML).not.toMatch(/lg:col-span|line-clamp-2|lg:grid-cols-6/);
    expect(spans(cartesFavoris(container)[2])).toEqual(["md:col-span-2"]);
  });
});

describe("point 6 : « Explorer les vannes » en cible de 44 px dès 768 (ouvert seulement)", () => {
  it("ouvert : `md:h-11` (le `size=\"sm\"` fait 32 px dès 768) ; fermé : les classes d'avant", () => {
    ouvrir(true);
    const { unmount } = rendreFavoris([]);
    expect(classes(screen.getByRole("button", { name: "Explorer les vannes" }))).toEqual(expect.arrayContaining(["max-md:h-11", "md:h-11"]));
    unmount();
    ouvrir(false);
    rendreFavoris([]);
    expect(classes(screen.getByRole("button", { name: "Explorer les vannes" }))).not.toContain("md:h-11");
  });
});

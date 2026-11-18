/**
 * s26, vue ABONNÉ de « Quoi répondre », « Bibliothèque » et « S'entraîner » (`docs/ux/rubriques-premium-s26.md` §1.2,
 * §2.2, §3.2 ; `docs/design/rubriques-abonne-s26.md`) : prochaine action et progression de chaque page, à partir des
 * seules données déjà lues (« Fait » `idsFaits`, rafale `lireRafale`, retours `lireRetoursMission`). Rendu ouvert
 * seulement (fermé : 404, `inertie-espace.test.tsx`). Mesures en vrai navigateur (tailles, aplat, captures) : @qa.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { act, fireEvent, render, screen, within } from "@testing-library/react";

jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
jest.mock("@/lib/espace/garde", () => ({ garderEspace: async () => ({ userId: "u1" }), lireAccesEspace: async () => ({ acces: "ouvert", userId: "u1" }) }));
const faits = { ids: new Set<string>() };
jest.mock("@/lib/prisma", () => ({
  prisma: {
    ficheFait: {
      findMany: async ({ where }: { where: { ficheId: { in: string[] } } }) => where.ficheId.in.filter((id) => faits.ids.has(id)).map((ficheId) => ({ ficheId })),
    },
  },
}));
jest.mock("@/lib/espace/lettres", () => ({ ...jest.requireActual("@/lib/espace/lettres"), envoyeesSiBesoin: async () => new Map() }));
jest.mock("@/lib/espace/caps-serveur", () => ({ lireCapDeblocage: async () => 1 }));
jest.mock("next/headers", () => ({ headers: () => ({ get: () => null }), cookies: () => ({ get: () => undefined }) }));
const rafale = jest.fn();
jest.mock("@/lib/espace/cartes-serveur", () => ({ lireRafale: (...a: unknown[]) => rafale(...a) }));
const retours = jest.fn();
jest.mock("@/lib/espace/missions-serveur", () => ({ lireRetoursMission: (...a: unknown[]) => retours(...a) }));
const appel = jest.fn();
jest.mock("@/components/espace/carte/appel", () => ({ appelEspace: (...a: unknown[]) => appel(...a) }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }), usePathname: () => "/mon-espace" }));

import situationPoele from "@/lib/espace/fixtures/situation-coloc-la-poele.json";
import { ficheSchema, type Fiche } from "@/lib/espace/fiches-schema";
import { cartesDesSituations, segmentsRafale } from "@/lib/espace/rafale";
import { marchesReussies, missionsServiesValidees } from "@/lib/espace/missions";
import { filtrerSituations, premiereSansFait } from "@/lib/espace/quoi-repondre";
import { chargeursFiches } from "@/lib/espace/fiches";
import QuoiRepondrePage from "@/app/(dashboard)/mon-espace/quoi-repondre/page";
import BibliothequePage from "@/app/(dashboard)/mon-espace/bibliotheque/page";
import SEntrainerPage from "@/app/(dashboard)/mon-espace/s-entrainer/page";
import { ApercuBibliotheque } from "@/components/espace/apercu/apercu-bibliotheque";
import { ApercuSEntrainer } from "@/components/espace/apercu/apercu-s-entrainer";
import { CarteRepliee } from "@/components/espace/carte/carte-repliee";
import { MissionCarte } from "@/components/espace/mission/mission-carte";
import { CADRE_CARTE_NEUTRE, CADRE_CARTE_RUBRIQUE } from "@/components/espace/carte/styles";
import { FILET_PROCHAINE } from "@/components/espace/liste-fiches";
import { TEXTES_FICHE_LIGNE as L } from "@/config/textes/espace-bibliotheque";
import { TEXTES_GESTE as G, TEXTES_MISSION as M } from "@/config/textes/espace-cartes";
import { frEspace } from "@/lib/fr-typo";

const SRC = join(__dirname, "../..");
const lire = (f: string) => readFileSync(join(SRC, f), "utf8");
const classes = (el: Element | null | undefined) => (el?.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
/** Éléments à fond violet plein (le bouton `primary`) : un seul par écran au plus. */
const aplats = (racine: ParentNode) => [...racine.querySelectorAll("[class]")].filter((e) => classes(e).includes("bg-accent-secondary-hover"));
const acces = { acces: "ouvert" as const, userId: "u1" };

beforeEach(() => {
  faits.ids = new Set();
  rafale.mockReset();
  retours.mockReset();
  appel.mockReset();
});

describe("le filet violet des cartes : une seule constante (arbitrage à confirmer par Thomas)", () => {
  it("`CADRE_CARTE_RUBRIQUE` vaut le cadre neutre aujourd'hui, et sert aux trois pages", () => {
    expect(CADRE_CARTE_RUBRIQUE).toBe(CADRE_CARTE_NEUTRE);
    for (const f of ["app/(dashboard)/mon-espace/quoi-repondre/page.tsx", "components/espace/bloc-bibliotheque.tsx", "components/espace/carte/carte-repliee.tsx", "components/espace/mission/mission-carte.tsx"]) {
      expect(lire(f)).toContain("CADRE_CARTE_RUBRIQUE");
    }
  });
});

describe("« Quoi répondre » abonné : prochaine action et progression", () => {
  const situations = () => chargeursFiches.listerFiches("situation", acces);

  it("grille 3/9 : rail de filtres (3), action puis liste (9), plus d'en-tête centré", async () => {
    const { container } = render(await QuoiRepondrePage({ searchParams: {} }));
    const rail = container.querySelector("[data-zone='filtres']")!;
    expect(classes(rail)).toEqual(expect.arrayContaining(["lg:col-span-3", "lg:col-start-1", "lg:row-span-2"]));
    expect(classes(container.querySelector("[data-prochaine-action]"))).toEqual(expect.arrayContaining(["lg:col-span-9", "lg:col-start-4", "lg:row-start-1"]));
    expect(classes(container.querySelector("[data-etat='liste']"))).toEqual(expect.arrayContaining(["lg:col-span-9", "lg:row-start-2"]));
    expect(container.querySelector("[data-carnet]")).toHaveAttribute("href", "/carnet");
  });

  it("s26 tour 3 (Q1, Q2) : « Voir » suit le titre (plus de `lg:justify-between`) ; rail collant seulement s'il tient", async () => {
    const { container } = render(await QuoiRepondrePage({ searchParams: {} }));
    const tuile = classes(container.querySelector("[data-prochaine-action]"));
    expect(tuile).toEqual(expect.arrayContaining(["lg:flex-row", "lg:items-center", "lg:gap-6"]));
    expect(tuile).not.toContain("lg:justify-between");
    // Rail mesuré : 922 px dès 1280, 1082 à 1024 ; collé à 96 px, son bas tombe à 1018 (1280) et 1178 (1024).
    const rail = classes(container.querySelector("[data-zone='filtres']"));
    expect(rail).toEqual(
      expect.arrayContaining([
        "lg:[@media(min-height:74rem)]:sticky",
        "lg:[@media(min-height:74rem)]:top-24",
        "xl:[@media(min-height:64rem)]:sticky",
        "xl:[@media(min-height:64rem)]:top-24",
      ]),
    );
    expect(rail.join(" ")).not.toContain("56rem");
  });

  it("prochaine action : la première situation sans « Fait » dans l'ordre de la liste, « Voir » seul aplat", async () => {
    const liste = situations();
    faits.ids = new Set([liste[0].id]);
    const { container } = render(await QuoiRepondrePage({ searchParams: {} }));
    const ordre = [...container.querySelectorAll("[data-etat='liste'] a[data-fiche]")].map((a) => a.getAttribute("data-fiche")!);
    const attendue = ordre.find((id) => !faits.ids.has(id))!;
    const tuile = container.querySelector("[data-prochaine-action]") as HTMLElement;
    expect(tuile.getAttribute("data-prochaine-action")).toBe(attendue);
    const voir = within(tuile).getByRole("link", { name: L.voir });
    expect(voir.getAttribute("href")).toBe(container.querySelector(`a[data-fiche='${attendue}']`)!.getAttribute("href"));
    expect(aplats(container)).toEqual([voir]);
    expect(tuile.textContent).toContain(frEspace(L.minutes(liste.find((f) => f.id === attendue)!.dureeMinutes)));
  });

  it("chaque lieu : « faits/total » et sa barre ; tout fait : plus de tuile d'action, la liste reste", async () => {
    const liste = situations();
    faits.ids = new Set(liste.filter((f) => f.univers === "coloc").map((f) => f.id));
    const { container } = render(await QuoiRepondrePage({ searchParams: { ou: "coloc" } }));
    const lieu = container.querySelector("[data-lieu='coloc']")!;
    const n = faits.ids.size;
    expect(lieu.querySelector("[data-compte-faits]")!.textContent).toBe(`${n}/${n}`);
    expect((lieu.querySelector("[data-barre-etapes] > span") as HTMLElement).style.width).toBe("100%");
    expect(container.querySelector("[data-prochaine-action]")).toBeNull();
    expect(aplats(container)).toEqual([]);
    expect(lieu.querySelectorAll("[data-fait]")).toHaveLength(n);
  });

  it("filtre sans résultat : l'état vide existant (`vide`, `raconte`), pas de tuile d'action, pas d'aplat", async () => {
    const filtres = { ou: "coloc", pour: "rattraper-faux-pas" } as const;
    // Croisement vide dans le catalogue servi (« Quand ça tombe à plat » n'a pas de lieu) : vérifié, pas supposé.
    expect(filtrerSituations([...situations(), ...chargeursFiches.listerFiches("a-plat", acces)], filtres)).toEqual([]);
    const { container } = render(await QuoiRepondrePage({ searchParams: filtres }));
    expect(screen.getByTestId("quoi-repondre-vide")).toBeInTheDocument();
    expect(screen.getByTestId("quoi-repondre-vide").querySelector("a")).toHaveAttribute("href", "/mon-espace/questions");
    expect(container.querySelector("[data-prochaine-action]")).toBeNull();
    expect(aplats(container)).toEqual([]);
  });

  it("`premiereSansFait` : ordre donné, null si tout est fait", () => {
    const f = [{ id: "a" }, { id: "b" }, { id: "c" }];
    expect(premiereSansFait(f, new Set(["a"]))).toEqual({ id: "b" });
    expect(premiereSansFait(f, new Set(["a", "b", "c"]))).toBeNull();
  });
});

describe("« Bibliothèque » abonné : prochaine ligne et progression par bloc", () => {
  // s26 tour 2 : `lg:columns-3` remplacé par une grille explicite à 3 colonnes dès 1024 (540 à 800 px vides sous deux
  // colonnes) ; 375 et 768 inchangés (1 colonne, puis colonnes CSS).
  it("1/2/3 colonnes (`md:columns-2`, grille `lg:grid-cols-3`), en-tête à gauche, aucun aplat", async () => {
    const { container } = render(await BibliothequePage());
    const grille = classes(container.querySelector("[data-bibliotheque-grille]"));
    expect(grille).toEqual(expect.arrayContaining(["md:columns-2", "lg:grid", "lg:grid-cols-3", "lg:items-start"]));
    expect(grille).not.toContain("lg:columns-3");
    expect(container.querySelector("h1")!.className).not.toContain("text-center");
    expect(aplats(container)).toEqual([]);
  });

  it("s26 tour 3 (B2) : construction puis coin (col. 1), vannes puis vocabulaire (col. 2), formules (col. 3) ; construction en tête à 375", async () => {
    const { container } = render(await BibliothequePage());
    const place = (sel: string) => classes(container.querySelector(sel)).filter((c) => /^lg:(col|row)-/.test(c)).sort();
    expect(container.querySelector("[data-coin]")).not.toBeNull();
    expect(classes(container.querySelector("[data-bibliotheque-grille]"))).toEqual(expect.arrayContaining(["max-md:flex", "max-md:flex-col", "max-md:[&>*]:mb-0", "lg:grid-rows-[auto_auto_1fr]"]));
    expect(place("[data-bloc='groupe-construction']")).toEqual(["lg:col-start-1", "lg:row-span-2", "lg:row-start-1"]);
    expect(place("[data-coin]")).toEqual(["lg:col-start-1", "lg:row-start-3"]);
    expect(place("[data-bloc='bloc-vannes']")).toEqual(["lg:col-start-2", "lg:row-start-1"]);
    expect(place("[data-bloc='groupe-vocabulaire']")).toEqual(["lg:col-start-2", "lg:row-span-2", "lg:row-start-2"]);
    expect(place("[data-bloc='groupe-formule']")).toEqual(["lg:col-start-3", "lg:row-span-3", "lg:row-start-1"]);
    // Ordre du DOM inchangé (768 en colonnes CSS identique) ; la construction passe en tête sous 768 par `order`.
    expect(classes(container.querySelector("[data-bloc='groupe-construction']"))).toContain("max-md:order-first");
    const ordre = [...container.querySelectorAll("[data-bibliotheque-grille] > *")].map((e) => e.getAttribute("data-bloc") ?? "coin");
    expect(ordre).toEqual(["bloc-vannes", "coin", "groupe-construction", "groupe-vocabulaire", "groupe-formule"]);
  });

  it("chaque bloc à lignes : « faits/total », et la première ligne sans « Fait » marquée (filet, texte fort), une seule", async () => {
    const construction = chargeursFiches.listerFiches("construction", acces);
    expect(construction.length).toBeGreaterThan(1);
    faits.ids = new Set([construction[0].id]);
    const { container } = render(await BibliothequePage());
    const blocs = [...container.querySelectorAll("section[data-bloc]")].filter((b) => b.querySelector("a[data-fiche]"));
    expect(blocs.length).toBeGreaterThan(0);
    for (const bloc of blocs) {
      const lignes = [...bloc.querySelectorAll("a[data-fiche]")];
      const faites = lignes.filter((a) => a.querySelector("[data-fait]"));
      expect(bloc.querySelector("[data-compte-faits]")!.textContent).toBe(`${faites.length}/${lignes.length}`);
      const marquees = lignes.filter((a) => a.hasAttribute("data-prochaine"));
      const attendue = lignes.find((a) => !a.querySelector("[data-fait]"));
      expect(marquees).toEqual(attendue ? [attendue] : []);
      if (attendue) for (const c of FILET_PROCHAINE.split(" ")) expect(classes(attendue)).toContain(c);
    }
    const bloc = container.querySelector("section[data-bloc='groupe-construction']")!;
    expect(bloc.querySelector(`a[data-fiche='${construction[0].id}'] [data-fait]`)!.textContent).toContain(G.fait);
    expect(bloc.querySelector("a[data-prochaine]")!.getAttribute("data-fiche")).toBe(construction[1].id);
  });
});

describe("« S'entraîner » abonné : prochaine action et progression", () => {
  const cartes = cartesDesSituations([ficheSchema.parse(situationPoele) as Extract<Fiche, { type: "situation" }>]);
  const catalogue = new Map(cartes.map((c) => [c.id, c]));
  const COMPTE = { visible: false, durees: [], proposition: null };
  const missions = missionsServiesValidees();
  const m1 = missions.find((m) => m.marche === 1)!;

  it("`segmentsRafale` : faites puis à faire, au plus 3 ; rien servi, aucun segment", () => {
    expect(segmentsRafale({ faites: ["x"], cartes: [{ carteId: "a", nouvelle: true }, { carteId: "b", nouvelle: true }] })).toEqual({ faites: 1, total: 3 });
    expect(segmentsRafale({ faites: ["x", "y", "z", "w"], cartes: [] })).toEqual({ faites: 3, total: 3 });
    expect(segmentsRafale({ faites: [], cartes: [] })).toEqual({ faites: 0, total: 0 });
  });

  it("`marchesReussies` : seulement « Essayé, ça a marché »", () => {
    const r = marchesReussies([
      { missionId: "a", marche: 1, retour: "essaye-ca-a-marche" },
      { missionId: "b", marche: 2, retour: "essaye-bof" },
      { missionId: "c", marche: 3, retour: "pas-essaye" },
    ]);
    expect([...r]).toEqual([1]);
  });

  it("grille 7/5 sans sticky ; segments 1/3 ; première carte dépliée (zone d'action), la suivante repliée, aucun aplat", async () => {
    rafale.mockResolvedValue({ cartes: cartes.map((c) => ({ carteId: c.id, nouvelle: true })), faites: ["deja.c1"], fini: false, catalogue, cetteSemaine: 1, compteARebours: COMPTE });
    retours.mockResolvedValue([]);
    const { container } = render(await SEntrainerPage({ searchParams: {} }));
    expect(classes(container.querySelector("[data-zone='cartes']"))).toContain("lg:col-span-7");
    expect(classes(container.querySelector("[data-zone='mission']"))).toContain("lg:col-span-5");
    expect(container.innerHTML).not.toMatch(/sticky|mx-auto max-w-3xl/);
    const segments = container.querySelector("[data-segments-rafale]")!;
    expect(segments.getAttribute("data-segments-rafale")).toBe("1/3");
    expect([...segments.children].map((s) => classes(s).includes("bg-text-secondary"))).toEqual([true, false, false]);
    // s26 tour 2 : segments pleine largeur sous l'en-tête, hors des colonnes (les deux colonnes partent à la même ligne).
    expect(segments.closest("[data-entrainement-grille]")).toBeNull();
    const premiere = container.querySelector("#carte-1")!;
    expect(premiere.getAttribute("data-cadre")).toBe("action");
    expect(premiere.closest("details")).toBeNull();
    const repliee = container.querySelector("details[data-carte-repliee='carte-2']") as HTMLDetailsElement;
    expect(repliee.open).toBe(false);
    expect(repliee.querySelector("#carte-2")!.getAttribute("data-cadre")).toBe("repliee");
    expect(repliee.querySelector("summary")!.textContent).toBe(frEspace(cartes[1].titre));
    // Écart signalé : la carte n'a pas de bouton principal unique (« Oui / À moitié / Rien », même poids, 2.2).
    expect(aplats(container)).toEqual([]);
  });

  it("s26 tour 3 (S2) : aucune carte faite aujourd'hui, aucun segment (rail gris qui ne dit rien), même à 2 cartes", async () => {
    rafale.mockResolvedValue({ cartes: cartes.slice(0, 2).map((c) => ({ carteId: c.id, nouvelle: true })), faites: [], fini: false, catalogue, cetteSemaine: 0, compteARebours: COMPTE });
    retours.mockResolvedValue([]);
    expect(cartes.length).toBeGreaterThanOrEqual(2);
    const { container } = render(await SEntrainerPage({ searchParams: {} }));
    expect(container.querySelector("#carte-2")).not.toBeNull();
    expect(container.querySelector("[data-segments-rafale]")).toBeNull();
    expect(classes(container.querySelector("[data-entrainement-grille]"))).toContain("mt-8");
  });

  it("s26 tour 2 : une seule carte au total, aucun segment (un trait seul ne dit rien)", async () => {
    rafale.mockResolvedValue({ cartes: [{ carteId: cartes[0].id, nouvelle: true }], faites: [], fini: false, catalogue, cetteSemaine: 0, compteARebours: COMPTE });
    retours.mockResolvedValue([]);
    const { container } = render(await SEntrainerPage({ searchParams: {} }));
    expect(container.querySelector("#carte-1")).not.toBeNull();
    expect(container.querySelector("[data-segments-rafale]")).toBeNull();
  });

  it("échelle : marche en cours (`aria-current=step`), marches réussies « Fait » ; liens `?marche=n#mission`", async () => {
    rafale.mockResolvedValue({ cartes: [], faites: ["a.c1", "b.c1", "c.c1"], fini: true, catalogue, cetteSemaine: 3, compteARebours: COMPTE });
    retours.mockResolvedValue([{ missionId: m1.id, marche: 1, retour: "essaye-ca-a-marche" }]);
    const { container } = render(await SEntrainerPage({ searchParams: {} }));
    expect(container.querySelector("[data-rafale-finie]")).not.toBeNull();
    expect(container.querySelector("[data-segments-rafale]")!.getAttribute("data-segments-rafale")).toBe("3/3");
    const echelle = container.querySelector("[data-echelle-marches]")!;
    expect(echelle.getAttribute("data-echelle-marches")).toBe("2");
    for (const liste of echelle.querySelectorAll("ol")) {
      expect(liste.querySelector("[aria-current='step']")!.getAttribute("data-marche")).toBe("2");
      expect(liste.querySelectorAll("a")).toHaveLength(5);
      expect(liste.querySelector("a[data-marche='3']")).toHaveAttribute("href", "/mon-espace/s-entrainer?marche=3#mission");
    }
    const liste = echelle.querySelector("[data-echelle='liste']")!;
    expect(liste.querySelector("a[data-marche='1'] [data-marche-faite]")!.textContent).toBe(G.fait);
    expect(liste.querySelectorAll("[data-marche-faite]")).toHaveLength(1);
    expect(liste.textContent).toContain(M.titresMarches[2]);
  });

  it("`?marche=n` sans mission : `aucuneMission` dans la colonne mission, échelle toujours là", async () => {
    rafale.mockResolvedValue({ cartes: [], faites: [], fini: true, catalogue, cetteSemaine: 0, compteARebours: COMPTE });
    retours.mockResolvedValue(missions.map((m) => ({ missionId: m.id, marche: m.marche, retour: "essaye-bof" as const })));
    const { container } = render(await SEntrainerPage({ searchParams: { marche: "3" } }));
    const vide = screen.getByTestId("mission-vide");
    expect(container.querySelector("[data-zone='mission']")!.contains(vide)).toBe(true);
    expect(container.querySelector("[data-echelle-marches]")!.getAttribute("data-echelle-marches")).toBe("3");
  });

  it("bouton de suite de la mission : contour tant qu'une carte reste, plein quand la rafale est finie", async () => {
    appel.mockResolvedValue({ suite: "marche" });
    const vue = { id: m1.id, marche: 1 as const, enonce: m1.enonce, suites: {} };
    for (const principal of [false, true]) {
      const { container, unmount } = render(<MissionCarte mission={vue} hrefAPlat={null} principal={principal} />);
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: G.retours["essaye-ca-a-marche"] }));
      });
      const suite = screen.getByRole("link", { name: M.voirLaMarche(2) });
      expect(aplats(container)).toEqual(principal ? [suite] : []);
      unmount();
    }
  });

  it("l'ancre `#carte-N` d'« Aujourd'hui » ouvre sa carte repliée", () => {
    window.location.hash = "#carte-3";
    const { container } = render(
      <CarteRepliee ancre="carte-3" titre="Titre">
        <article id="carte-3">corps</article>
      </CarteRepliee>,
    );
    expect((container.querySelector("details") as HTMLDetailsElement).open).toBe(true);
    window.location.hash = "";
  });
});

describe("s26 tour 3 (B1, S1) : aperçus en une seule grille 7/5", () => {
  it.each([
    ["Bibliothèque", () => render(<ApercuBibliotheque visiteur />), "[data-apercu-catalogue]"],
    ["S'entraîner", () => render(<ApercuSEntrainer visiteur />), "[data-apercu-mission]"],
  ])("%s : colonne de droite empilée (deux tuiles à leur hauteur), une seule tuile en rangée 2 sur 7 colonnes", (_, rendre, premiere) => {
    const { container } = rendre();
    const rangee1 = [...container.querySelectorAll("[data-apercu-rangee='1'] > *")];
    expect(rangee1.map((e) => classes(e).find((c) => c.startsWith("lg:col-span-")))).toEqual(["lg:col-span-7", "lg:col-span-5"]);
    const pile = rangee1[1];
    expect(pile.hasAttribute("data-apercu-pile")).toBe(true);
    expect(classes(pile)).toEqual(expect.arrayContaining(["flex", "flex-col", "gap-6"]));
    const tuiles = [...pile.children];
    expect(tuiles).toHaveLength(2);
    for (const t of tuiles) expect(classes(t)).toContain("h-auto");
    expect(tuiles[0].querySelector(premiere)).not.toBeNull();
    const rangee2 = [...container.querySelectorAll("[data-apercu-rangee='2'] > *")];
    expect(rangee2).toHaveLength(1);
    expect(classes(rangee2[0])).toEqual(expect.arrayContaining(["md:col-span-2", "lg:col-span-7"]));
    expect(container.querySelector("[data-apercu-extrait]")!.innerHTML).not.toMatch(/lg:col-span-6|max-md:hidden/);
  });
});

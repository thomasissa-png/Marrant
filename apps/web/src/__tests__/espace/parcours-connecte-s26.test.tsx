/**
 * s26 parcours connecté (`docs/design/parcours-connecte-s26.md` §2.1, §2.2, §3 ; `docs/ux/parcours-connecte-s26.md` §4,
 * §5) : briques de l'espace ouvert. Carte « En cours » (rangée 1 + « Ton cap » en ligne, squelette, échec), calendrier
 * en 2x2 puis 4 colonnes dès 1280, pied d'étape (retour vers la carte du parcours, étape suivante), liste du visiteur
 * en liens d'ancre, sommaire replié sous 1024 px. Aucun texte nouveau : tout est lu dans les textes existants.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";

jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

import { CarteEnCours } from "@/components/espace/parcours/carte-en-cours";
import { PiedEtape } from "@/components/espace/parcours/navigation-etapes";
import { QuatreSemaines } from "@/components/espace/quatre-semaines";
import { MenuEtapes } from "@/components/espace/parcours/menu-etapes";
import { TonCap } from "@/components/espace/ton-cap";
import { trackUmami } from "@/lib/umami";
import { lirePosition, noterPosition, recalerAncre, recalerPosition } from "@/lib/espace/recaler-ancre";
import { TEXTES_CAPS } from "@/config/textes/espace-caps";
import { ETAPE_LIBRE_BADGE } from "@/config/textes/offre";
import { progressionVisiteurTexte } from "@/config/textes/parcours";

const ETAPE = { slug: "repartie", titreParcours: "Répartie", ordre: 2, total: 5, titreEtape: "Rebondir", enCours: true, href: "/parcours/repartie#etape-2" };
const CAPS = { cap: 2 as const, serie: 3, ecart: false };

describe("carte « En cours »", () => {
  // s26 parcours v2 : tests changés (raison : trois rangées sur la même grille, barre segmentée et « Étape n sur N » sous
  // le bouton, « Ton cap » seul sur la 3e rangée, `docs/design/parcours-connecte-v2-s26.md` §4).
  it("rangée 1 (étape et LE plein), rangée 2 (barre segmentée, « Étape n sur N »), rangée 3 « Ton cap » derrière un filet", () => {
    const { container } = render(<CarteEnCours etat="ok" etape={ETAPE} caps={CAPS} />);
    const carte = screen.getByTestId("carte-en-cours");
    expect(within(carte).getByRole("heading", { level: 2, name: "Répartie" })).toBeInTheDocument();
    const bouton = within(carte).getByRole("link", { name: "Reprendre" });
    expect(bouton).toHaveAttribute("href", "/parcours/repartie#etape-2");
    expect(bouton.className.split(" ")).toEqual(expect.arrayContaining(["lg:col-span-3", "lg:self-center", "lg:justify-self-end", "w-full", "sm:w-auto"]));
    const barre = within(carte).getByRole("progressbar");
    expect(barre).toHaveAttribute("aria-valuenow", "1");
    expect(barre).toHaveAttribute("aria-valuemax", "5");
    expect(barre).toHaveAttribute("aria-valuetext", "Étape 2 sur 5");
    expect(barre.className.split(" ")).toContain("lg:col-span-9");
    expect(Array.from(barre.children).map((e) => e.getAttribute("data-segment"))).toEqual(["fait", "en-cours", "a-venir", "a-venir", "a-venir"]);
    expect(barre.innerHTML).not.toMatch(/accent/);
    const avancee = within(carte).getByText("Étape 2 sur 5");
    expect(avancee.className.split(" ")).toEqual(expect.arrayContaining(["lg:col-span-3", "lg:justify-self-end"]));
    expect(bouton.compareDocumentPosition(barre) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const cap = container.querySelector("#cap") as HTMLElement;
    expect(cap.getAttribute("aria-labelledby")).toBe("ton-cap-titre");
    expect(cap.className).not.toMatch(/lg:sticky|(^|\s)before:hidden|rounded-xl|\bp-6\b/);
    expect((cap.parentElement as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["mt-6", "border-t", "pt-6"]));
  });

  it("« Étape 3 sur 3 » : deux segments pleins et un cerné", () => {
    render(<CarteEnCours etat="ok" etape={{ ...ETAPE, ordre: 3, total: 3 }} caps={CAPS} />);
    expect(Array.from(screen.getByRole("progressbar").children).map((e) => e.getAttribute("data-segment"))).toEqual(["fait", "fait", "en-cours"]);
  });

  it("nouvel abonné (étape conseillée) : pas de barre ni « Étape n sur N », « Ton cap » seul", () => {
    const { container } = render(<CarteEnCours etat="ok" etape={{ ...ETAPE, ordre: 1, enCours: false }} caps={CAPS} />);
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.queryByText(/^Étape 1 sur/)).toBeNull();
    expect(container.querySelector("#cap")).not.toBeNull();
  });

  it("chargement : squelette `aria-busy` sans `min-h` ; échec : rien", () => {
    const { container, rerender } = render(<CarteEnCours etat="attente" etape={null} caps={null} />);
    const squelette = screen.getByTestId("carte-en-cours-squelette");
    expect(squelette).toHaveAttribute("aria-busy", "true");
    expect(container.innerHTML).not.toContain("min-h-");
    rerender(<CarteEnCours etat="echec" etape={null} caps={null} />);
    expect(container.innerHTML).toBe("");
  });

  it("« Ton cap » sans variante : rendu d'avant (cadre, titre 20 px)", () => {
    const { container } = render(<TonCap cap={1} serie={0} ecart={false} />);
    expect((container.querySelector("#ton-cap-titre") as HTMLElement).className).toBe("font-display text-xl font-bold text-text-primary");
    render(<TonCap enLigne cap={1} serie={0} ecart />);
    expect(screen.getAllByText(TEXTES_CAPS.serieZero.replace(/ /g, " "), { exact: false }).length).toBeGreaterThan(0);
  });
});

describe("Tes 4 premières semaines", () => {
  it("2x2 dès 768, 4 colonnes dès 1280, filet horizontal par cellule, étiquette puis texte", () => {
    const { container } = render(<QuatreSemaines ecouterPublie />);
    const ol = container.querySelector("ol") as HTMLElement;
    expect(ol.className.split(" ")).toEqual(expect.arrayContaining(["md:grid-cols-2", "xl:grid-cols-4"]));
    expect(ol.className).not.toContain("lg:grid-cols-4");
    for (const li of Array.from(ol.children)) {
      expect(li.className.split(" ")).toEqual(expect.arrayContaining(["border-t", "pt-4"]));
      expect(li.className).not.toContain("grid-cols-[auto_minmax(0,1fr)]");
    }
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("/parcours/[slug] : navigation entre étapes", () => {
  it("pied d'étape : « Retour : Parcours » vers la carte du parcours, puis l'étape suivante (ouverture par `allerAEtape`)", () => {
    const aller = jest.fn();
    render(<PiedEtape slug="repartie" suivante={{ order: 3, titre: "Relancer" }} allerAEtape={aller} />);
    expect(screen.getByRole("link", { name: /Retour/ })).toHaveAttribute("href", "/parcours#parcours-repartie");
    const suivante = screen.getByRole("link", { name: /Relancer/ });
    expect(suivante).toHaveAttribute("href", "#etape-3");
    fireEvent.click(suivante);
    expect(aller).toHaveBeenCalledWith(3);
    expect(trackUmami).toHaveBeenCalledWith("lien-etape-clic", { parcours: "repartie", etape: 3 });
  });

  it("dernière étape : pas de lien « suivante »", () => {
    render(<PiedEtape slug="repartie" suivante={null} allerAEtape={jest.fn()} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  // s26 parcours v2 : tests changés (raison : la liste du visiteur et le sommaire de l'abonné deviennent un seul menu
  // d'étapes, `MenuEtapes`, collant dès 1024 px et replié derrière un bouton sous 1024, `docs/design/parcours-connecte-v2-s26.md` §1).
  it("visiteur : ligne d'offre, liens d'ancre, « Lecture libre » en contour neutre sur l'étape 1, aucun bouton hors bascule", () => {
    const aller = jest.fn();
    render(
      <MenuEtapes slug="repartie" titre="Répartie" avancee={progressionVisiteurTexte()} etapes={[{ order: 1, titre: "Un", libre: true }, { order: 2, titre: "Deux" }]} faites={[]} active={1} onChoisir={aller} />,
    );
    const nav = screen.getByRole("navigation", { name: "Répartie" });
    const liens = within(nav).getAllByRole("link");
    expect(liens.map((l) => l.getAttribute("href"))).toEqual(["#etape-1", "#etape-2"]);
    expect(liens[0]).toHaveAttribute("aria-current", "step");
    expect(liens[0].className.split(" ")).toEqual(expect.arrayContaining(["min-h-11", "bg-background-elevated", "before:bg-text-primary"]));
    const libre = within(nav).getByText(ETAPE_LIBRE_BADGE);
    expect(libre.className.split(" ")).toEqual(expect.arrayContaining(["rounded-xl", "border", "border-border"]));
    expect(libre.className).not.toMatch(/success|bg-/);
    expect(within(nav).queryByRole("button")).toBeNull();
    fireEvent.click(liens[1]);
    expect(aller).toHaveBeenCalledWith(2);
  });

  // s26 parcours, tour 5 : test changé (raison : menu collé à 137 px, au haut d'une étape amenée sous l'en-tête, au lieu de
  // 144 ; D6 de la relecture design v2).
  it("menu replié sous 1024 px (liste et « Reprendre » en `display: none`), collant à 137 px dès 1024", () => {
    const { container } = render(
      <MenuEtapes slug="repartie" titre="Répartie" avancee="1 sur 2 étapes" etapes={[{ order: 1, titre: "Un" }, { order: 2, titre: "Deux" }]} faites={[1]} active={2} onChoisir={jest.fn()} reprendre={{ order: 2, libelle: "Reprendre" }} />,
    );
    const bascule = container.querySelector("[data-menu-bascule]") as HTMLElement;
    expect(bascule).toHaveAttribute("aria-expanded", "false");
    expect(bascule.className.split(" ")).toContain("lg:hidden");
    const nav = container.querySelector("[data-menu-etapes]") as HTMLElement;
    expect(nav.className.split(" ")).toEqual(expect.arrayContaining(["max-lg:hidden", "lg:sticky", "lg:top-[8.5625rem]", "lg:max-h-[calc(100dvh-10.0625rem)]"]));
    expect((nav.parentElement as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["lg:h-0", "lg:min-h-full"]));
    expect((container.querySelector("[data-menu-corps]") as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["overflow-y-auto", "overscroll-contain"]));
    fireEvent.click(bascule);
    expect(bascule).toHaveAttribute("aria-expanded", "true");
    expect(nav.className.split(" ")).not.toContain("max-lg:hidden");
    expect(screen.getAllByRole("button", { name: "Reprendre" })).toHaveLength(1);
  });
});

// s26 parcours connecté, tour 2 (`docs/captures/s26/tour-2-quoi-repondre-parcours/MESURES.md` B2, B3) : retour du
// navigateur, sommaire de l'en-tête 7/5, resserrages sous 300 px.
describe("tour 2 : retour du navigateur et en-tête 7/5", () => {
  it("la position quittée est notée dans l'entrée d'historique courante, état de Next conservé, puis relue", () => {
    window.history.replaceState({ __NA: true, arbre: "x" }, "");
    expect(lirePosition()).toBeNull();
    noterPosition({ etape: 3, y: 4390 });
    expect(window.history.state).toEqual({ __NA: true, arbre: "x", parcoursPosition: { etape: 3, y: 4390 } });
    expect(lirePosition()).toEqual({ etape: 3, y: 4390 });
    window.history.replaceState({ parcoursPosition: { etape: "3", y: "a" } }, "");
    expect(lirePosition()).toBeNull();
    window.history.replaceState(null, "");
  });

  it("recalerPosition rend le défilement noté", () => {
    const scrollTo = jest.fn();
    const avant = window.scrollTo;
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    try {
      recalerPosition(2755)();
      expect(scrollTo).toHaveBeenCalledWith({ top: 2755, behavior: "instant" });
    } finally {
      window.scrollTo = avant;
    }
  });

  // s26 parcours v2 : test « sommaire : lignes de 48 px dès 1024 px » retiré (raison : sommaire remplacé par le menu
  // d'étapes collant, testé plus haut).
  it("200 % de texte : filet de « Ton cap » resserré sous 300 px", () => {
    const { container } = render(<CarteEnCours etat="ok" etape={ETAPE} caps={CAPS} />);
    const cap = container.querySelector("#cap") as HTMLElement;
    expect(cap.className.split(" ")).toContain("max-e300:gap-y-1");
    expect((cap.parentElement as HTMLElement).className.split(" ")).toEqual(expect.arrayContaining(["max-e300:mt-2", "max-e300:pt-2"]));
  });
});

// s26 parcours connecté, tour 3 (spec Playwright `parcours-connecte-s26.spec.ts`, trajet 375 et 1280 ; vides de l'en-tête).
describe("tour 3 : recalage unique, sommaire replié sans boîte, rythme du sommaire étiré", () => {
  const avantRO = global.ResizeObserver;
  const observateurs: Array<{ rappel: () => void; actif: boolean }> = [];
  beforeAll(() => {
    global.ResizeObserver = class {
      private o: { rappel: () => void; actif: boolean };
      constructor(rappel: () => void) {
        this.o = { rappel, actif: true };
        observateurs.push(this.o);
      }
      observe() {}
      unobserve() {}
      disconnect() {
        this.o.actif = false;
      }
    } as unknown as typeof ResizeObserver;
  });
  afterAll(() => {
    global.ResizeObserver = avantRO;
  });

  function cible(id: string) {
    const e = document.createElement("div");
    e.id = id;
    e.scrollIntoView = jest.fn();
    document.body.appendChild(e);
    return e;
  }
  const changerDeHauteur = () => observateurs.filter((o) => o.actif).forEach((o) => o.rappel());

  it("un nouveau recalage arrête le précédent : la page qui change de hauteur ne ramène plus l'étape quittée", () => {
    const e2 = cible("etape-2");
    const e3 = cible("etape-3");
    const fin2 = recalerAncre("etape-2");
    const fin3 = recalerAncre("etape-3", { behavior: "smooth" });
    changerDeHauteur();
    expect(e2.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(e3.scrollIntoView).toHaveBeenCalledTimes(2);
    expect(e3.scrollIntoView).toHaveBeenLastCalledWith({ behavior: "smooth", block: "start" });
    fin2();
    fin3();
    e2.remove();
    e3.remove();
  });

  it("un clic (`pointerdown`) arrête le recalage en cours", () => {
    const e = cible("etape-2");
    const fin = recalerAncre("etape-2");
    window.dispatchEvent(new Event("pointerdown"));
    changerDeHauteur();
    expect(e.scrollIntoView).toHaveBeenCalledTimes(1);
    fin();
    e.remove();
  });

  // s26 parcours v2 : test « sommaire replié » retiré (raison : sommaire remplacé par le menu d'étapes, testé plus haut).
});

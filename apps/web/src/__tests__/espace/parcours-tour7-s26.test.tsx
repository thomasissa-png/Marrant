/**
 * s26 parcours, tour 7 (relectures à l'aveugle v4 : `docs/design/relectures/v4-quoi-repondre-parcours-s26-design.md`
 * points 11 à 19 ; `docs/ux/relectures/v4-quoi-repondre-parcours-s26-ux.md` D5, D6 ; MESURES v4 §2 et §6). Briques de
 * l'espace ouvert (mesures au pixel : `playwright/tests/local/parcours-connecte-s26.spec.ts`, « tour 7 ») :
 * - menu d'étapes : barre compacte sous 1024 px (retour + bouton existants), menu replié après un choix, sous-étapes
 *   sous chaque étape (menu figé), une seule barre blanche, graisse constante ;
 * - ancres des sous-étapes = numérotation affichée ; titre de la vignette vidéo à toutes les largeurs ;
 * - /parcours : barre de la carte « En cours » sur 12 colonnes, une seule phrase en gras dans « Ton cap », bandeau léger ;
 * - « · » lié à ses deux voisins ; quiz sans bordure ; titre d'étape en `TITRE_CARTE`.
 */
import { act, fireEvent, render, screen } from "@testing-library/react";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

jest.mock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: true }));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

import { MenuEtapes } from "@/components/espace/parcours/menu-etapes";
import { LignesFiches } from "@/components/espace/parcours/lignes-fiches";
import { CarteEnCours } from "@/components/espace/parcours/carte-en-cours";
import { AnnonceCap } from "@/components/espace/annonce-cap";
import { StepQuiz } from "@/components/parcours/step-quiz";
import { VideoCard } from "@/components/parcours/step-blocks";
import { fichesAffichees } from "@/lib/espace/sous-etapes";
import { NBSP, pointMedianInsecable } from "@/lib/fr-typo";
import { noterParcoursEnCours, useParcoursEnCours } from "@/lib/espace/parcours-en-cours";
import type { Step } from "@/components/parcours/parcours-types";

type EtapeJson = { week: number; tipTitle: string; jokeContents?: string[]; videos?: Array<{ youtubeId: string; artist: string; title: string; why: string }>; quiz?: Step["quiz"] };
const SEED = (parcoursSeed as Array<{ slug: string; steps: EtapeJson[] }>).find((p) => p.slug === "machine-a-cafe")!;
const vue = (e: EtapeJson, vannes = true) => ({ order: e.week, tip: { title: e.tipTitle }, videos: e.videos ?? [], jokes: vannes ? (e.jokeContents ?? []) : [], quiz: e.quiz ?? [] });

const ETAPES = [
  { order: 1, titre: "Un" },
  { order: 2, titre: "Deux" },
  { order: 3, titre: "Trois" },
];

describe("s26 parcours, tour 7 : menu d'étapes", () => {
  it("sous 1024 px : barre compacte (retour et bouton existants), menu replié après le choix d'une étape", () => {
    const choisir = jest.fn();
    const { container } = render(
      <MenuEtapes slug="machine-a-cafe" titre="Machine à Café" avancee="Étape 3 sur 3" etapes={ETAPES} faites={[1, 2]} active={3} onChoisir={choisir} retour={<a href="/parcours#parcours-machine-a-cafe">Retour</a>} />,
    );
    const barre = container.querySelector("[data-barre-parcours]") as HTMLElement;
    expect(barre.className.split(" ")).toContain("lg:hidden");
    expect(barre.querySelector("a")?.getAttribute("href")).toBe("/parcours#parcours-machine-a-cafe");
    const cellule = screen.getByTestId("sommaire-parcours");
    expect(cellule.className.split(" ")).toEqual(expect.arrayContaining(["max-lg:sticky", "max-lg:z-30", "lg:h-0", "lg:min-h-full"]));
    const bascule = container.querySelector("[data-menu-bascule]") as HTMLElement;
    const nav = container.querySelector("[data-menu-etapes]") as HTMLElement;
    expect(nav.className.split(" ")).toEqual(expect.arrayContaining(["max-lg:absolute", "max-lg:top-full", "lg:sticky"]));
    fireEvent.click(bascule);
    expect(bascule).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(container.querySelector("[data-ligne-etape='2']")!);
    expect(choisir).toHaveBeenCalledWith(2);
    expect(bascule).toHaveAttribute("aria-expanded", "false");
    expect(nav.className.split(" ")).toContain("max-lg:hidden");
    // Échap replie aussi.
    fireEvent.click(bascule);
    act(() => void fireEvent.keyDown(document, { key: "Escape" }));
    expect(bascule).toHaveAttribute("aria-expanded", "false");
  });

  it("titre du parcours et avancée masqués sous 1024 px dans le menu déplié (déjà sur la page et sur le bouton)", () => {
    const { container } = render(<MenuEtapes slug="s" titre="Machine à Café" avancee="Étape 3 sur 3" etapes={ETAPES} faites={[]} active={1} onChoisir={jest.fn()} />);
    expect(container.querySelector("#menu-etapes-titre")?.className.split(" ")).toContain("max-lg:hidden");
  });

  it("sous-étapes sous CHAQUE étape (menu figé), une seule active ; graisse constante ; filet de l'étape retiré si une sous-étape a le sien", () => {
    const e2 = SEED.steps.find((s) => s.week === 2)!;
    const e3 = SEED.steps.find((s) => s.week === 3)!;
    const parOrdre: Record<number, EtapeJson> = { 2: e2, 3: e3 };
    const { container } = render(
      <MenuEtapes
        slug="machine-a-cafe"
        titre="Machine à Café"
        avancee="Étape 3 sur 3"
        etapes={ETAPES}
        faites={[1]}
        active={2}
        onChoisir={jest.fn()}
        sousEtapes={(order) => (parOrdre[order] ? <LignesFiches slug="machine-a-cafe" etape={vue(parOrdre[order])} variante="menu" etapeAffichee={order === 2} /> : null)}
      />,
    );
    expect(container.querySelectorAll("[data-testid='lignes-fiches-menu']")).toHaveLength(2);
    expect(Array.from(container.querySelectorAll("a[data-fiche-active]")).map((a) => a.getAttribute("data-fiche"))).toEqual(["fiche-2-1"]);
    const ligne2 = container.querySelector("[data-ligne-etape='2']") as HTMLElement;
    expect(ligne2.className).toMatch(/group-has-\[\[data-fiche-active\]\]\/etape:before:!bg-transparent/);
    expect(ligne2.parentElement?.className).toContain("group/etape");
    for (const l of Array.from(container.querySelectorAll("[data-ligne-etape] span:nth-child(2)"))) expect(l.className).not.toMatch(/font-semibold/);
  });
});

describe("s26 parcours, tour 7 : ancres des sous-étapes et vignettes", () => {
  it("ancre = numéro affiché (« 2.2 » → `#fiche-2-2`), l'ancre du découpage gardée à part", () => {
    const e2 = SEED.steps.find((s) => s.week === 2)!;
    const fiches = fichesAffichees("machine-a-cafe", vue(e2, false), { etapeFaite: false, quizFait: true });
    expect(fiches.map((f) => [f.numero, f.ancre])).toEqual(fiches.map((_, i) => [`2.${i + 1}`, `fiche-2-${i + 1}`]));
    expect(fiches.some((f) => f.ancre !== f.ancreDecoupage)).toBe(true);
    expect(new Set(fiches.map((f) => f.ancre)).size).toBe(fiches.length);
  });

  // s26 parcours, tour 8 : test changé (raison : deux lignes à toutes les largeurs, relecture design v5, détail 4 :
  // « … de Thom… » tronqué à 375).
  it("vignette : titre incrusté (deux lignes à toutes les largeurs) quand `titreIncruste`, rien sinon", () => {
    const video = { youtubeId: "abc", title: "Le mariage", artist: "Jason Brokerss", why: "Pourquoi" };
    const avec = render(<VideoCard video={video} titreIncruste />).container;
    const titre = Array.from(avec.querySelectorAll("button span span")).find((s) => s.textContent === "Le mariage de Jason Brokerss");
    expect(titre?.className.split(" ")).toContain("line-clamp-2");
    expect(titre?.className.split(" ")).not.toContain("line-clamp-1");
    const sans = render(<VideoCard video={video} />).container;
    expect(Array.from(sans.querySelectorAll("button span")).some((s) => s.textContent === "Le mariage de Jason Brokerss")).toBe(false);
  });
});

describe("s26 parcours, tour 7 : /parcours et détails", () => {
  it("carte « En cours » : barre sur 12 colonnes, « Ton cap » avec une seule phrase en gras", () => {
    const etape = { slug: "repartie", titreParcours: "Répartie", ordre: 2, total: 3, titreEtape: "Rebondir", enCours: true, href: "/parcours/repartie#etape-2" };
    const { container } = render(<CarteEnCours etat="ok" etape={etape} caps={{ cap: 2, serie: 0, ecart: false }} />);
    expect(container.querySelector("[data-barre-segmentee]")?.className.split(" ")).toContain("lg:col-span-12");
    const cap = container.querySelector("#cap") as HTMLElement;
    expect(Array.from(cap.querySelectorAll(":scope > p")).filter((p) => /font-semibold/.test(p.className))).toHaveLength(1);
  });

  it("bandeau « Nouveau cap » léger : une ligne, méta, « Fermer » discret ; inchangé sans `leger`", () => {
    const annonce = { cap: 2 as const, bonus: null, marques: [{ type: "cap" as const, cap: 2 as const }] };
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
    const { container } = render(<AnnonceCap annonce={annonce as never} leger />);
    const bloc = container.querySelector("[data-annonce-legere]") as HTMLElement;
    expect(bloc.className).not.toMatch(/flex-col|py-4/);
    expect(bloc.querySelector("p")?.className).not.toMatch(/font-semibold/);
    expect(bloc.querySelector("button")?.className).toMatch(/text-text-secondary/);
  });

  it("« · » lié par deux insécables ; quiz sans bordure dans l'espace ouvert", () => {
    expect(pointMedianInsecable("Parcours Machine à Café · 3 semaines")).toBe(`Parcours Machine à Café${NBSP}·${NBSP}3 semaines`);
    const { container } = render(<StepQuiz quiz={[{ question: "Q ?", options: ["a", "b"], correctIndex: 0, explanation: "" }]} canValidate={false} onComplete={jest.fn()} />);
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(/(^|\s)border(\s|$)/);
  });

  it("magasin du parcours en cours : noté par la carte « En cours », lu par la liste", () => {
    let lu: string | null = "x";
    function Lecteur() {
      lu = useParcoursEnCours();
      return null;
    }
    render(<Lecteur />);
    expect(lu).toBeNull();
    act(() => noterParcoursEnCours("repartie"));
    expect(lu).toBe("repartie");
    act(() => noterParcoursEnCours(null));
    expect(lu).toBeNull();
  });
});

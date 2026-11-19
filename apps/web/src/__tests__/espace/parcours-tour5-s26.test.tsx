/**
 * s26 parcours, tour 5 (relectures à l'aveugle v2 : `docs/ux/relectures/v2-quoi-repondre-parcours-s26-ux.md` F1, F2, F8 ;
 * `docs/design/relectures/v2-quoi-repondre-parcours-s26-design.md` D2, D6, D9). Briques de l'espace ouvert :
 * - chaque sous-étape listée (menu et carte) mène à un bloc de la carte d'étape titré de son nom, pour TOUTES les étapes
 *   des 5 parcours (découpage `parcours-fiches.json` x seed) ; une fiche sans bloc n'est pas listée ;
 * - un seul état actif dans les sous-étapes (la fiche choisie, sinon la première d'une étape non validée) ;
 * - sous-étapes sans soulignement au repos ; cadenas sur les étapes réservées du visiteur ; menu collé à 137 px ;
 * - segments « à venir » en contour visible (`border-input`).
 */
import { fireEvent, render, within } from "@testing-library/react";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";
import { BOULOT_SEED, STORYTELLING_SEED } from "@/lib/parcours-seed";

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

import { ParcoursStepCard } from "@/components/parcours/parcours-step-card";
import { FicheActiveContexte, LignesFiches, libelleFiche } from "@/components/espace/parcours/lignes-fiches";
import { MenuEtapes } from "@/components/espace/parcours/menu-etapes";
import { BarreSegmentee } from "@/components/espace/parcours/barre-segmentee";
import { DECOUPAGE } from "@/lib/espace/parcours-fiches";
import type { Step } from "@/components/parcours/parcours-types";

interface EtapeSeedJson {
  week: number;
  tipTitle: string;
  moduleTitle?: string;
  moduleDetail?: string;
  why?: string;
  jokeContents?: string[];
  videos?: Array<{ youtubeId: string; artist: string; title: string; why: string }>;
  quiz?: Array<{ question: string; options: string[]; correctIndex: number; explanation?: string }>;
}

const SEEDS = [...(parcoursSeed as Array<{ slug: string; steps: EtapeSeedJson[] }>), STORYTELLING_SEED, BOULOT_SEED] as Array<{
  slug: string;
  steps: EtapeSeedJson[];
}>;

/** Étape telle que servie à l'abonné (conseil, vannes reçues, vidéos, quiz), lue dans le seed publié. */
function etapeDuSeed(e: EtapeSeedJson): Step {
  return {
    id: `s${e.week}`,
    order: e.week,
    dayNumber: e.week * 7,
    tip: { id: `t${e.week}`, title: e.tipTitle, content: "Contenu du conseil", category: "GENERAL", difficulty: "DEBUTANT", example: "", exercise: "" },
    moduleTitle: e.moduleTitle,
    moduleDetail: e.moduleDetail,
    why: e.why,
    moduleXp: 50,
    jokes: (e.jokeContents ?? []).map((c, i) => ({ id: `j${i}`, content: c, punchline: "Chute", technique: null, href: `/vannes/j${i}` })),
    videos: e.videos ?? [],
    quiz: e.quiz ?? [],
  };
}

/** Texte comparable : espaces insécables, fines et gluons de la typographie française ramenés à rien ou à l'espace. */
const plat = (t: string | null | undefined) => (t ?? "").replace(/[  ]/g, " ").replace(/⁠/g, "").replace(/\s+/g, " ").trim();

function carte(slug: string, step: Step, etat: { isCompleted?: boolean; isQuizDone?: boolean } = {}) {
  return render(
    <ParcoursStepCard
      step={step}
      slug={slug}
      isPremium
      isCompleted={etat.isCompleted ?? false}
      isExpanded
      isPremiumLocked={false}
      isQuizDone={etat.isQuizDone ?? false}
      isSeedFallback={false}
      completing={false}
      abonnementHref="/abonnement"
      loadFailed={false}
      onRetryLoad={jest.fn()}
      onToggle={jest.fn()}
      onQuizComplete={jest.fn()}
      onComplete={jest.fn()}
      ancresFiches
    />,
  );
}

describe("s26 parcours, tour 5 : sous-étape = bloc titré de son nom (5 parcours, toutes les étapes)", () => {
  const cas = DECOUPAGE.flatMap((p) => p.etapes.map((e) => [p.slug, e.ordre] as const));
  it("le découpage couvre les 5 parcours du seed", () => {
    expect(new Set(cas.map(([s]) => s))).toEqual(new Set(SEEDS.map((s) => s.slug)));
  });

  it.each(cas)("%s, étape %i : chaque ligne du menu a son bloc (id = ancre), titré du libellé de la ligne", (slug, ordre) => {
    const seed = SEEDS.find((s) => s.slug === slug)!.steps.find((s) => s.week === ordre)!;
    const step = etapeDuSeed(seed);
    const fiches = DECOUPAGE.find((p) => p.slug === slug)!.etapes.find((e) => e.ordre === ordre)!.fiches;
    const { container } = carte(slug, step);
    const menu = render(<LignesFiches slug={slug} etape={step} variante="menu" />);
    const liens = Array.from(menu.container.querySelectorAll<HTMLAnchorElement>("a[data-fiche]"));
    // Étape servie complète (vannes reçues, quiz à faire) : toutes les fiches du découpage sont listées.
    expect(liens.map((a) => a.getAttribute("data-fiche"))).toEqual(fiches.map((f) => f.ancre));
    for (const [i, f] of fiches.entries()) {
      const bloc = container.querySelector(`#${f.ancre}`);
      expect(bloc).not.toBeNull();
      // Titre de la ligne tel qu'affiché dans le menu (typographie comprise), lu dans le libellé de la fiche.
      const titreMenu = plat(liens[i].querySelectorAll("span")[1]?.textContent);
      expect(titreMenu).not.toBe("");
      expect(plat(libelleFiche(f.ref, step).replace(/'/g, "’"))).toBe(titreMenu);
      // Un bloc, pas un repère vide : son titre (h4) est celui de la ligne ; vidéo : titre et artiste de la carte.
      if (f.ref.bloc === "video") {
        for (const morceau of titreMenu.split(" · ")) expect(plat(bloc!.textContent)).toContain(morceau);
      } else {
        expect(plat(bloc!.tagName === "H4" ? bloc!.textContent : bloc!.querySelector("h4")?.textContent)).toBe(titreMenu);
      }
    }
  });

  it("sans vannes reçues, quiz fini ou étape validée : ni bloc ni ligne (aucune ligne vers un repère vide)", () => {
    const step = { ...etapeDuSeed(SEEDS[0].steps[1]), jokes: [] };
    const { container } = carte("machine-a-cafe", step, { isQuizDone: true });
    const menu = render(<LignesFiches slug="machine-a-cafe" etape={step} quizFait variante="menu" />);
    const lignes = Array.from(menu.container.querySelectorAll("a[data-fiche]")).map((a) => a.getAttribute("data-fiche"));
    expect(lignes).toEqual(["fiche-2-1", "fiche-2-3", "fiche-2-4"]);
    expect(container.querySelector("#fiche-2-2")).toBeNull();
    expect(container.querySelector("#fiche-2-5")).toBeNull();
    for (const l of lignes) expect(container.querySelector(`#${l}`)).not.toBeNull();
  });
});

describe("s26 parcours, tour 5 : menu d'étapes", () => {
  const step = etapeDuSeed(SEEDS[0].steps[1]);

  it("un seul état actif dans les sous-étapes : la fiche choisie (aria-current), sinon la première ; aucune soulignée au repos", () => {
    const choisir = jest.fn();
    const { container, rerender } = render(
      <FicheActiveContexte.Provider value={{ active: null, choisir }}>
        <LignesFiches slug="machine-a-cafe" etape={step} variante="menu" />
      </FicheActiveContexte.Provider>,
    );
    const actives = () => Array.from(container.querySelectorAll("a[data-fiche-active]")).map((a) => a.getAttribute("data-fiche"));
    expect(actives()).toEqual(["fiche-2-1"]);
    fireEvent.click(container.querySelector("a[data-fiche='fiche-2-2']")!);
    expect(choisir).toHaveBeenCalledWith("fiche-2-2");
    rerender(
      <FicheActiveContexte.Provider value={{ active: "fiche-2-2", choisir }}>
        <LignesFiches slug="machine-a-cafe" etape={step} variante="menu" />
      </FicheActiveContexte.Provider>,
    );
    expect(actives()).toEqual(["fiche-2-2"]);
    expect(container.querySelector("a[aria-current]")?.getAttribute("data-fiche")).toBe("fiche-2-2");
    expect(container.querySelector("a[data-fiche='fiche-2-1']")?.className).not.toMatch(/before:bg-text-primary/);
    for (const s of Array.from(container.querySelectorAll("a[data-fiche] span"))) {
      expect(s.className.split(" ")).not.toContain("underline");
    }
    expect(container.querySelector("a[data-fiche] span")?.className.split(" ")).toEqual(
      expect.arrayContaining(["group-hover:underline", "group-focus-visible:underline"]),
    );
  });

  it("visiteur : « Lecture libre » sur l'étape 1, cadenas de la bande de rubriques sur les suivantes ; collé à 137 px", () => {
    const { container } = render(
      <MenuEtapes
        slug="machine-a-cafe"
        titre="Machine à Café"
        avancee="Étape 1 gratuite"
        etapes={[
          { order: 1, titre: "Un", libre: true },
          { order: 2, titre: "Deux", verrouillee: true },
          { order: 3, titre: "Trois", verrouillee: true },
        ]}
        faites={[]}
        active={1}
        onChoisir={jest.fn()}
      />,
    );
    const ligne = (n: number) => container.querySelector(`[data-ligne-etape='${n}']`) as HTMLElement;
    expect(within(ligne(1)).getByText("Lecture libre")).toBeInTheDocument();
    expect(ligne(1).querySelector("[data-statut='verrouillee']")).toBeNull();
    for (const n of [2, 3]) {
      const cadenas = ligne(n).querySelector("[data-statut='verrouillee'] svg");
      expect(cadenas).not.toBeNull();
      expect(cadenas?.getAttribute("class")).toBe("h-3.5 w-3.5 flex-none text-text-secondary");
    }
    const nav = container.querySelector("[data-menu-etapes]") as HTMLElement;
    expect(nav.className.split(" ")).toEqual(expect.arrayContaining(["lg:top-[8.5625rem]", "lg:max-h-[calc(100dvh-10.0625rem)]"]));
  });

  it("barre segmentée : « à venir » en contour `border-input`, visible sur la carte (3,33:1)", () => {
    const { container } = render(<BarreSegmentee faites={0} total={4} enCours={null} texte="0/4 étapes" />);
    for (const s of Array.from(container.querySelectorAll("[data-segment='a-venir']"))) {
      expect(s.className.split(" ")).toEqual(expect.arrayContaining(["border", "border-border-input"]));
      expect(s.className).not.toMatch(/(^|\s)bg-border(\s|$)/);
    }
  });
});

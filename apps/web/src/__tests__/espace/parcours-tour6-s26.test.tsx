/**
 * s26 parcours, tour 6 (relectures à l'aveugle v3 : `docs/design/relectures/v3-quoi-repondre-parcours-s26-design.md`
 * Parcours D1, D3, D5 ; détail D2, D3, D5 ; `docs/ux/relectures/v3-quoi-repondre-parcours-s26-ux.md` D7, D8, D11a).
 * Briques de l'espace ouvert (les mesures au pixel sont dans `playwright/tests/local/parcours-connecte-s26.spec.ts`) :
 * - numérotation continue parmi les sous-étapes AFFICHÉES (plus de 2.1, 2.3), la même dans le menu et dans la carte ;
 * - sous-étape active sans changement de graisse (filet et blanc), aucune ligne en gras ;
 * - vidéos de la première rangée amenées avec le titre de leur section ; repère neutre `data-fiche-reperee` posé 1,5 s.
 */
import { act, render } from "@testing-library/react";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

import { FicheActiveContexte, LignesFiches } from "@/components/espace/parcours/lignes-fiches";
import { ParcoursStepCard } from "@/components/parcours/parcours-step-card";
import { repererBloc } from "@/lib/espace/recaler-ancre";
import type { Step } from "@/components/parcours/parcours-types";

type EtapeJson = { week: number; tipTitle: string; jokeContents?: string[]; videos?: Array<{ youtubeId: string; artist: string; title: string; why: string }>; quiz?: Step["quiz"] };
const SEED = (parcoursSeed as Array<{ slug: string; steps: EtapeJson[] }>).find((p) => p.slug === "machine-a-cafe")!;

function etape(e: EtapeJson, vannes = true): Step {
  return {
    id: `s${e.week}`,
    order: e.week,
    dayNumber: e.week * 7,
    tip: { id: `t${e.week}`, title: e.tipTitle, content: "Contenu", category: "GENERAL", difficulty: "DEBUTANT", example: "", exercise: "" },
    moduleXp: 50,
    jokes: vannes ? (e.jokeContents ?? []).map((c, i) => ({ id: `j${i}`, content: c, punchline: "Chute", technique: null, href: `/vannes/j${i}` })) : [],
    videos: e.videos ?? [],
    quiz: e.quiz ?? [],
  };
}

const numeros = (c: HTMLElement) => Array.from(c.querySelectorAll("a[data-fiche] span:first-child")).map((s) => s.textContent);

describe("s26 parcours, tour 6 : sous-étapes", () => {
  const e2 = SEED.steps.find((s) => s.week === 2)!;

  it("sans vannes servies (2.2 absente) : numéros continus 2.1, 2.2, 2.3… dans le menu ET dans la carte, ancres inchangées", () => {
    const step = etape(e2, false);
    const menu = render(<LignesFiches slug={SEED.slug} etape={step} variante="menu" />).container;
    const carte = render(<LignesFiches slug={SEED.slug} etape={step} />).container;
    const attendus = numeros(menu).map((_, i) => `2.${i + 1}`);
    expect(attendus.length).toBeGreaterThanOrEqual(3);
    expect(numeros(menu)).toEqual(attendus);
    expect(numeros(carte)).toEqual(attendus);
    const ancres = Array.from(menu.querySelectorAll("a[data-fiche]")).map((a) => a.getAttribute("data-fiche"));
    expect(ancres).not.toContain("fiche-2-2");
    expect(ancres[1]).toBe("fiche-2-3");
  });

  it("ligne active : même graisse que les autres (aucun `font-semibold`), titre et numéro en blanc, filet", () => {
    const { container } = render(
      <FicheActiveContexte.Provider value={{ active: "fiche-2-3", choisir: jest.fn() }}>
        <LignesFiches slug={SEED.slug} etape={etape(e2)} variante="menu" />
      </FicheActiveContexte.Provider>,
    );
    for (const s of Array.from(container.querySelectorAll("a[data-fiche] span"))) expect(s.className).not.toMatch(/font-semibold/);
    const active = container.querySelector("a[data-fiche='fiche-2-3']")!;
    expect(active.className).toMatch(/before:bg-text-primary/);
    expect(Array.from(active.querySelectorAll(":scope > span")).slice(0, 2).map((s) => s.className.split(" "))).toEqual([
      expect.arrayContaining(["text-sm", "text-text-primary"]),
      expect.arrayContaining(["text-sm", "text-text-primary"]),
    ]);
    const autre = container.querySelector("a[data-fiche='fiche-2-1'] span:nth-child(2)")!;
    expect(autre.className.split(" ")).not.toContain("text-text-primary");
  });

  it("vidéos : première rangée amenée avec le titre de section (2,5625rem), repère neutre posé 1,5 s puis retiré", () => {
    jest.useFakeTimers();
    const step = etape(e2);
    const { container } = render(
      <ParcoursStepCard
        step={step}
        slug={SEED.slug}
        isPremium
        isCompleted={false}
        isExpanded
        isPremiumLocked={false}
        isQuizDone={false}
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
    expect((step.videos ?? []).length).toBeGreaterThanOrEqual(2);
    const v1 = container.querySelector<HTMLElement>("#fiche-2-3")!;
    const v2 = container.querySelector<HTMLElement>("#fiche-2-4")!;
    expect(v1.className.split(" ")).toContain("scroll-mt-[2.5625rem]");
    expect(v2.className.split(" ")).toEqual(expect.arrayContaining(["scroll-mt-[9px]", "sm:scroll-mt-[2.5625rem]"]));
    expect(v1.className).toMatch(/data-\[fiche-reperee\]:!outline-text-muted/);
    expect(v1.className).not.toMatch(/accent/);
    act(() => void repererBloc("fiche-2-4"));
    expect(v2.hasAttribute("data-fiche-reperee")).toBe(true);
    act(() => void repererBloc("fiche-2-3"));
    expect(v2.hasAttribute("data-fiche-reperee")).toBe(false);
    expect(v1.hasAttribute("data-fiche-reperee")).toBe(true);
    act(() => void jest.advanceTimersByTime(1_500));
    expect(v1.hasAttribute("data-fiche-reperee")).toBe(false);
    jest.useRealTimers();
  });
});

/**
 * s19 (rendu itération 4, [CHOIX UTILISATEUR] 11/10 « Go tout est ok pour moi! ») :
 * XP gagnés sur le total, défi en gras et exemple en paragraphes sur tous les parcours,
 * lien d'étape (point médian, allure de lien, mesure), « Version sans risque » en retrait,
 * critère commun hors de l'encadré, « arrive bientôt » masqué en erreur, mesure de « Aller au défi ».
 */
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import boulot from "../../../../../docs/content/parcours-boulot-s19.json";
import { ParcoursDetail, type PathData } from "@/components/parcours/parcours-detail";
import { ParcoursStepCard, type ParcoursStepCardProps } from "@/components/parcours/parcours-step-card";
import type { Step } from "@/components/parcours/parcours-types";
import { xpProgressionTexte } from "@/config/textes/parcours";
import { xpGagnesParcours } from "@/lib/parcours-xp";
import { trackUmami } from "@/lib/umami";

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => <div data-testid="progress-bar">{props.label as string}</div>,
}));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "u1", name: "Sophie", plan: "PREMIUM" } }, status: "authenticated" }),
}));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

const NBSP = String.fromCharCode(0xa0);
const plain = (t: string | null) => (t ?? "").replaceAll(NBSP, " ").replaceAll(String.fromCharCode(0x2060), "");
const DEFI_REPARTIE = "DÉFI IRONIE DOUCE : la prochaine fois qu'un proche fait un truc raté, commente-le.";

function step(order: number, exercise = "", example = ""): Step {
  return {
    id: `s${order}`,
    order,
    dayNumber: order * 7,
    tip: { id: `t${order}`, title: `Conseil ${order}`, content: `Contenu ${order}`, category: "GENERAL", difficulty: "DEBUTANT", example, exercise },
    moduleTitle: `Module ${order}`,
    moduleXp: 50,
    quiz: [],
    videos: [],
  };
}

function carte(slug: string, over: Partial<ParcoursStepCardProps> = {}) {
  const props: ParcoursStepCardProps = {
    step: step(1, boulot._meta.conseils[0].exercise),
    slug,
    isPremium: true,
    isCompleted: false,
    isExpanded: true,
    isSequentiallyLocked: false,
    isPremiumLocked: false,
    previousOrder: null,
    isQuizDone: false,
    isSeedFallback: false,
    completing: false,
    abonnementHref: "/abonnement",
    loadFailed: false,
    onRetryLoad: jest.fn(),
    onToggle: jest.fn(),
    onQuizComplete: jest.fn(),
    onComplete: jest.fn(),
    ...over,
  };
  return render(<ParcoursStepCard {...props} />);
}

beforeEach(() => (trackUmami as jest.Mock).mockClear());

describe("point 3 : XP gagnés sur le total, bonus de fin compris", () => {
  it("singulier pour 0 et 1, pluriel au-delà", () => {
    expect(xpProgressionTexte(0, 700)).toBe("0 XP gagné sur 700, bonus de fin compris");
    expect(xpProgressionTexte(1, 700)).toBe("1 XP gagné sur 700, bonus de fin compris");
    expect(xpProgressionTexte(125, 700)).toBe("125 XP gagnés sur 700, bonus de fin compris");
  });

  it("gagnés = XP des étapes validées (repli 20), bonus seulement une fois terminé", () => {
    const steps = [{ order: 1, moduleXp: 50 }, { order: 2, moduleXp: 75 }, { order: 3 }];
    expect(xpGagnesParcours(steps, [])).toBe(0);
    expect(xpGagnesParcours(steps, [1, 3, 9])).toBe(70);
    expect(xpGagnesParcours(steps, [1, 2, 3], true)).toBe(245);
  });
});

describe("point 4 : défi en gras et exemple en paragraphes, tous les parcours", () => {
  it.each(["machine-a-cafe", "repartie", "confiance"])("%s : « DÉFI X » en gras, une ligne d'exemple = un paragraphe", (slug) => {
    const { container } = carte(slug, { step: step(1, DEFI_REPARTIE, "Ligne une\nLigne deux") });
    expect(screen.getByText("DÉFI IRONIE DOUCE").tagName).toBe("STRONG");
    expect(screen.getByText("Ligne une").tagName).toBe("P");
    expect(screen.getByText("Ligne deux").tagName).toBe("P");
    expect(container.textContent).toContain("DÉFI IRONIE DOUCE : la prochaine fois qu'un proche fait un truc raté, commente-le.");
    expect(screen.queryByTestId("version-sans-risque")).toBeNull();
    expect(screen.queryByRole("link", { name: "Aller au défi" })).toBeNull();
  });

  it("sans libellé « DÉFI X : », le texte est rendu tel quel, sans gras", () => {
    const { container } = carte("repartie", { step: step(1, "Aujourd'hui, note une phrase.") });
    expect(screen.getByText("Aujourd'hui, note une phrase.").tagName).toBe("P");
    expect(container.querySelector("strong")).toBeNull();
  });
});

describe("Boulot : « Version sans risque » en retrait, critère commun hors de l'encadré", () => {
  it("encadré en pointillés neutres, titre en 12 px sous le « DÉFI X » en 14 px", () => {
    carte("boulot");
    const encadre = screen.getByTestId("version-sans-risque");
    expect(encadre.className).toContain("border-dashed");
    expect(encadre.className).not.toContain("bg-accent-primary");
    expect(within(encadre).getByText("Version sans risque").className).toContain("text-xs");
    expect(screen.queryByTestId("defi-suite")).toBeNull();
  });

  it.each([
    [2, "C'est gagné si ton PS tient en une phrase"],
    [6, "C'est réussi s'il fait entre 100 et 125 mots"],
  ])("étape %i : « %s » sous l'encadré", (n, debut) => {
    const texte = boulot._meta.conseils[n - 1].exercise;
    const { container } = carte("boulot", { step: step(n, texte) });
    const suite = screen.getByTestId("defi-suite");
    expect(plain(suite.textContent).startsWith(debut)).toBe(true);
    expect(plain(screen.getByTestId("version-sans-risque").textContent)).not.toContain(debut);
    const exercice = container.querySelector(`#etape-${n}-defi`) as HTMLElement;
    const rendu = plain(exercice.textContent).replace(/^Exercice pratique/, "").replace("Version sans risque", "");
    expect(rendu.startsWith(texte)).toBe(true);
  });

  it("« Aller au défi » : événement Umami sans donnée personnelle", async () => {
    carte("boulot");
    await userEvent.click(screen.getByRole("link", { name: "Aller au défi" }));
    expect(trackUmami).toHaveBeenCalledWith("defi-lien-clic", { parcours: "boulot", etape: 1 });
  });
});

describe("S10 : « arrive bientôt » masqué si le chargement a échoué", () => {
  it.each([
    [false, true],
    [true, false],
  ])("loadFailed=%s : ligne affichée=%s", (loadFailed, visible) => {
    carte("boulot", { isSeedFallback: true, loadFailed });
    expect(screen.queryByText(/arrive bientôt/) !== null).toBe(visible);
  });
});

function chemin(): PathData {
  return {
    id: "db-path",
    title: "Parcours Boulot",
    description: "Description",
    slug: "boulot",
    duration: "6 semaines",
    difficulty: "DEBUTANT",
    timePerWeek: "15 min/semaine",
    icon: "💼",
    steps: [1, 2, 3, 4].map((o) => step(o)),
  } as PathData;
}

function mockProgression(completedSteps: number[]) {
  global.fetch = jest.fn((url: string) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () =>
        url.includes("by-slug")
          ? {
              path: chemin(),
              userProgress: { completedSteps, currentStep: completedSteps.length + 1, completedAt: null },
              stepValidations: completedSteps.map((o) => ({ stepOrder: o, completedAt: "2026-01-05T10:00:00Z" })),
            }
          : {},
    }),
  ) as unknown as typeof fetch;
}

describe("carte de progression", () => {
  beforeEach(() => {
    localStorage.clear();
    Element.prototype.scrollIntoView = jest.fn();
  });

  it("avant toute étape validée : « 0 XP gagné sur 300 »", async () => {
    mockProgression([]);
    render(<ParcoursDetail slug="boulot" initialPath={chemin()} />);
    expect(await screen.findByText("0 XP gagné sur 300, bonus de fin compris")).toBeInTheDocument();
  });

  it("en cours : XP gagnés, lien « Étape 3 · Module 3 » à l'allure de lien, clic mesuré", async () => {
    mockProgression([1, 2]);
    render(<ParcoursDetail slug="boulot" initialPath={chemin()} />);
    expect(await screen.findByText("100 XP gagnés sur 300, bonus de fin compris")).toBeInTheDocument();
    const lien = await screen.findByTestId("lien-prochaine-etape");
    const ligne2 = within(lien).getByText(/Étape 3/);
    expect(plain(ligne2.textContent)).toBe("Étape 3 · Module 3");
    expect(ligne2.className).toContain("text-accent-link");
    expect(ligne2.className).toContain("group-hover:underline");
    await userEvent.click(lien);
    expect(trackUmami).toHaveBeenCalledWith("lien-etape-clic", { parcours: "boulot", etape: 3 });
  });

  it("échec du chargement : ni ligne XP, ni « arrive bientôt »", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 500, json: async () => ({}) })) as unknown as typeof fetch;
    const path = chemin();
    path.steps = path.steps.map((s) => ({ ...s, locked: s.order > 1 }));
    render(<ParcoursDetail slug="boulot" initialPath={path} />);
    await screen.findAllByRole("alert");
    await waitFor(() => expect(screen.queryByText(/XP gagné/)).toBeNull());
    expect(screen.queryByText(/arrive bientôt/)).toBeNull();
  });
});

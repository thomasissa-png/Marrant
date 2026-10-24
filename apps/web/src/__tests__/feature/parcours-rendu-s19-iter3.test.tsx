/**
 * s19 (rendu itération 3) : lien vers l'étape à faire (N2b), « Version sans risque » et
 * « Aller au défi » (N4, Boulot seulement), un seul cadenas, carte de progression en erreur.
 */
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import boulot from "../../../../../docs/content/parcours-boulot-s19.json";
import { ParcoursDetail, type PathData } from "@/components/parcours/parcours-detail";
import { ParcoursStepCard, type ParcoursStepCardProps } from "@/components/parcours/parcours-step-card";
import type { Step } from "@/components/parcours/parcours-types";

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

function step(order: number, exercise = ""): Step {
  return {
    id: `s${order}`,
    order,
    dayNumber: order * 7,
    tip: { id: `t${order}`, title: `Conseil ${order}`, content: `Contenu ${order}`, category: "GENERAL", difficulty: "DEBUTANT", example: "", exercise },
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
    isPremiumLocked: false,
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

describe("N4 : « Version sans risque » et « Aller au défi », Boulot seulement", () => {
  it("Boulot : repli dans son encadré titré, lien vers le défi (44 px, ancre sous la barre fixe)", () => {
    const { container } = carte("boulot");
    const encadre = screen.getByTestId("version-sans-risque");
    expect(within(encadre).getByText("Version sans risque")).toBeInTheDocument();
    expect(plain(encadre.textContent)).toMatch(/^Version sans risquePas de réunion en vue, ou elle se passe en visio \?/);
    const lien = screen.getByRole("link", { name: "Aller au défi" });
    expect(lien).toHaveAttribute("href", "#etape-1-defi");
    expect(lien.className).toContain("min-h-[44px]");
    const cible = container.querySelector("#etape-1-defi");
    expect(cible?.className).toContain("scroll-mt-28");
    expect(within(cible as HTMLElement).getByText("Exercice pratique")).toBeInTheDocument();
  });

  it.each(["storytelling", "machine-a-cafe", "repartie", "confiance"])("%s : rien ne change", (slug) => {
    carte(slug);
    expect(screen.queryByTestId("version-sans-risque")).toBeNull();
    expect(screen.queryByRole("link", { name: "Aller au défi" })).toBeNull();
  });
});

describe("S5 : « Lire la fiche du conseil » sans saut de page", () => {
  it("HTML de repli : place du lien réservée (44 px) ; avec l'API : le lien à la même place", () => {
    const { unmount } = carte("boulot", { isSeedFallback: true });
    expect(screen.getByTestId("lien-conseil-reserve").className).toContain("min-h-[44px]");
    unmount();
    carte("boulot", { step: { ...step(1), tipHref: "/conseils/x" } });
    expect(screen.queryByTestId("lien-conseil-reserve")).toBeNull();
    expect(screen.getByRole("link", { name: "Lire la fiche du conseil" }).className).toContain("min-h-[44px]");
  });
});

describe("cadenas : un seul indicateur par étape verrouillée", () => {
  it("s21 (décision du 18/10) : abonné, étape 2 non précédée d'une étape validée → aucun cadenas, en-tête dépliable", () => {
    const { container } = carte("boulot", { step: step(2), isExpanded: false });
    expect(container.querySelector('path[d^="M12 15v2"]')).toBeNull();
    expect(container.querySelector('[role="button"][aria-expanded="false"]')).not.toBeNull();
    expect(container.textContent).not.toMatch(/pour débloquer/);
  });

  it("visiteur : cadenas à gauche et chevron d'ouverture", () => {
    const { container } = carte("repartie", { step: step(2), isPremium: false, isPremiumLocked: true, isExpanded: false });
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    expect(container.querySelector('path[d^="M12 15v2"]')).not.toBeNull();
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

describe("carte de progression", () => {
  beforeEach(() => {
    localStorage.clear();
    Element.prototype.scrollIntoView = jest.fn();
  });

  it("N2b : la phrase validée mène à l'étape à faire, numéro et titre en second plan", async () => {
    global.fetch = jest.fn((url: string) =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () =>
          url.includes("by-slug")
            ? {
                path: chemin(),
                userProgress: { completedSteps: [1, 2], currentStep: 3, completedAt: null },
                stepValidations: [{ stepOrder: 2, completedAt: "2026-01-05T10:00:00Z" }],
              }
            : {},
      }),
    ) as unknown as typeof fetch;
    render(<ParcoursDetail slug="boulot" initialPath={chemin()} />);
    const lien = await screen.findByTestId("lien-prochaine-etape");
    expect(lien).toHaveAttribute("href", "#etape-3");
    expect(lien.className).toContain("min-h-[44px]");
    expect(plain(lien.textContent)).toBe("La prochaine étape t’attend.Étape 3 · Module 3");
    expect(lien.textContent).not.toMatch(/aujourd'hui/i);
    await userEvent.click(lien);
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled());
    expect(document.getElementById("etape-3-entete")).toHaveAttribute("aria-expanded", "true");
  });

  it("échec du chargement : pas de ligne « XP au total » orpheline", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 500, json: async () => ({}) })) as unknown as typeof fetch;
    const path = chemin();
    path.steps = path.steps.map((s) => ({ ...s, locked: s.order > 1 }));
    render(<ParcoursDetail slug="boulot" initialPath={path} />);
    await screen.findAllByRole("alert");
    expect(screen.queryByText(/XP au total/)).toBeNull();
  });
});

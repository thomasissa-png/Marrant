/**
 * s17 tour 1 de la notation visuelle (iter-1-design.md, iter-1-ux.md, bugs QA 1 et 3) :
 * résultat de validation persistant dans la carte validée, parcours terminé replié
 * avec la carte de fin avant « Le programme », repère du parcours sur l'étape 1,
 * repère de prix sous l'aperçu verrouillé.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParcoursDetail, type PathData } from "@/components/parcours/parcours-detail";
import { PREMIUM_PRICE_LABEL } from "@/config/premium";

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => <div data-testid="progress-bar">{props.label as string}</div>,
}));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));

let session: { data: unknown; status: string } = { data: null, status: "unauthenticated" };
jest.mock("next-auth/react", () => ({ useSession: () => session }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

const PREMIUM = { data: { user: { name: "Yanis", plan: "PREMIUM" } }, status: "authenticated" };

function buildPath(xps: number[]): PathData {
  return {
    id: "db-path",
    title: "Parcours Répartie",
    description: "Description",
    slug: "repartie",
    duration: `${xps.length} semaines`,
    difficulty: "DEBUTANT",
    timePerWeek: "20 min/semaine",
    icon: "⚡",
    nextParcours: "confiance",
    nextParcoursReason: null,
    steps: xps.map((xp, i) => ({
      id: `s${i + 1}`,
      order: i + 1,
      dayNumber: (i + 1) * 7,
      tip: {
        id: `tip-${i + 1}`,
        title: `Conseil ${i + 1}`,
        content: `Conseil complet ${i + 1}`,
        category: "GENERAL",
        difficulty: "DEBUTANT",
        example: "",
        exercise: "",
      },
      moduleTitle: `Module ${i + 1}`,
      moduleDetail: `Ce qu'on apprend ${i + 1}`,
      moduleFormat: "Conseil + quiz",
      moduleXp: xp,
      why: null,
      free: i === 0,
      quiz: [],
      videos: [],
    })),
  } as unknown as PathData;
}

function mockFetch(handler: (url: string, init?: RequestInit) => unknown) {
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    const body = handler(url, init) ?? {};
    return { ok: true, status: 200, json: async () => body };
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  session = { data: null, status: "unauthenticated" };
  sessionStorage.clear();
  window.history.replaceState(null, "", "/parcours/repartie");
});

describe("UXV-1-01 / DES-1-01 : résultat dans la carte validée", () => {
  it("gain d'XP et date conseillée visibles dans la carte de l'étape validée, sans minuterie", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate", "queueMicrotask"] });
    session = PREMIUM;
    const path = buildPath([50, 75, 100, 150]);
    mockFetch((url, init) =>
      init?.method === "POST"
        ? { progress: { completedSteps: [1, 2], currentStep: 2, completedAt: null }, xpGained: 75, pathCompleted: false }
        : url.includes("by-slug")
          ? { path, userProgress: { completedSteps: [1], currentStep: 1, completedAt: null } }
          : {},
    );
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<ParcoursDetail slug="repartie" />);
    await user.click(await screen.findByText("Valider cette étape"));
    const resultat = await screen.findByTestId("etape-resultat");
    expect(resultat).toHaveTextContent("+75 XP gagnés !");
    expect(resultat).toHaveTextContent(/Prochaine étape conseillée le .+\. Tu peux y aller dès maintenant si tu veux\./);
    expect(resultat.closest("#etape-2")).not.toBeNull();
    // Plus de disparition au bout de 6 s (bugs 1 et 3 QA).
    jest.advanceTimersByTime(30_000);
    expect(screen.getByTestId("etape-resultat")).toHaveTextContent("+75 XP gagnés !");
    // L'étape suivante est ouverte.
    expect(screen.getByRole("button", { name: /^Étape 3 :/ })).toHaveAttribute("aria-expanded", "true");
    jest.useRealTimers();
  });
});

describe("UXV-1-03 : parcours terminé, rechargé", () => {
  it("étapes repliées, carte de fin et bilan avant « Le programme »", async () => {
    session = PREMIUM;
    const path = buildPath([50, 75, 100, 150]);
    mockFetch((url) =>
      url.includes("by-slug")
        ? {
            path,
            userProgress: { completedSteps: [1, 2, 3, 4], currentStep: 4, completedAt: "2026-10-01T10:00:00Z" },
          }
        : url === "/api/parcours"
          ? { paths: [{ slug: "confiance", title: "Parcours Confiance", progress: null }] }
          : {},
    );
    render(<ParcoursDetail slug="repartie" initialPath={path} />);
    const fin = await screen.findByRole("heading", { name: "Parcours Répartie terminé" });
    await waitFor(() =>
      screen.getAllByRole("button", { name: /^Étape \d :/ }).forEach((b) => expect(b).toHaveAttribute("aria-expanded", "false")),
    );
    const programme = screen.getByRole("heading", { name: "Le programme" });
    expect(fin.compareDocumentPosition(programme) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("UXV-1-06 et UXV-1-07 : repères du visiteur", () => {
  it("étape 1 : nom et durée du parcours au-dessus du titre ; aperçu verrouillé : prix et « sans engagement »", async () => {
    render(<ParcoursDetail slug="repartie" initialPath={buildPath([50, 75, 100, 150])} />);
    expect(await screen.findByText("Parcours Répartie · 4 semaines")).toBeInTheDocument();
    // Le nom vocal de l'en-tête reste « Étape 1 : … » (repère masqué au lecteur d'écran, il répète le H1).
    expect(screen.getByRole("button", { name: /^Étape 1 : Module 1/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /^Étape 2 : Module 2/ }));
    // Prix lu dans config/premium.ts (espaces insécables de formatEuros : comparaison sur textContent).
    expect(screen.getByText(/sans engagement\.$/).textContent).toBe(`${PREMIUM_PRICE_LABEL}, sans engagement.`);
    expect(screen.getByText("Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de Premium.")).toBeInTheDocument();
  });
});

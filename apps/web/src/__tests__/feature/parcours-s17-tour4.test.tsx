/**
 * s17 tour 4 (QA) : arrivée par l'ancre `#etape-N` d'un abonné. Le défilement d'arrivée est
 * calculé sur la page longue du HTML ISR ; quand le chargement Premium aboutit ou échoue, la
 * carte de l'étape est recalée une seule fois sous l'en-tête fixe, sans voler le focus.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParcoursDetail, type PathData } from "@/components/parcours/parcours-detail";
import { CHARGEMENT_ETAPE } from "@/config/textes/parcours";

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => <div data-testid="progress-bar">{props.label as string}</div>,
}));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: "u1", name: "Yanis", plan: "PREMIUM" } }, status: "authenticated" }),
}));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

const ETAPE_1_FAITE = { completedSteps: [1], currentStep: 1, completedAt: null };

function buildPath(locked: boolean): PathData {
  return {
    id: "db-path",
    title: "Parcours Répartie",
    description: "Description",
    slug: "repartie",
    duration: "4 semaines",
    difficulty: "DEBUTANT",
    timePerWeek: "20 min/semaine",
    icon: "⚡",
    nextParcours: null,
    nextParcoursReason: null,
    steps: [1, 2, 3, 4].map((order) => ({
      id: `s${order}`,
      order,
      dayNumber: order * 7,
      tip: { id: `t${order}`, title: `Conseil ${order}`, content: `Contenu ${order}`, category: "GENERAL", difficulty: "DEBUTANT", example: "", exercise: "" },
      moduleTitle: `Module ${order}`,
      moduleXp: 50,
      free: order === 1,
      locked: locked && order > 1,
      quiz: [],
      videos: [],
    })),
  } as unknown as PathData;
}

type Reponse = { ok: boolean; status: number; json: () => Promise<unknown> };
const ok = (body: unknown): Reponse => ({ ok: true, status: 200, json: async () => body });
const ko: Reponse = { ok: false, status: 500, json: async () => ({ error: "Erreur serveur" }) };

function mockBySlug(reponses: Reponse[]) {
  global.fetch = jest.fn((url: string) =>
    Promise.resolve(url.includes("by-slug") ? (reponses.shift() ?? ko) : ok({})),
  ) as unknown as typeof fetch;
}

/** Appels de scrollIntoView : id de l'élément et options. */
let defilements: Array<{ id: string; options: ScrollIntoViewOptions | undefined }> = [];
const recalages = () => defilements.filter((d) => d.options?.behavior === "instant");

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  defilements = [];
  Element.prototype.scrollIntoView = function (this: Element, options?: boolean | ScrollIntoViewOptions) {
    defilements.push({ id: this.id, options: typeof options === "object" ? options : undefined });
  };
  window.history.replaceState(null, "", "/parcours/repartie#etape-2");
});

afterEach(() => {
  delete (Element.prototype as Partial<Element>).scrollIntoView;
});

describe("s17 tour 4 : recalage de l'étape visée par l'ancre après le chargement Premium", () => {
  it("échec : la carte de l'étape est recalée une seule fois sous l'en-tête, focus intact", async () => {
    mockBySlug([ko, ko]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);

    await screen.findByTestId("etape-echec");
    expect(recalages()).toEqual([{ id: "etape-2", options: { behavior: "instant", block: "start" } }]);
    expect(document.getElementById("etape-2")).toHaveClass("scroll-mt-28");
    expect(document.activeElement).toBe(document.body);

    // « Réessayer » puis nouvel échec : plus de recalage (le focus revient au bouton, tour 2).
    await userEvent.click(screen.getByRole("button", { name: CHARGEMENT_ETAPE.reessayer }));
    await screen.findByTestId("etape-echec");
    expect(recalages()).toHaveLength(1);
  });

  it("contenu chargé : recalage unique sur l'étape ouverte", async () => {
    mockBySlug([ok({ path: buildPath(false), userProgress: ETAPE_1_FAITE })]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);

    await screen.findByText("Contenu 2");
    expect(recalages()).toEqual([{ id: "etape-2", options: { behavior: "instant", block: "start" } }]);
    expect(document.activeElement).toBe(document.body);
  });

  it("sans ancre : aucun recalage", async () => {
    window.history.replaceState(null, "", "/parcours/repartie");
    mockBySlug([ko]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);

    await screen.findByRole("alert");
    expect(recalages()).toHaveLength(0);
  });
});

describe("s17 tour 4 : survol de l'en-tête d'étape", () => {
  it("en-tête dépliable : titre souligné et chevron éclairci au survol", async () => {
    window.history.replaceState(null, "", "/parcours/repartie");
    mockBySlug([]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);
    await screen.findByRole("alert");

    const entete = document.getElementById("etape-1-entete");
    expect(entete).toHaveClass("group", "cursor-pointer");
    expect(entete?.querySelector("h3")).toHaveClass("group-hover:underline");
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParcoursDetail } from "@/components/parcours/parcours-detail";

// Mock progress bar
jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => (
    <div data-testid="progress-bar" data-value={props.value} data-max={props.max} />
  ),
}));

const mockPush = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
}));

// Build a mock API response based on the enriched seed structure
const mockPathData = {
  path: {
    id: "seed-machine-a-cafe",
    title: "Parcours Machine à Café",
    description: "Tu veux avoir des anecdotes",
    slug: "machine-a-cafe",
    duration: "3 semaines",
    difficulty: "DEBUTANT",
    icon: "☕",
    nextParcours: "repartie",
    nextParcoursReason: "Tu maîtrises les vannes. Passe à la répartie.",
    personaTagline: "Idéal si tu travailles en équipe",
    testimonial: "« Avant je restais muette à la machine à café. »",
    steps: [
      {
        id: "step-1",
        order: 1,
        dayNumber: 3,
        tip: {
          id: "tip-1",
          title: "Vannes courtes",
          content: "Apprends les one-liners.",
          category: "GENERAL",
          difficulty: "DEBUTANT",
          example: "Mon patron m'a dit...",
          exercise: "DÉFI : Mémorise 3 vannes",
        },
        moduleTitle: "Vannes courtes et mémorisables",
        moduleDetail: "Apprends à retenir et placer des one-liners.",
        moduleFormat: "Conseil technique + vannes à pratiquer + vidéo + quiz",
        moduleXp: 50,
        why: "Le terrain de jeu de Sophie : la pause café.",
        free: true,
        jokeIds: [7, 83, 41],
        videos: [
          {
            youtubeId: "GKJKPlf6EqA",
            artist: "Paul Séré",
            title: "Les relations amoureuses",
            why: "One-liners enchaînés.",
          },
        ],
        quiz: [
          {
            question: "Quelle est la clé d'une bonne vanne ?",
            options: [
              "La longueur du setup",
              "La surprise de la chute",
              "Parler fort",
              "Rire soi-même",
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "step-2",
        order: 2,
        dayNumber: 10,
        tip: {
          id: "tip-2",
          title: "Timing",
          content: "Le timing social.",
          category: "TIMING",
          difficulty: "DEBUTANT",
          example: "",
          exercise: "",
        },
        moduleTitle: "L'art du timing social",
        moduleDetail: "Quand placer ta blague.",
        moduleFormat: "Conseil technique + vidéo d'analyse + quiz",
        moduleXp: 75,
        why: "Sophie sait quoi dire mais pas QUAND.",
        free: false,
        jokeIds: [75, 172],
        videos: [],
        quiz: [],
      },
    ],
  },
  userProgress: null,
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockPathData,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  (global.fetch as jest.Mock).mockRestore?.();
});

describe("ParcoursDetail — enriched content", () => {
  it("renders loading skeleton then shows parcours title", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Parcours Machine à Café");
    });
  });

  it("shows personaTagline and testimonial", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText(/Idéal si tu travailles en équipe/)).toBeInTheDocument();
      expect(screen.getByText(/muette à la machine à café/)).toBeInTheDocument();
    });
  });

  it("shows XP from seed (not hardcoded +20)", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("+50 XP")).toBeInTheDocument();
      expect(screen.getByText("+75 XP")).toBeInTheDocument();
    });
  });

  it("shows total XP from seed", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("125 XP au total")).toBeInTheDocument();
    });
  });

  it("shows moduleTitle instead of tip.title in step header", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("Vannes courtes et mémorisables")).toBeInTheDocument();
      expect(screen.getByText("L'art du timing social")).toBeInTheDocument();
    });
  });

  it("shows Essai gratuit badge on free steps", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("Essai gratuit")).toBeInTheDocument();
    });
  });

  it("shows breadcrumb navigation", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("Parcours")).toBeInTheDocument();
      expect(screen.getByText("Accueil")).toBeInTheDocument();
    });
  });

  it("auto-expands first incomplete step and shows rich content", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 should auto-expand (first incomplete step)
    await waitFor(() => {
      expect(screen.getByText("Pourquoi ce module ?")).toBeInTheDocument();
    });
    expect(screen.getByText(/terrain de jeu de Sophie/)).toBeInTheDocument();
    expect(screen.getByText("Ce que tu vas apprendre")).toBeInTheDocument();
    expect(screen.getByText(/retenir et placer des one-liners/)).toBeInTheDocument();
    expect(screen.getByText(/Format :/)).toBeInTheDocument();
    expect(screen.getByText("Le conseil")).toBeInTheDocument();
    expect(screen.getByText("Exemple concret")).toBeInTheDocument();
    expect(screen.getByText("Exercice pratique")).toBeInTheDocument();
  });

  it("shows joke teaser with link to /vannes", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByText("Vannes à pratiquer")).toBeInTheDocument();
    });
    expect(screen.getByText(/3 vannes sélectionnées/)).toBeInTheDocument();
    expect(screen.getByText("Découvre-les dans le catalogue")).toBeInTheDocument();
  });

  it("shows video cards with thumbnails", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByText("Vidéos à regarder")).toBeInTheDocument();
    });
    expect(screen.getByText("Paul Séré")).toBeInTheDocument();
    expect(screen.getByText("Les relations amoureuses")).toBeInTheDocument();
    expect(screen.getByText("One-liners enchaînés.")).toBeInTheDocument();
  });

  it("shows quiz and allows answering", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByText("Teste tes connaissances")).toBeInTheDocument();
    });
    expect(screen.getByText("Quiz 1/1")).toBeInTheDocument();
    expect(screen.getByText("Quelle est la clé d'une bonne vanne ?")).toBeInTheDocument();

    // Answer correctly
    await userEvent.click(screen.getByText("La surprise de la chute"));

    // Should show result feedback
    expect(screen.getByText("Voir le résultat")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Voir le résultat"));

    expect(screen.getByText("Parfait !")).toBeInTheDocument();
    expect(screen.getByText("Continuer")).toBeInTheDocument();
  });

  it("shows cross-recommendation to next parcours", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText(/Découvre le parcours suivant/)).toBeInTheDocument();
    });
  });

  it("shows sequential lock on step 2 when step 1 is not completed", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("L'art du timing social")).toBeInTheDocument();
    });

    // Step 2 should show lock indicator
    expect(screen.getByText(/Termine l'étape 1 pour débloquer/)).toBeInTheDocument();

    // Step 2 header should NOT be expandable (no role=button)
    const step2Header = screen.getByLabelText(/Étape 2.*verrouillée/);
    expect(step2Header).toBeInTheDocument();
  });

  it("shows error state on fetch failure", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    render(<ParcoursDetail slug="nonexistent" />);
    await waitFor(() => {
      expect(screen.getByText(/Impossible de charger ce parcours/)).toBeInTheDocument();
    });
    expect(screen.getByText("Voir tous les parcours")).toBeInTheDocument();
  });

  it("shows progress bar", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    });
  });
});

describe("ParcoursDetail — completed parcours CTA", () => {
  it("shows end-of-parcours CTA when all steps completed", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockPathData,
        userProgress: {
          completedSteps: [1, 2],
          currentStep: 2,
          completedAt: "2026-03-18T00:00:00Z",
        },
      }),
    });

    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test" } },
      status: "authenticated",
    });

    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText(/Bravo, tu as terminé/)).toBeInTheDocument();
      expect(screen.getByText("Passer au parcours suivant")).toBeInTheDocument();
      expect(screen.getByText(/Passe à la répartie/)).toBeInTheDocument();
    });
  });
});

describe("ParcoursDetail — seed fallback", () => {
  it("shows fallback message instead of complete button when path is seed-based", async () => {
    const seedFallbackData = {
      path: {
        ...mockPathData.path,
        id: "seed-machine-a-cafe",
        steps: mockPathData.path.steps.map((s, i) => ({
          ...s,
          id: `seed-step-${i + 1}`,
        })),
      },
      userProgress: null,
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => seedFallbackData,
    });

    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test" } },
      status: "authenticated",
    });

    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Parcours Machine à Café");
    });

    // Should NOT show "Marquer comme terminé" button
    await waitFor(() => {
      expect(screen.getByText(/progression sera disponible/)).toBeInTheDocument();
    });
    expect(screen.queryByText("Marquer comme terminé")).not.toBeInTheDocument();
  });
});

describe("ParcoursDetail — quiz gate", () => {
  it("requires quiz completion before step can be validated", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test" } },
      status: "authenticated",
    });

    // Use a non-seed path ID so complete button shows
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        path: {
          ...mockPathData.path,
          id: "db-path-123",
        },
        userProgress: { completedSteps: [], currentStep: 0, completedAt: null },
      }),
    });

    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands, quiz is shown, button should be disabled
    await waitFor(() => {
      expect(screen.getByText("Teste tes connaissances")).toBeInTheDocument();
    });

    // The button should say "Termine le quiz"
    expect(screen.getByText("Termine le quiz pour valider cette étape")).toBeInTheDocument();
    expect(screen.queryByText("Marquer comme terminé")).not.toBeInTheDocument();

    // Complete the quiz
    await userEvent.click(screen.getByText("La surprise de la chute"));
    await userEvent.click(screen.getByText("Voir le résultat"));
    await userEvent.click(screen.getByText("Continuer"));

    // Now the complete button should appear
    await waitFor(() => {
      expect(screen.getByText("Marquer comme terminé")).toBeInTheDocument();
    });
  });
});

describe("ParcoursDetail — sequential unlock for authenticated users", () => {
  it("unlocks step 2 when step 1 is completed", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test" } },
      status: "authenticated",
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockPathData,
        path: { ...mockPathData.path, id: "db-path-123" },
        userProgress: {
          completedSteps: [1],
          currentStep: 1,
          completedAt: null,
        },
      }),
    });

    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 2 auto-expands (first incomplete step)
    await waitFor(() => {
      expect(screen.getByText("L'art du timing social")).toBeInTheDocument();
    });

    // Step 2 should NOT show lock message (step 1 is completed)
    expect(screen.queryByText(/Termine l'étape 1 pour débloquer/)).not.toBeInTheDocument();

    // Step 2 content should be accessible
    await waitFor(() => {
      expect(screen.getByText(/sait quoi dire mais pas QUAND/)).toBeInTheDocument();
    });
  });
});

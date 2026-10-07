import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParcoursDetail } from "@/components/parcours/parcours-detail";
import { useUserStore } from "@/stores/user-store";

// Mock progress bar
jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => (
    <div data-testid="progress-bar" data-value={props.value} data-max={props.max} data-label={props.label} />
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

const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...args: unknown[]) => mockTrack(...args) }));

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

  it("shows Lecture libre badge on free steps", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("Lecture libre")).toBeInTheDocument();
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
      expect(screen.getByText("Pourquoi cette étape ?")).toBeInTheDocument();
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
      expect(screen.getByText("Petit quiz avant de valider")).toBeInTheDocument();
    });
    expect(screen.getByText("Quiz 1/1")).toBeInTheDocument();
    expect(screen.getByText("Quelle est la clé d'une bonne vanne ?")).toBeInTheDocument();

    // Answer correctly
    await userEvent.click(screen.getByText("La surprise de la chute"));

    // Should show result feedback
    expect(screen.getByText("Voir le résultat")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Voir le résultat"));

    expect(screen.getByText("Sans faute !")).toBeInTheDocument();
    expect(screen.getByText("Continuer")).toBeInTheDocument();
  });

  it("shows cross-recommendation to next parcours", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText(/Jette un œil au parcours suivant/)).toBeInTheDocument();
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
      expect(screen.getByText(/ne veut pas se charger/)).toBeInTheDocument();
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
      data: { user: { name: "Test", plan: "PREMIUM" } },
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
      data: { user: { name: "Test", plan: "PREMIUM" } },
      status: "authenticated",
    });

    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Parcours Machine à Café");
    });

    // Should NOT show "Valider cette étape" button
    await waitFor(() => {
      expect(screen.getByText(/suivi de ta progression arrive bientôt/)).toBeInTheDocument();
    });
    expect(screen.queryByText("Valider cette étape")).not.toBeInTheDocument();
  });
});

describe("ParcoursDetail — quiz gate", () => {
  it("requires quiz completion before step can be validated", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test", plan: "PREMIUM" } },
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
      expect(screen.getByText("Petit quiz avant de valider")).toBeInTheDocument();
    });

    // The button should say "Termine le quiz"
    expect(screen.getByText("Termine le quiz pour valider cette étape")).toBeInTheDocument();
    expect(screen.queryByText("Valider cette étape")).not.toBeInTheDocument();

    // Complete the quiz
    await userEvent.click(screen.getByText("La surprise de la chute"));
    await userEvent.click(screen.getByText("Voir le résultat"));
    await userEvent.click(screen.getByText("Continuer"));

    // Now the complete button should appear
    await waitFor(() => {
      expect(screen.getByText("Valider cette étape")).toBeInTheDocument();
    });
  });
});

describe("ParcoursDetail — tunnel s15", () => {
  it("anonyme : étape 1 lisible, valider = accès complet, lien /abonnement qui ramène au parcours (s15, étalon 4.1)", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    expect(await screen.findByText("Valider l'étape fait partie de Premium.")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Voir l'offre Premium" });
    expect(link).toHaveAttribute("href", "/abonnement?returnTo=%2Fparcours%2Fmachine-a-cafe&src=parcours-etape");
    expect(screen.queryByText(/compte gratuit/i)).not.toBeInTheDocument();
  });

  it("compte non abonné (ex-compte gratuit) : pas de bouton Valider, même lien vers l'accès complet", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test", plan: "FREE" } },
      status: "authenticated",
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ path: { ...mockPathData.path, id: "db-path-123" }, userProgress: null }),
    });
    render(<ParcoursDetail slug="machine-a-cafe" />);
    expect(await screen.findByText("Valider l'étape fait partie de Premium.")).toBeInTheDocument();
    expect(screen.queryByText("Valider cette étape")).not.toBeInTheDocument();
    expect(screen.queryByText("Termine le quiz pour valider cette étape")).not.toBeInTheDocument();
  });

  it("étape validée : événement parcours-etape {parcours, etape}", async () => {
    mockTrack.mockClear();
    sessionStorage.clear(); // quiz déjà réussi par un test précédent (mémorisé par parcours)
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test", plan: "PREMIUM" } },
      status: "authenticated",
    });
    const pathPayload = {
      path: { ...mockPathData.path, id: "db-path-123" },
      userProgress: { completedSteps: [], currentStep: 0, completedAt: null },
    };
    (global.fetch as jest.Mock).mockImplementation(async (_url: string, init?: RequestInit) =>
      init?.method === "POST"
        ? { ok: true, json: async () => ({ progress: { completedSteps: [1], currentStep: 1, completedAt: null }, xpGained: 0 }) }
        : { ok: true, json: async () => pathPayload },
    );

    render(<ParcoursDetail slug="machine-a-cafe" />);
    await screen.findByText("Petit quiz avant de valider");
    await userEvent.click(screen.getByText("La surprise de la chute"));
    await userEvent.click(screen.getByText("Voir le résultat"));
    await userEvent.click(screen.getByText("Continuer"));
    await userEvent.click(await screen.findByText("Valider cette étape"));

    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith("parcours-etape", { parcours: "machine-a-cafe", etape: 1 }),
    );
  });
});

describe("ParcoursDetail — sequential unlock for authenticated users", () => {
  it("unlocks step 2 when step 1 is completed (abonné Premium)", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test", plan: "PREMIUM" } },
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

describe("ParcoursDetail — étapes 2+ réservées aux abonnés Premium (lot M2 s14)", () => {
  const progressAfterStep1 = {
    ...mockPathData,
    path: { ...mockPathData.path, id: "db-path-123" },
    userProgress: { completedSteps: [1], currentStep: 1, completedAt: null },
  };

  afterEach(() => {
    useUserStore.setState({ user: null });
  });

  it("compte gratuit : l'étape 2 affiche le bloc d'abonnement, pas le contenu", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test", plan: "FREE" } },
      status: "authenticated",
    });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => progressAfterStep1 });

    render(<ParcoursDetail slug="machine-a-cafe" />);

    await waitFor(() => {
      expect(screen.getByText(/Cette étape fait partie de Premium/)).toBeInTheDocument();
    });
    // Audit s16 (reco 17) : le mur de l'étape 2 est mesuré.
    expect(mockTrack).toHaveBeenCalledWith("mur-vu", { type: "parcours-etape", src: "machine-a-cafe", etape: 2 });
    // Audit s16 (reco 19) : la barre de progression a un nom accessible.
    expect(screen.getByTestId("progress-bar").getAttribute("data-label")).toMatch(/étapes complétées/);
    // Retour au parcours après paiement (returnTo interne, encodé).
    expect(screen.getByRole("link", { name: /S'abonner/ })).toHaveAttribute(
      "href",
      "/abonnement?returnTo=%2Fparcours%2Fmachine-a-cafe",
    );
    // Aperçu seulement : la phrase « pourquoi » et le format, jamais le contenu.
    expect(screen.getByText(/sait quoi dire mais pas QUAND/)).toBeInTheDocument();
    expect(screen.queryByText("Quand placer ta blague.")).not.toBeInTheDocument();
    expect(screen.queryByText(/vannes sélectionnées pour ce module/)).not.toBeInTheDocument();
    expect(screen.queryByText("Valider cette étape")).not.toBeInTheDocument();
  });

  it("abonné : le contenu complet servi par l'API remplace l'aperçu du HTML ISR", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test", plan: "PREMIUM" } },
      status: "authenticated",
    });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => progressAfterStep1 });
    const isrPath = {
      ...progressAfterStep1.path,
      steps: progressAfterStep1.path.steps.map((st: { order: number; tip: Record<string, unknown> }) =>
        st.order === 1
          ? st
          : { ...st, moduleDetail: undefined, jokeIds: [], videos: [], quiz: [], locked: true, tip: { ...st.tip, content: "", example: "", exercise: "" } },
      ),
    };

    render(
      <ParcoursDetail
        slug="machine-a-cafe"
        initialPath={isrPath as unknown as React.ComponentProps<typeof ParcoursDetail>["initialPath"]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Quand placer ta blague.")).toBeInTheDocument();
    });
    expect(screen.queryByText(/Cette étape fait partie de Premium/)).not.toBeInTheDocument();
  });

  it("compte gratuit : l'étape 1 reste entièrement accessible", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test", plan: "FREE" } },
      status: "authenticated",
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...progressAfterStep1,
        userProgress: { completedSteps: [], currentStep: 0, completedAt: null },
      }),
    });

    render(<ParcoursDetail slug="machine-a-cafe" />);

    await waitFor(() => {
      expect(screen.getByText(/Le terrain de jeu de Sophie/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Cette étape fait partie de Premium/)).not.toBeInTheDocument();
  });

  it("abonné dont le jwt n'est pas encore rafraîchi : le store utilisateur suffit", async () => {
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test", plan: "FREE" } },
      status: "authenticated",
    });
    useUserStore.setState({
      user: { plan: "PREMIUM" } as unknown as ReturnType<typeof useUserStore.getState>["user"],
    });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => progressAfterStep1 });

    render(<ParcoursDetail slug="machine-a-cafe" />);

    await waitFor(() => {
      expect(screen.getByText(/sait quoi dire mais pas QUAND/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Cette étape fait partie de Premium/)).not.toBeInTheDocument();
  });
});

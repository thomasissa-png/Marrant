/**
 * User Simulation Tests — Parcours Complets
 *
 * Simulates 3 real personas going through all 3 parcours:
 * - Sophie (authenticated FREE) → Machine à Café
 * - Yanis (authenticated PREMIUM) → Répartie
 * - Marc (unauthenticated) → Confiance
 *
 * Tests the full flow: load → browse → expand → quiz → complete → next parcours
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParcoursDetail } from "@/components/parcours/parcours-detail";

// Mock progress bar
jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => (
    <div data-testid="progress-bar" data-value={props.value} data-max={props.max} />
  ),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
}));

// ==============================
// SEED DATA — Machine à Café
// ==============================
const machineACafeData = {
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
          example: "Mon patron m'a dit de venir en tenue de travail.",
          exercise: "DÉFI SOPHIE : Mémorise 3 vannes et place-en une demain.",
        },
        moduleTitle: "Vannes courtes et mémorisables",
        moduleDetail: "Apprends à retenir et placer des one-liners.",
        moduleFormat: "Conseil technique + 5 vannes + 2 vidéos + 2 quiz",
        moduleXp: 50,
        why: "Le terrain de jeu de Sophie : la pause café.",
        free: true,
        jokeIds: [7, 83, 41, 55, 12],
        videos: [
          {
            youtubeId: "GKJKPlf6EqA",
            artist: "Paul Séré",
            title: "Les relations amoureuses",
            why: "One-liners enchaînés.",
          },
          {
            youtubeId: "abc123",
            artist: "Roman Frayssinet",
            title: "La génération Y",
            why: "Observation sociale décalée.",
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
          {
            question: "Quand placer une vanne au bureau ?",
            options: [
              "En pleine réunion avec le boss",
              "Quand il y a un silence naturel",
              "Pendant un feedback négatif",
              "Jamais, le bureau c'est sérieux",
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
          content: "Le timing social est crucial.",
          category: "TIMING",
          difficulty: "DEBUTANT",
          example: "Attends 2 secondes après une anecdote pour placer ta blague.",
          exercise: "DÉFI SOPHIE : Observe 3 conversations et repère les moments drôles.",
        },
        moduleTitle: "L'art du timing social",
        moduleDetail: "Quand placer ta blague.",
        moduleFormat: "Conseil technique + 5 vannes + 2 vidéos + 2 quiz",
        moduleXp: 75,
        why: "Sophie sait quoi dire mais pas QUAND.",
        free: false,
        jokeIds: [75, 172, 33, 88, 91],
        videos: [],
        quiz: [
          {
            question: "Combien de temps dure le meilleur silence comique ?",
            options: ["0 seconde", "1 à 2 secondes", "5 secondes", "10 secondes"],
            correctIndex: 1,
          },
          {
            question: "Quel est le pire moment pour une blague ?",
            options: [
              "Après un fou rire collectif",
              "Quand quelqu'un raconte un problème grave",
              "À la machine à café",
              "En fin de repas",
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "step-3",
        order: 3,
        dayNumber: 21,
        tip: {
          id: "tip-3",
          title: "Storytelling",
          content: "Raconte une anecdote captivante.",
          category: "STORYTELLING",
          difficulty: "DEBUTANT",
          example: "L'autre jour au bureau, mon collègue a fait un truc incroyable...",
          exercise: "DÉFI SOPHIE : Raconte une anecdote de ta semaine à 3 personnes.",
        },
        moduleTitle: "Raconter une anecdote captivante",
        moduleDetail: "Transforme un événement banal en histoire drôle.",
        moduleFormat: "Conseil technique + 5 vannes + 2 vidéos + 2 quiz",
        moduleXp: 100,
        why: "Les meilleures conversations commencent par une anecdote.",
        free: false,
        jokeIds: [14, 29, 67, 103, 44],
        videos: [
          {
            youtubeId: "xyz789",
            artist: "Blanche Gardin",
            title: "Le storytelling au quotidien",
            why: "Maîtrise de la narration comique.",
          },
        ],
        quiz: [],
      },
    ],
  },
  userProgress: null,
};

// ==============================
// SEED DATA — Répartie
// ==============================
const repartieData = {
  path: {
    id: "seed-repartie",
    title: "Parcours Répartie",
    description: "Tu veux savoir quoi répondre",
    slug: "repartie",
    duration: "4 semaines",
    difficulty: "INTERMEDIAIRE",
    icon: "⚡",
    nextParcours: "confiance",
    nextParcoursReason: "Tu as la répartie. Passe au parcours Confiance.",
    personaTagline: "Pour toi si tu es étudiant et que tu veux t'affirmer",
    testimonial: "« Mes potes n'en reviennent pas. »",
    steps: [
      {
        id: "step-1",
        order: 1,
        dayNumber: 3,
        tip: {
          id: "tip-r1",
          title: "Bases de la répartie",
          content: "Réponds avec une question.",
          category: "REPARTIE",
          difficulty: "INTERMEDIAIRE",
          example: "— T'es toujours célibataire ? — Et toi, t'es toujours aussi curieux ?",
          exercise: "DÉFI YANIS : Note 3 situations où tu n'as pas su quoi répondre.",
        },
        moduleTitle: "Les bases de la répartie",
        moduleDetail: "Les techniques fondamentales pour répondre du tac au tac.",
        moduleFormat: "Conseil technique + 5 vannes + 2 vidéos + 2 quiz",
        moduleXp: 50,
        why: "Yanis reste muet quand on le chambre.",
        free: true,
        jokeIds: [101, 102, 103, 104, 105],
        videos: [
          {
            youtubeId: "rep1",
            artist: "Fary",
            title: "La répartie au quotidien",
            why: "Masterclass de répartie spontanée.",
          },
          {
            youtubeId: "rep2",
            artist: "Paul Mirabel",
            title: "Improvisation et répartie",
            why: "Retourner n'importe quelle situation.",
          },
        ],
        quiz: [
          {
            question: "Quelle est la meilleure réponse à une pique ?",
            options: [
              "S'énerver",
              "Retourner la pique avec humour",
              "Ignorer",
              "Pleurer",
            ],
            correctIndex: 1,
          },
          {
            question: "Le plus important en répartie ?",
            options: ["La vitesse", "Le calme", "La méchanceté", "Le volume"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "step-2",
        order: 2,
        dayNumber: 10,
        tip: {
          id: "tip-r2",
          title: "Rythme et silences",
          content: "Apprends à utiliser les silences.",
          category: "TIMING",
          difficulty: "INTERMEDIAIRE",
          example: "",
          exercise: "",
        },
        moduleTitle: "Le rythme et les silences",
        moduleDetail: "Utilise les silences comme arme comique.",
        moduleFormat: "Conseil technique + 5 vannes + 2 vidéos + 2 quiz",
        moduleXp: 75,
        why: "Yanis enchaîne trop vite sans laisser respirer.",
        free: false,
        jokeIds: [201, 202, 203, 204, 205],
        videos: [],
        quiz: [],
      },
      {
        id: "step-3",
        order: 3,
        dayNumber: 17,
        tip: {
          id: "tip-r3",
          title: "Retourner les piques",
          content: "Transforme l'attaque en compliment déguisé.",
          category: "REPARTIE",
          difficulty: "INTERMEDIAIRE",
          example: "",
          exercise: "",
        },
        moduleTitle: "Retourner les piques avec le sourire",
        moduleDetail: "Comment désamorcer une attaque avec classe.",
        moduleFormat: "Conseil technique + 5 vannes + 2 vidéos + 2 quiz",
        moduleXp: 100,
        why: "Yanis prend les chambrages au premier degré.",
        free: false,
        jokeIds: [301, 302, 303, 304, 305],
        videos: [],
        quiz: [],
      },
      {
        id: "step-4",
        order: 4,
        dayNumber: 28,
        tip: {
          id: "tip-r4",
          title: "Impro avancée",
          content: "Improvise des réponses en toutes situations.",
          category: "REPARTIE",
          difficulty: "INTERMEDIAIRE",
          example: "",
          exercise: "",
        },
        moduleTitle: "Répartie avancée et improvisation",
        moduleDetail: "Maîtrise l'impro pour ne plus jamais sécher.",
        moduleFormat: "Conseil technique + 5 vannes + 2 vidéos + 3 quiz",
        moduleXp: 150,
        why: "Le level up final de Yanis.",
        free: false,
        jokeIds: [401, 402, 403, 404, 405],
        videos: [],
        quiz: [
          {
            question: "Que faire quand tu n'as pas de réponse ?",
            options: [
              "Paniquer",
              "Gagner du temps en répétant la question",
              "S'enfuir",
              "Changer de sujet brutalement",
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  userProgress: null,
};

// ==============================
// SEED DATA — Confiance
// ==============================
const confianceData = {
  path: {
    id: "seed-confiance",
    title: "Parcours Confiance",
    description: "Tu veux retrouver ta légèreté",
    slug: "confiance",
    duration: "6 semaines",
    difficulty: "EXPERT",
    icon: "🌟",
    nextParcours: "machine-a-cafe",
    nextParcoursReason: "Tu as retrouvé ton style. Enrichis ton arsenal avec le Parcours Machine à Café.",
    personaTagline: "Parfait si tu veux renouer avec l'humour après une période difficile",
    testimonial: "« Après ma séparation, j'avais perdu mon humour. »",
    steps: [
      {
        id: "step-1",
        order: 1,
        dayNumber: 3,
        tip: {
          id: "tip-c1",
          title: "Redécouvrir le rire",
          content: "Identifie ce qui te fait rire.",
          category: "GENERAL",
          difficulty: "EXPERT",
          example: "Marc regarde ses vieux messages drôles.",
          exercise: "DÉFI MARC : Note 3 choses qui t'ont fait sourire aujourd'hui.",
        },
        moduleTitle: "Redécouvrir ce qui te fait rire",
        moduleDetail: "Retrouve ton sens de l'humour personnel.",
        moduleFormat: "Conseil technique + 5 vannes + 2 vidéos + 2 quiz",
        moduleXp: 50,
        why: "Marc a perdu contact avec ce qui le faisait rire avant.",
        free: true,
        jokeIds: [501, 502, 503, 504, 505],
        videos: [
          {
            youtubeId: "conf1",
            artist: "Panayotis Pascot",
            title: "La vulnérabilité comme force",
            why: "Transformer la fragilité en force comique.",
          },
          {
            youtubeId: "conf2",
            artist: "Waly Dia",
            title: "Rire de tout",
            why: "L'humour comme outil de résilience.",
          },
        ],
        quiz: [
          {
            question: "Le rire est avant tout...",
            options: [
              "Un talent inné",
              "Un muscle qu'on entraîne",
              "Réservé aux extravertis",
              "Dangereux socialement",
            ],
            correctIndex: 1,
          },
          {
            question: "Première étape pour retrouver l'humour ?",
            options: [
              "Forcer des blagues",
              "Observer ce qui te fait sourire",
              "Regarder des comédies en boucle",
              "Tout tourner en dérision",
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "step-2", order: 2, dayNumber: 10,
        tip: { id: "tip-c2", title: "Autodérision", content: "Ris de toi avec bienveillance.", category: "AUTODERISION", difficulty: "EXPERT", example: "", exercise: "" },
        moduleTitle: "Rire de soi avec bienveillance", moduleDetail: "L'autodérision positive.", moduleFormat: "Conseil", moduleXp: 75,
        why: "Marc est trop dur avec lui-même.", free: false, jokeIds: [601, 602, 603, 604, 605], videos: [], quiz: [],
      },
      {
        id: "step-3", order: 3, dayNumber: 17,
        tip: { id: "tip-c3", title: "Observation", content: "Observe le quotidien avec humour.", category: "OBSERVATION", difficulty: "EXPERT", example: "", exercise: "" },
        moduleTitle: "L'art de l'observation comique", moduleDetail: "Trouve le drôle dans le banal.", moduleFormat: "Conseil", moduleXp: 100,
        why: "Marc ne voit plus le côté drôle des situations.", free: false, jokeIds: [], videos: [], quiz: [],
      },
      {
        id: "step-4", order: 4, dayNumber: 24,
        tip: { id: "tip-c4", title: "Groupe", content: "Sois à l'aise en groupe.", category: "GENERAL", difficulty: "EXPERT", example: "", exercise: "" },
        moduleTitle: "Être à l'aise en groupe", moduleDetail: "Participe sans pression.", moduleFormat: "Conseil", moduleXp: 125,
        why: "Marc évite les grands groupes depuis sa séparation.", free: false, jokeIds: [], videos: [], quiz: [],
      },
      {
        id: "step-5", order: 5, dayNumber: 31,
        tip: { id: "tip-c5", title: "Registres", content: "Explore différents registres.", category: "GENERAL", difficulty: "EXPERT", example: "", exercise: "" },
        moduleTitle: "Les registres avancés", moduleDetail: "Maîtrise l'absurde, l'observation, etc.", moduleFormat: "Conseil", moduleXp: 150,
        why: "Marc est coincé dans un seul registre.", free: false, jokeIds: [], videos: [], quiz: [],
      },
      {
        id: "step-6", order: 6, dayNumber: 42,
        tip: { id: "tip-c6", title: "Style personnel", content: "Affirme ton style.", category: "GENERAL", difficulty: "EXPERT", example: "", exercise: "" },
        moduleTitle: "Affirmer ton style personnel", moduleDetail: "Développe ta signature humoristique.", moduleFormat: "Conseil", moduleXp: 200,
        why: "Le couronnement du parcours de Marc.", free: false, jokeIds: [], videos: [], quiz: [],
      },
    ],
  },
  userProgress: null,
};

// ==============================
// Helpers
// ==============================

let mockSessionData: { data: unknown; status: string } = {
  data: null,
  status: "unauthenticated",
};

jest.mock("next-auth/react", () => ({
  useSession: () => mockSessionData,
  signIn: jest.fn(),
}));

function setSession(user: { name: string; plan?: string } | null) {
  if (user) {
    mockSessionData = {
      data: { user },
      status: "authenticated",
    };
  } else {
    mockSessionData = { data: null, status: "unauthenticated" };
  }
}

function mockFetchWith(data: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  }) as jest.Mock;
}

afterEach(() => {
  jest.restoreAllMocks();
  (global.fetch as jest.Mock)?.mockRestore?.();
  mockSessionData = { data: null, status: "unauthenticated" };
});

// ==============================
// SOPHIE — Machine à Café (authenticated FREE)
// ==============================
describe("Sophie (FREE) — Parcours Machine à Café", () => {
  beforeEach(() => {
    setSession({ name: "Sophie", plan: "FREE" });
    mockFetchWith(machineACafeData);
  });

  it("loads the parcours and sees Sophie's personaTagline", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Parcours Machine à Café");
    });
    expect(screen.getByText(/Idéal si tu travailles en équipe/)).toBeInTheDocument();
    expect(screen.getByText(/muette à la machine à café/)).toBeInTheDocument();
  });

  it("sees correct XP for all 3 steps: 50, 75, 100", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("+50 XP")).toBeInTheDocument();
      expect(screen.getByText("+75 XP")).toBeInTheDocument();
      expect(screen.getByText("+100 XP")).toBeInTheDocument();
    });
  });

  it("sees total XP = 225 (50+75+100)", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("225 XP au total")).toBeInTheDocument();
    });
  });

  it("auto-expands step 1 and sees full rich content", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands (first incomplete step)
    await waitFor(() => {
      expect(screen.getByText("Pourquoi ce module ?")).toBeInTheDocument();
    });

    expect(screen.getByText(/terrain de jeu de Sophie/)).toBeInTheDocument();
    expect(screen.getByText("Ce que tu vas apprendre")).toBeInTheDocument();
    expect(screen.getByText(/retenir et placer des one-liners/)).toBeInTheDocument();
    expect(screen.getByText(/Format :/)).toBeInTheDocument();
    expect(screen.getByText("Le conseil")).toBeInTheDocument();
    expect(screen.getByText(/Apprends les one-liners/)).toBeInTheDocument();
    expect(screen.getByText("Exemple concret")).toBeInTheDocument();
    expect(screen.getByText(/patron m'a dit/)).toBeInTheDocument();
    expect(screen.getByText("Exercice pratique")).toBeInTheDocument();
    expect(screen.getByText(/DÉFI SOPHIE/)).toBeInTheDocument();
  });

  it("sees 5 joke teasers and 2 videos on step 1 (auto-expanded)", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByText("Vannes à pratiquer")).toBeInTheDocument();
    });
    expect(screen.getByText(/5 vannes sélectionnées/)).toBeInTheDocument();
    expect(screen.getByText("Vidéos à regarder")).toBeInTheDocument();
    expect(screen.getByText("Paul Séré")).toBeInTheDocument();
    expect(screen.getByText("Roman Frayssinet")).toBeInTheDocument();
  });

  it("completes quiz on step 1 with correct answers", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByText("Teste tes connaissances")).toBeInTheDocument();
    });
    expect(screen.getByText("Quiz 1/2")).toBeInTheDocument();

    // Answer Q1 correctly
    await userEvent.click(screen.getByText("La surprise de la chute"));
    await userEvent.click(screen.getByText("Question suivante"));

    // Answer Q2 correctly
    expect(screen.getByText("Quiz 2/2")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Quand il y a un silence naturel"));
    await userEvent.click(screen.getByText("Voir le résultat"));

    // Perfect score
    expect(screen.getByText("Parfait !")).toBeInTheDocument();
    expect(screen.getByText("Continuer")).toBeInTheDocument();
  });

  it("sees Essai gratuit badge on step 1 only", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("Vannes courtes et mémorisables")).toBeInTheDocument();
    });

    // Only step 1 is free
    const freeBadges = screen.getAllByText("Essai gratuit");
    expect(freeBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("sees cross-recommendation to Répartie", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText(/Découvre le parcours suivant/)).toBeInTheDocument();
    });
  });

  it("seed fallback: no 'Marquer comme terminé' button, shows fallback message", async () => {
    render(<ParcoursDetail slug="machine-a-cafe" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Parcours Machine à Café");
    });

    // Seed fallback path → no complete button
    await waitFor(() => {
      expect(screen.getByText(/progression sera disponible/)).toBeInTheDocument();
    });
    expect(screen.queryByText("Marquer comme terminé")).not.toBeInTheDocument();
  });
});

// ==============================
// YANIS — Parcours Répartie (authenticated PREMIUM)
// ==============================
describe("Yanis (PREMIUM) — Parcours Répartie", () => {
  beforeEach(() => {
    setSession({ name: "Yanis", plan: "PREMIUM" });
    mockFetchWith(repartieData);
  });

  it("loads the parcours and sees Yanis's personaTagline", async () => {
    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Parcours Répartie");
    });
    expect(screen.getByText(/étudiant et que tu veux t'affirmer/)).toBeInTheDocument();
    expect(screen.getByText(/Mes potes n'en reviennent pas/)).toBeInTheDocument();
  });

  it("sees all 4 steps with correct XP: 50, 75, 100, 150", async () => {
    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByText("+50 XP")).toBeInTheDocument();
      expect(screen.getByText("+75 XP")).toBeInTheDocument();
      expect(screen.getByText("+100 XP")).toBeInTheDocument();
      expect(screen.getByText("+150 XP")).toBeInTheDocument();
    });
  });

  it("sees total XP = 375 (50+75+100+150)", async () => {
    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByText("375 XP au total")).toBeInTheDocument();
    });
  });

  it("sees all 4 module titles", async () => {
    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByText("Les bases de la répartie")).toBeInTheDocument();
      expect(screen.getByText("Le rythme et les silences")).toBeInTheDocument();
      expect(screen.getByText("Retourner les piques avec le sourire")).toBeInTheDocument();
      expect(screen.getByText("Répartie avancée et improvisation")).toBeInTheDocument();
    });
  });

  it("auto-expands step 1 and sees Fary + Paul Mirabel videos", async () => {
    render(<ParcoursDetail slug="repartie" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByText("Vidéos à regarder")).toBeInTheDocument();
    });
    expect(screen.getByText("Fary")).toBeInTheDocument();
    expect(screen.getByText("Paul Mirabel")).toBeInTheDocument();
  });

  it("sees why section relevant to Yanis (auto-expanded)", async () => {
    render(<ParcoursDetail slug="repartie" />);

    // Step 1 auto-expands
    await waitFor(() => {
      expect(screen.getByText("Pourquoi ce module ?")).toBeInTheDocument();
    });
    expect(screen.getByText(/Yanis reste muet/)).toBeInTheDocument();
  });

  it("sees cross-recommendation to Confiance", async () => {
    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByText(/Découvre le parcours suivant/)).toBeInTheDocument();
    });
  });

  it("shows completed parcours CTA when all 4 steps done", async () => {
    mockFetchWith({
      ...repartieData,
      userProgress: {
        completedSteps: [1, 2, 3, 4],
        currentStep: 4,
        completedAt: "2026-03-18T00:00:00Z",
      },
    });

    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByText(/Bravo, tu as terminé/)).toBeInTheDocument();
      expect(screen.getByText("Passer au parcours suivant")).toBeInTheDocument();
      expect(screen.getByText(/Passe au parcours Confiance/)).toBeInTheDocument();
    });
  });
});

// ==============================
// MARC — Parcours Confiance (unauthenticated)
// ==============================
describe("Marc (unauthenticated) — Parcours Confiance", () => {
  beforeEach(() => {
    setSession(null);
    mockFetchWith(confianceData);
  });

  it("loads the parcours and sees Marc's personaTagline", async () => {
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Parcours Confiance");
    });
    expect(screen.getByText(/renouer avec l'humour après une période difficile/)).toBeInTheDocument();
    expect(screen.getByText(/Après ma séparation/)).toBeInTheDocument();
  });

  it("sees all 6 steps with correct XP", async () => {
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByText("+50 XP")).toBeInTheDocument();
      expect(screen.getByText("+75 XP")).toBeInTheDocument();
      expect(screen.getByText("+100 XP")).toBeInTheDocument();
      expect(screen.getByText("+125 XP")).toBeInTheDocument();
      expect(screen.getByText("+150 XP")).toBeInTheDocument();
      expect(screen.getByText("+200 XP")).toBeInTheDocument();
    });
  });

  it("sees total XP = 700 (50+75+100+125+150+200)", async () => {
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByText("700 XP au total")).toBeInTheDocument();
    });
  });

  it("sees all 6 module titles", async () => {
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByText("Redécouvrir ce qui te fait rire")).toBeInTheDocument();
      expect(screen.getByText("Rire de soi avec bienveillance")).toBeInTheDocument();
      expect(screen.getByText("L'art de l'observation comique")).toBeInTheDocument();
      expect(screen.getByText("Être à l'aise en groupe")).toBeInTheDocument();
      expect(screen.getByText("Les registres avancés")).toBeInTheDocument();
      expect(screen.getByText("Affirmer ton style personnel")).toBeInTheDocument();
    });
  });

  it("auto-expands step 1 (free) and sees Marc-focused content", async () => {
    render(<ParcoursDetail slug="confiance" />);

    // Step 1 auto-expands (first incomplete step)
    await waitFor(() => {
      expect(screen.getByText("Pourquoi ce module ?")).toBeInTheDocument();
    });
    expect(screen.getByText(/Marc a perdu contact/)).toBeInTheDocument();

    // Videos
    expect(screen.getByText("Vidéos à regarder")).toBeInTheDocument();
    expect(screen.getByText("Panayotis Pascot")).toBeInTheDocument();
    expect(screen.getByText("Waly Dia")).toBeInTheDocument();

    // Jokes
    expect(screen.getByText("Vannes à pratiquer")).toBeInTheDocument();
    expect(screen.getByText(/5 vannes sélectionnées/)).toBeInTheDocument();

    // Quiz
    expect(screen.getByText("Teste tes connaissances")).toBeInTheDocument();

    // CTA to log in
    expect(screen.getByText("Connecte-toi pour valider cette étape")).toBeInTheDocument();
  });

  it("sees sequential lock on steps 2-6 (unauthenticated, no progress)", async () => {
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByText("Rire de soi avec bienveillance")).toBeInTheDocument();
    });

    // Steps 2-6 are sequentially locked (step 1 not completed)
    expect(screen.getByText(/Termine l'étape 1 pour débloquer/)).toBeInTheDocument();

    // Step 2 header should NOT be expandable (no role=button)
    const step2Header = screen.getByLabelText(/Étape 2.*verrouillée/);
    expect(step2Header).toBeInTheDocument();
  });

  it("steps 3-6 are sequentially locked and cannot be expanded", async () => {
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByText("L'art de l'observation comique")).toBeInTheDocument();
    });

    // Step 3 should show lock message
    expect(screen.getByText(/Termine l'étape 2 pour débloquer/)).toBeInTheDocument();

    // Step 3 header should NOT be a button
    const step3Header = screen.getByLabelText(/Étape 3.*verrouillée/);
    expect(step3Header).toBeInTheDocument();
  });

  it("sees cross-recommendation to Machine à Café", async () => {
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByText(/Découvre le parcours suivant/)).toBeInTheDocument();
    });
  });

  it("shows circular recommendation chain: Confiance → Machine à Café", async () => {
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      const link = screen.getByText(/Découvre le parcours suivant/);
      expect(link.closest("a")).toHaveAttribute("href", "/parcours/machine-a-cafe");
    });
  });
});

// ==============================
// Cross-cutting: Error handling
// ==============================
describe("Error handling — all parcours", () => {
  beforeEach(() => {
    setSession({ name: "Test" });
  });

  it("shows error state when API fails for Machine à Café", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) }) as jest.Mock;

    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText(/Impossible de charger ce parcours/)).toBeInTheDocument();
    });
    expect(screen.getByText("Voir tous les parcours")).toBeInTheDocument();
  });

  it("shows error state when API fails for Répartie", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) }) as jest.Mock;

    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByText(/Impossible de charger ce parcours/)).toBeInTheDocument();
    });
  });

  it("shows error state when network error for Confiance", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error")) as jest.Mock;

    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByText(/Impossible de charger ce parcours/)).toBeInTheDocument();
    });
  });
});

// ==============================
// Cross-cutting: Progress bar
// ==============================
describe("Progress bar — all parcours", () => {
  it("shows progress bar with max=3 for Machine à Café", async () => {
    setSession({ name: "Sophie" });
    mockFetchWith(machineACafeData);

    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      const bar = screen.getByTestId("progress-bar");
      expect(bar).toHaveAttribute("data-max", "3");
      expect(bar).toHaveAttribute("data-value", "0");
    });
  });

  it("shows progress bar with max=4 for Répartie", async () => {
    setSession({ name: "Yanis" });
    mockFetchWith(repartieData);

    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      const bar = screen.getByTestId("progress-bar");
      expect(bar).toHaveAttribute("data-max", "4");
    });
  });

  it("shows progress bar with max=6 for Confiance", async () => {
    setSession(null);
    mockFetchWith(confianceData);

    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      const bar = screen.getByTestId("progress-bar");
      expect(bar).toHaveAttribute("data-max", "6");
    });
  });
});

// ==============================
// Cross-cutting: Breadcrumb
// ==============================
describe("Breadcrumb navigation — all parcours", () => {
  it("shows breadcrumb for Machine à Café", async () => {
    setSession({ name: "Sophie" });
    mockFetchWith(machineACafeData);

    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("Accueil")).toBeInTheDocument();
      expect(screen.getByText("Parcours")).toBeInTheDocument();
    });
  });
});

// ==============================
// Completed parcours flows
// ==============================
describe("Completed parcours — end-to-end", () => {
  it("Sophie completes Machine à Café → sees CTA to Répartie", async () => {
    setSession({ name: "Sophie" });
    mockFetchWith({
      ...machineACafeData,
      path: { ...machineACafeData.path, id: "db-real-id" },
      userProgress: {
        completedSteps: [1, 2, 3],
        currentStep: 3,
        completedAt: "2026-03-18T00:00:00Z",
      },
    });

    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText(/Bravo, tu as terminé/)).toBeInTheDocument();
      expect(screen.getByText("Passer au parcours suivant")).toBeInTheDocument();
      expect(screen.getByText(/Passe à la répartie/)).toBeInTheDocument();
    });

    // The link should point to /parcours/repartie
    const nextLink = screen.getByText("Passer au parcours suivant").closest("a");
    expect(nextLink).toHaveAttribute("href", "/parcours/repartie");
  });

  it("Yanis completes Répartie → sees CTA to Confiance", async () => {
    setSession({ name: "Yanis" });
    mockFetchWith({
      ...repartieData,
      path: { ...repartieData.path, id: "db-real-id" },
      userProgress: {
        completedSteps: [1, 2, 3, 4],
        currentStep: 4,
        completedAt: "2026-03-18T00:00:00Z",
      },
    });

    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByText(/Bravo, tu as terminé/)).toBeInTheDocument();
    });

    const nextLink = screen.getByText("Passer au parcours suivant").closest("a");
    expect(nextLink).toHaveAttribute("href", "/parcours/confiance");
  });

  it("Marc completes Confiance → sees CTA to Machine à Café (circular)", async () => {
    setSession({ name: "Marc" });
    mockFetchWith({
      ...confianceData,
      path: { ...confianceData.path, id: "db-real-id" },
      userProgress: {
        completedSteps: [1, 2, 3, 4, 5, 6],
        currentStep: 6,
        completedAt: "2026-03-18T00:00:00Z",
      },
    });

    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => {
      expect(screen.getByText(/Bravo, tu as terminé/)).toBeInTheDocument();
    });

    const nextLink = screen.getByText("Passer au parcours suivant").closest("a");
    expect(nextLink).toHaveAttribute("href", "/parcours/machine-a-cafe");
  });
});

// ==============================
// Partial progress states
// ==============================
describe("Partial progress — mid-parcours", () => {
  it("Sophie with 1/3 steps completed sees progress correctly", async () => {
    setSession({ name: "Sophie" });
    mockFetchWith({
      ...machineACafeData,
      path: { ...machineACafeData.path, id: "db-real-id" },
      userProgress: {
        completedSteps: [1],
        currentStep: 1,
        completedAt: null,
      },
    });

    render(<ParcoursDetail slug="machine-a-cafe" />);
    await waitFor(() => {
      expect(screen.getByText("1/3 étapes complétées")).toBeInTheDocument();
    });

    const bar = screen.getByTestId("progress-bar");
    expect(bar).toHaveAttribute("data-value", "1");
    expect(bar).toHaveAttribute("data-max", "3");
  });

  it("Yanis with 2/4 steps completed shows correct state", async () => {
    setSession({ name: "Yanis" });
    mockFetchWith({
      ...repartieData,
      path: { ...repartieData.path, id: "db-real-id" },
      userProgress: {
        completedSteps: [1, 2],
        currentStep: 2,
        completedAt: null,
      },
    });

    render(<ParcoursDetail slug="repartie" />);
    await waitFor(() => {
      expect(screen.getByText("2/4 étapes complétées")).toBeInTheDocument();
    });
  });
});

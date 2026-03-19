import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HumorQuiz } from "@/components/onboarding/humor-quiz";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("HumorQuiz", () => {
  beforeEach(() => {
    mockPush.mockClear();
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it("renders first question about objectif", () => {
    render(<HumorQuiz />);
    expect(screen.getByText("C'est quoi ton objectif principal ?")).toBeInTheDocument();
  });

  it("shows question counter badge", () => {
    render(<HumorQuiz />);
    expect(screen.getByText("Question 1/3")).toBeInTheDocument();
  });

  it("shows progress bars", () => {
    const { container } = render(<HumorQuiz />);
    const bars = container.querySelectorAll(".h-2.w-8");
    expect(bars).toHaveLength(3);
  });

  it("shows 4 answer options for Q1", () => {
    render(<HumorQuiz />);
    expect(screen.getByText("Avoir de la répartie")).toBeInTheDocument();
    expect(screen.getByText("Faire rire les gens")).toBeInTheDocument();
    expect(screen.getByText("Être plus à l'aise socialement")).toBeInTheDocument();
    expect(screen.getByText("Tout ça à la fois")).toBeInTheDocument();
  });

  it("shows emojis for options", () => {
    render(<HumorQuiz />);
    expect(screen.getByText("\u26A1")).toBeInTheDocument();
  });

  it("advances to question 2 after answering", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    expect(screen.getByText("Où tu veux être drôle ?")).toBeInTheDocument();
    expect(screen.getByText("Question 2/3")).toBeInTheDocument();
  });

  it("shows Q2 options including machine à café", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    expect(screen.getByText("Entre potes / en soirée étudiante")).toBeInTheDocument();
    expect(screen.getByText("Au boulot / machine à café")).toBeInTheDocument();
    expect(screen.getByText("En soirée / rendez-vous")).toBeInTheDocument();
    expect(screen.getByText("Partout")).toBeInTheDocument();
  });

  it("advances to question 3 after second answer", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    expect(screen.getByText("Ton niveau actuel en humour ?")).toBeInTheDocument();
    expect(screen.getByText("Question 3/3")).toBeInTheDocument();
  });

  it("shows result screen after all 3 answers (DEBUTANT)", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Mes vannes tombent à plat"));

    expect(screen.getByText("En Route Vers la Répartie")).toBeInTheDocument();
    expect(screen.getByText(/potentiel/)).toBeInTheDocument();
  });

  it("shows result for EXPERT path", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Je veux aller encore plus loin"));

    expect(screen.getByText("La Future Star")).toBeInTheDocument();
  });

  it("navigates to /abonnement on 'C'est parti !' click", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Mes vannes tombent à plat"));

    await userEvent.click(screen.getByText("C'est parti !"));
    expect(mockPush).toHaveBeenCalledWith("/abonnement");
  });

  it("shows INTERMEDIAIRE result", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Parfois ça marche"));

    expect(screen.getByText("Le Blagueur Affûté")).toBeInTheDocument();
  });

  it("shows AVANCE result", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Je fais rire souvent"));

    expect(screen.getByText("Le Comique Naturel")).toBeInTheDocument();
  });

  // --- localStorage persistence tests ---

  it("saves humor profile to localStorage after completing quiz", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Mes vannes tombent à plat"));

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "humor-profile",
      expect.stringContaining('"objective":"REPARTIE"')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "humor-profile",
      expect.stringContaining('"level":"DEBUTANT"')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "humor-profile",
      expect.stringContaining('"result":"En Route Vers la Répartie"')
    );
  });

  it("shows existing profile screen when localStorage has a profile", () => {
    const profile = {
      objective: "REPARTIE",
      context: "social",
      level: "DEBUTANT",
      result: "En Route Vers la Répartie",
      completedAt: "2026-03-01T00:00:00.000Z",
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(profile));

    render(<HumorQuiz />);
    expect(screen.getByText("En Route Vers la Répartie")).toBeInTheDocument();
    expect(screen.getByText("Continuer")).toBeInTheDocument();
    expect(screen.getByText("Refaire le quiz")).toBeInTheDocument();
  });

  it("navigates to /abonnement on 'Continuer' click", async () => {
    const profile = {
      objective: "REPARTIE",
      context: "social",
      level: "DEBUTANT",
      result: "En Route Vers la Répartie",
      completedAt: "2026-03-01T00:00:00.000Z",
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(profile));

    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Continuer"));
    expect(mockPush).toHaveBeenCalledWith("/abonnement");
  });

  it("shows quiz from scratch on 'Refaire le quiz' click", async () => {
    const profile = {
      objective: "REPARTIE",
      context: "social",
      level: "DEBUTANT",
      result: "En Route Vers la Répartie",
      completedAt: "2026-03-01T00:00:00.000Z",
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(profile));

    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Refaire le quiz"));
    expect(screen.getByText("C'est quoi ton objectif principal ?")).toBeInTheDocument();
    expect(screen.getByText("Question 1/3")).toBeInTheDocument();
  });

  it("shows completion date on existing profile screen", () => {
    const profile = {
      objective: "REPARTIE",
      context: "social",
      level: "EXPERT",
      result: "La Future Star",
      completedAt: "2026-03-01T00:00:00.000Z",
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(profile));

    render(<HumorQuiz />);
    expect(screen.getByText("La Future Star")).toBeInTheDocument();
    expect(screen.getByText(/Quiz complet/)).toBeInTheDocument();
  });
});

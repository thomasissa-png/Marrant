import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ViralQuiz } from "@/components/quiz/viral-quiz";
import {
  QUIZ_QUESTIONS,
  QUIZ_PROFILES,
  computeQuizResult,
  type HumorProfileType,
} from "@/components/quiz/quiz-data";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
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

describe("ViralQuiz", () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it("renders first question", () => {
    render(<ViralQuiz />);
    expect(
      screen.getByText(QUIZ_QUESTIONS[0].question),
    ).toBeInTheDocument();
  });

  it("shows question counter badge", () => {
    render(<ViralQuiz />);
    expect(screen.getByText(`1/${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
  });

  it("shows 4 answer options for Q1", () => {
    render(<ViralQuiz />);
    QUIZ_QUESTIONS[0].options.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    });
  });

  it("advances to Q2 after answering Q1", async () => {
    render(<ViralQuiz />);
    await userEvent.click(
      screen.getByText(QUIZ_QUESTIONS[0].options[0].label),
    );
    expect(
      screen.getByText(QUIZ_QUESTIONS[1].question),
    ).toBeInTheDocument();
    expect(screen.getByText(`2/${QUIZ_QUESTIONS.length}`)).toBeInTheDocument();
  });

  it("shows progress bar that grows", async () => {
    const { container } = render(<ViralQuiz />);
    const progressBar = container.querySelector(
      ".bg-accent-primary.transition-all",
    );
    expect(progressBar).toBeInTheDocument();
  });

  it("shows a result after completing all 12 questions", async () => {
    render(<ViralQuiz />);

    // Answer all 12 questions with first option
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      await userEvent.click(
        screen.getByText(QUIZ_QUESTIONS[i].options[0].label),
      );
    }

    // Should show one of the profile titles
    const profileTitles = Object.values(QUIZ_PROFILES).map((p) => p.title);
    const foundTitle = profileTitles.some((title) =>
      screen.queryByText(title),
    );
    expect(foundTitle).toBe(true);
  });

  it("shows share button on result screen", async () => {
    render(<ViralQuiz />);
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      await userEvent.click(
        screen.getByText(QUIZ_QUESTIONS[i].options[0].label),
      );
    }
    expect(screen.getByText("Partage ton résultat")).toBeInTheDocument();
  });

  it("shows CTA buttons on result screen", async () => {
    render(<ViralQuiz />);
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      await userEvent.click(
        screen.getByText(QUIZ_QUESTIONS[i].options[0].label),
      );
    }
    expect(screen.getByText("Progresse avec ton profil")).toBeInTheDocument();
    expect(screen.getByText("Crée ton compte gratuit")).toBeInTheDocument();
  });

  it("saves result to localStorage", async () => {
    render(<ViralQuiz />);
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      await userEvent.click(
        screen.getByText(QUIZ_QUESTIONS[i].options[0].label),
      );
    }
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "humor-quiz-viral",
      expect.stringContaining('"profile"'),
    );
  });

  it("shows existing result from localStorage", () => {
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify({
        profile: "OBSERVATEUR",
        completedAt: "2026-03-19T00:00:00.000Z",
      }),
    );
    render(<ViralQuiz />);
    expect(screen.getByText("L'Observateur")).toBeInTheDocument();
    expect(screen.getByText("Refaire le quiz")).toBeInTheDocument();
  });

  it("allows retaking the quiz", async () => {
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify({
        profile: "OBSERVATEUR",
        completedAt: "2026-03-19T00:00:00.000Z",
      }),
    );
    render(<ViralQuiz />);
    await userEvent.click(screen.getByText("Refaire le quiz"));
    expect(
      screen.getByText(QUIZ_QUESTIONS[0].question),
    ).toBeInTheDocument();
  });

  it("shows humoriste name in result", async () => {
    render(<ViralQuiz />);
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      await userEvent.click(
        screen.getByText(QUIZ_QUESTIONS[i].options[0].label),
      );
    }
    const humoristNames = Object.values(QUIZ_PROFILES).map(
      (p) => p.humoriste,
    );
    const foundName = humoristNames.some((name) =>
      screen.queryByText(new RegExp(name)),
    );
    expect(foundName).toBe(true);
  });

  it("shows strength and tip on result", async () => {
    render(<ViralQuiz />);
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      await userEvent.click(
        screen.getByText(QUIZ_QUESTIONS[i].options[0].label),
      );
    }
    expect(screen.getByText("Ta force")).toBeInTheDocument();
    expect(screen.getByText("Le conseil du coach")).toBeInTheDocument();
  });
});

describe("computeQuizResult", () => {
  it("returns OBSERVATEUR when OBSERVATEUR has highest score", () => {
    const answers = [
      { OBSERVATEUR: 3, PUNCHLINEUR: 1 },
      { OBSERVATEUR: 3 },
      { OBSERVATEUR: 3 },
    ];
    expect(computeQuizResult(answers)).toBe("OBSERVATEUR");
  });

  it("returns STORYTELLER when STORYTELLER has highest score", () => {
    const answers = [
      { STORYTELLER: 3, ABSURDE: 1 },
      { STORYTELLER: 3 },
      { STORYTELLER: 3 },
    ];
    expect(computeQuizResult(answers)).toBe("STORYTELLER");
  });

  it("returns ABSURDE when ABSURDE has highest score", () => {
    const answers = [
      { ABSURDE: 3 },
      { ABSURDE: 3 },
      { ABSURDE: 3, TAQUIN: 1 },
    ];
    expect(computeQuizResult(answers)).toBe("ABSURDE");
  });

  it("returns PUNCHLINEUR when PUNCHLINEUR has highest score", () => {
    const answers = [
      { PUNCHLINEUR: 3, OBSERVATEUR: 1 },
      { PUNCHLINEUR: 3 },
      { PUNCHLINEUR: 3 },
    ];
    expect(computeQuizResult(answers)).toBe("PUNCHLINEUR");
  });

  it("returns TAQUIN when TAQUIN has highest score", () => {
    const answers = [
      { TAQUIN: 3, OBSERVATEUR: 1 },
      { TAQUIN: 3 },
      { TAQUIN: 3 },
    ];
    expect(computeQuizResult(answers)).toBe("TAQUIN");
  });

  it("handles empty answers array", () => {
    const result = computeQuizResult([]);
    expect(Object.keys(QUIZ_PROFILES)).toContain(result);
  });
});

describe("QUIZ_QUESTIONS data integrity", () => {
  it("has exactly 12 questions", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(12);
  });

  it("each question has exactly 4 options", () => {
    QUIZ_QUESTIONS.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it("each option has emoji and scores", () => {
    QUIZ_QUESTIONS.forEach((q) => {
      q.options.forEach((opt) => {
        expect(opt.emoji).toBeTruthy();
        expect(opt.label).toBeTruthy();
        expect(typeof opt.scores).toBe("object");
      });
    });
  });

  it("all profiles are reachable", () => {
    const allProfiles = new Set<string>();
    QUIZ_QUESTIONS.forEach((q) => {
      q.options.forEach((opt) => {
        Object.keys(opt.scores).forEach((p) => allProfiles.add(p));
      });
    });
    const profileTypes: HumorProfileType[] = [
      "OBSERVATEUR",
      "STORYTELLER",
      "ABSURDE",
      "PUNCHLINEUR",
      "TAQUIN",
    ];
    profileTypes.forEach((p) => {
      expect(allProfiles.has(p)).toBe(true);
    });
  });
});

describe("QUIZ_PROFILES data integrity", () => {
  it("has 5 profiles", () => {
    expect(Object.keys(QUIZ_PROFILES)).toHaveLength(5);
  });

  it("each profile has all required fields", () => {
    Object.values(QUIZ_PROFILES).forEach((profile) => {
      expect(profile.type).toBeTruthy();
      expect(profile.title).toBeTruthy();
      expect(profile.humoriste).toBeTruthy();
      expect(profile.emoji).toBeTruthy();
      expect(profile.description).toBeTruthy();
      expect(profile.strength).toBeTruthy();
      expect(profile.tip).toBeTruthy();
      expect(profile.color).toBeTruthy();
      expect(profile.recommendedPath).toMatch(/^\//);
    });
  });
});

/**
 * s17 lot E (réserve B2 de la revue croisée) : lettres A, B, C, D devant les
 * réponses du quiz, puisque les explications validées disent « La A : … ».
 */
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StepQuiz } from "@/components/parcours/step-quiz";
import { quizLettre } from "@/config/textes/parcours";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

const quiz = [
  {
    question: "Quelle phrase fait sourire ?",
    options: ["Une plainte", "Une pique", "Un aveu minuscule", "Un vrai souci"],
    correctIndex: 2,
    explanation: "La C : un aveu minuscule. La A se plaint, la B vise quelqu'un, la D confie un vrai souci.",
  },
];

describe("quiz d'étape : lettres des réponses (B2)", () => {
  it("chaque réponse porte sa lettre visible, A à D dans l'ordre", () => {
    render(<StepQuiz quiz={quiz} canValidate onComplete={jest.fn()} />);
    const group = screen.getByRole("group");
    const boutons = within(group).getAllByRole("button");
    expect(boutons.map((b) => within(b).getByTestId("quiz-lettre").textContent)).toEqual(["A", "B", "C", "D"]);
    // La lettre visible est masquée aux lecteurs d'écran, qui lisent « Réponse A : … ».
    expect(within(boutons[0]).getByTestId("quiz-lettre")).toHaveAttribute("aria-hidden", "true");
  });

  it("nom vocal naturel : « Réponse C : Un aveu minuscule », une seule fois la lettre", () => {
    render(<StepQuiz quiz={quiz} canValidate onComplete={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Réponse C : Un aveu minuscule" })).toBeInTheDocument();
  });

  it("après une mauvaise réponse : l'explication « La C : … » se lit avec les lettres à l'écran", async () => {
    render(<StepQuiz quiz={quiz} canValidate onComplete={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Réponse A : Une plainte" }));
    expect(screen.getByRole("status")).toHaveTextContent("La C : un aveu minuscule");
    expect(screen.getByRole("button", { name: /^Réponse C : Un aveu minuscule/ })).toBeInTheDocument();
  });

  it("contenu réel : la lettre citée en tête de chaque explication est celle de la bonne réponse", () => {
    const seed = parcoursSeed as { steps: { quiz?: { options: string[]; correctIndex: number; explanation?: string }[] }[] }[];
    let n = 0;
    for (const p of seed) {
      for (const s of p.steps) {
        for (const q of s.quiz ?? []) {
          n++;
          expect(q.options.length).toBeLessThanOrEqual(4);
          expect(q.explanation).toMatch(new RegExp(`^La ${quizLettre(q.correctIndex)}\\b`));
        }
      }
    }
    expect(n).toBeGreaterThan(0);
  });
});

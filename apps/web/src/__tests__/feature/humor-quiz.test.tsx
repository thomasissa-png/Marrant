import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HumorQuiz } from "@/components/onboarding/humor-quiz";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("HumorQuiz", () => {
  beforeEach(() => {
    mockPush.mockClear();
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
    expect(screen.getByText("⚡")).toBeInTheDocument();
    expect(screen.getByText("😂")).toBeInTheDocument();
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
    expect(screen.getByText("Entre potes / au lycée")).toBeInTheDocument();
    expect(screen.getByText("Au boulot / machine à café")).toBeInTheDocument();
    expect(screen.getByText("En soirée / rendez-vous")).toBeInTheDocument();
    expect(screen.getByText("Partout")).toBeInTheDocument();
  });

  it("advances to question 3 after second answer", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / au lycée"));
    expect(screen.getByText("Ton niveau actuel en humour ?")).toBeInTheDocument();
    expect(screen.getByText("Question 3/3")).toBeInTheDocument();
  });

  it("shows result screen after all 3 answers (DEBUTANT)", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / au lycée"));
    await userEvent.click(screen.getByText("Mes blagues tombent à plat"));

    expect(screen.getByText("Le Novice Prometteur")).toBeInTheDocument();
    expect(screen.getByText("🌱")).toBeInTheDocument();
    expect(screen.getByText(/potentiel/)).toBeInTheDocument();
  });

  it("shows result for EXPERT path", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / au lycée"));
    await userEvent.click(screen.getByText("Je veux aller encore plus loin"));

    expect(screen.getByText("La Future Star")).toBeInTheDocument();
    expect(screen.getByText("⭐")).toBeInTheDocument();
  });

  it("navigates to result path on 'C'est parti !' click", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / au lycée"));
    await userEvent.click(screen.getByText("Mes blagues tombent à plat"));

    await userEvent.click(screen.getByText("C'est parti !"));
    expect(mockPush).toHaveBeenCalledWith("/conseils");
  });

  it("navigates home on 'Explorer librement' click", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / au lycée"));
    await userEvent.click(screen.getByText("Mes blagues tombent à plat"));

    await userEvent.click(screen.getByText("Explorer librement"));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows INTERMEDIAIRE result", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / au lycée"));
    await userEvent.click(screen.getByText("Parfois ça marche"));

    expect(screen.getByText("Le Blagueur en Herbe")).toBeInTheDocument();
  });

  it("shows AVANCE result", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / au lycée"));
    await userEvent.click(screen.getByText("Je fais rire souvent"));

    expect(screen.getByText("Le Comique Naturel")).toBeInTheDocument();
  });
});

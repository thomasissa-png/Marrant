import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParcoursPage from "@/app/(dashboard)/parcours/page";

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: ({ value, max }: { value: number; max: number }) => (
    <div data-testid="progress-bar" data-value={value} data-max={max} />
  ),
}));

jest.mock("@/components/home/faq-section", () => ({
  FaqSection: () => <div data-testid="faq-section" />,
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

describe("ParcoursPage — Parcours structurés", () => {
  beforeEach(() => {
    render(<ParcoursPage />);
  });

  it("renders the hero section with title and description", () => {
    expect(screen.getByText("Parcours structurés")).toBeInTheDocument();
    expect(
      screen.getByText(/Choisis ton parcours et progresse semaine après semaine/)
    ).toBeInTheDocument();
  });

  it("shows the free first week info", () => {
    expect(
      screen.getByText(/Semaine 1 offerte sur chaque parcours/)
    ).toBeInTheDocument();
  });

  it("mentions XP and streaks in the hero", () => {
    expect(screen.getByText(/Gagne des XP/)).toBeInTheDocument();
    expect(screen.getByText(/streak/)).toBeInTheDocument();
  });

  it("renders the 3 parcours titles", () => {
    expect(screen.getByText(/Parcours Répartie/)).toBeInTheDocument();
    expect(screen.getByText(/Parcours Machine à Café/)).toBeInTheDocument();
    expect(screen.getByText(/Parcours Confiance/)).toBeInTheDocument();
  });

  it("shows the duration and time per week for each parcours", () => {
    expect(screen.getByText("4 semaines")).toBeInTheDocument();
    expect(screen.getByText("3 semaines")).toBeInTheDocument();
    expect(screen.getByText("6 semaines")).toBeInTheDocument();
    expect(screen.getAllByText(/min\/semaine/).length).toBe(3);
  });

  it("shows difficulty badges", () => {
    const intermediaire = screen.getAllByText("DEBUTANT \u2192 INTERMEDIAIRE");
    expect(intermediaire).toHaveLength(2);
    expect(screen.getByText("DEBUTANT \u2192 EXPERT")).toBeInTheDocument();
  });

  it("shows persona targeting text for each parcours", () => {
    expect(screen.getByText(/Idéal si tu travailles en équipe/)).toBeInTheDocument();
    expect(screen.getByText(/Pour toi si tu es étudiant/)).toBeInTheDocument();
    expect(screen.getByText(/Parfait si tu veux renouer/)).toBeInTheDocument();
  });

  it("shows testimonials for each parcours", () => {
    expect(screen.getByText(/muette à la machine à café/)).toBeInTheDocument();
    expect(screen.getByText(/meilleures répliques/)).toBeInTheDocument();
    expect(screen.getByText(/retrouver ma légèreté/)).toBeInTheDocument();
  });

  it("renders free trial CTA buttons for each parcours", () => {
    const buttons = screen.getAllByText("Essaie le premier module gratuitement");
    expect(buttons).toHaveLength(3);
    buttons.forEach((btn) => {
      expect(btn.tagName).toBe("BUTTON");
    });
  });

  it("opens auth modal when CTA button is clicked", async () => {
    const buttons = screen.getAllByText("Essaie le premier module gratuitement");
    await userEvent.click(buttons[0]);
    // AuthModal should open with register tab
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Inscription")).toBeInTheDocument();
  });

  it("marks first module as GRATUIT on each parcours", () => {
    const gratuitBadges = screen.getAllByText("GRATUIT");
    expect(gratuitBadges).toHaveLength(3);
  });

  it("shows XP rewards on modules", () => {
    expect(screen.getAllByText("+50 XP").length).toBe(3);
    expect(screen.getAllByText("+75 XP").length).toBe(3);
  });

  it("shows weekly modules for Parcours Répartie", () => {
    expect(screen.getByText("Les bases de la répartie")).toBeInTheDocument();
    expect(screen.getByText("Le timing et les silences")).toBeInTheDocument();
    expect(
      screen.getByText("L'autodérision comme arme secrète")
    ).toBeInTheDocument();
    expect(screen.getByText("Répartie avancée")).toBeInTheDocument();
  });

  it("shows weekly modules for Parcours Machine à Café", () => {
    expect(
      screen.getByText("Vannes courtes et mémorisables")
    ).toBeInTheDocument();
    expect(screen.getByText("L'art du timing social")).toBeInTheDocument();
    expect(screen.getByText("Anecdotes et storytelling")).toBeInTheDocument();
  });

  it("shows weekly modules for Parcours Confiance", () => {
    expect(
      screen.getByText("Redécouvrir ce qui te fait rire")
    ).toBeInTheDocument();
    expect(
      screen.getByText("L'autodérision bienveillante")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Techniques de storytelling")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Répartie et conversations")
    ).toBeInTheDocument();
    expect(screen.getByText("Humour avancé")).toBeInTheDocument();
    expect(
      screen.getByText("Développer son style personnel")
    ).toBeInTheDocument();
  });

  it("shows progress bars", () => {
    const bars = screen.getAllByTestId("progress-bar");
    expect(bars).toHaveLength(3);
  });

  it("shows total XP to earn", () => {
    expect(screen.getByText("225 XP à gagner")).toBeInTheDocument();
    expect(screen.getByText("375 XP à gagner")).toBeInTheDocument();
    expect(screen.getByText("700 XP à gagner")).toBeInTheDocument();
  });

  it("renders the FAQ section", () => {
    expect(screen.getByTestId("faq-section")).toBeInTheDocument();
  });

  it("orders parcours from shortest to longest", () => {
    const titles = screen.getAllByText(/Parcours (Machine à Café|Répartie|Confiance)/);
    expect(titles[0]).toHaveTextContent("Machine à Café");
    expect(titles[1]).toHaveTextContent("Répartie");
    expect(titles[2]).toHaveTextContent("Confiance");
  });

  it("uses 🌱 emoji for Parcours Confiance", () => {
    expect(screen.getByText("🌱")).toBeInTheDocument();
  });
});

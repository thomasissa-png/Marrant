import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParcoursPage from "@/app/(dashboard)/parcours/page";

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => (
    <div data-testid="progress-bar" data-value={props.value} data-max={props.max} />
  ),
}));

jest.mock("@/components/home/faq-section", () => ({
  FaqSection: () => <div data-testid="faq-section" />,
}));

const mockPush = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
}));

describe("ParcoursPage — Parcours structurés", () => {
  beforeEach(() => {
    render(<ParcoursPage />);
  });

  it("renders the hero section with title and description", () => {
    expect(screen.getByText(/Parcours pour devenir drôle/)).toBeInTheDocument();
    expect(
      screen.getByText(/Choisis ton parcours et progresse semaine après semaine/)
    ).toBeInTheDocument();
  });

  it("shows the subscription info", () => {
    expect(
      screen.getByText(/Accès complet avec ton abonnement/)
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
    expect(screen.getAllByText(/min\/semaine/).length).toBeGreaterThanOrEqual(3);
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
    expect(screen.getByText(/Ce parcours m'a aidé à retrouver/)).toBeInTheDocument();
  });

  it("renders CTA buttons for each parcours", () => {
    const buttons = screen.getAllByText("Commencer ce parcours");
    expect(buttons).toHaveLength(3);
    buttons.forEach((btn) => {
      expect(btn.tagName).toBe("BUTTON");
    });
  });

  it("opens auth modal when CTA button is clicked", async () => {
    const buttons = screen.getAllByText("Commencer ce parcours");
    await userEvent.click(buttons[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Inscription")).toBeInTheDocument();
  });

  it("shows Essai gratuit badges on free modules", () => {
    const badges = screen.getAllByText("Essai gratuit");
    expect(badges).toHaveLength(3); // One per parcours (Semaine 1)
  });

  it("shows exercise format descriptions", () => {
    expect(screen.getAllByText(/Format :/).length).toBeGreaterThanOrEqual(3);
  });

  it("shows XP rewards on modules", () => {
    expect(screen.getAllByText("+50 XP").length).toBe(3);
    expect(screen.getAllByText("+75 XP").length).toBe(3);
  });

  it("shows weekly modules for Parcours Répartie", () => {
    expect(screen.getByText("Les bases de la répartie")).toBeInTheDocument();
    expect(screen.getByText(/Le rythme et les silences/)).toBeInTheDocument();
    expect(
      screen.getByText(/Retourner les piques avec le sourire/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Répartie avancée et improvisation/)).toBeInTheDocument();
  });

  it("shows weekly modules for Parcours Machine à Café", () => {
    expect(
      screen.getByText("Vannes courtes et mémorisables")
    ).toBeInTheDocument();
    expect(screen.getByText("L'art du timing social")).toBeInTheDocument();
    expect(screen.getByText(/Raconter une anecdote captivante/)).toBeInTheDocument();
  });

  it("shows weekly modules for Parcours Confiance", () => {
    expect(
      screen.getByText("Redécouvrir ce qui te fait rire")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Rire de soi avec bienveillance/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/L'art de l'observation comique/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Être à l'aise en groupe/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Les registres avancés/)).toBeInTheDocument();
    expect(
      screen.getByText(/Affirmer ton style personnel/)
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
    expect(screen.getAllByText("🌱").length).toBeGreaterThanOrEqual(1);
  });

  it("renders orientation quiz", () => {
    expect(screen.getByText("Quel parcours est fait pour toi ?")).toBeInTheDocument();
    expect(screen.getByText(/Dans quelle situation/)).toBeInTheDocument();
  });

  it("orientation quiz recommends a parcours after answering", async () => {
    // Answer both questions
    await userEvent.click(screen.getByText(/Au boulot, en réunion/));
    await userEvent.click(screen.getByText(/Je manque de blagues/));
    expect(screen.getByText("On te recommande :")).toBeInTheDocument();
    expect(screen.getByText("Voir ce parcours")).toBeInTheDocument();
  });
});

describe("ParcoursPage — authenticated user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ paths: [] }),
    });
    jest.spyOn(require("next-auth/react"), "useSession").mockReturnValue({
      data: { user: { name: "Test" } },
      status: "authenticated",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    (global.fetch as jest.Mock).mockRestore?.();
  });

  it("navigates to /parcours/[slug] when authenticated user clicks CTA", async () => {
    render(<ParcoursPage />);
    const buttons = screen.getAllByText("Commencer ce parcours");
    await userEvent.click(buttons[0]);
    expect(mockPush).toHaveBeenCalledWith("/parcours/machine-a-cafe");
  });
});

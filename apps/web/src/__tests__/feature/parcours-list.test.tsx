import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParcoursPage from "@/app/(dashboard)/parcours/page";
import parcoursSeed from "../../../../../docs/content/parcours-seed.json";

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => (
    <div data-testid="progress-bar" data-value={props.value} data-max={props.max} />
  ),
}));

jest.mock("@/components/home/faq-section", () => ({
  FaqSection: () => <div data-testid="faq-section" />,
  faqs: [{ question: "Test?", answer: "Test answer" }],
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
  beforeEach(async () => {
    // ParcoursPage est un async Server Component depuis s11 lot 2
    const Page = await ParcoursPage();
    render(Page);
  });

  it("renders the page header with title and description", () => {
    expect(screen.getByText(/Parcours humour : deviens drôle pas à pas/)).toBeInTheDocument();
    expect(
      screen.getByText(/3 parcours pour progresser en humour/)
    ).toBeInTheDocument();
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

  it("shows difficulty badges with human labels (s12 T27)", () => {
    const intermediaire = screen.getAllByText("Débutant → Intermédiaire");
    expect(intermediaire).toHaveLength(2);
    expect(screen.getByText("Débutant → Expert")).toBeInTheDocument();
    expect(screen.queryByText(/DEBUTANT/)).not.toBeInTheDocument();
  });

  // s11 : textes des parcours réécrits — les attentes sont dérivées du seed
  // (source de vérité) pour ne pas figer la copy dans les tests.
  const bodyText = () => (document.body.textContent ?? "").replace(/\s+/g, " ");
  const norm = (t: string) => t.replace(/\s+/g, " ").trim();

  it("shows persona targeting text for each parcours", () => {
    for (const p of parcoursSeed) {
      expect(bodyText()).toContain(norm(p.personaTagline));
    }
  });

  it("shows testimonials for each parcours", () => {
    for (const p of parcoursSeed) {
      expect(bodyText()).toContain(norm(p.testimonial).slice(0, 40));
    }
  });

  it("renders CTA buttons for each parcours", () => {
    const buttons = screen.getAllByText("Commencer ce parcours");
    expect(buttons).toHaveLength(3);
    buttons.forEach((btn) => {
      expect(btn.tagName).toBe("BUTTON");
    });
  });

  it("anonyme : le CTA mène directement au parcours, sans /register (s15 §2.7, étape 1 en lecture libre)", async () => {
    const buttons = screen.getAllByText("Commencer ce parcours");
    await userEvent.click(buttons[0]);
    expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/parcours\/[a-z-]+$/));
    expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining("/register"));
  });

  it("shows Lecture libre badges on free modules", () => {
    const badges = screen.getAllByText("Lecture libre");
    expect(badges).toHaveLength(3); // One per parcours (Semaine 1)
  });

  it("shows exercise format descriptions", () => {
    expect(screen.getAllByText(/Format :/).length).toBeGreaterThanOrEqual(3);
  });

  it("shows XP rewards on modules", () => {
    expect(screen.getAllByText("+50 XP").length).toBe(3);
    expect(screen.getAllByText("+75 XP").length).toBe(3);
  });

  it.each(["repartie", "machine-a-cafe", "confiance"])(
    "shows weekly modules for parcours %s",
    (slug) => {
      const p = parcoursSeed.find((x) => x.slug === slug)!;
      for (const step of p.steps) {
        expect(bodyText()).toContain(norm(step.moduleTitle));
      }
    }
  );

  it("hides empty progress bars before any step is done (s12 T26)", () => {
    expect(screen.queryAllByTestId("progress-bar")).toHaveLength(0);
  });

  it("shows total XP to earn", () => {
    expect(screen.getByText(/225 XP à gagner/)).toBeInTheDocument();
    expect(screen.getByText(/375 XP à gagner/)).toBeInTheDocument();
    expect(screen.getByText(/700 XP à gagner/)).toBeInTheDocument();
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
    await userEvent.click(screen.getByText(/rien de drôle à raconter/));
    expect(screen.getByText("Ton point de départ :")).toBeInTheDocument();
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
    const Page = await ParcoursPage();
    render(Page);
    const buttons = screen.getAllByText("Commencer ce parcours");
    await userEvent.click(buttons[0]);
    expect(mockPush).toHaveBeenCalledWith("/parcours/machine-a-cafe");
  });

  it("keeps programmes collapsed and opens the one the orientation quiz recommends (s12 T23/T24)", async () => {
    const Page = await ParcoursPage();
    render(Page);
    const programme = (slug: string) =>
      document.querySelector(`#parcours-${slug} details`) as HTMLDetailsElement;
    expect(programme("repartie").open).toBe(false);

    await userEvent.click(screen.getByText("En soirée, avec mes potes, en coloc"));
    await userEvent.click(screen.getByText("Je ne sais pas quoi répondre sur le moment"));
    await userEvent.click(screen.getByText("Voir ce parcours"));

    expect(programme("repartie").open).toBe(true);
    expect(programme("confiance").open).toBe(false);
  });
});

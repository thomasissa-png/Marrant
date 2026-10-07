/**
 * s17 lot C : écrans d'entrée (reprise abonné, CTA d'article, rappel e-mail,
 * quiz d'humour, /abonnement, confidentialité). Cas visiteur systématique.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReprendreParcours } from "@/components/home/reprendre-parcours";
import { ArticleCta } from "@/components/blog/article-cta";
import { RappelParcoursToggle } from "@/app/(dashboard)/profil/rappel-parcours-toggle";
import { ViralQuiz } from "@/components/quiz/viral-quiz";
import AbonnementPage from "@/app/(dashboard)/abonnement/page";
import ConfidentialitePage from "@/app/(dashboard)/confidentialite/page";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/hooks/use-content-stats", () => ({ useContentStats: () => ({ jokes: 600, tips: 400, videos: 80 }) }));
jest.mock("@/components/ui/toast", () => ({ toast: jest.fn() }));
jest.mock("@/components/home/faq-section", () => ({ FaqSection: () => null }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn(), trackUmamiWhenReady: jest.fn() }));

const { useSession } = require("next-auth/react");
const visiteur = { status: "unauthenticated", data: null };
const premium = { status: "authenticated", data: { user: { plan: "PREMIUM" } } };

const progress = {
  parcours: [
    { slug: "confiance", title: "Parcours Confiance", completedSteps: 2, totalSteps: 6, completedAt: null, nextStepOrder: 3, startedAt: "2026-10-01T00:00:00.000Z", nextStepTitle: "Ton personnage" },
  ],
};

function mockFetch(routes: Record<string, unknown>) {
  const fn = jest.fn((url: string) =>
    Promise.resolve({ ok: url in routes, json: () => Promise.resolve(routes[url] ?? {}) }),
  );
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

afterEach(() => jest.clearAllMocks());

describe("Reprendre ton parcours", () => {
  it("visiteur : rien, et aucune requête de progression", () => {
    useSession.mockReturnValue(visiteur);
    const fetchMock = mockFetch({});
    const { container } = render(<ReprendreParcours src="accueil" />);
    expect(container).toBeEmptyDOMElement();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("abonné, parcours de 6 étapes en cours : bouton vers l'étape 3", async () => {
    useSession.mockReturnValue(premium);
    mockFetch({ "/api/user/progress": progress });
    render(<ReprendreParcours src="profil" />);
    const link = await screen.findByRole("link", { name: "Reprendre l'étape 3" });
    expect(link).toHaveAttribute("href", "/parcours/confiance?src=profil#etape-3");
    // Étalon 3.4 A, même format que la liste /parcours (lot E).
    expect(screen.getByText("Parcours Confiance, étape 3 sur 6 : Ton personnage")).toBeInTheDocument();
  });
  it("titre d'étape absent : ligne sans deux-points final", async () => {
    useSession.mockReturnValue(premium);
    mockFetch({ "/api/user/progress": { parcours: [{ ...progress.parcours[0], nextStepTitle: null }] } });
    render(<ReprendreParcours src="accueil" />);
    expect(await screen.findByText("Parcours Confiance, étape 3 sur 6")).toBeInTheDocument();
  });
  it("abonné sans parcours en cours : rien", async () => {
    useSession.mockReturnValue(premium);
    const fetchMock = mockFetch({ "/api/user/progress": { parcours: [] } });
    const { container } = render(<ReprendreParcours src="accueil" />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});

describe("CTA d'article", () => {
  it("visiteur : le lien « étape 1 » ouvre l'étape 1 du parcours de l'article", () => {
    useSession.mockReturnValue(visiteur);
    mockFetch({});
    const { container } = render(<ArticleCta parcoursHref="/parcours/machine-a-cafe" src="blog-x" />);
    expect(container.querySelector('a[data-blog-cta="etape-1"]')).toHaveAttribute("href", "/parcours/machine-a-cafe?src=blog#etape-1");
  });
  it("abonné avec parcours en cours : « Continuer mon parcours » mène à l'étape à reprendre", async () => {
    useSession.mockReturnValue(premium);
    mockFetch({ "/api/user/progress": progress });
    const { container } = render(<ArticleCta parcoursHref="/parcours/repartie" src="blog-x" />);
    await waitFor(() =>
      expect(container.querySelector('a[data-blog-cta="parcours"]')).toHaveAttribute("href", "/parcours/confiance?src=blog#etape-3"),
    );
  });
});

describe("Rappel e-mail de parcours (profil, legal C1)", () => {
  it("visiteur : rien", () => {
    useSession.mockReturnValue(visiteur);
    mockFetch({});
    const { container } = render(<RappelParcoursToggle />);
    expect(container).toBeEmptyDOMElement();
  });
  it("Premium non éligible côté serveur : rien", async () => {
    useSession.mockReturnValue(premium);
    const fetchMock = mockFetch({ "/api/user/rappel-parcours": { enabled: false, weekday: null, eligible: false } });
    const { container } = render(<RappelParcoursToggle />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
  it("Premium : case décochée par défaut, texte exact, activation envoyée avec le jour", async () => {
    useSession.mockReturnValue(premium);
    const fetchMock = mockFetch({ "/api/user/rappel-parcours": { enabled: false, weekday: null, eligible: true } });
    render(<RappelParcoursToggle />);
    const box = await screen.findByRole("checkbox", {
      name: "Reçois chaque semaine un e-mail pour reprendre ton parcours. Tu peux l'arrêter à tout moment.",
    });
    expect(box).not.toBeChecked();
    await userEvent.selectOptions(screen.getByLabelText("Jour du rappel"), "3");
    await userEvent.click(box);
    const post = fetchMock.mock.calls.find((c) => ((c as unknown[])[1] as RequestInit | undefined)?.method === "POST") as unknown as [string, RequestInit];
    expect(JSON.parse(post[1].body as string)).toEqual({ enabled: true, weekday: 3 });
    expect(await screen.findByText("C'est noté.")).toBeInTheDocument();
  });
  it("aucun jour présélectionné (étalon 3.7) ; case cochée sans jour : rien n'est envoyé, le choix du jour active", async () => {
    useSession.mockReturnValue(premium);
    const fetchMock = mockFetch({ "/api/user/rappel-parcours": { enabled: false, weekday: null, eligible: true } });
    render(<RappelParcoursToggle />);
    const box = await screen.findByRole("checkbox");
    const select = screen.getByLabelText("Jour du rappel") as HTMLSelectElement;
    expect(select.value).toBe("");
    expect(screen.getByRole("option", { name: "Choisis un jour" })).toBeInTheDocument();
    const posts = () => fetchMock.mock.calls.filter((c) => ((c as unknown[])[1] as RequestInit | undefined)?.method === "POST");
    await userEvent.click(box);
    expect(posts()).toHaveLength(0);
    expect(box).not.toBeChecked();
    expect(screen.getByText("Choisis d'abord le jour du rappel, il s'activera aussitôt.")).toBeInTheDocument();
    expect(select).toHaveFocus();
    await userEvent.selectOptions(select, "5");
    expect(JSON.parse((posts()[0] as unknown as [string, RequestInit])[1].body as string)).toEqual({ enabled: true, weekday: 5 });
  });
  it("jour déjà réglé : affiché tel quel, sans option vide", async () => {
    useSession.mockReturnValue(premium);
    mockFetch({ "/api/user/rappel-parcours": { enabled: true, weekday: 4, eligible: true } });
    render(<RappelParcoursToggle />);
    expect(await screen.findByRole("checkbox")).toBeChecked();
    expect((screen.getByLabelText("Jour du rappel") as HTMLSelectElement).value).toBe("4");
    expect(screen.queryByRole("option", { name: "Choisis un jour" })).not.toBeInTheDocument();
  });
});

describe("Quiz d'humour et /abonnement", () => {
  it("résultat : parcours conseillé, lien vers son étape 1 (src=quiz)", () => {
    useSession.mockReturnValue(visiteur);
    window.localStorage.setItem("humor-quiz-viral", JSON.stringify({ profile: "TAQUIN", completedAt: "2026-10-07" }));
    render(<ViralQuiz />);
    expect(screen.getByText("Parcours Répartie")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lire la première étape gratuite" })).toHaveAttribute("href", "/parcours/repartie?src=quiz#etape-1");
    window.localStorage.clear();
  });
  it("/abonnement visiteur : un lien vers l'étape 1 de chacun des 3 parcours", () => {
    useSession.mockReturnValue(visiteur);
    mockFetch({});
    render(<AbonnementPage />);
    for (const [slug, nom] of [["machine-a-cafe", "Machine à Café"], ["repartie", "Répartie"], ["confiance", "Confiance"]]) {
      expect(screen.getByRole("link", { name: `Étape 1 du parcours ${nom}` })).toHaveAttribute("href", `/parcours/${slug}?src=abonnement#etape-1`);
    }
  });
});

describe("Confidentialité (legal s17 §4)", () => {
  it("contient P1 à P8, sans la phrase des 25 mois", () => {
    const { container } = render(<ConfidentialitePage />);
    const text = container.textContent ?? "";
    for (const extrait of [
      "étapes de parcours validées avec la date de chaque validation",
      "Rappel de parcours, si tu l'actives : le jour de la semaine que tu as choisi",
      "calculer ta série et ta prochaine étape conseillée",
      "où les membres avancent ou bloquent dans les parcours",
      "uniquement si tu l'as demandé : ton consentement",
      "l'ouverture d'une étape de parcours ou le score d'un quiz",
      "Ton rappel de parcours s'arrête dès que tu le désactives",
      "avec le lien au bas de chaque e-mail : ce que tu as reçu avant reste valable.",
    ]) {
      expect(text).toContain(extrait);
    }
    expect(text).not.toContain("25 mois");
  });
});

/**
 * s17 tour 2 (défaut QA iter-2) : contenu Premium lent ou en échec sur la page d'un
 * parcours, pour un abonné qui a déjà validé l'étape 1. Jamais de « 0/N » par défaut,
 * jamais de faux verrou « Termine l'étape 1 », message et « Réessayer » au niveau de la page.
 */
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParcoursDetail, type PathData } from "@/components/parcours/parcours-detail";
import { CHARGEMENT_ETAPE, CHARGEMENT_PREMIUM } from "@/config/textes/parcours";
import { ParcoursContent } from "@/components/parcours/parcours-content";
import { getParcoursCatalogue } from "@/lib/parcours-catalogue";

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => <div data-testid="progress-bar">{props.label as string}</div>,
}));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));

const PREMIUM = { data: { user: { id: "u1", name: "Yanis", plan: "PREMIUM" } }, status: "authenticated" };
jest.mock("next-auth/react", () => ({ useSession: () => PREMIUM }));
jest.mock("@/lib/umami", () => ({ trackUmami: jest.fn() }));

const ETAPE_1_FAITE = { completedSteps: [1], currentStep: 1, completedAt: null };

function buildPath(locked: boolean): PathData {
  return {
    id: "db-path",
    title: "Parcours Répartie",
    description: "Description",
    slug: "repartie",
    duration: "4 semaines",
    difficulty: "DEBUTANT",
    timePerWeek: "20 min/semaine",
    icon: "⚡",
    nextParcours: null,
    nextParcoursReason: null,
    steps: [1, 2, 3, 4].map((order) => ({
      id: `s${order}`,
      order,
      dayNumber: order * 7,
      tip: { id: `t${order}`, title: `Conseil ${order}`, content: "", category: "GENERAL", difficulty: "DEBUTANT", example: "", exercise: "" },
      moduleTitle: `Module ${order}`,
      moduleXp: 50,
      free: order === 1,
      // HTML ISR : aperçu (locked) des étapes 2+ ; l'API apporte le contenu complet.
      locked: locked && order > 1,
      quiz: [],
      videos: [],
    })),
  } as unknown as PathData;
}

type Reponse = { ok: boolean; status: number; json: () => Promise<unknown> };
const ok = (body: unknown): Reponse => ({ ok: true, status: 200, json: async () => body });
const ko: Reponse = { ok: false, status: 500, json: async () => ({ error: "Erreur serveur" }) };

/** by-slug piloté par le test (réponses successives) ; le reste répond vide. */
function mockBySlug(reponses: Array<Promise<Reponse>>) {
  const fetchMock = jest.fn((url: string) =>
    url.includes("by-slug") ? (reponses.shift() ?? Promise.resolve(ko)) : Promise.resolve(ok({})),
  );
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

function enAttente() {
  let resoudre: (r: Reponse) => void = () => undefined;
  const promesse = new Promise<Reponse>((r) => (resoudre = r));
  return { promesse, resoudre };
}

const cacher = (userId: string) =>
  localStorage.setItem("parcours-progression:repartie", JSON.stringify({ userId, progress: ETAPE_1_FAITE }));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState(null, "", "/parcours/repartie");
});

describe("s17 tour 2 : chargement Premium lent", () => {
  it("progression connue affichée, indicateur accessible, aucun faux verrou", async () => {
    cacher("u1");
    const lente = enAttente();
    mockBySlug([lente.promesse]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);

    expect(await screen.findByTestId("progress-bar")).toHaveTextContent("1/4 étapes complétées");
    expect(screen.getByText(CHARGEMENT_PREMIUM.enCours)).toHaveAttribute("role", "status");
    expect(screen.getByRole("list", { name: "Étapes du parcours" })).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText(/Termine l'étape 1 pour débloquer/)).toBeNull();
    // L'étape à reprendre (2) est ouverte et annonce le chargement de son contenu.
    expect(screen.getByRole("button", { name: /^Étape 2 :/ })).toHaveAttribute("aria-expanded", "true");
    // Carte ouverte : squelette de 3 lignes, aria-busy (DES-2-01).
    const etape2 = document.getElementById("etape-2") as HTMLElement;
    expect(within(etape2).getByTestId("etape-squelette").children).toHaveLength(3);
    expect(within(etape2).getByText("Chargement du contenu de l'étape…").parentElement).toHaveAttribute("aria-busy", "true");

    await act(async () => lente.resoudre(ok({ path: buildPath(false), userProgress: ETAPE_1_FAITE })));
    await waitFor(() => expect(screen.queryByText(CHARGEMENT_PREMIUM.enCours)).toBeNull());
    expect(screen.getByRole("list", { name: "Étapes du parcours" })).not.toHaveAttribute("aria-busy");
    expect(screen.getByTestId("progress-bar")).toHaveTextContent("1/4 étapes complétées");
    expect(screen.getByText(/Termine l'étape 2 pour débloquer/)).toBeInTheDocument();
  });

  it("progression encore inconnue (premier passage) : squelette, jamais « 0/4 » ni verrou", async () => {
    const lente = enAttente();
    mockBySlug([lente.promesse]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);

    expect(await screen.findByTestId("progression-squelette")).toBeInTheDocument();
    expect(screen.queryByTestId("progress-bar")).toBeNull();
    expect(screen.queryByText(/0\/4/)).toBeNull();
    expect(screen.queryByText(/Termine l'étape \d pour débloquer/)).toBeNull();

    await act(async () => lente.resoudre(ok({ path: buildPath(false), userProgress: ETAPE_1_FAITE })));
    expect(await screen.findByTestId("progress-bar")).toHaveTextContent("1/4 étapes complétées");
    // La progression reçue est gardée pour le prochain affichage (compte u1).
    expect(JSON.parse(localStorage.getItem("parcours-progression:repartie") ?? "{}")).toMatchObject({ userId: "u1" });
  });

  it("progression gardée pour un autre compte : ignorée", async () => {
    cacher("autre");
    mockBySlug([enAttente().promesse]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);
    expect(await screen.findByTestId("progression-squelette")).toBeInTheDocument();
    expect(screen.queryByTestId("progress-bar")).toBeNull();
  });
});

describe("s17 tour 2 : échec du chargement Premium puis « Réessayer »", () => {
  it("message dans l'étape dépliée (tour 3), progression gardée, le réessai recharge tout", async () => {
    cacher("u1");
    const fetchMock = mockBySlug([
      Promise.resolve(ko),
      Promise.resolve(ok({ path: buildPath(false), userProgress: ETAPE_1_FAITE })),
    ]);
    const user = userEvent.setup();
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);

    // s17 tour 3 (UXV-3-01) : l'étape 2 est dépliée, c'est elle qui porte l'alerte et le seul « Réessayer ».
    const alerte = await screen.findByRole("alert");
    expect(alerte).toHaveTextContent(CHARGEMENT_PREMIUM.echec);
    expect(document.getElementById("etape-2")).toContainElement(alerte);
    expect(screen.getByTestId("progress-bar")).toHaveTextContent("1/4 étapes complétées");
    expect(screen.queryByText(/Termine l'étape 1 pour débloquer/)).toBeNull();

    await user.click(within(alerte).getByRole("button", { name: CHARGEMENT_PREMIUM.reessayer }));
    await waitFor(() => expect(screen.queryAllByText(CHARGEMENT_PREMIUM.echec)).toHaveLength(0));
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes("by-slug"))).toHaveLength(2);
    expect(screen.getByTestId("progress-bar")).toHaveTextContent("1/4 étapes complétées");
    expect(screen.getByText(/Termine l'étape 2 pour débloquer/)).toBeInTheDocument();
  });

  it("nouvel échec après « Réessayer » : focus rendu au bouton de la page", async () => {
    mockBySlug([Promise.resolve(ko), Promise.resolve(ko)]);
    const user = userEvent.setup();
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);
    await user.click(await screen.findByRole("button", { name: CHARGEMENT_PREMIUM.reessayer }));
    await waitFor(() => expect(screen.getByRole("button", { name: CHARGEMENT_PREMIUM.reessayer })).toHaveFocus());
  });

  it("échec sans progression connue : ni « 0/4 », ni verrou, mais le message et « Réessayer »", async () => {
    mockBySlug([Promise.resolve(ko)]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);
    const alerte = await screen.findByRole("alert");
    expect(within(alerte).getByRole("button", { name: CHARGEMENT_PREMIUM.reessayer })).toBeInTheDocument();
    expect(screen.queryByText(/0\/4/)).toBeNull();
    expect(screen.queryByText(/Termine l'étape \d pour débloquer/)).toBeNull();
  });
});

describe("s17 tour 2 : finitions de la page d'un parcours", () => {
  it("DES-2-04 : « +N XP » affiché une seule fois dans la carte qui vient d'être validée", async () => {
    global.fetch = jest.fn(async (url: string, init?: RequestInit) =>
      init?.method === "POST"
        ? ok({ progress: { completedSteps: [1, 2], currentStep: 2, completedAt: null }, xpGained: 50, pathCompleted: false })
        : String(url).includes("by-slug")
          ? ok({ path: buildPath(false), userProgress: ETAPE_1_FAITE })
          : ok({}),
    ) as unknown as typeof fetch;
    const user = userEvent.setup();
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);
    await user.click(await within(document.getElementById("etape-2") as HTMLElement).findByText("Valider cette étape"));
    const etape2 = document.getElementById("etape-2") as HTMLElement;
    expect(await within(etape2).findByText("+50 XP gagnés !")).toBeInTheDocument();
    expect(within(etape2).queryByText("+50 XP")).toBeNull();
  });

  it("DES-2-05 / DES-2-11 : parcours terminé, carte de fin avant l'argumentaire, XP non répété", async () => {
    mockBySlug([
      Promise.resolve(
        ok({ path: buildPath(false), userProgress: { completedSteps: [1, 2, 3, 4], currentStep: 4, completedAt: "2026-10-01T10:00:00Z" } }),
      ),
    ]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);
    const fin = await screen.findByRole("heading", { name: "Parcours Répartie terminé" });
    const intro = screen.getByText("Description");
    expect(fin.compareDocumentPosition(intro) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByText(/XP au total, dont/)).toBeNull();
  });
});

describe("s17 tour 2 (UXV-2-05) : /parcours, abonné qui a entamé un parcours", () => {
  const quizAvantCartes = () => {
    const quiz = screen.getByRole("heading", { name: "Quel parcours est fait pour toi ?" });
    const carte = document.getElementById("parcours-repartie") as HTMLElement;
    return !!(quiz.compareDocumentPosition(carte) & Node.DOCUMENT_POSITION_FOLLOWING);
  };

  it("ses cartes passent avant le quiz d'orientation", async () => {
    const fetchMock = jest.fn(async () =>
      ok({ paths: [{ slug: "repartie", steps: [1, 2, 3, 4].map((order) => ({ order })), progress: ETAPE_1_FAITE }] }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    render(<ParcoursContent parcours={getParcoursCatalogue()} />);
    expect(quizAvantCartes()).toBe(true);
    await waitFor(() => expect(quizAvantCartes()).toBe(false));
  });
});

describe("s17 tour 3 : arrivée par l'ancre d'une étape, chargement Premium en échec", () => {
  it("la carte de l'étape dit « Ta progression est intacte. », une seule alerte vocale", async () => {
    cacher("u1");
    window.history.replaceState(null, "", "/parcours/repartie#etape-2");
    mockBySlug([Promise.resolve(ko)]);
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);

    const bloc = await screen.findByTestId("etape-echec");
    expect(document.getElementById("etape-2")).toContainElement(bloc);
    expect(within(bloc).getByText(CHARGEMENT_ETAPE.progressionIntacte)).toBeInTheDocument();
    expect(within(bloc).getByText(CHARGEMENT_ETAPE.echec)).toBeInTheDocument();
    expect(CHARGEMENT_ETAPE.progressionIntacte).toBe(CHARGEMENT_PREMIUM.echec);
    // Une seule zone role="alert" : celle de l'étape (UXV-3-01), le haut de page reste neutre.
    expect(screen.getAllByRole("alert")).toEqual([bloc]);
    // DES-3-05 : carte calée à 112 px sous la barre fixe, 8 px entre l'en-tête déplié (anneau de focus) et la suite.
    expect(document.getElementById("etape-2")).toHaveClass("scroll-mt-28");
    expect(document.getElementById("etape-2-entete")).toHaveClass("mb-2");
  });
});

describe("s17 tour 3 (UXV-3-01, DES-3-06) : un seul bouton Réessayer", () => {
  it("étape dépliée en échec : bouton et phrase rassurante dans l'étape, haut neutre, une seule alerte", async () => {
    cacher("u1");
    mockBySlug([Promise.resolve(ko), Promise.resolve(ko)]);
    const user = userEvent.setup();
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);

    const bloc = await screen.findByTestId("etape-echec");
    expect(screen.getAllByRole("button", { name: CHARGEMENT_PREMIUM.reessayer })).toHaveLength(1);
    expect(within(bloc).getByRole("button", { name: CHARGEMENT_ETAPE.reessayer })).toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toEqual([bloc]);
    expect(screen.getByTestId("echec-premium-neutre")).not.toHaveAttribute("role");
    expect(screen.getByTestId("progress-bar")).toHaveTextContent("1/4 étapes complétées");

    // Nouvel échec après « Réessayer » : focus rendu au bouton de l'étape, toujours un seul bouton.
    await user.click(within(bloc).getByRole("button", { name: CHARGEMENT_ETAPE.reessayer }));
    const nouveauBloc = await screen.findByTestId("etape-echec");
    await waitFor(() => expect(within(nouveauBloc).getByRole("button", { name: CHARGEMENT_ETAPE.reessayer })).toHaveFocus());
    expect(screen.getAllByRole("button", { name: CHARGEMENT_PREMIUM.reessayer })).toHaveLength(1);
  });

  it("étape repliée : le haut reprend le message, l'alerte et le seul bouton", async () => {
    cacher("u1");
    mockBySlug([Promise.resolve(ko)]);
    const user = userEvent.setup();
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);
    await screen.findByTestId("etape-echec");
    await user.click(screen.getByRole("button", { name: /Étape 2/ }));

    const alerte = await screen.findByRole("alert");
    expect(screen.queryByTestId("etape-echec")).toBeNull();
    expect(screen.queryByTestId("echec-premium-neutre")).toBeNull();
    expect(screen.getByRole("list", { name: "Étapes du parcours" })).not.toContainElement(alerte);
    expect(within(alerte).getByText(CHARGEMENT_PREMIUM.echec)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: CHARGEMENT_PREMIUM.reessayer })).toHaveLength(1);
  });
});

describe("s17 tour 3 (QA) : échec de la validation d'une étape", () => {
  it("message dans la carte au-dessus de « Valider », role alert, focus rendu au bouton, pas de doublon en haut", async () => {
    // Réponses créées à l'appel (un rejet créé d'avance serait signalé comme non géré).
    const posts: Array<() => Promise<Reponse>> = [() => Promise.reject(new Error("réseau")), () => Promise.resolve(ko)];
    global.fetch = jest.fn(async (url: string, init?: RequestInit) =>
      init?.method === "POST"
        ? (posts.shift() ?? (() => Promise.resolve(ko)))()
        : String(url).includes("by-slug")
          ? ok({ path: buildPath(false), userProgress: ETAPE_1_FAITE })
          : ok({}),
    ) as unknown as typeof fetch;
    const user = userEvent.setup();
    render(<ParcoursDetail slug="repartie" initialPath={buildPath(true)} />);
    const etape2 = document.getElementById("etape-2") as HTMLElement;
    await user.click(await within(etape2).findByRole("button", { name: "Valider cette étape" }));

    const alerte = await within(etape2).findByRole("alert");
    expect(alerte).toHaveTextContent("La connexion a lâché en route. Vérifie ton réseau et réessaie.");
    expect(alerte).toHaveClass("text-error-text");
    expect(screen.getAllByRole("alert")).toEqual([alerte]);
    const valider = within(etape2).getByRole("button", { name: "Valider cette étape" });
    // Juste au-dessus du bouton conservé, et l'étape reste dépliée, non validée.
    expect(alerte.compareDocumentPosition(valider) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(etape2.querySelector('[aria-expanded="true"]')).not.toBeNull();
    await waitFor(() => expect(valider).toHaveFocus());

    // Nouvel échec (serveur) : message remplacé, toujours une seule alerte, focus de nouveau sur « Valider ».
    await user.click(valider);
    expect(await within(etape2).findByText("L'étape n'a pas voulu se valider. Réessaie.")).toHaveAttribute("role", "alert");
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    await waitFor(() => expect(within(etape2).getByRole("button", { name: "Valider cette étape" })).toHaveFocus());
  });
});

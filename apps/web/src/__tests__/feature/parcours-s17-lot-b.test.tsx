/**
 * Audit des parcours d'apprentissage s17, lot B (interface) : D1 aperçu
 * visiteur, A2 fausses récompenses et carte de fin, F17 quiz accessible,
 * D2 rythme doux, retour d'exercice, événements data-analyst §5, FS-09.
 * Parcours de 4 et 6 étapes (cas cités par l'audit).
 */
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParcoursDetail, type PathData } from "@/components/parcours/parcours-detail";

jest.mock("@/components/ui/progress-bar", () => ({
  ProgressBar: (props: Record<string, unknown>) => (
    <div data-testid="progress-bar" data-value={props.value} data-max={props.max}>
      {props.label as string}
    </div>
  ),
}));
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }));

let session: { data: unknown; status: string } = { data: null, status: "unauthenticated" };
jest.mock("next-auth/react", () => ({ useSession: () => session }));
const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...a: unknown[]) => mockTrack(...a) }));

const PREMIUM = { data: { user: { name: "Marc", plan: "PREMIUM" } }, status: "authenticated" };

function buildPath(xps: number[], id = "db-path"): PathData {
  return {
    id,
    title: "Parcours Test",
    description: "Description",
    slug: "confiance",
    duration: `${xps.length} semaines`,
    difficulty: "DEBUTANT",
    timePerWeek: "20 min/semaine",
    icon: "🌱",
    nextParcours: "machine-a-cafe",
    nextParcoursReason: null,
    steps: xps.map((xp, i) => ({
      id: `s${i + 1}`,
      order: i + 1,
      dayNumber: (i + 1) * 7,
      tip: {
        id: `tip-${i + 1}`,
        title: `Conseil ${i + 1}`,
        content: `Conseil complet ${i + 1}`,
        category: "GENERAL",
        difficulty: "DEBUTANT",
        example: "",
        exercise: `Exercice ${i + 1}`,
      },
      moduleTitle: `Module ${i + 1}`,
      moduleDetail: `Ce qu'on apprend ${i + 1}`,
      moduleFormat: "Conseil + quiz",
      moduleXp: xp,
      why: `Pourquoi ${i + 1}.`,
      free: i === 0,
      quiz: [],
      videos: [],
    })),
  };
}

type Handler = (url: string, init?: RequestInit) => unknown;
function mockFetch(handler: Handler) {
  global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
    const out = handler(url, init);
    if (out instanceof Error) throw out;
    const { status = 200, body = {} } = (out ?? {}) as { status?: number; body?: unknown };
    return { ok: status < 400, status, json: async () => body };
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  session = { data: null, status: "unauthenticated" };
  mockTrack.mockClear();
  sessionStorage.clear();
  window.history.replaceState(null, "", "/parcours/confiance");
});

describe("A2 : « Parcours terminé ! » et carte de fin pilotés par le serveur", () => {
  it("étape à 100 XP au milieu d'un parcours de 4 : jamais « Parcours terminé ! »", async () => {
    session = PREMIUM;
    const path = buildPath([50, 75, 100, 150]);
    mockFetch((url, init) =>
      init?.method === "POST"
        ? { body: { progress: { completedSteps: [1, 2, 3], currentStep: 3, completedAt: null }, xpGained: 100, pathCompleted: false } }
        : url.includes("by-slug")
          ? { body: { path, userProgress: { completedSteps: [1, 2], currentStep: 2, completedAt: null } } }
          : { body: {} },
    );
    render(<ParcoursDetail slug="confiance" />);
    await userEvent.click(await screen.findByText("Valider cette étape"));
    expect(await screen.findByText("+100 XP gagnés !")).toBeInTheDocument();
    expect(screen.queryByText(/Parcours terminé/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Parcours .+ terminé$/)).not.toBeInTheDocument();
  });

  it("dernière étape d'un parcours de 6 : carte « Bravo » sans recharger, total avec le bonus", async () => {
    session = PREMIUM;
    const path = buildPath([50, 75, 100, 125, 150, 200]);
    mockFetch((url, init) =>
      init?.method === "POST"
        ? // Ancien contrat (fiche sans date de fin) : `pathCompleted` suffit.
          { body: { progress: { completedSteps: [1, 2, 3, 4, 5], currentStep: 6, completedAt: null }, xpGained: 300, pathCompleted: true } }
        : url.includes("by-slug")
          ? { body: { path, userProgress: { completedSteps: [1, 2, 3, 4, 5], currentStep: 5, completedAt: null, startedAt: "2026-09-01T00:00:00Z" } } }
          : { body: { paths: [{ slug: "machine-a-cafe", title: "Parcours Machine à Café", progress: null }] } },
    );
    render(<ParcoursDetail slug="confiance" />);
    expect(await screen.findByText("800 XP au total, dont 100 de bonus à la dernière étape")).toBeInTheDocument();
    await userEvent.click(await screen.findByText("Valider cette étape"));
    expect(await screen.findByText(/^Parcours .+ terminé$/)).toBeInTheDocument();
    // s17 tour 1 : gain affiché dans la carte validée (persistant) et annoncé par la zone vocale.
    expect(screen.getByTestId("etape-resultat")).toHaveTextContent("+300 XP gagnés, dont 100 de bonus de fin. Parcours terminé !");
    expect(screen.getByText("Tu as fait les 6 étapes et gagné 800 XP, bonus de fin compris.")).toBeInTheDocument();
    expect((await screen.findByText("Passer au parcours Machine à Café")).closest("a")).toHaveAttribute(
      "href",
      "/parcours/machine-a-cafe?src=suite",
    );
    // Étalon 3.6 : le carnet seulement quand il ne reste aucun parcours.
    expect(screen.queryByText("ouvrir le carnet")).not.toBeInTheDocument();
    expect(screen.getByText("Ce que tu sais faire maintenant :")).toBeInTheDocument();
    expect(mockTrack).toHaveBeenCalledWith("parcours-termine", expect.objectContaining({ parcours: "confiance", etapes: 6 }));
    expect(mockTrack).toHaveBeenCalledWith(
      "parcours-etape",
      expect.objectContaining({ parcours: "confiance", etape: 6, etapes: 6, termine: "oui" }),
    );
  });

  it("tous les parcours finis : pas de boucle, le carnet", async () => {
    session = PREMIUM;
    const path = buildPath([50, 75, 100]);
    mockFetch((url) =>
      url.includes("by-slug")
        ? { body: { path, userProgress: { completedSteps: [1, 2, 3], currentStep: 3, completedAt: "2026-10-01T00:00:00Z" } } }
        : { body: { paths: [
            { slug: "machine-a-cafe", title: "A", progress: { completedAt: "2026-09-01" } },
            { slug: "confiance", title: "B", progress: { completedAt: "2026-10-01" } },
          ] } },
    );
    render(<ParcoursDetail slug="confiance" />);
    expect(await screen.findByText(/le carnet du mois te donne de nouvelles fiches/)).toBeInTheDocument();
    expect(screen.queryByText(/Passer au parcours/)).not.toBeInTheDocument();
    expect(screen.getByText("ouvrir le carnet").closest("a")).toHaveAttribute("href", "/carnet");
  });
});

describe("Erreurs de validation et chargement (FS-09, lot A)", () => {
  it("409 ordre : le message du serveur, événement parcours-erreur motif refus", async () => {
    session = PREMIUM;
    const path = buildPath([50, 75]);
    mockFetch((url, init) =>
      init?.method === "POST"
        ? { status: 409, body: { code: "ordre", error: "Valide d'abord l'étape 1." } }
        : url.includes("by-slug")
          ? { body: { path, userProgress: { completedSteps: [], currentStep: 0, completedAt: null } } }
          : { body: {} },
    );
    render(<ParcoursDetail slug="confiance" />);
    await userEvent.click(await screen.findByText("Valider cette étape"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Valide d'abord l'étape 1.");
    expect(mockTrack).toHaveBeenCalledWith("parcours-erreur", { parcours: "confiance", etape: 1, motif: "refus" });
  });

  it("contenu abonné qui ne se charge pas : message et « Réessayer », qui recharge", async () => {
    session = PREMIUM;
    const full = buildPath([50, 75]);
    const preview: PathData = {
      ...full,
      steps: full.steps.map((s) => (s.order === 1 ? s : { ...s, locked: true, tip: { ...s.tip, content: "", exercise: "" } })),
    };
    let calls = 0;
    mockFetch(() => {
      calls += 1;
      return calls === 1 ? { status: 500, body: {} } : { body: { path: full, userProgress: { completedSteps: [1], currentStep: 1, completedAt: null } } };
    });
    render(
      <ParcoursDetail
        slug="confiance"
        initialPath={preview}
        initialProgress={{ completedSteps: [1], currentStep: 1, completedAt: null }}
      />,
    );
    await waitFor(() => expect(mockTrack).toHaveBeenCalledWith("parcours-erreur", { parcours: "confiance", etape: 0, motif: "chargement" }));
    // Étape 2 ouverte d'office (étape à reprendre) : plus d'attente sans fin.
    expect(await screen.findByText("Le contenu de l'étape n'a pas voulu se charger.")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Réessayer"));
    expect(await screen.findByText("Conseil complet 2")).toBeInTheDocument();
  });
});

describe("D2 rythme doux et rappel (lien vers le profil)", () => {
  it("abonné : prochaine étape conseillée 7 jours après la dernière validation, rien de bloqué", async () => {
    session = PREMIUM;
    const path = buildPath([50, 75, 100]);
    const deuxJours = new Date(Date.now() - 2 * 86_400_000).toISOString();
    mockFetch((url) =>
      url.includes("rappel-parcours")
        ? { body: { eligible: true, enabled: false } }
        : {
            body: { path, userProgress: { completedSteps: [1], currentStep: 1, completedAt: null }, stepValidations: [{ stepOrder: 1, completedAt: deuxJours }] },
          },
    );
    render(<ParcoursDetail slug="confiance" />);
    expect(await screen.findByText(/Prochaine étape conseillée le .+\. Tu peux y aller dès maintenant si tu veux/)).toBeInTheDocument();
    expect(screen.getByText("Valider cette étape")).toBeInTheDocument();
    expect((await screen.findByText("Règle-le dans ton profil")).closest("a")).toHaveAttribute("href", "/profil#rappel-parcours");
  });

  it("s17 tour 1 (UXV-1-02) : abonné sans droit au rappel (e-mail non vérifié) : aucune invitation", async () => {
    session = PREMIUM;
    const path = buildPath([50, 75, 100]);
    mockFetch((url) =>
      url.includes("rappel-parcours")
        ? { body: { eligible: false, enabled: false } }
        : { body: { path, userProgress: { completedSteps: [1], currentStep: 1, completedAt: null } } },
    );
    render(<ParcoursDetail slug="confiance" />);
    await screen.findByText("Valider cette étape");
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/user/rappel-parcours", expect.anything()));
    expect(screen.queryByText("Règle-le dans ton profil")).not.toBeInTheDocument();
  });

  it("visiteur : ni date conseillée ni lien de rappel", async () => {
    render(<ParcoursDetail slug="confiance" initialPath={buildPath([50, 75])} />);
    await screen.findByText("Pourquoi 1.");
    expect(screen.queryByText(/Prochaine étape conseillée/)).not.toBeInTheDocument();
    expect(screen.queryByText("Règle-le dans ton profil")).not.toBeInTheDocument();
  });
});

describe("Visiteur (D1), quiz accessible (F17), retour d'exercice, événements", () => {
  const withQuiz = (): PathData => {
    const p = buildPath([50, 75]);
    p.steps[0].quiz = [
      { question: "Q1 ?", options: ["Mauvaise", "Bonne"], correctIndex: 1 },
      { question: "Q2 ?", options: ["Bonne 2", "Autre"], correctIndex: 0, explanation: "Parce que." },
    ];
    return p;
  };

  it("correction écrite et annoncée, focus sur « Question suivante », fin sans « Tu peux valider »", async () => {
    render(<ParcoursDetail slug="confiance" initialPath={withQuiz()} />);
    await userEvent.click(await screen.findByText("Mauvaise"));
    const statuses = screen.getAllByRole("status");
    expect(statuses.some((s) => /Pas tout à fait\. La bonne réponse : Bonne/.test(s.textContent ?? ""))).toBe(true);
    expect(screen.getByText("Question suivante")).toHaveFocus();
    await userEvent.click(screen.getByText("Question suivante"));
    await userEvent.click(screen.getByText("Bonne 2"));
    expect(screen.getByText(/Bonne réponse\./)).toBeInTheDocument();
    expect(screen.getByText("Parce que.")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Voir le résultat"));
    expect(screen.getByText("1 sur 2. Les explications sont là pour ça.")).toBeInTheDocument();
    expect(screen.queryByText(/Tu peux valider/)).not.toBeInTheDocument();
    // s17 tour 1 (UXV-1-04) : quiz compté dès la fin, plus de « Continuer » ; titre sans « valider ».
    expect(screen.queryByText("Continuer")).not.toBeInTheDocument();
    expect(screen.getByText("Petit quiz pour t'entraîner")).toBeInTheDocument();
    expect(mockTrack).toHaveBeenCalledWith("quiz-etape-termine", { parcours: "confiance", etape: 1, score: 1, total: 2, statut: "visiteur" });
    // Un seul bouton plein : « Voir l'offre Premium » passe en plein une fois le quiz fini.
    expect(screen.getByRole("link", { name: "Voir l'offre Premium" }).className).toContain("bg-accent-secondary-hover");
    await userEvent.click(screen.getByText("Refaire le quiz"));
    expect(screen.getByText("Q1 ?")).toBeInTheDocument();
    expect(screen.queryByText(/tu peux valider l'étape/)).not.toBeInTheDocument();
  });

  it("événements : parcours-ouvert (src lu dans l'URL), etape-ouverte auto puis manuel, mur de validation", async () => {
    window.history.replaceState(null, "", "/parcours/confiance?src=blog");
    render(<ParcoursDetail slug="confiance" initialPath={buildPath([50, 75])} />);
    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith("parcours-ouvert", { parcours: "confiance", statut: "visiteur", src: "blog" }),
    );
    expect(mockTrack).toHaveBeenCalledWith("etape-ouverte", { parcours: "confiance", etape: 1, statut: "visiteur", declencheur: "auto" });
    expect(mockTrack).toHaveBeenCalledWith("mur-vu", { type: "parcours-validation", src: "confiance", etape: 1 });
    await userEvent.click(screen.getByRole("button", { name: /Étape 2 : Module 2/ }));
    expect(mockTrack).toHaveBeenCalledWith("etape-ouverte", { parcours: "confiance", etape: 2, statut: "visiteur", declencheur: "manuel" });
    // Aperçu D1 : ce qu'on apprend, durée estimée, jamais le conseil.
    expect(screen.getByText("Ce qu'on apprend 2")).toBeInTheDocument();
    // Étalon 3.1 : l'aperçu montre titre, ce qu'on apprend, format, rien d'autre.
  });

  it("src inconnu ramené à direct (liste fermée)", async () => {
    window.history.replaceState(null, "", "/parcours/confiance?src=thomas%40mail.fr");
    render(<ParcoursDetail slug="confiance" initialPath={buildPath([50])} />);
    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith("parcours-ouvert", { parcours: "confiance", statut: "visiteur", src: "direct" }),
    );
  });

  it("retour d'exercice : facultatif, 3 valeurs, événement seul pour un visiteur (aucun envoi serveur)", async () => {
    mockFetch(() => ({ body: {} }));
    render(<ParcoursDetail slug="confiance" initialPath={buildPath([50, 75])} />);
    await userEvent.click(await screen.findByText("Essayé, bof"));
    expect(mockTrack).toHaveBeenCalledWith("etape-retour", { parcours: "confiance", etape: 1, resultat: "essaye-bof" });
    expect(screen.getByText("Essayé, bof")).toHaveAttribute("aria-pressed", "true");
    expect(global.fetch).not.toHaveBeenCalledWith(expect.stringContaining("/retour"), expect.anything());
  });

  it("abonné : retour et quiz terminé envoyés aux routes du lot A, sans bloquer", async () => {
    session = PREMIUM;
    const path = withQuiz();
    mockFetch((url) =>
      url.includes("by-slug")
        ? { body: { path, userProgress: { completedSteps: [], currentStep: 0, completedAt: null } } }
        : url.endsWith("/retour")
          ? { body: { retours: [{ stepOrder: 1, retour: "pas-essaye" }] } }
          : { body: {} },
    );
    render(<ParcoursDetail slug="confiance" />);
    await waitFor(() => expect(screen.getByText("Pas encore essayé")).toHaveAttribute("aria-pressed", "true"));
    await userEvent.click(screen.getByText("Essayé, ça a marché"));
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/parcours/db-path/retour",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ stepOrder: 1, retour: "essaye-ca-a-marche" }) }),
    );
    // N2 (lot E) : la donnée part en base, jamais recopiée dans Umami pour un abonné.
    expect(mockTrack).not.toHaveBeenCalledWith("etape-retour", expect.anything());
    await userEvent.click(screen.getByText("Bonne"));
    await userEvent.click(screen.getByText("Question suivante"));
    await userEvent.click(screen.getByText("Bonne 2"));
    await userEvent.click(screen.getByText("Voir le résultat"));
    await act(async () => {
      await userEvent.click(screen.getByText("Continuer"));
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/parcours/db-path/quiz",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ stepOrder: 1 }) }),
    );
    expect(screen.getByText("Quiz bouclé, tu peux valider l'étape")).toBeInTheDocument();
  });
});

describe("Ancres #etape-N des liens d'entrée (demande du lot C)", () => {
  it("chaque carte porte id=etape-N ; #etape-2 ouvre l'aperçu de l'étape 2 pour un visiteur", async () => {
    window.history.replaceState(null, "", "/parcours/confiance?src=fiche#etape-2");
    // HTML ISR réel : étapes 2+ en aperçu (`locked`).
    const isr = buildPath([50, 75, 100]);
    isr.steps = isr.steps.map((st) => (st.order === 1 ? st : { ...st, locked: true }));
    const { container } = render(<ParcoursDetail slug="confiance" initialPath={isr} />);
    expect(container.querySelector("#etape-1")).not.toBeNull();
    expect(container.querySelector("#etape-3")).not.toBeNull();
    expect(await screen.findByText(/Le conseil, les vannes, les vidéos et le quiz de cette étape font partie de Premium/)).toBeInTheDocument();
    await waitFor(() =>
      expect(mockTrack).toHaveBeenCalledWith("parcours-ouvert", { parcours: "confiance", statut: "visiteur", src: "fiche" }),
    );
  });

  it("abonné : une ancre vers une étape pas encore accessible ouvre l'étape à reprendre", async () => {
    session = PREMIUM;
    window.history.replaceState(null, "", "/parcours/confiance#etape-3");
    const path = buildPath([50, 75, 100]);
    mockFetch(() => ({ body: { path, userProgress: { completedSteps: [1], currentStep: 1, completedAt: null } } }));
    render(<ParcoursDetail slug="confiance" />);
    expect(await screen.findByText("Conseil complet 2")).toBeInTheDocument();
    expect(screen.queryByText("Conseil complet 3")).not.toBeInTheDocument();
  });
});

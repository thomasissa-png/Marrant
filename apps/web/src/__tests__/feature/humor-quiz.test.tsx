import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HumorQuiz } from "@/components/onboarding/humor-quiz";
import { QUIZ_ORIENTATION_CTA } from "@/config/textes/cta-pages";
import { avecOuSansGluon, lie } from "../helpers/texte-normalise";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockTrack = jest.fn();
jest.mock("@/lib/umami", () => ({ trackUmami: (...args: unknown[]) => mockTrack(...args) }));

// s21 B13 : la session décide du plein (abonné : « Voir par où commencer » ; sinon le paiement).
const mockSession = jest.fn(() => ({ status: "authenticated", data: { user: { plan: "PREMIUM" } } }));
jest.mock("next-auth/react", () => ({ useSession: () => mockSession() }));

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
    expect(screen.getByText("C’est quoi ton objectif principal ?")).toBeInTheDocument();
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
    expect(screen.getByText("Être plus à l’aise socialement")).toBeInTheDocument();
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
    expect(screen.getByText(lie("En soirée / rendez-vous"))).toBeInTheDocument();
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

    expect(screen.getByText("En route vers la répartie")).toBeInTheDocument();
    expect(screen.getByText(/potentiel/)).toBeInTheDocument();
  });

  it("shows result for EXPERT path", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Je veux aller encore plus loin"));

    expect(screen.getByText("La future star")).toBeInTheDocument();
  });

  it("navigates to the recommended parcours (répartie + entre potes → /parcours/repartie)", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Mes vannes tombent à plat"));

    await userEvent.click(screen.getByText("Voir par où commencer"));
    expect(mockPush).toHaveBeenCalledWith("/parcours/repartie?src=onboarding#etape-1");
  });

  it("quiz terminé : événement onboarding-termine avec le parcours recommandé (s15)", async () => {
    mockTrack.mockClear();
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    expect(mockTrack).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Mes vannes tombent à plat"));
    expect(mockTrack).toHaveBeenCalledTimes(1);
    expect(mockTrack).toHaveBeenCalledWith("onboarding-termine", { parcours: "repartie" });
  });

  it("shows INTERMEDIAIRE result", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Parfois ça marche"));

    expect(screen.getByText("Le blagueur affûté")).toBeInTheDocument();
  });

  it("shows AVANCE result", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Je fais rire souvent"));

    expect(screen.getByText("Le comique naturel")).toBeInTheDocument();
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
      expect.stringContaining('"result":"En route vers la répartie"')
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
    expect(screen.getByText("En route vers la répartie")).toBeInTheDocument();
    expect(screen.getByText("Voir par où commencer")).toBeInTheDocument();
    expect(screen.getByText("Refaire le quiz")).toBeInTheDocument();
  });

  it("navigates to the recommended parcours from an existing profile", async () => {
    const profile = {
      objective: "REPARTIE",
      context: "social",
      level: "DEBUTANT",
      result: "En Route Vers la Répartie",
      completedAt: "2026-03-01T00:00:00.000Z",
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(profile));

    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Voir par où commencer"));
    expect(mockPush).toHaveBeenCalledWith("/parcours/repartie?src=onboarding#etape-1");
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
    expect(screen.getByText("C’est quoi ton objectif principal ?")).toBeInTheDocument();
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
    expect(screen.getByText("La future star")).toBeInTheDocument();
    expect(screen.getByText(/Quiz complété le/)).toBeInTheDocument();
  });

  // --- s12 T43 : recommandation de parcours à partir de Q1 + Q2 ---

  it("shows the recommended parcours on the result screen", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Avoir de la répartie"));
    await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
    await userEvent.click(screen.getByText("Mes vannes tombent à plat"));

    expect(screen.getByText("Ton point de départ :")).toBeInTheDocument();
    expect(screen.getByText("Parcours Répartie")).toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "humor-profile",
      expect.stringContaining('"parcours":"repartie"')
    );
  });

  it("recommends Machine à Café for « Faire rire les gens » au boulot", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Faire rire les gens"));
    await userEvent.click(screen.getByText("Au boulot / machine à café"));
    await userEvent.click(screen.getByText("Parfois ça marche"));

    await userEvent.click(screen.getByText("Voir par où commencer"));
    expect(mockPush).toHaveBeenCalledWith("/parcours/machine-a-cafe?src=onboarding#etape-1");
  });

  it("recommends Confiance for « Être plus à l'aise socialement »", async () => {
    render(<HumorQuiz />);
    await userEvent.click(screen.getByText("Être plus à l’aise socialement"));
    await userEvent.click(screen.getByText("Partout"));
    await userEvent.click(screen.getByText("Je fais rire souvent"));

    await userEvent.click(screen.getByText("Voir par où commencer"));
    expect(mockPush).toHaveBeenCalledWith("/parcours/confiance?src=onboarding#etape-1");
  });

  it("shows the exit link when exitHref is provided", () => {
    render(<HumorQuiz exitHref="/vannes" />);
    expect(screen.getByText(lie("Plus tard, laisse-moi explorer")).closest("a")).toHaveAttribute("href", "/vannes");
  });

  it("hides the exit link without exitHref", () => {
    render(<HumorQuiz />);
    expect(screen.queryByText(avecOuSansGluon("Plus tard, laisse-moi explorer"))).not.toBeInTheDocument();
  });

  describe("s21 B13 : compte sans abonnement", () => {
    const finir = async () => {
      await userEvent.click(screen.getByText("Avoir de la répartie"));
      await userEvent.click(screen.getByText("Entre potes / en soirée étudiante"));
      await userEvent.click(screen.getByText("Mes vannes tombent à plat"));
    };
    afterEach(() => mockSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "PREMIUM" } } }));

    it("trajet de conversion s21 : visiteur, porte « Tout ouvrir » vers /abonnement (src=onboarding, parcours conseillé), sans ligne d'objet", async () => {
      mockSession.mockReturnValue({ status: "unauthenticated", data: { user: { plan: "FREE" } } });
      render(<HumorQuiz />);
      await finir();
      const bloc = document.querySelector<HTMLElement>("[data-quiz-orientation-cta]")!;
      const lien = bloc.querySelector("a")!;
      expect((lien.textContent ?? "").replace(/\s/g, " ")).toBe("Tout ouvrir · 2,99 €/mois");
      expect(lien).toHaveAttribute("href", "/abonnement?returnTo=%2Fparcours%2Frepartie&src=onboarding");
      expect(bloc.textContent).not.toContain("Premium ouvre ce parcours");
    });

    it("concision v5 : titre, une phrase, plein « S'abonner » (paiement direct), REASS, lien GRATUIT_P", async () => {
      mockSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "FREE" } } });
      const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
      global.fetch = fetchMock as unknown as typeof fetch;
      render(<HumorQuiz />);
      await finir();
      const bloc = document.querySelector<HTMLElement>("[data-quiz-orientation-cta]")!;
      const texte = (bloc.textContent ?? "").replace(/\u00a0/g, " ");
      expect(texte).toBe(
        // Trajet de conversion s21 §2 : ligne d'objet avant « S'abonner » (le compte paie sans avoir lu l'offre).
        "Ton parcours : RépartiePour toi si on te chambre et que tu cherches encore quoi répondre.Premium ouvre ce parcours et tout le reste.S’abonner · 2,99 €/moisPremium : premier paiement remboursable sous 14 jours. Résiliable depuis ton profil.",
      );
      const gratuit = screen.getByRole("button", { name: /^Tester l['’]étape\s1\sde Répartie, gratuite$/ });
      expect(document.body.textContent).not.toMatch(/Ton quiz te conseille|Ton compte est prêt|Voir par où commencer|Tout débloquer/);
      // QA v4 m-4 : parcours nommé une seule fois (plus de « Ton point de départ : Parcours Répartie »
      // ni de raison hors v5) ; le plein payant passe au-dessus du lien gratuit.
      expect(screen.queryByText("Ton point de départ :")).not.toBeInTheDocument();
      expect(screen.queryByText("Parcours Répartie")).not.toBeInTheDocument();
      expect((document.body.textContent ?? "").match(/Ton parcours/g)).toHaveLength(1);
      const pleinAvant = screen.getByRole("button", { name: QUIZ_ORIENTATION_CTA.bouton("repartie") });
      expect(pleinAvant.compareDocumentPosition(gratuit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      await userEvent.click(gratuit);
      expect(mockPush).toHaveBeenCalledWith("/parcours/repartie?src=onboarding#etape-1");
      const plein = screen.getByRole("button", { name: QUIZ_ORIENTATION_CTA.bouton("repartie") });
      await userEvent.click(plein);
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ returnTo: "/parcours/repartie" });
      expect(mockTrack).toHaveBeenCalledWith("abonnement-clic", expect.objectContaining({ src: "onboarding" }));
    });

    it("abonné : aucun bouton de paiement", async () => {
      render(<HumorQuiz />);
      await finir();
      expect(screen.queryByText(QUIZ_ORIENTATION_CTA.bouton("repartie"))).not.toBeInTheDocument();
    });

    it("titre et phrase par parcours (table LIGNE_QUIZ de la v5)", () => {
      expect(QUIZ_ORIENTATION_CTA.titre("machine-a-cafe")).toBe("Ton parcours : Machine à Café");
      expect(QUIZ_ORIENTATION_CTA.phrase("machine-a-cafe")).toBe("Pour toi si tu veux faire rire à la pause.");
      expect(QUIZ_ORIENTATION_CTA.phrase("confiance")).toBe("Pour toi si tu aimerais rire plus souvent avec les autres.");
      expect(QUIZ_ORIENTATION_CTA.phrase("storytelling")).toBe("Pour toi si ta chute arrive quand tout le monde est passé au dessert.");
      expect(QUIZ_ORIENTATION_CTA.phrase("boulot")).toBe("Pour toi si, le lundi à 9 h, tu prends un ton de compte rendu.");
    });
  });
});

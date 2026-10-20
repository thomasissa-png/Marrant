import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DailyContent } from "@/components/home/daily-content";
import { dureeAffichee, guillemetsImbriques } from "@/components/home/daily-content-format";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockReturnValue({ status: "authenticated" }),
}));

jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: () => ({
    isFavorite: jest.fn().mockReturnValue(false),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getFavoriteId: jest.fn().mockReturnValue(null),
  }),
}));

jest.mock("@/stores/user-store", () => ({
  useUserStore: jest.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({ user: { plan: "PREMIUM" } })
  ),
}));

jest.mock("@/components/ui/toast", () => ({
  toast: jest.fn(),
}));

const mockDailyData = {
  joke: {
    id: "j1",
    content: "Pourquoi les plongeurs plongent-ils toujours en arrière ?",
    punchline: "Parce que sinon ils tomberaient dans le bateau.",
    category: "ABSURDE",
    comedyTechnique: "La logique absurde",
    techniqueExplanation: "On applique une rigueur logique à une situation où elle n'a pas sa place — l'incongruité fait rire.",
    howToApply: "Cherche un contexte courant et applique-lui une explication ultra-rationnelle mais hors-sujet.",
  },
  tip: {
    id: "t1",
    title: "Le timing parfait",
    content: "Fais une pause avant la chute.",
    category: "TIMING",
    difficulty: "DEBUTANT",
    example: "Quand tu racontes une histoire, marque une pause de 2 secondes.",
    exercise: "Raconte une blague à un ami en faisant 3 pauses aujourd'hui.",
  },
  video: {
    id: "v1",
    youtubeId: "dQw4w9WgXcQ",
    title: "Les secrets du timing comique",
    channelName: "Humour Academy",
    duration: "PT12M30S",
    category: "TIMING",
    technique: "Pause dramatique",
    learnings: ["Maîtriser la pause avant la chute", "Varier le rythme de parole"],
    exercise: "Raconte une blague en variant les pauses ce soir.",
  },
};

describe("DailyContent", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDailyData,
    });
  });

  it("shows loading skeleton initially", () => {
    const { container } = render(<DailyContent />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows section title", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Ton contenu du jour")).toBeInTheDocument();
    });
  });

  it("shows Vanne du jour section", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Vanne du jour").length).toBeGreaterThan(0);
    });
  });

  it("shows Conseil du jour section", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Conseil du jour").length).toBeGreaterThan(0);
    });
  });

  it("shows Vidéo du jour section", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Vidéo du jour").length).toBeGreaterThan(0);
    });
  });

  it("shows joke setup", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(
        screen.getByText("Pourquoi les plongeurs plongent-ils toujours en arrière ?")
      ).toBeInTheDocument();
    });
  });

  it("shows 'Révéler la chute' button", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Révéler la chute")).toBeInTheDocument();
    });
    const bouton = screen.getByRole("button", { name: "Révéler la chute" });
    expect(bouton).toHaveAttribute("aria-expanded", "false");
    expect(bouton).toHaveAttribute("aria-controls", "chute-du-jour");
  });

  it("reveals punchline on button click", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Révéler la chute")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText("Révéler la chute"));
    expect(screen.getByText("Parce que sinon ils tomberaient dans le bateau.")).toBeInTheDocument();
  });

  it("replaces the button with the punchline in place, moves focus and announces it (cartes du jour §2.4)", async () => {
    const { container } = render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Révéler la chute" })).toBeInTheDocument();
    });
    const emplacement = container.querySelector("#chute-du-jour");
    expect(emplacement).toHaveAttribute("aria-live", "polite");
    expect(emplacement).toContainElement(screen.getByRole("button", { name: "Révéler la chute" }));
    // Avant le clic, la chute n'est nulle part dans le DOM (tour 2.1 : plus de réserve invisible).
    expect(screen.queryByText("Parce que sinon ils tomberaient dans le bateau.")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Révéler la chute" }));

    // Même emplacement : la chute prend la place du bouton, qui disparaît.
    expect(container.querySelector("#chute-du-jour")).toBe(emplacement);
    expect(screen.queryByRole("button", { name: "Révéler la chute" })).not.toBeInTheDocument();
    const chute = screen.getByText("Parce que sinon ils tomberaient dans le bateau.");
    expect(emplacement).toContainElement(chute);
    expect(screen.getAllByText("Parce que sinon ils tomberaient dans le bateau.")).toHaveLength(1);
    expect(chute.closest("[aria-hidden='true']")).toBeNull();
    // Focus clavier déplacé sur la chute (conteneur focusable par script uniquement).
    const cible = chute.closest("[tabindex='-1']");
    expect(cible).not.toBeNull();
    expect(cible).toHaveFocus();
  });

  it("keeps « Pourquoi ça marche » closed by default after the reveal (décision D1)", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Révéler la chute" })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: "Révéler la chute" }));

    const titre = screen.getByText("Pourquoi ça marche");
    const accordeon = titre.closest("details");
    expect(accordeon).not.toBeNull();
    expect(accordeon).not.toHaveAttribute("open");
    // Un seul format d'en-tête (V2.6) : « Pourquoi ça marche » seul, la technique ouvre le corps.
    expect(titre).toHaveTextContent(/^Pourquoi ça marche$/);
    // V3.5 : la technique est l'intertitre de la 1re section, sur sa propre ligne.
    const technique = screen.getByText("La logique absurde");
    expect(accordeon).toContainElement(technique);
    expect(technique.tagName).toBe("P");
    expect(technique.nextElementSibling).toHaveTextContent(/^On applique une rigueur logique/);

    await userEvent.click(titre);
    expect(accordeon).toHaveAttribute("open");
  });

  it("uses one neutral header per card: type label, no primary/secondary badge (cartes du jour §2.3)", async () => {
    const { container } = render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Le timing parfait")).toBeInTheDocument();
    });
    for (const type of ["Vanne du jour", "Conseil du jour", "Vidéo du jour"]) {
      expect(screen.getByText(type).tagName).toBe("P");
    }
    expect(container.querySelector(".bg-accent-primary\\/20, .bg-accent-secondary\\/30")).toBeNull();
  });

  it("shows « Lire la suite » only when the tip text is truncated, and unfolds it in place (V2.3)", async () => {
    const hauteurs = jest.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(240);
    const visibles = jest.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(144);
    try {
      render(<DailyContent />);
      const bouton = await screen.findByRole("button", { name: "Lire la suite" });
      const texte = screen.getByText("Fais une pause avant la chute.");
      expect(bouton).toHaveAttribute("aria-expanded", "false");
      expect(bouton).toHaveAttribute("aria-controls", texte.id);
      // V3.4 : extrait de 4 lignes entières (96 px), dernière ligne en fondu, plus de line-clamp.
      expect(texte).toHaveClass("max-h-24", "overflow-hidden");
      expect(texte.className).toContain("mask-image");
      expect(texte.className).not.toContain("line-clamp");

      await userEvent.click(bouton);
      expect(screen.getByRole("button", { name: "Réduire" })).toHaveAttribute("aria-expanded", "true");
      expect(texte).not.toHaveClass("max-h-24");
      expect(texte.className).not.toContain("mask-image");
    } finally {
      hauteurs.mockRestore();
      visibles.mockRestore();
    }
  });

  it("hides « Lire la suite » when the tip text fits", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Fais une pause avant la chute.")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "Lire la suite" })).not.toBeInTheDocument();
  });

  it("renders nested quotes as “…” inside « … » (display only, V2.5)", () => {
    const nbsp = String.fromCharCode(0xa0);
    expect(guillemetsImbriques(`Ex${nbsp}: «${nbsp}Ils disent${nbsp}: «${nbsp}Non non.${nbsp}»${nbsp}»`)).toBe(
      `Ex${nbsp}: «${nbsp}Ils disent${nbsp}: “Non non.”${nbsp}»`,
    );
    expect(guillemetsImbriques(`«${nbsp}Un${nbsp}» et «${nbsp}deux${nbsp}»`)).toBe(`«${nbsp}Un${nbsp}» et «${nbsp}deux${nbsp}»`);
    expect(guillemetsImbriques("» orphelin puis « ouvert »")).toBe("» orphelin puis « ouvert »");
  });

  it("formats the ISO 8601 video duration for display only, or nothing (tour 2.1)", () => {
    expect(dureeAffichee("PT8M12S")).toBe("8 min");
    expect(dureeAffichee("PT5M51S")).toBe("6 min");
    expect(dureeAffichee("PT1H4M40S")).toBe("1 h 05");
    expect(dureeAffichee("PT45S")).toBe("45 s");
    expect(dureeAffichee("12:30")).toBeNull();
    expect(dureeAffichee("PT")).toBeNull();
    expect(dureeAffichee("")).toBeNull();
    expect(dureeAffichee(null)).toBeNull();
  });

  it("shows the video duration next to the channel, nothing on the thumbnail (V3.6)", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Humour Academy").closest("p")).toHaveTextContent(/^Humour Academy · 13 min$/);
    });
    expect(screen.getByLabelText("Lire la vidéo : Les secrets du timing comique")).not.toHaveTextContent("13 min");
  });

  it("keeps the duration alone when the channel line is redundant", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockDailyData,
        video: { ...mockDailyData.video, title: "Humour Academy - Les secrets du timing", channelName: "Humour Academy" },
      }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("13 min").closest("p")).toHaveTextContent(/^13 min$/);
    });
  });

  it("is a labelled section, not a focusable scroll region (cartes du jour §2.2)", async () => {
    const { container } = render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByRole("region", { name: "Ton contenu du jour" }).tagName).toBe("SECTION");
    });
    expect(container.querySelector("[tabindex='0']")).toBeNull();
    expect(container.querySelector(".overflow-x-auto")).toBeNull();
  });

  it("hides the channel line when the video title already starts with it (display only)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockDailyData,
        video: { ...mockDailyData.video, title: "Humour Academy - Les secrets du timing", channelName: "humour academy" },
      }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Humour Academy - Les secrets du timing")).toBeInTheDocument();
    });
    expect(screen.queryByText("humour academy")).not.toBeInTheDocument();
  });

  it("shows category badge", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Absurde")).toBeInTheDocument();
    });
  });

  it("shows tip title and content", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Le timing parfait")).toBeInTheDocument();
      expect(screen.getByText("Fais une pause avant la chute.")).toBeInTheDocument();
    });
  });

  it("shows tip category badge", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getAllByText("Timing").length).toBeGreaterThan(0);
    });
  });

  it("shows video title and channel", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Les secrets du timing comique")).toBeInTheDocument();
      expect(screen.getByText("Humour Academy")).toBeInTheDocument();
    });
  });

  it("shows YouTube thumbnail with play button", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      const playButton = screen.getByLabelText("Lire la vidéo : Les secrets du timing comique");
      expect(playButton).toBeInTheDocument();
    });
  });

  it("shows video technique badge", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Pause dramatique")).toBeInTheDocument();
    });
  });

  it("shows no content messages when null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ joke: null, tip: null, video: null }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Même l’humour prend un jour off. Reviens demain pour ta dose !")).toBeInTheDocument();
      expect(screen.getByText("Le conseil du jour s’est attardé à la machine à café. Il revient demain, avec des anecdotes.")).toBeInTheDocument();
      expect(screen.getByText("L’humoriste du jour est en coulisses. À demain !")).toBeInTheDocument();
    });
  });

  it("handles missing video gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockDailyData, video: null }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("L’humoriste du jour est en coulisses. À demain !")).toBeInTheDocument();
      expect(
        screen.getByText("Pourquoi les plongeurs plongent-ils toujours en arrière ?")
      ).toBeInTheDocument();
    });
  });

  it("handles fetch error gracefully", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Même l’humour prend un jour off. Reviens demain pour ta dose !")).toBeInTheDocument();
      expect(screen.getByText("Le conseil du jour s’est attardé à la machine à café. Il revient demain, avec des anecdotes.")).toBeInTheDocument();
      expect(screen.getByText("L’humoriste du jour est en coulisses. À demain !")).toBeInTheDocument();
    });
  });

  it("handles network failure gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Même l’humour prend un jour off. Reviens demain pour ta dose !")).toBeInTheDocument();
    });
  });

  it("shows tip example and exercise", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Exemple concret")).toBeInTheDocument();
      expect(screen.getByText(/Quand tu racontes une histoire/)).toBeInTheDocument();
      expect(screen.getByText("Exercice du jour")).toBeInTheDocument();
      expect(screen.getByText(/Raconte une blague à un ami/)).toBeInTheDocument();
    });
  });

  it("hides example/exercise when not available", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockDailyData,
        tip: { ...mockDailyData.tip, example: undefined, exercise: undefined },
      }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Le timing parfait")).toBeInTheDocument();
      expect(screen.queryByText("Exemple concret")).not.toBeInTheDocument();
      expect(screen.queryByText("Exercice du jour")).not.toBeInTheDocument();
    });
  });

  it("shows video learnings", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Ce que tu vas apprendre")).toBeInTheDocument();
      expect(screen.getByText("Maîtriser la pause avant la chute")).toBeInTheDocument();
      expect(screen.getByText("Varier le rythme de parole")).toBeInTheDocument();
    });
  });

  it("shows video exercise", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Exercice pratique")).toBeInTheDocument();
      expect(screen.getByText("Raconte une blague en variant les pauses ce soir.")).toBeInTheDocument();
    });
  });

  it("hides video learnings/exercise when not available", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockDailyData,
        video: { ...mockDailyData.video, learnings: [], exercise: null },
      }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Les secrets du timing comique")).toBeInTheDocument();
      expect(screen.queryByText("Ce que tu vas apprendre")).not.toBeInTheDocument();
      expect(screen.queryByText("Exercice pratique")).not.toBeInTheDocument();
    });
  });

  it("fetches from /api/daily", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/daily");
    });
  });

  it("shows share buttons for joke, tip and video", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      const shareButtons = screen.getAllByLabelText("Partager");
      expect(shareButtons).toHaveLength(3);
    });
  });

  it("shows favorite buttons for joke, tip and video", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      const favButtons = screen.getAllByLabelText("Ajouter aux favoris");
      expect(favButtons).toHaveLength(3);
    });
  });

  it("shows décryptage block when joke is revealed and comedyTechnique exists", async () => {
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Révéler la chute")).toBeInTheDocument();
    });

    // Avant révélation : pas de décryptage (tour 2.1 : plus d'accordéon réservé).
    expect(screen.queryByText(/Pourquoi ça marche/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Révéler la chute"));

    expect(screen.getByText(/Pourquoi ça marche/)).toBeInTheDocument();
    expect(screen.getByText("À toi de jouer")).toBeInTheDocument();
    expect(
      screen.getByText(/On applique une rigueur logique/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Cherche un contexte courant/)).toBeInTheDocument();
  });

  it("hides décryptage block when comedyTechnique is null (not yet back-filled)", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockDailyData,
        joke: {
          ...mockDailyData.joke,
          comedyTechnique: null,
          techniqueExplanation: null,
          howToApply: null,
        },
      }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Révéler la chute")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Révéler la chute"));

    // Punchline visible mais SANS bloc décryptage
    expect(
      screen.getByText("Parce que sinon ils tomberaient dans le bateau.")
    ).toBeInTheDocument();
    expect(screen.queryByText(/Pourquoi ça marche/)).not.toBeInTheDocument();
    expect(screen.queryByText("À toi de jouer")).not.toBeInTheDocument();
  });

  it("does not show share/favorite buttons when content is null", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ joke: null, tip: null, video: null }),
    });
    render(<DailyContent />);
    await waitFor(() => {
      expect(screen.getByText("Même l’humour prend un jour off. Reviens demain pour ta dose !")).toBeInTheDocument();
    });
    expect(screen.queryByLabelText("Partager")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Ajouter aux favoris")).not.toBeInTheDocument();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VannesList } from "@/components/vannes/vannes-list";

const mockPush = jest.fn();
let mockSearch = "";
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(mockSearch),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next-auth/react", () => ({
  useSession: () => ({ status: "unauthenticated" }),
}));

jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: () => ({
    isFavorite: () => false,
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getFavoriteId: () => null,
  }),
}));

const mockJokes = [
  {
    id: "1",
    content: "Setup vanne 1",
    punchline: "Chute 1",
    category: "ABSURDE",
    type: "ONESHOT",
    maturityLevel: 1,
    comedyTechnique: "La triple chute",
    techniqueExplanation: "On enchaîne trois retournements de plus en plus absurdes.",
    howToApply: "Garde la chute la plus folle pour la fin.",
  },
  {
    id: "2",
    content: "Setup vanne 2",
    punchline: "Chute 2",
    category: "SITUATION",
    type: "DIALOGUE",
    maturityLevel: 2,
    comedyTechnique: null,
    techniqueExplanation: null,
    howToApply: null,
  },
];

describe("VannesList", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        jokes: mockJokes,
        pagination: { page: 1, limit: 12, total: 2, totalPages: 1 },
      }),
    });
  });

  it("renders category filter tabs", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByRole("tablist", { name: "Catégories de vannes" })).toBeInTheDocument();
    });
    expect(screen.getByRole("tab", { name: "Toutes" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Absurde" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Vie quotidienne" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Couple & Dating" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Digital & Gaming" })).toBeInTheDocument();
  });

  it("shows aria-selected on active category", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Toutes" })).toHaveAttribute("aria-selected", "true");
    });
    expect(screen.getByRole("tab", { name: "Absurde" })).toHaveAttribute("aria-selected", "false");
  });

  it("fetches and displays jokes", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
      expect(screen.getByText("Setup vanne 2")).toBeInTheDocument();
    });
  });

  it("shows punchline hint", async () => {
    render(<VannesList />);
    await waitFor(() => {
      // Les teasers varient par index — vérifier qu'il y a 2 hints (1 par vanne non révélée)
      expect(screen.getByText("Clique pour la chute")).toBeInTheDocument();
      expect(screen.getByText("Parie sur la chute, puis vérifie")).toBeInTheDocument();
    });
  });

  it("reveals punchline on card click", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Setup vanne 1"));
    expect(screen.getByText("Chute 1")).toBeInTheDocument();
  });

  it("reveals punchline with the « Révéler la chute » button (s12 T16)", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByRole("button", { name: "Révéler la chute" })[0]);
    expect(screen.getByText("Chute 1")).toBeInTheDocument();
  });

  it("shows readable joke type labels, never raw enums (s12 T13)", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });
    expect(screen.queryByText("DIALOGUE")).not.toBeInTheDocument();
    expect(screen.getByText("Dialogue")).toBeInTheDocument();
    // Type inconnu (ONESHOT dans la fixture) : aucun badge brut.
    expect(screen.queryByText("ONESHOT")).not.toBeInTheDocument();
  });

  it("shows décryptage block when revealed and fields exist", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });

    // Avant révélation : pas de décryptage visible
    expect(screen.queryByText(/Pourquoi ça marche/)).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Setup vanne 1"));

    expect(screen.getByText(/Pourquoi ça marche/)).toBeInTheDocument();
    expect(screen.getByText("À toi de jouer")).toBeInTheDocument();
    expect(
      screen.getByText("On enchaîne trois retournements de plus en plus absurdes.")
    ).toBeInTheDocument();
    expect(screen.getByText("Garde la chute la plus folle pour la fin.")).toBeInTheDocument();
  });

  it("hides décryptage block when fields are null (not yet back-filled)", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 2")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Setup vanne 2"));

    // Vanne 2 révélée (chute visible) mais SANS décryptage (champs null)
    expect(screen.getByText("Chute 2")).toBeInTheDocument();
    expect(screen.queryByText("À toi de jouer")).not.toBeInTheDocument();
  });

  it("shows category badge labels", async () => {
    render(<VannesList />);
    await waitFor(() => {
      // ABSURDE → "Absurde", SITUATION → "Vie quotidienne" (grouped label)
      expect(screen.getByText("Absurde")).toBeInTheDocument();
      expect(screen.getByText("Vie quotidienne")).toBeInTheDocument();
    });
  });

  it("shows error state on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network"));
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Les vannes se sont perdues en chemin.")).toBeInTheDocument();
    });
    expect(screen.getByText("Réessayer")).toBeInTheDocument();
  });

  it("shows empty state when no jokes", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ jokes: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } }),
    });
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Rien dans cette catégorie pour l'instant, même pas un jeu de mots")).toBeInTheDocument();
    });
  });

  it("changes category on filter click (single)", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("tab", { name: "Absurde" }));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("category=ABSURDE"));
  });

  it("sends grouped categories for merged filters", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("tab", { name: "Couple & Dating" }));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("category=COUPLE%2CDATING"));
  });

  it("does not show pagination when only 1 page", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });
    expect(screen.queryByText("Précédent")).not.toBeInTheDocument();
  });

  it("shows pagination when multiple pages", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        jokes: mockJokes,
        pagination: { page: 1, limit: 12, total: 30, totalPages: 3 },
      }),
    });
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Précédent")).toBeInTheDocument();
      expect(screen.getByText("Suivant")).toBeInTheDocument();
      expect(screen.getByText("Page 1 / 3")).toBeInTheDocument();
    });
  });

  it("disables Précédent on first page", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        jokes: mockJokes,
        pagination: { page: 1, limit: 12, total: 30, totalPages: 3 },
      }),
    });
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Précédent")).toBeDisabled();
    });
  });

  describe("liste rendue par le serveur (lot S1 s14, P0-1)", () => {
    const serverPage = (page: number) => ({
      items: mockJokes.map((j) => ({ ...j, id: `${j.id}-p${page}`, howToApply: null })),
      page,
      limit: 12,
      total: 30,
      totalPages: 3,
    });

    afterEach(() => {
      mockSearch = "";
    });

    it("affiche les vannes du serveur et leurs liens de fiche dès le premier rendu", () => {
      global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock; // fetch jamais résolu
      render(<VannesList initialData={serverPage(1)} initialPage={1} />);
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
      const ficheLinks = screen.getAllByRole("link", { name: "Ouvrir la page dédiée de cette vanne" });
      expect(ficheLinks).toHaveLength(2);
      expect(ficheLinks[0].getAttribute("href")).toMatch(/^\/vannes\/setup-vanne-1-/);
    });

    it("pagination en vrais liens ?page=N (page 1 sans paramètre)", () => {
      mockSearch = "page=2";
      global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
      render(<VannesList initialData={serverPage(2)} initialPage={2} />);
      expect(screen.getByText("Page 2 / 3")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Précédent" })).toHaveAttribute("href", "/vannes");
      expect(screen.getByRole("link", { name: "Suivant" })).toHaveAttribute("href", "/vannes?page=3");
    });

    it("clic sur Suivant : pas de rechargement, URL mise à jour, page suivante chargée", async () => {
      mockSearch = "page=2";
      const pushState = jest.spyOn(window.history, "pushState");
      render(<VannesList initialData={serverPage(2)} initialPage={2} />);
      await userEvent.click(screen.getByRole("link", { name: "Suivant" }));
      expect(pushState).toHaveBeenCalledWith(null, "", expect.stringContaining("page=3"));
      await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("page=3")));
      pushState.mockRestore();
    });

    it("garde la liste du serveur si l'API est inaccessible (robot, /api/ interdit)", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("blocked")) as jest.Mock;
      render(<VannesList initialData={serverPage(1)} initialPage={1} />);
      await waitFor(() => expect(global.fetch).toHaveBeenCalled());
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
      expect(screen.queryByText("Les vannes se sont perdues en chemin.")).not.toBeInTheDocument();
    });

    it("recharge la page via l'API avec le même numéro de page", async () => {
      mockSearch = "page=2";
      render(<VannesList initialData={serverPage(2)} initialPage={2} />);
      await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("page=2")));
    });

    it("aperçu gratuit dépassé (page 2, compte FREE) : cartes verrouillées, pas d'état vide", async () => {
      mockSearch = "page=2";
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          jokes: [],
          pagination: { page: 2, limit: 12, total: 10, totalPages: 1 },
          limited: true,
          totalReal: 30,
          upgradeMessage: "Abonne-toi pour accéder à toutes les vannes",
        }),
      }) as jest.Mock;
      render(<VannesList initialData={serverPage(2)} initialPage={2} />);
      await waitFor(() => {
        expect(screen.getByText("Abonne-toi pour accéder à toutes les vannes")).toBeInTheDocument();
      });
      expect(screen.getAllByRole("button", { name: "Contenu Premium : voir l'offre" }).length).toBeGreaterThan(0);
      expect(screen.queryByText(/Rien dans cette catégorie/)).not.toBeInTheDocument();
      // La pagination du catalogue public reste disponible (retour en page 1).
      expect(screen.getByRole("link", { name: "Précédent" })).toHaveAttribute("href", "/vannes");
    });
  });
});

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MUR_LISTE } from "@/config/textes/cta-pages";
import { frTypo } from "@/lib/fr-typo";
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
    // Absent de jsdom : appelé par useListPage après un changement de page (s20).
    Element.prototype.scrollIntoView = jest.fn();
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

    // Toucher l'amorce elle-même révèle la chute (geste de la page, rétabli après 5cecb79).
    await userEvent.click(screen.getByText("Setup vanne 1"));
    expect(screen.getByText("Chute 1")).toBeInTheDocument();
  });

  it("s21 : la flèche de coin est le seul lien vers la fiche, sans texte visible, et ne révèle pas la chute", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });
    // L'amorce n'est plus un lien.
    expect(screen.queryByRole("link", { name: "Setup vanne 1" })).not.toBeInTheDocument();
    const fleche = screen.getAllByRole("link", { name: "Voir la fiche de cette vanne" })[0];
    expect(fleche.getAttribute("href")).toMatch(/^\/vannes\/setup-vanne-1-/);
    expect(fleche.textContent?.trim()).toBe("");
    expect(fleche.className).toContain("h-11 w-11");
    const carte = fleche.closest(".cursor-pointer")!;
    expect([...carte.querySelectorAll('a[href^="/vannes/"]')]).toEqual([fleche]);
    expect(screen.queryByText(/Page dédiée/)).not.toBeInTheDocument();
    fleche.focus();
    expect(fleche).toHaveFocus();
    // Le clic sur la flèche mène à la fiche : il ne révèle pas la chute dans la liste.
    fleche.addEventListener("click", (e) => e.preventDefault());
    await userEvent.click(fleche);
    expect(screen.queryByText("Chute 1")).not.toBeInTheDocument();
  });

  it("reveals punchline with the « Révéler la chute » button (s12 T16)", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByRole("button", { name: "Révéler la chute" })[0]);
    expect(screen.getByText("Chute 1")).toBeInTheDocument();
  });

  it("concision v5 : plus d'étiquette de type sur les cartes, jamais d'enum brut", async () => {
    render(<VannesList />);
    await waitFor(() => {
      expect(screen.getByText("Setup vanne 1")).toBeInTheDocument();
    });
    expect(screen.queryByText("DIALOGUE")).not.toBeInTheDocument();
    expect(screen.queryByText("Dialogue")).not.toBeInTheDocument();
    expect(screen.queryByText("One-liner")).not.toBeInTheDocument();
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

    await userEvent.click(screen.getAllByRole("button", { name: "Révéler la chute" })[0]);

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

    await userEvent.click(screen.getAllByRole("button", { name: "Révéler la chute" })[1]);

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
      expect(screen.getByText("Rien dans cette catégorie pour l’instant, même pas un jeu de mots")).toBeInTheDocument();
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
      // s20 (S1) : la rangée de numéros remplace « Page X / Y ».
      expect(screen.getByText("1").closest("[aria-current]")).toHaveAttribute("aria-current", "page");
    });
  });

  it("Précédent inactif en page 1 : span aria-hidden, aucun lien", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        jokes: mockJokes,
        pagination: { page: 1, limit: 12, total: 30, totalPages: 3 },
      }),
    });
    render(<VannesList />);
    await waitFor(() => {
      // s20 (relecture UX) : extrémité inactive = span aria-hidden, plus de bouton désactivé.
      expect(screen.getByText("Précédent").closest('[aria-hidden="true"]')).not.toBeNull();
      expect(screen.queryByRole("link", { name: /Page précédente/ })).not.toBeInTheDocument();
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
      // s21 : un seul lien par carte vers la fiche, la flèche de coin ; même maillage qu'avant.
      const ficheLinks = screen.getAllByRole("link").filter((a) => /^\/vannes\/[^?]/.test(a.getAttribute("href") ?? ""));
      expect(ficheLinks).toHaveLength(2);
      expect(ficheLinks[0]).toHaveAccessibleName("Voir la fiche de cette vanne");
      expect(ficheLinks[0].getAttribute("href")).toMatch(/^\/vannes\/setup-vanne-1-/);
    });

    it("pagination en vrais liens ?page=N (page 1 sans paramètre)", () => {
      mockSearch = "page=2";
      global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
      render(<VannesList initialData={serverPage(2)} initialPage={2} />);
      expect(screen.getByText("2").closest("[aria-current]")).toHaveAttribute("aria-current", "page");
      expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("href", "/vannes?page=3");
      expect(screen.getByRole("link", { name: "Page précédente (page 1)" })).toHaveAttribute("href", "/vannes");
      expect(screen.getByRole("link", { name: "Page suivante (page 3)" })).toHaveAttribute("href", "/vannes?page=3");
    });

    it("clic sur Suivant : pas de rechargement, URL mise à jour, page suivante chargée", async () => {
      mockSearch = "page=2";
      const pushState = jest.spyOn(window.history, "pushState");
      render(<VannesList initialData={serverPage(2)} initialPage={2} />);
      await userEvent.click(screen.getByRole("link", { name: "Page suivante (page 3)" }));
      expect(pushState).toHaveBeenCalledWith(null, "", expect.stringContaining("page=3"));
      await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("page=3")));
      pushState.mockRestore();
    });

    it("s20 : clic sur un numéro en bas de liste → retour instantané en haut de la liste, focus, annonce", async () => {
      mockSearch = "";
      let resolveFetch: (value: unknown) => void = () => {};
      global.fetch = jest.fn(() => new Promise((resolve) => { resolveFetch = resolve; })) as jest.Mock;
      const scrollIntoView = Element.prototype.scrollIntoView as jest.Mock;
      render(<VannesList initialData={serverPage(1)} initialPage={1} />);
      // Rafraîchissement client de la page rendue par le serveur : ni atténuation ni aria-busy.
      const initialResults = screen.getByRole("tabpanel").parentElement as HTMLElement;
      expect(initialResults).toHaveAttribute("aria-busy", "false");
      expect(initialResults.className).not.toContain("opacity-60");
      await act(async () => resolveFetch({ ok: true, json: async () => ({ jokes: mockJokes, pagination: { page: 1, limit: 12, total: 30, totalPages: 3 } }) }));

      await userEvent.click(screen.getByRole("link", { name: "Page 3" }));
      const results = screen.getByRole("tabpanel").parentElement as HTMLElement;
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "start", behavior: "instant" });
      expect(scrollIntoView.mock.instances[0]).toBe(results);
      expect(document.activeElement).toBe(results);
      expect(results).toHaveAttribute("tabindex", "-1");
      expect(results.className).toContain("scroll-mt-20");
      // Pendant le chargement : aria-busy, liste atténuée, rien d'annoncé.
      expect(results).toHaveAttribute("aria-busy", "true");
      expect(results.className).toContain("opacity-60");
      expect(screen.getByRole("status")).toHaveTextContent("");

      await act(async () => resolveFetch({ ok: true, json: async () => ({ jokes: mockJokes, pagination: { page: 3, limit: 12, total: 30, totalPages: 3 } }) }));
      expect(results).toHaveAttribute("aria-busy", "false");
      expect(results.className).not.toContain("opacity-60");
      expect(screen.getByRole("status")).toHaveTextContent("Page 3 sur 3");
    });

    it("s20 : retour arrière du navigateur → annonce seulement quand la page demandée est affichée", async () => {
      mockSearch = "";
      let resolveFetch: (value: unknown) => void = () => {};
      global.fetch = jest.fn(() => new Promise((resolve) => { resolveFetch = resolve; })) as jest.Mock;
      const respond = (p: number) =>
        act(async () => resolveFetch({ ok: true, json: async () => ({ jokes: mockJokes, pagination: { page: p, limit: 12, total: 30, totalPages: 3 } }) }));
      const { rerender } = render(<VannesList initialData={serverPage(1)} initialPage={1} />);
      await respond(1);
      await userEvent.click(screen.getByRole("link", { name: "Page 3" }));
      await respond(3);
      expect(screen.getByRole("status")).toHaveTextContent("Page 3 sur 3");

      // popstate : l'URL revient à ?page=2, la liste affiche encore la page 3.
      mockSearch = "page=2";
      await act(async () => rerender(<VannesList initialData={serverPage(1)} initialPage={1} />));
      expect(screen.getByRole("status")).toHaveTextContent("");
      await respond(2);
      expect(screen.getByRole("status")).toHaveTextContent("Page 2 sur 3");
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
        // s21 B7 : bloc de bas de liste (le message de l'API n'est plus affiché).
        expect(screen.getByRole("heading", { name: frTypo(MUR_LISTE.vannes.titre) })).toBeInTheDocument();
      });
      expect(screen.getAllByRole("button", { name: "Contenu Premium : voir l’offre" }).length).toBeGreaterThan(0);
      expect(screen.queryByText(/Rien dans cette catégorie/)).not.toBeInTheDocument();
      // QA v4 m-5 : liste limitée, plus de pagination (le mur fait office de fin).
      expect(screen.queryByRole("link", { name: "Page précédente (page 1)" })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /^Page \d+$/ })).not.toBeInTheDocument();
    });
  });
});

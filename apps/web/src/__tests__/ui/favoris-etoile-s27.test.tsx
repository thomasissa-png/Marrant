/**
 * s27 D1 (`docs/qa/parcours-abonne-s27.md`) : après rechargement de /vannes, une vanne en favori avait l'étoile vide
 * (`FavoritesProvider` monté nulle part, le magasin restait vide) et un nouveau clic échouait en silence (409).
 * Ici : magasin réel, `fetch` simulé. L'étoile lit les favoris une fois par page et suit la vérité du serveur.
 */
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { useFavoritesStore, ERREUR_FAVORI_CONNEXION, ERREUR_FAVORI_SERVEUR } from "@/stores/favorites-store";

jest.mock("next-auth/react", () => ({ useSession: jest.fn() }));
jest.mock("@/stores/user-store", () => ({ useUserStore: jest.fn() }));
const toast = jest.fn();
jest.mock("@/components/ui/toast", () => ({ toast: (...a: unknown[]) => toast(...a) }));
jest.mock("@/components/premium/premium-modal-differe", () => ({ PremiumModalDiffere: () => null }));

const { useSession } = jest.requireMock("next-auth/react") as { useSession: jest.Mock };
const { useUserStore } = jest.requireMock("@/stores/user-store") as { useUserStore: jest.Mock };

const FAVORI = { id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, createdAt: "" };
const initial = useFavoritesStore.getState();

function reponse(status: number, corps: unknown) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, json: async () => corps });
}

let fetchMock: jest.Mock;
beforeEach(() => {
  jest.clearAllMocks();
  useFavoritesStore.setState({ ...initial, favorites: [], charges: false });
  useSession.mockReturnValue({ status: "authenticated", data: { user: { plan: "PREMIUM" } } });
  useUserStore.mockImplementation((sel: (s: Record<string, unknown>) => unknown) => sel({ user: null }));
  fetchMock = jest.fn((url: string, init?: { method?: string }) => {
    if (!init?.method) return reponse(200, { favorites: [FAVORI] });
    return reponse(500, { error: "Erreur serveur" });
  });
  global.fetch = fetchMock as unknown as typeof fetch;
});

const appels = (methode?: string) => fetchMock.mock.calls.filter(([, init]) => (init?.method ?? "GET") === (methode ?? "GET"));

describe("Étoile des favoris d'un abonné (s27 D1)", () => {
  it("au chargement, une vanne déjà en favori a l'étoile pleine ; une seule lecture pour toutes les étoiles", async () => {
    render(
      <>
        <FavoriteButton contentType="JOKE" contentId="j1" />
        <FavoriteButton contentType="JOKE" contentId="j2" />
      </>,
    );
    expect(await screen.findByLabelText("Retirer des favoris")).toBeInTheDocument();
    expect(screen.getByLabelText("Ajouter aux favoris")).toBeInTheDocument();
    expect(appels("GET")).toHaveLength(1);
  });

  it("clic sur une vanne déjà en favori : retrait (DELETE), jamais un 2e ajout", async () => {
    fetchMock.mockImplementation((url: string, init?: { method?: string }) =>
      !init?.method ? reponse(200, { favorites: [FAVORI] }) : init.method === "DELETE" ? reponse(200, { success: true }) : reponse(500, {}),
    );
    render(<FavoriteButton contentType="JOKE" contentId="j1" />);
    await userEvent.click(await screen.findByLabelText("Retirer des favoris"));
    expect(appels("POST")).toHaveLength(0);
    expect(appels("DELETE")[0][0]).toBe("/api/favorites/f1");
    expect(await screen.findByLabelText("Ajouter aux favoris")).toBeInTheDocument();
  });

  it("clic avant le retour de la lecture : attend la lecture, puis retire (pas de 409)", async () => {
    let lire: (v: unknown) => void = () => undefined;
    fetchMock.mockImplementation((url: string, init?: { method?: string }) => {
      if (!init?.method) return new Promise((r) => (lire = r));
      return init.method === "DELETE" ? reponse(200, {}) : reponse(500, {});
    });
    render(<FavoriteButton contentType="JOKE" contentId="j1" />);
    const etoile = screen.getByLabelText("Ajouter aux favoris");
    const clic = userEvent.click(etoile);
    await act(async () => lire({ ok: true, status: 200, json: async () => ({ favorites: [FAVORI] }) }));
    await clic;
    await waitFor(() => expect(appels("DELETE")).toHaveLength(1));
    expect(appels("POST")).toHaveLength(0);
  });

  it("ajout refusé par le serveur : message affiché (plus d'échec silencieux), étoile inchangée", async () => {
    fetchMock.mockImplementation((url: string, init?: { method?: string }) => (!init?.method ? reponse(200, { favorites: [] }) : reponse(500, { error: "Erreur serveur" })));
    render(<FavoriteButton contentType="JOKE" contentId="j1" />);
    await waitFor(() => expect(useFavoritesStore.getState().charges).toBe(true));
    await userEvent.click(screen.getByLabelText("Ajouter aux favoris"));
    await waitFor(() => expect(toast).toHaveBeenCalledWith(ERREUR_FAVORI_SERVEUR, "error"));
    expect(screen.getByLabelText("Ajouter aux favoris")).toBeInTheDocument();
  });

  it("réseau coupé : « Connexion perdue, réessaie »", async () => {
    fetchMock.mockImplementation((url: string, init?: { method?: string }) => (!init?.method ? reponse(200, { favorites: [] }) : Promise.reject(new Error("réseau"))));
    render(<FavoriteButton contentType="JOKE" contentId="j1" />);
    await waitFor(() => expect(useFavoritesStore.getState().charges).toBe(true));
    await userEvent.click(screen.getByLabelText("Ajouter aux favoris"));
    await waitFor(() => expect(toast).toHaveBeenCalledWith(ERREUR_FAVORI_CONNEXION, "error"));
  });

  it("ajout renvoyé en 200 (déjà en favori, autre onglet) : une seule ligne dans le magasin", async () => {
    fetchMock.mockImplementation(() => reponse(200, { favorite: FAVORI }));
    useFavoritesStore.setState({ favorites: [FAVORI] as never, charges: true });
    expect(await useFavoritesStore.getState().addFavorite("JOKE", "j1")).toEqual({ ok: true });
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
    expect(useFavoritesStore.getState().isFavorite("JOKE", "j1")).toBe(true);
  });

  it("visiteur : aucune lecture des favoris", () => {
    useSession.mockReturnValue({ status: "unauthenticated", data: null });
    render(<FavoriteButton contentType="JOKE" contentId="j1" />);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

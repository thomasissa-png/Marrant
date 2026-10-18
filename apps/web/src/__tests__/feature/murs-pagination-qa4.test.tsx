/**
 * QA v4 m-5 : sous les murs (/vannes, /conseils, /videos), un visiteur ou un compte sans
 * abonnement (réponse `limited` de l'API) ne voit plus de pagination : les pages suivantes
 * sont vides, le mur fait office de fin. L'abonné (pas `limited`) garde la pagination.
 * Le HTML du serveur garde les liens ?page=N (rendu avant la réponse de l'API).
 */
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { VannesList } from "@/components/vannes/vannes-list";
import { ConseilsList } from "@/components/conseils/conseils-list";
import { VideosGrid } from "@/components/videos/videos-grid";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("next-auth/react", () => ({ useSession: () => ({ status: "unauthenticated" }) }));
jest.mock("@/stores/favorites-store", () => ({
  useFavoritesStore: () => ({ isFavorite: () => false, addFavorite: jest.fn(), removeFavorite: jest.fn(), getFavoriteId: () => null }),
}));
jest.mock("@/stores/user-store", () => ({
  useUserStore: (selector: (s: Record<string, unknown>) => unknown) => selector({ addXp: jest.fn() }),
}));

const SERVEUR = { items: [], page: 1, limit: 12, total: 96, totalPages: 8 };

const MURS: [string, string, () => ReactElement][] = [
  ["/vannes", "jokes", () => <VannesList initialData={SERVEUR} />],
  ["/conseils", "tips", () => <ConseilsList initialData={SERVEUR} />],
  ["/videos", "videos", () => <VideosGrid initialData={SERVEUR} />],
];

function repondre(cle: string, limited: boolean) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ [cle]: [], pagination: { page: 1, limit: 12, total: 96, totalPages: 8 }, limited, totalReal: 96 }),
  }) as jest.Mock;
}

beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

describe.each(MURS)("%s", (chemin, cle, rendre) => {
  it("HTML du serveur : liens ?page=N présents (avant la réponse de l'API)", () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
    render(rendre());
    expect(screen.getByRole("link", { name: "Page suivante (page 2)" })).toHaveAttribute("href", `${chemin}?page=2`);
  });

  it("liste limitée (visiteur, compte sans abonnement) : plus de pagination", async () => {
    repondre(cle, true);
    render(rendre());
    await waitFor(() => expect(screen.queryByText("Suivant")).not.toBeInTheDocument());
    expect(screen.queryByRole("link", { name: /^Page \d+$/ })).not.toBeInTheDocument();
  });

  it("abonné (liste complète) : la pagination reste", async () => {
    repondre(cle, false);
    render(rendre());
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole("link", { name: "Page suivante (page 2)" })).toBeInTheDocument());
  });
});

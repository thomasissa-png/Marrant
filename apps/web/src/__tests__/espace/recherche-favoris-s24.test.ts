/**
 * @jest-environment node
 *
 * Espace client, lot D6 (s24) : recherche de l'en-tête et favoris d'un abonné. Interrupteur fermé : requêtes
 * et réponses d'aujourd'hui (aucun filtre, témoin non lu). Ouvert : sans le geste « Entrer », aucune vanne
 * repérée `humourNoir` ; après le geste, elles reviennent ; visiteur et compte FREE : rien ne change.
 * Route du coin et pages neuves : 404 fermé, avant toute lecture.
 */
import { NextRequest } from "next/server";

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const cookieCoin = { valeur: undefined as string | undefined };
jest.mock("next/headers", () => ({ cookies: () => ({ get: () => (cookieCoin.valeur ? { value: cookieCoin.valeur } : undefined) }) }));

const userFindUnique = jest.fn();
const jokeFindMany = jest.fn();
const favoriteFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    joke: { findMany: (...a: unknown[]) => jokeFindMany(...a) },
    tip: { findMany: async () => [] },
    video: { findMany: async () => [] },
    userFavorite: { findMany: (...a: unknown[]) => favoriteFindMany(...a) },
  },
}));

const FAVORIS = [
  { id: "f1", contentType: "JOKE", joke: { id: "j1", content: "Noire", punchline: "x", humourNoir: true }, tip: null, video: null },
  { id: "f2", contentType: "JOKE", joke: { id: "j2", content: "Douce", punchline: "y", humourNoir: false }, tip: null, video: null },
];

function abonne(plan: "PREMIUM" | "FREE") {
  getServerSession.mockResolvedValue({ user: { id: "u1" } });
  userFindUnique.mockResolvedValue({ plan });
}

const recherche = (cookie?: string) =>
  new NextRequest("http://localhost/api/search?q=mort", { headers: cookie ? { cookie: `dm_coin_humour_noir=${cookie}` } : {} });

beforeEach(() => {
  jest.clearAllMocks();
  cookieCoin.valeur = undefined;
  jokeFindMany.mockResolvedValue([]);
  favoriteFindMany.mockResolvedValue(FAVORIS);
});

type Routes = { search: typeof import("@/app/api/search/route"); favoris: typeof import("@/app/api/favorites/route") };
function routes(ouvert: boolean): Routes {
  let r: Routes | undefined;
  jest.isolateModules(() => {
    jest.doMock("@/config/espace-client", () => ({ ...jest.requireActual("@/config/espace-client"), ESPACE_CLIENT_PUBLIE: ouvert }));
    r = { search: require("@/app/api/search/route"), favoris: require("@/app/api/favorites/route") };
  });
  jest.dontMock("@/config/espace-client");
  return r!;
}

describe("interrupteur fermé : recherche et favoris d'aujourd'hui", () => {
  it("aucun filtre humour noir, même pour un abonné non entré", async () => {
    const { search, favoris } = routes(false);
    abonne("PREMIUM");
    await search.GET(recherche());
    expect(jokeFindMany.mock.calls[0][0].where).not.toHaveProperty("humourNoir");
    const corps = await (await favoris.GET()).json();
    expect(corps.favorites.map((f: { id: string }) => f.id)).toEqual(["f1", "f2"]);
  });
});

describe("interrupteur ouvert", () => {
  it("abonné non entré : la recherche exclut les vannes repérées, les favoris aussi", async () => {
    const { search, favoris } = routes(true);
    abonne("PREMIUM");
    await search.GET(recherche());
    expect(jokeFindMany.mock.calls[0][0].where).toMatchObject({ isActive: true, humourNoir: false });
    const corps = await (await favoris.GET()).json();
    expect(corps.favorites.map((f: { id: string }) => f.id)).toEqual(["f2"]);
  });

  it("abonné entré : tout revient", async () => {
    const { search, favoris } = routes(true);
    abonne("PREMIUM");
    cookieCoin.valeur = "entre";
    await search.GET(recherche("entre"));
    expect(jokeFindMany.mock.calls[0][0].where).not.toHaveProperty("humourNoir");
    expect((await (await favoris.GET()).json()).favorites).toHaveLength(2);
  });

  it("compte FREE : catalogue public inchangé", async () => {
    const { search } = routes(true);
    abonne("FREE");
    await search.GET(recherche());
    expect(jokeFindMany.mock.calls[0][0].where).not.toHaveProperty("humourNoir");
  });
});

describe("interrupteur fermé : route du coin et pages neuves", () => {
  it("POST /api/espace/humour-noir : 404 avant toute lecture", async () => {
    const { POST, GET } = await import("@/app/api/espace/humour-noir/route");
    const r = await POST(new Request("http://localhost/api/espace/humour-noir", { method: "POST", body: JSON.stringify({ entrer: true }) }));
    expect(r.status).toBe(404);
    expect(r.headers.get("set-cookie")).toBeNull();
    expect((await GET()).status).toBe(404);
    expect(getServerSession).not.toHaveBeenCalled();
  });

  it.each([
    ["quoi-repondre", () => import("@/app/(dashboard)/mon-espace/quoi-repondre/page")],
    ["bibliotheque", () => import("@/app/(dashboard)/mon-espace/bibliotheque/page")],
    ["lettres", () => import("@/app/(dashboard)/mon-espace/lettres/page")],
  ])("/mon-espace/%s : métadonnées de la 404, page en 404 sans lecture", async (_n, charger) => {
    const page = await charger();
    expect(await page.generateMetadata()).toMatchObject({ title: "Page introuvable" });
    await expect((page.default as (p: never) => Promise<unknown>)({ searchParams: {} } as never)).rejects.toThrow(/NEXT_NOT_FOUND/);
    expect(getServerSession).not.toHaveBeenCalled();
  });
});

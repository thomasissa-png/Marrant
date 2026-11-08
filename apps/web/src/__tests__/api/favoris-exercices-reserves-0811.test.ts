/**
 * @jest-environment node
 *
 * 08/11/2026 : `GET /api/favorites` renvoyait la ligne entière (exercice d'une vanne `howToApply`,
 * exercice d'un conseil, points clés et exercice d'une vidéo) à tout compte connecté, y compris un
 * compte gratuit ou un ancien abonné qui a gardé ses favoris. Règle `lib/champs-premium.ts` :
 * champs vidés si le plan relu en base n'est pas Premium (la session ne compte pas), intacts sinon.
 */
const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const userFindUnique = jest.fn();
const favoriteFindMany = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    userFavorite: { findMany: (...a: unknown[]) => favoriteFindMany(...a), create: jest.fn() },
  },
}));

import { GET } from "@/app/api/favorites/route";

const VANNE = { id: "j1", content: "Une vanne", punchline: "Chute", techniqueExplanation: "Pourquoi", howToApply: "CONSIGNE SECRETE" };
const CONSEIL = { id: "t1", title: "Conseil", content: "Contenu", example: "Exemple public", exercise: "EXERCICE SECRET" };
const VIDEO = { id: "v1", title: "Vidéo", channelName: "Chaîne", learnings: ["POINT SECRET"], exercise: "EXERCICE VIDEO SECRET" };
const FAVORIS = [
  { id: "f1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, joke: VANNE, tip: null, video: null },
  { id: "f2", contentType: "TIP", jokeId: null, tipId: "t1", videoId: null, joke: null, tip: CONSEIL, video: null },
  { id: "f3", contentType: "VIDEO", jokeId: null, tipId: null, videoId: "v1", joke: null, tip: null, video: VIDEO },
];

// La session dit toujours Premium : seul le plan relu en base décide.
function connecte(planEnBase: "PREMIUM" | "FREE" | null) {
  getServerSession.mockResolvedValue({ user: { id: "u1", plan: "PREMIUM" } });
  userFindUnique.mockResolvedValue(planEnBase ? { plan: planEnBase } : null);
}

beforeEach(() => {
  jest.clearAllMocks();
  favoriteFindMany.mockResolvedValue(FAVORIS);
});

describe("GET /api/favorites : exercices réservés aux Premium", () => {
  it("401 sans session, aucune lecture", async () => {
    getServerSession.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(favoriteFindMany).not.toHaveBeenCalled();
  });

  it("Premium (relu en base) : 200, lignes intactes", async () => {
    connecte("PREMIUM");
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
    const { favorites } = await res.json();
    expect(favorites).toEqual(FAVORIS);
    expect(userFindUnique).toHaveBeenCalledWith({ where: { id: "u1" }, select: { plan: true } });
  });

  it.each([["compte gratuit ou ancien abonné", "FREE" as const], ["compte introuvable", null]])(
    "%s : 200, favoris gardés, exercices vidés (mêmes valeurs vides que le HTML public)",
    async (_, plan) => {
      connecte(plan);
      const res = await GET();
      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).not.toMatch(/SECRET/);
      const { favorites } = JSON.parse(body);
      expect(favorites.map((f: { id: string }) => f.id)).toEqual(["f1", "f2", "f3"]);
      expect(favorites[0].joke).toEqual({ ...VANNE, howToApply: null });
      expect(favorites[1].tip).toEqual({ ...CONSEIL, exercise: "" });
      expect(favorites[2].video).toEqual({ ...VIDEO, learnings: [], exercise: null });
      expect(favorites[0].tip).toBeNull();
      expect(favorites[1].video).toBeNull();
    },
  );
});

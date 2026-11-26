/**
 * @jest-environment node
 *
 * s27 D1 (`docs/qa/parcours-abonne-s27.md`) : un 2e clic sur l'étoile d'une vanne déjà en favori répondait 409 et
 * l'étoile ne disait rien. L'ajout est désormais idempotent : déjà en favori (contrainte unique P2002), l'API renvoie
 * le favori existant en 200.
 */
import { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));

const userFindUnique = jest.fn();
const favoriteCreate = jest.fn();
const favoriteFindFirst = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    userFavorite: {
      findMany: jest.fn(),
      create: (...a: unknown[]) => favoriteCreate(...a),
      findFirst: (...a: unknown[]) => favoriteFindFirst(...a),
    },
  },
}));

import { POST } from "@/app/api/favorites/route";

const doublon = () => new Prisma.PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002", clientVersion: "test" });
const requete = (corps: unknown) =>
  new Request("http://localhost/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) });
const EXISTANT = { id: "f1", userId: "u1", contentType: "JOKE", jokeId: "j1", tipId: null, videoId: null, joke: { id: "j1" }, tip: null, video: null };

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "u1", plan: "PREMIUM" } });
  userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
});

describe("POST /api/favorites : ajout idempotent (s27 D1)", () => {
  it("nouveau favori : 201, comme avant", async () => {
    favoriteCreate.mockResolvedValue(EXISTANT);
    const res = await POST(requete({ contentType: "JOKE", contentId: "j1" }) as unknown as NextRequest);
    expect(res.status).toBe(201);
    expect((await res.json()).favorite.id).toBe("f1");
  });

  it("déjà en favori : 200 avec le favori existant (plus de 409)", async () => {
    favoriteCreate.mockRejectedValue(doublon());
    favoriteFindFirst.mockResolvedValue(EXISTANT);
    const res = await POST(requete({ contentType: "JOKE", contentId: "j1" }) as unknown as NextRequest);
    expect(res.status).toBe(200);
    expect((await res.json()).favorite).toEqual(EXISTANT);
    expect(favoriteFindFirst).toHaveBeenCalledWith({
      where: { userId: "u1", contentType: "JOKE", jokeId: "j1" },
      include: { joke: true, tip: true, video: true },
    });
  });

  it("doublon puis ligne disparue entre-temps : 409 (cas limite, rien d'inventé)", async () => {
    favoriteCreate.mockRejectedValue(doublon());
    favoriteFindFirst.mockResolvedValue(null);
    const res = await POST(requete({ contentType: "JOKE", contentId: "j1" }) as unknown as NextRequest);
    expect(res.status).toBe(409);
  });

  it("compte non Premium (plan relu en base) : 403, aucune écriture", async () => {
    userFindUnique.mockResolvedValue({ plan: "FREE" });
    const res = await POST(requete({ contentType: "JOKE", contentId: "j1" }) as unknown as NextRequest);
    expect(res.status).toBe(403);
    expect(favoriteCreate).not.toHaveBeenCalled();
  });
});

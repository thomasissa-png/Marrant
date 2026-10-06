/**
 * @jest-environment node
 *
 * Plus de compte gratuit (s15, spec §1.1, critère 8) : XP, réaction en base et
 * vote sur les nouveautés = accès complet. Compte non abonné (dont les 11
 * comptes FREE conservés) : 403, aucune écriture ni suppression en base.
 * Abonné : inchangé. Visiteur : 401 comme avant.
 */

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ allowed: true }) }));

const userFindUnique = jest.fn();
const userUpdate = jest.fn();
const likeFindUnique = jest.fn();
const likeCreate = jest.fn();
const likeDelete = jest.fn();
const voteFindUnique = jest.fn();
const voteCreate = jest.fn();
const voteDelete = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: (...a: unknown[]) => userFindUnique(...a),
      update: (...a: unknown[]) => userUpdate(...a),
    },
    jokeLike: {
      findUnique: (...a: unknown[]) => likeFindUnique(...a),
      create: (...a: unknown[]) => likeCreate(...a),
      delete: (...a: unknown[]) => likeDelete(...a),
    },
    featureVote: {
      findUnique: (...a: unknown[]) => voteFindUnique(...a),
      create: (...a: unknown[]) => voteCreate(...a),
      delete: (...a: unknown[]) => voteDelete(...a),
    },
  },
}));

import { NextRequest } from "next/server";
import { POST as postXp } from "@/app/api/user/xp/route";
import { POST as postLike } from "@/app/api/jokes/[id]/like/route";
import { POST as postVote } from "@/app/api/features/vote/route";

function req(path: string, body: unknown) {
  return new NextRequest(`https://deviens-marrant.fr${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const callXp = () => postXp(req("/api/user/xp", { amount: 10, action: "tip_read" }));
const callLike = () => postLike(req("/api/jokes/j1/like", { isLike: true }), { params: { id: "j1" } });
const callVote = () => postVote(req("/api/features/vote", { featureSlug: "whatsapp" }));

beforeEach(() => {
  jest.clearAllMocks();
  getServerSession.mockResolvedValue({ user: { id: "user-1" } });
  userUpdate.mockResolvedValue({ xp: 30, level: "NOVICE" });
  likeFindUnique.mockResolvedValue(null);
  voteFindUnique.mockResolvedValue(null);
});

function expectNoWrite() {
  expect(userUpdate).not.toHaveBeenCalled();
  expect(likeCreate).not.toHaveBeenCalled();
  expect(likeDelete).not.toHaveBeenCalled();
  expect(voteCreate).not.toHaveBeenCalled();
  expect(voteDelete).not.toHaveBeenCalled();
}

describe.each([
  ["XP", callXp],
  ["réaction en base", callLike],
  ["vote nouveautés", callVote],
])("%s", (_label, call) => {
  it("compte non abonné (plan FREE, ex-compte gratuit) : 403, aucune écriture ni suppression", async () => {
    userFindUnique.mockResolvedValue({ plan: "FREE" });
    const res = await call();
    expect(res.status).toBe(403);
    expect(userFindUnique).toHaveBeenCalledWith({ where: { id: "user-1" }, select: { plan: true } });
    expectNoWrite();
  });

  it("utilisateur introuvable : 403", async () => {
    userFindUnique.mockResolvedValue(null);
    expect((await call()).status).toBe(403);
    expectNoWrite();
  });

  it("visiteur : 401 (inchangé)", async () => {
    getServerSession.mockResolvedValue(null);
    expect((await call()).status).toBe(401);
    expectNoWrite();
  });

  it("abonné Premium : 200 (inchangé)", async () => {
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    expect((await call()).status).toBe(200);
  });
});

/**
 * @jest-environment node
 *
 * Lot M2 (s14) — app/api/parcours/[id]/progress/route.ts (POST).
 * Étape 1 gratuite pour tous ; étapes 2+ réservées aux abonnés Premium
 * (même contrôle que les favoris : `user.plan` lu en base) → 403 sinon.
 */

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/rate-limit", () => ({ rateLimit: () => ({ allowed: true }) }));

const userFindUnique = jest.fn();
const transaction = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: (...a: unknown[]) => userFindUnique(...a) },
    $transaction: (...a: unknown[]) => transaction(...a),
  },
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/parcours/[id]/progress/route";

const PATH_ID = "db-path-123";

/** Transaction simulée : parcours de 3 étapes, aucune progression existante. */
function fakeTx() {
  return {
    learningPath: {
      findUnique: jest.fn().mockResolvedValue({
        id: PATH_ID,
        slug: "machine-a-cafe",
        steps: [{ order: 1 }, { order: 2 }, { order: 3 }],
      }),
    },
    userPathProgress: {
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn(async ({ create }: { create: { completedSteps: number[] } }) => ({
        id: "progress-1",
        ...create,
      })),
      update: jest.fn(),
    },
    user: { update: jest.fn() },
  };
}

function post(stepOrder: number) {
  const req = new NextRequest(`https://deviens-marrant.fr/api/parcours/${PATH_ID}/progress`, {
    method: "POST",
    body: JSON.stringify({ stepOrder }),
    headers: { "Content-Type": "application/json" },
  });
  return POST(req, { params: { id: PATH_ID } });
}

beforeEach(() => {
  getServerSession.mockReset().mockResolvedValue({ user: { id: "user-1" } });
  userFindUnique.mockReset();
  transaction.mockReset().mockImplementation(async (fn: (tx: unknown) => unknown) => fn(fakeTx()));
});

describe("POST /api/parcours/[id]/progress — accès Premium", () => {
  it("compte non abonné (ex-compte gratuit, s15 §1.1) : l'étape 1 est refusée en 403, sans écriture", async () => {
    userFindUnique.mockResolvedValue({ plan: "FREE" });
    const res = await post(1);
    expect(res.status).toBe(403);
    expect(transaction).not.toHaveBeenCalled();
  });

  it("abonné Premium : l'étape 1 se valide (200)", async () => {
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    const res = await post(1);
    expect(res.status).toBe(200);
    expect(transaction).toHaveBeenCalled();
  });

  it("compte non abonné : l'étape 2 est refusée en 403, sans écriture", async () => {
    userFindUnique.mockResolvedValue({ plan: "FREE" });
    const res = await post(2);
    expect(res.status).toBe(403);
    expect(transaction).not.toHaveBeenCalled();
    expect(userFindUnique).toHaveBeenCalledWith({ where: { id: "user-1" }, select: { plan: true } });
  });

  it("utilisateur introuvable en base : 403 sur l'étape 3", async () => {
    userFindUnique.mockResolvedValue(null);
    const res = await post(3);
    expect(res.status).toBe(403);
    expect(transaction).not.toHaveBeenCalled();
  });

  it("abonné Premium : l'étape 2 se valide (200, XP attribués)", async () => {
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    const res = await post(2);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.xpGained).toBeGreaterThan(0);
  });

  it("anonyme : toujours 401 (inchangé)", async () => {
    getServerSession.mockResolvedValue(null);
    const res = await post(2);
    expect(res.status).toBe(401);
    expect(userFindUnique).not.toHaveBeenCalled();
  });
});

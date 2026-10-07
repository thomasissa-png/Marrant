/**
 * @jest-environment node
 *
 * app/api/parcours/[id]/progress/route.ts (POST).
 * s14/s15 : validation réservée aux abonnés Premium (plan lu en base) → 403 sinon.
 * s17 (lot A) : fiche renvoyée APRÈS la date de fin (UX-02), bonus de fin dans
 * le total (UX-05), double validation impossible (FS-08), ordre conseillé
 * (QA-08), niveau recalculé (FS-07), série de pratique (D3), limite partagée,
 * alerte sur erreur serveur. Parcours de 3, 4 et 6 étapes.
 */

const getServerSession = jest.fn();
jest.mock("next-auth", () => ({ getServerSession: (...a: unknown[]) => getServerSession(...a) }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
const sharedRateLimit = jest.fn();
jest.mock("@/lib/rate-limit", () => ({
  sharedRateLimit: (...a: unknown[]) => sharedRateLimit(...a),
  retryAfterSeconds: () => 42,
}));
const recordAdminAlert = jest.fn();
jest.mock("@/lib/admin-alerts", () => ({
  CLES_PARCOURS: { progressErreur: "parcours-progress-erreur" },
  recordAdminAlert: (...a: unknown[]) => recordAdminAlert(...a),
}));

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

type Existing = { completedSteps: number[]; completedAt?: Date | null } | null;

/** Transaction simulée : parcours `slug` de `n` étapes, progression `existing`, XP de départ `xp`. */
function fakeTx(opts: { slug?: string; n?: number; existing?: Existing; inserted?: number; xp?: number; streak?: number; lastPracticeAt?: Date | null } = {}) {
  const { slug = "machine-a-cafe", n = 3, existing = null, inserted = 1, xp = 0, streak = 0, lastPracticeAt = null } = opts;
  const base = existing
    ? { id: "progress-1", userId: "user-1", learningPathId: PATH_ID, currentStep: 1, startedAt: new Date(), completedAt: null, ...existing }
    : null;
  return {
    learningPath: {
      findUnique: jest.fn().mockResolvedValue({ id: PATH_ID, slug, steps: Array.from({ length: n }, (_, i) => ({ order: i + 1 })) }),
    },
    userPathStepCompletion: { createMany: jest.fn().mockResolvedValue({ count: inserted }) },
    userPathProgress: {
      findUnique: jest.fn().mockResolvedValue(base),
      upsert: jest.fn(async ({ create }: { create: { completedSteps: number[] } }) =>
        base ? { ...base, completedSteps: [...base.completedSteps, create.completedSteps[0]] } : { id: "progress-1", completedAt: null, ...create },
      ),
      update: jest.fn(async ({ data }: { data: { completedAt: Date } }) => ({ ...(base ?? {}), id: "progress-1", completedSteps: Array.from({ length: n }, (_, i) => i + 1), completedAt: data.completedAt })),
    },
    user: {
      findUnique: jest.fn().mockResolvedValue({ xp, level: "NOVICE", streak }),
      update: jest.fn(async ({ data }: { data: { xp?: { increment: number } } }) =>
        data.xp ? { xp: xp + data.xp.increment, level: "NOVICE", streak, lastPracticeAt } : {},
      ),
    },
  };
}

let tx: ReturnType<typeof fakeTx>;
function useTx(t: ReturnType<typeof fakeTx>) {
  tx = t;
  transaction.mockImplementation(async (fn: (tx: unknown) => unknown) => fn(tx));
}

function post(stepOrder: unknown) {
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
  transaction.mockReset();
  recordAdminAlert.mockReset().mockResolvedValue(true);
  sharedRateLimit.mockReset().mockResolvedValue({ allowed: true, remaining: 9, resetAt: Date.now() + 60_000 });
  useTx(fakeTx());
});

describe("POST /api/parcours/[id]/progress — accès Premium", () => {
  it("compte non abonné : l'étape 1 est refusée en 403, sans écriture", async () => {
    userFindUnique.mockResolvedValue({ plan: "FREE" });
    const res = await post(1);
    expect(res.status).toBe(403);
    expect((await res.json()).code).toBe("refus");
    expect(transaction).not.toHaveBeenCalled();
  });

  it("utilisateur introuvable en base : 403 sur l'étape 3", async () => {
    userFindUnique.mockResolvedValue(null);
    expect((await post(3)).status).toBe(403);
    expect(transaction).not.toHaveBeenCalled();
  });

  it("anonyme : 401, aucune lecture", async () => {
    getServerSession.mockResolvedValue(null);
    const res = await post(2);
    expect(res.status).toBe(401);
    expect(userFindUnique).not.toHaveBeenCalled();
  });

  it("corps invalide : 400 code corps", async () => {
    userFindUnique.mockResolvedValue({ plan: "PREMIUM" });
    const res = await post("2");
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("corps");
  });

  it("limite partagée dépassée : 429 avec Retry-After, aucune écriture", async () => {
    sharedRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: Date.now() + 42_000 });
    const res = await post(1);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("42");
    expect(sharedRateLimit).toHaveBeenCalledWith("parcours-progress", "user-1", { maxRequests: 10, windowMs: 60_000 });
    expect(transaction).not.toHaveBeenCalled();
  });
});

describe("POST progress — validation (s17)", () => {
  beforeEach(() => userFindUnique.mockResolvedValue({ plan: "PREMIUM" }));

  it("étape 1 : 200, date par étape écrite, XP, niveau et série de pratique", async () => {
    const res = await post(1);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.xpGained).toBe(50);
    expect(body.pathCompleted).toBe(false);
    expect(body.user).toEqual({ xp: 50, level: "NOVICE", levelChanged: false, streak: 1 });
    expect(body.nextRecommendedAt).toEqual(expect.any(String));
    expect(tx.userPathStepCompletion.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ userId: "user-1", learningPathId: PATH_ID, stepOrder: 1 })],
      skipDuplicates: true,
    });
  });

  it("ordre conseillé : étape 2 sans l'étape 1 → 409 code ordre, aucune écriture", async () => {
    const res = await post(2);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body).toMatchObject({ code: "ordre", etapeAttendue: 1 });
    expect(tx.userPathStepCompletion.createMany).not.toHaveBeenCalled();
    expect(tx.user.update).not.toHaveBeenCalled();
  });

  it("double validation simultanée : la 2e insère 0 ligne → 0 XP, aucune écriture de progression", async () => {
    useTx(fakeTx({ inserted: 0 }));
    const body = await (await post(1)).json();
    expect(body).toMatchObject({ xpGained: 0, alreadyCompleted: true });
    expect(tx.userPathProgress.upsert).not.toHaveBeenCalled();
    expect(tx.user.update).not.toHaveBeenCalled();
  });

  it("étape déjà validée (appel séquentiel) : 0 XP", async () => {
    useTx(fakeTx({ existing: { completedSteps: [1] } }));
    const body = await (await post(1)).json();
    expect(body.xpGained).toBe(0);
    expect(tx.userPathStepCompletion.createMany).not.toHaveBeenCalled();
  });

  it("Répartie (4 étapes), dernière étape : fiche renvoyée AVEC la date de fin, bonus compris", async () => {
    useTx(fakeTx({ slug: "repartie", n: 4, existing: { completedSteps: [1, 2, 3] }, xp: 225 }));
    const body = await (await post(4)).json();
    expect(body.pathCompleted).toBe(true);
    expect(body.progress.completedAt).not.toBeNull();
    expect(body.stepXp).toBe(150);
    expect(body.bonusXp).toBe(100);
    expect(body.xpGained).toBe(250);
    expect(body.pathXpTotal).toBe(475);
    expect(body.nextRecommendedAt).toBeNull();
    expect(body.user).toMatchObject({ xp: 475, level: "APPRENTI", levelChanged: true });
  });

  it("Répartie (4 étapes), étape 3 à 100 XP : PAS terminé, aucune date de fin, aucun bonus", async () => {
    useTx(fakeTx({ slug: "repartie", n: 4, existing: { completedSteps: [1, 2] } }));
    const body = await (await post(3)).json();
    expect(body).toMatchObject({ pathCompleted: false, xpGained: 100, bonusXp: 0 });
    expect(body.progress.completedAt).toBeNull();
    expect(tx.userPathProgress.update).not.toHaveBeenCalled();
  });

  it("Confiance (6 étapes), étape 5 à 150 XP : pas terminé ; étape 6 : terminé, total 715 XP", async () => {
    useTx(fakeTx({ slug: "confiance", n: 6, existing: { completedSteps: [1, 2, 3, 4] } }));
    const mid = await (await post(5)).json();
    expect(mid.pathCompleted).toBe(false);
    expect(mid.pathXpTotal).toBe(50 + 75 + 100 + 125 + 150 + 200 + 100);

    useTx(fakeTx({ slug: "confiance", n: 6, existing: { completedSteps: [1, 2, 3, 4, 5] }, xp: 1400 }));
    const fin = await (await post(6)).json();
    expect(fin).toMatchObject({ pathCompleted: true, xpGained: 300 });
    expect(fin.progress.completedAt).not.toBeNull();
    // 1 400 + 300 = 1 700 XP : niveau « Comique » (FS-07, plantait avant)
    expect(fin.user.level).toBe("COMIQUE");
  });

  it("série de pratique : veille (Paris) → +1", async () => {
    const hier = new Date(Date.now() - 24 * 3_600_000);
    useTx(fakeTx({ streak: 4, lastPracticeAt: hier }));
    const body = await (await post(1)).json();
    expect(body.user.streak).toBe(5);
  });

  it("étape inexistante : 400 code etape", async () => {
    const res = await post(9);
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("etape");
  });

  it("erreur serveur : 500 code serveur ET alerte parcours-progress-erreur (sans identifiant)", async () => {
    transaction.mockRejectedValue(new Error("connexion perdue"));
    const res = await post(1);
    expect(res.status).toBe(500);
    expect((await res.json()).code).toBe("serveur");
    expect(recordAdminAlert).toHaveBeenCalledWith(expect.objectContaining({ cle: "parcours-progress-erreur" }));
    expect(JSON.stringify(recordAdminAlert.mock.calls[0][0])).not.toContain("user-1");
  });
});

/**
 * Tests — job-lock.ts
 *
 * Couvre :
 * - Acquisition initiale (premier appel → true)
 * - Deuxième acquisition avant expiration (→ false)
 * - Acquisition après expiration du TTL (→ true, ré-acquisition autorisée)
 * - Libération via releaseLock
 * - Silent-fail sur erreur DB (retourne false sans crasher)
 * - Format des clés de lock (daily + weekly ISO)
 */

// ─── Mocks Prisma ────────────────────────────────────────────────

// Store en mémoire qui simule la table JobLock avec ses contraintes d'unicité.
interface FakeLockRow {
  id: string;
  jobKey: string;
  acquiredAt: Date;
  expiresAt: Date;
}

const fakeLockStore = new Map<string, FakeLockRow>();

const mockDeleteMany = jest.fn(async ({ where }: { where: { jobKey: string; expiresAt?: { lt: Date } } }) => {
  let count = 0;
  const entries = Array.from(fakeLockStore.entries());
  for (const [key, row] of entries) {
    if (row.jobKey !== where.jobKey) continue;
    // Si filtre expiresAt fourni, ne supprimer QUE les expirés
    if (where.expiresAt && row.expiresAt >= where.expiresAt.lt) continue;
    fakeLockStore.delete(key);
    count++;
  }
  return { count };
});

const mockCreate = jest.fn(async ({ data }: { data: Omit<FakeLockRow, "id"> }) => {
  // Simuler la contrainte unique sur jobKey
  const rows = Array.from(fakeLockStore.values());
  for (const row of rows) {
    if (row.jobKey === data.jobKey) {
      const err = new Error("Unique constraint failed") as Error & { code: string };
      err.code = "P2002";
      throw err;
    }
  }
  const id = `lock-${Math.random().toString(36).slice(2)}`;
  const row: FakeLockRow = { id, ...data };
  fakeLockStore.set(id, row);
  return row;
});

jest.mock("@/lib/prisma", () => ({
  prisma: {
    jobLock: {
      deleteMany: (args: { where: { jobKey: string; expiresAt?: { lt: Date } } }) => mockDeleteMany(args),
      create: (args: { data: Omit<FakeLockRow, "id"> }) => mockCreate(args),
    },
  },
}));

import {
  tryAcquireLock,
  releaseLock,
  buildJobLockKey,
  buildWeeklyJobLockKey,
} from "@/lib/job-lock";

beforeEach(() => {
  fakeLockStore.clear();
  mockDeleteMany.mockClear();
  mockCreate.mockClear();
});

describe("job-lock — key formatting", () => {
  it("buildJobLockKey encode date UTC au format YYYY-MM-DD", () => {
    const date = new Date(Date.UTC(2026, 3, 11)); // 11 avril 2026 UTC
    expect(buildJobLockKey("daily-content", date)).toBe("daily-content-2026-04-11");
  });

  it("buildJobLockKey gère les mois à 1 chiffre avec un zéro de padding", () => {
    const date = new Date(Date.UTC(2026, 0, 5)); // 5 janvier 2026
    expect(buildJobLockKey("daily-content", date)).toBe("daily-content-2026-01-05");
  });

  it("buildWeeklyJobLockKey encode le numéro de semaine ISO", () => {
    // 13 avril 2026 = lundi = semaine ISO 16 de 2026
    const date = new Date(Date.UTC(2026, 3, 13));
    expect(buildWeeklyJobLockKey("weekly-seo", date)).toBe("weekly-seo-2026-W16");
  });

  it("buildWeeklyJobLockKey gère le dimanche (fin de semaine ISO)", () => {
    // 12 avril 2026 = dimanche = semaine ISO 15 (la semaine qui finit ce jour-là)
    const date = new Date(Date.UTC(2026, 3, 12));
    expect(buildWeeklyJobLockKey("weekly-seo", date)).toBe("weekly-seo-2026-W15");
  });
});

describe("job-lock — tryAcquireLock", () => {
  it("retourne true au premier appel (lock libre)", async () => {
    const acquired = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
    expect(acquired).toBe(true);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("retourne false sur un deuxième appel immédiat (lock détenu)", async () => {
    const first = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
    const second = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
    expect(first).toBe(true);
    expect(second).toBe(false);
  });

  it("retourne true sur une seconde acquisition après expiration du TTL", async () => {
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date("2026-04-11T05:00:00Z"));
      const first = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
      expect(first).toBe(true);

      // Avancer de 11 minutes (TTL = 10 min → expiré)
      jest.setSystemTime(new Date("2026-04-11T05:11:00Z"));
      const second = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
      expect(second).toBe(true);
      // Le deleteMany doit avoir purgé le lock expiré avant la 2e création
      expect(mockDeleteMany).toHaveBeenCalled();
    } finally {
      jest.useRealTimers();
    }
  });

  it("retourne false sur une seconde acquisition avant expiration du TTL", async () => {
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date("2026-04-11T05:00:00Z"));
      const first = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
      expect(first).toBe(true);

      // Avancer de 5 minutes (TTL = 10 min → encore valide)
      jest.setSystemTime(new Date("2026-04-11T05:05:00Z"));
      const second = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
      expect(second).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it("deux jobs différents peuvent acquérir leurs locks en parallèle", async () => {
    const contentLock = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
    const seoLock = await tryAcquireLock("weekly-seo-2026-W15", 20 * 60 * 1000);
    expect(contentLock).toBe(true);
    expect(seoLock).toBe(true);
  });

  it("silent-fail si la DB crash (retourne false sans lever)", async () => {
    mockCreate.mockImplementationOnce(async () => {
      throw new Error("connection refused");
    });
    // Le deleteMany préalable peut réussir
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const acquired = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
    expect(acquired).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

describe("job-lock — releaseLock", () => {
  it("libère un lock existant (permet une ré-acquisition immédiate)", async () => {
    const first = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
    expect(first).toBe(true);

    await releaseLock("daily-content-2026-04-11");

    const second = await tryAcquireLock("daily-content-2026-04-11", 10 * 60 * 1000);
    expect(second).toBe(true);
  });

  it("ne lève pas d'erreur si la DB crash pendant la libération", async () => {
    mockDeleteMany.mockImplementationOnce(async () => {
      throw new Error("connection refused");
    });
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    // Ne doit pas lever
    await expect(releaseLock("daily-content-2026-04-11")).resolves.toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

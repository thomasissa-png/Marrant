/**
 * Helper Jest factorisé — mock Prisma pour les tests CEO (Groupes 1, 4, 5, 6).
 *
 * Pattern : `jest.mock("@/lib/prisma", () => ({ prisma: createCeoPrismaMock() }))`
 * doit être appelé AU TOP du fichier de test, AVANT les imports.
 *
 * Le helper expose :
 *  - `createCeoPrismaMock()` : factory inline pour le `jest.mock` (pas hoisté)
 *  - `getCeoPrismaMock()` : récupère la référence typée via `jest.requireMock`
 *    pour manipuler les `mockResolvedValueOnce` dans les tests.
 *
 * Couverture des modèles : tous les modèles Ceo* + adjacents (User, Joke, Tip,
 * Video, LearningPath, BlogArticle, Subscription, LlmUsageLog).
 *
 * Usage type :
 *   jest.mock("@/lib/prisma", () => ({
 *     prisma: jest.requireActual("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock(),
 *   }));
 *   const { prisma: mockPrisma } = jest.requireMock("@/lib/prisma") as {
 *     prisma: ReturnType<typeof import("@/__tests__/helpers/ceo-prisma-mock").createCeoPrismaMock>;
 *   };
 */

export type CeoPrismaMock = {
  // Catalogue
  joke: { findMany: jest.Mock; findUnique: jest.Mock };
  tip: { findMany: jest.Mock };
  video: { findMany: jest.Mock };
  learningPath: { findMany: jest.Mock };
  blogArticle: { findMany: jest.Mock };

  // CEO core
  ceoMemory: { findUnique: jest.Mock; upsert: jest.Mock; delete: jest.Mock };
  ceoConfig: { findFirst: jest.Mock; upsert: jest.Mock; update: jest.Mock };
  ceoOutboundMessage: {
    create: jest.Mock;
    update: jest.Mock;
    findUnique: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    aggregate: jest.Mock;
    groupBy: jest.Mock;
  };
  ceoTask: {
    create: jest.Mock;
    update: jest.Mock;
    findUnique: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
  };
  ceoLead: {
    create: jest.Mock;
    update: jest.Mock;
    findUnique: jest.Mock;
    findMany: jest.Mock;
    upsert: jest.Mock;
  };
  ceoBacklink: { create: jest.Mock; findMany: jest.Mock; aggregate: jest.Mock };
  ceoDedup: { findFirst: jest.Mock; create: jest.Mock };
  ceoAuditLog: { create: jest.Mock; findMany: jest.Mock; count: jest.Mock };
  ceoKpiSnapshot: { upsert: jest.Mock; findMany: jest.Mock };
  ceoLock: { create: jest.Mock; findUnique: jest.Mock; delete: jest.Mock };

  // User-side
  user: { update: jest.Mock; findUnique: jest.Mock; findMany: jest.Mock };
  subscription: { findMany: jest.Mock };

  // Logs / instrumentation
  llmUsageLog: { aggregate: jest.Mock; create: jest.Mock };

  // Social
  socialPostDailyLock: { create: jest.Mock; findUnique: jest.Mock };
};

/**
 * Crée une instance fraîche de mocks Prisma pour les tests CEO.
 * Appeler dans le `factory` de `jest.mock("@/lib/prisma", () => ...)`.
 */
export function createCeoPrismaMock(): CeoPrismaMock {
  return {
    joke: { findMany: jest.fn(), findUnique: jest.fn() },
    tip: { findMany: jest.fn() },
    video: { findMany: jest.fn() },
    learningPath: { findMany: jest.fn() },
    blogArticle: { findMany: jest.fn() },

    ceoMemory: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    ceoConfig: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    ceoOutboundMessage: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    ceoTask: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    ceoLead: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    ceoBacklink: {
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    ceoDedup: { findFirst: jest.fn(), create: jest.fn() },
    ceoAuditLog: { create: jest.fn(), findMany: jest.fn(), count: jest.fn() },
    ceoKpiSnapshot: { upsert: jest.fn(), findMany: jest.fn() },
    ceoLock: { create: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },

    user: { update: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
    subscription: { findMany: jest.fn() },

    llmUsageLog: { aggregate: jest.fn(), create: jest.fn() },

    socialPostDailyLock: { create: jest.fn(), findUnique: jest.fn() },
  };
}

/**
 * Récupère la référence typée vers les mocks Prisma déjà installés via
 * `jest.mock("@/lib/prisma", ...)`. À appeler après le `jest.mock` au top.
 */
export function getCeoPrismaMock(): CeoPrismaMock {
  return (jest.requireMock("@/lib/prisma") as { prisma: CeoPrismaMock }).prisma;
}

/**
 * Reset compteurs ET implémentations sur tous les mocks Prisma CEO.
 * À appeler dans `beforeEach` après `jest.clearAllMocks()` si on veut
 * garantir l'isolation des `mockImplementation` cross-tests.
 */
export function resetCeoPrismaMock(mock: CeoPrismaMock): void {
  for (const model of Object.values(mock) as Array<Record<string, jest.Mock>>) {
    for (const fn of Object.values(model)) {
      fn.mockReset();
    }
  }
}

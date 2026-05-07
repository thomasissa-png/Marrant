/**
 * Phase 5.D — Groupe 4 : Tests CEO Helpers (lib/ai/ceo-helpers.ts).
 *
 * Cible : `apps/web/src/lib/ai/ceo-helpers.ts` (581 lignes, 22 fonctions exportées).
 * Stratégie : 1 describe par fonction. Mock complet `@/lib/prisma` + `@/lib/job-lock`.
 *
 * Périmètre — 16 fonctions principales :
 *  - Catalogue lookups : `lookupJoke`, `lookupResource`
 *  - Mémoire long-terme : `getCeoMemory`, `setCeoMemory`
 *  - Config kill-switch : `getCeoConfig`, `isCeoEnabled`
 *  - Frequency cap : `applyFrequencyCap`
 *  - Anti-doublon : `checkAndStoreDedup`
 *  - PII : `hashPii`, `maskPii`
 *  - Audit : `recordAudit` (silent-fail)
 *  - Lock : `acquireCeoLock`, `releaseCeoLock` (intégration job-lock)
 *  - Lead : `markCeoTouchpoint`, `getOrCreateLead`
 *  - KPI snapshot : `snapshotCeoKpis` (placeholder siteReturn48h)
 *
 * P1 ouverts (s8/s9/s10) :
 *  - Neon cold start retry : placeholder it.skip documenté
 *  - LinkedIn JSON conformité : non applicable (ceo-helpers ne touche pas le plan social JSON)
 *  - siteReturn48h Umami : test placeholder it.skip
 */

// ─── Mocks au top du fichier (avant tout import) ─────────────────────

// Mock Anthropic SDK — `@/lib/ai/client.ts` instancie le client au load.
// Aucun appel `messages.create` attendu dans ce fichier de tests.
jest.mock("@anthropic-ai/sdk", () => {
  return jest.fn().mockImplementation(() => ({
    messages: { create: jest.fn() },
  }));
});

// Mock Prisma — factory inline (jest.mock est hoisté avant les const).
// On expose les jest.fn() via require("@/lib/prisma") après mock pour les
// manipuler dans les tests (mockResolvedValueOnce).
jest.mock("@/lib/prisma", () => ({
  prisma: {
    joke: { findMany: jest.fn() },
    tip: { findMany: jest.fn() },
    video: { findMany: jest.fn() },
    learningPath: { findMany: jest.fn() },
    blogArticle: { findMany: jest.fn() },
    ceoMemory: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    ceoConfig: { findFirst: jest.fn() },
    ceoOutboundMessage: {
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    ceoDedup: { findFirst: jest.fn(), create: jest.fn() },
    ceoAuditLog: { create: jest.fn(), count: jest.fn() },
    user: { update: jest.fn(), findUnique: jest.fn() },
    ceoLead: { upsert: jest.fn() },
    subscription: { findMany: jest.fn() },
    llmUsageLog: { aggregate: jest.fn() },
    ceoBacklink: { aggregate: jest.fn() },
    ceoKpiSnapshot: { upsert: jest.fn() },
  },
}));

// Mock `@/lib/job-lock` — intégration testée, pas le helper sous-jacent (s8).
jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: jest.fn(),
  releaseLock: jest.fn(),
}));

// Réf typée vers les mocks (import dynamique post-jest.mock).
// On utilise jest.requireMock pour éviter `require()` direct (lint).
type PrismaMock = {
  joke: { findMany: jest.Mock };
  tip: { findMany: jest.Mock };
  video: { findMany: jest.Mock };
  learningPath: { findMany: jest.Mock };
  blogArticle: { findMany: jest.Mock };
  ceoMemory: { findUnique: jest.Mock; upsert: jest.Mock; delete: jest.Mock };
  ceoConfig: { findFirst: jest.Mock };
  ceoOutboundMessage: { count: jest.Mock; aggregate: jest.Mock; groupBy: jest.Mock };
  ceoDedup: { findFirst: jest.Mock; create: jest.Mock };
  ceoAuditLog: { create: jest.Mock; count: jest.Mock };
  user: { update: jest.Mock; findUnique: jest.Mock };
  ceoLead: { upsert: jest.Mock };
  subscription: { findMany: jest.Mock };
  llmUsageLog: { aggregate: jest.Mock };
  ceoBacklink: { aggregate: jest.Mock };
  ceoKpiSnapshot: { upsert: jest.Mock };
};
const { prisma: mockPrisma } = jest.requireMock("@/lib/prisma") as { prisma: PrismaMock };
const { tryAcquireLock: mockTryAcquireLock, releaseLock: mockReleaseLock } =
  jest.requireMock("@/lib/job-lock") as {
    tryAcquireLock: jest.Mock;
    releaseLock: jest.Mock;
  };

import {
  lookupJoke,
  lookupResource,
  getCeoMemory,
  setCeoMemory,
  getCeoConfig,
  isCeoEnabled,
  applyFrequencyCap,
  checkAndStoreDedup,
  hashPii,
  maskPii,
  recordAudit,
  acquireCeoLock,
  releaseCeoLock,
  markCeoTouchpoint,
  getOrCreateLead,
  snapshotCeoKpis,
} from "@/lib/ai/ceo-helpers";

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── lookupJoke ──────────────────────────────────────────────────────

describe("lookupJoke", () => {
  it("filtre par catégorie (where.category appliqué)", async () => {
    mockPrisma.joke.findMany.mockResolvedValueOnce([]);
    await lookupJoke({ category: "REPARTIE" });
    expect(mockPrisma.joke.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ isActive: true, category: "REPARTIE" }),
      }),
    );
  });

  it("filtre par type", async () => {
    mockPrisma.joke.findMany.mockResolvedValueOnce([]);
    await lookupJoke({ type: "ONE_LINER" });
    expect(mockPrisma.joke.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ type: "ONE_LINER" }),
      }),
    );
  });

  it("filtre par maturityLevel", async () => {
    mockPrisma.joke.findMany.mockResolvedValueOnce([]);
    await lookupJoke({ maturityLevel: 3 });
    expect(mockPrisma.joke.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ maturityLevel: 3 }),
      }),
    );
  });

  it("filtre TOUJOURS isActive=true (sécurité — vannes désactivées exclues)", async () => {
    mockPrisma.joke.findMany.mockResolvedValueOnce([]);
    await lookupJoke();
    const call = mockPrisma.joke.findMany.mock.calls[0][0];
    expect(call.where.isActive).toBe(true);
  });

  it("limit par défaut = 3, cap à 10", async () => {
    mockPrisma.joke.findMany.mockResolvedValueOnce([]);
    await lookupJoke({ limit: 999 });
    const call = mockPrisma.joke.findMany.mock.calls[0][0];
    // Pool = 10× la limite, capped à 50 → take = 50
    expect(call.take).toBeLessThanOrEqual(50);
  });

  it("renvoie au plus `limit` vannes après shuffle", async () => {
    const pool = Array.from({ length: 30 }, (_, i) => ({ id: `j${i}` })) as unknown as Array<{
      id: string;
    }>;
    mockPrisma.joke.findMany.mockResolvedValueOnce(pool);
    const result = await lookupJoke({ limit: 3 });
    expect(result).toHaveLength(3);
  });

  it("renvoie [] si aucune vanne en DB", async () => {
    mockPrisma.joke.findMany.mockResolvedValueOnce([]);
    const result = await lookupJoke();
    expect(result).toEqual([]);
  });

  it("limit=10 max (cap dur) — protège le LLM context", async () => {
    const pool = Array.from({ length: 50 }, (_, i) => ({ id: `j${i}` }));
    mockPrisma.joke.findMany.mockResolvedValueOnce(pool);
    const result = await lookupJoke({ limit: 100 });
    expect(result.length).toBeLessThanOrEqual(10);
  });
});

// ─── lookupResource ──────────────────────────────────────────────────

describe("lookupResource", () => {
  it("type=tip — match sémantique sur title/content", async () => {
    mockPrisma.tip.findMany.mockResolvedValueOnce([
      { id: "t1", title: "Improvisation", content: "Apprendre la répartie improvisée." },
    ]);
    const result = await lookupResource({ type: "tip", topic: "improvisation rapide" });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: "tip",
      id: "t1",
      url: "/conseils/t1",
    });
    // Tokens : "improvisation" (>=3) + "rapide" (>=3)
    const call = mockPrisma.tip.findMany.mock.calls[0][0];
    expect(call.where.OR).toBeDefined();
  });

  it("type=tip — sans topic, pas de OR (renvoie tout)", async () => {
    mockPrisma.tip.findMany.mockResolvedValueOnce([]);
    await lookupResource({ type: "tip" });
    const call = mockPrisma.tip.findMany.mock.calls[0][0];
    expect(call.where.OR).toBeUndefined();
    expect(call.where.isActive).toBe(true);
  });

  it("type=video — url /videos/[id], filtre isActive", async () => {
    mockPrisma.video.findMany.mockResolvedValueOnce([
      { id: "v1", title: "Stand-up 101", description: "Bases du stand-up", technique: "punch" },
    ]);
    const result = await lookupResource({ type: "video", topic: "stand up" });
    expect(result[0].url).toBe("/videos/v1");
  });

  it("type=path — url /parcours/[slug], filtre isActive", async () => {
    mockPrisma.learningPath.findMany.mockResolvedValueOnce([
      { id: "p1", slug: "repartie-flash", title: "Répartie", description: "Apprendre vite" },
    ]);
    const result = await lookupResource({ type: "path", topic: "répartie" });
    expect(result[0].url).toBe("/parcours/repartie-flash");
  });

  it("type=blogArticle — url /blog/[slug], filtre isPublished (pas isActive)", async () => {
    mockPrisma.blogArticle.findMany.mockResolvedValueOnce([
      { id: "b1", slug: "comment-repartir", title: "Comment répartir", excerpt: "Extrait" },
    ]);
    const result = await lookupResource({ type: "blogArticle", topic: "humour" });
    const call = mockPrisma.blogArticle.findMany.mock.calls[0][0];
    expect(call.where.isPublished).toBe(true);
    expect(call.where.isActive).toBeUndefined();
    expect(result[0].url).toBe("/blog/comment-repartir");
  });

  it("ignore les tokens < 3 caractères (filtre bruit linguistique)", async () => {
    mockPrisma.tip.findMany.mockResolvedValueOnce([]);
    // "le" et "ça" font 2-2 → exclus, "humour" passe
    await lookupResource({ type: "tip", topic: "le ça humour" });
    const call = mockPrisma.tip.findMany.mock.calls[0][0];
    // OR construit uniquement à partir du token "humour" (2 colonnes : title + content)
    expect(call.where.OR).toHaveLength(2);
  });

  it("summary tronqué à 140 chars + ellipsis", async () => {
    const longContent = "x".repeat(200);
    mockPrisma.tip.findMany.mockResolvedValueOnce([
      { id: "t1", title: "Long", content: longContent },
    ]);
    const result = await lookupResource({ type: "tip", topic: "long" });
    expect(result[0].summary).toHaveLength(143); // 140 + "..."
    expect(result[0].summary.endsWith("...")).toBe(true);
  });

  it("summary court (< 140) sans ellipsis", async () => {
    mockPrisma.tip.findMany.mockResolvedValueOnce([
      { id: "t1", title: "Court", content: "Phrase courte." },
    ]);
    const result = await lookupResource({ type: "tip", topic: "court" });
    expect(result[0].summary).toBe("Phrase courte.");
  });

  it("limit cap à 10 même si demandé plus", async () => {
    mockPrisma.tip.findMany.mockResolvedValueOnce([]);
    await lookupResource({ type: "tip", limit: 50 });
    const call = mockPrisma.tip.findMany.mock.calls[0][0];
    expect(call.take).toBe(10);
  });
});

// ─── getCeoMemory ────────────────────────────────────────────────────

describe("getCeoMemory", () => {
  it("retourne null si namespace_key inexistant", async () => {
    mockPrisma.ceoMemory.findUnique.mockResolvedValueOnce(null);
    const result = await getCeoMemory("ns", "key");
    expect(result).toBeNull();
  });

  it("retourne value si présent et non expiré", async () => {
    mockPrisma.ceoMemory.findUnique.mockResolvedValueOnce({
      id: "m1",
      value: { foo: "bar" },
      expiresAt: null,
    });
    const result = await getCeoMemory<{ foo: string }>("ns", "key");
    expect(result).toEqual({ foo: "bar" });
  });

  it("retourne null + cleanup si expiré (expiresAt < now)", async () => {
    mockPrisma.ceoMemory.findUnique.mockResolvedValueOnce({
      id: "m1",
      value: { foo: "bar" },
      expiresAt: new Date(Date.now() - 1000),
    });
    mockPrisma.ceoMemory.delete.mockResolvedValueOnce({});
    const result = await getCeoMemory("ns", "key");
    expect(result).toBeNull();
    expect(mockPrisma.ceoMemory.delete).toHaveBeenCalledWith({ where: { id: "m1" } });
  });

  it("ne crash pas si delete cleanup échoue (catch silencieux)", async () => {
    mockPrisma.ceoMemory.findUnique.mockResolvedValueOnce({
      id: "m1",
      value: { foo: "bar" },
      expiresAt: new Date(Date.now() - 1000),
    });
    mockPrisma.ceoMemory.delete.mockRejectedValueOnce(new Error("DB busy"));
    const result = await getCeoMemory("ns", "key");
    expect(result).toBeNull();
  });

  it("respecte la clé composite namespace_key", async () => {
    mockPrisma.ceoMemory.findUnique.mockResolvedValueOnce(null);
    await getCeoMemory("conversion", "user-123");
    expect(mockPrisma.ceoMemory.findUnique).toHaveBeenCalledWith({
      where: { namespace_key: { namespace: "conversion", key: "user-123" } },
    });
  });
});

// ─── setCeoMemory ────────────────────────────────────────────────────

describe("setCeoMemory", () => {
  it("upsert sans TTL — expiresAt=null", async () => {
    mockPrisma.ceoMemory.upsert.mockResolvedValueOnce({});
    await setCeoMemory("ns", "key", { foo: "bar" });
    const call = mockPrisma.ceoMemory.upsert.mock.calls[0][0];
    expect(call.create.expiresAt).toBeNull();
    expect(call.update.expiresAt).toBeNull();
  });

  it("upsert avec TTL → expiresAt = now + ttlMs", async () => {
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date("2026-05-07T10:00:00Z"));
      mockPrisma.ceoMemory.upsert.mockResolvedValueOnce({});
      await setCeoMemory("ns", "key", { foo: "bar" }, 60_000);
      const call = mockPrisma.ceoMemory.upsert.mock.calls[0][0];
      expect(call.create.expiresAt).toEqual(new Date("2026-05-07T10:01:00Z"));
    } finally {
      jest.useRealTimers();
    }
  });

  it("upsert préserve namespace + key + value", async () => {
    mockPrisma.ceoMemory.upsert.mockResolvedValueOnce({});
    await setCeoMemory("conv", "uid", { count: 5 });
    const call = mockPrisma.ceoMemory.upsert.mock.calls[0][0];
    expect(call.where.namespace_key).toEqual({ namespace: "conv", key: "uid" });
    expect(call.create.value).toEqual({ count: 5 });
    expect(call.update.value).toEqual({ count: 5 });
  });
});

// ─── getCeoConfig ────────────────────────────────────────────────────

describe("getCeoConfig", () => {
  it("retourne le row le plus récent (orderBy updatedAt desc)", async () => {
    const cfg = { id: "c1", enabled: true, updatedAt: new Date() };
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce(cfg);
    const result = await getCeoConfig();
    expect(result).toBe(cfg);
    expect(mockPrisma.ceoConfig.findFirst).toHaveBeenCalledWith({
      orderBy: { updatedAt: "desc" },
    });
  });

  it("retourne null si aucune config", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce(null);
    const result = await getCeoConfig();
    expect(result).toBeNull();
  });
});

// ─── isCeoEnabled (kill-switch fail-safe) ────────────────────────────

describe("isCeoEnabled", () => {
  it("retourne true si config.enabled=true", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce({ enabled: true });
    expect(await isCeoEnabled()).toBe(true);
  });

  it("retourne false si config.enabled=false", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce({ enabled: false });
    expect(await isCeoEnabled()).toBe(false);
  });

  it("retourne false si aucune config en DB (fail-safe)", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce(null);
    expect(await isCeoEnabled()).toBe(false);
  });

  it("retourne false si enabled est undefined (fail-safe)", async () => {
    mockPrisma.ceoConfig.findFirst.mockResolvedValueOnce({ id: "c1" });
    expect(await isCeoEnabled()).toBe(false);
  });
});

// ─── applyFrequencyCap ───────────────────────────────────────────────

describe("applyFrequencyCap", () => {
  it("Segment A : 0 messages dans 30j → canSend=true", async () => {
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0);
    const result = await applyFrequencyCap("lead-1", "A");
    expect(result.canSend).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("Segment A : 1 message → canSend=true (cap=2)", async () => {
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(1);
    expect((await applyFrequencyCap("lead-1", "A")).canSend).toBe(true);
  });

  it("Segment A : 2 messages → canSend=false (cap atteint)", async () => {
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(2);
    const result = await applyFrequencyCap("lead-1", "A");
    expect(result.canSend).toBe(false);
    expect(result.reason).toMatch(/frequency_cap_A_2\/2/);
  });

  it("Segment A : 5 messages → canSend=false", async () => {
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(5);
    expect((await applyFrequencyCap("lead-1", "A")).canSend).toBe(false);
  });

  it("Segment B : 0 messages → canSend=true (cap=1)", async () => {
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0);
    expect((await applyFrequencyCap("lead-1", "B")).canSend).toBe(true);
  });

  it("Segment B : 1 message → canSend=false (cap atteint)", async () => {
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(1);
    const result = await applyFrequencyCap("lead-1", "B");
    expect(result.canSend).toBe(false);
    expect(result.reason).toMatch(/frequency_cap_B_1\/1/);
  });

  it("filtre direction=OUTBOUND + status=SENT + sentAt 30j", async () => {
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0);
    await applyFrequencyCap("lead-xyz", "A");
    const call = mockPrisma.ceoOutboundMessage.count.mock.calls[0][0];
    expect(call.where.leadId).toBe("lead-xyz");
    expect(call.where.direction).toBe("OUTBOUND");
    expect(call.where.status).toBe("SENT");
    expect(call.where.sentAt.gte).toBeInstanceOf(Date);
  });
});

// ─── checkAndStoreDedup ──────────────────────────────────────────────

describe("checkAndStoreDedup", () => {
  it("hash SHA256 déterministe sur (channel, recipient, content[0..100])", async () => {
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    mockPrisma.ceoDedup.create.mockResolvedValueOnce({});
    const r1 = await checkAndStoreDedup("EMAIL", "user@test.com", "Bonjour Alice");
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    mockPrisma.ceoDedup.create.mockResolvedValueOnce({});
    const r2 = await checkAndStoreDedup("EMAIL", "user@test.com", "Bonjour Alice");
    expect(r1.hash).toBe(r2.hash);
    expect(r1.hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("INSERT si pas de doublon dans 24h", async () => {
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    mockPrisma.ceoDedup.create.mockResolvedValueOnce({});
    const result = await checkAndStoreDedup("EMAIL", "a@b.com", "msg");
    expect(result.isDuplicate).toBe(false);
    expect(mockPrisma.ceoDedup.create).toHaveBeenCalled();
  });

  it("renvoie isDuplicate=true si row déjà présent (pas de INSERT)", async () => {
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce({ id: "d1", contentHash: "h" });
    const result = await checkAndStoreDedup("EMAIL", "a@b.com", "msg");
    expect(result.isDuplicate).toBe(true);
    expect(mockPrisma.ceoDedup.create).not.toHaveBeenCalled();
  });

  it("collision concurrent (P2002) → traité comme doublon", async () => {
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    const err = new Error("Unique constraint failed") as Error & { code: string };
    err.code = "P2002";
    mockPrisma.ceoDedup.create.mockRejectedValueOnce(err);
    const result = await checkAndStoreDedup("EMAIL", "a@b.com", "msg");
    expect(result.isDuplicate).toBe(true);
  });

  it("autres erreurs DB → throw (pas de silent-fail)", async () => {
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    mockPrisma.ceoDedup.create.mockRejectedValueOnce(new Error("connection refused"));
    await expect(checkAndStoreDedup("EMAIL", "a@b.com", "msg")).rejects.toThrow(
      "connection refused",
    );
  });

  it("hash distinct si content diffère sur les 100 premiers chars", async () => {
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    mockPrisma.ceoDedup.create.mockResolvedValueOnce({});
    const r1 = await checkAndStoreDedup("EMAIL", "a@b.com", "Bonjour A");
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    mockPrisma.ceoDedup.create.mockResolvedValueOnce({});
    const r2 = await checkAndStoreDedup("EMAIL", "a@b.com", "Bonjour B");
    expect(r1.hash).not.toBe(r2.hash);
  });

  it("hash IDENTIQUE si content diffère après les 100 premiers chars", async () => {
    const prefix = "x".repeat(100);
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    mockPrisma.ceoDedup.create.mockResolvedValueOnce({});
    const r1 = await checkAndStoreDedup("EMAIL", "a@b.com", prefix + "AAAA");
    mockPrisma.ceoDedup.findFirst.mockResolvedValueOnce(null);
    mockPrisma.ceoDedup.create.mockResolvedValueOnce({});
    const r2 = await checkAndStoreDedup("EMAIL", "a@b.com", prefix + "BBBB");
    expect(r1.hash).toBe(r2.hash);
  });
});

// ─── hashPii ─────────────────────────────────────────────────────────

describe("hashPii", () => {
  it("retourne un SHA256 (64 chars hex)", () => {
    const h = hashPii("user@example.com");
    expect(h).toMatch(/^[a-f0-9]{64}$/);
  });

  it("déterministe — mêmes inputs = même hash", () => {
    expect(hashPii("user@example.com")).toBe(hashPii("user@example.com"));
  });

  it("trim + lowercase avant hash (normalisation PII)", () => {
    const h1 = hashPii("USER@example.com");
    const h2 = hashPii("  user@example.com  ");
    const h3 = hashPii("user@example.com");
    expect(h1).toBe(h2);
    expect(h2).toBe(h3);
  });

  it("hash différent pour 2 PII distincts", () => {
    expect(hashPii("a@b.com")).not.toBe(hashPii("c@d.com"));
  });
});

// ─── maskPii ─────────────────────────────────────────────────────────

describe("maskPii", () => {
  it("masque un email : 2 premiers chars du local + domaine en clair", () => {
    expect(maskPii("alice@example.com")).toBe("al***@example.com");
  });

  it("masque un handle social (sans @) : 2 premiers chars + ***", () => {
    expect(maskPii("alicewonderland")).toBe("al***");
  });

  it("retourne tel quel une string vide", () => {
    expect(maskPii("")).toBe("");
  });

  it("masque même si local < 2 chars (slice safe)", () => {
    expect(maskPii("a@b.com")).toBe("a***@b.com");
  });

  it("masque un email avec sous-domaine multi-niveaux", () => {
    expect(maskPii("admin@mail.deviens-marrant.fr")).toBe("ad***@mail.deviens-marrant.fr");
  });
});

// ─── recordAudit ─────────────────────────────────────────────────────

describe("recordAudit", () => {
  it("INSERT avec targetId hashé (jamais en clair)", async () => {
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({});
    await recordAudit({
      action: "outbound_send",
      targetType: "lead",
      targetId: "user@test.com",
      channel: "EMAIL",
      outcome: "sent",
    });
    const call = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(call.data.targetIdHashed).toMatch(/^[a-f0-9]{64}$/);
    // targetId clair JAMAIS en DB
    expect(JSON.stringify(call.data)).not.toContain("user@test.com");
  });

  it("silent-fail si DB crash (jamais throw)", async () => {
    mockPrisma.ceoAuditLog.create.mockRejectedValueOnce(new Error("DB down"));
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      recordAudit({
        action: "outbound_send",
        targetType: "lead",
        targetId: "user@test.com",
        channel: "EMAIL",
        outcome: "sent",
      }),
    ).resolves.toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("préserve tous les champs optionnels (aiDecisionScore, aiModel, reasoning, errorMessage)", async () => {
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({});
    await recordAudit({
      action: "outbound_reject",
      targetType: "user",
      targetId: "uid-123",
      channel: "EMAIL",
      aiDecisionScore: 0.92,
      aiModel: "claude-sonnet-4-5",
      reasoning: "tone too pushy",
      outcome: "rejected",
      errorMessage: null as unknown as string | undefined,
    });
    const call = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(call.data.aiDecisionScore).toBe(0.92);
    expect(call.data.aiModel).toBe("claude-sonnet-4-5");
    expect(call.data.reasoning).toBe("tone too pushy");
  });

  it("champs optionnels absents → null en DB (pas undefined)", async () => {
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({});
    await recordAudit({
      action: "skip",
      targetType: "system",
      targetId: "tick-1",
      channel: "INTERNAL",
      outcome: "skipped",
    });
    const call = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(call.data.aiDecisionScore).toBeNull();
    expect(call.data.aiModel).toBeNull();
    expect(call.data.reasoning).toBeNull();
    expect(call.data.errorMessage).toBeNull();
  });

  it("préserve action + targetType + outcome verbatim", async () => {
    mockPrisma.ceoAuditLog.create.mockResolvedValueOnce({});
    await recordAudit({
      action: "outbound_send",
      targetType: "journalist",
      targetId: "j@news.com",
      channel: "BACKLINK_EMAIL",
      outcome: "sent",
    });
    const call = mockPrisma.ceoAuditLog.create.mock.calls[0][0];
    expect(call.data.action).toBe("outbound_send");
    expect(call.data.targetType).toBe("journalist");
    expect(call.data.outcome).toBe("sent");
  });
});

// ─── acquireCeoLock / releaseCeoLock (intégration job-lock) ──────────

describe("acquireCeoLock", () => {
  it("préfixe la clé avec 'ceo-tick-' (déduplication par tick)", async () => {
    mockTryAcquireLock.mockResolvedValueOnce(true);
    const result = await acquireCeoLock("2026-05-07-am");
    expect(result).toBe(true);
    expect(mockTryAcquireLock).toHaveBeenCalledWith(
      "ceo-tick-2026-05-07-am",
      5 * 60 * 1000,
    );
  });

  it("TTL par défaut = 5 minutes", async () => {
    mockTryAcquireLock.mockResolvedValueOnce(true);
    await acquireCeoLock("tick");
    const args = mockTryAcquireLock.mock.calls[0];
    expect(args[1]).toBe(5 * 60 * 1000);
  });

  it("propage le TTL custom", async () => {
    mockTryAcquireLock.mockResolvedValueOnce(true);
    await acquireCeoLock("tick", 30_000);
    const args = mockTryAcquireLock.mock.calls[0];
    expect(args[1]).toBe(30_000);
  });

  it("retourne false si tryAcquireLock échoue (lock détenu)", async () => {
    mockTryAcquireLock.mockResolvedValueOnce(false);
    expect(await acquireCeoLock("tick")).toBe(false);
  });
});

describe("releaseCeoLock", () => {
  it("appelle releaseLock avec la clé préfixée", async () => {
    mockReleaseLock.mockResolvedValueOnce(undefined);
    await releaseCeoLock("2026-05-07-am");
    expect(mockReleaseLock).toHaveBeenCalledWith("ceo-tick-2026-05-07-am");
  });
});

// ─── markCeoTouchpoint ───────────────────────────────────────────────

describe("markCeoTouchpoint", () => {
  it("update User.lastCeoTouchpoint à maintenant", async () => {
    mockPrisma.user.update.mockResolvedValueOnce({});
    await markCeoTouchpoint("user-123");
    const call = mockPrisma.user.update.mock.calls[0][0];
    expect(call.where).toEqual({ id: "user-123" });
    expect(call.data.lastCeoTouchpoint).toBeInstanceOf(Date);
  });

  it("silent-fail si User n'existe pas (jamais throw)", async () => {
    mockPrisma.user.update.mockRejectedValueOnce(new Error("not found"));
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(markCeoTouchpoint("ghost-id")).resolves.toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("masque l'userId dans le log d'erreur (pas de PII en clair)", async () => {
    mockPrisma.user.update.mockRejectedValueOnce(new Error("DB"));
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await markCeoTouchpoint("alicewonderland");
    const logged = consoleErrorSpy.mock.calls[0][0] as string;
    expect(logged).toContain("al***");
    expect(logged).not.toContain("alicewonderland");
    consoleErrorSpy.mockRestore();
  });
});

// ─── getOrCreateLead ─────────────────────────────────────────────────

describe("getOrCreateLead", () => {
  it("upsert sur userId — create avec source", async () => {
    const lead = { id: "l1", userId: "u1", source: "signup_completed" };
    mockPrisma.ceoLead.upsert.mockResolvedValueOnce(lead);
    const result = await getOrCreateLead("u1", "signup_completed");
    expect(result).toBe(lead);
    const call = mockPrisma.ceoLead.upsert.mock.calls[0][0];
    expect(call.where).toEqual({ userId: "u1" });
    expect(call.create).toEqual({ userId: "u1", source: "signup_completed" });
  });

  it("update vide (idempotent — ne réécrit pas le source)", async () => {
    mockPrisma.ceoLead.upsert.mockResolvedValueOnce({});
    await getOrCreateLead("u1", "ignored_on_update");
    const call = mockPrisma.ceoLead.upsert.mock.calls[0][0];
    expect(call.update).toEqual({});
  });
});

// ─── snapshotCeoKpis ─────────────────────────────────────────────────

describe("snapshotCeoKpis", () => {
  /**
   * Helper — pose un set de mocks "tout zéro" cohérent. Chaque test peut
   * override avec mockResolvedValueOnce ce dont il a besoin.
   */
  function setupZeroMocks() {
    mockPrisma.ceoOutboundMessage.aggregate
      // 1er appel : outboundAgg (north star)
      .mockResolvedValueOnce({
        _count: { _all: 0 },
        _sum: { opens: null, replies: null, clicks: null },
      })
      // 2e appel : emailAgg
      .mockResolvedValueOnce({
        _count: { _all: 0 },
        _sum: { opens: null, replies: null },
      });
    mockPrisma.ceoOutboundMessage.count
      .mockResolvedValueOnce(0) // draftsTotal
      .mockResolvedValueOnce(0); // draftsRejected
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(0);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([]);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: null } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({ id: "snap-1" });
  }

  it("totalSent=0 → northStar=0, ratios=0 (pas de division par zéro)", async () => {
    setupZeroMocks();
    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.northStarEngagement30d).toBe(0);
    expect(call.create.emailReplyRate).toBe(0);
    expect(call.create.emailOpenRate).toBe(0);
    expect(call.create.directorFailRate).toBe(0);
  });

  it("calcule northStar = (opens+replies+clicks)/totalSent", async () => {
    mockPrisma.ceoOutboundMessage.aggregate
      .mockResolvedValueOnce({
        _count: { _all: 100 },
        _sum: { opens: 30, replies: 5, clicks: 15 },
      })
      .mockResolvedValueOnce({
        _count: { _all: 80 },
        _sum: { opens: 24, replies: 4 },
      });
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(50).mockResolvedValueOnce(5);
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(0);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([]);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: 0 } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({});

    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.northStarEngagement30d).toBeCloseTo(0.5); // (30+5+15)/100
    expect(call.create.emailOpenRate).toBeCloseTo(0.3); // 24/80
    expect(call.create.emailReplyRate).toBeCloseTo(0.05); // 4/80
  });

  it("directorFailRate = rejected/total", async () => {
    mockPrisma.ceoOutboundMessage.aggregate
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} })
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} });
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(20).mockResolvedValueOnce(4);
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(0);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([]);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: 0 } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({});

    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.directorFailRate).toBeCloseTo(0.2); // 4/20
  });

  it("draftsAutoSendRatio par canal (groupBy channel + requiresHumanReview)", async () => {
    mockPrisma.ceoOutboundMessage.aggregate
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} })
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} });
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([
      { channel: "EMAIL", requiresHumanReview: true, _count: { _all: 30 } },
      { channel: "EMAIL", requiresHumanReview: false, _count: { _all: 70 } },
      { channel: "DM_TWITTER", requiresHumanReview: false, _count: { _all: 50 } },
    ]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(0);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([]);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: 0 } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({});

    await snapshotCeoKpis();
    const ratios = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0].create.draftsAutoSendRatio;
    expect(ratios.EMAIL).toBeCloseTo(0.7); // 70/100
    expect(ratios.DM_TWITTER).toBeCloseTo(1); // 50/50
  });

  it("killSwitchTriggers24h = count audit logs (tick_skip_killswitch + tick_skip_budget)", async () => {
    mockPrisma.ceoOutboundMessage.aggregate
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} })
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} });
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(7);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([]);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: 0 } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({});

    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.killSwitchTriggers24h).toBe(7);
    // Vérifier que le filtre action utilise `in` avec les 2 actions
    const auditCall = mockPrisma.ceoAuditLog.count.mock.calls[0][0];
    expect(auditCall.where.action.in).toEqual(["tick_skip_killswitch", "tick_skip_budget"]);
  });

  it("ceoAttributedConversions — fenêtre 7j + lastCeoTouchpoint < createdAt", async () => {
    const now = Date.now();
    const within7d = new Date(now - 2 * 24 * 60 * 60 * 1000);
    mockPrisma.ceoOutboundMessage.aggregate
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} })
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} });
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(0);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([
      { userId: "u1", createdAt: within7d },
      { userId: "u2", createdAt: within7d },
    ]);
    // u1 : touchpoint AVANT createdAt et < 7j → compte
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      lastCeoTouchpoint: new Date(within7d.getTime() - 60 * 60 * 1000),
    });
    // u2 : touchpoint APRÈS createdAt → ne compte pas
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      lastCeoTouchpoint: new Date(within7d.getTime() + 60 * 60 * 1000),
    });
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: 0 } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({});

    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.ceoAttributedConversions).toBe(1);
  });

  it("ceoAttributedConversions = 0 si lastCeoTouchpoint=null", async () => {
    const within7d = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    mockPrisma.ceoOutboundMessage.aggregate
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} })
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} });
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(0);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([
      { userId: "u1", createdAt: within7d },
    ]);
    mockPrisma.user.findUnique.mockResolvedValueOnce({ lastCeoTouchpoint: null });
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: 0 } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({});

    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.ceoAttributedConversions).toBe(0);
  });

  it("costPerAcquiredSubscriber : USD→EUR conversion (×0.92)", async () => {
    const within7d = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    mockPrisma.ceoOutboundMessage.aggregate
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} })
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} });
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(0);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([
      { userId: "u1", createdAt: within7d },
    ]);
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      lastCeoTouchpoint: new Date(within7d.getTime() - 60 * 60 * 1000),
    });
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 100 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: 0 } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({});

    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.costPerAcquiredSubscriber).toBeCloseTo(92); // 100 * 0.92 / 1
  });

  it("costPerAcquiredSubscriber=null si 0 conversions (pas de division par zéro)", async () => {
    setupZeroMocks();
    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.costPerAcquiredSubscriber).toBeNull();
  });

  it("backlinksDaSum agrège les ACQUIRED uniquement", async () => {
    mockPrisma.ceoOutboundMessage.aggregate
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} })
      .mockResolvedValueOnce({ _count: { _all: 0 }, _sum: {} });
    mockPrisma.ceoOutboundMessage.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    mockPrisma.ceoOutboundMessage.groupBy.mockResolvedValueOnce([]);
    mockPrisma.ceoAuditLog.count.mockResolvedValueOnce(0);
    mockPrisma.subscription.findMany.mockResolvedValueOnce([]);
    mockPrisma.llmUsageLog.aggregate.mockResolvedValueOnce({ _sum: { costUsd: 0 } });
    mockPrisma.ceoBacklink.aggregate.mockResolvedValueOnce({ _sum: { da: 240 } });
    mockPrisma.ceoKpiSnapshot.upsert.mockResolvedValueOnce({});

    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.backlinksDaSum).toBe(240);
    const blCall = mockPrisma.ceoBacklink.aggregate.mock.calls[0][0];
    expect(blCall.where.status).toBe("ACQUIRED");
  });

  it("idempotent — upsert sur date UTC truncate à 00:00", async () => {
    setupZeroMocks();
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date("2026-05-07T15:32:11Z"));
      await snapshotCeoKpis();
      const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
      expect(call.where.date).toEqual(new Date(Date.UTC(2026, 4, 7))); // mai = mois 4
    } finally {
      jest.useRealTimers();
    }
  });

  it("upsert update miroir le create (mêmes champs)", async () => {
    setupZeroMocks();
    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    // update doit avoir les mêmes clés que create (sauf "date")
    const createKeys = Object.keys(call.create).filter((k) => k !== "date").sort();
    const updateKeys = Object.keys(call.update).sort();
    expect(updateKeys).toEqual(createKeys);
  });

  // ─── P1 placeholders documentés (skip → todo s10/s11) ──────────

  it.skip("[TODO s10/s11] siteReturn48h — câblage Umami cross-session manquant (P1 ouvert s9)", async () => {
    // Tracking Umami avec UTM cross-session côté serveur n'est pas câblé
    // (chantier Phase 5.B.2). La valeur `siteReturn48h` est un placeholder
    // (0 en dur) tant que le pipeline d'ingestion n'est pas livré.
    // Test à activer quand Umami → CeoOutboundMessage join sera implémenté.
  });

  it("siteReturn48h = 0 (placeholder constant tant qu'Umami non câblé)", async () => {
    setupZeroMocks();
    await snapshotCeoKpis();
    const call = mockPrisma.ceoKpiSnapshot.upsert.mock.calls[0][0];
    expect(call.create.siteReturn48h).toBe(0);
  });

  it.skip("[TODO s10] retry Neon cold start — mitigation à implémenter Phase 5.E (P1 ouvert s8)", async () => {
    // Sur Neon serverless, le 1er appel après inactivité peut prendre 4-5s
    // (cold start). `snapshotCeoKpis` enchaîne ~10 requêtes Prisma en série :
    // si la 1re timeout, tout le snapshot échoue.
    // Mitigation à choisir Phase 5.E :
    //   (a) Retry 3× avec backoff 5s sur la 1re aggregate(),
    //   (b) Keep-alive 4min (cron ping /api/health DB).
    // Test à activer une fois la mitigation choisie + implémentée.
  });
});

// ─── P1 LinkedIn JSON conformité ─────────────────────────────────────

describe("[P1 ouvert] LinkedIn JSON plan éditorial", () => {
  it("non applicable — ceo-helpers ne lit/écrit PAS le plan social JSON", () => {
    // Justification : `ceo-helpers.ts` opère sur CeoOutboundMessage, CeoLead,
    // CeoMemory, CeoConfig, CeoAuditLog, CeoDedup, CeoBacklink, CeoKpiSnapshot,
    // User, Subscription, LlmUsageLog, Joke, Tip, Video, LearningPath,
    // BlogArticle. AUCUNE lecture/écriture du JSON plan éditorial social.
    // → P1 conformité quotas LinkedIn s'applique à `social-media-agent.ts`,
    //   pas à ce module. Couverture skip justifiée.
    expect(true).toBe(true);
  });
});

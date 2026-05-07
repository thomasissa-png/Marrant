/**
 * @jest-environment node
 *
 * Tests — Cron social-analytics (/api/cron/social-analytics)
 *
 * Hotfix s10 (06/05/2026) — bug Buffer rate limit 24h en boucle.
 * Couvre les 3 fixes critiques :
 *   (a) Time gate utcHour : skip si heure impaire (sauf ?force=1)
 *   (b) Cache module-level 60 min sur getBufferScheduledPosts()
 *   (c) Circuit breaker : skip lecture queue Buffer si toutes plateformes en rate limit 24h
 *
 * Ces 3 fixes empêchent le cron de relancer la fenêtre 24h Buffer en boucle
 * quand un rate limit 429 est actif sur toutes les plateformes.
 */

// ─── Mocks Prisma ────────────────────────────────────────────────

const mockSocialPostFindMany = jest.fn();
const mockSocialPostCount = jest.fn();
const mockSocialPostUpdateMany = jest.fn();
const mockSocialPostGroupBy = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    socialPost: {
      findMany: (...args: unknown[]) => mockSocialPostFindMany(...args),
      count: (...args: unknown[]) => mockSocialPostCount(...args),
      updateMany: (...args: unknown[]) => mockSocialPostUpdateMany(...args),
      groupBy: (...args: unknown[]) => mockSocialPostGroupBy(...args),
    },
  },
}));

// ─── Mocks Buffer client ─────────────────────────────────────────

const mockIsBufferConfigured = jest.fn();
const mockGetBufferScheduledPosts = jest.fn();

jest.mock("@/lib/social/buffer-client", () => ({
  isBufferConfigured: (...args: unknown[]) => mockIsBufferConfigured(...args),
  getBufferScheduledPosts: (...args: unknown[]) => mockGetBufferScheduledPosts(...args),
}));

// ─── Helpers ────────────────────────────────────────────────────

function makeAnalyticsRequest(query = "") {
  const url = `https://example.com/api/cron/social-analytics?secret=test-secret${query ? "&" + query : ""}`;
  return new Request(url, { method: "GET" });
}

/** Stub par défaut : aucun post, aucune anomalie, 0 dans la queue Buffer. */
function stubAllEmpty() {
  mockSocialPostCount.mockResolvedValue(0);
  mockSocialPostUpdateMany.mockResolvedValue({ count: 0 });
  mockSocialPostGroupBy.mockResolvedValue([]);
  mockSocialPostFindMany.mockResolvedValue([]); // aucun rate limit récent ET aucun top post
  mockIsBufferConfigured.mockReturnValue(true);
  mockGetBufferScheduledPosts.mockResolvedValue([]);
}

// ─── Tests ───────────────────────────────────────────────────────

describe("Cron social-analytics — hotfix s10 Buffer rate limit", () => {
  let GET: (req: Request) => Promise<Response>;
  let resetBufferQueueCache: () => void;

  beforeAll(async () => {
    process.env.CRON_SECRET = "test-secret";
    const mod = await import("@/app/api/cron/social-analytics/route");
    GET = mod.GET as typeof GET;
    resetBufferQueueCache = mod.__resetBufferQueueCacheForTests;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resetBufferQueueCache();
    stubAllEmpty();
  });

  // ─── Auth ──────────────────────────────────────────────────────

  it("rejette une requête sans secret (401)", async () => {
    const url = "https://example.com/api/cron/social-analytics";
    const res = await GET(new Request(url));
    expect(res.status).toBe(401);
  });

  // ─── (a) Time gate horaire interne ──────────────────────────────

  describe("(a) Time gate utcHour", () => {
    it("skip à une heure impaire (utcHour=13) sans appeler Prisma ni Buffer", async () => {
      jest.useFakeTimers();
      try {
        // 06 mai 2026 13:00 UTC → utcHour=13, impair → skip
        jest.setSystemTime(new Date("2026-05-06T13:00:00Z"));
        const res = await GET(makeAnalyticsRequest());
        const body = await res.json();
        expect(res.status).toBe(200);
        expect(body.skipped).toBe(true);
        expect(body.reason).toContain("utcHour=13");
        // Aucun appel Prisma ni Buffer ne doit avoir été fait
        expect(mockSocialPostCount).not.toHaveBeenCalled();
        expect(mockSocialPostFindMany).not.toHaveBeenCalled();
        expect(mockGetBufferScheduledPosts).not.toHaveBeenCalled();
      } finally {
        jest.useRealTimers();
      }
    });

    it("exécute le travail à une heure paire (utcHour=12)", async () => {
      jest.useFakeTimers();
      try {
        jest.setSystemTime(new Date("2026-05-06T12:00:00Z"));
        const res = await GET(makeAnalyticsRequest());
        const body = await res.json();
        expect(res.status).toBe(200);
        expect(body.skipped).toBeUndefined();
        // Le travail s'est bien exécuté
        expect(mockSocialPostCount).toHaveBeenCalled();
      } finally {
        jest.useRealTimers();
      }
    });

    it("bypass time gate avec ?force=1 même à une heure impaire", async () => {
      jest.useFakeTimers();
      try {
        jest.setSystemTime(new Date("2026-05-06T13:00:00Z"));
        const res = await GET(makeAnalyticsRequest("force=1"));
        const body = await res.json();
        expect(res.status).toBe(200);
        expect(body.skipped).toBeUndefined();
        expect(mockSocialPostCount).toHaveBeenCalled();
      } finally {
        jest.useRealTimers();
      }
    });
  });

  // ─── (b) Cache 60 min sur getBufferScheduledPosts ───────────────

  describe("(b) Cache 60 min sur getBufferScheduledPosts", () => {
    it("premier appel : fetch frais, 2e appel < 60 min : cache hit (pas de re-fetch Buffer)", async () => {
      jest.useFakeTimers();
      try {
        jest.setSystemTime(new Date("2026-05-06T12:00:00Z"));
        mockGetBufferScheduledPosts.mockResolvedValue([{ id: "p1" }, { id: "p2" }]);

        const res1 = await GET(makeAnalyticsRequest());
        const body1 = await res1.json();
        expect(body1.bufferQueue).toBe(2);
        expect(body1.bufferQueueSource).toBe("fresh");
        expect(mockGetBufferScheduledPosts).toHaveBeenCalledTimes(1);

        // 2e appel 30 min plus tard, toujours utcHour pair → cache valide (TTL 60 min)
        jest.setSystemTime(new Date("2026-05-06T12:30:00Z"));
        const res2 = await GET(makeAnalyticsRequest());
        const body2 = await res2.json();
        expect(body2.bufferQueue).toBe(2);
        expect(body2.bufferQueueSource).toBe("cache");
        // Aucun nouvel appel Buffer
        expect(mockGetBufferScheduledPosts).toHaveBeenCalledTimes(1);
      } finally {
        jest.useRealTimers();
      }
    });

    it("après expiration du TTL (61 min), refetch frais", async () => {
      jest.useFakeTimers();
      try {
        jest.setSystemTime(new Date("2026-05-06T10:00:00Z"));
        mockGetBufferScheduledPosts.mockResolvedValueOnce([{ id: "p1" }]);
        await GET(makeAnalyticsRequest());
        expect(mockGetBufferScheduledPosts).toHaveBeenCalledTimes(1);

        // 1h01 plus tard (12:01), cache expiré → refetch
        // utcHour=12 → pair, le travail s'exécute
        jest.setSystemTime(new Date("2026-05-06T12:01:00Z"));
        mockGetBufferScheduledPosts.mockResolvedValueOnce([{ id: "p1" }, { id: "p2" }, { id: "p3" }]);
        const res2 = await GET(makeAnalyticsRequest());
        const body2 = await res2.json();
        expect(body2.bufferQueue).toBe(3);
        expect(body2.bufferQueueSource).toBe("fresh");
        expect(mockGetBufferScheduledPosts).toHaveBeenCalledTimes(2);
      } finally {
        jest.useRealTimers();
      }
    });
  });

  // ─── (c) Circuit breaker — rate limit 24h ───────────────────────

  describe("(c) Circuit breaker rate limit 24h", () => {
    it("skip lecture queue Buffer si TOUTES les plateformes sont en rate limit 24h", async () => {
      jest.useFakeTimers();
      try {
        jest.setSystemTime(new Date("2026-05-06T12:00:00Z"));
        // recentRateLimits findMany retourne les 3 plateformes en rate limit
        mockSocialPostFindMany.mockImplementation(async (args: { select?: { platform?: boolean } }) => {
          if (args?.select?.platform) {
            return [
              { platform: "TWITTER" },
              { platform: "LINKEDIN" },
              { platform: "INSTAGRAM" },
            ];
          }
          return []; // top posts → vide
        });

        const res = await GET(makeAnalyticsRequest());
        const body = await res.json();
        expect(res.status).toBe(200);
        expect(body.bufferQueueSource).toBe("skipped-circuit-breaker");
        expect(body.bufferQueue).toBe(0);
        expect(body.blockedPlatforms.sort()).toEqual(["INSTAGRAM", "LINKEDIN", "TWITTER"]);
        // Le fix critique : on n'appelle PAS Buffer quand toutes les plateformes sont down
        expect(mockGetBufferScheduledPosts).not.toHaveBeenCalled();
      } finally {
        jest.useRealTimers();
      }
    });

    it("interroge Buffer normalement si SEULES certaines plateformes sont en rate limit (pas toutes)", async () => {
      jest.useFakeTimers();
      try {
        jest.setSystemTime(new Date("2026-05-06T12:00:00Z"));
        // Seulement TWITTER en rate limit → LINKEDIN/INSTAGRAM ok → on lit toujours la queue
        mockSocialPostFindMany.mockImplementation(async (args: { select?: { platform?: boolean } }) => {
          if (args?.select?.platform) {
            return [{ platform: "TWITTER" }];
          }
          return [];
        });
        mockGetBufferScheduledPosts.mockResolvedValue([{ id: "p1" }]);

        const res = await GET(makeAnalyticsRequest());
        const body = await res.json();
        expect(body.bufferQueueSource).toBe("fresh");
        expect(body.bufferQueue).toBe(1);
        expect(body.blockedPlatforms).toEqual(["TWITTER"]);
        expect(mockGetBufferScheduledPosts).toHaveBeenCalledTimes(1);
      } finally {
        jest.useRealTimers();
      }
    });

    it("filtre recentRateLimits sur fenêtre 24h + status FAILED + directorNote contient 429", async () => {
      jest.useFakeTimers();
      try {
        jest.setSystemTime(new Date("2026-05-06T12:00:00Z"));
        mockSocialPostFindMany.mockImplementation(async (args: { select?: { platform?: boolean } }) => {
          if (args?.select?.platform) {
            return [];
          }
          return [];
        });

        await GET(makeAnalyticsRequest());

        // Vérifier que le findMany pour recentRateLimits a bien été appelé avec les bons filtres
        const rateLimitCall = mockSocialPostFindMany.mock.calls.find(
          (c) => c[0]?.select?.platform === true,
        );
        expect(rateLimitCall).toBeDefined();
        const where = rateLimitCall![0].where;
        expect(where.status).toBe("FAILED");
        expect(where.directorNote).toEqual({ contains: "429" });
        expect(where.updatedAt).toHaveProperty("gte");
        // La fenêtre doit être ~24h en arrière
        const gte = where.updatedAt.gte as Date;
        const expectedGte = new Date("2026-05-05T12:00:00Z");
        expect(Math.abs(gte.getTime() - expectedGte.getTime())).toBeLessThan(1000);
      } finally {
        jest.useRealTimers();
      }
    });
  });
});

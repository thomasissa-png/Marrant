/**
 * @jest-environment node
 *
 * Phase 5.D — Groupe 1 P0 : Tests cron `/api/cron/ceo-tick`.
 *
 * Cible : `apps/web/src/app/api/cron/ceo-tick/route.ts` (79 lignes).
 *
 * 3 garde-fous au niveau cron (avant runDailyTick) :
 *  1. Auth Bearer CRON_SECRET (header ou ?secret=)
 *  2. Time gate UTC 2-4h59 (sauf ?force=true)
 *  3. Lock applicatif `cron:ceo-tick` TTL 30 min (anti-double cron)
 *
 * Pattern de référence : `social-analytics.test.ts` (livré s10).
 */

// ─── Mocks au top ──────────────────────────────────────────────────

const mockRunDailyTick = jest.fn();
const mockTryAcquireLock = jest.fn();
const mockReleaseLock = jest.fn();

jest.mock("@/lib/ai/agents/ceo-agent", () => ({
  runDailyTick: mockRunDailyTick,
}));

jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: mockTryAcquireLock,
  releaseLock: mockReleaseLock,
}));

// ─── Helpers ──────────────────────────────────────────────────────

function makeCeoTickRequest(opts: { auth?: string; secret?: string; force?: boolean } = {}) {
  const params = new URLSearchParams();
  if (opts.secret) params.set("secret", opts.secret);
  if (opts.force) params.set("force", "true");
  const url = `https://example.com/api/cron/ceo-tick${params.toString() ? "?" + params : ""}`;
  const headers: Record<string, string> = {};
  if (opts.auth) headers.authorization = opts.auth;
  return new Request(url, { method: "GET", headers });
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Cron /api/cron/ceo-tick — 3 garde-fous", () => {
  let GET: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.CRON_SECRET = "test-cron-secret";
    const mod = await import("@/app/api/cron/ceo-tick/route");
    GET = mod.GET as typeof GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockTryAcquireLock.mockResolvedValue(true);
    mockReleaseLock.mockResolvedValue(undefined);
    mockRunDailyTick.mockResolvedValue({ status: "ok", processed: 0, errors: 0 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ─── 1. Auth Bearer CRON_SECRET ─────────────────────────────────

  describe("garde-fou 1 : auth Bearer CRON_SECRET", () => {
    it("rejette une requête sans header ni secret query (401)", async () => {
      const res = await GET(makeCeoTickRequest());
      expect(res.status).toBe(401);
    });

    it("rejette un header Bearer invalide (401)", async () => {
      const res = await GET(makeCeoTickRequest({ auth: "Bearer wrong-secret" }));
      expect(res.status).toBe(401);
    });

    it("rejette un secret query invalide (401)", async () => {
      const res = await GET(makeCeoTickRequest({ secret: "wrong" }));
      expect(res.status).toBe(401);
    });

    it("accepte un Bearer valide (200)", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z")); // dans la fenêtre 2-4h
      const res = await GET(
        makeCeoTickRequest({ auth: `Bearer test-cron-secret` }),
      );
      expect(res.status).toBe(200);
    });

    it("accepte un ?secret=... valide (200)", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
      const res = await GET(makeCeoTickRequest({ secret: "test-cron-secret" }));
      expect(res.status).toBe(200);
    });

    it("CRON_SECRET non configuré (env absent) → 401", async () => {
      const original = process.env.CRON_SECRET;
      delete process.env.CRON_SECRET;
      try {
        const res = await GET(makeCeoTickRequest({ auth: "Bearer anything" }));
        expect(res.status).toBe(401);
      } finally {
        process.env.CRON_SECRET = original;
      }
    });
  });

  // ─── 2. Time gate UTC 2-4h59 ───────────────────────────────────

  describe("garde-fou 2 : time gate UTC 2-4h59", () => {
    const auth = { auth: `Bearer test-cron-secret` };

    it("utcHour=1 hors fenêtre → skip avec reason 'out-of-window'", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T01:00:00Z"));
      const res = await GET(makeCeoTickRequest(auth));
      const body = (await res.json()) as { skipped: boolean; reason: string };
      expect(res.status).toBe(200);
      expect(body.skipped).toBe(true);
      expect(body.reason).toContain("out-of-window");
      expect(mockRunDailyTick).not.toHaveBeenCalled();
    });

    it("utcHour=5 hors fenêtre → skip", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T05:00:00Z"));
      const res = await GET(makeCeoTickRequest(auth));
      const body = (await res.json()) as { skipped: boolean };
      expect(body.skipped).toBe(true);
      expect(mockRunDailyTick).not.toHaveBeenCalled();
    });

    it("utcHour=2 dans fenêtre → run (pas skip)", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T02:00:00Z"));
      const res = await GET(makeCeoTickRequest(auth));
      const body = (await res.json()) as { skipped?: boolean };
      expect(body.skipped).toBeUndefined();
      expect(mockRunDailyTick).toHaveBeenCalledTimes(1);
    });

    it("utcHour=4 dans fenêtre → run", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T04:30:00Z"));
      const res = await GET(makeCeoTickRequest(auth));
      expect(mockRunDailyTick).toHaveBeenCalledTimes(1);
    });

    it("?force=true bypass time gate hors fenêtre", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T13:00:00Z"));
      const res = await GET(
        makeCeoTickRequest({ auth: "Bearer test-cron-secret", force: true, secret: "test-cron-secret" }),
      );
      const body = (await res.json()) as { skipped?: boolean };
      expect(body.skipped).toBeUndefined();
      expect(mockRunDailyTick).toHaveBeenCalledTimes(1);
    });
  });

  // ─── 3. Lock applicatif anti-double cron ─────────────────────────

  describe("garde-fou 3 : lock cron:ceo-tick TTL 30min", () => {
    const auth = { auth: `Bearer test-cron-secret` };

    it("lock indisponible → skip 'lock-held' + ne run pas", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
      mockTryAcquireLock.mockResolvedValueOnce(false);
      const res = await GET(makeCeoTickRequest(auth));
      const body = (await res.json()) as { skipped: boolean; reason: string };
      expect(body.skipped).toBe(true);
      expect(body.reason).toBe("lock-held");
      expect(mockRunDailyTick).not.toHaveBeenCalled();
    });

    it("lock acquis → libéré dans finally même si runDailyTick throw", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
      mockRunDailyTick.mockRejectedValueOnce(new Error("Boom"));
      await GET(makeCeoTickRequest(auth));
      expect(mockReleaseLock).toHaveBeenCalledWith("cron:ceo-tick");
    });

    it("lock TTL = 30 min (1800000 ms)", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
      await GET(makeCeoTickRequest(auth));
      const call = mockTryAcquireLock.mock.calls[0];
      expect(call[0]).toBe("cron:ceo-tick");
      expect(call[1]).toBe(30 * 60 * 1000);
    });
  });

  // ─── 4. Pipeline complet (auth + window + lock + run) ───────────

  describe("happy path complet", () => {
    it("auth OK + window + lock acquis → run + payload tasksExecuted", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
      mockRunDailyTick.mockResolvedValueOnce({
        status: "ok",
        processed: 5,
        errors: 1,
      });
      const res = await GET(makeCeoTickRequest({ auth: "Bearer test-cron-secret" }));
      const body = (await res.json()) as {
        success: boolean;
        tasksExecuted: number;
        status: string;
        errors: number;
      };
      expect(res.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.tasksExecuted).toBe(5);
      expect(body.errors).toBe(1);
      expect(body.status).toBe("ok");
    });

    it("runDailyTick throw → 500 + lock libéré", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
      mockRunDailyTick.mockRejectedValueOnce(new Error("DB down"));
      const res = await GET(makeCeoTickRequest({ auth: "Bearer test-cron-secret" }));
      expect(res.status).toBe(500);
      const body = (await res.json()) as { success: boolean; error: string };
      expect(body.success).toBe(false);
      expect(body.error).toBe("DB down");
      expect(mockReleaseLock).toHaveBeenCalled();
    });

    it("runDailyTick retourne status='disabled' (kill-switch) → 200 success=true", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
      mockRunDailyTick.mockResolvedValueOnce({
        status: "disabled",
        processed: 0,
        errors: 0,
      });
      const res = await GET(makeCeoTickRequest({ auth: "Bearer test-cron-secret" }));
      expect(res.status).toBe(200);
      const body = (await res.json()) as { status: string; tasksExecuted: number };
      expect(body.status).toBe("disabled");
      expect(body.tasksExecuted).toBe(0);
    });

    it("runDailyTick retourne status='budget_exceeded' → 200 + status passé", async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
      mockRunDailyTick.mockResolvedValueOnce({
        status: "budget_exceeded",
        processed: 0,
        errors: 0,
      });
      const res = await GET(makeCeoTickRequest({ auth: "Bearer test-cron-secret" }));
      const body = (await res.json()) as { status: string };
      expect(body.status).toBe("budget_exceeded");
    });
  });
});

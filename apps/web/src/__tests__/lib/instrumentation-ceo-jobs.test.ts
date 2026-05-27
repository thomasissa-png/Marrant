/**
 * Tests — instrumentation.ts : jobs CEO (s10).
 *
 * Couvre les 2 jobs CEO du scheduler interne :
 *  - runCeoTickJob       : time gate 2-4h UTC + court-circuit kill-switch + lock
 *  - runCeoKpisJob       : time gate 5h UTC + court-circuit kill-switch + lock
 *
 * Note s10 : le back-fill décryptage des vannes (ancien job 6h UTC IA) a été
 * RETIRÉ du scheduler. Les décryptages pré-rédigés sont appliqués au boot via
 * applyJokeDecryptagesTask (cf. startup-tasks.test.ts) — sans IA, instantané.
 *
 * Même approche que instrumentation.test.ts : on reproduit la logique time gate
 * exacte des jobs (non exportés) pour la tester sans exécuter `setInterval`.
 * On vérifie le triple verrou anti coûts x8 : time gate, kill-switch, lock.
 */

// ─── Mocks ───────────────────────────────────────────────────────────

const mockEnsureCeoConfig = jest.fn();
const mockSnapshotCeoKpis = jest.fn().mockResolvedValue(undefined);
const mockTryAcquireLock = jest.fn();
const mockReleaseLock = jest.fn().mockResolvedValue(undefined);
const mockFetch = jest.fn();

jest.mock("@/lib/ai/ceo-helpers", () => ({
  ensureCeoConfig: () => mockEnsureCeoConfig(),
  snapshotCeoKpis: () => mockSnapshotCeoKpis(),
}));

jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: (k: string, ttl: number) => mockTryAcquireLock(k, ttl),
  releaseLock: (k: string) => mockReleaseLock(k),
  buildJobLockKey: (name: string) => `${name}-key`,
}));

import { ensureCeoConfig, snapshotCeoKpis } from "@/lib/ai/ceo-helpers";
import { tryAcquireLock, releaseLock, buildJobLockKey } from "@/lib/job-lock";

// ─── Réimplémentation fidèle des jobs (cf. instrumentation.ts) ───────

async function simulateRunCeoTickJob() {
  const now = new Date();
  const utcHour = now.getUTCHours();
  if (utcHour < 2 || utcHour > 4) return;

  const cfg = await ensureCeoConfig();
  if (!cfg.enabled) return;

  const lockKey = buildJobLockKey("scheduler-ceo-tick", now);
  const lockAcquired = await tryAcquireLock(lockKey, 15 * 60 * 1000);
  if (!lockAcquired) return;
  try {
    const PORT = process.env.PORT || "3000";
    const secret = process.env.CRON_SECRET;
    if (!secret) return;
    await mockFetch(`http://127.0.0.1:${PORT}/api/cron/ceo-tick?secret=${secret}`);
  } finally {
    await releaseLock(lockKey);
  }
}

async function simulateRunCeoKpisJob() {
  const now = new Date();
  if (now.getUTCHours() !== 5) return;

  const cfg = await ensureCeoConfig();
  if (!cfg.enabled) return;

  const lockKey = buildJobLockKey("scheduler-ceo-kpis", now);
  const lockAcquired = await tryAcquireLock(lockKey, 10 * 60 * 1000);
  if (!lockAcquired) return;
  try {
    await snapshotCeoKpis();
  } finally {
    await releaseLock(lockKey);
  }
}

beforeEach(() => {
  jest.clearAllMocks();
  mockReleaseLock.mockResolvedValue(undefined);
  process.env.CRON_SECRET = "test-secret";
});

afterEach(() => {
  jest.useRealTimers();
});

describe("runCeoTickJob — time gate + kill-switch + lock", () => {
  it("NE FAIT RIEN à 0h UTC (hors fenêtre 2-4h)", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T00:30:00Z"));
    await simulateRunCeoTickJob();
    expect(mockEnsureCeoConfig).not.toHaveBeenCalled();
    expect(mockTryAcquireLock).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("NE FAIT RIEN à 5h UTC (hors fenêtre — après 4h)", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T05:00:00Z"));
    await simulateRunCeoTickJob();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("COURT-CIRCUITE si CEO désactivé (pas de lock, pas de fetch, 0 coût)", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
    mockEnsureCeoConfig.mockResolvedValueOnce({ enabled: false });
    await simulateRunCeoTickJob();
    expect(mockEnsureCeoConfig).toHaveBeenCalledTimes(1);
    expect(mockTryAcquireLock).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("DÉCLENCHE le fetch si CEO activé, dans la fenêtre, lock acquis", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
    mockEnsureCeoConfig.mockResolvedValueOnce({ enabled: true });
    mockTryAcquireLock.mockResolvedValueOnce(true);
    mockFetch.mockResolvedValueOnce({ ok: true });
    await simulateRunCeoTickJob();
    expect(mockTryAcquireLock).toHaveBeenCalledWith("scheduler-ceo-tick-key", 15 * 60 * 1000);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/cron/ceo-tick?secret=test-secret",
    );
    expect(mockReleaseLock).toHaveBeenCalled();
  });

  it("SKIPPE si le lock est déjà détenu", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T03:00:00Z"));
    mockEnsureCeoConfig.mockResolvedValueOnce({ enabled: true });
    mockTryAcquireLock.mockResolvedValueOnce(false);
    await simulateRunCeoTickJob();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe("runCeoKpisJob — time gate 5h + kill-switch + lock", () => {
  it("NE FAIT RIEN à 4h UTC (hors fenêtre)", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T04:00:00Z"));
    await simulateRunCeoKpisJob();
    expect(mockEnsureCeoConfig).not.toHaveBeenCalled();
    expect(mockSnapshotCeoKpis).not.toHaveBeenCalled();
  });

  it("COURT-CIRCUITE si CEO désactivé", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T05:00:00Z"));
    mockEnsureCeoConfig.mockResolvedValueOnce({ enabled: false });
    await simulateRunCeoKpisJob();
    expect(mockTryAcquireLock).not.toHaveBeenCalled();
    expect(mockSnapshotCeoKpis).not.toHaveBeenCalled();
  });

  it("SNAPSHOT si CEO activé à 5h UTC avec lock acquis", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-07T05:00:00Z"));
    mockEnsureCeoConfig.mockResolvedValueOnce({ enabled: true });
    mockTryAcquireLock.mockResolvedValueOnce(true);
    await simulateRunCeoKpisJob();
    expect(mockSnapshotCeoKpis).toHaveBeenCalledTimes(1);
    expect(mockReleaseLock).toHaveBeenCalled();
  });
});

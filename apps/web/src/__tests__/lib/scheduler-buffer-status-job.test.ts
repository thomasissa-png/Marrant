/**
 * @jest-environment node
 *
 * Job planifié de relecture des statuts Buffer (src/lib/scheduler/jobs.ts) :
 * Buffer non configuré → rien ; verrou horaire non relâché → 1 passage/heure.
 */
const tryAcquireLock = jest.fn();
const releaseLock = jest.fn();
jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: (...a: unknown[]) => tryAcquireLock(...a),
  releaseLock: (...a: unknown[]) => releaseLock(...a),
  buildJobLockKey: (name: string, d: Date) => `${name}-${d.toISOString().slice(0, 10)}`,
}));
const isBufferConfigured = jest.fn();
jest.mock("@/lib/social/buffer-client", () => ({ isBufferConfigured: () => isBufferConfigured() }));
const runBufferStatusCheck = jest.fn();
jest.mock("@/lib/social/buffer-status-check", () => ({
  runBufferStatusCheck: (...a: unknown[]) => runBufferStatusCheck(...a),
}));

import { createSchedulerJobs } from "@/lib/scheduler/jobs";

const { runBufferStatusCheckJob } = createSchedulerJobs(jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
  isBufferConfigured.mockReturnValue(true);
  tryAcquireLock.mockResolvedValue(true);
  runBufferStatusCheck.mockResolvedValue({ candidates: 0, confirmed: 0, failed: 0, unchanged: 0, alerted: [] });
  jest.useFakeTimers({ now: new Date("2026-10-05T14:20:00Z") });
});
afterEach(() => jest.useRealTimers());

describe("runBufferStatusCheckJob", () => {
  it("Buffer non configuré : rien, pas de verrou", async () => {
    isBufferConfigured.mockReturnValue(false);
    await runBufferStatusCheckJob();
    expect(tryAcquireLock).not.toHaveBeenCalled();
    expect(runBufferStatusCheck).not.toHaveBeenCalled();
  });

  it("verrou horaire (55 min) pris puis conservé, relecture lancée", async () => {
    await runBufferStatusCheckJob();
    expect(tryAcquireLock).toHaveBeenCalledWith("buffer-status-check-2026-10-05-h14", 55 * 60 * 1000);
    expect(runBufferStatusCheck).toHaveBeenCalledTimes(1);
    expect(releaseLock).not.toHaveBeenCalled();
  });

  it("verrou déjà pris dans l'heure : aucune relecture", async () => {
    tryAcquireLock.mockResolvedValue(false);
    await runBufferStatusCheckJob();
    expect(runBufferStatusCheck).not.toHaveBeenCalled();
  });

  it("erreur de relecture : ne lève pas", async () => {
    runBufferStatusCheck.mockRejectedValue(new Error("DB froide"));
    await expect(runBufferStatusCheckJob()).resolves.toBeUndefined();
  });
});

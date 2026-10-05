/**
 * @jest-environment node
 *
 * Job planifié de couverture de la file sociale (src/lib/scheduler/jobs.ts) :
 * time gate 5h-21h UTC, verrou horaire non relâché (1 passage par heure).
 */
const tryAcquireLock = jest.fn();
const releaseLock = jest.fn();
jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: (...a: unknown[]) => tryAcquireLock(...a),
  releaseLock: (...a: unknown[]) => releaseLock(...a),
  buildJobLockKey: (name: string, d: Date) => `${name}-${d.toISOString().slice(0, 10)}`,
}));
jest.mock("@/lib/prisma", () => ({ prisma: { marqueur: "prisma" } }));
const runCouvertureSociale = jest.fn();
jest.mock("@/lib/social/couverture", () => ({
  runCouvertureSociale: (...a: unknown[]) => runCouvertureSociale(...a),
}));
const sendDailyPublishFailureAlert = jest.fn();
jest.mock("@/lib/social/publish-failure", () => ({ sendDailyPublishFailureAlert }));

import { createSchedulerJobs } from "@/lib/scheduler/jobs";

const { runCouvertureSocialeJob } = createSchedulerJobs(jest.fn());
const vide = { pauses: [], fileBasse: [], tranchesEnRetard: [], stock: 20, lancement: null, alertes: [] };

beforeEach(() => {
  jest.clearAllMocks();
  tryAcquireLock.mockResolvedValue(true);
  runCouvertureSociale.mockResolvedValue(vide);
});
afterEach(() => jest.useRealTimers());

describe("runCouvertureSocialeJob", () => {
  it("hors fenêtre (3h UTC) : rien, pas de verrou", async () => {
    jest.useFakeTimers({ now: new Date("2026-10-20T03:10:00Z") });
    await runCouvertureSocialeJob();
    expect(tryAcquireLock).not.toHaveBeenCalled();
    expect(runCouvertureSociale).not.toHaveBeenCalled();
  });

  it("verrou horaire (55 min) pris puis conservé, couverture lancée avec l'envoi d'alerte quotidien", async () => {
    jest.useFakeTimers({ now: new Date("2026-10-20T14:20:00Z") });
    await runCouvertureSocialeJob();
    expect(tryAcquireLock).toHaveBeenCalledWith("social-couverture-2026-10-20-h14", 55 * 60 * 1000);
    expect(runCouvertureSociale).toHaveBeenCalledWith({ marqueur: "prisma" }, sendDailyPublishFailureAlert, expect.any(Date));
    expect(releaseLock).not.toHaveBeenCalled();
  });

  it("verrou déjà pris dans l'heure : rien", async () => {
    jest.useFakeTimers({ now: new Date("2026-10-20T14:40:00Z") });
    tryAcquireLock.mockResolvedValue(false);
    await runCouvertureSocialeJob();
    expect(runCouvertureSociale).not.toHaveBeenCalled();
  });

  it("erreur : ne lève pas", async () => {
    jest.useFakeTimers({ now: new Date("2026-10-20T14:20:00Z") });
    runCouvertureSociale.mockRejectedValue(new Error("DB froide"));
    await expect(runCouvertureSocialeJob()).resolves.toBeUndefined();
  });
});

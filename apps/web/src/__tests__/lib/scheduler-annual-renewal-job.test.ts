/**
 * @jest-environment node
 *
 * Job planifié du rappel légal de l'annuel (src/lib/scheduler/jobs.ts) :
 * fenêtre 8h UTC, verrou, délégation à runAnnualRenewalReminders avec le
 * mailer transactionnel et le lien de gestion du profil.
 */
const tryAcquireLock = jest.fn();
const releaseLock = jest.fn();
jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: (...a: unknown[]) => tryAcquireLock(...a),
  releaseLock: (...a: unknown[]) => releaseLock(...a),
  buildJobLockKey: (name: string) => `${name}:key`,
}));
jest.mock("@/lib/prisma", () => ({ prisma: { tag: "prisma" } }));
const sendTransactionalTextEmail = jest.fn();
jest.mock("@/lib/email", () => ({ sendTransactionalTextEmail }));
const runAnnualRenewalReminders = jest.fn();
jest.mock("@/lib/billing/annual-renewal-reminders", () => ({
  runAnnualRenewalReminders: (...a: unknown[]) => runAnnualRenewalReminders(...a),
}));

import { createSchedulerJobs } from "@/lib/scheduler/jobs";

const { runAnnualRenewalReminderJob } = createSchedulerJobs(jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
  tryAcquireLock.mockResolvedValue(true);
  runAnnualRenewalReminders.mockResolvedValue({ candidates: 0, sent: 0, skipped: 0, failed: 0 });
  process.env.NEXTAUTH_URL = "https://deviens-marrant.fr";
});
afterEach(() => jest.useRealTimers());

describe("runAnnualRenewalReminderJob", () => {
  it.each(["2026-10-04T07:59:00Z", "2026-10-04T09:00:00Z", "2026-10-04T02:00:00Z"])(
    "hors fenêtre (%s) : rien, pas de verrou",
    async (iso) => {
      jest.useFakeTimers({ now: new Date(iso) });
      await runAnnualRenewalReminderJob();
      expect(tryAcquireLock).not.toHaveBeenCalled();
      expect(runAnnualRenewalReminders).not.toHaveBeenCalled();
    },
  );

  it("8h UTC : verrou, envoi via le mailer transactionnel, verrou relâché", async () => {
    jest.useFakeTimers({ now: new Date("2026-10-04T08:15:00Z") });
    await runAnnualRenewalReminderJob();
    expect(tryAcquireLock).toHaveBeenCalledWith("annual-renewal-reminders:key", 10 * 60 * 1000);
    expect(runAnnualRenewalReminders).toHaveBeenCalledWith(expect.any(Date), {
      prisma: { tag: "prisma" },
      sendEmail: expect.any(Function),
      manageUrl: "https://deviens-marrant.fr/profil",
    });
    expect(releaseLock).toHaveBeenCalledWith("annual-renewal-reminders:key");
    // s16 : le mailer reçoit le type « rappel-annuel » (clé d'alerte email-envoi-rappel-annuel).
    const { sendEmail } = runAnnualRenewalReminders.mock.calls[0][1];
    await sendEmail("a@b.fr", "Objet", "Texte");
    expect(sendTransactionalTextEmail).toHaveBeenCalledWith("a@b.fr", "Objet", "Texte", "rappel-annuel");
  });

  it("verrou déjà pris : aucun traitement", async () => {
    jest.useFakeTimers({ now: new Date("2026-10-04T08:15:00Z") });
    tryAcquireLock.mockResolvedValue(false);
    await runAnnualRenewalReminderJob();
    expect(runAnnualRenewalReminders).not.toHaveBeenCalled();
  });

  it("erreur interne : journalisée, ne casse pas le tick, verrou relâché", async () => {
    jest.useFakeTimers({ now: new Date("2026-10-04T08:15:00Z") });
    runAnnualRenewalReminders.mockRejectedValue(new Error("db down"));
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(runAnnualRenewalReminderJob()).resolves.toBeUndefined();
    expect(releaseLock).toHaveBeenCalled();
    spy.mockRestore();
  });
});

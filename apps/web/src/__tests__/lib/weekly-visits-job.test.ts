/**
 * @jest-environment node
 *
 * Rapport hebdomadaire des visites : orchestration (secrets absents, dryRun,
 * envoi), fenêtre lundi 7h Paris + verrou hebdomadaire anti-doublon,
 * délégation par le scheduler, route admin manuelle. fetch mocké.
 */
const tryAcquireLock = jest.fn();
const releaseLock = jest.fn();
jest.mock("@/lib/job-lock", () => ({
  tryAcquireLock: (...a: unknown[]) => tryAcquireLock(...a),
  releaseLock: (...a: unknown[]) => releaseLock(...a),
}));
const userCount = jest.fn();
const subscriptionCount = jest.fn();
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { count: (...a: unknown[]) => userCount(...a) },
    subscription: { count: (...a: unknown[]) => subscriptionCount(...a) },
  },
}));
const sendAdminHtmlEmail = jest.fn();
jest.mock("@/lib/email", () => ({ sendAdminHtmlEmail: (...a: unknown[]) => sendAdminHtmlEmail(...a) }));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/visits-report/route";
import {
  WEEKLY_VISITS_LOCK_TTL_MS,
  runScheduledWeeklyVisitsReport,
  runWeeklyVisitsReport,
} from "@/lib/analytics/weekly-visits-job";
import { createSchedulerJobs } from "@/lib/scheduler/jobs";
import {
  MONDAY_7H_PARIS,
  TEST_UMAMI_KEY,
  WEEK_START_2809,
  clearUmamiEnv,
  installUmamiFetch,
  setUmamiEnv,
} from "../helpers/umami-fetch-mock";

const fixture = {
  currentStartAt: WEEK_START_2809,
  statsCurrent: { pageviews: 300, visitors: 121, visits: 140, bounces: 70, totaltime: 7000 },
  statsPrevious: { pageviews: { value: 250 }, visitors: { value: 100 }, visits: { value: 120 }, bounces: { value: 60 }, totaltime: { value: 6000 } },
};

let fetchMock: jest.Mock;
let warn: jest.SpyInstance;
let error: jest.SpyInstance;

beforeEach(() => {
  jest.clearAllMocks();
  setUmamiEnv();
  fetchMock = installUmamiFetch(fixture);
  tryAcquireLock.mockResolvedValue(true);
  userCount.mockResolvedValue(4);
  subscriptionCount.mockResolvedValue(1);
  sendAdminHtmlEmail.mockResolvedValue(undefined);
  warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  error = jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  clearUmamiEnv();
  jest.restoreAllMocks();
});

const SUBJECT = "Visites deviens-marrant.fr : semaine du 28/09 au 04/10 (+21 %)";

describe("runWeeklyVisitsReport", () => {
  it("secrets absents : ne fait rien et le signale", async () => {
    clearUmamiEnv();
    await expect(runWeeklyVisitsReport({ now: MONDAY_7H_PARIS })).resolves.toEqual({
      status: "skipped",
      reason: "umami-not-configured",
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendAdminHtmlEmail).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("UMAMI_API_KEY ou UMAMI_WEBSITE_ID absent"));
  });

  it("dryRun : rapport renvoyé, aucun email", async () => {
    const res = await runWeeklyVisitsReport({ now: MONDAY_7H_PARIS, dryRun: true });
    expect(res.status).toBe("dry-run");
    expect(res).toMatchObject({ subject: SUBJECT, report: { current: { signups: 4, newPremium: 1 } } });
    expect(sendAdminHtmlEmail).not.toHaveBeenCalled();
  });

  it("conversions lues en base sur la fenêtre de la semaine", async () => {
    await runWeeklyVisitsReport({ now: MONDAY_7H_PARIS, dryRun: true });
    const range = { gte: new Date(WEEK_START_2809), lte: new Date(Date.parse("2026-10-04T21:59:59.999Z")) };
    expect(userCount).toHaveBeenCalledWith({ where: { createdAt: range } });
    expect(subscriptionCount).toHaveBeenCalledWith({ where: { plan: "PREMIUM", createdAt: range } });
  });

  it("envoi : objet + HTML via le mailer existant", async () => {
    const res = await runWeeklyVisitsReport({ now: MONDAY_7H_PARIS });
    expect(res.status).toBe("sent");
    expect(sendAdminHtmlEmail).toHaveBeenCalledWith(SUBJECT, expect.stringContaining("Visites par jour"));
  });
});

describe("runScheduledWeeklyVisitsReport (fenêtre + verrou hebdomadaire)", () => {
  it.each([
    ["lundi 8h Paris", "2026-10-05T06:00:00Z"],
    ["lundi 6h45 Paris", "2026-10-05T04:45:00Z"],
    ["dimanche 7h Paris", "2026-10-04T05:15:00Z"],
    ["mardi 7h Paris", "2026-10-06T05:15:00Z"],
  ])("hors fenêtre (%s) : rien, pas de verrou", async (_l, iso) => {
    await runScheduledWeeklyVisitsReport(new Date(iso));
    expect(tryAcquireLock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("lundi 7h Paris en heure d'hiver (6h UTC) : dans la fenêtre", async () => {
    await runScheduledWeeklyVisitsReport(new Date("2026-11-02T06:30:00Z"));
    expect(tryAcquireLock).toHaveBeenCalledWith("weekly-visits-report-2026-11-02", WEEKLY_VISITS_LOCK_TTL_MS);
  });

  it("lundi 7h Paris : verrou de la semaine, envoi, verrou conservé", async () => {
    await runScheduledWeeklyVisitsReport(MONDAY_7H_PARIS);
    expect(tryAcquireLock).toHaveBeenCalledWith("weekly-visits-report-2026-10-05", 6 * 24 * 3600 * 1000);
    expect(sendAdminHtmlEmail).toHaveBeenCalledTimes(1);
    expect(releaseLock).not.toHaveBeenCalled();
  });

  it("tick suivant de la même semaine : verrou déjà pris, aucun doublon", async () => {
    tryAcquireLock.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    await runScheduledWeeklyVisitsReport(MONDAY_7H_PARIS);
    await runScheduledWeeklyVisitsReport(new Date("2026-10-05T05:30:00Z"));
    expect(tryAcquireLock.mock.calls[1][0]).toBe("weekly-visits-report-2026-10-05");
    expect(sendAdminHtmlEmail).toHaveBeenCalledTimes(1);
  });

  it("échec (Umami ou email) : journalisé sans la clé, verrou relâché pour retenter", async () => {
    sendAdminHtmlEmail.mockRejectedValueOnce(new Error("Resend : quota"));
    await expect(runScheduledWeeklyVisitsReport(MONDAY_7H_PARIS)).resolves.toBeUndefined();
    expect(releaseLock).toHaveBeenCalledWith("weekly-visits-report-2026-10-05");
    expect(error).toHaveBeenCalledWith("[weekly-visits] Échec : Resend : quota");
    const logged = JSON.stringify([...error.mock.calls, ...warn.mock.calls]);
    expect(logged).not.toContain(TEST_UMAMI_KEY);
  });

  it("secrets absents : avertissement, pas de verrou", async () => {
    clearUmamiEnv();
    await runScheduledWeeklyVisitsReport(MONDAY_7H_PARIS);
    expect(tryAcquireLock).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("rapport du lundi ignoré"));
  });
});

describe("scheduler", () => {
  afterEach(() => jest.useRealTimers());

  it("runWeeklyVisitsReportJob délègue au job (lundi 7h Paris)", async () => {
    jest.useFakeTimers({ now: MONDAY_7H_PARIS, doNotFake: ["nextTick", "setImmediate"] });
    const { runWeeklyVisitsReportJob } = createSchedulerJobs(jest.fn());
    await runWeeklyVisitsReportJob();
    expect(tryAcquireLock).toHaveBeenCalledWith("weekly-visits-report-2026-10-05", WEEKLY_VISITS_LOCK_TTL_MS);
    expect(sendAdminHtmlEmail).toHaveBeenCalledTimes(1);
  });
});

describe("route POST /api/admin/visits-report", () => {
  const call = (query = "", auth = "Bearer secret-admin") =>
    POST(new NextRequest(`https://deviens-marrant.fr/api/admin/visits-report${query}`, {
      method: "POST",
      headers: { authorization: auth },
    }));

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "secret-admin";
  });
  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it("sans le bon Bearer : 401", async () => {
    expect((await call("?dryRun=1", "Bearer nope")).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ADMIN_PASSWORD absent : 500", async () => {
    delete process.env.ADMIN_PASSWORD;
    expect((await call("?dryRun=1")).status).toBe(500);
  });

  it("?dryRun=1 : JSON du rapport, aucun email", async () => {
    const res = await call("?dryRun=1");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ success: true, status: "dry-run", subject: expect.stringContaining("semaine du") });
    expect(body.report.byDay).toHaveLength(7);
    expect(sendAdminHtmlEmail).not.toHaveBeenCalled();
  });

  it("sans dryRun : envoi de l'email", async () => {
    const res = await call();
    expect((await res.json()).status).toBe("sent");
    expect(sendAdminHtmlEmail).toHaveBeenCalledTimes(1);
  });

  it("secrets absents : 503 ; Umami en erreur : 502 ; email en erreur : 500", async () => {
    clearUmamiEnv();
    expect((await call("?dryRun=1")).status).toBe(503);
    setUmamiEnv();
    global.fetch = jest.fn(async () => new Response("", { status: 500 })) as unknown as typeof fetch;
    const res = await call("?dryRun=1");
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain(TEST_UMAMI_KEY);
    installUmamiFetch(fixture);
    sendAdminHtmlEmail.mockRejectedValueOnce(new Error("boom"));
    expect((await call()).status).toBe(500);
  });
});

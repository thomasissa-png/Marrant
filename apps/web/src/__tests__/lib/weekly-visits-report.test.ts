/**
 * @jest-environment node
 *
 * Rapport hebdomadaire des visites : client Umami (deux formes de réponse,
 * erreurs, timeout, secrets), calendrier Paris, variations (division par
 * zéro), agrégats et email. fetch mocké : aucun appel à l'API réelle.
 */
import {
  UmamiError,
  fetchUmamiStats,
  getUmamiConfig,
  readMetricValue,
} from "@/lib/analytics/umami";
import { computeReportPeriods, parisWeekKey, pctChange } from "@/lib/analytics/weekly-visits-period";
import { buildWeeklyVisitsReport } from "@/lib/analytics/weekly-visits-report";
import {
  buildWeeklyVisitsHtml,
  buildWeeklyVisitsSubject,
  formatChange,
  formatDuration,
} from "@/lib/analytics/weekly-visits-email";
import {
  MONDAY_7H_PARIS,
  TEST_UMAMI_KEY,
  TEST_WEBSITE_ID,
  WEEK_START_2809,
  clearUmamiEnv,
  installUmamiFetch,
  setUmamiEnv,
} from "../helpers/umami-fetch-mock";

const config = { apiKey: TEST_UMAMI_KEY, websiteId: TEST_WEBSITE_ID };
const conversions = jest.fn(async (start: Date) =>
  start.getTime() === WEEK_START_2809 ? { signups: 6, newPremium: 2 } : { signups: 3, newPremium: 0 },
);

const fixture = {
  currentStartAt: WEEK_START_2809,
  // Forme récente : { value }.
  statsCurrent: {
    pageviews: { value: 400 },
    visitors: { value: 121 },
    visits: { value: 150 },
    bounces: { value: 60 },
    totaltime: { value: 15000 },
  },
  // Forme ancienne : valeurs directes.
  statsPrevious: { pageviews: 320, visitors: 100, visits: 125, bounces: 75, totaltime: 10000 },
  pageviews: {
    pageviews: [
      { x: "2026-09-28 00:00:00", y: 80 },
      { x: "2026-10-04 00:00:00", y: 40 },
    ],
    sessions: [
      { x: "2026-09-28 00:00:00", y: 30 },
      { x: "2026-10-04 00:00:00", y: 12 },
    ],
  },
  urls: [
    { x: "/", y: 120 },
    { x: "/vannes", y: 80 },
    { x: "/blog/a", y: 30 },
    { x: "/blog/b", y: 20 },
    { x: "/abonnement", y: 10 },
    { x: "/trop", y: 1 },
  ],
  referrers: [
    { x: "", y: 50 },
    { x: "google.com", y: 40 },
    { x: "<script>x</script>", y: 2 },
  ],
};

afterEach(() => {
  clearUmamiEnv();
  jest.restoreAllMocks();
});

describe("client Umami", () => {
  it("secrets absents ou placeholder : configuration nulle", () => {
    clearUmamiEnv();
    expect(getUmamiConfig()).toBeNull();
    process.env.UMAMI_API_KEY = "...";
    process.env.UMAMI_WEBSITE_ID = "xxxxxxxx-xxxx";
    expect(getUmamiConfig()).toBeNull();
    setUmamiEnv();
    expect(getUmamiConfig()).toEqual(config);
  });

  it("lit les deux formes de valeur", () => {
    expect(readMetricValue({ value: 12 })).toBe(12);
    expect(readMetricValue(7)).toBe(7);
    expect(readMetricValue(undefined)).toBe(0);
    expect(readMetricValue({ value: "x" })).toBe(0);
  });

  it("envoie la clé en header, pas dans l'URL, avec un timeout", async () => {
    const fetchMock = installUmamiFetch(fixture);
    const stats = await fetchUmamiStats(config, WEEK_START_2809, WEEK_START_2809 + 1000);
    expect(stats).toEqual({ pageviews: 400, visitors: 121, visits: 150, bounces: 60, totaltime: 15000 });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      `https://api.umami.is/v1/websites/${TEST_WEBSITE_ID}/stats?startAt=${WEEK_START_2809}&endAt=${WEEK_START_2809 + 1000}`,
    );
    expect(url).not.toContain(TEST_UMAMI_KEY);
    expect((init.headers as Record<string, string>)["x-umami-api-key"]).toBe(TEST_UMAMI_KEY);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("HTTP en erreur : UmamiError propre, sans la clé", async () => {
    global.fetch = jest.fn(async () => new Response("nope", { status: 401 })) as unknown as typeof fetch;
    const err = await fetchUmamiStats(config, 0, 1).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(UmamiError);
    expect((err as UmamiError).status).toBe(401);
    expect((err as Error).message).toBe("Umami stats : HTTP 401");
    expect((err as Error).message).not.toContain(TEST_UMAMI_KEY);
  });

  it("timeout et réseau : messages explicites", async () => {
    const timeout = new Error("t");
    timeout.name = "TimeoutError";
    global.fetch = jest.fn().mockRejectedValueOnce(timeout).mockRejectedValueOnce(new TypeError("fetch failed"));
    await expect(fetchUmamiStats(config, 0, 1)).rejects.toThrow("délai de 5000 ms dépassé");
    await expect(fetchUmamiStats(config, 0, 1)).rejects.toThrow("réseau indisponible");
  });

  it("réponse non JSON : UmamiError", async () => {
    global.fetch = jest.fn(async () => new Response("<html>", { status: 200 })) as unknown as typeof fetch;
    await expect(fetchUmamiStats(config, 0, 1)).rejects.toThrow("réponse non JSON");
  });
});

describe("calendrier et variations", () => {
  it("lundi 7h Paris : semaine du lundi 28/09 au dimanche 04/10, et la précédente", () => {
    const p = computeReportPeriods(MONDAY_7H_PARIS);
    expect(p.current).toEqual({
      startAt: WEEK_START_2809,
      endAt: Date.parse("2026-10-04T21:59:59.999Z"),
      label: "semaine du 28/09 au 04/10",
    });
    expect(p.previous.label).toBe("semaine du 21/09 au 27/09");
    expect(p.previous.endAt).toBe(WEEK_START_2809 - 1);
    expect(p.days).toEqual([
      "2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04",
    ]);
  });

  it("passage à l'heure d'hiver (25/10) : bornes à minuit Paris", () => {
    const p = computeReportPeriods(new Date("2026-10-26T06:15:00Z"));
    expect(p.current.startAt).toBe(Date.parse("2026-10-18T22:00:00Z"));
    expect(p.current.endAt).toBe(Date.parse("2026-10-25T22:59:59.999Z"));
  });

  it("clé de semaine = lundi heure de Paris", () => {
    expect(parisWeekKey(MONDAY_7H_PARIS)).toBe("2026-10-05");
    expect(parisWeekKey(new Date("2026-10-11T21:30:00Z"))).toBe("2026-10-05");
    expect(parisWeekKey(new Date("2026-10-11T22:30:00Z"))).toBe("2026-10-12");
  });

  it("variation en % et division par zéro", () => {
    expect(pctChange(121, 100)).toBe(21);
    expect(pctChange(40, 50)).toBe(-20);
    expect(pctChange(0, 0)).toBe(0);
    expect(pctChange(5, 0)).toBeNull();
    expect(formatChange(null)).toBe("nouveau");
    expect(formatChange(21)).toBe("+21 %");
    expect(formatChange(-4.4)).toBe("-4 %");
    expect(formatChange(0.2)).toBe("0 %");
    expect(formatChange(-20, "pts")).toBe("-20 pts");
    expect(formatDuration(100)).toBe("1 min 40 s");
    expect(formatDuration(42)).toBe("42 s");
  });
});

describe("buildWeeklyVisitsReport + email", () => {
  it("agrège stats, jours, tops et conversions", async () => {
    installUmamiFetch(fixture);
    const r = await buildWeeklyVisitsReport(MONDAY_7H_PARIS, config, conversions);
    expect(r.current).toMatchObject({ visitors: 121, visits: 150, pageviews: 400, bounceRate: 40, avgVisitSeconds: 100, signups: 6, newPremium: 2 });
    expect(r.previous).toMatchObject({ visitors: 100, visits: 125, pageviews: 320, bounceRate: 60, avgVisitSeconds: 80, signups: 3, newPremium: 0 });
    expect(r.changes).toEqual({ visitors: 21, visits: 20, pageviews: 25, bounceRate: -20, avgVisitSeconds: 25, signups: 100, newPremium: null });
    expect(r.byDay[0]).toEqual({ date: "2026-09-28", weekday: "lundi", visits: 30, pageviews: 80 });
    expect(r.byDay[6]).toEqual({ date: "2026-10-04", weekday: "dimanche", visits: 12, pageviews: 40 });
    expect(r.byDay[3].visits).toBe(0);
    expect(r.topPages).toHaveLength(5);
    expect(r.topSources[0]).toEqual({ source: "Accès direct", visitors: 50 });
    expect(r.signupRate).toBe(5);

    expect(buildWeeklyVisitsSubject(r)).toBe("Visites deviens-marrant.fr : semaine du 28/09 au 04/10 (+21 %)");
    const html = buildWeeklyVisitsHtml(r);
    expect(html).toContain("Top 5 des pages");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("—");
    expect(html).toContain("name=\"viewport\"");
  });

  it("semaine précédente vide : pas de % dans l'objet, « nouveau » dans le corps", async () => {
    installUmamiFetch({ ...fixture, statsPrevious: {}, pageviews: {}, urls: {}, referrers: null });
    const r = await buildWeeklyVisitsReport(MONDAY_7H_PARIS, config, async () => ({ signups: 0, newPremium: 0 }));
    expect(r.changes.visitors).toBeNull();
    expect(r.previous.bounceRate).toBe(0);
    expect(buildWeeklyVisitsSubject(r)).toBe("Visites deviens-marrant.fr : semaine du 28/09 au 04/10");
    const html = buildWeeklyVisitsHtml(r);
    expect(html).toContain("nouveau");
    expect(html).toContain("Aucune donnée cette semaine.");
  });
});

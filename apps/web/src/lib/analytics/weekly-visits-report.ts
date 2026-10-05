/**
 * Rapport hebdomadaire des visites (Umami) relié aux conversions (base).
 * Calcul pur à partir des clients injectés : testable sans réseau ni base.
 */
import {
  fetchUmamiMetrics,
  fetchUmamiPageviews,
  fetchUmamiStats,
  type UmamiConfig,
  type UmamiStats,
} from "./umami";
import { PARIS_TZ, computeReportPeriods, pctChange, type ReportWindow } from "./weekly-visits-period";

export type WeekMetrics = {
  visitors: number;
  visits: number;
  pageviews: number;
  /** Taux de rebond en %, arrondi au dixième. */
  bounceRate: number;
  /** Temps moyen par visite, en secondes entières. */
  avgVisitSeconds: number;
  signups: number;
  newPremium: number;
};

export type MetricKey = keyof WeekMetrics;

export type WeeklyVisitsReport = {
  current: WeekMetrics & { label: string; startAt: number; endAt: number };
  previous: WeekMetrics & { label: string; startAt: number; endAt: number };
  /** Variation en % (null = semaine précédente à zéro) ; taux de rebond en points. */
  changes: Record<MetricKey, number | null>;
  byDay: { date: string; weekday: string; visits: number; pageviews: number }[];
  topPages: { path: string; views: number }[];
  topSources: { source: string; visitors: number }[];
  /** Inscriptions / visiteurs de la semaine, en %. null si aucun visiteur. */
  signupRate: number | null;
};

/** Compteurs de conversion lus en base, injectés (Prisma en production). */
export type ConversionCounter = (startAt: Date, endAt: Date) => Promise<{ signups: number; newPremium: number }>;

const WEEKDAY_FR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

const round1 = (n: number) => Math.round(n * 10) / 10;

function toWeek(stats: UmamiStats, conv: { signups: number; newPremium: number }): WeekMetrics {
  return {
    visitors: stats.visitors,
    visits: stats.visits,
    pageviews: stats.pageviews,
    bounceRate: stats.visits > 0 ? round1((stats.bounces / stats.visits) * 100) : 0,
    avgVisitSeconds: stats.visits > 0 ? Math.round(stats.totaltime / stats.visits) : 0,
    ...conv,
  };
}

async function loadWeek(config: UmamiConfig, w: ReportWindow, countConversions: ConversionCounter) {
  const [stats, conv] = await Promise.all([
    fetchUmamiStats(config, w.startAt, w.endAt),
    countConversions(new Date(w.startAt), new Date(w.endAt)),
  ]);
  return { ...toWeek(stats, conv), label: w.label, startAt: w.startAt, endAt: w.endAt };
}

export async function buildWeeklyVisitsReport(
  now: Date,
  config: UmamiConfig,
  countConversions: ConversionCounter,
): Promise<WeeklyVisitsReport> {
  const periods = computeReportPeriods(now);
  const { startAt, endAt } = periods.current;
  const [current, previous, series, pages, sources] = await Promise.all([
    loadWeek(config, periods.current, countConversions),
    loadWeek(config, periods.previous, countConversions),
    fetchUmamiPageviews(config, startAt, endAt, PARIS_TZ),
    fetchUmamiMetrics(config, startAt, endAt, "url", 5),
    fetchUmamiMetrics(config, startAt, endAt, "referrer", 5),
  ]);

  const keys: MetricKey[] = ["visitors", "visits", "pageviews", "bounceRate", "avgVisitSeconds", "signups", "newPremium"];
  const changes = Object.fromEntries(
    keys.map((k) => [k, k === "bounceRate" ? round1(current[k] - previous[k]) : pctChange(current[k], previous[k])]),
  ) as Record<MetricKey, number | null>;

  const sumByDay = (points: { x: string; y: number }[]) => {
    const map = new Map<string, number>();
    for (const p of points) map.set(p.x.slice(0, 10), (map.get(p.x.slice(0, 10)) ?? 0) + p.y);
    return map;
  };
  const visitsMap = sumByDay(series.sessions);
  const viewsMap = sumByDay(series.pageviews);
  const byDay = periods.days.map((date) => ({
    date,
    weekday: WEEKDAY_FR[new Date(`${date}T12:00:00Z`).getUTCDay()],
    visits: visitsMap.get(date) ?? 0,
    pageviews: viewsMap.get(date) ?? 0,
  }));

  return {
    current,
    previous,
    changes,
    byDay,
    topPages: pages.slice(0, 5).map((p) => ({ path: p.x || "/", views: p.y })),
    topSources: sources.slice(0, 5).map((p) => ({ source: p.x || "Accès direct", visitors: p.y })),
    signupRate: current.visitors > 0 ? round1((current.signups / current.visitors) * 100) : null,
  };
}

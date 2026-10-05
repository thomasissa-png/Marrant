/**
 * Calendrier du rapport hebdomadaire des visites, en heure de Paris (gère
 * l'heure d'été via Intl, disponible sous Node comme sous Workers).
 */

export const PARIS_TZ = "Europe/Paris";

export type ParisParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 1 = lundi … 7 = dimanche. */
  weekday: number;
};

const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: PARIS_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
  hourCycle: "h23",
});

export function parisParts(date: Date): ParisParts {
  const parts = Object.fromEntries(formatter.formatToParts(date).map((p) => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    weekday: WEEKDAYS[parts.weekday] ?? 0,
  };
}

/** Instant UTC (ms) de minuit heure de Paris pour une date civile (jour hors bornes accepté). */
export function parisMidnightUtc(year: number, month: number, day: number): number {
  const guess = Date.UTC(year, month - 1, day);
  const p = parisParts(new Date(guess));
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - guess;
  return guess - offset;
}

export type ReportWindow = { startAt: number; endAt: number; label: string };
export type ReportPeriods = { current: ReportWindow; previous: ReportWindow; days: string[] };

function ddmm(ms: number): string {
  const p = parisParts(new Date(ms));
  return `${String(p.day).padStart(2, "0")}/${String(p.month).padStart(2, "0")}`;
}

function isoDay(ms: number): string {
  const p = parisParts(new Date(ms));
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

/**
 * Les 7 derniers jours complets (heure de Paris) avant `now`, et les 7 jours
 * précédents. Un lundi : semaine du lundi au dimanche écoulés.
 */
export function computeReportPeriods(now: Date): ReportPeriods {
  const { year, month, day } = parisParts(now);
  const midnight = (offsetDays: number) => parisMidnightUtc(year, month, day + offsetDays);
  const window = (fromDays: number, toDays: number): ReportWindow => {
    const startAt = midnight(fromDays);
    const endAt = midnight(toDays) - 1;
    return { startAt, endAt, label: `semaine du ${ddmm(startAt)} au ${ddmm(endAt)}` };
  };
  const days = Array.from({ length: 7 }, (_, i) => isoDay(midnight(-7 + i)));
  return { current: window(-7, 0), previous: window(-14, -7), days };
}

/** Variation en % arrondie au dixième ; null si la base est nulle (division par zéro). */
export function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/** Clé de semaine (date du lundi, heure de Paris) pour le verrou anti-doublon. */
export function parisWeekKey(now: Date): string {
  const p = parisParts(now);
  return isoDay(parisMidnightUtc(p.year, p.month, p.day - (p.weekday - 1)));
}

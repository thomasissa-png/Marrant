/**
 * Dates et heures de Paris pour la file sociale (heure d'été / d'hiver gérées
 * par Intl, sans dépendance). Dates au format AAAA-MM-JJ.
 */
const FORMAT_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
});
const FORMAT_HEURE = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

/** Date de Paris (AAAA-MM-JJ) d'un instant. */
export function dateParis(d: Date): string {
  return FORMAT_DATE.format(d);
}

/** Instant UTC d'une date et d'une heure de Paris. */
export function parisVersUtc(date: string, h: number, m: number): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, m);
  const parts = FORMAT_HEURE.formatToParts(new Date(guess));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const wall = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(guess - (wall - guess));
}

export function ajouterJours(date: string, n: number): string {
  const t = new Date(`${date}T12:00:00Z`);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}

/** 0 = dimanche … 6 = samedi. */
export function jourSemaine(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

/** Lundi de la semaine d'une date. */
export function lundiDe(date: string): string {
  const j = jourSemaine(date);
  return ajouterJours(date, j === 0 ? -6 : 1 - j);
}

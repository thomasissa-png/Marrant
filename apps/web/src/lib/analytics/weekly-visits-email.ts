/**
 * Email interne du rapport hebdomadaire des visites : objet + HTML simple,
 * lisible sur mobile (une colonne, tableaux 100 %), en français.
 */
import type { MetricKey, WeeklyVisitsReport } from "./weekly-visits-report";

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/** « +21 % », « -4 % », « 0 % », « nouveau » (base nulle). */
export function formatChange(change: number | null, unit = "%"): string {
  if (change === null) return "nouveau";
  const rounded = unit === "%" ? Math.round(change) : Math.round(change * 10) / 10;
  if (rounded === 0) return `0 ${unit}`;
  return `${rounded > 0 ? "+" : "-"}${nf.format(Math.abs(rounded))} ${unit}`;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}

export function buildWeeklyVisitsSubject(report: WeeklyVisitsReport): string {
  const change = report.changes.visitors;
  const suffix = change === null ? "" : ` (${formatChange(change)})`;
  return `Visites deviens-marrant.fr : ${report.current.label}${suffix}`;
}

type Row = { key: MetricKey; label: string; format: (n: number) => string; lowerIsBetter?: boolean; unit?: string };

const ROWS: Row[] = [
  { key: "visitors", label: "Visiteurs", format: nf.format },
  { key: "visits", label: "Visites", format: nf.format },
  { key: "pageviews", label: "Pages vues", format: nf.format },
  { key: "bounceRate", label: "Taux de rebond", format: (n) => `${nf.format(n)} %`, lowerIsBetter: true, unit: "pts" },
  { key: "avgVisitSeconds", label: "Temps moyen par visite", format: formatDuration },
  { key: "signups", label: "Inscriptions", format: nf.format },
  { key: "newPremium", label: "Nouveaux Premium", format: nf.format },
];

const TD = "padding:8px 6px;border-bottom:1px solid #eee;";
const TD_NUM = `${TD}text-align:right;white-space:nowrap;`;
const H3 = "font-size:16px;margin:24px 0 8px;color:#7c3aed;";

function changeCell(change: number | null, row: Row): string {
  const good = change !== null && (row.lowerIsBetter ? change < 0 : change > 0);
  const bad = change !== null && (row.lowerIsBetter ? change > 0 : change < 0);
  const color = good ? "#15803d" : bad ? "#dc2626" : "#666";
  return `<td style="${TD_NUM}color:${color};font-weight:600;">${formatChange(change, row.unit)}</td>`;
}

function listTable(title: string, head: string, rows: [string, number][]): string {
  const body = rows.length
    ? rows
        .map(([k, v]) => `<tr><td style="${TD}word-break:break-all;">${escapeHtml(k)}</td><td style="${TD_NUM}">${nf.format(v)}</td></tr>`)
        .join("")
    : `<tr><td style="${TD}color:#666;" colspan="2">Aucune donnée cette semaine.</td></tr>`;
  return `<h3 style="${H3}">${title}</h3><table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;"><tr><th style="${TD}text-align:left;color:#666;font-weight:500;">${head}</th><th style="${TD_NUM}color:#666;font-weight:500;">Nombre</th></tr>${body}</table>`;
}

export function buildWeeklyVisitsHtml(report: WeeklyVisitsReport): string {
  const { current, previous, changes } = report;
  const metrics = ROWS.map(
    (r) =>
      `<tr><td style="${TD}">${r.label}</td><td style="${TD_NUM}font-weight:600;">${r.format(current[r.key])}</td><td style="${TD_NUM}color:#666;">${r.format(previous[r.key])}</td>${changeCell(changes[r.key], r)}</tr>`,
  ).join("");

  const maxVisits = Math.max(1, ...report.byDay.map((d) => d.visits));
  const days = report.byDay
    .map((d) => {
      const width = Math.round((d.visits / maxVisits) * 100);
      return `<tr><td style="${TD}text-transform:capitalize;width:90px;">${d.weekday}</td><td style="${TD}"><div style="background:#ede9fe;border-radius:4px;"><div style="background:#7c3aed;height:10px;border-radius:4px;width:${width}%;"></div></div></td><td style="${TD_NUM}width:48px;">${nf.format(d.visits)}</td></tr>`;
    })
    .join("");

  const rate =
    report.signupRate === null
      ? "pas de visiteur cette semaine"
      : `${nf.format(report.signupRate)} % des visiteurs se sont inscrits`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:16px;color:#1a1a1a;">
  <h2 style="font-size:20px;margin:0 0 4px;">Visites de la ${escapeHtml(current.label)}</h2>
  <p style="font-size:13px;color:#666;margin:0 0 16px;">Comparée à la ${escapeHtml(previous.label)}. Heure de Paris.</p>
  <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><th style="${TD}text-align:left;color:#666;font-weight:500;">Indicateur</th><th style="${TD_NUM}color:#666;font-weight:500;">Semaine</th><th style="${TD_NUM}color:#666;font-weight:500;">Préc.</th><th style="${TD_NUM}color:#666;font-weight:500;">Évol.</th></tr>
    ${metrics}
  </table>
  <p style="font-size:13px;color:#666;margin:8px 0 0;">Conversion : ${rate}. Taux de rebond comparé en points.</p>
  <h3 style="${H3}">Visites par jour</h3>
  <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">${days}</table>
  ${listTable("Top 5 des pages", "Page", report.topPages.map((p) => [p.path, p.views]))}
  ${listTable("Top 5 des sources", "Source", report.topSources.map((s) => [s.source, s.visitors]))}
  <p style="font-size:12px;color:#999;margin-top:24px;">Rapport automatique du lundi, données Umami et base Marrant.</p>
</body>
</html>`;
}

/**
 * Onglet « Semaine » : visites et blog, à partir du MÊME objet que l'e-mail du
 * lundi (`WeeklyVisitsReport`). Mise en forme seulement, aucun calcul.
 */
import type { WeeklyVisitsReport, MetricKey } from "@/lib/analytics/weekly-visits-report";
import type { BlogArticleRow } from "@/lib/analytics/weekly-blog-report";
import { formatChange, formatDuration } from "@/lib/analytics/weekly-visits-email";
import { Avertissement, Note, Section, fmt } from "./admin-ui";

const LIGNES: { key: MetricKey; label: string; format: (n: number) => string; lowerIsBetter?: boolean; unit?: string }[] = [
  { key: "visitors", label: "Visiteurs", format: fmt },
  { key: "visits", label: "Visites", format: fmt },
  { key: "pageviews", label: "Pages vues", format: fmt },
  { key: "bounceRate", label: "Taux de rebond", format: (n) => `${fmt(n)} %`, lowerIsBetter: true, unit: "pts" },
  { key: "avgVisitSeconds", label: "Temps moyen par visite", format: formatDuration },
  { key: "signups", label: "Inscriptions (comptes)", format: fmt },
  { key: "newPremium", label: "Nouveaux Premium", format: fmt },
];

function couleur(change: number | null, lowerIsBetter?: boolean) {
  if (change === null || change === 0) return "text-text-muted";
  return (lowerIsBetter ? change < 0 : change > 0) ? "text-success" : "text-error";
}

const TH = "px-2 py-2 text-right text-xs font-medium text-text-muted";

export function SemaineVisites({ visites, erreur }: { visites: WeeklyVisitsReport | null; erreur: string | null }) {
  if (!visites) {
    return (
      <Section titre="Visites" sousTitre="Umami">
        <Avertissement>Visites indisponibles : {erreur ?? "donnée absente"}. Les sections lues en base restent affichées.</Avertissement>
      </Section>
    );
  }
  const max = Math.max(1, ...visites.byDay.map((d) => d.visits));
  return (
    <Section titre="Visites" sousTitre={`Comparée à la ${visites.previous.label}. Umami, heure de Paris.`}>
      <div className="overflow-x-auto rounded-lg border border-border bg-background-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Indicateur</th>
              <th className={TH}>Semaine</th>
              <th className={TH}>Préc.</th>
              <th className={`${TH} pr-3`}>Évol.</th>
            </tr>
          </thead>
          <tbody>
            {LIGNES.map((l) => (
              <tr key={l.key} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-2 text-text-secondary">{l.label}</td>
                <td className="whitespace-nowrap px-2 py-2 text-right font-semibold tabular-nums">{l.format(visites.current[l.key])}</td>
                <td className="whitespace-nowrap px-2 py-2 text-right tabular-nums text-text-muted">{l.format(visites.previous[l.key])}</td>
                <td className={`whitespace-nowrap px-2 py-2 pr-3 text-right font-semibold tabular-nums ${couleur(visites.changes[l.key], l.lowerIsBetter)}`}>
                  {formatChange(visites.changes[l.key], l.unit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        Conversion : {visites.signupRate === null ? "pas de visiteur cette semaine" : `${fmt(visites.signupRate)} % des visiteurs se sont inscrits`}.
      </Note>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background-card p-3">
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Visites par jour</h3>
          <ul className="space-y-1.5">
            {visites.byDay.map((d) => (
              <li key={d.date} className="flex items-center gap-2 text-xs">
                <span className="w-16 capitalize text-text-muted">{d.weekday}</span>
                <span className="h-2 flex-1 rounded bg-accent-primary/15">
                  <span className="block h-2 rounded bg-accent-primary" style={{ width: `${Math.round((d.visits / max) * 100)}%` }} />
                </span>
                <span className="w-8 text-right tabular-nums text-text-primary">{fmt(d.visits)}</span>
              </li>
            ))}
          </ul>
        </div>
        <Top titre="Top 5 des pages" lignes={visites.topPages.map((p) => [p.path, p.views])} />
        <Top titre="Top 5 des sources" lignes={visites.topSources.map((s) => [s.source, s.visitors])} />
      </div>
    </Section>
  );
}

function Top({ titre, lignes }: { titre: string; lignes: [string, number][] }) {
  return (
    <div className="rounded-lg border border-border bg-background-card p-3">
      <h3 className="mb-2 text-sm font-semibold text-text-primary">{titre}</h3>
      {lignes.length === 0 ? (
        <Note>Aucune donnée cette semaine.</Note>
      ) : (
        <ul className="space-y-1 text-xs">
          {lignes.map(([k, v]) => (
            <li key={k} className="flex justify-between gap-2">
              <span className="min-w-0 break-all text-text-secondary">{k}</span>
              <span className="tabular-nums text-text-primary">{fmt(v)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ligneArticle(a: BlogArticleRow): string {
  if (a.status === "scheduled") return a.publishedLabel;
  if (!("views" in a)) return a.status === "missing" ? "absent de la base" : "non publié, date non planifiée";
  const vues = a.views.current === null ? "vues n.d." : `${fmt(a.views.current)} vues`;
  const tendance = a.views.current !== null && a.views.previous !== null ? ` (${formatChange(a.views.change)})` : "";
  const lu = a.readRate === null ? "n.d." : `${fmt(a.readRate)} %`;
  return `${vues}${tendance}, ${fmt(a.exits)} sorties, ${fmt(a.ctas)} CTA, ${fmt(a.shares)} partages, lu à 75 % : ${lu}`;
}

export function SemaineBlog({ visites }: { visites: WeeklyVisitsReport | null }) {
  if (!visites) return null;
  const blog = visites.blog;
  const evenements = [
    ...blog.events.filter((e) => !(blog.scrollSteps && e.name === "blog-scroll")).map((e) => ({ ...e })),
    ...(blog.scrollSteps ?? []).map((s) => ({ label: `Lecture ${s.palier} %`, ...s })),
  ];
  return (
    <Section titre="Blog" sousTitre="Articles à forte frappe, Umami et base">
      {blog.partial && <Avertissement>Section partielle : {blog.warnings.join(" ; ")}.</Avertissement>}
      <div className="overflow-x-auto rounded-lg border border-border bg-background-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left text-xs font-medium text-text-muted">Événement</th>
              <th className={TH}>Semaine</th>
              <th className={TH}>Préc.</th>
              <th className={`${TH} pr-3`}>Évol.</th>
            </tr>
          </thead>
          <tbody>
            {evenements.map((e) => (
              <tr key={e.label} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-2 text-text-secondary">{e.label}</td>
                <td className="px-2 py-2 text-right font-semibold tabular-nums">{fmt(e.current)}</td>
                <td className="px-2 py-2 text-right tabular-nums text-text-muted">{fmt(e.previous)}</td>
                <td className={`px-2 py-2 pr-3 text-right font-semibold tabular-nums ${couleur(e.change)}`}>
                  {e.current === null || e.previous === null ? "n.d." : formatChange(e.change)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 rounded-lg border border-border bg-background-card p-3 text-sm">
        {blog.articles.map((a) => (
          <li key={a.slug}>
            <p className="break-all font-medium text-text-primary">{a.slug}</p>
            <p className="text-xs text-text-muted">{ligneArticle(a)}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

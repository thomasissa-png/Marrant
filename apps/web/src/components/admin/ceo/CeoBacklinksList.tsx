"use client";

/**
 * CeoBacklinksList — pipeline backlinks (PITCHED / REPLIED / ACQUIRED / REJECTED).
 * Filtre par status, tri par DA desc.
 */

import { useMemo, useState } from "react";
import type { CeoBacklinkDto } from "./types";

interface CeoBacklinksListProps {
  backlinks: CeoBacklinkDto[];
}

const STATUS_STYLES: Record<string, string> = {
  PITCHED: "bg-warning/20 text-warning",
  REPLIED: "bg-blue-400/20 text-blue-400",
  ACQUIRED: "bg-success/20 text-success",
  REJECTED: "bg-error/20 text-error",
};

export function CeoBacklinksList({ backlinks }: CeoBacklinksListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"da" | "recent">("da");

  const filtered = useMemo(() => {
    const base = backlinks.filter((b) => statusFilter === "ALL" || b.status === statusFilter);
    return [...base].sort((a, b) => {
      if (sortBy === "da") return (b.da ?? 0) - (a.da ?? 0);
      return new Date(b.pitchedAt).getTime() - new Date(a.pitchedAt).getTime();
    });
  }, [backlinks, statusFilter, sortBy]);

  const totalDa = backlinks
    .filter((b) => b.status === "ACQUIRED")
    .reduce((sum, b) => sum + (b.da ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard label="Total" value={backlinks.length} />
        <SummaryCard
          label="Pitchés"
          value={backlinks.filter((b) => b.status === "PITCHED").length}
          color="text-warning"
        />
        <SummaryCard
          label="Acquis"
          value={backlinks.filter((b) => b.status === "ACQUIRED").length}
          color="text-success"
        />
        <SummaryCard label="DA cumulé acquis" value={totalDa} color="text-accent-primary" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PITCHED">Pitchés</option>
          <option value="REPLIED">Réponses reçues</option>
          <option value="ACQUIRED">Acquis</option>
          <option value="REJECTED">Refusés</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "da" | "recent")}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="da">Tri : DA décroissant</option>
          <option value="recent">Tri : plus récents</option>
        </select>

        <span className="ml-auto text-sm text-text-muted">
          {filtered.length} backlink{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-background-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-elevated text-left">
              <th className="px-4 py-3 font-semibold text-text-primary">Domaine</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Source</th>
              <th className="px-4 py-3 font-semibold text-text-primary">DA</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Statut</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Pitch</th>
              <th className="px-4 py-3 font-semibold text-text-primary">URL</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-muted">
                  Aucun backlink — l&apos;agent n&apos;a pas encore prospecté ou les filtres masquent tout.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-background-elevated/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text-primary">{b.domain}</p>
                    {b.pageTitle && (
                      <p className="max-w-[280px] truncate text-xs text-text-muted">
                        {b.pageTitle}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">{b.source}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {b.da != null ? b.da : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status] ?? "bg-background-elevated text-text-muted"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {b.daysSincePitched}j ({new Date(b.pitchedAt).toLocaleDateString("fr-FR")})
                  </td>
                  <td className="px-4 py-3">
                    {b.url ? (
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent-primary hover:underline"
                      >
                        Ouvrir ↗
                      </a>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background-card p-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${color ?? "text-text-primary"}`}>
        {value}
      </p>
    </div>
  );
}

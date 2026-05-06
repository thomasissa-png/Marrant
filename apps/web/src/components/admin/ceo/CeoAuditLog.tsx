"use client";

/**
 * CeoAuditLog — derniers 100 logs CeoAuditLog (RGPD art. 30, rétention 3 ans).
 * Filtre par action + outcome. Format compact + expand pour le reasoning.
 */

import { useMemo, useState } from "react";
import type { CeoAuditLogDto } from "./types";

interface CeoAuditLogProps {
  logs: CeoAuditLogDto[];
}

const OUTCOME_STYLES: Record<string, string> = {
  sent: "bg-success/20 text-success",
  draft: "bg-blue-400/20 text-blue-400",
  rejected: "bg-error/20 text-error",
  error: "bg-error/20 text-error",
  skipped: "bg-background-elevated text-text-muted",
};

export function CeoAuditLog({ logs }: CeoAuditLogProps) {
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const actions = useMemo(
    () => Array.from(new Set(logs.map((l) => l.action))).sort(),
    [logs]
  );
  const outcomes = useMemo(
    () => Array.from(new Set(logs.map((l) => l.outcome))).sort(),
    [logs]
  );

  const filtered = logs.filter(
    (l) =>
      (actionFilter === "ALL" || l.action === actionFilter) &&
      (outcomeFilter === "ALL" || l.outcome === outcomeFilter)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="ALL">Toutes les actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="ALL">Tous les résultats</option>
          {outcomes.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <span className="ml-auto text-xs text-text-muted">
          {filtered.length} entrée{filtered.length > 1 ? "s" : ""} — rétention 3 ans (art. 30 RGPD)
        </span>
      </div>

      <div className="rounded-lg border border-border bg-background-card">
        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-text-muted">
            Pas d&apos;entrées d&apos;audit pour ces filtres.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((log) => {
              const expanded = expandedId === log.id;
              return (
                <li key={log.id} className="px-4 py-2">
                  <button
                    onClick={() => setExpandedId(expanded ? null : log.id)}
                    className="flex w-full flex-wrap items-center gap-2 text-left"
                  >
                    <span className="font-mono text-[10px] text-text-muted">
                      {new Date(log.timestamp).toLocaleString("fr-FR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit",
                      })}
                    </span>
                    <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs font-medium text-text-secondary">
                      {log.action}
                    </span>
                    <span className="text-xs text-text-muted">{log.targetType}</span>
                    <span className="text-xs text-text-muted">·</span>
                    <span className="text-xs text-text-muted">{log.channel}</span>
                    {log.aiModel && (
                      <span className="text-[10px] text-text-muted">{log.aiModel}</span>
                    )}
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${OUTCOME_STYLES[log.outcome] ?? "bg-background-elevated text-text-muted"}`}>
                      {log.outcome}
                    </span>
                  </button>
                  {expanded && (
                    <div className="mt-2 space-y-1 rounded-md bg-background-elevated px-3 py-2 text-xs">
                      {log.reasoning ? (
                        <p className="text-text-secondary">
                          <span className="font-semibold">Raisonnement :</span> {log.reasoning}
                        </p>
                      ) : (
                        <p className="italic text-text-muted">Pas de raisonnement enregistré.</p>
                      )}
                      {log.aiDecisionScore != null && (
                        <p className="text-text-muted">
                          Score IA : {log.aiDecisionScore}/10
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

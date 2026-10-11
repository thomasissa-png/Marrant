"use client";

/**
 * CeoTasksList — file des tâches CeoTask.
 * Filtre par status + type, bouton "Forcer l'exécution" pour fast-track une tâche.
 */

import { useMemo, useState } from "react";
import type { CeoTaskDto } from "./types";

interface CeoTasksListProps {
  tasks: CeoTaskDto[];
  onChange: () => void;
  getAuthHeader: () => Record<string, string>;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning/20 text-warning",
  RUNNING: "bg-blue-400/20 text-blue-400",
  DONE: "bg-success/20 text-success",
  FAILED: "bg-error/20 text-error",
};

export function CeoTasksList({ tasks, onChange, getAuthHeader }: CeoTasksListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const types = useMemo(() => Array.from(new Set(tasks.map((t) => t.type))).sort(), [tasks]);

  const filtered = tasks.filter(
    (t) =>
      (statusFilter === "ALL" || t.status === statusFilter) &&
      (typeFilter === "ALL" || t.type === typeFilter)
  );

  const forceRun = async (taskId: string) => {
    if (!window.confirm("Forcer l'exécution de cette tâche au prochain tick ?")) return;
    setBusyId(taskId);
    try {
      const res = await fetch("/api/admin/ceo/run-task", {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) onChange();
      else alert("Erreur — tâche non rejouée");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="RUNNING">En cours</option>
          <option value="DONE">Terminées</option>
          <option value="FAILED">Échouées</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="ALL">Tous les types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <span className="ml-auto text-sm text-text-muted">
          {filtered.length} / {tasks.length} tâche{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-background-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-elevated text-left">
              <th className="px-4 py-3 font-semibold text-text-primary">Type</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Statut</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Prévue</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Tentatives</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Détail</th>
              <th className="px-4 py-3 font-semibold text-text-primary"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-muted">
                  Aucune tâche ne correspond — la file est vide ou les filtres sont trop stricts.
                </td>
              </tr>
            ) : (
              filtered.map((task) => (
                <tr key={task.id} className="border-b border-border last:border-0 hover:bg-background-elevated/50">
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{task.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status] ?? "bg-background-elevated text-text-muted"}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted">
                    {new Date(task.scheduledFor).toLocaleString("fr-FR", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className={task.attempts >= 3 ? "text-error" : "text-text-muted"}>
                      {task.attempts}/3
                    </span>
                  </td>
                  <td className="max-w-[300px] truncate px-4 py-3 text-xs text-text-secondary" title={task.payloadSummary}>
                    {task.errorMessage ? (
                      <span className="text-error">{task.errorMessage.slice(0, 80)}</span>
                    ) : (
                      task.payloadSummary
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {(task.status === "PENDING" || task.status === "FAILED") && (
                      <button
                        onClick={() => forceRun(task.id)}
                        disabled={busyId === task.id}
                        className="rounded-md bg-accent-primary/20 px-2 py-1 text-xs font-medium text-accent-primary transition-colors hover:bg-accent-primary/30 disabled:opacity-50"
                      >
                        {busyId === task.id ? "..." : "Forcer"}
                      </button>
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

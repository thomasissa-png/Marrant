"use client";

/**
 * CeoDraftsList — messages CEO en attente de validation humaine
 * (status PENDING ou requiresHumanReview = true).
 * Actions : approuver / rejeter / contester (art. 22 RGPD).
 */

import { useState } from "react";
import type { CeoDraftDto } from "./types";

interface CeoDraftsListProps {
  drafts: CeoDraftDto[];
  onChange: () => void;
  getAuthHeader: () => Record<string, string>;
}

const CHANNEL_LABELS: Record<string, string> = {
  EMAIL: "Email",
  TWITTER: "Twitter/X",
  LINKEDIN: "LinkedIn",
  INSTAGRAM: "Instagram",
};

export function CeoDraftsList({ drafts, onChange, getAuthHeader }: CeoDraftsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const action = async (
    endpoint: "approve" | "reject" | "contest",
    messageId: string,
    extra?: Record<string, unknown>
  ) => {
    setBusyId(messageId);
    try {
      const res = await fetch(`/api/admin/ceo/${endpoint}`, {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, ...extra }),
      });
      if (res.ok) onChange();
      else alert(`Erreur — action "${endpoint}" non appliquée`);
    } finally {
      setBusyId(null);
    }
  };

  const onApprove = (id: string) => {
    if (!window.confirm("Approuver ce message ? Il sera envoyé au prochain tick.")) return;
    action("approve", id);
  };

  const onReject = (id: string) => {
    const reason = window.prompt("Raison du rejet (audit) :");
    if (!reason) return;
    action("reject", id, { reason });
  };

  if (drafts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-background-card p-12 text-center text-text-muted">
        Rien à valider — l&apos;agent gère seul ou les drafts ont déjà été traités.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-text-primary">
          {drafts.length} message{drafts.length > 1 ? "s" : ""} à valider
        </h2>
      </div>

      {drafts.map((d) => {
        const expanded = expandedId === d.id;
        const truncated = d.content.length > 200;
        return (
          <div key={d.id} className="rounded-lg border border-border bg-background-card p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs font-medium text-text-muted">
                {CHANNEL_LABELS[d.channel] ?? d.channel}
              </span>
              {d.playbook && (
                <span className="rounded-full bg-accent-primary/15 px-2 py-0.5 text-xs font-medium text-accent-primary">
                  {d.playbook}
                </span>
              )}
              <span className="text-xs text-text-muted truncate max-w-[200px]">
                → {d.recipient}
              </span>
              {d.directorScore != null && (
                <span className={`text-xs ${d.directorScore >= 7 ? "text-success" : "text-warning"}`}>
                  Director: {d.directorScore}/10
                </span>
              )}
              {d.requiresHumanReview && (
                <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
                  Review humaine requise
                </span>
              )}
              <span className="ml-auto text-xs text-text-muted">
                {new Date(d.createdAt).toLocaleString("fr-FR", {
                  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                })}
              </span>
            </div>

            {d.subject && (
              <p className="mb-1 text-sm font-semibold text-accent-primary">
                Objet : {d.subject}
              </p>
            )}

            <p className="whitespace-pre-wrap text-sm text-text-secondary">
              {expanded || !truncated ? d.content : `${d.content.slice(0, 200)}…`}
            </p>

            {truncated && (
              <button
                onClick={() => setExpandedId(expanded ? null : d.id)}
                className="mt-1 text-xs text-accent-primary hover:underline"
              >
                {expanded ? "Réduire" : "Voir tout"}
              </button>
            )}

            {d.directorNote && (
              <p className="mt-2 rounded bg-background-elevated px-2 py-1 text-xs italic text-text-muted">
                Note directeur : {d.directorNote}
              </p>
            )}

            <div className="mt-3 flex gap-2 border-t border-border pt-3">
              <button
                onClick={() => onApprove(d.id)}
                disabled={busyId === d.id}
                className="rounded-md bg-success/20 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/30 disabled:opacity-50"
              >
                Approuver
              </button>
              <button
                onClick={() => onReject(d.id)}
                disabled={busyId === d.id}
                className="rounded-md bg-error/20 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/30 disabled:opacity-50"
              >
                Rejeter
              </button>
              <button
                onClick={() => action("contest", d.id)}
                disabled={busyId === d.id}
                className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-background-elevated disabled:opacity-50"
                title="Contester (art. 22 RGPD) — bloque l'envoi et trace l'opposition"
              >
                Contester
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

/**
 * CeoHeader — bandeau sticky du dashboard CEO.
 * Affiche : kill-switch (toggle), budget jour consommé, dernier tick, prochain tick.
 */

import { useState } from "react";
import type { CeoConfigDto, CeoKpiSnapshotDto } from "./types";

interface CeoHeaderProps {
  config: CeoConfigDto | null;
  lastSnapshot: CeoKpiSnapshotDto | null;
  onChange: () => void;
  getAuthHeader: () => Record<string, string>;
}

export function CeoHeader({ config, onChange, getAuthHeader }: CeoHeaderProps) {
  const [busy, setBusy] = useState(false);
  const enabled = config?.enabled ?? false;
  const dailyBudget = config?.dailyBudgetEur ?? 4;

  const toggleKillSwitch = async () => {
    const willDisable = enabled;
    const reason = willDisable
      ? window.prompt("Raison de la coupure (audit RGPD) :")
      : null;
    if (willDisable && !reason) return;
    if (!window.confirm(willDisable ? "Couper l'agent CEO maintenant ?" : "Réactiver l'agent CEO ?")) return;

    setBusy(true);
    try {
      const res = await fetch("/api/admin/ceo/kill-switch", {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled, reason }),
      });
      if (res.ok) onChange();
      else alert("Erreur — kill-switch non modifié");
    } finally {
      setBusy(false);
    }
  };

  const statusBadge = enabled
    ? "bg-success/20 text-success"
    : "bg-error/20 text-error";

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-2 flex flex-wrap items-center gap-4 border-b border-border bg-background-card px-4 py-3 md:-mx-8 md:px-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          CEO — pilotage
        </h1>
        <p className="text-xs text-text-muted">
          Agent autonome — tick toutes les 4h
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Statut</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge}`}>
            {enabled ? "ACTIF" : "COUPÉ"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Budget/j</span>
          <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs font-medium text-text-secondary">
            {dailyBudget.toFixed(2)} €
          </span>
        </div>

        {config?.dryRun && (
          <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
            DRY-RUN
          </span>
        )}

        <button
          onClick={toggleKillSwitch}
          disabled={busy}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
            enabled
              ? "bg-error/20 text-error hover:bg-error/30"
              : "bg-success/20 text-success hover:bg-success/30"
          }`}
        >
          {busy ? "..." : enabled ? "Couper l'agent" : "Réactiver"}
        </button>

        <button
          onClick={onChange}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-background-elevated"
        >
          Rafraîchir
        </button>
      </div>

      {config?.killSwitchReason && !enabled && (
        <div className="w-full rounded-md bg-error/10 px-3 py-2 text-xs text-error">
          Raison de la coupure : {config.killSwitchReason}
        </div>
      )}
    </div>
  );
}

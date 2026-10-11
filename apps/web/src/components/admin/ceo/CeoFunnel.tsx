"use client";

/**
 * CeoFunnel — funnel 30 jours : sent → opens → replies → clicks → site visits → conversions PREMIUM.
 * Source : agrégat CeoOutboundMessage + dernier CeoKpiSnapshot.
 */

import type { CeoFunnelDto, CeoKpiSnapshotDto } from "./types";

interface CeoFunnelProps {
  funnel: CeoFunnelDto;
  snapshot: CeoKpiSnapshotDto | null;
}

export function CeoFunnel({ funnel, snapshot }: CeoFunnelProps) {
  const steps: { label: string; value: number; rate: number; rateLabel: string }[] = [
    { label: "Messages envoyés", value: funnel.sent, rate: 1, rateLabel: "Base" },
    { label: "Ouvertures", value: funnel.opens, rate: funnel.openRate, rateLabel: "% / sent" },
    { label: "Réponses", value: funnel.replies, rate: funnel.replyRate, rateLabel: "% / sent" },
    { label: "Clics ressource", value: funnel.clicks, rate: funnel.clickRate, rateLabel: "% / sent" },
    { label: "Retours sur le site (48h)", value: funnel.siteVisits, rate: funnel.visitRate, rateLabel: "% / sent" },
    { label: "Conversions Premium", value: funnel.conversions, rate: funnel.conversionRate, rateLabel: "% / sent" },
  ];

  const maxValue = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-text-primary">
          Funnel 30 jours
        </h2>
        {snapshot && (
          <p className="text-xs text-text-muted">
            Snapshot du {new Date(snapshot.date).toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const widthPct = Math.max((step.value / maxValue) * 100, 5);
          return (
            <div key={step.label} className="rounded-lg border border-border bg-background-card p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{step.label}</p>
                  <p className="text-xs text-text-muted">
                    Étape {i + 1}/6 — {step.rateLabel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-bold text-text-primary">
                    {step.value.toLocaleString("fr-FR")}
                  </p>
                  <p className="text-xs text-text-muted">
                    {(step.rate * 100).toFixed(1)} %
                  </p>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-background-elevated">
                <div
                  className="h-full rounded-full bg-accent-primary transition-all"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {funnel.sent === 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          Aucun message envoyé sur les 30 derniers jours — l&apos;agent est récent ou en
          mode dry-run. Reviens d&apos;ici quelques jours pour des données significatives.
        </div>
      )}
    </div>
  );
}

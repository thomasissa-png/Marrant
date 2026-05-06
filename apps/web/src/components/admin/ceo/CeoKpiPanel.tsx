"use client";

/**
 * CeoKpiPanel — North Star + 3 satellites + 6 KPIs ops + sparklines 30j.
 * Cibles et seuils : voir docs/analytics/ceo-kpis-dashboard.md.
 */

import type { CeoKpiSnapshotDto } from "./types";

interface CeoKpiPanelProps {
  snapshot: CeoKpiSnapshotDto | null;
  history: CeoKpiSnapshotDto[];
}

type KpiThreshold = {
  green: number; // >= → vert
  red: number; // < → rouge
  invert?: boolean; // si true, plus haut = pire (ex: directorFailRate)
};

function color(value: number, t: KpiThreshold): string {
  const isGreen = t.invert ? value < t.red : value >= t.green;
  const isRed = t.invert ? value >= t.green : value < t.red;
  if (isGreen) return "text-success";
  if (isRed) return "text-error";
  return "text-warning";
}

function pct(v: number | null | undefined): string {
  if (v == null) return "—";
  return `${(v * 100).toFixed(1)} %`;
}

function Sparkline({ values, label }: { values: number[]; label: string }) {
  if (values.length < 2) {
    return (
      <span className="text-[10px] italic text-text-muted">
        Données insuffisantes (J1–J{values.length}/30)
      </span>
    );
  }
  const max = Math.max(...values, 0.0001);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 80;
  const h = 20;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-label={label}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-primary" />
    </svg>
  );
}

export function CeoKpiPanel({ snapshot, history }: CeoKpiPanelProps) {
  if (!snapshot) {
    return (
      <div className="rounded-lg border border-border bg-background-card p-12 text-center text-text-muted">
        Aucun snapshot KPI pour le moment. Le cron <code>ceo-kpis-snapshot</code> tourne tous les jours
        à 5h UTC — reviens demain pour les premières mesures.
      </div>
    );
  }

  // Tri chronologique pour les sparklines
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));

  const ns = snapshot.northStarEngagement30d;
  const nsThreshold: KpiThreshold = { green: 0.25, red: 0.15 };
  const replyT: KpiThreshold = { green: 0.08, red: 0.04 };
  const visitT: KpiThreshold = { green: 0.15, red: 0.08 };
  const openT: KpiThreshold = { green: 0.4, red: 0.25 };
  const directorFailT: KpiThreshold = { green: 0.5, red: 0.3, invert: true };

  return (
    <div className="space-y-6">
      {/* North Star */}
      <div className="rounded-lg border border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 to-background-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-accent-primary">
              North Star — Engagement valeur 30j
            </p>
            <p className={`mt-2 font-display text-5xl font-bold ${color(ns, nsThreshold)}`}>
              {pct(ns)}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Cible verte ≥ 25 % · orange 15-24 % · rouge &lt; 15 %
            </p>
          </div>
          <div className="text-right">
            <Sparkline
              values={sorted.map((s) => s.northStarEngagement30d)}
              label="North Star 30j"
            />
            <p className="mt-1 text-[10px] text-text-muted">
              {sorted.length} jour{sorted.length > 1 ? "s" : ""} d&apos;historique
            </p>
          </div>
        </div>
      </div>

      {/* 3 Satellites */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">
          Satellites — qualité du dialogue
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <KpiCard
            label="Taux de réponse email"
            value={pct(snapshot.emailReplyRate)}
            target="Cible ≥ 8 %"
            colorClass={color(snapshot.emailReplyRate, replyT)}
            sparkline={sorted.map((s) => s.emailReplyRate)}
          />
          <KpiCard
            label="Retour site 48h"
            value={pct(snapshot.siteReturn48h)}
            target="Cible ≥ 15 %"
            colorClass={color(snapshot.siteReturn48h, visitT)}
            sparkline={sorted.map((s) => s.siteReturn48h)}
          />
          <KpiCard
            label="Ouverture emails"
            value={pct(snapshot.emailOpenRate)}
            target="Cible ≥ 40 %"
            colorClass={color(snapshot.emailOpenRate, openT)}
            sparkline={sorted.map((s) => s.emailOpenRate)}
          />
        </div>
      </div>

      {/* 6 KPIs ops */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">
          KPIs opérationnels
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <MiniKpi
            label="Kill-switch (24h)"
            value={String(snapshot.killSwitchTriggers24h)}
            isError={snapshot.killSwitchTriggers24h > 0}
          />
          <MiniKpi
            label="Director fail rate"
            value={pct(snapshot.directorFailRate)}
            colorClass={color(snapshot.directorFailRate, directorFailT)}
          />
          <MiniKpi
            label="Conversions attribuées"
            value={String(snapshot.ceoAttributedConversions)}
          />
          <MiniKpi
            label="Coût / abonné acquis"
            value={
              snapshot.costPerAcquiredSubscriber != null
                ? `${snapshot.costPerAcquiredSubscriber.toFixed(2)} €`
                : "—"
            }
          />
          <MiniKpi
            label="Backlinks DA cumulé"
            value={String(snapshot.backlinksDaSum)}
          />
          <MiniKpi
            label="Auto-send ratio"
            value={
              snapshot.draftsAutoSendRatio
                ? `${Object.entries(snapshot.draftsAutoSendRatio)
                    .map(([k, v]) => `${k}:${(v * 100).toFixed(0)}%`)
                    .join(" · ") || "—"}`
                : "—"
            }
          />
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  target,
  colorClass,
  sparkline,
}: {
  label: string;
  value: string;
  target: string;
  colorClass: string;
  sparkline: number[];
}) {
  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className={`font-display text-3xl font-bold ${colorClass}`}>{value}</p>
        <Sparkline values={sparkline} label={label} />
      </div>
      <p className="mt-1 text-xs text-text-muted">{target}</p>
    </div>
  );
}

function MiniKpi({
  label,
  value,
  colorClass,
  isError,
}: {
  label: string;
  value: string;
  colorClass?: string;
  isError?: boolean;
}) {
  const cls = isError ? "text-error" : colorClass ?? "text-text-primary";
  return (
    <div className="rounded-lg border border-border bg-background-card p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p className={`mt-1 font-display text-lg font-bold ${cls}`}>{value}</p>
    </div>
  );
}

"use client";

/**
 * /admin/ceo — Dashboard de pilotage de l'agent CEO autonome.
 * Auth : Bearer ADMIN_PASSWORD (même pattern que /admin et /admin/social).
 * 6 vues : Tasks, Drafts, Funnel, KPIs, Backlinks, Audit Log.
 *
 * Stratégie de rendu : Client component avec auth gate (sessionStorage),
 * fetch initial via /api/admin/ceo/data, ensuite refresh par onglet à la demande.
 */

import { useCallback, useEffect, useState } from "react";
import { CeoHeader } from "@/components/admin/ceo/CeoHeader";
import { CeoTasksList } from "@/components/admin/ceo/CeoTasksList";
import { CeoDraftsList } from "@/components/admin/ceo/CeoDraftsList";
import { CeoFunnel } from "@/components/admin/ceo/CeoFunnel";
import { CeoKpiPanel } from "@/components/admin/ceo/CeoKpiPanel";
import { CeoBacklinksList } from "@/components/admin/ceo/CeoBacklinksList";
import { CeoAuditLog } from "@/components/admin/ceo/CeoAuditLog";
import type { CeoDashboardData, CeoTabId } from "@/components/admin/ceo/types";

const TABS: { id: CeoTabId; label: string }[] = [
  { id: "tasks", label: "Tâches" },
  { id: "drafts", label: "Brouillons" },
  { id: "funnel", label: "Funnel 30j" },
  { id: "kpis", label: "KPIs" },
  { id: "backlinks", label: "Backlinks" },
  { id: "audit", label: "Audit" },
];

export default function CeoDashboardPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState<CeoDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<CeoTabId>("kpis");

  const getAuthHeader = useCallback((): Record<string, string> => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("admin_pass") : null;
    return stored ? { Authorization: `Bearer ${stored}` } : {};
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ceo/data", { headers: getAuthHeader() });
      if (res.ok) setData(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_pass", password);
        setAuthed(true);
      } else {
        const err = await res.json();
        setAuthError(err.error || "Erreur d'authentification");
      }
    } catch {
      setAuthError("Erreur réseau");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  if (!authed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-background-card p-8">
          <h1 className="mb-2 text-center font-display text-2xl font-bold text-text-primary">
            CEO — pilotage
          </h1>
          <p className="mb-6 text-center text-xs text-text-muted">
            Tableau de bord de l&apos;agent autonome
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
              className="w-full rounded-lg border border-border bg-background-light px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              autoFocus
            />
            {authError && <p className="text-sm text-error">{authError}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-accent-primary py-3 font-semibold text-white transition-colors hover:bg-accent-primary-hover"
            >
              Entrer
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <CeoHeader
          config={data?.config ?? null}
          lastSnapshot={data?.lastSnapshot ?? null}
          onChange={fetchData}
          getAuthHeader={getAuthHeader}
        />

        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-background-elevated p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && !data && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
          </div>
        )}

        {data && (
          <>
            {activeTab === "tasks" && (
              <CeoTasksList tasks={data.tasks} onChange={fetchData} getAuthHeader={getAuthHeader} />
            )}
            {activeTab === "drafts" && (
              <CeoDraftsList drafts={data.drafts} onChange={fetchData} getAuthHeader={getAuthHeader} />
            )}
            {activeTab === "funnel" && <CeoFunnel snapshot={data.lastSnapshot} funnel={data.funnel} />}
            {activeTab === "kpis" && (
              <CeoKpiPanel snapshot={data.lastSnapshot} history={data.kpiHistory} />
            )}
            {activeTab === "backlinks" && <CeoBacklinksList backlinks={data.backlinks} />}
            {activeTab === "audit" && <CeoAuditLog logs={data.auditLog} />}
          </>
        )}
      </div>
    </div>
  );
}

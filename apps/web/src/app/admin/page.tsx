"use client";

/**
 * Backoffice (Client Component : connexion par mot de passe, onglets interactifs).
 *
 * s21 (18/10) : refonte. Barre et Déconnexion : coquille `admin/layout.tsx` (AdminBar).
 * Connexion inchangée (POST /api/admin/auth, puis Bearer
 * ADMIN_PASSWORD gardé en sessionStorage). Onglets :
 *  - Semaine (défaut) : le rapport du lundi, mêmes fonctions (/api/admin/semaine) ;
 *  - Abonnés : Premium et comptes (/api/admin/users), lettre (/api/admin/lettre) ;
 *  - Réseaux sociaux (/api/admin/social) et Planning (/api/admin/planning).
 * Audit : docs/admin/audit-admin-s21.md.
 */
import { useCallback, useEffect, useState } from "react";
import { ADMIN_PASS_KEY } from "@/hooks/use-admin-fetch";
import { SemaineTab } from "@/components/admin/semaine-tab";
import { AbonnesTab, type VueAbonnes } from "@/components/admin/abonnes-tab";
import { SocialTab } from "@/components/admin/social-tab";
import { PlanningTab } from "@/components/admin/planning-tab";

type TabId = "semaine" | "abonnes" | "social" | "planning";

const TABS: { id: TabId; label: string }[] = [
  { id: "semaine", label: "Semaine" },
  { id: "abonnes", label: "Abonnés" },
  { id: "social", label: "Réseaux sociaux" },
  { id: "planning", label: "Planning" },
];

const AUTH_KEY = "admin_auth";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("semaine");
  const [vueAbonnes, setVueAbonnes] = useState<VueAbonnes>("premium");

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === "true" && sessionStorage.getItem(ADMIN_PASS_KEY)) setIsAuthenticated(true);
  }, []);

  const logout = useCallback((message = "") => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(ADMIN_PASS_KEY);
    window.dispatchEvent(new Event("admin-session"));
    setIsAuthenticated(false);
    setError(message);
  }, []);
  const onUnauthorized = useCallback(() => logout("Session expirée ou mot de passe changé : reconnecte-toi."), [logout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem(AUTH_KEY, "true");
        sessionStorage.setItem(ADMIN_PASS_KEY, password);
        window.dispatchEvent(new Event("admin-session"));
        setIsAuthenticated(true);
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Erreur d'authentification");
      }
    } catch {
      setError("Erreur réseau");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-background-card p-6 md:p-8">
          <h1 className="mb-6 text-center font-display text-2xl font-bold text-text-primary">Admin deviens-marrant</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <label htmlFor="admin-password" className="sr-only">Mot de passe admin</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
              autoComplete="current-password"
              aria-describedby={error ? "admin-login-error" : undefined}
              className="w-full rounded-lg border border-border bg-background-light px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              autoFocus
            />
            {error && <p id="admin-login-error" className="text-sm text-error">{error}</p>}
            <button type="submit" className="w-full rounded-lg bg-accent-secondary-hover py-3 font-semibold text-white transition-colors hover:bg-accent-secondary">
              Accéder au backoffice
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <h1 className="sr-only">Backoffice deviens-marrant.fr</h1>
        {/* Revue visuelle s21 (R14) : 2 x 2 sous 640 px (plus d'onglet coupé), 4 colonnes égales au-delà. */}
        <nav className="mb-6" aria-label="Sections du backoffice">
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-background-elevated p-1 sm:grid-cols-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-current={activeTab === tab.id ? "page" : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-11 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-background-card text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {activeTab === "semaine" && (
          <SemaineTab
            onUnauthorized={onUnauthorized}
            onVoirLettre={() => {
              setVueAbonnes("lettre");
              setActiveTab("abonnes");
            }}
          />
        )}
        {activeTab === "abonnes" && <AbonnesTab vue={vueAbonnes} onVue={setVueAbonnes} onUnauthorized={onUnauthorized} />}
        {activeTab === "social" && <SocialTab onUnauthorized={onUnauthorized} />}
        {activeTab === "planning" && <PlanningTab onUnauthorized={onUnauthorized} />}
      </div>
    </div>
  );
}

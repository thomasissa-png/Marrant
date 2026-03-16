"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  conversionRate: string;
  mrr: string;
  usersLast7d: number;
  usersLast30d: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  pastDueSubscriptions: number;
  jokes: number;
  tips: number;
  videos: number;
  paths: number;
  favorites: number;
  totalXp: number;
}

interface UserSubscription {
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  plan: "FREE" | "PREMIUM";
  level: string;
  xp: number;
  streak: number;
  lastActiveAt: string | null;
  createdAt: string;
  subscription: UserSubscription | null;
  _count: {
    favorites: number;
    jokeLikes: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type TabId = "dashboard" | "users";
type UserFilter = "all" | "premium" | "free";
type UserSort = "recent" | "oldest" | "xp" | "streak";

// ─── Page ───────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  // Stats
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userFilter, setUserFilter] = useState<UserFilter>("all");
  const [userSort, setUserSort] = useState<UserSort>("recent");
  const [userSearch, setUserSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const getAuthHeader = useCallback((): Record<string, string> => {
    const storedPass = sessionStorage.getItem("admin_pass");
    return storedPass ? { Authorization: `Bearer ${storedPass}` } : {};
  }, []);

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
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_pass", password);
      } else {
        const data = await res.json();
        setError(data.error || "Erreur d'authentification");
      }
    } catch {
      setError("Erreur réseau");
    }
  };

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/stats", { headers: getAuthHeader() });
      if (res.ok) setStats(await res.json());
    } catch {
      // silently fail
    } finally {
      setStatsLoading(false);
    }
  }, [getAuthHeader]);

  const fetchUsers = useCallback(async (page = 1) => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "25",
        filter: userFilter,
        sort: userSort,
      });
      if (userSearch) params.set("q", userSearch);

      const res = await fetch(`/api/admin/users?${params}`, { headers: getAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch {
      // silently fail
    } finally {
      setUsersLoading(false);
    }
  }, [userFilter, userSort, userSearch, getAuthHeader]);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchStats();
  }, [isAuthenticated, fetchStats]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "users") fetchUsers(1);
  }, [isAuthenticated, activeTab, userFilter, userSort, userSearch, fetchUsers]);

  // ─── Login ──────────────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-background-card p-8">
          <h1 className="mb-6 text-center font-display text-2xl font-bold text-text-primary">
            Admin — deviens-marrant
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
              className="w-full rounded-lg border border-border bg-background-light px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              autoFocus
            />
            {error && <p className="text-sm text-error">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-accent-primary py-3 font-semibold text-white transition-colors hover:bg-accent-primary-hover"
            >
              Accéder au backoffice
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Backoffice
            </h1>
            <p className="mt-1 text-sm text-text-muted">deviens-marrant.fr</p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_auth");
              sessionStorage.removeItem("admin_pass");
              setIsAuthenticated(false);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-background-elevated"
          >
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg border border-border bg-background-elevated p-1">
          {([
            { id: "dashboard" as TabId, label: "Tableau de bord" },
            { id: "users" as TabId, label: "Utilisateurs" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <DashboardTab stats={stats} loading={statsLoading} onRefresh={fetchStats} />
        )}

        {activeTab === "users" && (
          <UsersTab
            users={users}
            pagination={pagination}
            loading={usersLoading}
            filter={userFilter}
            sort={userSort}
            searchInput={searchInput}
            onFilterChange={setUserFilter}
            onSortChange={setUserSort}
            onSearchInputChange={setSearchInput}
            onSearch={() => setUserSearch(searchInput)}
            onPageChange={(p) => fetchUsers(p)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Tab ──────────────────────────────────────────────

function DashboardTab({
  stats,
  loading,
  onRefresh,
}: {
  stats: Stats | null;
  loading: boolean;
  onRefresh: () => void;
}) {
  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-text-primary">KPIs Business</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-background-elevated disabled:opacity-50"
        >
          {loading ? "..." : "Actualiser"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="MRR" value={`${stats.mrr} €`} subtitle="Revenu mensuel récurrent" accent />
        <KpiCard label="Taux de conversion" value={`${stats.conversionRate}%`} subtitle={`${stats.premiumUsers} payants / ${stats.totalUsers} total`} accent />
        <KpiCard label="Utilisateurs" value={String(stats.totalUsers)} subtitle={`+${stats.usersLast7d} cette semaine`} />
        <KpiCard label="Inscrits (30j)" value={String(stats.usersLast30d)} subtitle="Nouveaux comptes ce mois" />
      </div>

      {/* Abonnements */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Abonnements</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KpiCard label="Premium actifs" value={String(stats.activeSubscriptions)} color="success" />
          <KpiCard label="Plan gratuit" value={String(stats.freeUsers)} />
          <KpiCard label="Annulés" value={String(stats.canceledSubscriptions)} color="warning" />
          <KpiCard label="Impayés" value={String(stats.pastDueSubscriptions)} color={stats.pastDueSubscriptions > 0 ? "error" : undefined} />
        </div>
      </div>

      {/* Engagement */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Engagement</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KpiCard label="XP total distribué" value={stats.totalXp.toLocaleString("fr-FR")} />
          <KpiCard label="Favoris créés" value={String(stats.favorites)} />
          <KpiCard label="Parcours dispo." value={String(stats.paths)} />
          <KpiCard label="Contenu total" value={String(stats.jokes + stats.tips + stats.videos)} subtitle={`${stats.jokes} vannes · ${stats.tips} conseils · ${stats.videos} vidéos`} />
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ──────────────────────────────────────────────────

function UsersTab({
  users,
  pagination,
  loading,
  filter,
  sort,
  searchInput,
  onFilterChange,
  onSortChange,
  onSearchInputChange,
  onSearch,
  onPageChange,
}: {
  users: AdminUser[];
  pagination: Pagination | null;
  loading: boolean;
  filter: UserFilter;
  sort: UserSort;
  searchInput: string;
  onFilterChange: (f: UserFilter) => void;
  onSortChange: (s: UserSort) => void;
  onSearchInputChange: (v: string) => void;
  onSearch: () => void;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSearch(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Rechercher email ou nom..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            className="w-64 rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
          />
          <button
            type="submit"
            className="rounded-lg bg-accent-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-primary-hover"
          >
            Chercher
          </button>
        </form>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as UserFilter)}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="all">Tous les plans</option>
          <option value="premium">Premium uniquement</option>
          <option value="free">Gratuit uniquement</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as UserSort)}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="recent">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="xp">XP (desc.)</option>
          <option value="streak">Streak (desc.)</option>
        </select>

        {pagination && (
          <span className="ml-auto text-sm text-text-muted">
            {pagination.total} utilisateur{pagination.total > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-background-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-elevated">
              <th className="px-4 py-3 text-left font-semibold text-text-primary">Utilisateur</th>
              <th className="px-4 py-3 text-left font-semibold text-text-primary">Plan</th>
              <th className="px-4 py-3 text-left font-semibold text-text-primary">Statut abo.</th>
              <th className="px-4 py-3 text-right font-semibold text-text-primary">XP</th>
              <th className="px-4 py-3 text-right font-semibold text-text-primary">Streak</th>
              <th className="px-4 py-3 text-right font-semibold text-text-primary">Favoris</th>
              <th className="px-4 py-3 text-left font-semibold text-text-primary">Inscription</th>
              <th className="px-4 py-3 text-left font-semibold text-text-primary">Dernière activité</th>
              <th className="px-4 py-3 text-left font-semibold text-text-primary">Fin période</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-text-muted">
                  Chargement...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-text-muted">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-background-elevated disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="text-sm text-text-muted">
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-background-elevated disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Components ─────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  subtitle,
  accent,
  color,
}: {
  label: string;
  value: string;
  subtitle?: string;
  accent?: boolean;
  color?: "success" | "warning" | "error";
}) {
  const valueColor = color
    ? color === "success"
      ? "text-success"
      : color === "warning"
      ? "text-yellow-500"
      : "text-error"
    : accent
    ? "text-accent-primary"
    : "text-text-primary";

  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueColor}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
    </div>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const planBadge = user.plan === "PREMIUM"
    ? "bg-accent-primary/20 text-accent-primary"
    : "bg-background-elevated text-text-muted";

  const subStatus = user.subscription?.status;
  const subBadge = !subStatus
    ? null
    : subStatus === "ACTIVE"
    ? "bg-success/20 text-success"
    : subStatus === "CANCELED"
    ? "bg-yellow-500/20 text-yellow-600"
    : subStatus === "PAST_DUE"
    ? "bg-error/20 text-error"
    : "bg-background-elevated text-text-muted";

  const subLabel = !subStatus
    ? "—"
    : subStatus === "ACTIVE"
    ? "Actif"
    : subStatus === "CANCELED"
    ? "Annulé"
    : subStatus === "PAST_DUE"
    ? "Impayé"
    : subStatus === "INACTIVE"
    ? "Inactif"
    : subStatus;

  return (
    <tr className="border-b border-border last:border-0 hover:bg-background-elevated/50">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-text-primary">{user.name || "Sans nom"}</p>
          <p className="text-xs text-text-muted">{user.email}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${planBadge}`}>
          {user.plan === "PREMIUM" ? "Premium" : "Free"}
        </span>
      </td>
      <td className="px-4 py-3">
        {subBadge ? (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${subBadge}`}>
            {subLabel}
          </span>
        ) : (
          <span className="text-xs text-text-muted">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right font-mono text-text-secondary">
        {user.xp.toLocaleString("fr-FR")}
      </td>
      <td className="px-4 py-3 text-right">
        {user.streak > 0 ? (
          <span className="font-medium text-accent-primary">{user.streak}j</span>
        ) : (
          <span className="text-text-muted">0</span>
        )}
      </td>
      <td className="px-4 py-3 text-right text-text-secondary">
        {user._count.favorites}
      </td>
      <td className="px-4 py-3 text-xs text-text-muted">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-4 py-3 text-xs text-text-muted">
        {user.lastActiveAt ? formatDate(user.lastActiveAt) : "Jamais"}
      </td>
      <td className="px-4 py-3 text-xs text-text-muted">
        {user.subscription?.currentPeriodEnd
          ? formatDate(user.subscription.currentPeriodEnd)
          : "—"}
      </td>
    </tr>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

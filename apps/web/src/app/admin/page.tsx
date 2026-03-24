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
  socialPendingCount: number;
  socialFailedCount: number;
  socialPendingPosts: {
    id: string;
    platform: string;
    format: string;
    hook: string;
    content: string;
    directorScore: number | null;
    directorNote: string | null;
    status: string;
    createdAt: string;
  }[];
  dailyContentMissing: {
    joke: boolean;
    tip: boolean;
    video: boolean;
    noDailyContent: boolean;
  };
  blogAlert: {
    missing: boolean;
    message?: string;
    lastArticle?: {
      id: string;
      title: string;
      slug: string;
      publishedAt: string;
    };
  };
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

interface SocialPost {
  id: string;
  platform: string;
  format: string;
  content: string;
  hook: string;
  cta: string | null;
  targetPersona: string;
  status: string;
  directorScore: number | null;
  directorNote: string | null;
  scheduledAt: string;
  publishedAt: string | null;
  externalId: string | null;
  impressions: number;
  likes: number;
  retweets: number;
  threadParts: string[];
  createdAt: string;
}

interface SocialStatusCounts {
  [key: string]: number;
}

// ─── Planning Types ─────────────────────────────────────────────

interface PlanningBlogArticle {
  id: number;
  slug: string;
  title: string;
  category: string;
  type: string;
  scheduledWeek: number;
  status: string;
  publishedDate?: string;
  cluster?: string;
}

interface PlanningSocialPost {
  id: string;
  platform: string;
  format: string;
  hook: string | null;
  targetPersona: string;
  status: string;
  directorScore: number | null;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
}

interface PlanningDailyContent {
  date: string;
  joke: { id: string; category: string; preview: string } | null;
  tip: { id: string; title: string; category: string } | null;
  video: { id: string; title: string; channel: string } | null;
}

interface PlanningSeoCalendarEntry {
  weekNumber: number;
  year: number;
  targetKeyword: string;
  articleTitle: string | null;
  status: string;
}

interface PlanningContentPlanEntry {
  dayOfMonth: number;
  category: string;
  theme: string;
  status: string;
}

interface PlanningContentPlan {
  agentType: string;
  month: number;
  year: number;
  entries: PlanningContentPlanEntry[];
}

interface PlanningData {
  currentWeek: number;
  blogPlan: PlanningBlogArticle[];
  blogStats: { total: number; published: number; planned: number; overdue: number };
  socialPosts: PlanningSocialPost[];
  socialStats: { total: number; pending: number; approved: number; published: number; failed: number };
  dailyContent: PlanningDailyContent[];
  hasTodayContent: boolean;
  seoCalendar: PlanningSeoCalendarEntry[];
  contentPlans: PlanningContentPlan[];
}

type TabId = "dashboard" | "users" | "social" | "planning";
type UserFilter = "all" | "premium" | "free";
type UserSort = "recent" | "oldest" | "xp" | "streak";
type SocialFilter = "PENDING" | "APPROVED" | "PUBLISHED" | "REJECTED" | "FAILED" | "ALL";

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

  // Social
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [socialCounts, setSocialCounts] = useState<SocialStatusCounts>({});
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialFilter, setSocialFilter] = useState<SocialFilter>("ALL");

  // Planning
  const [planningData, setPlanningData] = useState<PlanningData | null>(null);
  const [planningLoading, setPlanningLoading] = useState(false);

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

  const fetchSocial = useCallback(async () => {
    setSocialLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (socialFilter !== "ALL") params.set("status", socialFilter);
      const res = await fetch(`/api/admin/social?${params}`, { headers: getAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        setSocialPosts(data.posts || []);
        setSocialCounts(data.statusCounts || {});
      }
    } catch {
      // silently fail
    } finally {
      setSocialLoading(false);
    }
  }, [socialFilter, getAuthHeader]);

  const fetchPlanning = useCallback(async () => {
    setPlanningLoading(true);
    try {
      const res = await fetch("/api/admin/planning", { headers: getAuthHeader() });
      if (res.ok) {
        setPlanningData(await res.json());
      }
    } catch {
      // silently fail
    } finally {
      setPlanningLoading(false);
    }
  }, [getAuthHeader]);

  const socialAction = useCallback(async (action: string, postIds: string[]) => {
    try {
      const res = await fetch("/api/admin/social", {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ action, postIds }),
      });
      if (res.ok) fetchSocial();
    } catch {
      // silently fail
    }
  }, [getAuthHeader, fetchSocial]);

  const syncUserPlan = useCallback(async (userId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || `Plan: ${data.plan}`);
        fetchUsers(pagination?.page ?? 1);
      } else {
        alert(data.error || "Erreur sync");
      }
    } catch {
      alert("Erreur de connexion");
    }
  }, [getAuthHeader, fetchUsers, pagination]);

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

  useEffect(() => {
    if (isAuthenticated && activeTab === "social") fetchSocial();
  }, [isAuthenticated, activeTab, socialFilter, fetchSocial]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "planning") fetchPlanning();
  }, [isAuthenticated, activeTab, fetchPlanning]);

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
            { id: "social" as TabId, label: "Social Media" },
            { id: "planning" as TabId, label: "Planning" },
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
            onSyncUser={syncUserPlan}
          />
        )}

        {activeTab === "social" && (
          <SocialTab
            posts={socialPosts}
            statusCounts={socialCounts}
            loading={socialLoading}
            filter={socialFilter}
            onFilterChange={setSocialFilter}
            onAction={socialAction}
            onRefresh={fetchSocial}
          />
        )}

        {activeTab === "planning" && (
          <PlanningTab data={planningData} loading={planningLoading} onRefresh={fetchPlanning} />
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

  const hasSocialAlerts = stats.socialPendingCount > 0 || stats.socialFailedCount > 0;
  const hasDailyAlert = stats.dailyContentMissing.noDailyContent ||
    stats.dailyContentMissing.joke || stats.dailyContentMissing.tip || stats.dailyContentMissing.video;
  const hasBlogAlert = stats.blogAlert.missing;
  const hasAnyAlert = hasSocialAlerts || hasDailyAlert || hasBlogAlert;

  return (
    <div className="space-y-6">
      {/* Content quality alerts */}
      {hasAnyAlert && (
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-error">Alertes contenu</h2>

          {/* Daily content missing */}
          {hasDailyAlert && (
            <div className="rounded-lg border border-error/30 bg-error/10 p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">&#9888;</span>
                <div>
                  <p className="font-semibold text-error">
                    Contenu quotidien manquant aujourd&apos;hui
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {stats.dailyContentMissing.noDailyContent
                      ? "Aucun contenu du jour n'a été généré. Le cron daily-content a probablement échoué (contenu rejeté par le directeur artistique, score < 9/10)."
                      : `Contenu partiel — manquant : ${[
                          stats.dailyContentMissing.joke && "vanne",
                          stats.dailyContentMissing.tip && "conseil",
                          stats.dailyContentMissing.video && "vidéo",
                        ].filter(Boolean).join(", ")}. Le directeur artistique a rejeté ce contenu (score < 9/10).`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Blog article missing */}
          {hasBlogAlert && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">&#9203;</span>
                <div>
                  <p className="font-semibold text-yellow-500">
                    Aucun article blog cette semaine
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {stats.blogAlert.message} — le cron weekly-seo a peut-être rejeté l&apos;article (score directeur &lt; 9/10).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Social failed */}
          {stats.socialFailedCount > 0 && (
            <div className="rounded-lg border border-error/30 bg-error/10 p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">&#9888;</span>
                <div>
                  <p className="font-semibold text-error">
                    {stats.socialFailedCount} post{stats.socialFailedCount > 1 ? "s" : ""} social en erreur
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Des posts n&apos;ont pas pu être publiés. Vérifiez l&apos;onglet Social Media pour les détails.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Social pending */}
          {stats.socialPendingCount > 0 && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">&#9203;</span>
                <div>
                  <p className="font-semibold text-yellow-500">
                    {stats.socialPendingCount} post{stats.socialPendingCount > 1 ? "s" : ""} social en attente
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Ces posts n&apos;ont pas atteint le score minimum de 9/10 du directeur artistique ou nécessitent une review manuelle.
                  </p>
                  {stats.socialPendingPosts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {stats.socialPendingPosts.slice(0, 5).map((post) => (
                        <div
                          key={post.id}
                          className="rounded border border-border bg-background-card px-3 py-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                              post.status === "FAILED" ? "bg-error/20 text-error" : "bg-yellow-500/20 text-yellow-500"
                            }`}>
                              {post.status}
                            </span>
                            <span className="text-xs text-text-muted">{post.platform}</span>
                            <span className="text-xs text-text-muted">{post.format}</span>
                            {post.directorScore != null && (
                              <span className="text-xs text-text-muted">Score: {post.directorScore}/10</span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-text-secondary">{post.hook || post.content.slice(0, 80)}</p>
                          {post.directorNote && (
                            <p className="mt-1 text-xs italic text-text-muted">{post.directorNote}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
  onSyncUser,
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
  onSyncUser: (userId: string) => void;
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
              <th className="px-4 py-3 text-left font-semibold text-text-primary"></th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-text-muted">
                  Chargement...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-text-muted">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow key={user.id} user={user} onSync={onSyncUser} />
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

// ─── Social Tab ──────────────────────────────────────────────────

function SocialTab({
  posts,
  statusCounts,
  loading,
  filter,
  onFilterChange,
  onAction,
  onRefresh,
}: {
  posts: SocialPost[];
  statusCounts: SocialStatusCounts;
  loading: boolean;
  filter: SocialFilter;
  onFilterChange: (f: SocialFilter) => void;
  onAction: (action: string, postIds: string[]) => void;
  onRefresh: () => void;
}) {
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const pendingIds = posts.filter((p) => p.status === "PENDING").map((p) => p.id);

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatusCard label="Total" count={total} />
        <StatusCard label="En attente" count={statusCounts["PENDING"] || 0} color="text-yellow-500" />
        <StatusCard label="Approuvés" count={statusCounts["APPROVED"] || 0} color="text-blue-400" />
        <StatusCard label="Publiés" count={statusCounts["PUBLISHED"] || 0} color="text-success" />
        <StatusCard label="Échoués" count={(statusCounts["FAILED"] || 0) + (statusCounts["REJECTED"] || 0)} color="text-error" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as SocialFilter)}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="APPROVED">Approuvés</option>
          <option value="PUBLISHED">Publiés</option>
          <option value="FAILED">Échoués</option>
          <option value="REJECTED">Rejetés</option>
        </select>

        {pendingIds.length > 0 && (
          <button
            onClick={() => {
              if (!window.confirm(`Approuver ${pendingIds.length} posts en attente ?`)) return;
              onAction("approve", pendingIds);
            }}
            className="rounded-lg bg-success/20 px-3 py-2 text-sm font-medium text-success transition-colors hover:bg-success/30"
          >
            Approuver tout ({pendingIds.length})
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="ml-auto rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-background-elevated disabled:opacity-50"
        >
          {loading ? "..." : "Actualiser"}
        </button>
      </div>

      {/* Posts list */}
      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-border bg-background-card p-12 text-center text-text-muted">
          Aucun post social pour le moment. Le scheduler en générera automatiquement.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <SocialPostCard
              key={post.id}
              post={post}
              onApprove={() => onAction("approve", [post.id])}
              onReject={() => onAction("reject", [post.id])}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusCard({ label, count, color }: { label: string; count: number; color?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background-card p-3 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color || "text-text-primary"}`}>{count}</p>
    </div>
  );
}

function SocialPostCard({
  post,
  onApprove,
  onReject,
}: {
  post: SocialPost;
  onApprove: () => void;
  onReject: () => void;
}) {
  const platformLabels: Record<string, string> = {
    TWITTER: "Twitter/X",
    LINKEDIN: "LinkedIn",
    INSTAGRAM: "Instagram",
  };

  const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-500",
    APPROVED: "bg-blue-400/20 text-blue-400",
    PUBLISHED: "bg-success/20 text-success",
    REJECTED: "bg-error/20 text-error",
    FAILED: "bg-error/20 text-error",
  };

  const formatLabels: Record<string, string> = {
    TECHNIQUE_DU_JOUR: "Technique du Jour",
    TWEET: "Tweet",
    THREAD: "Thread",
    QUOTE_ANALYSIS: "Quote Analyse",
    POST: "Post",
  };

  const isThread = post.format === "THREAD" && post.threadParts.length > 0;

  return (
    <div className="rounded-lg border border-border bg-background-card p-4">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[post.status] || ""}`}>
          {post.status}
        </span>
        <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs font-medium text-text-muted">
          {platformLabels[post.platform] || post.platform}
        </span>
        <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs font-medium text-text-muted">
          {formatLabels[post.format] || post.format}
        </span>
        <span className="rounded-full bg-accent-primary/15 px-2 py-0.5 text-xs font-medium text-accent-primary">
          {post.targetPersona}
        </span>
        {post.directorScore && (
          <span className="text-xs text-text-muted">
            Score: {post.directorScore}/10
          </span>
        )}
        <span className="ml-auto text-xs text-text-muted">
          {new Date(post.scheduledAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Hook */}
      <p className="mb-2 text-sm font-semibold text-accent-primary">{post.hook}</p>

      {/* Content */}
      {isThread ? (
        <div className="space-y-2">
          {post.threadParts.map((part, i) => (
            <div key={i} className="rounded border-l-2 border-accent-primary/30 bg-background-elevated px-3 py-2 text-sm text-text-secondary">
              <span className="mr-2 text-xs font-medium text-text-muted">{i + 1}/{post.threadParts.length}</span>
              {part}
            </div>
          ))}
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm text-text-secondary">{post.content}</p>
      )}

      {/* Instagram image preview */}
      {post.platform === "INSTAGRAM" && post.id && (
        <div style={{ marginTop: 12 }}>
          <img
            src={`/api/social/image?postId=${post.id}`}
            alt="Preview Instagram"
            style={{ width: 200, height: 200, borderRadius: 8, objectFit: "cover" }}
            loading="lazy"
          />
        </div>
      )}

      {/* CTA */}
      {post.cta && (
        <p className="mt-2 text-xs italic text-text-muted">CTA: {post.cta}</p>
      )}

      {/* Director note */}
      {post.directorNote && (
        <p className="mt-2 rounded bg-background-elevated px-2 py-1 text-xs text-text-muted">
          Note directeur: {post.directorNote}
        </p>
      )}

      {/* Published info */}
      {post.status === "PUBLISHED" && post.externalId && (
        <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
          <span>Tweet ID: {post.externalId}</span>
          {post.impressions > 0 && <span>{post.impressions} impressions</span>}
          {post.likes > 0 && <span>{post.likes} likes</span>}
          {post.retweets > 0 && <span>{post.retweets} RT</span>}
        </div>
      )}

      {/* Actions */}
      {(post.status === "PENDING" || post.status === "APPROVED") && (
        <div className="mt-3 flex gap-2 border-t border-border pt-3">
          {post.status === "PENDING" && (
            <button
              onClick={onApprove}
              className="rounded-md bg-success/20 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/30"
            >
              Approuver
            </button>
          )}
          <button
            onClick={() => {
              if (!window.confirm("Rejeter ce post ?")) return;
              onReject();
            }}
            className="rounded-md bg-error/20 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/30"
          >
            Rejeter
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Planning Tab ───────────────────────────────────────────────

function PlanningTab({
  data,
  loading,
  onRefresh,
}: {
  data: PlanningData | null;
  loading: boolean;
  onRefresh: () => void;
}) {
  const [activeSection, setActiveSection] = useState<"blog" | "social" | "daily">("blog");

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      published: "bg-success/20 text-success",
      planned: "bg-warning/20 text-warning",
      PUBLISHED: "bg-success/20 text-success",
      APPROVED: "bg-success/20 text-success",
      PENDING: "bg-warning/20 text-warning",
      FAILED: "bg-error/20 text-error",
      REJECTED: "bg-error/20 text-error",
    };
    return map[status] ?? "bg-background-elevated text-text-muted";
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-background-card p-4">
          <p className="text-xs text-text-muted">Semaine actuelle</p>
          <p className="text-2xl font-bold text-accent-primary">{data.currentWeek}</p>
        </div>
        <div className="rounded-lg border border-border bg-background-card p-4">
          <p className="text-xs text-text-muted">Blog articles</p>
          <p className="text-2xl font-bold text-text-primary">{data.blogStats?.published ?? 0}/{data.blogStats?.total ?? 0}</p>
          {data.blogStats?.overdue > 0 && (
            <p className="text-xs text-error">{data.blogStats.overdue} en retard</p>
          )}
        </div>
        <div className="rounded-lg border border-border bg-background-card p-4">
          <p className="text-xs text-text-muted">Social posts (30j)</p>
          <p className="text-2xl font-bold text-text-primary">{data.socialStats?.published ?? 0}</p>
          {data.socialStats?.pending > 0 && (
            <p className="text-xs text-warning">{data.socialStats.pending} en attente</p>
          )}
        </div>
        <div className="rounded-lg border border-border bg-background-card p-4">
          <p className="text-xs text-text-muted">Contenu du jour</p>
          <p className={`text-2xl font-bold ${data.hasTodayContent ? "text-success" : "text-error"}`}>
            {data.hasTodayContent ? "OK" : "MANQUANT"}
          </p>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2">
        {([
          { id: "blog" as const, label: "Blog / SEO" },
          { id: "social" as const, label: "Social Media" },
          { id: "daily" as const, label: "Vannes / Conseils / Videos" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSection === tab.id
                ? "bg-accent-primary text-white"
                : "bg-background-elevated text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={onRefresh}
          className="ml-auto rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-background-elevated"
        >
          Rafraichir
        </button>
      </div>

      {/* ─── Blog Plan ──────────────────────────────────── */}
      {activeSection === "blog" && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-text-primary">Planning Blog / SEO</h3>

          {/* SEO Calendar */}
          {data.seoCalendar?.length > 0 && (
            <div className="rounded-lg border border-border bg-background-card p-4">
              <h4 className="mb-3 text-sm font-semibold text-text-secondary">Calendrier SEO {new Date().getFullYear()}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-text-muted">
                      <th className="px-3 py-2">Sem</th>
                      <th className="px-3 py-2">Mot-cle</th>
                      <th className="px-3 py-2">Article</th>
                      <th className="px-3 py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.seoCalendar.map((entry: PlanningSeoCalendarEntry, i: number) => (
                      <tr key={i} className={`border-b border-border/50 ${entry.weekNumber === data.currentWeek ? "bg-accent-primary/5" : ""}`}>
                        <td className="px-3 py-2 font-mono text-xs">
                          S{entry.weekNumber}
                          {entry.weekNumber === data.currentWeek && <span className="ml-1 text-accent-primary">*</span>}
                        </td>
                        <td className="px-3 py-2 text-text-secondary">{entry.targetKeyword}</td>
                        <td className="max-w-[200px] truncate px-3 py-2">{entry.articleTitle ?? "—"}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${statusBadge(entry.status)}`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Editorial Plan articles */}
          <div className="rounded-lg border border-border bg-background-card p-4">
            <h4 className="mb-3 text-sm font-semibold text-text-secondary">Articles planifies ({data.blogStats?.total ?? 0})</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-muted">
                    <th className="px-3 py-2">Sem</th>
                    <th className="px-3 py-2">Titre</th>
                    <th className="px-3 py-2">Cat</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Cluster</th>
                    <th className="px-3 py-2">Statut</th>
                    <th className="px-3 py-2">Publie le</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.blogPlan ?? []).map((article: PlanningBlogArticle) => {
                    const isOverdue = article.status === "planned" && article.scheduledWeek < data.currentWeek;
                    return (
                      <tr key={article.id} className={`border-b border-border/50 ${isOverdue ? "bg-error/5" : article.scheduledWeek === data.currentWeek ? "bg-accent-primary/5" : ""}`}>
                        <td className="px-3 py-2 font-mono text-xs">
                          S{article.scheduledWeek}
                          {isOverdue && <span className="ml-1 text-error">!</span>}
                        </td>
                        <td className="max-w-[250px] truncate px-3 py-2" title={article.title}>{article.title}</td>
                        <td className="px-3 py-2 text-xs text-text-muted">{article.category}</td>
                        <td className="px-3 py-2 text-xs text-text-muted">{article.type}</td>
                        <td className="px-3 py-2 text-xs text-text-muted">{article.cluster}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${statusBadge(article.status)}`}>
                            {article.status}{isOverdue ? " (retard)" : ""}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-text-muted">{article.publishedDate ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Social Posts ───────────────────────────────── */}
      {activeSection === "social" && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-text-primary">Planning Social Media</h3>
          <div className="rounded-lg border border-border bg-background-card p-4">
            <div className="mb-3 flex items-center gap-4 text-xs text-text-muted">
              <span>Total: {data.socialStats?.total ?? 0}</span>
              <span className="text-warning">En attente: {data.socialStats?.pending ?? 0}</span>
              <span className="text-success">Approuves: {data.socialStats?.approved ?? 0}</span>
              <span className="text-success">Publies: {data.socialStats?.published ?? 0}</span>
              {data.socialStats?.failed > 0 && <span className="text-error">Echecs: {data.socialStats.failed}</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-muted">
                    <th className="px-3 py-2">Date/Heure</th>
                    <th className="px-3 py-2">Plateforme</th>
                    <th className="px-3 py-2">Format</th>
                    <th className="px-3 py-2">Hook</th>
                    <th className="px-3 py-2">Persona</th>
                    <th className="px-3 py-2">Score</th>
                    <th className="px-3 py-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.socialPosts ?? []).map((post: PlanningSocialPost) => (
                    <tr key={post.id} className="border-b border-border/50">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-text-muted">
                        {post.scheduledAt
                          ? new Date(post.scheduledAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) +
                            " " +
                            new Date(post.scheduledAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs">{post.platform}</td>
                      <td className="px-3 py-2 text-xs text-text-muted">{post.format}</td>
                      <td className="max-w-[200px] truncate px-3 py-2" title={post.hook}>{post.hook ?? "—"}</td>
                      <td className="px-3 py-2 text-xs text-text-muted">{post.targetPersona}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs">
                        {post.directorScore != null ? `${post.directorScore}/10` : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${statusBadge(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(data.socialPosts ?? []).length === 0 && (
                    <tr><td colSpan={7} className="px-3 py-8 text-center text-text-muted">Aucun post social</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Daily Content ──────────────────────────────── */}
      {activeSection === "daily" && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-text-primary">Contenu quotidien (14 derniers jours)</h3>
          <div className="rounded-lg border border-border bg-background-card p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-muted">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Vanne</th>
                    <th className="px-3 py-2">Conseil</th>
                    <th className="px-3 py-2">Video</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.dailyContent ?? []).map((day: PlanningDailyContent) => (
                    <tr key={day.date} className={`border-b border-border/50 ${day.date === new Date().toISOString().split("T")[0] ? "bg-accent-primary/5" : ""}`}>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">
                        {new Date(day.date).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" })}
                      </td>
                      <td className="px-3 py-2">
                        {day.joke ? (
                          <span className="text-xs" title={day.joke.preview}>
                            <span className="rounded bg-background-elevated px-1 py-0.5 text-text-muted">{day.joke.category}</span>
                            {" "}{day.joke.preview?.slice(0, 50)}...
                          </span>
                        ) : <span className="text-xs text-error">MANQUANT</span>}
                      </td>
                      <td className="px-3 py-2">
                        {day.tip ? (
                          <span className="text-xs" title={day.tip.title}>
                            <span className="rounded bg-background-elevated px-1 py-0.5 text-text-muted">{day.tip.category}</span>
                            {" "}{day.tip.title}
                          </span>
                        ) : <span className="text-xs text-error">MANQUANT</span>}
                      </td>
                      <td className="px-3 py-2">
                        {day.video ? (
                          <span className="text-xs" title={`${day.video.title} — ${day.video.channel}`}>
                            <span className="rounded bg-background-elevated px-1 py-0.5 text-text-muted">{day.video.channel}</span>
                            {" "}{day.video.title?.slice(0, 40)}
                          </span>
                        ) : <span className="text-xs text-error">MANQUANT</span>}
                      </td>
                    </tr>
                  ))}
                  {(data.dailyContent ?? []).length === 0 && (
                    <tr><td colSpan={4} className="px-3 py-8 text-center text-text-muted">Aucun contenu quotidien</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Plans */}
          {data.contentPlans?.length > 0 && (
            <div className="rounded-lg border border-border bg-background-card p-4">
              <h4 className="mb-3 text-sm font-semibold text-text-secondary">Plans mensuels agents</h4>
              {data.contentPlans.map((plan: PlanningContentPlan, i: number) => (
                <div key={i} className="mb-4 last:mb-0">
                  <p className="mb-2 text-xs font-medium text-text-primary">
                    {plan.agentType} — {["Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Dec"][plan.month]}/{plan.year}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {plan.entries.map((entry: PlanningContentPlanEntry, j: number) => (
                      <span
                        key={j}
                        className={`rounded px-1.5 py-0.5 text-xs ${
                          entry.status === "PUBLISHED"
                            ? "bg-success/20 text-success"
                            : entry.status === "PLANNED"
                              ? "bg-warning/20 text-warning"
                              : "bg-background-elevated text-text-muted"
                        }`}
                        title={`J${entry.dayOfMonth}: ${entry.theme ?? entry.category}`}
                      >
                        J{entry.dayOfMonth}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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

function UserRow({ user, onSync }: { user: AdminUser; onSync: (userId: string) => void }) {
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
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onSync(user.id)}
          className="rounded px-2 py-1 text-xs text-accent-primary hover:bg-accent-primary/10 transition-colors"
          title="Synchroniser le plan avec Stripe"
        >
          Sync
        </button>
      </td>
    </tr>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

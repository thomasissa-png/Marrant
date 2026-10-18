"use client";

/**
 * Onglet « Planning » (déplacé de admin/page.tsx en s21) : plan éditorial du
 * blog, calendrier SEO, posts des réseaux, contenu du jour. Retiré en s21 :
 * « Plans mensuels agents » (agent mensuel IA abandonné le 01/10).
 */
import { useState } from "react";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { Erreur } from "./admin-ui";

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

interface PlanningData {
  currentWeek: number;
  blogPlan: PlanningBlogArticle[];
  blogStats: { total: number; published: number; planned: number; overdue: number };
  socialPosts: PlanningSocialPost[];
  socialStats: { total: number; pending: number; approved: number; published: number; failed: number };
  dailyContent: PlanningDailyContent[];
  hasTodayContent: boolean;
  seoCalendar: PlanningSeoCalendarEntry[];
}

export function PlanningTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [activeSection, setActiveSection] = useState<"blog" | "social" | "daily">("blog");
  const { data, error, loading, reload: onRefresh } = useAdminFetch<PlanningData>("/api/admin/planning", onUnauthorized);

  if (error && !data) return <Erreur message={error} onRetry={onRefresh} />;
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
          <p className="text-xs text-text-muted">Articles du plan</p>
          <p className="text-2xl font-bold text-text-primary">{data.blogStats?.published ?? 0}/{data.blogStats?.total ?? 0}</p>
          {data.blogStats?.overdue > 0 && (
            <p className="text-xs text-error">{data.blogStats.overdue} en retard</p>
          )}
        </div>
        <div className="rounded-lg border border-border bg-background-card p-4">
          <p className="text-xs text-text-muted">Posts publiés (30 j)</p>
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
      <div className="flex flex-wrap gap-2">
        {([
          { id: "blog" as const, label: "Blog / SEO" },
          { id: "social" as const, label: "Réseaux sociaux" },
          { id: "daily" as const, label: "Contenu du jour" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSection === tab.id
                ? "bg-accent-secondary-hover text-white"
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
          Actualiser
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
                      <th className="px-3 py-2">Mot-clé</th>
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
            <h4 className="mb-3 text-sm font-semibold text-text-secondary">Articles planifiés ({data.blogStats?.total ?? 0})</h4>
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
                    <th className="px-3 py-2">Publié le</th>
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
          <h3 className="font-display text-lg font-bold text-text-primary">Planning des réseaux sociaux</h3>
          <div className="rounded-lg border border-border bg-background-card p-4">
            <div className="mb-3 flex items-center gap-4 text-xs text-text-muted">
              <span>Total : {data.socialStats?.total ?? 0}</span>
              <span className="text-warning">En attente : {data.socialStats?.pending ?? 0}</span>
              <span className="text-success">Approuvés : {data.socialStats?.approved ?? 0}</span>
              <span className="text-success">Publiés : {data.socialStats?.published ?? 0}</span>
              {data.socialStats?.failed > 0 && <span className="text-error">Échecs : {data.socialStats.failed}</span>}
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
                      <td className="max-w-[200px] truncate px-3 py-2" title={post.hook ?? undefined}>{post.hook ?? "—"}</td>
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
          <h3 className="font-display text-lg font-bold text-text-primary">Contenu du jour (14 derniers jours, stock préparé)</h3>
          <div className="rounded-lg border border-border bg-background-card p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-muted">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Vanne</th>
                    <th className="px-3 py-2">Conseil</th>
                    <th className="px-3 py-2">Vidéo</th>
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

        </div>
      )}
    </div>
  );
}

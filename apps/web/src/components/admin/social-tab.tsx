"use client";

/**
 * Onglet « Réseaux sociaux » (déplacé de admin/page.tsx en s21). Les posts
 * viennent du stock préparé et partent par Buffer : plus de score « directeur
 * artistique » ni de statistiques X dans cette vue.
 */
import { useState } from "react";
import { adminAuthHeader, useAdminFetch } from "@/hooks/use-admin-fetch";
import { Erreur } from "./admin-ui";

type SocialFilter = "PENDING" | "APPROVED" | "PUBLISHED" | "REJECTED" | "FAILED" | "ALL";
type SocialStatusCounts = Record<string, number>;

type SocialPost = {
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
};

export function SocialTab({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [filter, onFilterChange] = useState<SocialFilter>("ALL");
  const params = new URLSearchParams({ limit: "100" });
  if (filter !== "ALL") params.set("status", filter);
  const { data, error, loading, reload: onRefresh } = useAdminFetch<{ posts?: SocialPost[]; statusCounts?: SocialStatusCounts }>(
    `/api/admin/social?${params}`,
    onUnauthorized,
  );
  const posts = data?.posts ?? [];
  const statusCounts = data?.statusCounts ?? {};
  const onAction = async (action: string, postIds: string[]) => {
    try {
      const res = await fetch("/api/admin/social", {
        method: "POST",
        headers: { ...adminAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ action, postIds }),
      });
      if (res.ok) void onRefresh();
      else window.alert("Action refusée par le serveur.");
    } catch {
      window.alert("Erreur réseau.");
    }
  };
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const pendingIds = posts.filter((p) => p.status === "PENDING").map((p) => p.id);

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Posts du stock préparé, publiés par Buffer. Réglages par réseau et relevé de publication :{" "}
        <a href="/admin/social" className="text-accent-primary hover:underline">/admin/social</a>.
      </p>
      {error && <Erreur message={error} onRetry={onRefresh} />}
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
          Aucun post pour ce filtre.
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
    TWITTER: "X",
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
    // Refonte s7 — formats canoniques
    MINI_STANDUP: "Mini-Stand-Up (TW)",
    POTE_AU_TAF: "Pote au Taf (LI)",
    IMAGE_QUI_CLAQUE: "Image qui claque (IG)",
    // Legacy (deprecated)
    TECHNIQUE_DU_JOUR: "Technique du Jour (legacy)",
    TWEET: "Tweet (legacy)",
    THREAD: "Thread (legacy)",
    QUOTE_ANALYSIS: "Quote Analyse (legacy)",
    POST: "Post (legacy)",
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
            Score : {post.directorScore}/10
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
          {/* eslint-disable-next-line @next/next/no-img-element -- aperçu admin généré à la volée */}
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
        <p className="mt-2 text-xs italic text-text-muted">CTA : {post.cta}</p>
      )}

      {/* Director note */}
      {post.directorNote && (
        <p className="mt-2 rounded bg-background-elevated px-2 py-1 text-xs text-text-muted">
          Note : {post.directorNote}
        </p>
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

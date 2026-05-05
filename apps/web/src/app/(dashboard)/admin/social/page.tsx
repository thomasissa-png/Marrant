"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

interface SocialPost {
  id: string;
  platform: string;
  format: string;
  hook: string;
  content: string;
  threadParts: string[];
  cta: string;
  hashtags: string[];
  targetPersona: string;
  sourceType: string | null;
  directorScore: number | null;
  directorNote: string | null;
  status: string;
  scheduledAt: string;
  publishedAt: string | null;
  externalId: string | null;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  clicks: number;
}

type TabStatus = "PENDING" | "APPROVED" | "PUBLISHED" | "REJECTED";

const PLATFORM_ICONS: Record<string, string> = {
  TWITTER: "𝕏",
  LINKEDIN: "in",
  INSTAGRAM: "📷",
};

const FORMAT_LABELS: Record<string, string> = {
  // Refonte s7 — formats canoniques
  MINI_STANDUP: "Mini-Stand-Up",
  POTE_AU_TAF: "Pote au Taf",
  IMAGE_QUI_CLAQUE: "Image qui claque",
  // Legacy (deprecated)
  TWEET: "Tweet (legacy)",
  THREAD: "Thread (legacy)",
  POST: "Post (legacy)",
  QUOTE_ANALYSIS: "Quote Analyse (legacy)",
  TECHNIQUE_DU_JOUR: "Technique du Jour (legacy)",
};

const PERSONA_COLORS: Record<string, string> = {
  YANIS: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  SOPHIE: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  MARC: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

export default function AdminSocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<TabStatus>("PENDING");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Auth headers for admin API
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminPassword}`,
  };

  const fetchPosts = useCallback(async () => {
    if (!adminPassword) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/social?status=${activeTab}${showAll ? "&all=true" : ""}`, {
        headers: { Authorization: `Bearer ${adminPassword}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthed(false);
          toast("Mot de passe admin incorrect", "error");
          return;
        }
        throw new Error("Erreur chargement");
      }
      setIsAuthed(true);
      const data = await res.json();
      setPosts(data.posts);
      setStatusCounts(data.statusCounts);
    } catch {
      toast("Erreur lors du chargement des posts", "error");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, adminPassword, showAll]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAction = async (
    action: string,
    postIds?: string[],
  ) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/social", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ action, postIds }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(data.message, "success");
        setSelectedIds(new Set());
        fetchPosts();
      } else {
        toast(data.error || "Erreur", "error");
      }
    } catch {
      toast("Erreur réseau", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabs: { status: TabStatus; label: string }[] = [
    { status: "PENDING", label: "En attente" },
    { status: "APPROVED", label: "Approuvés" },
    { status: "PUBLISHED", label: "Publiés" },
    { status: "REJECTED", label: "Rejetés" },
  ];

  // Login form if not authed
  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-md py-20">
        <Card>
          <CardHeader>
            <CardTitle>Admin Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchPosts();
              }}
              className="space-y-4"
            >
              <input
                type="password"
                placeholder="Mot de passe admin"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background-elevated px-4 py-2 text-sm"
              />
              <Button variant="primary" type="submit" className="w-full">
                Connexion
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Social Media</h1>
        <p className="mt-2 text-text-secondary">
          Valide les posts avant publication. 1 clic, c&apos;est tout.
        </p>
      </div>

      {/* Status tabs */}
      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            onClick={() => setActiveTab(tab.status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.status
                ? "bg-accent-primary text-white"
                : "bg-background-elevated text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {statusCounts[tab.status] ? (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {statusCounts[tab.status]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Toggle show past posts */}
      {activeTab !== "PUBLISHED" && activeTab !== "REJECTED" && (
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Afficher les posts passés
          </label>
        </div>
      )}

      {/* Batch actions for PENDING */}
      {activeTab === "PENDING" && posts.length > 0 && (
        <div className="mb-4 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAction("approve_all")}
            disabled={actionLoading}
          >
            {actionLoading ? "..." : "Tout approuver"}
          </Button>
          {selectedIds.size > 0 && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  handleAction("approve", Array.from(selectedIds))
                }
                disabled={actionLoading}
              >
                Approuver ({selectedIds.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleAction("reject", Array.from(selectedIds))
                }
                disabled={actionLoading}
              >
                Rejeter ({selectedIds.size})
              </Button>
            </>
          )}
        </div>
      )}

      {/* Posts list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-6">
                <div className="h-4 w-1/3 rounded bg-background-elevated" />
                <div className="mt-3 h-20 w-full rounded bg-background-elevated" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">
              Aucun post {activeTab === "PENDING" ? "en attente" : activeTab.toLowerCase()}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={
                selectedIds.has(post.id)
                  ? "border-accent-primary"
                  : ""
              }
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeTab === "PENDING" && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(post.id)}
                        onChange={() => toggleSelect(post.id)}
                        disabled={(post.directorScore ?? 0) < 9}
                        title={(post.directorScore ?? 0) < 9 ? "Score < 9 — non approuvable" : undefined}
                        className="h-4 w-4 rounded border-border disabled:opacity-30"
                      />
                    )}
                    <span className="text-lg">
                      {PLATFORM_ICONS[post.platform] || post.platform}
                    </span>
                    <Badge variant="secondary">
                      {FORMAT_LABELS[post.format] || post.format}
                    </Badge>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
                        PERSONA_COLORS[post.targetPersona] || ""
                      }`}
                    >
                      {post.targetPersona}
                    </span>
                    {post.directorScore != null && (
                      <span className={`text-xs font-medium ${post.directorScore >= 9 ? "text-green-400" : "text-red-400"}`}>
                        Score: {post.directorScore}/10
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(post.scheduledAt).toLocaleString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Hook highlight */}
                <p className="mb-2 text-sm font-bold text-accent-primary">
                  {post.hook}
                </p>

                {/* Content */}
                {post.format === "THREAD" && post.threadParts.length > 0 ? (
                  <div className="space-y-2">
                    {post.threadParts.map((part, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-background-elevated p-3 text-sm"
                      >
                        <span className="mr-2 text-xs font-bold text-text-muted">
                          {i + 1}/{post.threadParts.length}
                        </span>
                        {part}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm text-text-secondary">
                    {post.content}
                  </p>
                )}

                {/* CTA */}
                {post.cta && (
                  <p className="mt-2 text-xs italic text-text-muted">
                    CTA: {post.cta}
                  </p>
                )}

                {/* Hashtags */}
                {post.hashtags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-background-elevated px-1.5 py-0.5 text-xs text-text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Analytics for published */}
                {post.status === "PUBLISHED" && (
                  <div className="mt-3 flex gap-4 text-xs text-text-muted">
                    <span>{post.impressions} vues</span>
                    <span>{post.likes} likes</span>
                    <span>{post.retweets} RT</span>
                    <span>{post.replies} replies</span>
                    <span>{post.clicks} clics</span>
                  </div>
                )}

                {/* Individual actions */}
                {activeTab === "PENDING" && (
                  <div className="mt-3 flex flex-col gap-2">
                    {(post.directorScore ?? 0) < 9 && (
                      <p className="text-xs font-medium text-red-400">
                        Score {post.directorScore ?? "?"}/10 — trop bas pour approuver. Le pipeline automatique gère les retries.
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAction("approve", [post.id])}
                        disabled={actionLoading || (post.directorScore ?? 0) < 9}
                      >
                        Approuver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction("reject", [post.id])}
                        disabled={actionLoading}
                      >
                        Rejeter
                      </Button>
                    </div>
                  </div>
                )}

                {/* Director note */}
                {post.directorNote && (
                  <p className="mt-2 rounded bg-background-elevated p-2 text-xs italic text-text-muted">
                    Directeur : {post.directorNote}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

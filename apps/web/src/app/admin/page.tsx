"use client";

import { useState, useEffect, useCallback } from "react";

interface Stats {
  users: number;
  jokes: number;
  tips: number;
  videos: number;
  paths: number;
  favorites: number;
}

const AGENTS = [
  {
    name: "Agent Design",
    status: "actif",
    mission: "Design system, identité visuelle, palette, typographie, composants",
    recent: [
      "Palette 100% violet implémentée (primary #8B5CF6, secondary #6D28D9)",
      "Contraste text-muted corrigé (#9A9A9A — WCAG AA)",
      "Focus-visible + keyboard nav sur les cards",
      "Composant XpNotification avec animation float",
    ],
    phase: "Phase 4 — Post-audit",
  },
  {
    name: "Agent UX",
    status: "actif",
    mission: "Parcours utilisateur, navigation, layout, interactions, onboarding, rétention",
    recent: [
      "Layout partagé avec Header/Footer",
      "Page 404 personnalisée",
      "Navigation active indicator",
      "Quiz d'onboarding + Hero section adaptative",
      "Boutons favori/partage inline",
      "Barre de recherche globale",
    ],
    phase: "Phase 4 — Post-audit",
  },
  {
    name: "Agent Blagues",
    status: "terminé",
    mission: "Produire les blagues (contenu, punchline, catégorisation)",
    recent: [
      "200 blagues rédigées (8 catégories)",
      "6 nouvelles catégories jeunes (École, Gaming, Dating…)",
      "120 blagues additionnelles",
      "Système de réactions (🔥/💀)",
    ],
    phase: "Terminé",
  },
  {
    name: "Agent Conseils",
    status: "terminé",
    mission: "Produire les conseils humour (techniques, exemples, exercices)",
    recent: [
      "50 conseils rédigés (7 catégories, 3 niveaux)",
      "4 parcours d'apprentissage guidés",
      "Gain d'XP à la lecture des conseils",
    ],
    phase: "Terminé",
  },
  {
    name: "Agent Stand-up",
    status: "terminé",
    mission: "Sélectionner et structurer les vidéos stand-up",
    recent: [
      "30 vidéos sélectionnées (10 humoristes)",
      "Vrais YouTube IDs validés",
      "Descriptions et techniques identifiées",
    ],
    phase: "Terminé",
  },
  {
    name: "Agent SEO",
    status: "actif",
    mission: "Référencement naturel (metadata, sitemap, robots.txt)",
    recent: [
      "Metadata SEO sur toutes les pages",
      "PWA manifest + robots.txt + sitemap.xml",
      "Open Graph tags",
    ],
    phase: "Phase 4 — Post-audit",
  },
  {
    name: "Agent Test",
    status: "actif",
    mission: "Garantir la qualité du code par les tests",
    recent: [
      "43 suites de tests, 473+ tests unitaires",
      "Couverture : composants UI, pages, stores, libs",
      "Pre-commit hook : lint + tests obligatoires",
    ],
    phase: "Continu",
  },
  {
    name: "Agent Auditeur",
    status: "terminé",
    mission: "Auditer chaque agent dans son périmètre",
    recent: [
      "Audit design complet : note 7.5/10",
      "25 améliorations identifiées (6 haute priorité)",
      "Évaluation personas : Yanis 7/10, Sophie 8/10, Marc 7.5/10",
    ],
    phase: "Terminé",
  },
];

const PHASES = [
  { name: "Phase 1 — Fondations", status: "terminée", progress: 100 },
  { name: "Phase 2 — Contenu", status: "terminée", progress: 100 },
  { name: "Phase 3 — Fonctionnalités", status: "terminée", progress: 100 },
  { name: "Phase 4 — Post-audit", status: "en cours", progress: 75 },
  { name: "Phase 5 — Intégrations", status: "à venir", progress: 0 },
  { name: "Phase 6 — Déploiement", status: "à venir", progress: 0 },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);

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
      } else {
        const data = await res.json();
        setError(data.error || "Erreur d'authentification");
      }
    } catch {
      setError("Erreur réseau");
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // Stats optionnelles
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchStats();
  }, [isAuthenticated, fetchStats]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg border border-border bg-background-card p-8">
          <h1 className="mb-6 text-center font-display text-2xl font-bold text-text-primary">
            Admin — deviensmarrant
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
            {error && (
              <p className="text-sm text-error">{error}</p>
            )}
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

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Backoffice — deviensmarrant
            </h1>
            <p className="mt-1 text-text-muted">Vue d&apos;ensemble du projet et des agents</p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_auth");
              setIsAuthenticated(false);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-background-elevated"
          >
            Déconnexion
          </button>
        </div>

        {/* Stats rapides */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Utilisateurs", value: stats.users },
              { label: "Blagues", value: stats.jokes },
              { label: "Conseils", value: stats.tips },
              { label: "Vidéos", value: stats.videos },
              { label: "Parcours", value: stats.paths },
              { label: "Favoris", value: stats.favorites },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-background-card p-4 text-center"
              >
                <p className="text-2xl font-bold text-accent-primary">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Planning des phases */}
        <section className="mb-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            Planning des phases
          </h2>
          <div className="space-y-3">
            {PHASES.map((phase) => (
              <div
                key={phase.name}
                className="flex items-center gap-4 rounded-lg border border-border bg-background-card p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{phase.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        phase.status === "terminée"
                          ? "bg-success/20 text-success"
                          : phase.status === "en cours"
                          ? "bg-accent-primary/20 text-accent-primary"
                          : "bg-background-elevated text-text-muted"
                      }`}
                    >
                      {phase.status}
                    </span>
                  </div>
                </div>
                <div className="w-32">
                  <div className="h-2 overflow-hidden rounded-full bg-background-elevated">
                    <div
                      className={`h-full rounded-full transition-all ${
                        phase.progress === 100
                          ? "bg-success"
                          : phase.progress > 0
                          ? "bg-accent-primary"
                          : "bg-background-elevated"
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-sm text-text-muted">
                  {phase.progress}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Équipe d'agents */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            Équipe d&apos;agents — Qui fait quoi
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="rounded-lg border border-border bg-background-card p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display font-bold text-text-primary">{agent.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      agent.status === "actif"
                        ? "bg-accent-primary/20 text-accent-primary"
                        : "bg-success/20 text-success"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                <p className="mb-3 text-sm text-text-secondary">{agent.mission}</p>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {agent.phase}
                </p>
                <ul className="space-y-1">
                  {agent.recent.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Configuration Replit */}
        <section className="mt-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            Configuration requise (Secrets Replit)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border bg-background-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Variable</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Requis</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-primary">Description</th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[
                  ["DATABASE_URL", "Oui", "URL PostgreSQL Replit"],
                  ["NEXTAUTH_SECRET", "Oui", "Clé secrète NextAuth (random string)"],
                  ["NEXTAUTH_URL", "Oui", "URL publique Replit"],
                  ["ADMIN_PASSWORD", "Oui", "Mot de passe backoffice admin"],
                  ["GOOGLE_CLIENT_ID", "Non", "OAuth Google (login social)"],
                  ["GOOGLE_CLIENT_SECRET", "Non", "OAuth Google (login social)"],
                  ["STRIPE_SECRET_KEY", "Non", "Stripe (paiements premium)"],
                  ["STRIPE_PUBLISHABLE_KEY", "Non", "Stripe (frontend)"],
                  ["YOUTUBE_API_KEY", "Non", "API YouTube (métadonnées vidéos)"],
                  ["ANTHROPIC_API_KEY", "Non", "Claude API (génération de contenu)"],
                ].map(([name, required, desc]) => (
                  <tr key={name} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-mono text-accent-primary">{name}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          required === "Oui"
                            ? "bg-error/20 text-error"
                            : "bg-background-elevated text-text-muted"
                        }`}
                      >
                        {required}
                      </span>
                    </td>
                    <td className="px-4 py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

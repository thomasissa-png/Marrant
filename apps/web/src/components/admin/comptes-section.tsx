"use client";

/**
 * Abonnés Premium et comptes du site (API /api/admin/users inchangée).
 * s21 : colonnes de l'ancienne gamification (XP, streak, favoris) retirées ;
 * cartes sur téléphone, table à partir de 768 px.
 */
import { useState } from "react";
import { adminAuthHeader, useAdminFetch } from "@/hooks/use-admin-fetch";
import { Chargement, Erreur, Note, Pagination, Pastille, Section, dateCourte } from "./admin-ui";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  plan: "FREE" | "PREMIUM";
  lastActiveAt: string | null;
  createdAt: string;
  subscription: { status: string; currentPeriodEnd: string | null } | null;
};

type Reponse = { users: AdminUser[]; pagination: { page: number; total: number; totalPages: number } };
type Filtre = "all" | "premium" | "free";

const STATUTS: Record<string, { label: string; ton: "success" | "warning" | "error" | "neutre" }> = {
  ACTIVE: { label: "Actif", ton: "success" },
  CANCELED: { label: "Résilié", ton: "warning" },
  PAST_DUE: { label: "Impayé", ton: "error" },
  INACTIVE: { label: "Inactif", ton: "neutre" },
};

function Abonnement({ u }: { u: AdminUser }) {
  const s = u.subscription?.status;
  if (!s) return <span className="text-xs text-text-muted">aucun</span>;
  const st = STATUTS[s] ?? { label: s, ton: "neutre" as const };
  return <Pastille ton={st.ton}>{st.label}</Pastille>;
}

export function ComptesSection({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [page, setPage] = useState(1);
  const [filtre, setFiltre] = useState<Filtre>("premium");
  const [saisie, setSaisie] = useState("");
  const [q, setQ] = useState("");
  const params = new URLSearchParams({ page: String(page), limit: "25", filter: filtre, sort: "recent" });
  if (q) params.set("q", q);
  const { data, error, loading, reload } = useAdminFetch<Reponse>(`/api/admin/users?${params}`, onUnauthorized);

  const sync = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { ...adminAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string; plan?: string; error?: string };
      window.alert(res.ok ? body.message ?? `Plan : ${body.plan}` : body.error ?? "Erreur de synchronisation");
      if (res.ok) void reload();
    } catch {
      window.alert("Erreur de connexion");
    }
  };

  // Revue visuelle s21 (R25) : colonne « Dernière activité » masquée tant qu'aucun compte affiché n'en a.
  const activiteConnue = data?.users.some((u) => u.lastActiveAt) ?? false;

  return (
    <Section titre="Comptes et abonnés Premium" sousTitre="Abonnement obligatoire depuis le 06/10 : « Gratuit » = anciens comptes">
      <div className="flex flex-wrap items-center gap-2">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQ(saisie.trim());
          }}
          className="flex w-full gap-2 sm:w-auto"
        >
          <label htmlFor="recherche-comptes" className="sr-only">Rechercher un compte</label>
          <input
            id="recherche-comptes"
            type="search"
            placeholder="E-mail ou nom"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary sm:w-56"
          />
          <button type="submit" className="rounded-lg bg-accent-secondary-hover px-3 py-2 text-sm font-medium text-white hover:bg-accent-secondary">
            Chercher
          </button>
        </form>
        <label htmlFor="filtre-comptes" className="sr-only">Plan</label>
        <select
          id="filtre-comptes"
          value={filtre}
          onChange={(e) => {
            setPage(1);
            setFiltre(e.target.value as Filtre);
          }}
          className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary"
        >
          <option value="premium">Premium</option>
          <option value="all">Tous les comptes</option>
          <option value="free">Gratuit (anciens comptes)</option>
        </select>
        {data && <span className="ml-auto text-sm text-text-muted">{data.pagination.total} compte(s)</span>}
      </div>

      {error && <Erreur message={error} onRetry={reload} />}
      {loading && !data && <Chargement />}
      {data && data.users.length === 0 && <Note>Aucun compte trouvé.</Note>}
      {data && data.users.length > 0 && (
        <>
          <ul className="space-y-2 md:hidden">
            {data.users.map((u) => (
              <li key={u.id} className="rounded-lg border border-border bg-background-card p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">{u.name || "Sans nom"}</p>
                    <p className="break-all text-xs text-text-muted">{u.email}</p>
                  </div>
                  <Pastille ton={u.plan === "PREMIUM" ? "accent" : "neutre"}>{u.plan === "PREMIUM" ? "Premium" : "Gratuit"}</Pastille>
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                  <Abonnement u={u} />
                  <span>Créé le {dateCourte(u.createdAt)}</span>
                  {u.subscription?.currentPeriodEnd && <span>Fin de période {dateCourte(u.subscription.currentPeriodEnd)}</span>}
                  <button type="button" onClick={() => sync(u.id)} className="ml-auto inline-flex min-h-11 items-center rounded-md px-3 text-accent-primary hover:bg-accent-primary/10">Sync Stripe</button>
                </p>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto rounded-lg border border-border bg-background-card md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-elevated text-left text-xs text-text-muted">
                  <th className="px-3 py-2 font-medium">Compte</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 font-medium">Abonnement</th>
                  <th className="px-3 py-2 font-medium">Créé le</th>
                  {activiteConnue && <th className="px-3 py-2 font-medium">Dernière activité</th>}
                  <th className="px-3 py-2 font-medium">Fin de période</th>
                  <th className="px-3 py-2"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u.id} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2">
                      <p className="font-medium text-text-primary">{u.name || "Sans nom"}</p>
                      <p className="text-xs text-text-muted">{u.email}</p>
                    </td>
                    <td className="px-3 py-2"><Pastille ton={u.plan === "PREMIUM" ? "accent" : "neutre"}>{u.plan === "PREMIUM" ? "Premium" : "Gratuit"}</Pastille></td>
                    <td className="px-3 py-2"><Abonnement u={u} /></td>
                    <td className="px-3 py-2 text-xs text-text-muted">{dateCourte(u.createdAt)}</td>
                    {activiteConnue && <td className="px-3 py-2 text-xs text-text-muted">{u.lastActiveAt ? dateCourte(u.lastActiveAt) : "jamais"}</td>}
                    <td className="px-3 py-2 text-xs text-text-muted">{dateCourte(u.subscription?.currentPeriodEnd)}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => sync(u.id)} title="Synchroniser le plan avec Stripe" className="inline-flex min-h-11 items-center rounded-md px-3 text-sm text-accent-primary hover:bg-accent-primary/10">
                        Sync
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPage={setPage} />
        </>
      )}
    </Section>
  );
}

"use client";

/**
 * Lettre de la semaine (hebdo Premium, s21, spec US-H7), sous les inscrits de la mensuelle
 * dans Abonnés › Lettre : interrupteurs, compteurs (comptes de test à part), numéros et
 * stock, liste des comptes, actions « Arrêter », « Envoyer la proposition » (aperçu du
 * texte avant envoi), « Envoyer un aperçu à mon adresse ». Les numéros à approuver (s22,
 * mensuelle et hebdo) sont en tête de la vue Lettre (`abonnes-tab.tsx`). Jamais de jeton ici.
 */
import { useState } from "react";
import { adminAuthHeader, useAdminFetch } from "@/hooks/use-admin-fetch";
import { PROPOSITION_LETTRE_HEBDO } from "@/config/textes/lettre-hebdo-s21";
import type { LettreHebdoResume } from "@/lib/analytics/weekly-lettre-hebdo";
import type { CompteHebdo, ListeHebdo } from "@/lib/admin/lettre-hebdo-comptes";
import { Avertissement, Chargement, Erreur, KpiCard, Note, Pagination, Pastille, Section, dateCourte, dateHeure, fmt } from "./admin-ui";

type Reponse = { disponible: true; resume: LettreHebdoResume; liste: ListeHebdo } | { disponible: false; raison: string };
type Filtre = "" | "actives" | "arretees" | "premium-sans";

const origines = (p: Record<string, number>) => (Object.keys(p).length ? Object.entries(p).map(([o, n]) => `${fmt(n)} ${o}`).join(", ") : "aucune");

async function poster(url: string, corps?: unknown): Promise<{ ok: boolean; status: number; data: Record<string, unknown> | null }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { ...adminAuthHeader(), "Content-Type": "application/json" },
    body: corps === undefined ? undefined : JSON.stringify(corps),
    signal: AbortSignal.timeout(20_000),
  });
  return { ok: res.ok, status: res.status, data: (await res.json().catch(() => null)) as Record<string, unknown> | null };
}

export function LettreHebdoSection({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [page, setPage] = useState(1);
  const [filtre, setFiltre] = useState<Filtre>("");
  const [message, setMessage] = useState<string | null>(null);
  const [proposition, setProposition] = useState<CompteHebdo | null>(null);
  const params = new URLSearchParams({ page: String(page), limit: "25" });
  if (filtre) params.set("statut", filtre);
  const { data, error, loading, reload } = useAdminFetch<Reponse>(`/api/admin/lettre-premium?${params}`, onUnauthorized);

  async function action(url: string, corps: unknown, succes: string) {
    setMessage(null);
    try {
      const r = await poster(url, corps);
      if (r.status === 401) return onUnauthorized();
      setMessage(r.ok ? succes : String(r.data?.error ?? `Erreur ${r.status}`));
      if (r.ok) reload();
    } catch {
      setMessage("Action impossible (réseau).");
    }
  }

  return (
    <Section
      titre="Lettre de la semaine (Premium)"
      sousTitre="Opt-in, arrêt en un clic. Jamais de jeton d'arrêt ici ; l'admin n'active jamais la lettre pour quelqu'un."
      action={
        <button type="button" className="rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-background-elevated" onClick={() => void action("/api/admin/lettre-premium/apercu", undefined, "Aperçu envoyé à ton adresse.")}>
          Envoyer un aperçu à mon adresse
        </button>
      }
    >
      {message && <p role="status" className="text-sm text-text-secondary">{message}</p>}
      {error && <Erreur message={error} onRetry={reload} />}
      {loading && !data && <Chargement />}
      {data && !data.disponible && <Avertissement>{data.raison}</Avertissement>}
      {data && data.disponible && (
        <>
          <Resume r={data.resume} />
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="filtre-hebdo" className="text-sm text-text-muted">Comptes</label>
            <select
              id="filtre-hebdo"
              value={filtre}
              onChange={(e) => {
                setPage(1);
                setFiltre(e.target.value as Filtre);
              }}
              className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary"
            >
              <option value="">Avec une ligne</option>
              <option value="actives">Lettre active</option>
              <option value="arretees">Arrêtée</option>
              <option value="premium-sans">Premium sans la lettre</option>
            </select>
            <span className="ml-auto text-sm text-text-muted">{data.liste.pagination.total} compte(s), comptes de test compris</span>
          </div>
          {data.liste.comptes.length === 0 ? (
            <Note>Personne n’a encore activé la lettre de la semaine.</Note>
          ) : (
            <ul className="space-y-2">
              {data.liste.comptes.map((c) => (
                <li key={c.userId} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background-card p-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary [overflow-wrap:anywhere]">
                      {c.email} {c.compteTest && <Pastille ton="accent">test</Pastille>} {!c.premium && <Pastille>sans Premium</Pastille>}
                    </p>
                    <p className="text-xs text-text-muted">
                      {c.enabled
                        ? `Active depuis le ${dateCourte(c.activatedAt)} (${c.activationOrigin ?? "origine inconnue"})`
                        : c.stoppedAt
                          ? `Arrêtée le ${dateCourte(c.stoppedAt)} (${c.stopOrigin ?? "origine inconnue"})`
                          : "Jamais activée"}
                      {c.proposedAt ? ` · proposition envoyée le ${dateCourte(c.proposedAt)}` : ""}
                    </p>
                  </div>
                  {c.enabled ? (
                    <button type="button" className="rounded-md border border-border px-3 py-1.5 text-error" onClick={() => void action("/api/admin/lettre-premium/arret", { userId: c.userId }, "Arrêtée.")}>
                      Arrêter
                    </button>
                  ) : c.premium && !c.proposedAt ? (
                    <button type="button" className="rounded-md border border-border px-3 py-1.5 text-text-secondary" onClick={() => setProposition(c)}>
                      Envoyer la proposition
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          <Pagination page={data.liste.pagination.page} totalPages={data.liste.pagination.totalPages} onPage={setPage} />
          {proposition && (
            <div className="rounded-lg border border-accent-primary/40 bg-background-card p-3 text-sm" role="dialog" aria-label="Aperçu de la proposition">
              <p className="font-semibold text-text-primary">Proposition à {proposition.email} (une seule fois, brouillon validé avant envoi)</p>
              <p className="mt-2 text-text-secondary">Objet : {PROPOSITION_LETTRE_HEBDO.sujet}</p>
              <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-text-secondary">{PROPOSITION_LETTRE_HEBDO.corps("https://deviens-marrant.fr")}</pre>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-md bg-accent-primary px-3 py-1.5 text-white"
                  onClick={() => {
                    const cible = proposition;
                    setProposition(null);
                    void action("/api/admin/lettre-premium/proposition", { userIds: [cible.userId] }, "Proposition envoyée à 1 compte.");
                  }}
                >
                  Envoyer
                </button>
                <button type="button" className="rounded-md border border-border px-3 py-1.5" onClick={() => setProposition(null)}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

function Resume({ r }: { r: LettreHebdoResume }) {
  const i = r.interrupteurs;
  const etat = (
    <Note>
      Interrupteurs : inscriptions {i.inscriptions ? "ouvertes" : "fermées"}, envois {i.envois ? "ouverts" : "fermés"}, promesse {i.promesse ? "affichée" : "masquée"}.
    </Note>
  );
  if (r.etat === "ferme") return etat;
  if (r.etat !== "ok") return <>{etat}<Avertissement>Les chiffres n’ont pas pu être lus : {r.detail}.</Avertissement></>;
  return (
    <div className="space-y-3">
      {etat}
      {r.retard && <Avertissement>Numéro {r.retard} validé mais pas parti (vendredi midi passé).</Avertissement>}
      {r.alerteStock && <Avertissement>Alerte stock : {fmt(r.stock)} numéro(s) validé(s) à venir, sous le seuil de 4.</Avertissement>}
      {r.nonEnvoyes.length > 0 && <Avertissement>Non envoyé(s) : {r.nonEnvoyes.join(", ")}.</Avertissement>}
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Lettre active" value={fmt(r.actives)} color="success" subtitle="hors comptes de test" />
        <KpiCard label="Premium sans" value={fmt(r.premiumSansHebdo)} subtitle="mensuelle à la place" />
        <KpiCard label="Stock à venir" value={fmt(r.stock)} color={r.alerteStock ? "warning" : undefined} subtitle="numéros validés" />
      </div>
      <Note>Arrêtées par origine : {origines(r.arreteesParOrigine)}.{r.comptesTest ? ` ${fmt(r.comptesTest)} compte(s) de test hors compteurs.` : ""}</Note>
      <p className="text-sm text-text-secondary">
        Prochain : {r.prochain ? <><strong className="text-text-primary">{r.prochain.semaine}</strong>, « {r.prochain.objet} », {dateHeure(r.prochain.envoiPrevu)}</> : "aucun numéro préparé"}
      </p>
      {r.dernier && (
        <p className="text-sm text-text-secondary">
          Dernier jeudi ({r.dernier.semaine}) : {fmt(r.dernier.envoyes)} envoyés, {fmt(r.dernier.echecs)} échecs
          {r.dernier.enCours ? `, ${fmt(r.dernier.enCours)} en cours` : ""}
          {r.dernier.dontTest ? `, dont ${fmt(r.dernier.dontTest)} compte(s) de test` : ""}
        </p>
      )}
    </div>
  );
}

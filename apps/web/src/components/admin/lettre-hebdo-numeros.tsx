"use client";

/**
 * Lettre de la semaine (s22) : numéros à relire puis approuver, un par un. Décision de Thomas
 * du 25/10 : aucun numéro ne part sans son approbation. Le bouton « Approuver ce numéro »
 * n'apparaît qu'après ouverture du texte complet (tel qu'il partira) et renvoie l'empreinte
 * de ce texte : si le numéro a changé entre-temps, le serveur refuse.
 */
import { useState } from "react";
import { adminAuthHeader, useAdminFetch } from "@/hooks/use-admin-fetch";
import type { NumeroHebdoAdmin } from "@/lib/admin/lettre-hebdo-numeros";
import { Avertissement, Chargement, Erreur, Note, Pastille, dateHeure } from "./admin-ui";

type Reponse = { disponible: true; numeros: NumeroHebdoAdmin[] } | { disponible: false; raison: string };

function Etat({ n }: { n: NumeroHebdoAdmin }) {
  if (n.statut === "BROUILLON") return <Pastille>Brouillon, relecture à l’aveugle d’abord</Pastille>;
  if (n.approuve) return <Pastille ton="success">Approuvé le {dateHeure(n.approuveLe)}</Pastille>;
  if (n.approbationPerimee) return <Pastille ton="error">Modifié depuis ton approbation : à réapprouver</Pastille>;
  return <Pastille ton="warning">Validé, en attente de ton approbation</Pastille>;
}

export function LettreHebdoNumeros({ onUnauthorized }: { onUnauthorized: () => void }) {
  const { data, error, loading, reload } = useAdminFetch<Reponse>("/api/admin/lettre-premium/numeros", onUnauthorized);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function envoyer(method: "POST" | "DELETE", corps: Record<string, string>, succes: string) {
    setMessage(null);
    setEnCours(true);
    try {
      const res = await fetch("/api/admin/lettre-premium/approbation", {
        method,
        headers: { ...adminAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(corps),
        signal: AbortSignal.timeout(20_000),
      });
      if (res.status === 401) return onUnauthorized();
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setMessage(res.ok ? succes : (body?.error ?? `Erreur ${res.status}`));
      reload();
    } catch {
      setMessage("Action impossible (réseau).");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-text-primary">Numéros à approuver</h3>
      <Note>Un numéro ne part que s’il est validé ET approuvé ici pour son texte exact. Toute modification annule l’approbation.</Note>
      {message && <p role="status" className="text-sm text-text-secondary">{message}</p>}
      {error && <Erreur message={error} onRetry={reload} />}
      {loading && !data && <Chargement />}
      {data && !data.disponible && <Avertissement>{data.raison}</Avertissement>}
      {data && data.disponible && data.numeros.length === 0 && <Note>Aucun numéro préparé à venir.</Note>}
      {data && data.disponible && (
        <ul className="space-y-2">
          {data.numeros.map((n) => (
            <li key={n.semaine} className="rounded-lg border border-border bg-background-card p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="min-w-0 text-text-secondary">
                  <strong className="text-text-primary">{n.semaine}</strong>, {dateHeure(n.envoiPrevu)} : « {n.objet} »
                </p>
                <Etat n={n} />
              </div>
              <button
                type="button"
                aria-expanded={ouvert === n.semaine}
                className="mt-2 rounded-md border border-border px-3 py-1.5 text-text-secondary hover:bg-background-elevated"
                onClick={() => setOuvert(ouvert === n.semaine ? null : n.semaine)}
              >
                {ouvert === n.semaine ? "Fermer" : "Relire le numéro"}
              </button>
              {ouvert === n.semaine && (
                <div className="mt-2 rounded-md border border-border/60 p-3">
                  <p className="text-text-secondary">Objet : {n.objet}</p>
                  {n.preEntete && <p className="text-xs text-text-muted">Pré-en-tête : {n.preEntete}</p>}
                  <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap text-xs text-text-secondary">{n.texte}</pre>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {n.statut === "VALIDE" && !n.approuve && (
                      <button
                        type="button"
                        disabled={enCours}
                        className="rounded-md bg-accent-primary px-3 py-1.5 text-white disabled:opacity-60"
                        onClick={() => void envoyer("POST", { semaine: n.semaine, empreinte: n.empreinte }, `Numéro ${n.semaine} approuvé.`)}
                      >
                        Approuver ce numéro
                      </button>
                    )}
                    {n.approuve && (
                      <button
                        type="button"
                        disabled={enCours}
                        className="rounded-md border border-border px-3 py-1.5 text-error disabled:opacity-60"
                        onClick={() => void envoyer("DELETE", { semaine: n.semaine }, `Approbation du numéro ${n.semaine} retirée.`)}
                      >
                        Retirer l’approbation
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

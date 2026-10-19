"use client";

/**
 * Inscrits à la lettre mensuelle (s21, API /api/admin/lettre) : compteurs par
 * statut et par emplacement (comptes de test exclus), numéros, liste paginée.
 */
import { useState } from "react";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import type { LettreResume, LettreNumero } from "@/lib/analytics/weekly-lettre";
import type { ListeLettre, InscritLettre } from "@/lib/admin/lettre-inscrits";
import { Avertissement, Chargement, Erreur, KpiCard, Note, Pagination, Pastille, Section, dateCourte, dateHeure, fmt } from "./admin-ui";

type Reponse = { disponible: true; resume: LettreResume; liste: ListeLettre } | { disponible: false; raison: string };
type Statut = "" | InscritLettre["statut"];

const STATUTS: Record<InscritLettre["statut"], { label: string; ton: "success" | "warning" | "neutre" }> = {
  PENDING: { label: "En attente", ton: "warning" },
  CONFIRMED: { label: "Confirmé", ton: "success" },
  UNSUBSCRIBED: { label: "Désinscrit", ton: "neutre" },
};

const EMPLACEMENTS: Record<string, string> = {
  article: "Article du blog",
  quiz: "Quiz",
  page: "Page /lettre",
  parcours: "Parcours",
  autre: "Autre ou inconnu",
};

const STATUT_NUMERO: Record<LettreNumero["statut"], string> = { BROUILLON: "Brouillon, à valider", VALIDE: "Validé", ENVOYE: "Envoyé" };

function OuiNon({ oui }: { oui: boolean }) {
  return oui ? <span className="text-success">oui</span> : <span className="text-text-muted">non</span>;
}

export function LettreSection({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [page, setPage] = useState(1);
  const [statut, setStatut] = useState<Statut>("");
  const params = new URLSearchParams({ page: String(page), limit: "25" });
  if (statut) params.set("statut", statut);
  const { data, error, loading, reload } = useAdminFetch<Reponse>(`/api/admin/lettre?${params}`, onUnauthorized);

  return (
    <Section titre="Inscrits à la lettre" sousTitre="Lettre mensuelle gratuite, double confirmation. Jamais d'empreinte IP ni de jeton ici.">
      {error && <Erreur message={error} onRetry={reload} />}
      {loading && !data && <Chargement />}
      {data && !data.disponible && <Avertissement>{data.raison}</Avertissement>}
      {data && data.disponible && (
        <>
          <Resume r={data.resume} />
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="statut-lettre" className="text-sm text-text-muted">Statut</label>
            <select
              id="statut-lettre"
              value={statut}
              onChange={(e) => {
                setPage(1);
                setStatut(e.target.value as Statut);
              }}
              className="rounded-lg border border-border bg-background-light px-3 py-2 text-sm text-text-primary"
            >
              <option value="">Tous</option>
              <option value="CONFIRMED">Confirmés</option>
              <option value="PENDING">En attente</option>
              <option value="UNSUBSCRIBED">Désinscrits</option>
            </select>
            <span className="ml-auto text-sm text-text-muted">{data.liste.pagination.total} inscrit(s), comptes de test compris</span>
          </div>
          <Liste inscrits={data.liste.inscrits} />
          <Pagination page={data.liste.pagination.page} totalPages={data.liste.pagination.totalPages} onPage={setPage} />
        </>
      )}
    </Section>
  );
}

function Resume({ r }: { r: LettreResume }) {
  if (r.etat !== "ok") return <Avertissement>Compteurs indisponibles : {r.detail}.</Avertissement>;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Confirmés" value={fmt(r.statuts.confirmes)} color="success" subtitle="reçoivent la lettre" />
        <KpiCard label="En attente" value={fmt(r.statuts.enAttente)} color="warning" subtitle="confirmation" />
        <KpiCard label="Désinscrits" value={fmt(r.statuts.desinscrits)} />
      </div>
      {r.comptesTestExclus > 0 && <Note>{r.comptesTestExclus} compte(s) de test exclu(s) des compteurs (marqués «&nbsp;test&nbsp;» dans la liste).</Note>}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-background-card p-3">
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Par emplacement d’inscription</h3>
          {r.parEmplacement.length === 0 ? (
            <Note>Aucun inscrit pour l’instant.</Note>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-text-muted">
                  <th className="py-1 text-left font-medium">Emplacement</th>
                  <th className="py-1 text-right font-medium">Conf.</th>
                  <th className="py-1 text-right font-medium">Att.</th>
                  <th className="py-1 text-right font-medium">Désin.</th>
                </tr>
              </thead>
              <tbody>
                {r.parEmplacement.map((e) => (
                  <tr key={e.emplacement} className="border-t border-border/60">
                    <td className="py-1.5 text-text-secondary">{EMPLACEMENTS[e.emplacement] ?? e.emplacement}</td>
                    <td className="py-1.5 text-right font-semibold tabular-nums">{fmt(e.confirmes)}</td>
                    <td className="py-1.5 text-right tabular-nums">{fmt(e.enAttente)}</td>
                    <td className="py-1.5 text-right tabular-nums text-text-muted">{fmt(e.desinscrits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Numeros r={r} />
      </div>
    </div>
  );
}

function Numeros({ r }: { r: Extract<LettreResume, { etat: "ok" }> }) {
  const n = r.numeros;
  return (
    <div className="rounded-lg border border-border bg-background-card p-3 text-sm">
      <h3 className="mb-2 font-semibold text-text-primary">Numéros</h3>
      {!n ? (
        <Note>Migration 14 non jouée sur cette base : numéros et envois indisponibles.</Note>
      ) : (
        <>
          <p className="text-text-secondary">
            Prochain :{" "}
            {n.prochain ? (
              <>
                <strong className="text-text-primary">{n.prochain.periodKey}</strong>, envoi prévu {dateHeure(n.prochain.envoiPrevu)}{" "}
                <Pastille ton={n.prochain.statut === "VALIDE" ? "success" : "warning"}>{STATUT_NUMERO[n.prochain.statut]}</Pastille>
              </>
            ) : (
              "aucun numéro préparé"
            )}
          </p>
          <p className="mt-1 text-xs text-text-muted">{n.aVenir} numéro(s) préparé(s) à venir.</p>
          {n.prochain && <p className="mt-1 break-words text-xs text-text-muted">Objet : {n.prochain.subject}</p>}
          <ul className="mt-3 space-y-1">
            {n.envoyes.length === 0 && <li className="text-xs text-text-muted">Aucun numéro envoyé pour l’instant.</li>}
            {n.envoyes.map((e) => (
              <li key={e.periodKey} className="flex flex-wrap justify-between gap-2 border-t border-border/60 pt-1">
                <span className="text-text-secondary">{e.periodKey} ({dateCourte(e.envoyeLe ?? e.envoiPrevu)})</span>
                <span className="tabular-nums">
                  {fmt(e.envoyes)} envoyés
                  {e.echecs > 0 && <span className="text-error">, {fmt(e.echecs)} échecs</span>}
                  {e.enCours > 0 && <span className="text-yellow-600">, {fmt(e.enCours)} en cours</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Liste({ inscrits }: { inscrits: InscritLettre[] }) {
  if (inscrits.length === 0) return <Note>Aucun inscrit pour ce filtre.</Note>;
  return (
    <>
      <ul className="space-y-2 md:hidden">
        {inscrits.map((i) => (
          <li key={i.id} className="rounded-lg border border-border bg-background-card p-3 text-sm">
            {/* Revue visuelle s21, tour 4 (T3-08) : pastille au-dessus de l'adresse, qui garde toute la largeur
                (coupée seulement si elle dépasse la carte, jamais au milieu par manque de place). */}
            <div className="flex flex-col items-start gap-1.5">
              <Pastille ton={STATUTS[i.statut].ton}>{STATUTS[i.statut].label}</Pastille>
              <p className="w-full font-medium text-text-primary [overflow-wrap:anywhere]">{i.email}</p>
            </div>
            <p className="mt-1 break-all text-xs text-text-muted">{i.source ?? "source inconnue"}</p>
            {/* Revue visuelle s21 (R24) : libellé au-dessus de la valeur, 2 colonnes régulières. */}
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><dt className="text-text-muted">Consentement</dt><dd className="text-text-secondary">{dateCourte(i.consentAt)}</dd></div>
              <div><dt className="text-text-muted">Confirmé</dt><dd className="text-text-secondary">{dateCourte(i.confirmedAt)}</dd></div>
              <div><dt className="text-text-muted">Compte</dt><dd className="text-text-secondary"><OuiNon oui={i.compteSite} /></dd></div>
              <div><dt className="text-text-muted">Premium</dt><dd className="text-text-secondary"><OuiNon oui={i.premium} /></dd></div>
            </dl>
            {i.compteTest && <p className="mt-1"><Pastille ton="accent">test</Pastille></p>}
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-background-card md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-elevated text-left text-xs text-text-muted">
              <th className="px-3 py-2 font-medium">E-mail</th>
              <th className="px-3 py-2 font-medium">Statut</th>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Consentement</th>
              <th className="px-3 py-2 font-medium">Confirmation</th>
              <th className="px-3 py-2 font-medium">Compte</th>
              <th className="px-3 py-2 font-medium">Premium</th>
            </tr>
          </thead>
          <tbody>
            {inscrits.map((i) => (
              <tr key={i.id} className="border-b border-border/60 last:border-0">
                <td className="px-3 py-2 text-text-primary">
                  {i.email} {i.compteTest && <Pastille ton="accent">test</Pastille>}
                </td>
                <td className="px-3 py-2"><Pastille ton={STATUTS[i.statut].ton}>{STATUTS[i.statut].label}</Pastille></td>
                <td className="max-w-[220px] truncate px-3 py-2 text-xs text-text-muted" title={i.source ?? undefined}>{i.source ?? "inconnue"}</td>
                <td className="px-3 py-2 text-xs text-text-muted">{dateCourte(i.consentAt)}</td>
                <td className="px-3 py-2 text-xs text-text-muted">{dateCourte(i.confirmedAt)}</td>
                <td className="px-3 py-2 text-xs"><OuiNon oui={i.compteSite} /></td>
                <td className="px-3 py-2 text-xs"><OuiNon oui={i.premium} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

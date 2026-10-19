"use client";

/**
 * Onglet « Semaine » (défaut) : l'essentiel en haut (alertes, chiffres clés),
 * puis les sections du rapport du lundi dans le même ordre que l'e-mail.
 */
import { useState } from "react";
import type { ModeSemaine, SemaineAdmin } from "@/lib/admin/semaine";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { formatChange } from "@/lib/analytics/weekly-visits-email";
import { frTypo } from "@/lib/fr-typo";
import {
  BoutonActualiser,
  Chargement,
  Erreur,
  KpiCard,
  Note,
  comptesTestExclus,
  euros,
  fmt,
} from "./admin-ui";
import { SemaineBlog, SemaineVisites } from "./semaine-trafic";
import {
  SemaineFunnel,
  SemaineLettre,
  SemaineParcours,
  SemaineSocial,
  SemaineStock,
} from "./semaine-conversion";

const MODES: { id: ModeSemaine; label: string }[] = [
  { id: "rapport", label: "Semaine du rapport" },
  { id: "glissante", label: "7 derniers jours" },
];

export function SemaineTab({
  onUnauthorized,
  onVoirLettre,
}: {
  onUnauthorized: () => void;
  onVoirLettre: () => void;
}) {
  const [mode, setMode] = useState<ModeSemaine>("rapport");
  const { data, error, loading, reload } = useAdminFetch<SemaineAdmin>(
    `/api/admin/semaine?periode=${mode}`,
    onUnauthorized,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex rounded-lg border border-border bg-background-elevated p-1"
          role="group"
          aria-label="Période"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === m.id
                  ? "bg-background-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <BoutonActualiser onClick={reload} loading={loading} />
        {data && (
          <p className="w-full text-sm font-medium text-text-primary sm:w-auto">
            {capitaliser(data.periode.label)}
          </p>
        )}
      </div>

      {error && <Erreur message={error} onRetry={reload} />}
      {loading && !data && <Chargement />}
      {data && (
        <>
          <Alertes s={data} />
          <ChiffresCles s={data} />
          <SemaineVisites visites={data.visites} erreur={data.visitesErreur} />
          <SemaineStock s={data} />
          <SemaineFunnel s={data} />
          <SemaineParcours s={data} />
          <SemaineBlog visites={data.visites} />
          <SemaineLettre s={data} onVoir={onVoirLettre} />
          <SemaineSocial s={data} />
          <Note>
            Mêmes fonctions que l’e-mail du lundi. Abonnés actifs et revenu
            mensuel : instantané au moment du chargement. n.d. : donnée non
            disponible.
          </Note>
        </>
      )}
    </div>
  );
}

const capitaliser = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

function Alertes({ s }: { s: SemaineAdmin }) {
  if (s.alertes.length === 0) {
    return (
      <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        Rien à signaler : contenu du jour, stock, paiements, lettre et réseaux
        en ordre.
      </p>
    );
  }
  return (
    <ul className="space-y-2" aria-label="Alertes">
      {s.alertes.map((a) => (
        <li
          key={a.texte}
          className={`rounded-lg border px-4 py-3 text-sm ${
            a.niveau === "rouge"
              ? "border-error/30 bg-error/10 text-error"
              : "border-yellow-500/30 bg-yellow-500/10 text-yellow-600"
          }`}
        >
          {frTypo(a.texte)}
        </li>
      ))}
    </ul>
  );
}

function ChiffresCles({ s }: { s: SemaineAdmin }) {
  const db = s.funnel.db;
  const f = db?.parFormule;
  const lettre = s.lettre.etat === "ok" ? s.lettre.statuts : null;
  const v = s.visites;
  const stock = s.stock.etat === "ok" ? s.stock.coverage : null;
  const joursStock =
    stock && stock.jokeDaysLeft !== null && stock.tipDaysLeft !== null
      ? Math.min(stock.jokeDaysLeft, stock.tipDaysLeft)
      : null;
  return (
    <section aria-label="Chiffres clés" className="space-y-2">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Abonnés Premium"
          value={fmt(db?.abonnesActifs)}
          subtitle={
            f
              ? `${fmt(f.mensuel)} mensuel(s), ${fmt(f.annuel)} annuel(s)${f.inconnu ? `, ${f.inconnu} à resynchroniser` : ""}`
              : undefined
          }
          color="accent"
        />
        <KpiCard
          label="Revenu mensuel"
          value={euros(db?.mrrCents)}
          subtitle="Abonnements actifs, annuel / 12"
          color="accent"
        />
        <KpiCard
          label="Nouveaux abonnés"
          value={fmt(db?.nouveauxAbonnes)}
          subtitle="Premier paiement sur la période"
          color={db && db.nouveauxAbonnes > 0 ? "success" : undefined}
        />
        <KpiCard
          label="Résiliations"
          value={fmt(db?.resiliations)}
          subtitle={
            db
              ? `${fmt(db.resiliationsProgrammees)} programmée(s) en cours`
              : undefined
          }
          color={db && db.resiliations > 0 ? "warning" : undefined}
        />
        <KpiCard
          label="Comptes créés"
          value={fmt(db?.comptesCrees)}
          subtitle="Sur la période"
        />
        <KpiCard
          label="Inscrits lettre"
          value={fmt(lettre?.confirmes)}
          subtitle={
            lettre ? `confirmés, ${fmt(lettre.enAttente)} en attente` : "n.d."
          }
        />
        <KpiCard
          label="Visiteurs"
          value={fmt(v?.current.visitors)}
          subtitle={
            v
              ? `${formatChange(v.changes.visitors)} contre la semaine précédente`
              : "Umami indisponible"
          }
        />
        <KpiCard
          label="Stock du jour"
          value={joursStock === null ? "n.d." : `${fmt(joursStock)} j`}
          subtitle={stock ? `seuil ${stock.minDays} jours` : undefined}
          color={
            stock ? (stock.status === "ok" ? "success" : "error") : undefined
          }
        />
      </div>
      {comptesTestExclus(db?.comptesTestExclus) && (
        <Note>{comptesTestExclus(db?.comptesTestExclus)}</Note>
      )}
    </section>
  );
}

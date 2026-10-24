/**
 * Onglet « Semaine » : entonnoir, parcours, stock, lettre et réseaux sociaux.
 * Les lignes de l'entonnoir et des parcours sont celles de l'e-mail du lundi
 * (construites côté serveur par `lignesFunnel` / `lignesParcours`).
 */
import type { SemaineAdmin } from "@/lib/admin/semaine";
import { Avertissement, LignesChiffres, LignesEmpilees, Note, Pastille, Section, comptesTestExclus, dateHeure, fmt } from "./admin-ui";

export function SemaineFunnel({ s }: { s: SemaineAdmin }) {
  const parSrc = s.funnel.checkoutParSource;
  return (
    <Section titre="Entonnoir visiteur vers Premium" sousTitre="Chiffres absolus, Umami et webhooks Stripe">
      {s.funnel.warnings.length > 0 && <Avertissement>Section partielle : {s.funnel.warnings.join(" ; ")}.</Avertissement>}
      <LignesChiffres lignes={s.lignes.funnel} />
      {comptesTestExclus(s.funnel.db?.comptesTestExclus) && <Note>{comptesTestExclus(s.funnel.db?.comptesTestExclus)}</Note>}
      <div className="rounded-lg border border-border bg-background-card p-3">
        <h3 className="mb-2 text-sm font-semibold text-text-primary">Paiement ouvert par bloc d’entrée (src)</h3>
        {parSrc === null ? (
          <Note>n.d. (Umami)</Note>
        ) : parSrc.length === 0 ? (
          <Note>Aucun paiement ouvert sur la période.</Note>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-text-muted">
                <th className="py-1.5 text-left font-medium">src</th>
                <th className="py-1.5 text-right font-medium">checkout-ouvert</th>
                <th className="py-1.5 text-right font-medium">checkout-echec</th>
              </tr>
            </thead>
            <tbody>
              {parSrc.map((l) => (
                <tr key={l.src} className="border-b border-border/60 last:border-0">
                  <td className="break-all py-1.5 pr-2 text-text-secondary">{l.src}</td>
                  <td className="py-1.5 text-right font-semibold tabular-nums">{fmt(l.ouverts)}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmt(l.echecs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Section>
  );
}

export function SemaineParcours({ s }: { s: SemaineAdmin }) {
  return (
    <Section titre="Parcours" sousTitre="Umami avant paiement, base pour les abonnés (cumul, comptes de test exclus)">
      {s.parcours.warnings.length > 0 && <Avertissement>Section partielle : {s.parcours.warnings.join(" ; ")}.</Avertissement>}
      <LignesEmpilees lignes={s.lignes.parcours} />
      <Note>Un taux ne se lit pas sous 30 cas : nombre et dénominateur seulement.</Note>
    </Section>
  );
}

export function SemaineStock({ s }: { s: SemaineAdmin }) {
  const st = s.stock;
  return (
    <Section titre="Stock du contenu du jour" sousTitre="Même calcul que /api/health : jours jamais servis, jours déjà planifiés compris">
      {st.etat === "illisible" && <Avertissement>Stock illisible (base) : voir /api/health.</Avertissement>}
      {st.etat === "generation-ia" && <Note>Génération IA activée : le stock préparé ne sert pas.</Note>}
      {st.etat === "ok" && (
        <LignesChiffres
          lignes={[
            ["Jours de vannes", <Jours key="v" n={st.coverage.jokeDaysLeft} min={st.coverage.minDays} />],
            ["Jours de conseils", <Jours key="c" n={st.coverage.tipDaysLeft} min={st.coverage.minDays} />],
            ["Jours déjà planifiés", fmt(st.coverage.plannedDaysAhead)],
            ["Vidéos jamais servies (recyclées par conception)", fmt(st.coverage.videosNeverUsed)],
          ]}
        />
      )}
    </Section>
  );
}

function Jours({ n, min }: { n: number | null; min: number }) {
  if (n === null) return <span className="text-error">n.d.</span>;
  return <span className={`whitespace-nowrap ${n < min ? "text-error" : "text-success"}`}>{fmt(n)} j</span>;
}

export function SemaineLettre({ s, onVoir }: { s: SemaineAdmin; onVoir: () => void }) {
  const l = s.lettre;
  const voir = (
    <button type="button" onClick={onVoir} className="text-xs font-medium text-accent-primary hover:underline">
      Voir les inscrits
    </button>
  );
  if (l.etat !== "ok") {
    return (
      <Section titre="Lettre mensuelle" action={voir}>
        <Avertissement>Section indisponible : {l.detail}.</Avertissement>
      </Section>
    );
  }
  const p = l.numeros?.prochain ?? null;
  const dernier = l.numeros?.envoyes[0];
  const lignes: Array<[string, React.ReactNode]> = [
    ["Inscrits confirmés", fmt(l.statuts.confirmes)],
    ["En attente de confirmation", fmt(l.statuts.enAttente)],
    ["Désinscrits", fmt(l.statuts.desinscrits)],
  ];
  if (l.semaine) {
    lignes.push(
      ["Inscriptions sur la période", fmt(l.semaine.inscriptions)],
      ["Confirmations sur la période", fmt(l.semaine.confirmations)],
      ["Désinscriptions sur la période", fmt(l.semaine.desinscriptions)],
    );
  }
  if (l.numeros) {
    lignes.push(["Prochain numéro", p ? `${p.periodKey}, ${dateHeure(p.envoiPrevu)}` : "aucun numéro préparé"]);
    if (dernier) lignes.push([`Dernier envoi (${dernier.periodKey})`, `${fmt(dernier.envoyes)} envoyés, ${fmt(dernier.echecs)} échecs`]);
  }
  return (
    <Section titre="Lettre mensuelle" sousTitre="Comptes de test exclus" action={voir}>
      <LignesChiffres lignes={lignes} />
      {!l.numeros && <Note>Numéros : migration 14 non jouée sur cette base.</Note>}
      {l.comptesTestExclus > 0 && <Note>{l.comptesTestExclus} compte(s) de test exclu(s).</Note>}
    </Section>
  );
}

const RESEAUX: Record<string, string> = { TWITTER: "X", INSTAGRAM: "Instagram", LINKEDIN: "LinkedIn" };

export function SemaineSocial({ s }: { s: SemaineAdmin }) {
  const r = s.social;
  return (
    <Section titre="Réseaux sociaux : prévu contre publié" sousTitre="Posts du stock préparé, publiés par Buffer">
      {!r ? (
        <Avertissement>Section indisponible (base illisible) : voir /admin/social.</Avertissement>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(r.totaux).map(([reseau, c]) => (
            <div key={reseau} className="rounded-lg border border-border bg-background-card p-3 text-sm">
              <p className="mb-1 font-semibold text-text-primary">{RESEAUX[reseau] ?? reseau}</p>
              <p className="text-text-secondary">
                {fmt(c.confirmes)} confirmés sur {fmt(c.prevus)} prévus
              </p>
              <p className="mt-1 flex flex-wrap gap-1">
                {c.echecs > 0 && <Pastille ton="error">{c.echecs} échec(s)</Pastille>}
                {c.ecart > 0 && <Pastille ton="warning">{c.ecart} non confirmé(s)</Pastille>}
                {c.aVenir > 0 && <Pastille>{c.aVenir} à venir</Pastille>}
              </p>
            </div>
          ))}
          {Object.keys(r.totaux).length === 0 && <Note>Aucun post prévu sur la période.</Note>}
        </div>
      )}
    </Section>
  );
}

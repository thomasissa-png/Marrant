"use client";

/** s23 : compteur des motifs de résiliation (question facultative de l'écran /resiliation). */
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import type { ReponseMotifsResiliation } from "@/lib/admin/motifs-resiliation";
import { RESILIATION_PAGE_OUVERTE } from "@/config/resiliation";
import { Avertissement, Chargement, Erreur, LignesChiffres, Note, Section, dateCourte, fmt } from "./admin-ui";

export function MotifsResiliationSection({ onUnauthorized }: { onUnauthorized: () => void }) {
  const { data, error, loading, reload } = useAdminFetch<ReponseMotifsResiliation>("/api/admin/resiliations", onUnauthorized);
  return (
    <Section
      titre="Motifs de résiliation"
      sousTitre="Question facultative de l'écran « Résilier ton contrat ». Plusieurs raisons possibles par réponse."
    >
      {!RESILIATION_PAGE_OUVERTE && <Note>Écran de résiliation fermé (interrupteur) : aucune réponse ne peut arriver.</Note>}
      {error && <Erreur message={error} onRetry={reload} />}
      {loading && !data && <Chargement />}
      {data && !data.disponible && <Avertissement>{data.raison}</Avertissement>}
      {data && data.disponible && (
        <LignesChiffres
          lignes={[
            ["Réponses (30 jours / total)", `${fmt(data.reponses30j)} / ${fmt(data.reponses)}`],
            ...data.parRaison.map((r): [string, string] => [r.libelle, `${fmt(r.total30j)} / ${fmt(r.total)}`]),
            ["Avec un mot libre (total)", fmt(data.avecMot)],
            ["Dernière réponse", data.derniere ? dateCourte(data.derniere) : "aucune"],
          ]}
        />
      )}
    </Section>
  );
}

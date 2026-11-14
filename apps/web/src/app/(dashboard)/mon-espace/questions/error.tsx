"use client";

import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import { PageHeader } from "@/components/layout/page-header";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { BOUTON_SECONDAIRE, CARTE } from "@/components/espace/carte/styles";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);
const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);

/**
 * Erreur de « Mes questions » (s24, lot D7) : rien n'est perdu (les envois sont en base), « Réessayer »
 * (libellé 2.7, déjà validé) ; l'adresse de l'équipe reste donnée (ligne v6). Aucun détail technique.
 */
export default function MesQuestionsErreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col gap-6 [&>header]:mb-2 md:[&>header]:mb-4" data-etat="erreur">
      {/* v5 §3, gabarit B : en-tête de page du site (sa marge basse remplace le premier écart). */}
      <PageHeader title={Q.titre} />
      <div className={CARTE}>
        <p className="text-sm text-text-secondary">
          {Q.lectureSeule.adresse.avant}
          <a href={`mailto:${Q.lectureSeule.adresse.lien}`} className="text-accent-link underline [overflow-wrap:anywhere]">
            {Q.lectureSeule.adresse.lien}
          </a>
          {Q.lectureSeule.adresse.apres}
        </p>
        <button type="button" className={BOUTON_SECONDAIRE} onClick={reset}>
          {T.reessayer}
        </button>
      </div>
    </div>
  );
}

"use client";

import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import { TEXTES_QUOI_REPONDRE as T } from "@/config/textes/espace-bibliotheque";
import { BOUTON_SECONDAIRE, CARTE } from "@/components/espace/carte/styles";

/**
 * Erreur de « Mes questions » (s24, lot D7) : rien n'est perdu (les envois sont en base), « Réessayer »
 * (libellé 2.7, déjà validé) ; l'adresse de l'équipe reste donnée (ligne v6). Aucun détail technique.
 */
export default function MesQuestionsErreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col gap-6 pb-12 lg:max-w-3xl" data-etat="erreur">
      <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl max-e300:text-2xl">{Q.titre}</h1>
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

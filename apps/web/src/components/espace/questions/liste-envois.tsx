"use client";

import { TEXTES_QUESTIONS as Q } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { CARTE } from "@/components/espace/carte/styles";
import { EtatVideQuestions } from "@/components/espace/questions/etat-vide";
import { FilEnvoi } from "@/components/espace/questions/fil";

export type Envoi = FilListe | { id: string; retire: true };

/**
 * « Mes envois » : le plus récent d'abord ; aucun envoi : l'état vide (exemples) ; un envoi retiré laisse
 * « Retiré de ton historique » à sa place (maquette `#etat=retire`). Lecture seule (après la résiliation,
 * depuis « Mon profil ») : l'adresse de l'équipe pour un problème de paiement ou d'accès (ligne v6).
 */
export function ListeEnvois({
  envois,
  lectureSeule,
  onMaj,
  onRetire,
}: {
  envois: Envoi[];
  lectureSeule: boolean;
  onMaj: (fil: FilListe) => void;
  onRetire: (id: string) => void;
}) {
  return (
    <section aria-labelledby="h-envois" className="min-w-0" data-mes-envois>
      <h2 id="h-envois" className="mb-3 font-display text-xl font-bold text-text-primary">
        {Q.envois.titre}
      </h2>
      {lectureSeule && (
        <p className="mb-3 text-sm text-text-secondary" data-adresse-equipe>
          {Q.lectureSeule.adresse.avant}
          <a href={`mailto:${Q.lectureSeule.adresse.lien}`} className="inline-flex min-h-11 max-w-full items-center text-accent-link underline [overflow-wrap:anywhere]">
            {Q.lectureSeule.adresse.lien}
          </a>
          {Q.lectureSeule.adresse.apres}
        </p>
      )}
      {envois.length === 0 ? (
        <EtatVideQuestions />
      ) : (
        <ul className="flex flex-col gap-3">
          {envois.map((e) =>
            "retire" in e ? (
              <li key={e.id} className={CARTE} data-retire>
                <p className="text-sm text-text-secondary" role="status">
                  {Q.envois.retire}
                </p>
              </li>
            ) : (
              <FilEnvoi key={e.id} fil={e} lectureSeule={lectureSeule} onMaj={onMaj} onRetire={onRetire} />
            ),
          )}
        </ul>
      )}
    </section>
  );
}

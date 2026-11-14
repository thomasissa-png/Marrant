"use client";

import { useEffect, useRef } from "react";
import { TEXTES_QUESTIONS } from "@/config/textes/espace-questions";
import type { FilListe } from "@/lib/espace/questions-types";
import { CARTE } from "@/components/espace/carte/styles";
import { EtatVideQuestions } from "@/components/espace/questions/etat-vide";
import { FilEnvoi } from "@/components/espace/questions/fil";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const Q = frEspaceProfond(TEXTES_QUESTIONS);

export type Envoi = FilListe | { id: string; retire: true };

/**
 * « Mes envois » : le plus récent d'abord ; aucun envoi : l'état vide (exemples) ; un envoi retiré laisse
 * « Question retirée de ton historique. » à sa place (maquette `#etat=retire`), qui reçoit le focus : le
 * bouton d'origine n'existe plus, le lecteur d'écran lit le statut une fois (aucune région live doublée). Lecture seule (après la résiliation,
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
              <EnvoiRetire key={e.id} />
            ) : (
              <FilEnvoi key={e.id} fil={e} lectureSeule={lectureSeule} onMaj={onMaj} onRetire={onRetire} />
            ),
          )}
        </ul>
      )}
    </section>
  );
}

/** Statut d'un envoi retiré : focus posé à l'arrivée (après la confirmation), visible au clavier. */
function EnvoiRetire() {
  const statut = useRef<HTMLParagraphElement>(null);
  useEffect(() => statut.current?.focus(), []);
  return (
    <li className={CARTE} data-retire>
      <p ref={statut} tabIndex={-1} className="text-sm text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link">
        {Q.envois.retire}
      </p>
    </li>
  );
}

"use client";

import { useState } from "react";
import { TEXTES_CARTES as T } from "@/config/textes/espace-cartes";
import type { ReponseCarte } from "@/lib/espace/revision";
import { BoutonsReponse } from "@/components/espace/carte/boutons-reponse";

/**
 * « Ta réponse d'abord », puis « Tu avais une réponse ? » (étalon E1.1, architecture 2.2) sur la page d'une
 * fiche ou d'un bilan : la suite (répliques, choix, retour) n'est rendue qu'après le toucher, jamais
 * seulement masquée. Rien n'est enregistré ici (ni réponse, ni point, ni série) : la carte de la rafale
 * garde seule son journal. `revision` passé à vrai : aucune ligne « Cette carte reviendra ».
 */
export function ReponseDabord({
  premierePhrase = false,
  onRepondu,
  children,
}: {
  premierePhrase?: boolean;
  onRepondu?: (r: ReponseCarte) => void;
  children: React.ReactNode;
}) {
  const [reponse, setReponse] = useState<ReponseCarte | null>(null);
  return (
    <>
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-text-primary">{premierePhrase ? T.premierePhraseDabord : T.reponseDabord}</h2>
        <p className="text-sm text-text-secondary">{T.consigne}</p>
      </div>
      <BoutonsReponse
        reponse={reponse}
        revision
        onRepondre={(r) => {
          setReponse(r);
          onRepondu?.(r);
        }}
      />
      {reponse && children}
    </>
  );
}

"use client";

import { useId } from "react";
import { TEXTES_GESTE as G } from "@/config/textes/espace-cartes";
import { RETOURS_GESTE, type RetourGeste } from "@/lib/espace/retours";
import { Coche } from "@/components/espace/carte/coche";
import { puce } from "@/components/espace/carte/styles";

/**
 * « Ton retour » (2.4, maquettes `carte-rafale.html` et `mission.html`) : trois puces à choix unique,
 * « Pas essayé », « Essayé, bof », « Essayé, ça a marché » ; coche et contour de 2 px, `aria-pressed`.
 * Le parent enregistre (fiche : « Fait » ; mission : la suite).
 */
export function LigneRetour({
  valeur,
  onChoisir,
  occupe = false,
}: {
  valeur: RetourGeste | null;
  onChoisir: (r: RetourGeste) => void;
  occupe?: boolean;
}) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} aria-busy={occupe} className="space-y-2">
      <p id={id} className="text-sm font-semibold text-text-primary">
        {G.tonRetour}
      </p>
      <div className="flex flex-wrap gap-2">
        {RETOURS_GESTE.map((r) => (
          <button key={r} type="button" aria-pressed={valeur === r} onClick={() => onChoisir(r)} className={puce(valeur === r)}>
            {valeur === r && <Coche />}
            {G.retours[r]}
          </button>
        ))}
      </div>
    </div>
  );
}

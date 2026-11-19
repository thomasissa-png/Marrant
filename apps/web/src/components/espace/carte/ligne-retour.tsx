"use client";

import { useId } from "react";
import { TEXTES_GESTE } from "@/config/textes/espace-cartes";
import { RETOURS_GESTE, type RetourGeste } from "@/lib/espace/retours";
import { Coche } from "@/components/espace/carte/coche";
import { puce } from "@/components/espace/carte/styles";
import { cn } from "@/lib/utils";
import { frEspaceProfond } from "@/lib/fr-typo";

/** Puce en plein (même violet que `BOUTON_PRINCIPAL`), pour l'action principale du geste dans Quoi répondre. */
const PUCE_PLEINE = "border-accent-secondary-hover bg-accent-secondary-hover text-white hover:border-accent-secondary hover:bg-accent-secondary";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const G = frEspaceProfond(TEXTES_GESTE);

/**
 * « Ton retour » (2.4, maquettes `carte-rafale.html` et `mission.html`) : trois puces à choix unique,
 * « Pas essayé », « Essayé, bof », « Essayé, ça a marché » ; coche et contour de 2 px, `aria-pressed`.
 * Le parent enregistre (fiche : « Fait » ; mission : la suite).
 */
export function LigneRetour({
  valeur,
  onChoisir,
  occupe = false,
  principale = null,
}: {
  valeur: RetourGeste | null;
  onChoisir: (r: RetourGeste) => void;
  occupe?: boolean;
  /**
   * s26 liste et détail, tour 1 (Quoi répondre seulement ; spec design §6) : la puce de l'action principale du geste,
   * en plein tant qu'elle n'est pas choisie (l'unique aplat de la fiche avant « Fait »). Absente ailleurs : rien ne change.
   */
  principale?: RetourGeste | null;
}) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} aria-busy={occupe} className="space-y-2">
      <p id={id} className="text-sm font-semibold text-text-primary">
        {G.tonRetour}
      </p>
      <div className="flex flex-wrap gap-2">
        {RETOURS_GESTE.map((r) => (
          <button key={r} type="button" aria-pressed={valeur === r} onClick={() => onChoisir(r)} className={r === principale && valeur !== r ? cn(puce(false), PUCE_PLEINE) : puce(valeur === r)}>
            {valeur === r && <Coche />}
            {G.retours[r]}
          </button>
        ))}
      </div>
    </div>
  );
}

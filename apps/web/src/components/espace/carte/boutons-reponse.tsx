"use client";

import { useEffect, useId, useState } from "react";
import { TEXTES_CARTES as T } from "@/config/textes/espace-cartes";
import { DELAI_MOITIE, DELAI_RIEN, REPONSES_CARTE, type ReponseCarte } from "@/lib/espace/revision";
import { BOUTON_SECONDAIRE } from "@/components/espace/carte/styles";

/** « Prends ton temps » : 3 secondes avant que les trois boutons s'activent (2.2, sans compte à rebours). */
export const PRENDS_TON_TEMPS_MS = 3_000;

/**
 * « Tu avais une réponse ? » (2.2) : trois boutons de même poids, « Oui », « À moitié », « Rien », visibles
 * dès le départ en `aria-disabled` pendant « Prends ton temps » (rien ne bloque le lecteur d'écran),
 * puis actifs ; un seul toucher, qui révèle la suite. Ligne neutre sous les boutons : « À moitié » et
 * « Rien » disent quand la carte reviendra (première vue seulement) ; « Oui » n'a aucune ligne.
 * Compte à rebours (lot D5b, `compte-a-rebours.tsx`) : quand il est lancé, il remplace « Prends ton
 * temps » (texte masqué, boutons actifs : deux consignes ne se contredisent pas) ; il ne bloque jamais.
 */
export function BoutonsReponse({
  reponse,
  revision,
  onRepondre,
  compteActif = false,
}: {
  reponse: ReponseCarte | null;
  revision: boolean;
  onRepondre: (r: ReponseCarte) => void;
  compteActif?: boolean;
}) {
  const [pause, setPause] = useState(true);
  const attente = pause && !compteActif;
  const id = useId();
  useEffect(() => {
    const t = setTimeout(() => setPause(false), PRENDS_TON_TEMPS_MS);
    return () => clearTimeout(t);
  }, []);

  const regle = !reponse || revision ? "" : reponse === "MOITIE" ? T.regle(DELAI_MOITIE) : reponse === "RIEN" ? T.regle(DELAI_RIEN) : "";

  return (
    <div className="space-y-3">
      {attente && !reponse && <p className="text-sm text-text-secondary">{T.prendsTonTemps}</p>}
      <div role="group" aria-labelledby={id} className="space-y-2">
        <p id={id} className="text-base font-semibold text-text-primary">
          {T.question}
        </p>
        <div className="grid grid-cols-3 gap-2 max-e300:grid-cols-1">
          {REPONSES_CARTE.map((r) => (
            <button
              key={r}
              type="button"
              className={`${BOUTON_SECONDAIRE} w-full [overflow-wrap:anywhere] ${reponse === r ? "border-2 border-accent-link bg-background-elevated" : ""}`}
              aria-pressed={reponse === r}
              aria-disabled={attente && !reponse ? true : undefined}
              disabled={reponse !== null}
              onClick={() => {
                if (attente || reponse) return;
                onRepondre(r);
              }}
            >
              {T.reponses[r]}
            </button>
          ))}
        </div>
        <p role="status" className="text-sm text-text-secondary">
          {regle}
        </p>
      </div>
    </div>
  );
}

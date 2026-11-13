"use client";

import { useEffect, useRef, useState } from "react";
import { TEXTES_COIN as T } from "@/config/textes/espace-bibliotheque";
import { TEXTES_CARTES } from "@/config/textes/espace-cartes";
import type { LigneFiche } from "@/lib/espace/lignes-fiches";
import { appelEspace } from "@/components/espace/carte/appel";
import { BOUTON_SECONDAIRE, CARTE } from "@/components/espace/carte/styles";
import { ListeFiches } from "@/components/espace/liste-fiches";

/**
 * Coin « Humour noir, fait bien » (s24, lot D6 ; architecture v20 3.12, étalon E6, maquette
 * `bibliotheque.html`) : à l'ouverture, le titre, une phrase et « Entrer » (44 px, focus visible). Le
 * contenu n'est PAS dans la page avant le geste : le serveur ne l'envoie qu'à un navigateur « entré »
 * (témoin posé par `api/espace/humour-noir`, `lib/espace/humour-noir.ts`), au rendu ou en réponse au geste.
 * Après « Entrer », le focus va au titre du coin ; « Sortir » oublie l'état et rend le focus à « Entrer ».
 * Échec : rien ne change, la phrase d'échec est annoncée (`role="status"`).
 */
export function CoinHumourNoir({ lignesInitiales }: { lignesInitiales: LigneFiche[] | null }) {
  const [lignes, setLignes] = useState<LigneFiche[] | null>(lignesInitiales);
  const [occupe, setOccupe] = useState(false);
  const [echec, setEchec] = useState(false);
  const focus = useRef<"titre" | "entrer" | null>(null);
  const titre = useRef<HTMLHeadingElement>(null);
  const entrer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focus.current === "titre") titre.current?.focus();
    if (focus.current === "entrer") entrer.current?.focus();
    focus.current = null;
  }, [lignes]);

  const basculer = async (entre: boolean) => {
    if (occupe) return;
    setOccupe(true);
    const res = await appelEspace<{ lignes: LigneFiche[] }>("/api/espace/humour-noir", "POST", { entrer: entre });
    setOccupe(false);
    setEchec(!res);
    if (!res) return;
    focus.current = entre ? "titre" : "entrer";
    setLignes(entre ? res.lignes : null);
  };

  return (
    <section aria-labelledby="coin-titre" className={CARTE} data-coin={lignes ? "entre" : "seuil"}>
      <h2 id="coin-titre" ref={titre} tabIndex={-1} className="font-display text-xl font-bold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-link">
        {T.titre}
      </h2>
      <p className="text-base text-text-primary">{T.phrase}</p>
      {lignes === null ? (
        <button
          ref={entrer}
          type="button"
          className={BOUTON_SECONDAIRE}
          aria-expanded="false"
          aria-controls="coin-contenu"
          aria-disabled={occupe || undefined}
          onClick={() => void basculer(true)}
        >
          {T.entrer}
        </button>
      ) : (
        <div id="coin-contenu" className="space-y-4">
          <ListeFiches lignes={lignes} avecDuree labelledBy="coin-titre" />
          <button type="button" className={BOUTON_SECONDAIRE} aria-disabled={occupe || undefined} onClick={() => void basculer(false)}>
            {T.sortir}
          </button>
        </div>
      )}
      {echec && (
        <p role="status" className="text-sm text-text-secondary">
          {TEXTES_CARTES.echec}
        </p>
      )}
    </section>
  );
}

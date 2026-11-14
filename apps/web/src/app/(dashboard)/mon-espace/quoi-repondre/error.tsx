"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { TEXTES_QUOI_REPONDRE } from "@/config/textes/espace-bibliotheque";
import { BOUTON_SECONDAIRE, CARTE, LIEN } from "@/components/espace/carte/styles";
import { frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_QUOI_REPONDRE);

/**
 * Erreur de « Quoi répondre » (s24, lot D6) : rien n'est perdu, deux sorties sans texte neuf, « Réessayer »
 * (architecture 2.7) et le carnet du mois (page publique `/carnet`, libellé 11), comme le repli du contenu
 * du jour d'« Aujourd'hui ». Aucun détail technique n'est affiché ni journalisé ici.
 */
export default function QuoiRepondreErreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col gap-6 [&>header]:mb-2 md:[&>header]:mb-4" data-etat="erreur">
      {/* v5 §3, gabarit B : en-tête de page du site (sa marge basse remplace le premier écart). */}
      <PageHeader title={T.titre} />
      <div className={CARTE}>
        <div className="flex flex-wrap gap-3" role="group" aria-label={T.titre}>
          <button type="button" className={BOUTON_SECONDAIRE} onClick={reset}>
            {T.reessayer}
          </button>
          <Link href="/carnet" className={LIEN}>
            {T.carnet}
          </Link>
        </div>
      </div>
    </div>
  );
}

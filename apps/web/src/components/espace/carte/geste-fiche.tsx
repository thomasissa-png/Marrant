"use client";

import { useState } from "react";
import { TEXTES_CARTES as TEXTES_CARTES_BRUT, TEXTES_GESTE } from "@/config/textes/espace-cartes";
import type { RetourGeste } from "@/lib/espace/retours";
import { appelEspace } from "@/components/espace/carte/appel";
import { LigneRetour } from "@/components/espace/carte/ligne-retour";
import { NoteReplique } from "@/components/espace/carte/note-replique";
import { ETIQUETTE } from "@/components/espace/carte/styles";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const TEXTES_CARTES = frEspaceProfond(TEXTES_CARTES_BRUT);
const G = frEspaceProfond(TEXTES_GESTE);

/**
 * Geste d'une fiche, puis « Ton retour », puis « Ma réplique à moi » (ordre de E1.1 et de 2.7, maquette
 * `carte-rafale.html`). « Essayé, bof » et « Essayé, ça a marché » posent « Fait » (statut en texte,
 * jamais la couleur seule) ; « Pas essayé » le retire. Échec d'enregistrement : le choix revient à l'état
 * précédent, rien n'est perdu. Écrire une note ne coche jamais « Fait ».
 * Import 2 : la grille d'auto-contrôle du geste (3 questions oui ou non, 2.4) s'affiche sous la consigne,
 * rien n'est enregistré ; retours à la ligne de la consigne conservés.
 */
export function GesteFiche({
  ficheId,
  consigne,
  pourAllerPlusLoin,
  grille,
  retourInitial,
  repliqueInitiale,
}: {
  ficheId: string;
  consigne: string;
  pourAllerPlusLoin?: string | null;
  grille?: readonly string[] | null;
  retourInitial: RetourGeste | null;
  repliqueInitiale: string | null;
}) {
  const [retour, setRetour] = useState<RetourGeste | null>(retourInitial);
  const [occupe, setOccupe] = useState(false);
  const [echec, setEchec] = useState(false);
  const fait = retour === "essaye-bof" || retour === "essaye-ca-a-marche";

  const choisir = async (r: RetourGeste) => {
    if (occupe) return;
    const avant = retour;
    setRetour(r);
    setOccupe(true);
    const ok = await appelEspace<{ ok: true }>("/api/espace/fiche-fait", "POST", { ficheId, retour: r });
    setOccupe(false);
    setEchec(!ok);
    if (!ok) setRetour(avant);
  };

  return (
    <section aria-label={G.aToi} className="space-y-4 border-t border-border pt-4" data-testid="geste-fiche">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={ETIQUETTE}>{G.aToi}</h3>
          {fait && <span className="rounded-full border border-border-input px-2 py-0.5 text-xs font-semibold text-text-secondary">{G.fait}</span>}
        </div>
        <p className="whitespace-pre-line text-base text-text-primary">
          {consigne}
          {pourAllerPlusLoin ? frEspace(` Pour aller plus loin : ${pourAllerPlusLoin}`) : ""}
        </p>
        {grille && grille.length > 0 && (
          <ol className="list-decimal space-y-1 pl-5 text-base text-text-primary" data-testid="geste-grille">
            {grille.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        )}
      </div>
      <LigneRetour valeur={retour} onChoisir={(r) => void choisir(r)} occupe={occupe} />
      {echec && (
        <p role="status" className="text-sm text-text-secondary">
          {TEXTES_CARTES.echec}
        </p>
      )}
      <NoteReplique ficheId={ficheId} initiale={repliqueInitiale} />
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { TEXTES_REPLIQUES as R } from "@/config/textes/espace-repliques";
import type { CategorieToucher } from "@/lib/espace/vanne";
import { appelEspace } from "@/components/espace/carte/appel";

/**
 * « Tes répliques à toi pour {catégorie} » (architecture v20 2.7 et 4.4, maquette `mes-repliques.html#cat=`) :
 * sous « Ce soir, c'est plutôt ? », les notes de l'abonné dont la fiche correspond avec certitude à la
 * catégorie choisie. Chargées à la demande (rien dans la page avant le toucher) ; aucune : aucune ligne.
 * Affichage seulement : rien n'est analysé, mesuré ni journalisé.
 */
export function RepliquesCategorie({ categorie, libelle }: { categorie: CategorieToucher; libelle: string }) {
  const [textes, setTextes] = useState<string[]>([]);
  useEffect(() => {
    let actif = true;
    void appelEspace<{ repliques: { texte: string }[] }>(`/api/espace/repliques?categorie=${categorie}`, "GET").then((r) => {
      if (actif && r) setTextes(r.repliques.map((x) => x.texte));
    });
    return () => {
      actif = false;
    };
  }, [categorie]);
  if (textes.length === 0) return null;
  return (
    <div className="space-y-1" data-testid="repliques-categorie">
      <h3 className="text-xs font-semibold text-text-muted">{R.pourCategorie(libelle)}</h3>
      <ul className="space-y-1">
        {textes.map((t) => (
          <li key={t} className="text-sm text-text-primary">
            « {t} »
          </li>
        ))}
      </ul>
    </div>
  );
}

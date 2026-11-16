"use client";

import { useEffect, useState } from "react";
import { TEXTES_AUJOURDHUI } from "@/config/textes/espace-aujourdhui";
import { ActionDuJour } from "@/components/espace/aujourdhui/action-du-jour";
import {
  CLE_ORIGINE,
  CLE_QUIZ,
  choisirPremierPas,
  lireProfilQuiz,
  sceneDuPremierPas,
  type EntreeDisponible,
  type OrigineResolue,
} from "@/lib/espace/premier-pas";
import { frEspace, frEspaceProfond } from "@/lib/fr-typo";

// Lot D11c : textes de l'interface avec la typographie de l'espace (espaces insécables, `frEspace`).
const T = frEspaceProfond(TEXTES_AUJOURDHUI);

/**
 * « Ton premier pas » (architecture 4.4 état 1, maquette `aujourdhui.html#etat=pas`) : la seule
 * action principale du jour 1, un seul « Commencer ». Le lien de retour (résolu en base par la page)
 * est gardé dans ce navigateur pour les visites suivantes ; le résultat du quiz n'existe que dans
 * ce navigateur (`localStorage`, jamais sur le compte, 4.2). Premier rendu (serveur) : le signal du
 * serveur seul ; le quiz est appliqué après le montage.
 * Test N4 d'E5 : sous 640 px, la carte s'étire pour que le contenu du jour reste hors du premier
 * écran (hauteur de l'écran moins l'en-tête, la barre, le titre et les marges ; avec la ligne du
 * favori, d'autant plus).
 */
function lireStockage(cle: string): string | null {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
}

function lireOrigineGardee(): OrigineResolue | null {
  try {
    const o = JSON.parse(lireStockage(CLE_ORIGINE) ?? "null") as OrigineResolue | null;
    return o && typeof o.titre === "string" && typeof o.href === "string" && o.href.startsWith("/") ? o : null;
  } catch {
    return null;
  }
}

export function PremierPas({
  origine,
  entrees,
}: {
  origine: OrigineResolue | null;
  entrees: readonly EntreeDisponible[];
  /** Bandeau du favori au-dessus : ne change plus la hauteur de la carte (relecture nav s24, ux F6c). */
  avecBandeau?: boolean;
}) {
  const [pas, setPas] = useState(() => choisirPremierPas(origine, null, entrees, T.premierPas.sceneParDefaut));

  useEffect(() => {
    if (origine) {
      try {
        localStorage.setItem(CLE_ORIGINE, JSON.stringify(origine));
      } catch {
        // Stockage refusé (navigation privée) : le signal vaut pour cette visite seulement.
      }
    }
    const signal = origine ?? lireOrigineGardee();
    setPas(choisirPremierPas(signal, lireProfilQuiz(lireStockage(CLE_QUIZ)), entrees, T.premierPas.sceneParDefaut));
  }, [origine, entrees]);

  // Refonte s25 (spec design §4 Z1) : l'action du jour du nouvel abonné, carte teintée dominante. v7 tour 12 : la scène
  // de la fiche (quiz ou scène par défaut) à gauche du bouton dès 768 px.
  const scene = sceneDuPremierPas(pas, entrees);
  return (
    <ActionDuJour
      idTitre="premier-pas-titre"
      data-source={pas.source}
      etiquette={T.premierPas.eyebrow}
      duree={pas.minutes !== null ? T.premierPas.duree(pas.minutes) : null}
      titre={pas.titre}
      action={{ href: pas.href, libelle: T.premierPas.bouton }}
      scene={scene ? frEspace(scene) : null}
    />
  );
}

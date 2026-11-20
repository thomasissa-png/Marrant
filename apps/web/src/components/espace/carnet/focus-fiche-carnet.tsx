"use client";

import { useEffect } from "react";
import { ID_TITRE_FICHE_CARNET } from "@/lib/espace/carnet-liste";

/** Fiche ouverte par une navigation dans la page (liste, « Situation suivante ») : focus au titre à son arrivée. */
let focusDemande = false;

export function demanderFocusFicheCarnet() {
  focusDemande = true;
}

/**
 * Posé dans le panneau du carnet de l'abonné : à son montage (fiche arrivée, squelette de chargement passé), le titre de
 * la fiche reçoit le focus si l'ouverture vient de la page, sans défilement (le défilement est réglé par
 * `CarnetListeDetail`). À froid (adresse ouverte directement), rien ne bouge.
 */
export function FocusFicheCarnet({ numero }: { numero: number }) {
  useEffect(() => {
    if (!focusDemande) return;
    focusDemande = false;
    document.getElementById(ID_TITRE_FICHE_CARNET)?.focus({ preventScroll: true });
  }, [numero]);
  return null;
}

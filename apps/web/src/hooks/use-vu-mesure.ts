"use client";

import { useEffect, useRef } from "react";

/** Part minimale visible (de l'élément, ou de la hauteur d'écran pour un élément plus grand). */
const PART_VISIBLE = 0.5;
/** Durée de présence à l'écran avant de compter l'élément comme vu. */
const DUREE_VU_MS = 1_000;

/**
 * s24 mesure (lot 0) : appelle `onVu` une seule fois quand l'élément rendu par `cible()` reste au
 * moins à moitié visible pendant 1 s (IntersectionObserver). N'ajoute rien au rendu ni au HTML.
 * `cle` relance l'observation quand la cible change (page, liste). Sans IntersectionObserver
 * (anciens navigateurs, tests) : rien.
 */
export function useVuMesure(cible: () => Element | null, actif: boolean, cle: string, onVu: () => void): void {
  const rappel = useRef(onVu);
  const lireCible = useRef(cible);
  useEffect(() => {
    rappel.current = onVu;
    lireCible.current = cible;
  });

  useEffect(() => {
    if (!actif || typeof IntersectionObserver === "undefined") return;
    const element = lireCible.current();
    if (!element) return;
    let minuteur: ReturnType<typeof setTimeout> | null = null;
    const observateur = new IntersectionObserver(
      (entrees) => {
        const hauteurEcran = typeof window !== "undefined" ? window.innerHeight : 0;
        const visible = entrees.some(
          (e) =>
            e.isIntersecting &&
            (e.intersectionRatio >= PART_VISIBLE || (hauteurEcran > 0 && e.intersectionRect.height >= hauteurEcran * PART_VISIBLE)),
        );
        if (visible && minuteur === null) {
          minuteur = setTimeout(() => {
            observateur.disconnect();
            rappel.current();
          }, DUREE_VU_MS);
        } else if (!visible && minuteur !== null) {
          clearTimeout(minuteur);
          minuteur = null;
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    observateur.observe(element);
    return () => {
      observateur.disconnect();
      if (minuteur !== null) clearTimeout(minuteur);
    };
  }, [actif, cle]);
}


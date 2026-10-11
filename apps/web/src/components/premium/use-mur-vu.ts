"use client";

import { useEffect, useRef } from "react";
import { trackUmami } from "@/lib/umami";

/** Murs Premium mesurés (audit parcours s16, reco 17). */
export type MurType = "vannes" | "conseils" | "videos";

/**
 * Émet `mur-vu` une seule fois par montage, au moment où le mur (cartes
 * verrouillées + offre) devient visible. `src` = page du mur.
 */
export function useMurVu(visible: boolean, type: MurType): void {
  const sent = useRef(false);
  useEffect(() => {
    if (!visible || sent.current) return;
    sent.current = true;
    trackUmami("mur-vu", { type, src: type });
  }, [visible, type]);
}

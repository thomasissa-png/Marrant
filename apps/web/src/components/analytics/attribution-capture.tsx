"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

/**
 * Lit `utm_source`/`utm_content` (ou `origine`/`contenu` après une bascule
 * depuis une application) à chaque changement de page et les garde en
 * sessionStorage (lib/attribution). Monté une fois dans le layout racine ;
 * lit window.location (pas de useSearchParams, qui ferait basculer tout le
 * layout en rendu client, ni de middleware : les pages restent prérendues).
 */
export function AttributionCapture() {
  const pathname = usePathname();
  useEffect(() => {
    captureAttribution(window.location.search);
  }, [pathname]);
  return null;
}

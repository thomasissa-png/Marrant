"use client";

import { useEffect, useState } from "react";
import { detectInAppBrowser, type InAppBrowser } from "@/lib/in-app-browser";

/**
 * Navigateur intégré détecté au montage (agent utilisateur lu côté client).
 * `null` au rendu serveur et avant le montage : la page prérendue est la même
 * pour tous (bouton Google actif), seul ce bouton change ensuite.
 */
export function useInAppBrowser(): InAppBrowser | null {
  const [browser, setBrowser] = useState<InAppBrowser | null>(null);
  useEffect(() => {
    setBrowser(detectInAppBrowser(window.navigator.userAgent));
  }, []);
  return browser;
}

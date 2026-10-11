"use client";

import { useEffect } from "react";
import {
  AUTH_RETURN_LOGIN_GOOGLE,
  AUTH_RETURN_PARAM,
  AUTH_RETURN_SIGNUP_GOOGLE,
  sanitizeSignupSrc,
} from "@/lib/auth-links";
import { trackUmamiWhenReady } from "@/lib/umami";

/**
 * Retour de Google (NextAuth redirige vers la destination choisie, avec
 * `?auth=inscription-google|connexion-google&src=…`) : mesure Umami puis
 * nettoyage de l'URL (history.replaceState, sans rechargement).
 * Monté une fois dans le layout racine ; lit window.location (pas de
 * useSearchParams, qui ferait basculer tout le layout en rendu client).
 */
export function AuthReturnTracker() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const marker = url.searchParams.get(AUTH_RETURN_PARAM);
    if (marker !== AUTH_RETURN_SIGNUP_GOOGLE && marker !== AUTH_RETURN_LOGIN_GOOGLE) return;

    if (marker === AUTH_RETURN_SIGNUP_GOOGLE) {
      const src = sanitizeSignupSrc(url.searchParams.get("src"));
      trackUmamiWhenReady("inscription-reussie", { methode: "google", src: src ?? "direct" });
    } else {
      trackUmamiWhenReady("connexion-reussie", { methode: "google" });
    }

    url.searchParams.delete(AUTH_RETURN_PARAM);
    url.searchParams.delete("src");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  return null;
}

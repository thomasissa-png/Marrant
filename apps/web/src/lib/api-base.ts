/**
 * Helper API base URL pour supporter le mode Capacitor (mobile native).
 *
 * En mode web : retourne string vide → fetch relatifs (`/api/...`) fonctionnent normalement.
 * En mode mobile (Capacitor native) : prefix avec l'URL de production car le webview
 * sert le bundle statique local et n'a pas de backend.
 *
 * Côté serveur (SSR/SSG, API routes) : toujours string vide.
 */

const PROD_API_URL = "https://deviens-marrant.fr";

let cachedIsNative: boolean | null = null;

function detectNative(): boolean {
  if (cachedIsNative !== null) return cachedIsNative;
  if (typeof window === "undefined") {
    cachedIsNative = false;
    return false;
  }
  try {
    // Import dynamique pour éviter de casser le SSR / le build pure web
    // eslint-disable-next-line
    const { Capacitor } = require("@capacitor/core");
    cachedIsNative = Capacitor?.isNativePlatform?.() ?? false;
  } catch {
    cachedIsNative = false;
  }
  return cachedIsNative ?? false;
}

/**
 * Retourne le base URL à prepend aux fetch relatifs.
 * - Web : "" (string vide, fetch reste relatif)
 * - Mobile native : URL absolue de production
 * - SSR/SSG : "" (toujours vide)
 */
export function apiBase(): string {
  if (typeof window === "undefined") return "";
  return detectNative() ? PROD_API_URL : "";
}

/**
 * Helper de fetch typé qui prepend automatiquement le base URL et inclut les credentials.
 *
 * Usage :
 *   const res = await api("/api/favorites", { method: "POST", body: JSON.stringify(data) });
 *
 * En mode mobile, les cookies cross-site (NextAuth) nécessitent `SameSite=None; Secure`.
 * Voir docs/mobile/fetch-audit.md pour les préalables backend.
 */
export async function api(path: string, init?: RequestInit): Promise<Response> {
  const url = `${apiBase()}${path}`;
  return fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers ?? {}),
      "Content-Type": init?.body ? "application/json" : "",
    },
  });
}

/**
 * Détecte si l'app tourne en mode native mobile (Capacitor).
 * Utiliser pour masquer/afficher des composants conditionnels (CTA Stripe en mobile, etc.)
 */
export function isMobileNative(): boolean {
  return detectNative();
}

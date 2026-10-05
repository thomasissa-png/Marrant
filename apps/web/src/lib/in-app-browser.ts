/**
 * Détection du navigateur intégré d'une application (Instagram, Facebook,
 * LinkedIn, X) par l'agent utilisateur, CÔTÉ CLIENT au montage (v5 §2.4) :
 * /register et /login restent prérendus, sans middleware ni `Vary`.
 * Marqueurs connus [HYPOTHÈSE : à confirmer sur appareil, v5 §2.6] :
 * Instagram `Instagram`, Facebook et Messenger `FBAN`/`FBAV`/`FB_IAB`/`FBIOS`,
 * LinkedIn `LinkedInApp`, X `Twitter` (dont `TwitterAndroid`). Quand X ouvre
 * un onglet système, l'agent est celui de Safari ou Chrome : rien à détecter.
 */
import { GOOGLE_BLOQUE_PAR_APP, type InAppName } from "@/config/in-app-browser";

export interface InAppBrowser {
  /** Application détectée, ou `null` dans un navigateur ordinaire. */
  app: InAppName | null;
  /** Google refuse la connexion dans cette application (bouton désactivé). */
  googleBloque: boolean;
  ios: boolean;
  android: boolean;
}

const MARKERS: ReadonlyArray<[InAppName, RegExp]> = [
  ["instagram", /\bInstagram\b/i],
  ["facebook", /FBAN\/|FBAV\/|FB_IAB\/|FBIOS/],
  ["linkedin", /LinkedInApp/i],
  ["x", /\bTwitter/i],
];

export function detectInAppBrowser(userAgent: string | null | undefined): InAppBrowser {
  const ua = typeof userAgent === "string" ? userAgent : "";
  const ios = /iPhone|iPad|iPod/i.test(ua);
  const android = /Android/i.test(ua);
  const app = MARKERS.find(([, re]) => re.test(ua))?.[0] ?? null;
  return { app, googleBloque: app ? GOOGLE_BLOQUE_PAR_APP[app] : false, ios, android };
}

/**
 * Lien de bascule vers le navigateur du téléphone. Android : URL `intent:`
 * qui ouvre Chrome, avec repli sur l'URL https si Chrome manque. Ailleurs :
 * l'URL https telle quelle (sur iOS une vue intégrée ne s'ouvre pas ailleurs
 * par un lien : la copie du lien est l'action principale).
 */
export function buildOpenInBrowserHref(absoluteUrl: string, android: boolean): string {
  if (!android) return absoluteUrl;
  let url: URL;
  try {
    url = new URL(absoluteUrl);
  } catch {
    return absoluteUrl;
  }
  if (url.protocol !== "https:") return absoluteUrl;
  const fallback = encodeURIComponent(absoluteUrl);
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
}

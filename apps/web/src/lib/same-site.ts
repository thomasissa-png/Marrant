/**
 * Contrôle d'origine des routes qui changent un état (lot H, 07/10/2026).
 *
 * En plus du cookie de session SameSite=Lax : une requête envoyée par un
 * navigateur depuis un autre site est refusée (403).
 *  1. `Origin` présent : accepté s'il vaut l'origine de la requête, celle de
 *     NEXTAUTH_URL, ou une origine de l'appli mobile Capacitor
 *     (`capacitor://localhost` iOS, `https://localhost` Android, D8 : l'appli
 *     appelle l'API de prod via `lib/api-base.ts`) ; sinon refus.
 *  2. `Origin: null` (origine opaque) : accepté SEULEMENT si `Sec-Fetch-Site`
 *     vaut `same-origin`. Un navigateur envoie `Origin: null` sur un POST de
 *     formulaire du même site quand la page a une politique `no-referrer` (QA
 *     s21 B1, /lettre/confirmer) ; `Sec-Fetch-Site` est posé par le navigateur
 *     lui-même (en-tête interdit au script d'une page) et vaut `cross-site`
 *     pour une page d'un autre site ou une iframe isolée (sandbox) : un autre
 *     site ne peut donc pas passer par cette porte.
 *  3. Sans `Origin` : `Sec-Fetch-Site` = `cross-site` → refus ; autre valeur
 *     ou en-tête absent (client hors navigateur, sans cookie du visiteur) → accepté.
 */
import { NextResponse } from "next/server";
import { TEXTES_SECURITE } from "@/config/textes/securite";

export const ORIGINES_APPLI_MOBILE: readonly string[] = ["capacitor://localhost", "https://localhost"];

function origineDe(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function isSameSiteRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (origin && origin !== "null") {
    const autorisees = [origineDe(request.url), origineDe(process.env.NEXTAUTH_URL), ...ORIGINES_APPLI_MOBILE];
    return autorisees.includes(origin);
  }
  if (origin === "null") return request.headers.get("sec-fetch-site") === "same-origin";
  return request.headers.get("sec-fetch-site") !== "cross-site";
}

/** Réponse 403 si la requête vient d'un autre site, null sinon. */
export function refuserSiAutreSite(request: Request, route: string): NextResponse | null {
  if (isSameSiteRequest(request)) return null;
  console.warn(
    `[same-site] ${route} refusée : origin=${request.headers.get("origin") ?? "-"}, sec-fetch-site=${request.headers.get("sec-fetch-site") ?? "-"}`,
  );
  return NextResponse.json({ error: TEXTES_SECURITE.origineRefusee, code: "origine-refusee" }, { status: 403 });
}

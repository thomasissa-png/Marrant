/**
 * Mesure du widget (s22, revue M1) : un affichage = un événement Umami
 * « widget-affichage » envoyé PAR LE SERVEUR depuis /embed/vanne-du-jour,
 * avec pour seule donnée le domaine hôte (origine du Referer).
 *
 * - Aucun cookie, aucun script Umami chez le visiteur, aucune écriture en base.
 * - Aucune donnée du visiteur transmise : ni IP (la requête part du Worker), ni
 *   navigateur (User-Agent fixe du widget), ni page complète de l'hôte.
 * - Non bloquant : sous Cloudflare Workers, `ctx.waitUntil` garde l'envoi en vie
 *   après la réponse ; ailleurs (Node, tests), rien n'est envoyé.
 * - Exclus : nos domaines et environnements (WIDGET_DOMAINES_NON_COMPTES, dont
 *   l'aperçu de la page du programme), robots déclarés, identifiant Umami absent
 *   ou factice.
 */
import { WIDGET_DOMAINES_NON_COMPTES, WIDGET_EMBED_PATH, WIDGET_UTM_CONTENT_INCONNU } from "@/config/widget-vanne-du-jour";
import { isCloudflareWorkers } from "@/lib/runtime-env";
import { matchesDomaine } from "@/lib/widget/vanne-du-jour";

export const UMAMI_SEND_URL = "https://cloud.umami.is/api/send";
export const WIDGET_EVENT_AFFICHAGE = "widget-affichage";
/** Umami ignore les requêtes sans User-Agent de navigateur : chaîne fixe, identique pour tous les affichages. */
export const WIDGET_MESURE_USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 DeviensMarrantWidget/1";
const TIMEOUT_MS = 5000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ROBOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|embedly|curl|wget|python|go-http/i;

/** Identifiant du site Umami, seulement s'il a la forme d'un vrai UUID (pas de valeur d'exemple). */
export function umamiWebsiteId(env: Record<string, string | undefined> = process.env): string | null {
  const id = env.UMAMI_WEBSITE_ID || env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "";
  return UUID.test(id) && !/^x+-/i.test(id) ? id : null;
}

/** Faut-il compter cet affichage ? Domaine inconnu compté sous « inconnu » (total des affichages). */
export function doitCompterAffichage(host: string | null, userAgent: string | null): boolean {
  if (!userAgent || ROBOT.test(userAgent)) return false;
  return !matchesDomaine(host, WIDGET_DOMAINES_NON_COMPTES);
}

/** Corps de l'événement : le domaine hôte, rien d'autre. */
export function corpsAffichage(websiteId: string, host: string | null, theme: string) {
  const domaine = host ?? WIDGET_UTM_CONTENT_INCONNU;
  return {
    type: "event",
    payload: {
      website: websiteId,
      hostname: domaine,
      url: WIDGET_EMBED_PATH,
      language: "fr",
      name: WIDGET_EVENT_AFFICHAGE,
      data: { domaine, theme },
    },
  };
}

export async function envoyerAffichage(websiteId: string, host: string | null, theme: string): Promise<boolean> {
  try {
    const res = await fetch(UMAMI_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": WIDGET_MESURE_USER_AGENT },
      body: JSON.stringify(corpsAffichage(websiteId, host, theme)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Compte un affichage sans retarder la réponse (Workers seulement). */
export function compterAffichage(host: string | null, userAgent: string | null, theme: string): void {
  if (!isCloudflareWorkers() || !doitCompterAffichage(host, userAgent)) return;
  const websiteId = umamiWebsiteId();
  if (!websiteId) return;
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare") as typeof import("@opennextjs/cloudflare");
    getCloudflareContext().ctx.waitUntil(envoyerAffichage(websiteId, host, theme));
  } catch {
    // Hors contexte de requête Workers : pas de comptage (jamais d'envoi non suivi).
  }
}

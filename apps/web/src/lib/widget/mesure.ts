/**
 * Mesure du widget (s22, itération 3) : un affichage = un point de données
 * Cloudflare Workers Analytics Engine, écrit par le Worker depuis
 * /embed/vanne-du-jour, avec pour SEULE donnée le domaine hôte (origine du
 * Referer, « inconnu » sans Referer).
 *
 * - Aucun tiers (plus d'envoi Umami : revues QA V2, @reviewer N1, N2, N7) :
 *   la donnée reste chez Cloudflare, déjà prestataire du site.
 * - Aucune donnée du visiteur écrite : ni IP, ni User-Agent, ni chemin ou
 *   paramètre de la page hôte, ni thème. Le User-Agent est seulement LU pour
 *   écarter les robots déclarés, jamais enregistré.
 * - Jamais bloquant : `writeDataPoint` ne renvoie rien et n'est pas attendu ;
 *   une erreur est avalée sans journal.
 * - Liaison absente (hors Workers, tests, compte sans Analytics Engine) :
 *   no-op silencieux.
 * - Exclus : nos domaines et environnements (WIDGET_DOMAINES_NON_COMPTES, dont
 *   l'aperçu de la page du programme), robots déclarés, requêtes sans User-Agent.
 *
 * Disponibilité : offres Workers Free (100 000 points écrits par jour) et Paid
 * (https://developers.cloudflare.com/analytics/analytics-engine/pricing).
 * Lecture : API SQL d'Analytics Engine, requêtes dans REPLIT_ACTIONS.md.
 */
import { WIDGET_DOMAINES_NON_COMPTES, WIDGET_UTM_CONTENT_INCONNU } from "@/config/widget-vanne-du-jour";
import { isCloudflareWorkers } from "@/lib/runtime-env";
import { matchesDomaine } from "@/lib/widget/vanne-du-jour";

/** Nom de la liaison déclarée dans wrangler.jsonc (`analytics_engine_datasets`). */
export const WIDGET_AE_BINDING = "WIDGET_AFFICHAGES";
/** Jeu de données Analytics Engine (créé par Cloudflare à la première écriture). */
export const WIDGET_AE_DATASET = "widget_vanne_du_jour";

const ROBOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|embedly|curl|wget|python|go-http/i;

/** Sous-ensemble de l'API Analytics Engine utilisé ici. */
export interface AnalyticsEngineDataset {
  writeDataPoint(point: { blobs?: string[]; doubles?: number[]; indexes?: string[] }): void;
}

/** Faut-il compter cet affichage ? Domaine inconnu compté sous « inconnu » (total des affichages). */
export function doitCompterAffichage(host: string | null, userAgent: string | null): boolean {
  if (!userAgent || ROBOT.test(userAgent)) return false;
  return !matchesDomaine(host, WIDGET_DOMAINES_NON_COMPTES);
}

/** Point de données : le domaine hôte, rien d'autre (blob1 pour la lecture, index pour l'échantillonnage). */
export function pointAffichage(host: string | null): { blobs: string[]; indexes: string[] } {
  const domaine = (host ?? WIDGET_UTM_CONTENT_INCONNU).slice(0, 96);
  return { blobs: [domaine], indexes: [domaine] };
}

/** Liaison Analytics Engine du Worker, ou `null` (hors Workers, hors requête, liaison absente). */
export function datasetAffichages(): AnalyticsEngineDataset | null {
  if (!isCloudflareWorkers()) return null;
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare") as typeof import("@opennextjs/cloudflare");
    const ds = (getCloudflareContext().env as unknown as Record<string, unknown>)[WIDGET_AE_BINDING] as
      | AnalyticsEngineDataset
      | undefined;
    return ds && typeof ds.writeDataPoint === "function" ? ds : null;
  } catch {
    return null;
  }
}

/** Compte un affichage sans retarder la réponse ; no-op silencieux sans liaison. */
export function compterAffichage(host: string | null, userAgent: string | null): void {
  if (!doitCompterAffichage(host, userAgent)) return;
  const ds = datasetAffichages();
  if (!ds) return;
  try {
    ds.writeDataPoint(pointAffichage(host));
  } catch {
    // Écriture refusée (quota, panne) : sans effet sur la page, sans journal.
  }
}

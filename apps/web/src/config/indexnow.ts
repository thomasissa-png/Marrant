/**
 * IndexNow, changements sur tout le site (s23, crawl Ahrefs du 28/10).
 *
 * Un bloc commun (prix, bouton, pied de page) modifie toutes les pages sans
 * toucher leur lastmod : le cron hebdo (lib/indexnow-sitemap) ne les soumettait pas.
 *
 * À METTRE À JOUR À LA MAIN (AAAA-MM-JJ, date du déploiement) :
 * - `SITE_WIDE_CHANGE_AT` : lors d'un déploiement qui touche un bloc commun. Pendant
 *   8 jours, le cron du lundi soumet alors TOUTES les URL du sitemap.
 * - `SITE_WIDE_SUBMITTED_AT` : seulement si toutes les URL ont été soumises à la main
 *   après ce changement. Date égale ou postérieure à `SITE_WIDE_CHANGE_AT` = déjà fait,
 *   le cron garde son comportement habituel (lastmod de moins de 8 jours).
 *
 * Valeurs initiales : 428 URL soumises à la main le 31/10/2026 (HTTP 200), le jour
 * du dernier changement commun connu : le cron du 02/11 ne les resoumet pas.
 */
export const SITE_WIDE_CHANGE_AT = "2026-10-31";
export const SITE_WIDE_SUBMITTED_AT: string | null = "2026-10-31";

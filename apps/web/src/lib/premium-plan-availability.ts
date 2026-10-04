/**
 * Disponibilité des formules Premium, lue au RUNTIME côté serveur (décision
 * Thomas 04/10/2026). Aucun SDK Stripe ici : importable par les layouts, les
 * routes llms et le checkout sans alourdir leur bundle.
 *
 * Tant que le secret STRIPE_PREMIUM_ANNUAL_PRICE_ID est absent (ou un
 * placeholder), l'annuel n'existe nulle part : ni /abonnement, ni JSON-LD,
 * ni FAQ, ni llms.txt, et le checkout annuel répond 503. Le jour où le secret
 * est posé sur le Worker, l'annuel apparaît sans redéploiement de code.
 */
import type { PremiumPlan } from "@/config/premium";

/** Secret serveur portant l'id du prix Stripe de chaque formule. */
export const PREMIUM_PRICE_ENV: Record<PremiumPlan, string> = {
  monthly: "STRIPE_PREMIUM_PRICE_ID",
  annual: "STRIPE_PREMIUM_ANNUAL_PRICE_ID",
};

/**
 * Id du prix Stripe de la formule, lu au runtime.
 * - annuel (strict) : valeur vide, placeholder (.env.example « price_XXXX… »)
 *   ou autre chose qu'un id `price_` → null ;
 * - mensuel : comportement historique conservé (valeur brute transmise à
 *   Stripe, seule une valeur vide donne null), pour ne rien changer au
 *   checkout des abonnés actuels.
 */
export function getPremiumPriceId(plan: PremiumPlan): string | null {
  const id = (process.env[PREMIUM_PRICE_ENV[plan]] ?? "").trim();
  if (!id) return null;
  if (plan === "monthly") return id;
  if (!id.startsWith("price_") || /X{4,}/.test(id)) return null;
  return id;
}

/** Vrai seulement si le prix Stripe annuel est configuré côté serveur. */
export function isAnnualPlanAvailable(): boolean {
  return getPremiumPriceId("annual") !== null;
}

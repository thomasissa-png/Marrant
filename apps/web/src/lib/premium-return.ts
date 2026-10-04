/**
 * Retour à l'intention d'origine après paiement Premium (décision Thomas, 03/10/2026).
 *
 * Le paramètre `returnTo` voyage : paywall (ex. étape 2 d'un parcours) →
 * /abonnement → POST /api/stripe/checkout → success_url Stripe →
 * /abonnement/success → destination finale. Il est validé à CHAQUE étape :
 * chemin interne uniquement (anti open-redirect, même règle que les callbacks
 * d'auth), jamais une page de paiement ni une API.
 */
import { sanitizeCallbackUrl } from "@/lib/safe-callback";
import {
  type PremiumPlan,
  PREMIUM_DEFAULT_RETURN,
  PREMIUM_WELCOME_PARAM,
  PREMIUM_WELCOME_VALUE,
} from "@/config/premium";

const FORBIDDEN_PREFIXES = ["/abonnement", "/api/", "/login", "/register"];

export function sanitizeReturnTo(raw: string | null | undefined): string | null {
  const safe = sanitizeCallbackUrl(raw);
  if (!safe) return null;
  const pathOnly = safe.split(/[?#]/)[0];
  if (pathOnly === "/api" || FORBIDDEN_PREFIXES.some((p) => pathOnly.startsWith(p))) return null;
  return safe;
}

/** Destination après paiement : l'intention d'origine, sinon /parcours, avec le message de bienvenue. */
export function getPostPaymentDestination(rawReturnTo: string | null | undefined): string {
  const target = sanitizeReturnTo(rawReturnTo) ?? PREMIUM_DEFAULT_RETURN;
  const [beforeHash, hash] = target.split("#");
  const separator = beforeHash.includes("?") ? "&" : "?";
  const withParam = `${beforeHash}${separator}${PREMIUM_WELCOME_PARAM}=${PREMIUM_WELCOME_VALUE}`;
  return hash !== undefined ? `${withParam}#${hash}` : withParam;
}

/**
 * `/abonnement` avec l'intention mémorisée (pour les liens et le callback
 * d'inscription). `plan=annual` conserve le choix de l'annuel après inscription
 * (le mensuel, par défaut, n'ajoute rien).
 */
export function buildAbonnementUrl(
  rawReturnTo: string | null | undefined,
  plan: PremiumPlan = "monthly",
): string {
  const safe = sanitizeReturnTo(rawReturnTo);
  const params = [
    ...(safe ? [`returnTo=${encodeURIComponent(safe)}`] : []),
    ...(plan === "annual" ? ["plan=annual"] : []),
  ];
  return params.length > 0 ? `/abonnement?${params.join("&")}` : "/abonnement";
}

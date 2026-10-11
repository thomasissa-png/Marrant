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
  src?: string | null,
): string {
  const safe = sanitizeReturnTo(rawReturnTo);
  // `src` (source du clic, même règle que les liens d'inscription) : relayé
  // par /abonnement jusqu'à /register pour la mesure du tunnel.
  const safeSrc = typeof src === "string" && /^[a-z0-9][a-z0-9-]{0,119}$/.test(src) ? src : null;
  const params = [
    ...(safe ? [`returnTo=${encodeURIComponent(safe)}`] : []),
    ...(plan === "annual" ? ["plan=annual"] : []),
    ...(safeSrc ? [`src=${safeSrc}`] : []),
  ];
  return params.length > 0 ? `/abonnement?${params.join("&")}` : "/abonnement";
}

/** `auto=1` : /abonnement ouvre le paiement tout seul (une fois, retiré de l'URL avant l'appel). */
export const AUTO_CHECKOUT_PARAM = "auto";
export const AUTO_CHECKOUT_VALUE = "1";

/** Formule demandée à l'inscription : `?plan=annual` sur /register ou dans son callbackUrl. */
export function readSignupPlan(
  rawPlan: string | null | undefined,
  rawCallback: string | null | undefined,
): PremiumPlan {
  if (rawPlan === "annual") return "annual";
  const safe = sanitizeCallbackUrl(rawCallback);
  if (!safe) return "monthly";
  const query = safe.split("#")[0].split("?")[1] ?? "";
  return new URLSearchParams(query).get("plan") === "annual" ? "annual" : "monthly";
}

/**
 * Destination après une INSCRIPTION (page /register, e-mail ou Google).
 * Plus de compte gratuit (s15, spec §2.3) : le compte sert à s'abonner, donc
 * on enchaîne sur le paiement, `/abonnement?…&auto=1` (Stripe s'ouvre seul).
 * - callback `/abonnement?…` (formé par buildAbonnementUrl) : ses paramètres
 *   (`returnTo`, `plan`) sont gardés ;
 * - autre callback d'intention (`/parcours/repartie`, `/vannes`…) : conservé
 *   en `returnTo`, la personne y revient après paiement ;
 * - pas de callback, l'accueil ou `/onboarding` : aucun `returnTo` (après
 *   paiement : /parcours et message de bienvenue).
 */
export function getPostSignupRedirect(
  rawCallback: string | null | undefined,
  plan: PremiumPlan = readSignupPlan(null, rawCallback),
): string {
  const safe = sanitizeCallbackUrl(rawCallback);
  const [path, query = ""] = (safe ?? "").split("#")[0].split("?");
  let params: URLSearchParams;
  if (path === "/abonnement") {
    params = new URLSearchParams(query);
    params.delete(AUTO_CHECKOUT_PARAM);
    params.delete("upgrade");
    const returnTo = sanitizeReturnTo(params.get("returnTo"));
    params.delete("returnTo");
    if (returnTo) params.set("returnTo", returnTo);
  } else {
    params = new URLSearchParams();
    const intent = safe && path !== "/" && !path.startsWith("/onboarding") ? sanitizeReturnTo(safe) : null;
    if (intent) params.set("returnTo", intent);
  }
  params.delete("plan");
  if (plan === "annual") params.set("plan", "annual");
  params.set(AUTO_CHECKOUT_PARAM, AUTO_CHECKOUT_VALUE);
  return `/abonnement?${params.toString()}`;
}
